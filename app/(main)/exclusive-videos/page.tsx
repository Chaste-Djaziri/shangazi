import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { PORTAL_VIDEOS_QUERY } from "@/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock, Lock, ChevronRight } from "lucide-react";
import { neonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Member Videos | SEC Portal",
  description: "Watch exclusive guidance and honest conversations only for SEC Portal members.",
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

export default async function PortalVideosPage() {
  const { user } = await neonAuth();
  if (!user) redirect("/login");

  const videos = await client.fetch(PORTAL_VIDEOS_QUERY);

  return (
    <div className="max-w-full mx-auto pb-20">
      <header className="mb-12">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">Member Videos</h1>
        <p className="text-gray-500 font-marcellus">
          Exclusive insights and deep-dive conversations shared with our community.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {videos.length > 0 ? (
          videos.map((video: any) => {
            const thumbnail = video.thumbnail || getYouTubeThumbnail(video.videoUrl);
            return (
              <Link 
                key={video._id} 
                href={`/exclusive-videos/${video.slug}`}
                className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
              >
                <div className="relative aspect-video bg-gray-100">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <Play size={48} />
                    </div>
                  )}
                  
                  {/* Premium Badge */}
                  {!video.isPublic && (
                    <div className="absolute top-4 left-4 z-10 bg-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                      Premium
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 shadow-xl">
                      <Play size={20} fill="currentColor" />
                    </div>
                  </div>

                  {video.duration && (
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg">
                      <Clock size={12} /> {video.duration}
                    </div>
                  )}
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-xl font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                    {video.title}
                  </h3>
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {video.isPublic ? "Public Access" : "Member Exclusive"}
                    </span>
                    <div className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-2">
                      Watch Video <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-3xl border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-marcellus text-lg">No member-exclusive videos yet. Check back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
