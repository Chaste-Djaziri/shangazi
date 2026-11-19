// src/newsletter/resend.ts
import "server-only";
import { marked, Renderer } from "marked";

const API = "https://api.resend.com";

export type ResendContact = {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
  unsubscribed?: boolean;
  created_at?: string;
};

export type ResendSegment = { id: string; name: string; created_at?: string };
export type ResendBroadcast = { id: string; name?: string; subject?: string; status?: string; created_at?: string; segment_id?: string };

export class ResendApiError extends Error {
  constructor(message: string, public readonly status: number) { super(message); }
}

export async function resendRequest<T>(path: string, init: RequestInit = {}): Promise<T> {
  const apiKey = process.env.RESEND_MARKETING_API_KEY || process.env.RESEND_API_KEY;
  if (!apiKey) throw new ResendApiError("Resend marketing API key is not configured.", 503);
  const response = await fetch(API + path, {
    ...init,
    cache: "no-store",
    headers: {
      Authorization: `Bearer ${apiKey}`,
      ...(init.body ? { "Content-Type": "application/json" } : {}),
      ...init.headers,
    },
  });
  const body: unknown = await response.json().catch(() => null);
  if (!response.ok) {
    const issue = body as { message?: string; error?: string } | null;
    const message = response.status === 401 || response.status === 403
      ? "Resend marketing access is unavailable. Configure a full-access RESEND_MARKETING_API_KEY."
      : issue?.message || issue?.error || "Resend request failed.";
    throw new ResendApiError(message, response.status);
  }
  return body as T;
}

export function newsletterSegmentId(): string {
  const id = process.env.RESEND_NEWSLETTER_SEGMENT_ID || process.env.RESEND_SEGMENT_ID;
  if (!id || !/^[0-9a-f-]{36}$/i.test(id)) throw new ResendApiError("Newsletter segment is not configured.", 503);
  return id;
}

export async function listNewsletterSubscribers(segmentId = newsletterSegmentId()) {
  const contacts: ResendContact[] = [];
  let after: string | undefined;
  // Paginate rather than silently returning only the first page.
  for (let page = 0; page < 100; page++) {
    const query = new URLSearchParams({ limit: "100" });
    if (after) query.set("after", after);
    const result = await resendRequest<{ data: ResendContact[]; has_more?: boolean }>(
      `/segments/${encodeURIComponent(segmentId)}/contacts?${query}`
    );
    const batch = result.data || [];
    contacts.push(...batch);
    if (!result.has_more || !batch.length) break;
    after = batch[batch.length - 1].id;
  }
  return contacts;
}

export async function subscribeToNewsletter(email: string, name: string) {
  const segmentId = newsletterSegmentId();
  const [firstName, ...lastName] = name.trim().split(/\s+/);

  // The global contact is keyed by email. Check its subscription state
  // before touching segment membership so opting out stays respected.
  let existing: ResendContact | null = null;
  try {
    existing = await resendRequest<ResendContact>(`/contacts/${encodeURIComponent(email)}`);
  } catch (error) {
    if (!(error instanceof ResendApiError) || error.status !== 404) throw error;
  }
  if (existing?.unsubscribed) {
    throw new ResendApiError(
      "This email is unsubscribed. Update your Resend subscription preferences before joining again.",
      409,
    );
  }
  if (existing) {
    await resendRequest(`/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`, {
      method: "POST",
    });
    return;
  }

  try {
    await resendRequest("/contacts", {
      method: "POST",
      body: JSON.stringify({
        email,
        first_name: firstName || undefined,
        last_name: lastName.join(" ") || undefined,
        unsubscribed: false,
        segments: [{ id: segmentId }],
      }),
    });
  } catch (error) {
    // A concurrent request may have just created this email address.
    if (!(error instanceof ResendApiError) || error.status !== 409) throw error;
    const contact = await resendRequest<ResendContact>(`/contacts/${encodeURIComponent(email)}`);
    if (contact.unsubscribed) throw new ResendApiError("This email is unsubscribed.", 409);
    await resendRequest(`/contacts/${encodeURIComponent(email)}/segments/${encodeURIComponent(segmentId)}`, {
      method: "POST",
    });
  }
}

