// app/api/newsletter/route.ts
import { NextResponse } from "next/server";
import { ResendApiError, subscribeToNewsletter } from "@/src/newsletter/resend";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const length = Number(request.headers.get("content-length") || "0");
  if (length > 4096) return NextResponse.json({ error: "Request too large." }, { status: 413 });
  const body = await request.json().catch(() => null) as { name?: unknown; email?: unknown; consent?: unknown } | null;
  const name = typeof body?.name === "string" ? body.name.trim().replace(/\s+/g, " ") : "";
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (name.length < 2 || name.length > 120 || email.length > 254 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return NextResponse.json({ error: "Enter a valid name and email address." }, { status: 400 });
  }
  if (body?.consent !== true) {
    return NextResponse.json({ error: "Please agree to receive newsletter emails." }, { status: 400 });
  }
  try {
    await subscribeToNewsletter(email, name);
    return NextResponse.json({ success: true, message: "You are subscribed to Shangazi updates." });
  } catch (error) {
    if (error instanceof ResendApiError && error.status === 409 && error.message.includes("unsubscribed")) {
      return NextResponse.json({ error: error.message }, { status: 409 });
    }
    console.error("Newsletter subscription failed", error instanceof ResendApiError ? error.status : "unknown error");
    return NextResponse.json({ error: "Subscription could not be saved. Please try again later." }, { status: 502 });
  }
}
