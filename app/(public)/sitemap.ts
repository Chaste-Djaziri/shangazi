// app/(public)/sitemap.ts
import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";

// A sitemap always advertises production canonicals, even in local/preview builds.
const SITE_URL = "https://shangazi.rw";
export const revalidate = 3600;

// Never expose unpublished Sanity drafts, even when the app has a preview token.
const publishedClient = client.withConfig({
  perspective: "published",
  token: undefined,
  useCdn: false,
});

type PublishedItem = {
  slug?: string | null;
  updatedAt?: string | null;
};

type PublishedCourse = PublishedItem & {
  modules?: Array<{ slug?: string | null; isPublic?: boolean | null }> | null;
};

const POSTS_QUERY = `*[
  _type == "post" && isPublic == true && defined(slug.current)
  && (!defined(publishedAt) || publishedAt <= now())
]{
  "slug": slug.current,
  "updatedAt": coalesce(_updatedAt, publishedAt)
}`;

const VIDEOS_QUERY = `*[
  _type == "video" && isPublic == true && defined(slug.current)
]{
  "slug": slug.current,
  "updatedAt": _updatedAt
}`;

const COURSES_QUERY = `*[
  _type == "course" && isPublic == true && defined(slug.current)
  && (!defined(publishedAt) || publishedAt <= now())
]{
  "slug": slug.current,
  "updatedAt": coalesce(_updatedAt, publishedAt),
  "modules": modules[]->{ "slug": slug.current, isPublic }
}`;

const staticPaths = [
  "/",
  "/about",
  "/topics",
  "/blog",
  "/courses",
  "/videos",
  "/testimonials",
  "/contact",
  "/booking",
  "/donation",
  "/newsletter",
  "/faq",
  "/privacy",
  "/terms",
] as const;

function validLastModified(value?: string | null): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isFinite(date.getTime()) ? date : undefined;
}

function makeEntry(path: string, updatedAt?: string | null): MetadataRoute.Sitemap[number] {
  return {
    url: new URL(path, SITE_URL).toString(),
    ...(validLastModified(updatedAt) ? { lastModified: validLastModified(updatedAt) } : {}),
  };
}

function validSlug(slug?: string | null): slug is string {
  return Boolean(slug && slug.trim() && !slug.includes("/") && slug !== "." && slug !== "..");
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticEntries = staticPaths.map((path) => makeEntry(path));

  // A temporary CMS failure should not make /sitemap.xml return a server error.
  const [posts, videos, courses] = await Promise.all([
    publishedClient.fetch<PublishedItem[]>(POSTS_QUERY).catch(() => []),
    publishedClient.fetch<PublishedItem[]>(VIDEOS_QUERY).catch(() => []),
    publishedClient.fetch<PublishedCourse[]>(COURSES_QUERY).catch(() => []),
  ]);

  const dynamicEntries: MetadataRoute.Sitemap = [];

  for (const post of posts) {
    if (validSlug(post.slug)) {
      dynamicEntries.push(makeEntry(`/blog/${encodeURIComponent(post.slug)}`, post.updatedAt));
    }
  }

  for (const video of videos) {
    if (validSlug(video.slug)) {
      dynamicEntries.push(makeEntry(`/videos/${encodeURIComponent(video.slug)}`, video.updatedAt));
    }
  }

  for (const course of courses) {
    if (!validSlug(course.slug)) continue;
    const coursePath = `/courses/${encodeURIComponent(course.slug)}`;
    dynamicEntries.push(makeEntry(coursePath, course.updatedAt));

    // Only publicly accessible lessons belonging to a public course.
    for (const module of course.modules ?? []) {
      if (module?.isPublic === true && validSlug(module.slug)) {
        dynamicEntries.push(makeEntry(`${coursePath}/watch/${encodeURIComponent(module.slug)}`, course.updatedAt));
      }
    }
  }

  const uniqueEntries = new Map<string, MetadataRoute.Sitemap[number]>();
  for (const entry of [...staticEntries, ...dynamicEntries]) {
    uniqueEntries.set(entry.url, entry);
  }
  return [...uniqueEntries.values()];
}
