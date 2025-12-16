import { NextResponse } from "next/server"
import { query } from "@/db"

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const limit = Number(url.searchParams.get("limit") ?? "4") || 4

    const res = await query(
      `SELECT post_id, views FROM public.blog_views ORDER BY views DESC, last_viewed DESC LIMIT $1`,
      [limit],
    )

    return NextResponse.json({ items: res.rows ?? [] })
  } catch (err) {
    console.error('api/blog-views/trending error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
