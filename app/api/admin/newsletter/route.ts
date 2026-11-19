// app/api/admin/newsletter/route.ts
import { NextResponse } from "next/server";
import { client } from "@/src/sanity/client";
import { isNewsletterAdmin } from "@/src/newsletter/admin";
import { listNewsletterSubscribers, newsletterHtml, newsletterSegmentId, resendRequest, ResendApiError, type ResendBroadcast, type ResendSegment, type ResendContact } from "@/src/newsletter/resend";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const unauthorized = () => NextResponse.json({ error: "Forbidden." }, { status: 403 });
const failure = (error: unknown) => {
  console.error("Newsletter admin operation failed", error instanceof ResendApiError ? error.status : "unknown");
  return NextResponse.json({ error: error instanceof ResendApiError ? error.message : "Unable to complete request." }, { status: error instanceof ResendApiError ? error.status : 502 });
};

export async function GET(request: Request) {
  if (!(await isNewsletterAdmin())) return unauthorized();
  try {
    const segmentId = newsletterSegmentId();
    const params = new URL(request.url).searchParams;
    const view = params.get("view");
    const id = params.get("segmentId") || "";
    const broadcastId = params.get("broadcastId") || "";
    const isUuid = (value: string) => /^[0-9a-f-]{36}$/i.test(value);

    if (view === "content") {
      const published = client.withConfig({ perspective: "published", token: undefined, useCdn: false });
      const items = await published.fetch<Array<{
        id: string; title: string; slug: string; kind: string;
        description?: string; image?: string; author?: string; publishedAt?: string;
        duration?: string; instructor?: string; lessonCount?: number; videoUrl?: string;
      }>>(`
        *[_type in ["post","video","course"] && isPublic == true && defined(slug.current)]
        | order(_updatedAt desc)[0...60] {
          "id": _id, title, "slug": slug.current, "kind": _type,
          "description": select(
            _type == "post" => coalesce(pt::text(body), content, ""),
            coalesce(description, "")
          ),
          "image": select(
            _type == "post" => image.asset->url,
            thumbnail.asset->url
          ),
          "author": select(_type == "post" => author, null),
          publishedAt,
          duration,
          instructor,
          "lessonCount": count(modules),
          videoUrl
        }
      `);
      return NextResponse.json({ items }, { headers: { "Cache-Control": "private, no-store" } });
    }
    if (view === "segment" && isUuid(id)) {
      const segment = await resendRequest<ResendSegment>(`/segments/${id}`);
      return NextResponse.json({ segment }, { headers: { "Cache-Control": "private, no-store" } });
    }
    if (view === "contacts" && isUuid(id)) {
      const contacts = await listNewsletterSubscribers(id);
      return NextResponse.json({ contacts }, { headers: { "Cache-Control": "private, no-store" } });
    }
    if (view === "broadcast" && isUuid(broadcastId)) {
      const broadcast = await resendRequest<ResendBroadcast>(`/broadcasts/${broadcastId}`);
      return NextResponse.json({ broadcast }, { headers: { "Cache-Control": "private, no-store" } });
    }
    if (view === "contact-segments") {
      const email = params.get("contactEmail") || "";
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return NextResponse.json({ error: "Invalid contact email." }, { status: 400 });
      const result = await resendRequest<{ data: ResendSegment[] }>(`/contacts/${encodeURIComponent(email)}/segments`);
      return NextResponse.json({ segments: result.data || [] }, { headers: { "Cache-Control": "private, no-store" } });
    }
    if (view || id || broadcastId) return NextResponse.json({ error: "Invalid view or identifier." }, { status: 400 });
    const [segments, contacts, broadcasts] = await Promise.all([
      resendRequest<{ data: ResendSegment[] }>("/segments?limit=100"),
      listNewsletterSubscribers(segmentId),
      resendRequest<{ data: ResendBroadcast[] }>("/broadcasts?limit=100"),
    ]);
    return NextResponse.json({
      segmentId,
      segments: segments.data || [],
      contacts,
      broadcasts: broadcasts.data || [],
    }, { headers: { "Cache-Control": "private, no-store" } });
  } catch (error) { return failure(error); }
}

