import { NextResponse } from "next/server"
import { query } from "@/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { postId } = body
    if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 })

    // Upsert row and increment views
    const res = await query(
      `INSERT INTO public.blog_views (post_id, views, last_viewed)
       VALUES ($1, 1, now())
       ON CONFLICT (post_id) DO UPDATE SET views = public.blog_views.views + 1, last_viewed = now()
       RETURNING views`,
      [postId],
    )

    const views = res.rows?.[0]?.views ?? 0
    return NextResponse.json({ postId, views })
  } catch (err) {
    console.error('api/blog-views error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}

export async function GET(req: Request) {
  try {
    const url = new URL(req.url)
    const postId = url.searchParams.get("postId")
    if (!postId) return NextResponse.json({ error: "postId required" }, { status: 400 })

    const res = await query(`SELECT views FROM public.blog_views WHERE post_id = $1 LIMIT 1`, [postId])
    const views = res.rows?.[0]?.views ?? 0
    return NextResponse.json({ postId, views })
  } catch (err) {
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
