import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { neonAuth } from "@neondatabase/auth/next/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Play, Clock, Lock, ChevronLeft } from "lucide-react";

const VIDEO_DETAIL_QUERY = `*[_type == "video" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  videoUrl,
  "thumbnail": thumbnail.asset->url,
  isPublic,
  duration
}`;

const buildEmbedUrl = (videoUrl?: string): string | null => {
  if (!videoUrl) return null;
  try {
    const url = new URL(videoUrl);
    const host = url.hostname.toLowerCase();
    if (host.includes("youtube.com")) {
      const id = url.searchParams.get("v");
      if (id) return `https://www.youtube.com/embed/${id}`;
    }
    if (host === "youtu.be") {
      const path = url.pathname.replace("/", "");
      if (path) return `https://www.youtube.com/embed/${path}`;
    }
    if (host.includes("vimeo.com")) {
      const path = url.pathname.split("/").filter(Boolean).pop();
      if (path) return `https://player.vimeo.com/video/${path}`;
    }
  } catch {
    return null;
  }
  return null;
};

export default async function VideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { session } = await neonAuth();
  
  const video = await client.fetch(VIDEO_DETAIL_QUERY, { slug });

  if (!video) {
    notFound();
  }

  // Redirect if private and no session
  if (!video.isPublic && !session) {
    redirect(`/login?callbackURL=/videos/${slug}`);
  }

  const embedUrl = buildEmbedUrl(video.videoUrl);

  return (
    <div className="max-w-[1000px] mx-auto px-6 lg:px-10 py-16 lg:py-20">
      <Link href="/videos" className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2 mb-10">
        <ChevronLeft size={16} /> Back to Videos
      </Link>

      <div className="flex items-center gap-3 mb-6">
        <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
          Guidance Video
        </span>
        {!video.isPublic && (
          <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full">
            Premium
          </span>
        )}
      </div>

      <h1 className="text-3xl lg:text-5xl font-serif text-gray-900 mb-8 leading-tight">
        {video.title}
      </h1>

      {embedUrl ? (
        <div className="relative aspect-video rounded-[32px] overflow-hidden shadow-2xl bg-black mb-12">
          <iframe
            src={embedUrl}
            title={video.title}
            className="absolute inset-0 w-full h-full border-0"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
            allowFullScreen
          />
        </div>
      ) : video.videoUrl ? (
        <div className="p-12 bg-gray-50 rounded-[32px] text-center border border-gray-100 mb-12">
           <p className="font-marcellus text-gray-500 mb-6 text-lg">This video is hosted on an external platform.</p>
           <a 
            href={video.videoUrl} 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-flex items-center gap-3 bg-primary text-white px-8 py-4 rounded-2xl font-bold uppercase tracking-widest text-xs hover:opacity-90 transition-opacity shadow-lg shadow-primary/20"
           >
             <Play size={18} fill="white" />
             Watch on Platform
           </a>
        </div>
      ) : (
        <div className="aspect-video bg-gray-100 rounded-[32px] flex items-center justify-center text-gray-300 mb-12">
           <Play size={80} />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
        <div className="lg:col-span-8">
          <h3 className="text-xl font-serif text-gray-900 mb-4 italic">About this guidance</h3>
          <div className="prose prose-lg max-w-none font-marcellus text-gray-600 leading-relaxed">
            <p>{video.description || "No description provided for this video."}</p>
          </div>
        </div>
        
        <div className="lg:col-span-4">
           <div className="flex flex-col gap-4 p-6 bg-white rounded-3xl border border-gray-100">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Duration</span>
                <span className="font-serif font-bold text-gray-900">{video.duration || "Unknown"}</span>
              </div>
              <div className="h-px bg-gray-50" />
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px]">Access</span>
                <span className="font-serif font-bold text-gray-900">{video.isPublic ? "Free" : "SEC Portal"}</span>
              </div>
           </div>
        </div>
      </div>
    </div>
  );
}
