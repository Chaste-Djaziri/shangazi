// app/(main)/discover/page.tsx
import type { Metadata } from "next";
import { neonAuth } from "@neondatabase/auth/next/server";
import { redirect } from "next/navigation";
import { createImageUrlBuilder, type SanityImageSource } from "@sanity/image-url";
import { client } from "@/sanity/client";
import { PORTAL_VIDEOS_QUERY } from "@/sanity/queries";
import Image from "next/image";
import Link from "next/link";
import { BookOpen, Play } from "lucide-react";

export const metadata: Metadata = {
  title: "Discover | SEC Portal",
  description: "Browse member videos and articles from Shangazi Emma Claudine.",
};

type Video = {
  _id: string;
  slug?: string;
  title?: string;
  thumbnail?: string;
  videoUrl?: string;
  duration?: string;
};

type Article = {
  _id: string;
  slug: string;
  title: string;
  image?: SanityImageSource;
  publishedAt?: string;
  author?: string;
};

const ARTICLES_QUERY = `*[_type == "post" && defined(slug.current)] | order(publishedAt desc) [0...12] {
  _id,
  title,
  "slug": slug.current,
  image,
  publishedAt,
  author
}`;

const { projectId, dataset } = client.config();
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null;

function getYouTubeThumbnail(value?: string): string | null {
  if (!value) return null;
  try {
    const url = new URL(value);
    const host = url.hostname.toLowerCase();
    const id = ["youtu.be", "www.youtu.be"].includes(host)
      ? url.pathname.split("/")[1]
      : ["youtube.com", "www.youtube.com", "m.youtube.com"].includes(host)
        ? url.searchParams.get("v") || (url.pathname.startsWith("/shorts/") || url.pathname.startsWith("/embed/") ? url.pathname.split("/")[2] : null)
        : null;
    return id && /^[a-zA-Z0-9_-]{11}$/.test(id)
      ? `https://img.youtube.com/vi/${id}/hqdefault.jpg`
      : null;
  } catch {
    return null;
  }
}

function ContentRow({
  title,
  href,
  children,
}: {
  title: string;
  href: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-label={title} className="min-w-0">
      <div className="mb-5 flex items-center justify-between gap-3">
        <h2 className="font-[Manrope] text-lg font-semibold tracking-tight text-[#202020]">{title}</h2>
        <Link href={href} className="font-[Manrope] text-sm font-medium text-[#777] hover:text-[#222]">
          See all
        </Link>
      </div>
      <div className="grid grid-cols-1 gap-x-5 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {children}
      </div>
    </section>
  );
}

export default async function DiscoverPage() {
  const { user } = await neonAuth();
  if (!user) redirect("/login");

  const [videos, articles] = await Promise.all([
    client.fetch<Video[]>(PORTAL_VIDEOS_QUERY),
    client.fetch<Article[]>(ARTICLES_QUERY, {}, { next: { revalidate: 60 } }),
  ]);
  const availableVideos = (videos ?? []).filter((video) => video.slug);
  const availableArticles = (articles ?? []).filter((article) => article.slug);

  return (
    <main className="mx-auto max-w-[1480px] space-y-12 pb-16">
      <ContentRow title="Videos" href="/exclusive-videos">
        {availableVideos.length ? availableVideos.map((video) => {
          const thumbnail = video.thumbnail || getYouTubeThumbnail(video.videoUrl);
          return (
            <Link key={video._id} href={`/exclusive-videos/${video.slug}`} className="group min-w-0">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-[#f2f2f2]">
                {thumbnail ? (
                  <Image src={thumbnail} alt={video.title || "Video"} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.035]" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#999]"><Play size={36} strokeWidth={1.5} /></div>
                )}
                {video.duration && <span className="absolute bottom-2 right-2 rounded bg-[#161616]/85 px-1.5 py-0.5 text-[11px] font-semibold text-white">{video.duration}</span>}
              </div>
              <h3 className="mt-3 line-clamp-2 font-[Manrope] text-[14px] font-semibold leading-[1.45] text-[#202020] group-hover:text-[#555]">{video.title}</h3>
              <p className="mt-1 font-[Manrope] text-xs text-[#8a8a8a]">Video</p>
            </Link>
          );
        }) : <p className="col-span-full py-8 text-sm text-[#888]">No videos available yet.</p>}
      </ContentRow>

      <ContentRow title="Articles" href="/articles">
        {availableArticles.length ? availableArticles.map((article) => {
          const thumbnail = article.image ? urlFor(article.image)?.width(720).height(405).fit("crop").url() : undefined;
          return (
            <Link key={article._id} href={`/articles/${article.slug}`} className="group min-w-0">
              <div className="relative aspect-video overflow-hidden rounded-xl bg-[#f2f2f2]">
                {thumbnail ? (
                  <Image src={thumbnail} alt={article.title} fill sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, (max-width: 1280px) 33vw, 25vw" className="object-cover transition-transform duration-300 group-hover:scale-[1.035]" />
                ) : (
                  <div className="flex h-full items-center justify-center text-[#999]"><BookOpen size={36} strokeWidth={1.5} /></div>
                )}
              </div>
              <h3 className="mt-3 line-clamp-2 font-[Manrope] text-[14px] font-semibold leading-[1.45] text-[#202020] group-hover:text-[#555]">{article.title}</h3>
              <p className="mt-1 truncate font-[Manrope] text-xs text-[#8a8a8a]">
                {[article.author, article.publishedAt ? new Date(article.publishedAt).toLocaleDateString("en-US", { month: "short", year: "numeric" }) : null].filter(Boolean).join(" · ") || "Article"}
              </p>
            </Link>
          );
        }) : <p className="col-span-full py-8 text-sm text-[#888]">No articles available yet.</p>}
      </ContentRow>
    </main>
  );
}
