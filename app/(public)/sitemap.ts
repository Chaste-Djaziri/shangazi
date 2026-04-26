import type { MetadataRoute } from "next"

import { client } from "@/sanity/client"

type PostSlug = {
  slug?: string
  updatedAt?: string
}

const SLUGS_QUERY = `*[
  _type == "post" && defined(slug.current) && isPublic == true
]{
  "slug": slug.current,
  "updatedAt": coalesce(_updatedAt, publishedAt)
}`

const options = { next: { revalidate: 3600 } }

async function fetchBlogSlugs(): Promise<PostSlug[]> {
  try {
    return await client.fetch<PostSlug[]>(SLUGS_QUERY, {}, options)
  } catch {
    return []
  }
}

const STATIC_PATHS = [
  ["/", "weekly", 1],
  ["/about", "monthly", 0.9],
  ["/topics", "weekly", 0.9],
  ["/blog", "weekly", 0.8],
  ["/impact", "monthly", 0.8],
  ["/media", "monthly", 0.7],
  ["/services", "monthly", 0.7],
  ["/social-proof", "monthly", 0.7],
  ["/testimonials", "monthly", 0.7],
  ["/contact", "monthly", 0.7],
  ["/booking", "monthly", 0.7],
  ["/donation", "monthly", 0.6],
  ["/newsletter", "monthly", 0.6],
  ["/faq", "monthly", 0.6],
  ["/privacy", "yearly", 0.4],
  ["/terms", "yearly", 0.4],
] as const satisfies ReadonlyArray<
  readonly [
    path: string,
    changeFrequency: NonNullable<MetadataRoute.Sitemap[number]["changeFrequency"]>,
    priority: number,
  ]
>

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://shangazi.rw").replace(/\/$/, "")
  const now = new Date().toISOString()

  const staticRoutes: MetadataRoute.Sitemap = STATIC_PATHS.map(([path, changeFrequency, priority]) => ({
    url: `${baseUrl}${path}`,
    lastModified: now,
    changeFrequency,
    priority,
  }))

  const posts = await fetchBlogSlugs()
  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: item.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    }))

  return [...staticRoutes, ...blogRoutes]
}
