import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { PORTAL_COURSES_QUERY } from "@/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, ChevronRight, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Guided Courses | Shangazi Emma Claudine",
  description: "Join structured learning paths and guided courses by Shangazi Emma Claudine on relationships, health, and personal development.",
  keywords: ["Shangazi courses", "Emma Claudine education", "Rwandan youth courses", "relationship guidance Rwanda"],
  openGraph: {
    title: "Guided Courses | Shangazi Emma Claudine",
    description: "Empowering communities through structured guidance and deep learning modules.",
    type: "website",
  }
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

export default async function CoursesListingPage() {
  const courses = await client.fetch(PORTAL_COURSES_QUERY);

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
      <header className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-4">Courses</h1>
        <p className="text-gray-500 font-marcellus text-lg">
          Structured guidance to help you navigate growth, health, and honest conversations.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {courses.length > 0 ? (
          courses.map((course: any) => {
            const thumbnail = course.thumbnail || getYouTubeThumbnail(course.firstVideoUrl);
            return (
              <Link 
                key={course._id} 
                href={`/courses/${course.slug}`}
                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-2xl hover:shadow-primary/5 transition-all duration-500 flex flex-col relative"
              >
                <div className="relative aspect-[16/10] bg-gray-100 overflow-hidden">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={course.title}
                      fill
                      className="object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <BookOpen size={64} />
                    </div>
                  )}
                  
                  {/* Badge & Lock */}
                  <div className="absolute top-5 left-5 flex items-center gap-2">
                    {!course.isPublic ? (
                      <div className="bg-black/60 backdrop-blur-md p-2.5 rounded-full text-white shadow-xl">
                        <Lock size={18} fill="white" />
                      </div>
                    ) : null}
                    <div className="bg-white/90 backdrop-blur-md px-4 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-primary shadow-sm">
                      {course.lessonCount} Lessons
                    </div>
                  </div>
                  
                  {!course.isPublic && (
                    <div className="absolute top-5 right-5 bg-primary px-3 py-1.5 rounded-full text-[10px] font-bold uppercase tracking-widest text-white shadow-lg">
                      Premium
                    </div>
                  )}
                </div>

                <div className="p-8 flex-1 flex flex-col">
                  <h3 className="text-2xl font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors leading-tight">
                    {course.title}
                  </h3>
                  <p className="text-gray-500 text-sm line-clamp-3 font-marcellus mb-6 flex-1 leading-relaxed">
                    {course.description}
                  </p>
                  <div className="flex items-center justify-between pt-6 border-t border-gray-50">
                    <span className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                      By {course.instructor}
                    </span>
                    <div className="w-10 h-10 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-all duration-300 group-hover:translate-x-1">
                      <ChevronRight size={20} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-marcellus text-lg">No courses are currently available. Please check back later!</p>
          </div>
        )}
      </div>
    </div>
  );
}