export async function POST(request: Request) {
  if (!(await isNewsletterAdmin())) return unauthorized();
  const origin = request.headers.get("origin");
  if (origin && new URL(origin).host !== new URL(request.url).host) return unauthorized();
  const body = await request.json().catch(() => null) as {
    action?: string; subject?: string; title?: string; content?: string; broadcastId?: string; previewText?: string; format?: string;
    confirmation?: string; name?: string; segmentId?: string; email?: string;
  } | null;
  if (!body) return NextResponse.json({ error: "Invalid request." }, { status: 400 });
  try {
    const segmentId = newsletterSegmentId();
    const isUuid = (value?: string): value is string => Boolean(value && /^[0-9a-f-]{36}$/i.test(value));
    const safeSegmentId = body.segmentId;
    if (body.action === "create-segment") {
      const name = body.name?.trim() || "";
      if (name.length < 3 || name.length > 100) return NextResponse.json({ error: "Segment name must be between 3 and 100 characters." }, { status: 400 });
      const created = await resendRequest<{ id: string }>("/segments", {
        method: "POST", body: JSON.stringify({ name }),
      });
      return NextResponse.json({ success: true, id: created.id, message: "Segment created." });
    }
    if (body.action === "rename-segment") {
      if (!isUuid(safeSegmentId)) return NextResponse.json({ error: "Invalid segment." }, { status: 400 });
      const name = body.name?.trim() || "";
      if (name.length < 3 || name.length > 100) return NextResponse.json({ error: "Invalid segment name." }, { status: 400 });
      await resendRequest(`/segments/${safeSegmentId}`, { method: "PATCH", body: JSON.stringify({ name }) });
      return NextResponse.json({ success: true, message: "Segment renamed." });
    }
    if (body.action === "delete-segment") {
      if (!isUuid(safeSegmentId) || safeSegmentId === segmentId || body.confirmation !== "DELETE SEGMENT") {
        return NextResponse.json({ error: "The active newsletter segment cannot be removed; confirm other segment deletions explicitly." }, { status: 400 });
      }
      await resendRequest(`/segments/${safeSegmentId}`, { method: "DELETE" });
      return NextResponse.json({ success: true, message: "Segment deleted." });
    }
    if (body.action === "add-contact" || body.action === "remove-contact") {
      const email = body.email?.trim().toLowerCase() || "";
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(email)) return NextResponse.json({ error: "Invalid email." }, { status: 400 });
      if (body.action === "add-contact") {
        const contact = await resendRequest<ResendContact>(`/contacts/${encodeURIComponent(email)}`);
        if (contact.unsubscribed) return NextResponse.json({ error: "Contact previously unsubscribed. Do not override their choice." }, { status: 409 });
      }
      await resendRequest(`/contacts/${encodeURIComponent(email)}/segments/${segmentId}`, {
        method: body.action === "add-contact" ? "POST" : "DELETE",
      });
      return NextResponse.json({ success: true, message: body.action === "add-contact" ? "Contact added to newsletter segment." : "Contact removed from newsletter segment." });
    }
    if (body.action === "draft" || body.action === "update-draft") {
      const subject = body.subject?.trim() || "";
      const title = body.title?.trim() || subject;
      const content = body.content?.trim() || "";
      const previewText = body.previewText?.trim() || "";
      const target = body.segmentId || segmentId;
      if (!isUuid(target)) return NextResponse.json({ error: "Select a valid audience group." }, { status: 400 });
      if (!subject || subject.length > 200 || title.length > 200 || content.length < 5 || content.length > 50000 || previewText.length > 200) {
        return NextResponse.json({ error: "Enter a subject and valid message content." }, { status: 400 });
      }
      // Confirm the selected group exists on this account.
      await resendRequest<ResendSegment>(`/segments/${target}`);
      const html = newsletterHtml(title, content);
      const payload = {
        segment_id: target,
        name: `Shangazi · ${subject}`,
        from: process.env.RESEND_NEWSLETTER_FROM || "Shangazi <comms@shangazi.rw>",
        subject,
        preview_text: previewText || undefined,
        html,
        text: content,
      };
      if (body.action === "update-draft") {
        if (!isUuid(body.broadcastId)) return NextResponse.json({ error: "Invalid broadcast ID." }, { status: 400 });
        const existing = await resendRequest<ResendBroadcast>(`/broadcasts/${body.broadcastId}`);
        if (existing.status !== "draft") return NextResponse.json({ error: "Only draft broadcasts can be edited." }, { status: 409 });
        if (existing.segment_id && existing.segment_id !== target) return NextResponse.json({ error: "Changing the audience of an existing draft is not supported. Start a new broadcast." }, { status: 409 });
        await resendRequest(`/broadcasts/${body.broadcastId}`, { method: "PATCH", body: JSON.stringify(payload) });
        return NextResponse.json({ success: true, id: body.broadcastId, message: "Broadcast draft updated in Resend." });
      }
      const created = await resendRequest<{ id: string }>("/broadcasts", { method: "POST", body: JSON.stringify(payload) });
      return NextResponse.json({ success: true, id: created.id, message: "Broadcast draft saved in Resend. No emails were sent." });
    }
    if (body.action === "preview") {
      const title = (body.title || body.subject || "").trim();
      const content = body.content?.trim() || "";
      if (!title || !content || content.length > 50000) return NextResponse.json({ error: "Enter a title and message to preview." }, { status: 400 });
      return NextResponse.json({ html: newsletterHtml(title, content) });
    }
    if (body.action === "send") {
      // Explicit typed confirmation: never send merely by saving a draft.
      if (body.confirmation !== "SEND NEWSLETTER" || !body.broadcastId || !/^[0-9a-f-]{36}$/i.test(body.broadcastId)) {
        return NextResponse.json({ error: "Confirm SEND NEWSLETTER and select a valid broadcast." }, { status: 400 });
      }
      // Verify it belongs to our newsletter segment, is still a draft and cannot target another list.
      const broadcast = await resendRequest<{ id: string; segment_id?: string; status?: string }>(`/broadcasts/${body.broadcastId}`);
      if (broadcast.status !== "draft" || !broadcast.segment_id) {
        return NextResponse.json({ error: "Only draft broadcasts targeting the newsletter segment can be sent." }, { status: 409 });
      }
      await resendRequest<ResendSegment>(`/segments/${broadcast.segment_id}`);
      await resendRequest(`/broadcasts/${body.broadcastId}/send`, { method: "POST", body: "{}" });
      return NextResponse.json({ success: true, message: "Resend accepted the broadcast for delivery." });
    }
    return NextResponse.json({ error: "Unsupported operation." }, { status: 400 });
  } catch (error) { return failure(error); }
}
