import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { PORTAL_VIDEOS_QUERY } from "@/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { Play, Clock, ChevronRight, Lock } from "lucide-react";

export const metadata: Metadata = {
  title: "Videos | Shangazi Emma Claudine",
  description: "Watch the latest guidance and stories from Shangazi Emma Claudine.",
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

export default async function VideosListingPage() {
  const videos = await client.fetch(PORTAL_VIDEOS_QUERY);

  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20">
      <header className="mb-16 text-center max-w-2xl mx-auto">
        <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 mb-4">Videos</h1>
        <p className="text-gray-500 font-marcellus text-lg">
          Insights and honest conversations on film. Dive into practical guidance through our video library.
        </p>
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {videos.length > 0 ? (
          videos.map((video: any) => {
            const thumbnail = video.thumbnail || getYouTubeThumbnail(video.videoUrl);
            return (
              <Link 
                key={video._id} 
                href={`/videos/${video.slug}`}
                className="group flex flex-col gap-4 relative"
              >
                <div className="relative aspect-video rounded-3xl overflow-hidden bg-gray-100 shadow-sm transition-all duration-500 group-hover:shadow-xl group-hover:-translate-y-1">
                  {thumbnail ? (
                    <Image
                      src={thumbnail}
                      alt={video.title}
                      fill
                      className="object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                      <Play size={48} />
                    </div>
                  )}
                  
                  {/* Lock/Badge */}
                  {!video.isPublic && (
                    <div className="absolute top-4 left-4 z-10 bg-black/60 backdrop-blur-md p-2 rounded-full text-white shadow-xl">
                      <Lock size={14} fill="white" />
                    </div>
                  )}

                  {/* Play Overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-500 flex items-center justify-center">
                    <div className="w-14 h-14 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-500 shadow-2xl">
                      <Play size={24} fill="currentColor" />
                    </div>
                  </div>

                  {video.duration && (
                    <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-2.5 py-1 rounded-lg text-[10px] font-bold text-white flex items-center gap-1.5 shadow-lg">
                      <Clock size={12} /> {video.duration}
                    </div>
                  )}
                </div>

                <div className="px-1">
                  <div className="flex items-start justify-between gap-3">
                    <h4 className="font-serif text-lg text-gray-900 leading-snug group-hover:text-primary transition-colors line-clamp-2">
                      {video.title}
                    </h4>
                    {!video.isPublic && (
                      <span className="shrink-0 text-[9px] font-bold uppercase tracking-widest text-primary bg-primary/10 px-2 py-0.5 rounded">
                        Premium
                      </span>
                    )}
                  </div>
                  <p className="text-xs text-gray-400 mt-2 font-marcellus uppercase tracking-widest">
                    Guidance • {video.isPublic ? "Free" : "SEC Portal"}
                  </p>
                </div>
              </Link>
            );
          })
        ) : (
          <div className="col-span-full py-20 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
            <p className="text-gray-400 font-marcellus text-lg">Our video library is currently being updated. Come back soon!</p>
          </div>
        )}
      </div>
    </div>
  );
}
