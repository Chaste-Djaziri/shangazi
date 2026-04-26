import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { neonAuth } from "@neondatabase/auth/next/server";
import { notFound, redirect } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Play, Clock, Lock, ChevronRight, ChevronLeft } from "lucide-react";

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

export default async function PortalCourseDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { user } = await neonAuth();
  
  if (!user) redirect("/login");
  
  const course = await client.fetch(COURSE_DETAIL_QUERY, { slug });

  if (!course) {
    notFound();
  }

  return (
    <div className="max-w-full mx-auto pb-20">
      <Link href="/exclusive-courses" className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] hover:opacity-70 flex items-center gap-2 mb-8 transition-opacity">
        <ChevronLeft size={14} /> Back to Member Courses
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-7">
          <div className="flex items-center gap-3 mb-6">
            <span className="bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/10">
              Member Exclusive Course
            </span>
          </div>

          <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 mb-8 leading-tight">
            {course.title}
          </h1>

          <div className="flex items-center gap-8 mb-10 pb-8 border-b border-gray-100">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-[#1d5c19]/5 flex items-center justify-center text-[#1d5c19] font-bold text-sm">
                EC
              </div>
              <div>
                <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Instructor</p>
                <p className="text-base font-serif font-bold text-gray-900">{course.instructor}</p>
              </div>
            </div>
            <div className="h-10 w-px bg-gray-100" />
            <div>
              <p className="text-[10px] text-gray-400 uppercase tracking-widest font-bold">Content</p>
              <p className="text-base font-serif font-bold text-gray-900">{course.modules?.length || 0} Exclusive Modules</p>
            </div>
          </div>

          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm mb-12">
            <h3 className="text-xl font-serif text-gray-900 mb-6 italic flex items-center gap-3">
              <span className="w-8 h-px bg-primary" />
              Course Description
            </h3>
            <div className="prose prose-lg max-w-none font-marcellus text-gray-600 leading-relaxed">
              <p>{course.description}</p>
            </div>
          </div>
        </div>

        {/* Course Modules Sidebar */}
        <div className="lg:col-span-5">
          <div className="bg-gray-50 rounded-[40px] border border-gray-100 p-8 lg:p-10 sticky top-32">
            <h3 className="text-2xl font-serif text-gray-900 mb-8">
              Curriculum
            </h3>
            
            <div className="space-y-4">
              {course.modules?.map((module: any, idx: number) => (
                <Link 
                  key={module._id}
                  href={`/exclusive-videos/${module.slug}`}
                  className="group flex items-center gap-4 p-5 rounded-2xl bg-white hover:bg-primary/5 transition-all border border-transparent hover:border-primary/10 shadow-sm"
                >
                  <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 font-bold text-sm shrink-0 group-hover:bg-primary group-hover:text-white transition-colors">
                    {idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="text-[15px] font-bold text-gray-900 truncate group-hover:text-primary transition-colors font-marcellus">
                      {module.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-1">
                       <span className="flex items-center gap-1.5 text-[10px] text-gray-400 font-bold uppercase tracking-wider">
                         <Clock size={12} /> {module.duration || "5:00"}
                       </span>
                       {!module.isPublic && (
                         <span className="text-[10px] text-primary font-bold uppercase tracking-wider bg-primary/5 px-2 py-0.5 rounded">Member</span>
                       )}
                    </div>
                  </div>
                  <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-300 group-hover:bg-primary group-hover:text-white transition-all shadow-inner">
                    <Play size={12} fill="currentColor" />
                  </div>
                </Link>
              ))}
            </div>

            <div className="mt-10">
              <Link 
                href={`/exclusive-videos/${course.modules?.[0]?.slug}`}
                className="w-full bg-[#1d5c19] text-white py-5 rounded-2xl font-bold uppercase tracking-widest text-[10px] flex items-center justify-center gap-3 hover:opacity-90 transition-all shadow-xl shadow-[#1d5c19]/20"
              >
                <Play size={16} fill="white" />
                Resume Learning
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
