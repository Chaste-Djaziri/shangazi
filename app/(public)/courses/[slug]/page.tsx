import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { neonAuth } from "@neondatabase/auth/next/server";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Play, Clock, Lock, ChevronRight } from "lucide-react";

const COURSE_DETAIL_QUERY = `*[_type == "course" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  instructor,
  "thumbnail": thumbnail.asset->url,
  isPublic,
  "modules": modules[]->{
    _id,
    title,
    "slug": slug.current,
    duration,
    isPublic,
    videoUrl
  }
}`;

export default async function CourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { session } = await neonAuth();
  
  const course = await client.fetch(COURSE_DETAIL_QUERY, { slug });

  if (!course) {
    notFound();
  }

  // Redirect if private and no session
  if (!course.isPublic && !session) {
    redirect(`/login?callbackURL=/courses/${slug}`);
  }

  return (
    <div className="max-w-[1200px] mx-auto px-6 lg:px-10 py-16 lg:py-24">
      <Link href="/courses" className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2 mb-10">
        ← Back to Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
        {/* Course Info */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
              Course
            </span>
            {!course.isPublic && (
              <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
                Premium
              </span>
            )}
          </div>

          <h1 className="text-4xl lg:text-6xl font-serif text-gray-900 mb-8 leading-[1.1]">
            {course.title}
          </h1>

          <div className="flex items-center gap-6 mb-12 py-6 border-y border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center text-primary font-bold text-xs">
                EC
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Instructor</p>
                <p className="text-sm font-serif font-bold">{course.instructor}</p>
              </div>
            </div>
            <div className="h-8 w-px bg-gray-100" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Lessons</p>
              <p className="text-sm font-serif font-bold">{course.modules?.length || 0} Modules</p>
            </div>
          </div>

          <div className="prose prose-lg max-w-none font-marcellus text-gray-600 leading-relaxed">
            <p>{course.description}</p>
          </div>
        </div>

        {/* Course Modules Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-white rounded-[40px] border border-gray-100 shadow-2xl shadow-primary/5 p-8 lg:p-10 sticky top-32">
            <h3 className="text-2xl font-serif text-gray-900 mb-8 flex items-center gap-3">
              Course Modules
            </h3>
            
            <div className="space-y-4">
              {course.modules?.map((module: any, idx: number) => (
                <Link 
                  key={module._id}
                  href={`/videos/${module.slug}`}
                  className="group flex items-center gap-4 p-4 rounded-2xl hover:bg-gray-50 transition-all border border-transparent hover:border-gray-100"
                >
                  <div className="w-10 h-10 rounded-xl bg-primary/5 flex items-center justify-center text-primary font-bold text-sm shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-gray-900 truncate group-hover:text-primary transition-colors font-marcellus">
                      {module.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                       <Clock size={12} className="text-gray-400" />
                       <span className="text-[11px] text-gray-400 font-bold uppercase tracking-wider">{module.duration || "5:00"}</span>
                       {!module.isPublic && <Lock size={10} className="text-primary" />}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full border border-gray-100 flex items-center justify-center text-gray-300 group-hover:border-primary group-hover:text-primary transition-all">
                    <Play size={14} fill="currentColor" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10">
              <Link 
                href={`/videos/${course.modules?.[0]?.slug}`}
                className="w-full bg-primary text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-xs flex items-center justify-center gap-3 hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
              >
                <Play size={16} fill="white" />
                Start Learning Now
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
