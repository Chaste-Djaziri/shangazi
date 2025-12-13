import type { MetadataRoute } from "next"

type StrapiBlogRaw = {
  id?: number
  documentId?: string
  attributes?: {
    slug?: string
    updatedAt?: string
    publishedAt?: string
  }
  slug?: string
  updatedAt?: string
  publishedAt?: string
}

type StrapiResponse = { data?: StrapiBlogRaw[] }

const STRAPI_BASE =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? process.env.STRAPI_API_URL ?? process.env.STRAPI_URL
const STRAPI_TOKEN = process.env.STRAPI_ACCESS_TOKEN

const buildHeaders = () => {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (STRAPI_TOKEN) headers.Authorization = `Bearer ${STRAPI_TOKEN}`
  return headers
}

async function fetchBlogSlugs(): Promise<{ slug?: string; updatedAt?: string }[]> {
  const base = (STRAPI_BASE ?? "http://localhost:1337").replace(/\/$/, "")
  const params = new URLSearchParams()
  params.set("fields[0]", "slug")
  params.set("fields[1]", "updatedAt")
  params.set("fields[2]", "publishedAt")
  params.set("pagination[pageSize]", "200")
  if (STRAPI_TOKEN) params.set("publicationState", "preview")

  try {
    const res = await fetch(`${base}/api/blogs?${params.toString()}`, {
      headers: buildHeaders(),
      next: { revalidate: 3600 },
    })
    if (!res.ok) return []
    const json = (await res.json()) as StrapiResponse
    return (
      json.data?.map((item) => {
        const attrs = item.attributes ?? item
        return { slug: attrs?.slug, updatedAt: attrs?.updatedAt ?? attrs?.publishedAt }
      }) ?? []
    )
  } catch {
    return []
  }
}

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shangazi.rw"

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: `${baseUrl}/`, changefreq: "weekly", priority: 1 },
    { url: `${baseUrl}/about`, changefreq: "monthly", priority: 0.8 },
    { url: `${baseUrl}/services`, changefreq: "monthly", priority: 0.6 },
    { url: `${baseUrl}/newsletter`, changefreq: "monthly", priority: 0.6 },
    { url: `${baseUrl}/booking`, changefreq: "monthly", priority: 0.6 },
    { url: `${baseUrl}/donation`, changefreq: "monthly", priority: 0.6 },
    { url: `${baseUrl}/blog`, changefreq: "weekly", priority: 0.8 },
  ]

  const posts = await fetchBlogSlugs()
  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastmod: item.updatedAt,
      changefreq: "weekly",
      priority: 0.7,
    }))

  return [...staticRoutes, ...blogRoutes]
}
