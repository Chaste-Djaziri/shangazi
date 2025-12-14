import { NextResponse } from "next/server"

// Simple webhook listener for Resend events. Verifies a shared secret if provided.
export async function POST(request: Request) {
  const secret = process.env.RESEND_WEBHOOK_SECRET
  const provided = request.headers.get("x-resend-signature")

  if (secret && provided !== secret) {
    return NextResponse.json({ error: "Invalid signature" }, { status: 401 })
  }

  // Consume the body to avoid Next.js warnings; normally you'd persist or log.
  await request.text().catch(() => null)

  return NextResponse.json({ received: true })
}
