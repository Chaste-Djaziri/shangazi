import type { NextRequest } from "next/server"
import { NextResponse } from "next/server"
import { Resend } from "resend"

const RESEND_TO = "habimanahirwa@gmail.com"
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

export const POST = async (request: NextRequest) => {
  if (!resend) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 })
  }

  if (webhookSecret) {
    const signature = request.headers.get("x-resend-signature") ?? request.headers.get("resend-signature")
    if (!signature || signature !== webhookSecret) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }
  }

  const event = await request.json().catch(() => null)
  if (!event) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true })
  }

  const data = event.data ?? {}
  const subject = data.subject ?? "Email received"
  const emailId = data.email_id as string | undefined

  // Try fetching full email content via Resend Receiving API for reliability.
  let textContent: string | undefined = data.text ?? data.html
  let htmlContent: string | undefined = typeof data.html === "string" ? data.html : undefined

  if (emailId) {
    const { data: received } = await resend.emails.receiving.get(emailId)
    if (received) {
      textContent = received.text ?? textContent
      htmlContent = received.html ?? htmlContent
    }
  }

  const safeText = textContent ?? "No body provided."

  const htmlBody = `
    <h3>New email received</h3>
    <p><strong>From:</strong> ${escapeHtml(String(data.from ?? ""))}</p>
    <p><strong>To:</strong> ${escapeHtml(String((data.to ?? []).join?.(", ") ?? data.to ?? ""))}</p>
    <p><strong>CC:</strong> ${escapeHtml(String((data.cc ?? []).join?.(", ") ?? data.cc ?? ""))}</p>
    <p><strong>BCC:</strong> ${escapeHtml(String((data.bcc ?? []).join?.(", ") ?? data.bcc ?? ""))}</p>
    <p><strong>Subject:</strong> ${escapeHtml(subject)}</p>
    <h4>Body</h4>
    ${
      htmlContent
        ? `<div style="border:1px solid #ddd;padding:12px;border-radius:6px;">${htmlContent}</div>`
        : `<pre style="white-space:pre-wrap;">${escapeHtml(String(safeText))}</pre>`
    }
    <h4>Raw Event</h4>
    <pre style="white-space:pre-wrap;">${escapeHtml(JSON.stringify(event, null, 2))}</pre>
  `

  await resend.emails.send({
    from: `Shangazi Forwarder <${RESEND_FROM}>`,
    to: [RESEND_TO],
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
  })

  return NextResponse.json({ forwarded: true })
}
