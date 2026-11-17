// src/testimonials.ts
import db from "@/src/db";

export type ApprovedTestimonial = {
  name: string;
  quote: string;
  rating: number | null;
  avatar_url: string | null;
};

export async function getApprovedTestimonials(): Promise<ApprovedTestimonial[]> {
  try {
    const result = await db.query(
      "SELECT name, content AS quote, rating, avatar_url FROM public.testimonials WHERE is_approved = true ORDER BY created_at DESC"
    );
    return result.rows as ApprovedTestimonial[];
  } catch (error) {
    console.error("Failed to load approved testimonials:", error);
    return [];
  }
}
