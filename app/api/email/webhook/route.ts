import { NextResponse } from "next/server"
import { Resend } from "resend"
import { Webhook } from "svix"
import crypto from "crypto"

const RESEND_TO = "entirenganya@yahoo.fr"
const RESEND_FROM = "comms@shangazi.rw"
const resendApiKey = process.env.RESEND_API_KEY
const webhookSecret = process.env.RESEND_EMAIL_RECEIVED_WEBHOOK_SECRET
const LOGO_URL = "https://shangazi.rw/logo.png"
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

  // Read raw body so we can verify signature before parsing JSON
  const raw = await request.text().catch(() => null)
  if (!raw) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  const svixId = request.headers.get("svix-id")
  const svixTimestamp = request.headers.get("svix-timestamp")
  const svixSignature = request.headers.get("svix-signature")
  const legacySignature = request.headers.get("x-resend-signature") ?? request.headers.get("resend-signature")

  const verifyLegacySignature = (signatureHeader: string) => {
    let timestamp: string | null = null
    let incomingSig: string | null = null
    const parts = signatureHeader.split(",").map((p) => p.trim())
    for (const part of parts) {
      if (part.startsWith("t=")) timestamp = part.slice(2)
      if (part.startsWith("v1=")) incomingSig = part.slice(3)
    }

    if (!incomingSig) incomingSig = signatureHeader

    const payloadToSign = timestamp ? `${timestamp}.${raw}` : raw
    const expectedBuf = crypto.createHmac("sha256", webhookSecret ?? "").update(payloadToSign).digest()

    // Try hex then base64 decoding of incoming signature
    let incomingBuf: Buffer | null = null
    try {
      incomingBuf = Buffer.from(incomingSig, "hex")
    } catch {
      incomingBuf = null
    }

    if (!incomingBuf) {
      try {
        incomingBuf = Buffer.from(incomingSig, "base64")
      } catch {
        incomingBuf = null
      }
    }

    return Boolean(
      incomingBuf && incomingBuf.length === expectedBuf.length && crypto.timingSafeEqual(incomingBuf, expectedBuf),
    )
  }

  let event: any = null

  if (webhookSecret) {
    const hasSvixHeaders = Boolean(svixId && svixTimestamp && svixSignature)
    if (hasSvixHeaders) {
      try {
        const wh = new Webhook(webhookSecret)
        event = wh.verify(raw, {
          "svix-id": svixId!,
          "svix-timestamp": svixTimestamp!,
          "svix-signature": svixSignature!,
        })
      } catch (err) {
        console.error("Failed to verify Resend webhook (svix)", err)
        return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
      }
    } else if (legacySignature && verifyLegacySignature(legacySignature)) {
      event = JSON.parse(raw)
    } else {
      return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
    }
  } else {
    event = JSON.parse(raw)
  }

  if (!event) {
    return NextResponse.json({ error: "Invalid payload" }, { status: 400 })
  }

  if (event.type !== "email.received") {
    return NextResponse.json({ ok: true })
  }

  const data = event.data ?? {}
  const emailId: string | undefined = data.email_id ?? data.id ?? data.emailId

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
  const htmlContent: string | undefined = fetchedEmail?.html ?? (typeof data.html === "string" ? data.html : undefined)
  const textContent: string | undefined = fetchedEmail?.text ?? data.text ?? data.html
  const safeText = textContent ?? "No body provided."

  const htmlBody = `
    <table role="presentation" style="width:100%;background:#f5f5f5;padding:24px 0;margin:0;font-family:Inter,-apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;">
      <tr>
        <td align="center">
          <table role="presentation" style="width:640px;max-width:640px;background:#ffffff;border:1px solid #e0e0e0;border-collapse:collapse;">
            <tr>
              <td style="padding:16px 20px;background:#ffffff;color:#1d5c19;text-transform:uppercase;letter-spacing:0.05em;font-size:13px;">
                <table role="presentation" style="width:100%;border-collapse:collapse;">
                  <tr>
                    <td style="text-align:left;">
                      <img src="${LOGO_URL}" alt="Shangazi" style="height:36px;display:block;" />
                    </td>
                    <td style="text-align:right;font-weight:700;font-size:16px;color:#1d5c19;">New email received</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="height:4px;background:#be1d51;padding:0;"></td>
            </tr>
            <tr>
              <td style="padding:24px 20px;color:#1a1a1a;font-size:14px;line-height:1.5;border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;">
                <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr>
                    <td style="padding:6px 0;font-weight:700;width:120px;">From</td>
                    <td style="padding:6px 0;">${escapeHtml(String(data.from ?? ""))}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-weight:700;">To</td>
                    <td style="padding:6px 0;">${escapeHtml(String((data.to ?? []).join?.(", ") ?? data.to ?? ""))}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-weight:700;">Subject</td>
                    <td style="padding:6px 0;">${escapeHtml(subject)}</td>
                  </tr>
                </table>

                <div style="margin-top:18px;">
                  <div style="font-weight:700;font-size:15px;margin-bottom:8px;color:#1a1a1a;">Message</div>
                  ${
                    htmlContent
                      ? `<div style="border:1px solid #e0e0e0;padding:14px;background:#f9fafb;color:#1a1a1a;">${htmlContent}</div>`
                      : `<pre style="border:1px solid #e0e0e0;padding:14px;background:#f9fafb;color:#1a1a1a;white-space:pre-wrap;margin:0;">${escapeHtml(String(safeText))}</pre>`
                  }
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 20px;font-size:12px;color:#666666;background:#ffffff;">
                Forwarded automatically from comms@shangazi.rw
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `

  await resend.emails.send({
    from: `Shangazi Forwarder <${RESEND_FROM}>`,
    to: [RESEND_TO],
    reply_to: data.from,
    subject: `FWD: ${subject}`,
    text: `From: ${data.from}
To: ${Array.isArray(data.to) ? data.to.join(", ") : data.to ?? ""}
Subject: ${subject}

Body:
${safeText}
`,
    html: htmlBody,
    attachments: attachments.length > 0 ? attachments : undefined,
  })

  return NextResponse.json({ forwarded: true })
}
