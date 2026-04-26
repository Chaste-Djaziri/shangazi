import { client } from "@/sanity/client";
import { notFound, redirect } from "next/navigation";
import { neonAuth } from "@neondatabase/auth/next/server";
import PublicWatchPageClient from "./PublicWatchPageClient";
import type { Metadata } from "next";

const COURSE_DETAIL_QUERY = `*[_type == "course" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  isPublic,
  "modules": modules[]->{
    _id,
    title,
    "slug": slug.current,
    duration,
    isPublic,
    videoUrl,
    description,
    "thumbnail": thumbnail.asset->url
  }
}`;

export async function generateMetadata({ params }: { params: Promise<{ slug: string, moduleSlug: string }> }): Promise<Metadata> {
  const { slug, moduleSlug } = await params;
  const course = await client.fetch(COURSE_DETAIL_QUERY, { slug });
  const module = course?.modules?.find((m: any) => m.slug === moduleSlug);

  if (!course || !module) return { title: "Watch | Shangazi" };

  return {
    title: `${module.title} | ${course.title} | Shangazi`,
    description: module.description || `Watch the lesson ${module.title} from the course ${course.title} by Shangazi Emma Claudine.`,
    openGraph: {
      title: `${module.title} | ${course.title}`,
      description: module.description,
      images: [module.thumbnail || "/profile/about.png"],
    }
  };
}

export default async function PublicWatchPage({ params }: { params: Promise<{ slug: string, moduleSlug: string }> }) {
  const { slug, moduleSlug } = await params;
  const { session } = await neonAuth();
  
  const course = await client.fetch(COURSE_DETAIL_QUERY, { slug });

  if (!course) notFound();

  const currentModule = course.modules?.find((m: any) => m.slug === moduleSlug);
  if (!currentModule) notFound();

  // ACCESS CONTROL: If module is locked and no session, redirect to portal login
  if (!currentModule.isPublic && !session) {
    const callbackUrl = `/exclusive-courses/${slug}/watch/${moduleSlug}`;
    redirect(`/login?callbackURL=${encodeURIComponent(callbackUrl)}`);
  }

  return (
    <PublicWatchPageClient 
      course={course} 
      currentModule={currentModule} 
    />
  );
}
