import type { MetadataRoute } from "next"

import { client } from "@/sanity/client"

type PostSlug = {
  slug?: string
  updatedAt?: string
}

const SLUGS_QUERY = `*[
  _type == "post" && defined(slug.current)
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

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shangazi.rw"
  const now = new Date().toISOString()

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, lastmod: now, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, lastmod: now, changeFrequency: "monthly", priority: 0.9 },
    { url: `${baseUrl}/topics`, lastmod: now, changeFrequency: "weekly", priority: 0.9 },
    { url: `${baseUrl}/blog`, lastmod: now, changeFrequency: "weekly", priority: 0.8 },
    { url: `${baseUrl}/impact`, lastmod: now, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/media`, lastmod: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/services`, lastmod: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/social-proof`, lastmod: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/testimonials`, lastmod: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/contact`, lastmod: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/booking`, lastmod: now, changeFrequency: "monthly", priority: 0.7 },
    { url: `${baseUrl}/donation`, lastmod: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/newsletter`, lastmod: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, lastmod: now, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/privacy`, lastmod: now, changeFrequency: "yearly", priority: 0.4 },
    { url: `${baseUrl}/terms`, lastmod: now, changeFrequency: "yearly", priority: 0.4 },
  ]

  const posts = await fetchBlogSlugs()
  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastmod: item.updatedAt,
      changeFrequency: "weekly",
      priority: 0.7,
    }))

  return [...staticRoutes, ...blogRoutes]
}
