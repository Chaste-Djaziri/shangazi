import { NextResponse } from "next/server"
import { Resend } from "resend"

type ContactPayload = {
  name?: string
  email?: string
  subject?: string
  message?: string
}

const resendApiKey = process.env.RESEND_API_KEY
const resend = resendApiKey ? new Resend(resendApiKey) : null
const TO_EMAIL = "entirenganya@yahoo.fr"
const FROM_EMAIL = "comms@shangazi.rw"
const LOGO_URL = "https://shangazi.rw/logo.png"

export async function POST(request: Request) {
  if (!resend) {
    return NextResponse.json({ error: "Email service not configured." }, { status: 500 })
  }

  const body = (await request.json().catch(() => ({}))) as ContactPayload
  const { name, email, subject, message } = body

  if (!name || !email || !subject || !message) {
    return NextResponse.json({ error: "Missing required fields." }, { status: 400 })
  }

  const html = `
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
                    <td style="text-align:right;font-weight:700;font-size:16px;color:#1d5c19;">Contact form submission</td>
                  </tr>
                </table>
              </td>
            </tr>
            <tr>
              <td style="height:4px;background:#be1d51;padding:0;"></td>
            </tr>
            <tr>
              <td style="padding:24px 20px;color:#1a1a1a;font-size:14px;line-height:1.6;border-top:1px solid #e0e0e0;border-bottom:1px solid #e0e0e0;">
                <table role="presentation" style="width:100%;border-collapse:collapse;font-size:14px;">
                  <tr>
                    <td style="padding:6px 0;font-weight:700;width:120px;">Name</td>
                    <td style="padding:6px 0;">${name}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-weight:700;">Email</td>
                    <td style="padding:6px 0;">${email}</td>
                  </tr>
                  <tr>
                    <td style="padding:6px 0;font-weight:700;">Subject</td>
                    <td style="padding:6px 0;">${subject}</td>
                  </tr>
                </table>

                <div style="margin-top:18px;">
                  <div style="font-weight:700;font-size:15px;margin-bottom:8px;color:#1a1a1a;">Message</div>
                  <div style="border:1px solid #e0e0e0;padding:14px;background:#f9fafb;color:#1a1a1a;">${message.replace(/\n/g, "<br/>")}</div>
                </div>
              </td>
            </tr>
            <tr>
              <td style="padding:14px 20px;font-size:12px;color:#666666;background:#ffffff;">
                Sent from the shangazi.rw contact form
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `

  try {
    await resend.emails.send({
      from: `Shangazi Contact <${FROM_EMAIL}>`,
      to: [TO_EMAIL],
      reply_to: email,
      subject: subject || "New contact form submission",
      html,
    })
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error("Failed to send contact email", error)
    return NextResponse.json({ error: "Failed to send email." }, { status: 500 })
  }
}
