// app/(main)/discover/page.tsx
import type { Metadata } from "next";
import { neonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";
import { client } from "@/sanity/client";
import { COURSES_QUERY, VIDEOS_QUERY } from "@/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, BookOpen, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover | SEC Portal",
  description: "Explore courses, articles and guidance videos from Shangazi Emma Claudine.",
};

type Course = {
  _id: string;
  slug?: string;
  title?: string;
  description?: string;
  instructor?: string;
  thumbnail?: string;
  firstVideoUrl?: string;
  lessonCount?: number;
};

type Video = {
  _id: string;
  slug?: string;
  title?: string;
  description?: string;
  thumbnail?: string;
  videoUrl?: string;
  duration?: string;
};

function getYouTubeThumbnail(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const id = host === "youtu.be" || host === "www.youtu.be"
      ? url.pathname.split("/")[1]
      : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)
        ? url.searchParams.get("v") || url.pathname.split("/")[2]
        : null;
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      : null;
  } catch {
    return null;
  }
}

function SectionHeading({
  eyebrow,
  title,
  href,
  action,
}: {
  eyebrow: string;
  title: string;
  href: string;
  action: string;
}) {
  return (
    <div className="mb-7 flex flex-wrap items-end justify-between gap-4">
      <div>
        <p className="mb-2 font-[Manrope] text-[11px] font-semibold uppercase tracking-[0.16em] text-[#1d5c19]">{eyebrow}</p>
        <h2 className="font-[Fraunces] text-[27px] font-normal tracking-tight text-[#242b24] sm:text-[32px]">{title}</h2>
      </div>
      <Link href={href} className="inline-flex items-center gap-2 pb-1 font-[Manrope] text-sm font-semibold text-[#1d5c19] transition-opacity hover:opacity-70">
        {action} <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}

function EmptySection({ message, href, action }: { message: string; href: string; action: string }) {
  return (
    <div className="py-10">
      <p className="font-[Manrope] text-sm leading-7 text-[#6e746e]">{message}</p>
      <Link href={href} className="mt-3 inline-flex items-center gap-2 font-[Manrope] text-sm font-semibold text-[#1d5c19] hover:underline">
        {action} <ArrowRight size={16} aria-hidden="true" />
      </Link>
    </div>
  );
}

export default async function DiscoverPage() {
  const { user } = await neonAuth();
  if (!user) redirect("/login");

  const [courses, videos] = await Promise.all([
    client.fetch<Course[]>(COURSES_QUERY),
    client.fetch<Video[]>(VIDEOS_QUERY),
  ]);

  const firstName = user.name?.trim().split(/\s+/)[0] || "there";
  const availableCourses = courses.filter((course) => Boolean(course.slug)).slice(0, 3);
  const availableVideos = videos.filter((video) => Boolean(video.slug)).slice(0, 4);

  return (
    <div className="mx-auto max-w-[1220px] pb-16">
      <header className="mb-14 pt-3 sm:mb-16 sm:pt-6">
        <p className="mb-4 font-[Manrope] text-[11px] font-semibold uppercase tracking-[0.18em] text-[#1d5c19]">Your SEC Portal</p>
        <h1 className="max-w-[780px] font-[Fraunces] text-[36px] font-normal leading-[1.15] tracking-tight text-[#242b24] sm:text-[48px] lg:text-[56px]">
          Welcome back, {firstName}.
        </h1>
        <p className="mt-5 max-w-xl font-[Marcellus] text-[17px] leading-7 text-[#6c726b] sm:text-lg">
          A place to learn, reflect and find guidance that matters to you.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-x-7 gap-y-3">
          <Link href="/exclusive-courses" className="inline-flex items-center gap-2 font-[Manrope] text-sm font-semibold text-[#1d5c19] hover:underline">
            Explore courses <ArrowRight size={16} aria-hidden="true" />
          </Link>
          <Link href="/articles" className="inline-flex items-center gap-2 font-[Manrope] text-sm font-medium text-[#4c594e] hover:text-[#1d5c19]">
            Read articles <ArrowRight size={16} aria-hidden="true" />
          </Link>
        </div>
      </header>

      <section aria-labelledby="discover-courses" className="mb-16 sm:mb-20">
        <div id="discover-courses">
          <SectionHeading eyebrow="Learn at your pace" title="Explore courses" href="/exclusive-courses" action="All courses" />
        </div>
        {availableCourses.length ? (
          <div className="grid grid-cols-1 gap-x-7 gap-y-9 md:grid-cols-2 xl:grid-cols-3">
            {availableCourses.map((course) => {
              const image = course.thumbnail || getYouTubeThumbnail(course.firstVideoUrl);
              return (
                <Link key={course._id} href={`/exclusive-courses/${course.slug}`} className="group block min-w-0">
                  <div className="relative aspect-[16/10] overflow-hidden rounded-[6px] bg-[#f1f3ee]">
                    {image ? (
                      <Image src={image} alt={course.title || "Course"} fill sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 33vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#98a396]"><BookOpen size={36} strokeWidth={1.3} /></div>
                    )}
                  </div>
                  <div className="pt-4">
                    <p className="font-[Manrope] text-[11px] font-medium uppercase tracking-[0.1em] text-[#1d5c19]">
                      {course.lessonCount ? `${course.lessonCount} lessons` : "Course"}
                    </p>
                    <h3 className="mt-2 font-[Fraunces] text-xl font-normal leading-snug text-[#293029] transition-colors group-hover:text-[#1d5c19]">{course.title}</h3>
                    {course.description && <p className="mt-2 line-clamp-2 font-[Manrope] text-[13px] leading-6 text-[#777d76]">{course.description}</p>}
                    {course.instructor && <p className="mt-3 font-[Manrope] text-xs text-[#8a9089]">{course.instructor}</p>}
                  </div>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptySection message="Courses will appear here once they're available." href="/articles" action="Browse articles instead" />
        )}
      </section>

      <section aria-labelledby="discover-videos">
        <div id="discover-videos">
          <SectionHeading eyebrow="Watch and reflect" title="Latest guidance videos" href="/exclusive-videos" action="All videos" />
        </div>
        {availableVideos.length ? (
          <div className="grid grid-cols-1 gap-x-6 gap-y-9 sm:grid-cols-2 xl:grid-cols-4">
            {availableVideos.map((video) => {
              const image = video.thumbnail || getYouTubeThumbnail(video.videoUrl);
              return (
                <Link key={video._id} href={`/exclusive-videos/${video.slug}`} className="group block min-w-0">
                  <div className="relative aspect-video overflow-hidden rounded-[6px] bg-[#f1f3ee]">
                    {image ? (
                      <Image src={image} alt={video.title || "Guidance video"} fill sizes="(max-width: 640px) 100vw, (max-width: 1280px) 50vw, 25vw" className="object-cover transition-transform duration-500 group-hover:scale-[1.035]" />
                    ) : (
                      <div className="flex h-full items-center justify-center text-[#98a396]"><Play size={32} strokeWidth={1.3} /></div>
                    )}
                    {video.duration && <span className="absolute bottom-3 right-3 rounded-sm bg-[#1b211b]/75 px-2 py-1 font-[Manrope] text-[11px] text-white">{video.duration}</span>}
                  </div>
                  <p className="mt-4 font-[Manrope] text-[11px] font-medium uppercase tracking-[0.1em] text-[#1d5c19]">Guidance video</p>
                  <h3 className="mt-2 font-[Fraunces] text-lg font-normal leading-snug text-[#293029] transition-colors group-hover:text-[#1d5c19]">{video.title}</h3>
                </Link>
              );
            })}
          </div>
        ) : (
          <EmptySection message="New guidance videos will appear here as they're published." href="/articles" action="Explore articles" />
        )}
      </section>
    </div>
  );
}
