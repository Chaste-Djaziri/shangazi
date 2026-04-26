import type { Metadata } from "next";
import { neonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";
import { client } from "@/sanity/client";
import { COURSES_QUERY, VIDEOS_QUERY } from "@/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { Play, BookOpen, Clock, ChevronRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover | SEC Portal",
  description: "Explore exclusive courses and videos on the SEC Portal.",
};

function getYouTubeThumbnail(url: string | null) {
  if (!url) return null;
  
  const regExp = /^.*(youtu\.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);

  if (match && match[2] && match[2].length === 11) {
    const videoId = match[2];
    return `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
  }

  return null;
}

export default async function DiscoverPage() {
  const { user } = await neonAuth();

  if (!user) {
    redirect("/login");
  }

  // Fetch data from Sanity
  const [courses, videos] = await Promise.all([
    client.fetch(COURSES_QUERY),
    client.fetch(VIDEOS_QUERY),
  ]);

  return (
    <div className="max-w-full mx-auto pb-20">
      {/* Welcome Header */}
      <header className="mb-12">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">
          Welcome back, {user.name?.split(" ")[0] || "Member"}
        </h1>
        <p className="text-gray-500 font-marcellus">
          Continue your journey with today&apos;s featured guidance and courses.
        </p>
      </header>

      {/* Featured Courses Section */}
      <section className="mb-16">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
              <BookOpen size={20} />
            </div>
            <h2 className="text-2xl font-serif text-gray-900">Recommended Courses</h2>
          </div>
          <Link href="/exclusive-courses" className="text-sm font-bold text-primary hover:underline flex items-center gap-1">
            View All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {courses.length > 0 ? (
            courses.map((course: any) => {
              const thumbnail = course.thumbnail || getYouTubeThumbnail(course.firstVideoUrl);
              return (
                <Link 
                  key={course._id} 
                  href={`/exclusive-courses/${course.slug}`}
                  className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl hover:shadow-primary/5 transition-all duration-300 flex flex-col"
                >
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={course.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <BookOpen size={48} />
                      </div>
                    )}
                    <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-primary shadow-sm">
                      {course.lessonCount} Lessons
                    </div>
                  </div>
                  <div className="p-6 flex-1 flex flex-col">
                    <h3 className="text-xl font-serif text-gray-900 mb-2 group-hover:text-primary transition-colors">
                      {course.title}
                    </h3>
                    <p className="text-gray-500 text-sm line-clamp-2 font-marcellus mb-4 flex-1">
                      {course.description}
                    </p>
                    <div className="flex items-center justify-between pt-4 border-t border-gray-50">
                      <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
                        {course.instructor}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary group-hover:text-white transition-colors">
                        <ChevronRight size={18} />
                      </div>
                    </div>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-marcellus">No courses available yet. Check back soon!</p>
            </div>
          )}
        </div>
      </section>

      {/* Latest Videos Section */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center text-secondary">
              <Play size={20} />
            </div>
            <h2 className="text-2xl font-serif text-gray-900">Latest Guidance Videos</h2>
          </div>
          <Link href="/exclusive-videos" className="text-sm font-bold text-secondary hover:underline flex items-center gap-1">
            Browse All <ChevronRight size={16} />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {videos.length > 0 ? (
            videos.map((video: any) => {
              const thumbnail = video.thumbnail || getYouTubeThumbnail(video.videoUrl);
              return (
                <Link 
                  key={video._id} 
                  href={`/exclusive-videos/${video.slug}`}
                  className="group flex flex-col gap-3"
                >
                  <div className="relative aspect-video rounded-xl overflow-hidden bg-gray-100">
                    {thumbnail ? (
                      <Image
                        src={thumbnail}
                        alt={video.title}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                        className="object-cover transition-transform duration-500 group-hover:scale-105"
                      />
                    ) : (
                      <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                        <Play size={32} />
                      </div>
                    )}
                    {/* Overlay */}
                    <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-primary text-white flex items-center justify-center opacity-0 group-hover:opacity-100 scale-75 group-hover:scale-100 transition-all duration-300 shadow-xl">
                        <Play size={20} fill="currentColor" />
                      </div>
                    </div>
                    {video.duration && (
                      <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-0.5 rounded text-[10px] font-bold text-white flex items-center gap-1">
                        <Clock size={10} /> {video.duration}
                      </div>
                    )}
                  </div>
                  <div>
                    <h4 className="font-serif text-gray-900 line-clamp-1 group-hover:text-primary transition-colors">
                      {video.title}
                    </h4>
                    <p className="text-xs text-gray-400 mt-1 font-marcellus uppercase tracking-wider">
                      Practical Guidance
                    </p>
                  </div>
                </Link>
              );
            })
          ) : (
            <div className="col-span-full py-12 text-center bg-gray-50 rounded-2xl border border-dashed border-gray-200">
              <p className="text-gray-400 font-marcellus">New videos are coming soon.</p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
}
