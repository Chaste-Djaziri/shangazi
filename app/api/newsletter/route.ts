import { NextResponse } from "next/server"
import { Resend } from "resend"

type Payload = {
  email?: string
  name?: string
}

const resendApiKey = process.env.RESEND_API_KEY
const segmentId = process.env.RESEND_SEGMENT_ID
const resend = resendApiKey ? new Resend(resendApiKey) : null

export async function POST(request: Request) {
  if (!resend || !segmentId) {
    return NextResponse.json({ error: "Newsletter not configured." }, { status: 500 })
  }

  const body = (await request.json().catch(() => null)) as Payload | null
  const email = body?.email?.toString().trim().toLowerCase()
  const name = body?.name?.toString().trim()

  if (!email) {
    return NextResponse.json({ error: "Email is required." }, { status: 400 })
  }

  try {
    // Create contact (ignore "already exists" errors)
    await resend.contacts.create({
      email,
      firstName: name,
      unsubscribed: false,
    })
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message.toLowerCase() : ""
    if (!message.includes("exists")) {
      console.error("Failed to create contact", err)
      return NextResponse.json({ error: "Failed to save contact." }, { status: 500 })
    }
  }

  try {
    await resend.contacts.segments.add({
      email,
      segmentId,
    })
  } catch (err) {
    console.error("Failed to add contact to segment", err)
    return NextResponse.json({ error: "Failed to add to newsletter segment." }, { status: 500 })
  }

  return NextResponse.json({ success: true })
}
