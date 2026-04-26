import { NextRequest, NextResponse } from "next/server";
import { neonAuth } from "@neondatabase/auth/next/server";
import db from "@/src/db";

export async function GET(request: NextRequest) {
  const { user } = await neonAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { searchParams } = new URL(request.url);
  const courseSlug = searchParams.get("courseSlug");

  if (!courseSlug) {
    return NextResponse.json({ error: "courseSlug is required" }, { status: 400 });
  }

  try {
    // 1. Fetch both overall progress and module progress in parallel
    const [courseRes, modulesRes] = await Promise.all([
      db.query(
        "SELECT started_at, completed_at, last_module_slug FROM public.course_progress WHERE user_id = $1 AND course_slug = $2",
        [user.id, courseSlug]
      ),
      db.query(
        "SELECT module_slug, completed FROM public.module_progress WHERE user_id = $1 AND course_slug = $2 AND completed = true",
        [user.id, courseSlug]
      )
    ]);

    return NextResponse.json({
      course: courseRes.rows[0] || null,
      completedModules: modulesRes.rows.map((m: any) => m.module_slug),
    });
  } catch (error) {
    console.error("Error fetching course progress:", error);
    // Return empty state instead of 500 to prevent app crash on transient network issues
    return NextResponse.json({
      course: null,
      completedModules: [],
      error: "Database connection timed out"
    }, { status: 200 });
  }
}

export async function POST(request: NextRequest) {
  const { user } = await neonAuth();
  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { courseSlug, moduleSlug, completed } = body;

  if (!courseSlug) {
    return NextResponse.json({ error: "courseSlug is required" }, { status: 400 });
  }

  try {
    // 1. Upsert course progress (mark as started)
    await db.query(
      `INSERT INTO public.course_progress (user_id, course_slug, last_module_slug)
       VALUES ($1, $2, $3)
       ON CONFLICT (user_id, course_slug) 
       DO UPDATE SET last_module_slug = EXCLUDED.last_module_slug`,
      [user.id, courseSlug, moduleSlug || null]
    );

    // 2. If a module slug is provided, upsert module progress
    if (moduleSlug) {
      await db.query(
        `INSERT INTO public.module_progress (user_id, course_slug, module_slug, completed, completed_at)
         VALUES ($1, $2, $3, $4, $5)
         ON CONFLICT (user_id, course_slug, module_slug) 
         DO UPDATE SET completed = EXCLUDED.completed, completed_at = EXCLUDED.completed_at`,
        [user.id, courseSlug, moduleSlug, !!completed, completed ? new Date() : null]
      );
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Error updating course progress:", error);
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
