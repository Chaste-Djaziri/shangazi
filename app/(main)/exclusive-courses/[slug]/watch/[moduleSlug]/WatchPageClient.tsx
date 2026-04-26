"use client";

import { useState, useEffect, useCallback, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  user: any;
}

const buildEmbedUrl = (videoUrl?: string): string | null => {
  if (!videoUrl) return null;
  try {
    const url = new URL(videoUrl);
    const host = url.hostname.toLowerCase();
    
    let videoId = null;
    if (host.includes("youtube.com")) {
      videoId = url.searchParams.get("v");
      if (!videoId && url.pathname.startsWith("/embed/")) {
        videoId = url.pathname.split("/")[2];
      }
    } else if (host === "youtu.be") {
      videoId = url.pathname.substring(1);
    }

    if (videoId) {
      return `https://www.youtube.com/embed/${videoId}?rel=0&enablejsapi=1`;
    }

    if (host.includes("vimeo.com")) {
      const vId = url.pathname.split("/").filter(Boolean).pop();
      if (vId) return `https://player.vimeo.com/video/${vId}`;
    }
  } catch {
    if (videoUrl.length === 11) {
      return `https://www.youtube.com/embed/${videoUrl}?rel=0&enablejsapi=1`;
    }
  }
  return null;
};

export default function WatchPageClient({ course, currentModule, user }: WatchPageClientProps) {
  const router = useRouter();
  
  const [completedModules, setCompletedModules] = useState<string[]>([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isVideoLoading, setIsVideoLoading] = useState(true);
  const [hasMounted, setHasMounted] = useState(false);
  const iframeRef = useRef<HTMLIFrameElement>(null);
  const playerRef = useRef<any>(null);

  // 1. Initial Load & Cache
  useEffect(() => {
    setHasMounted(true);
    const cache = localStorage.getItem(`progress_${course.slug}`);
    if (cache) {
      try {
        setCompletedModules(JSON.parse(cache));
      } catch (e) {}
    }
  }, [course.slug]);

  // 2. Reset Player State on Module Change
  useEffect(() => {
    setIsVideoLoading(true);
    // Explicitly hide loader after 6 seconds as a hard fallback
    const timer = setTimeout(() => setIsVideoLoading(false), 6000);
    return () => clearTimeout(timer);
  }, [currentModule.slug]);

  // 3. Sync Cache
  useEffect(() => {
    if (hasMounted) {
      localStorage.setItem(`progress_${course.slug}`, JSON.stringify(completedModules));
    }
  }, [completedModules, course.slug, hasMounted]);

  // 4. Robust DB Fetch
  useEffect(() => {
    async function fetchProgress() {
      try {
        const res = await fetch(`/api/course-progress?courseSlug=${course.slug}`);
        if (res.ok) {
          const data = await res.json();
          if (data.completedModules) {
            setCompletedModules(prev => Array.from(new Set([...prev, ...data.completedModules])));
          }
        }
      } catch (error) {
        console.warn("DB fetch failed, relying on local cache.");
      }
    }
    fetchProgress();
  }, [course.slug]);

  // 5. Completion Tracker
  const markAsComplete = useCallback(async (moduleSlug: string) => {
    setCompletedModules(prev => prev.includes(moduleSlug) ? prev : [...prev, moduleSlug]);
    
    try {
      await fetch("/api/course-progress", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseSlug: course.slug, moduleSlug, completed: true })
      });
    } catch (e) {
      console.warn("Background completion sync failed.");
    }
  }, [course.slug]);

  const handleVideoEnd = useCallback(() => {
    markAsComplete(currentModule.slug);
    const currentIndex = course.modules.findIndex((m: any) => m.slug === currentModule.slug);
    if (currentIndex < course.modules.length - 1) {
      const nextModule = course.modules[currentIndex + 1];
      router.push(`/exclusive-courses/${course.slug}/watch/${nextModule.slug}`);
    }
  }, [course.slug, currentModule.slug, course.modules, markAsComplete, router]);

  // 6. Youtube API Integration
  useEffect(() => {
    const videoUrl = currentModule.videoUrl;
    if (!videoUrl || !(videoUrl.includes("youtube.com") || videoUrl.includes("youtu.be"))) return;

    if (!(window as any).YT) {
      const tag = document.createElement('script');
      tag.src = "https://www.youtube.com/iframe_api";
      document.head.appendChild(tag);
    }

    const initPlayer = () => {
      if (iframeRef.current && (window as any).YT?.Player) {
        try {
          playerRef.current = new (window as any).YT.Player(iframeRef.current, {
            events: {
              'onStateChange': (event: any) => {
                if (event.data === 0) handleVideoEnd();
              },
              'onReady': () => setIsVideoLoading(false),
              'onError': () => setIsVideoLoading(false)
            }
          });
        } catch (e) {
          setIsVideoLoading(false);
        }
      }
    };

    if ((window as any).YT?.Player) {
      initPlayer();
    } else {
      (window as any).onYouTubeIframeAPIReady = initPlayer;
    }

    return () => {
      if (playerRef.current?.destroy) {
        try { playerRef.current.destroy(); } catch (e) {}
      }
    };
  }, [currentModule.slug, handleVideoEnd, currentModule.videoUrl]);

  // 7. Message Fallback
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      if (event.origin === "https://www.youtube.com") {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "infoDelivery" && data.info?.playerState === 0) handleVideoEnd();
        } catch (e) {}
      }
      if (event.origin === "https://player.vimeo.com") {
        try {
          const data = JSON.parse(event.data);
          if (data.event === "finish") handleVideoEnd();
        } catch (e) {}
      }
    };
    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, [handleVideoEnd]);

  const embedUrl = buildEmbedUrl(currentModule.videoUrl);

  return (
    <div className="flex flex-col lg:flex-row min-h-screen bg-white">
      <div className="flex-1 bg-gray-50">
        <div className="max-w-5xl mx-auto p-4 lg:p-10">
          <div className="flex items-center justify-between mb-8">
            <Link 
              href={`/exclusive-courses/${course.slug}`}
              className="flex items-center gap-2 text-xs font-bold text-gray-400 uppercase tracking-[0.2em] hover:text-primary transition-colors"
            >
              <ChevronLeft size={16} /> Back to Course
            </Link>
            <button onClick={() => setIsSidebarOpen(!isSidebarOpen)} className="lg:hidden p-2 bg-white rounded-xl shadow-sm text-gray-500 border border-gray-100">
              <ListVideo size={20} />
            </button>
          </div>

          <div key={currentModule.slug} className="aspect-video bg-black rounded-[32px] overflow-hidden shadow-2xl mb-12 border border-gray-100 relative">
            {isVideoLoading && (
              <div className="absolute inset-0 flex items-center justify-center bg-gray-900 z-20">
                <div className="w-12 h-12 border-4 border-[#1d5c19]/30 border-t-[#1d5c19] rounded-full animate-spin" />
              </div>
            )}
            {embedUrl ? (
              <iframe
                ref={iframeRef}
                src={embedUrl}
                title={currentModule.title}
                className="w-full h-full border-0 relative z-10"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
                onLoad={() => setIsVideoLoading(false)}
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
            
            <div className="mt-12 flex items-center justify-between pt-10 border-t border-gray-100">
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

      <aside 
        className={`bg-white border-l border-gray-100 transition-all duration-300
          ${isSidebarOpen ? "w-full lg:w-[450px]" : "w-0 lg:opacity-0 pointer-events-none"}
          fixed lg:sticky lg:top-20 lg:h-[calc(100vh-80px)] inset-0 z-50 lg:z-0
        `}
      >
        <div className="flex flex-col h-full">
          <div className="p-8 border-b border-gray-100 flex items-center justify-between bg-white sticky top-0 z-10">
            <h2 className="text-xl font-serif font-bold text-gray-900">Curriculum</h2>
            <button onClick={() => setIsSidebarOpen(false)} className="lg:hidden p-2 hover:bg-gray-50 rounded-lg">
              <X size={20} />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-4">
            {course.modules.map((module: any, idx: number) => {
              const isActive = module.slug === currentModule.slug;
              const isCompleted = completedModules.includes(module.slug);

              return (
                <Link 
                  key={module._id}
                  href={`/exclusive-courses/${course.slug}/watch/${module.slug}`}
                  className={`flex items-center gap-5 p-5 rounded-[24px] transition-all border ${
                    isActive 
                    ? "bg-[#1d5c19]/5 border-[#1d5c19]/20 shadow-sm" 
                    : "bg-white border-transparent hover:bg-gray-50 hover:border-gray-100"
                  }`}
                >
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center font-bold text-sm shrink-0 transition-all ${
                    isActive 
                    ? "bg-[#1d5c19] text-white scale-110 shadow-lg" 
                    : isCompleted 
                    ? "bg-green-100 text-green-600" 
                    : "bg-gray-100 text-gray-400 group-hover:bg-[#1d5c19]/10 group-hover:text-[#1d5c19]"
                  }`}>
                    {isCompleted ? <CheckCircle2 size={24} /> : idx + 1}
                  </div>
                  
                  <div className="flex-1 min-w-0">
                    <h4 className={`text-[16px] font-bold truncate transition-colors font-marcellus leading-tight ${
                      isActive ? "text-[#1d5c19]" : "text-gray-900 group-hover:text-[#1d5c19]"
                    }`}>
                      {module.title}
                    </h4>
                    <div className="flex items-center gap-3 mt-2">
                       <span className="flex items-center gap-1.5 text-[11px] text-gray-400 font-bold uppercase tracking-[0.1em]">
                         <Clock size={12} /> {module.duration || "5:00"}
                       </span>
                    </div>
                  </div>

                  {isActive && (
                    <div className="w-2.5 h-2.5 rounded-full bg-[#1d5c19] animate-pulse shadow-[0_0_10px_rgba(29,92,25,0.5)]" />
                  )}
                </Link>
              );
            })}
          </div>
        </div>
      </aside>
    </div>
  );
}
