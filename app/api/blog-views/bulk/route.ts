import { NextResponse } from "next/server"
import { query } from "@/db"

export async function POST(req: Request) {
  try {
    const body = await req.json()
    const { postIds } = body
    if (!Array.isArray(postIds))
      return NextResponse.json({ error: "postIds array required" }, { status: 400 })

    if (postIds.length === 0) return NextResponse.json({ counts: {} })

    const rows = await query(
      `SELECT post_id, views FROM public.blog_views WHERE post_id = ANY($1::text[])`,
      [postIds],
    )

    const counts: Record<string, number> = {}
    for (const r of rows.rows) counts[r.post_id] = Number(r.views ?? 0)

    // ensure every requested id has an entry
    for (const id of postIds) {
      if (!(id in counts)) counts[id] = 0
    }

    return NextResponse.json({ counts })
  } catch (err) {
    console.error('api/blog-views/bulk error:', err)
    return NextResponse.json({ error: String(err) }, { status: 500 })
  }
}
