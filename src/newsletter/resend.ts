// src/newsletter/resend.ts
import "server-only";

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

export function newsletterHtml(title: string, content: string) {
  const escape = (value: string) => value.replace(/[&<>"']/g, (ch) => ({
    "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;",
  })[ch] || ch);
  const paragraphs = content.trim().split(/\n\s*\n/).map((paragraph) =>
    `<p style="margin:0 0 20px;line-height:1.7">${escape(paragraph).replace(/\n/g, "<br>")}</p>`
  ).join("");
  return `<!doctype html><html><body style="margin:0;background:#f5f5f5;padding:32px 12px;font-family:Arial,sans-serif;color:#262626">
    <div style="max-width:620px;margin:auto;background:white;padding:32px;border-radius:12px">
    <p style="font-size:13px;letter-spacing:2px;color:#777">SHANGAZI EMMA CLAUDINE</p>
    <h1 style="font-size:27px;line-height:1.3">${escape(title)}</h1>
    <p>Hello {{{contact.first_name|there}}},</p>${paragraphs}
    <hr style="border:0;border-top:1px solid #eee;margin:32px 0">
    <p style="font-size:12px;color:#666">You received this email because you subscribed to Shangazi updates.
    <a href="{{{RESEND_UNSUBSCRIBE_URL}}}">Unsubscribe</a></p></div></body></html>`;
}
