"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Play, 
  Clock, 
  ChevronLeft, 
  Lock
} from "lucide-react";

interface WatchPageClientProps {
  course: any;
  currentModule: any;
}

const buildEmbedUrl = (videoUrl?: string): string | null => {
  if (!videoUrl) return null;
  try {
    const url = new URL(videoUrl);
    const host = url.hostname.toLowerCase();
    let videoId = null;
    if (host.includes("youtube.com")) {
      videoId = url.searchParams.get("v");
      if (!videoId && url.pathname.startsWith("/embed/")) videoId = url.pathname.split("/")[2];
    } else if (host === "youtu.be") {
      videoId = url.pathname.substring(1);
    }
    if (videoId) return `https://www.youtube.com/embed/${videoId}?rel=0`;
    if (host.includes("vimeo.com")) {
      const vId = url.pathname.split("/").filter(Boolean).pop();
      if (vId) return `https://player.vimeo.com/video/${vId}`;
    }
  } catch {
    if (videoUrl.length === 11) return `https://www.youtube.com/embed/${videoUrl}?rel=0`;
  }
  return null;
};

export default function PublicWatchPageClient({ course, currentModule }: WatchPageClientProps) {
  const embedUrl = buildEmbedUrl(currentModule.videoUrl);

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Video Header / Navigation */}
      <div className="max-w-7xl mx-auto p-4 lg:p-8 flex items-center justify-between">
        <Link 
          href={`/courses/${course.slug}`}
          className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-[#1d5c19] transition-colors"
        >
          <ChevronLeft size={16} /> Back to Course
        </Link>
        <span className="text-[10px] font-bold text-primary bg-primary/5 px-3 py-1 rounded-full uppercase tracking-widest">
          {course.title}
        </span>
      </div>

      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          
          {/* Main Video Area */}
          <div className="lg:col-span-8">
            <div className="aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl mb-8 border border-gray-100">
              {embedUrl ? (
                <iframe
                  src={embedUrl}
                  title={currentModule.title}
                  className="w-full h-full border-0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center text-gray-500">
                  <Play size={64} className="opacity-20" />
                </div>
              )}
            </div>

            <div className="bg-white rounded-[32px] p-8 lg:p-12 border border-gray-100 shadow-sm">
              <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-6 leading-tight">{currentModule.title}</h1>
              <div className="prose prose-lg max-w-none font-marcellus text-gray-600 leading-relaxed">
                <p>{currentModule.description || "In this module, we dive deep into " + currentModule.title + "."}</p>
              </div>
            </div>
          </div>

          {/* Curriculum Area (Right/Under on mobile) */}
          <div className="lg:col-span-4">
            <div className="bg-white rounded-[32px] border border-gray-100 shadow-sm overflow-hidden flex flex-col h-fit sticky top-32">
              <div className="p-8 border-b border-gray-100 bg-white">
                <h2 className="text-xl font-serif font-bold text-gray-900">Curriculum</h2>
                <p className="text-xs text-gray-400 mt-1 font-marcellus uppercase tracking-widest">{course.modules.length} Lessons</p>
              </div>
              <div className="max-h-[600px] overflow-y-auto custom-scrollbar p-6 space-y-3">
                {course.modules.map((module: any, idx: number) => {
                  const isActive = module.slug === currentModule.slug;
                  const watchUrl = module.isPublic 
                    ? `/courses/${course.slug}/watch/${module.slug}`
                    : `/login?callbackURL=${encodeURIComponent(`/exclusive-courses/${course.slug}/watch/${module.slug}`)}`;

                  return (
                    <Link 
                      key={module._id}
                      href={watchUrl}
                      className={`flex items-center gap-4 p-4 rounded-[20px] transition-all border ${isActive ? "bg-[#1d5c19]/5 border-[#1d5c19]/20 shadow-sm" : "bg-white border-transparent hover:bg-gray-50"}`}
                    >
                      <div className={`w-10 h-10 rounded-xl flex items-center justify-center font-bold text-sm shrink-0 ${isActive ? "bg-[#1d5c19] text-white" : "bg-gray-100 text-gray-400"}`}>
                        {idx + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className={`text-sm font-bold truncate font-marcellus ${isActive ? "text-[#1d5c19]" : "text-gray-900"}`}>{module.title}</h4>
                        <div className="flex items-center gap-2 mt-0.5 text-[10px] text-gray-400 font-bold uppercase">
                           <Clock size={10} /> {module.duration || "5:00"}
                           {!module.isPublic && (
                             <span className="flex items-center gap-1 text-[#1d5c19]">
                               <Lock size={10} />
                             </span>
                           )}
                        </div>
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
