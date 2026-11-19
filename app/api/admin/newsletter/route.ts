// app/api/admin/newsletter/route.ts
import { NextResponse } from "next/server";
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
    const id = params.get("segmentId");
    if (id) {
      if (!/^[0-9a-f-]{36}$/i.test(id)) return NextResponse.json({ error: "Invalid segment ID." }, { status: 400 });
      const segment = await resendRequest<ResendSegment>(`/segments/${id}`);
      return NextResponse.json({ segment }, { headers: { "Cache-Control": "private, no-store" } });
    }
    const memberEmail = params.get("contactEmail");
    if (memberEmail) {
      if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(memberEmail)) return NextResponse.json({ error: "Invalid contact email." }, { status: 400 });
      const result = await resendRequest<{ data: ResendSegment[] }>(`/contacts/${encodeURIComponent(memberEmail)}/segments`);
      return NextResponse.json({ segments: result.data || [] }, { headers: { "Cache-Control": "private, no-store" } });
    }
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
    action?: string; subject?: string; title?: string; content?: string; broadcastId?: string;
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
    if (body.action === "draft") {
      const subject = body.subject?.trim() || "";
      const title = body.title?.trim() || subject;
      const content = body.content?.trim() || "";
      if (!subject || subject.length > 200 || !title || title.length > 200 || content.length < 5 || content.length > 25000) {
        return NextResponse.json({ error: "Provide a subject, title and newsletter content." }, { status: 400 });
      }
      const created = await resendRequest<{ id: string }>("/broadcasts", {
        method: "POST",
        body: JSON.stringify({
          segment_id: segmentId,
          name: `Shangazi · ${subject}`,
          from: process.env.RESEND_NEWSLETTER_FROM || "Shangazi <comms@shangazi.rw>",
          subject,
          html: newsletterHtml(title, content),
        }),
      });
      return NextResponse.json({ success: true, id: created.id, message: "Draft saved in Resend. No emails were sent." });
    }
    if (body.action === "send") {
      // Explicit typed confirmation: never send merely by saving a draft.
      if (body.confirmation !== "SEND NEWSLETTER" || !body.broadcastId || !/^[0-9a-f-]{36}$/i.test(body.broadcastId)) {
        return NextResponse.json({ error: "Confirm SEND NEWSLETTER and select a valid broadcast." }, { status: 400 });
      }
      // Verify it belongs to our newsletter segment, is still a draft and cannot target another list.
      const broadcast = await resendRequest<{ id: string; segment_id?: string; status?: string }>(`/broadcasts/${body.broadcastId}`);
      if (broadcast.segment_id !== segmentId || broadcast.status !== "draft") {
        return NextResponse.json({ error: "Only draft broadcasts targeting the newsletter segment can be sent." }, { status: 409 });
      }
      await resendRequest(`/broadcasts/${body.broadcastId}/send`, { method: "POST", body: "{}" });
      return NextResponse.json({ success: true, message: "Resend accepted the broadcast for delivery." });
    }
    return NextResponse.json({ error: "Unsupported operation." }, { status: 400 });
  } catch (error) { return failure(error); }
}
