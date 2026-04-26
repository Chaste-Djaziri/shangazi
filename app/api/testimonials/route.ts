import { NextRequest, NextResponse } from "next/server";
import { neonAuth } from "@neondatabase/auth/next/server";
import db from "@/src/db";

export async function GET() {
  try {
    const res = await db.query(
      "SELECT name, content as quote, avatar_url, rating FROM public.testimonials WHERE is_approved = true ORDER BY created_at DESC"
    );
    return NextResponse.json(res.rows);
  } catch (error) {
    console.error("Error fetching testimonials:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const { session } = await neonAuth();
    const body = await request.json();
    const { name, content, rating, avatar_url } = body;

    if (!name || !content) {
      return NextResponse.json({ error: "Name and content are required" }, { status: 400 });
    }

    await db.query(
      `INSERT INTO public.testimonials (user_id, name, content, rating, avatar_url)
       VALUES ($1, $2, $3, $4, $5)`,
      [session?.user?.id || null, name, content, rating || 5, avatar_url || null]
    );

    return NextResponse.json({ success: true, message: "Testimonial submitted for approval" });
  } catch (error) {
    console.error("Error submitting testimonial:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
