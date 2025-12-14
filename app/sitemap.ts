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

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changeFrequency: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, changeFrequency: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/contact`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/faq`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/newsletter`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/booking`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/donation`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/testimonials`, changeFrequency: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`, changeFrequency: "weekly", priority: 0.8 },
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