export function newsletterHtml(title: string, content: string, mode: "broadcast" | "direct" = "broadcast") {
  const escapeHtml = (value: string) => value.replace(/[&<>"']/g, (char) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[char] || char);

  const safeExternalUrl = (value: string) => {
    try {
      const parsed = new URL(value);
      return parsed.protocol === "https:" || parsed.protocol === "http:" ? parsed.href : null;
    } catch { return null; }
  };

  // Escape raw HTML before Markdown parsing. The editor deliberately does not
  // permit executable HTML, script tags, or javascript: hyperlinks.
  const renderer = new Renderer();
  renderer.link = function ({ href, tokens }) {
    const text = this.parser.parseInline(tokens);
    const url = safeExternalUrl(href);
    return url ? `<a href="${escapeHtml(url)}" style="color:#a52d59;text-decoration:underline">${text}</a>` : text;
  };
  renderer.image = ({ href, text }) => {
    const url = safeExternalUrl(href);
    return url ? `<img src="${escapeHtml(url)}" alt="${escapeHtml(text)}" width="560" style="display:block;max-width:100%;height:auto;border-radius:10px;margin:18px 0">` : "";
  };
  const rendered = marked.parse(content.replace(/</g, "&lt;").replace(/>/g, "&gt;"), {
    renderer, async: false, gfm: true, breaks: true,
  }) as string;
  const styled = rendered
    .replace(/<p>/g, '<p style="margin:0 0 16px;line-height:1.75">')
    .replace(/<h1>/g, '<h1 style="font-size:28px;line-height:1.3;margin:28px 0 12px">')
    .replace(/<h2>/g, '<h2 style="font-size:22px;line-height:1.35;margin:25px 0 12px">')
    .replace(/<h3>/g, '<h3 style="font-size:18px;margin:22px 0 10px">')
    .replace(/<li>/g, '<li style="padding:3px 0;line-height:1.7">')
    .replace(/<blockquote>/g, '<blockquote style="border-left:3px solid #be1d51;margin:20px 0;padding:8px 18px;background:#faf4f6">');

  const greeting = mode === "broadcast" ? "Hello {{{FIRST_NAME|there}}}," : "Hello,";
  const footer = mode === "broadcast"
    ? 'You are receiving this email because you subscribed to Shangazi updates. <a href="{{{RESEND_UNSUBSCRIBE_URL}}}" style="color:#a52d59">Unsubscribe</a>'
    : 'Shangazi Emma Claudine · Kigali, Rwanda · <a href="https://shangazi.rw/contact" style="color:#a52d59">Contact us</a>';
  return `<!doctype html><html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"></head>
  <body style="margin:0;padding:30px 12px;background:#f5f5f5;color:#222;font-family:Arial,Helvetica,sans-serif">
  <table role="presentation" width="100%" cellpadding="0" cellspacing="0"><tr><td align="center">
  <table role="presentation" width="620" style="max-width:620px;width:100%;background:white;border-collapse:collapse">
  <tr><td style="height:5px;background:#be1d51"></td></tr>
  <tr><td style="padding:34px 32px 15px">
  <p style="margin:0 0 18px;font-size:12px;font-weight:bold;letter-spacing:2px;color:#8c3d5a">SHANGAZI EMMA CLAUDINE</p>
  <h1 style="font-size:29px;line-height:1.25;margin:0 0 20px">${escapeHtml(title)}</h1>
  <p style="font-size:15px;line-height:1.65;margin:0 0 20px">${greeting}</p>
  <div style="font-size:15px;line-height:1.7">${styled}</div></td></tr>
  <tr><td style="padding:25px 32px;background:#faf7f8;border-top:1px solid #eee;color:#666;font-size:12px;line-height:1.6">
  ${footer}
  </td></tr></table></td></tr></table></body></html>`;
}
