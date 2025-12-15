import { NextResponse } from "next/server"
import { Resend } from "resend"

const RESEND_TO = "entirenganya@yahoo.fr"
const RESEND_FROM = "comms@shangazi.rw"
const resendApiKey = process.env.RESEND_API_KEY
const webhookSecret = process.env.RESEND_WEBHOOK_SECRET
const resend = resendApiKey ? new Resend(resendApiKey) : null

const escapeHtml = (input: string) =>
  input
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;")

const receivingEmailUrl = (id: string) => `https://api.resend.com/emails/receiving/${id}`
const receivingAttachmentsUrl = (emailId: string) => `https://api.resend.com/attachments/receiving?emailId=${emailId}`

const fetchJson = async <T,>(url: string, apiKey?: string): Promise<T | null> => {
  if (!apiKey) return null
  try {
    const res = await fetch(url, {
      headers: { Authorization: `Bearer ${apiKey}`, "Content-Type": "application/json" },
    })
    if (!res.ok) return null
    return (await res.json()) as T
  } catch {
    return null
  }
}

export async function POST(request: Request) {
  if (!resend) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 })
  }

  const provided = request.headers.get("x-resend-signature") ?? request.headers.get("resend-signature")
  if (webhookSecret && (!provided || provided !== webhookSecret)) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  const event = await request.json().catch(() => null)
  if (!event) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const forwardableTypes = new Set(["email.received", "email.delivered", "email.sent"])
  if (!forwardableTypes.has(event.type)) {
    return NextResponse.json({ ok: true })
  }

  const data = event.data ?? {}
  const emailId: string | undefined =
    data.email_id ?? data.id ?? data.emailId ?? (typeof data === "object" ? data?.email?.id : undefined)

  // Pull freshest body from Receiving API (and attachments) if possible.
  let fetchedEmail: { html?: string; text?: string; subject?: string } | null = null
  let fetchedAttachments: Array<{
    id: string
    filename?: string
    content_type?: string
    download_url?: string
  }> = []

  if (emailId && resendApiKey) {
    fetchedEmail = await fetchJson(receivingEmailUrl(emailId), resendApiKey)
    const attachmentList = await fetchJson<{ data?: typeof fetchedAttachments }>(
      receivingAttachmentsUrl(emailId),
      resendApiKey,
    )
    fetchedAttachments = attachmentList?.data ?? []
  }

  const attachments: Array<{
    filename?: string
    content?: string
    contentType?: string
  }> = []

  for (const attachment of fetchedAttachments) {
    if (!attachment?.download_url) continue
    try {
      const resp = await fetch(attachment.download_url)
      const buffer = Buffer.from(await resp.arrayBuffer())
      attachments.push({
        filename: attachment.filename ?? "attachment",
        content: buffer.toString("base64"),
        contentType: attachment.content_type,
      })
    } catch (err) {
      console.error("Failed to fetch attachment", err)
    }
  }

  const subject = fetchedEmail?.subject ?? data.subject ?? "Email received"
  const htmlContent: string | undefined =
    fetchedEmail?.html ?? (typeof data.html === "string" ? data.html : undefined)
  const textContent: string | undefined = fetchedEmail?.text ?? data.text ?? data.html
  const safeText = textContent ?? "No body provided."

  const htmlBody = `
    <div style="font-family: Inter, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; background:#f6f8fb; padding:24px;">
      <div style="max-width:620px;margin:0 auto;background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;box-shadow:0 10px 30px rgba(17,24,39,0.08);overflow:hidden;">
        <div style="background:linear-gradient(135deg,#1f7a39,#164515);padding:16px 20px;color:#fff;">
          <div style="font-size:14px;letter-spacing:0.03em;text-transform:uppercase;opacity:0.8;">Shangazi Inbox</div>
          <div style="font-size:18px;font-weight:700;margin-top:4px;">New email received</div>
        </div>
        <div style="padding:20px 24px;">
          <table style="width:100%;border-collapse:collapse;font-size:14px;color:#111827;">
            <tr>
              <td style="padding:6px 0;font-weight:600;width:120px;">From</td>
              <td style="padding:6px 0;">${escapeHtml(String(data.from ?? ""))}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-weight:600;">To</td>
              <td style="padding:6px 0;">${escapeHtml(String((data.to ?? []).join?.(", ") ?? data.to ?? ""))}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-weight:600;">CC</td>
              <td style="padding:6px 0;">${escapeHtml(String((data.cc ?? []).join?.(", ") ?? data.cc ?? ""))}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-weight:600;">BCC</td>
              <td style="padding:6px 0;">${escapeHtml(String((data.bcc ?? []).join?.(", ") ?? data.bcc ?? ""))}</td>
            </tr>
            <tr>
              <td style="padding:6px 0;font-weight:600;">Subject</td>
              <td style="padding:6px 0;">${escapeHtml(subject)}</td>
            </tr>
          </table>

          <div style="margin-top:18px;">
            <div style="font-weight:700;font-size:15px;margin-bottom:8px;color:#0f172a;">Body</div>
            ${
              htmlContent
                ? `<div style="border:1px solid #e5e7eb;border-radius:10px;padding:14px;background:#f9fafb;color:#111827;">${htmlContent}</div>`
                : `<pre style="border:1px solid #e5e7eb;border-radius:10px;padding:14px;background:#f9fafb;color:#111827;white-space:pre-wrap;">${escapeHtml(String(safeText))}</pre>`
            }
          </div>

          <div style="margin-top:18px;">
            <div style="font-weight:700;font-size:15px;margin-bottom:8px;color:#0f172a;">Raw Event</div>
            <pre style="border:1px solid #e5e7eb;border-radius:10px;padding:14px;background:#0f172a;color:#e5e7eb;font-size:12px;white-space:pre-wrap;overflow-x:auto;">${escapeHtml(JSON.stringify(event, null, 2))}</pre>
          </div>
        </div>
        <div style="background:#f3f4f6;padding:12px 20px;color:#6b7280;font-size:12px;text-align:center;">
          Forwarded automatically from comms@shangazi.rw
        </div>
      </div>
    </div>
  `

  await resend.emails.send({
    from: `Shangazi Forwarder <${RESEND_FROM}>`,
    to: [RESEND_TO],
    reply_to: data.from,
    subject: `FWD: ${subject}`,
    text: `From: ${data.from}
To: ${Array.isArray(data.to) ? data.to.join(", ") : data.to ?? ""}
CC: ${Array.isArray(data.cc) ? data.cc.join(", ") : data.cc ?? ""}
BCC: ${Array.isArray(data.bcc) ? data.bcc.join(", ") : data.bcc ?? ""}
Subject: ${subject}

Body:
${safeText}

Raw Event:
${JSON.stringify(event, null, 2)}
`,
    html: htmlBody,
    attachments: attachments.length > 0 ? attachments : undefined,
  })

  return NextResponse.json({ forwarded: true })
}
