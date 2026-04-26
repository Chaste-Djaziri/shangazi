import { client } from "@/sanity/client";
import { neonAuth } from "@neondatabase/auth/next/server";
import { notFound, redirect } from "next/navigation";
import WatchPageClient from "./WatchPageClient";

const COURSE_DETAIL_QUERY = `*[_type == "course" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  "modules": modules[]->{
    _id,
    title,
    "slug": slug.current,
    duration,
    isPublic,
    videoUrl,
    description
  }
}`;

export default async function WatchPage({ params }: { params: Promise<{ slug: string, moduleSlug: string }> }) {
  const { slug, moduleSlug } = await params;
  const { user } = await neonAuth();
  
  if (!user) redirect("/login");
  
  const course = await client.fetch(COURSE_DETAIL_QUERY, { slug });

  if (!course) {
    notFound();
  }

  const currentModule = course.modules?.find((m: any) => m.slug === moduleSlug);
  if (!currentModule) {
    notFound();
  }

  // Get progress on the server
  // Note: We can also fetch this on the client for real-time updates
  // but initial state from server is good for SEO/Performance.
  
  return (
    <WatchPageClient 
      course={course} 
      currentModule={currentModule} 
      user={user} 
    />
  );
}
