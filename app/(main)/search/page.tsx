import type { Metadata } from "next";
import { client } from "@/sanity/client";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Play, LayoutDashboard, Search, ChevronRight } from "lucide-react";
import { neonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: "Search Results | SEC Portal",
};

const SEARCH_QUERY = `*[
  (_type == "post" || _type == "video" || _type == "course") && 
  (title match $query || description match $query || content match $query)
]{
  _id,
  _type,
  title,
  "slug": slug.current,
  description,
  "thumbnail": thumbnail.asset->url,
  "image": image.asset->url,
  isPublic,
  "lessonCount": count(modules)
} | order(_type asc)`;

export default async function SearchResultsPage({
  searchParams,
}: {
  searchParams: Promise<{ q: string }>;
}) {
  const { user } = await neonAuth();
  if (!user) redirect("/login");

  const { q: query } = await searchParams;

  if (!query) {
    return (
      <div className="max-w-full mx-auto pb-20 text-center py-40">
        <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6 text-gray-300">
           <Search size={40} />
        </div>
        <h1 className="text-2xl font-serif text-gray-900 mb-2">Search the Portal</h1>
        <p className="text-gray-500 font-marcellus">Enter a search term in the header to find content.</p>
      </div>
    );
  }

  const results = await client.fetch(SEARCH_QUERY, { query: `*${query}*` });

  return (
    <div className="max-w-full mx-auto pb-20">
      <header className="mb-12">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">Search Results</h1>
        <p className="text-gray-500 font-marcellus text-lg">
          Found {results.length} matches for <span className="text-primary font-bold">“{query}”</span>
        </p>
      </header>

      {results.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {results.map((item: any) => {
            let href = "";
            let typeLabel = "";
            let Icon = Search;
            let themeColor = "primary";

            if (item._type === "post") {
              href = `/articles/${item.slug}`;
              typeLabel = "Article";
              Icon = BookOpen;
              themeColor = "[#1d5c19]";
            } else if (item._type === "video") {
              href = `/exclusive-videos/${item.slug}`;
              typeLabel = "Video";
              Icon = Play;
              themeColor = "secondary";
            } else if (item._type === "course") {
              href = `/exclusive-courses/${item.slug}`;
              typeLabel = "Course";
              Icon = LayoutDashboard;
              themeColor = "primary";
            }

            const image = item.thumbnail || item.image || (item._type === "video" ? `https://img.youtube.com/vi/${item.videoUrl?.split('v=')[1]?.split('&')[0]}/hqdefault.jpg` : null);

            return (
              <Link 
                key={item._id} 
                href={href}
                className="group bg-white rounded-3xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-500 flex flex-col"
              >
                <div className="relative aspect-[16/10] bg-gray-50">
                  {image ? (
                    <Image
                      src={image}
                      alt={item.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-700"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-200">
                      <Icon size={48} />
                    </div>
                  )}
                  
                  <div className="absolute top-4 left-4 z-10 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest text-gray-900 shadow-sm flex items-center gap-1.5">
                    <Icon size={12} className={`text-${themeColor}`} />
                    {typeLabel}
                  </div>
                </div>

                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="text-lg font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2 leading-snug">
                    {item.title}
                  </h3>
                  <p className="text-gray-500 text-sm font-marcellus line-clamp-2 mb-6">
                    {item.description}
                  </p>
                  
                  <div className="mt-auto flex items-center justify-between pt-4 border-t border-gray-50">
                    <span className="text-[10px] font-bold uppercase tracking-widest text-gray-400">
                      {item._type === "course" ? `${item.lessonCount} Lessons` : "Member Access"}
                    </span>
                    <div className="text-primary font-bold text-xs uppercase tracking-widest flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                      View <ChevronRight size={14} />
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="py-32 text-center bg-gray-50 rounded-[40px] border-2 border-dashed border-gray-200">
           <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm text-gray-300">
             <Search size={32} />
           </div>
           <h2 className="text-2xl font-serif text-gray-900 mb-2">No results found</h2>
           <p className="text-gray-400 font-marcellus max-w-md mx-auto">
             We couldn&apos;t find any content matching your search. Try different keywords or browse our main categories.
           </p>
           <div className="mt-10 flex items-center justify-center gap-4">
             <Link href="/articles" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Articles</Link>
             <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
             <Link href="/exclusive-courses" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Courses</Link>
             <div className="w-1.5 h-1.5 rounded-full bg-gray-200" />
             <Link href="/exclusive-videos" className="text-xs font-bold uppercase tracking-widest text-primary hover:underline">Videos</Link>
           </div>
        </div>
      )}
    </div>
  );
}
