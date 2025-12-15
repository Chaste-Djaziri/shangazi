import { NextResponse } from "next/server"
import { Resend } from "resend"

type Payload = {
  email?: string
  name?: string
}

const resendApiKey = process.env.RESEND_API_KEY
const segmentId = process.env.RESEND_SEGMENT_ID
const resend = resendApiKey ? new Resend(resendApiKey) : null

type SegmentsAddFn = (options: { email?: string; segmentId?: string }) => Promise<unknown>

const addToSegment = async (email: string, segId: string) => {
  const contactsSegmentsAdd = (resend as unknown as { contacts?: { segments?: { add?: SegmentsAddFn } } } | null)
    ?.contacts?.segments?.add

  if (contactsSegmentsAdd) {
    // Use SDK if available
    await contactsSegmentsAdd.call(
      (resend as unknown as { contacts?: { segments?: { add?: SegmentsAddFn } } })?.contacts?.segments,
      { email, segmentId: segId },
    )
    return true
  }

  // Fallback to REST call
  const res = await fetch("https://api.resend.com/contacts/segments/add", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${resendApiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ email, segmentId: segId }),
  })

  if (!res.ok) {
    const msg = await res.text()
    throw new Error(`Failed to add to segment: ${msg}`)
  }
  return true
}

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
    // Create or upsert contact; audienceId is required by current Resend SDK.
    await resend.contacts.create({
      audienceId: segmentId,
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

  // Add to the target segment by email (id is optional).
  // Try adding to the segment; if it fails, log but still allow signup (contact already created).
  try {
    await addToSegment(email, segmentId)
  } catch (err) {
    console.error("Failed to add contact to segment", err)
  }

  return NextResponse.json({ success: true })
}
