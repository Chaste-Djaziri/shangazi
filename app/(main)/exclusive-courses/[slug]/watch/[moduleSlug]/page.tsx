import { client } from "@/sanity/client";
import { notFound } from "next/navigation";
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
  const course = await client.fetch(COURSE_DETAIL_QUERY, { slug });

  if (!course) notFound();

  const currentModule = course.modules?.find((m: any) => m.slug === moduleSlug);
  if (!currentModule) notFound();

  return (
    <WatchPageClient 
      course={course} 
      currentModule={currentModule} 
    />
  );
}
