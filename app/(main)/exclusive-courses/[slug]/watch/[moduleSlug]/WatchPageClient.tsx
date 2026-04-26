"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Play, 
  CheckCircle2, 
  Clock, 
  ChevronLeft, 
  ListVideo,
  X
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

export default function WatchPageClient({ course, currentModule }: WatchPageClientProps) {
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  // Load progress from cache only on mount
  useEffect(() => {
    const cache = localStorage.getItem(`progress_${course.slug}`);
    if (cache) {
      try { setCompletedModules(JSON.parse(cache)); } catch (e) {}
    }
    
    // Silent background fetch to sync with DB
    fetch(`/api/course-progress?courseSlug=${course.slug}`)
      .then(res => res.json())
      .then(data => {
        if (data.completedModules) {
          setCompletedModules(prev => Array.from(new Set([...prev, ...data.completedModules])));
          localStorage.setItem(`progress_${course.slug}`, JSON.stringify(data.completedModules));
        }
      }).catch(() => {});
  }, [course.slug]);

  const markAsComplete = async (moduleSlug: string) => {
    const next = Array.from(new Set([...completedModules, moduleSlug]));
    setCompletedModules(next);
    localStorage.setItem(`progress_${course.slug}`, JSON.stringify(next));
    
    try {
      await fetch("/api/course-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course.slug, moduleSlug, completed: true })
      });
    } catch (e) {}
  };

  const embedUrl = buildEmbedUrl(currentModule.videoUrl);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <div className="flex-1 bg-gray-50">
        <div className="max-w-5xl mx-auto p-4 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href={`/exclusive-courses/${course.slug}`}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-[#1d5c19] transition-colors"
            >
              <ChevronLeft size={16} /> Back to Course
            </Link>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 bg-white rounded-xl shadow-sm text-gray-500 border border-gray-100">
              <ListVideo size={20} />
            </button>
          </div>

          <div className="aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl mb-12 border border-gray-100">
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
            <div className="prose prose-lg max-w-none font-marcellus text-gray-600 leading-relaxed mb-10">
              <p>{currentModule.description || "In this module, we dive deep into " + currentModule.title + "."}</p>
            </div>
            
            <div className="pt-10 border-t border-gray-100">
              <button 
                onClick={() => markAsComplete(currentModule.slug)}
                className={`flex items-center gap-3 px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-[11px] transition-all ${
                  completedModules.includes(currentModule.slug)
                  ? "bg-green-50 text-green-600 border border-green-100"
                  : "bg-[#1d5c19] text-white shadow-xl shadow-[#1d5c19]/20 hover:opacity-90"
                }`}
              >
                {completedModules.includes(currentModule.slug) ? (
                  <><CheckCircle2 size={18} /> Completed</>
                ) : (
                  "Mark as Complete"
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <aside className={`bg-white border-l border-gray-100 transition-all duration-300 ${isSidebarOpen ? "w-full lg:w-[450px]" : "w-0 lg:hidden"} fixed lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] inset-0 z-50 lg:z-0`}>
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white">
            <h2 className="text-xl font-serif font-bold text-gray-900">Curriculum</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2"><X size={20} /></button>
          </div>
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {course.modules.map((module: any, idx: number) => {
              const isActive = module.slug === currentModule.slug;
              const isCompleted = completedModules.includes(module.slug);
              return (
                <Link 
                  key={module._id}
                  href={`/exclusive-courses/${course.slug}/watch/${module.slug}`}
                  className={`flex items-center gap-5 p-5 rounded-[24px] transition-all border ${isActive ? "bg-[#1d5c19]/5 border-[#1d5c19]/20 shadow-sm" : "bg-white border-transparent hover:bg-gray-50"}`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 ${isActive ? "bg-[#1d5c19] text-white" : isCompleted ? "bg-green-100 text-green-600" : "bg-gray-100 text-gray-400"}`}>
                    {isCompleted ? <CheckCircle2 size={24} /> : idx + 1}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-[16px] font-bold truncate font-marcellus ${isActive ? "text-[#1d5c19]" : "text-gray-900"}`}>{module.title}</h4>
                    <div className="flex items-center gap-3 mt-1 text-[11px] text-gray-400 font-bold uppercase">
                       <Clock size={12} /> {module.duration || "5:00"}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}
