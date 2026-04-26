import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { PORTAL_COURSES_QUERY } from "@/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronRight, Lock } from "lucide-react";
import { neonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Member Courses | SEC Portal",
  description: "Exclusive guided courses for SEC Portal members.",
};

function getYouTubeThumbnail(url: string | null) {
  if (!url) return null;
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  if (match && match[2].length === 11) {
    const videoId = match[2];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }
  return null;
}

export default async function PortalCoursesPage() {
  const { user } = await neonAuth();
  if (!user) redirect("/login");

  const courses = await client.fetch(PORTAL_COURSES_QUERY);

  return (
    <div className="max-w-full mx-auto pb-20">
      <header className="mb-12">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">Member Courses</h1>
        <p className="text-gray-500 font-marcellus">
          Structured guidance and deep learning modules exclusively for our community.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {courses.length > 0 ? (
          courses.map((course: any) => {
            const thumbnail = course.thumbnail || getYouTubeThumbnail(course.firstVideoUrl);
            return (
              <Link 
                key={course._id} 
                href={`/exclusive-courses/${course.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-gray-100">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <BookOpen size={48} />
                    </div>
                  )}
                  
                  {/* Premium Badge */}
                  {!course.isPublic && (
                    <div className="absolute top-4 left-4 z-10 bg-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Premium
                    </div>
                  )}

                  <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                    {course.lessonCount} Lessons
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-serif text-gray-900 mb-2 group-hover:text-primary transition-colors line-clamp-2">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 font-marcellus mb-6 flex-1">
                    {course.description}
                  </p>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      By {course.instructor}
                    </span>
                    <div className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      Start Course <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-marcellus text-lg">No member-exclusive courses available yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
