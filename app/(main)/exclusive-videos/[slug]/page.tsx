import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { neonAuth } from "@neondatabase/auth/next/server";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import { Play, Clock, ChevronLeft, Calendar } from "lucide-react";

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

export default async function PortalVideoDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const { user } = await neonAuth();
  
  if (!user) redirect("/login");
  
  const video = await client.fetch(VIDEO_DETAIL_QUERY, { slug });

  if (!video) {
    notFound();
  }

  const embedUrl = buildEmbedUrl(video.videoUrl);

  return (
    <div className="max-w-[1200px] mx-auto pb-20">
      <Link href="/exclusive-videos" className="text-primary font-bold text-[10px] uppercase tracking-[0.2em] hover:opacity-70 flex items-center gap-2 mb-8 transition-opacity">
        <ChevronLeft size={14} /> Back to Member Videos
      </Link>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-12">
        {/* Main Content */}
        <div className="lg:col-span-8">
          <div className="flex items-center gap-3 mb-4">
            <span className="bg-primary/5 text-primary text-[10px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border border-primary/10">
              Member Exclusive
            </span>
            {video.duration && (
              <span className="flex items-center gap-1.5 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                <Clock size={12} /> {video.duration}
              </span>
            )}
          </div>

          <h1 className="text-3xl lg:text-4xl font-serif text-gray-900 mb-8 leading-tight">
            {video.title}
          </h1>

          {embedUrl ? (
            <div className="relative aspect-video rounded-3xl overflow-hidden shadow-2xl bg-black mb-10 border border-gray-100">
              <iframe
                src={embedUrl}
                title={video.title}
                className="absolute inset-0 w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          ) : (
            <div className="aspect-video bg-gray-50 rounded-3xl flex flex-col items-center justify-center text-gray-300 mb-10 border-2 border-dashed border-gray-200">
               <Play size={64} className="opacity-20 mb-4" />
               <p className="text-gray-400 font-marcellus">Video content is temporarily unavailable.</p>
            </div>
          )}

          <div className="bg-white rounded-3xl p-8 lg:p-10 border border-gray-100 shadow-sm">
            <h3 className="text-xl font-serif text-gray-900 mb-6 italic flex items-center gap-3">
              <span className="w-8 h-px bg-primary" />
              Guidance Details
            </h3>
            <div className="prose prose-lg max-w-none font-marcellus text-gray-600 leading-relaxed">
              <p>{video.description || "No description provided for this video."}</p>
            </div>
          </div>
        </div>

        {/* Sidebar Info */}
        <div className="lg:col-span-4 space-y-6">
           <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
              <h4 className="text-sm font-serif font-bold text-gray-900 mb-6 uppercase tracking-wider">Quick Info</h4>
              <div className="space-y-6">
                <div className="flex items-center justify-between group">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] group-hover:text-primary transition-colors">Duration</span>
                  <span className="font-serif font-bold text-gray-900">{video.duration || "N/A"}</span>
                </div>
                <div className="h-px bg-gray-200/50" />
                <div className="flex items-center justify-between group">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] group-hover:text-primary transition-colors">Access Level</span>
                  <span className="font-serif font-bold text-gray-900">{video.isPublic ? "Public" : "Portal Member"}</span>
                </div>
                <div className="h-px bg-gray-200/50" />
                <div className="flex items-center justify-between group">
                  <span className="text-gray-400 font-bold uppercase tracking-widest text-[10px] group-hover:text-primary transition-colors">Category</span>
                  <span className="font-serif font-bold text-gray-900">Guidance</span>
                </div>
              </div>
           </div>

           <div className="bg-primary/5 rounded-3xl p-8 border border-primary/10">
              <h4 className="text-sm font-serif font-bold text-primary mb-4 uppercase tracking-wider">Need Guidance?</h4>
              <p className="text-gray-600 font-marcellus text-sm mb-6 leading-relaxed">
                If you have questions about this video or need personal support, feel free to book a guidance session.
              </p>
              <Link href="/booking" className="inline-flex items-center justify-center w-full bg-[#1d5c19] text-white px-6 py-4 rounded-2xl font-bold uppercase tracking-widest text-[10px] hover:opacity-90 transition-all shadow-lg shadow-primary/20">
                Book a Session
              </Link>
           </div>
        </div>
      </div>
    </div>
  );
}
