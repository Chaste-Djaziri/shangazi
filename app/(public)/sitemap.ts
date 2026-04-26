import type { MetadataRoute } from "next"
import { client } from "@/sanity/client"

type SanitySlug = {
  slug?: string
  updatedAt?: string
}

type CourseWithModules = {
  slug?: string
  updatedAt?: string
  modules?: { slug?: string }[]
}

const BLOG_SLUGS_QUERY = `*[_type == "post" && defined(slug.current) && isPublic == true]{
  "slug": slug.current,
  "updatedAt": coalesce(_updatedAt, publishedAt)
}`

const VIDEO_SLUGS_QUERY = `*[_type == "video" && defined(slug.current) && isPublic == true]{
  "slug": slug.current,
  "updatedAt": _updatedAt
}`

const COURSE_SLUGS_QUERY = `*[_type == "course" && defined(slug.current) && isPublic == true]{
  "slug": slug.current,
  "updatedAt": coalesce(_updatedAt, publishedAt),
  "modules": modules[]->{ "slug": slug.current, isPublic }
}`

const options = { next: { revalidate: 3600 } }

const STATIC_PATHS = [
  ["/", "weekly", 1],
  ["/about", "monthly", 0.9],
  ["/topics", "weekly", 0.9],
  ["/blog", "weekly", 0.8],
  ["/courses", "weekly", 0.8],
  ["/videos", "weekly", 0.8],
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

  const [posts, videos, courses] = await Promise.all([
    client.fetch<SanitySlug[]>(BLOG_SLUGS_QUERY, {}, options).catch(() => []),
    client.fetch<SanitySlug[]>(VIDEO_SLUGS_QUERY, {}, options).catch(() => []),
    client.fetch<CourseWithModules[]>(COURSE_SLUGS_QUERY, {}, options).catch(() => []),
  ])

  const blogRoutes: MetadataRoute.Sitemap = posts
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${baseUrl}/blog/${item.slug}`,
      lastModified: item.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    }))

  const videoRoutes: MetadataRoute.Sitemap = videos
    .filter((item) => item.slug)
    .map((item) => ({
      url: `${baseUrl}/videos/${item.slug}`,
      lastModified: item.updatedAt ?? now,
      changeFrequency: "weekly",
      priority: 0.7,
    }))

  const courseRoutes: MetadataRoute.Sitemap = []
  courses.forEach((course) => {
    if (course.slug) {
      // Course landing page
      courseRoutes.push({
        url: `${baseUrl}/courses/${course.slug}`,
        lastModified: course.updatedAt ?? now,
        changeFrequency: "weekly",
        priority: 0.8,
      })

      // Course modules (watch pages)
      course.modules?.forEach((module: any) => {
        if (module.slug && module.isPublic !== false) {
          courseRoutes.push({
            url: `${baseUrl}/courses/${course.slug}/watch/${module.slug}`,
            lastModified: course.updatedAt ?? now,
            changeFrequency: "weekly",
            priority: 0.6,
          })
        }
      })
    }
  })

  return [...staticRoutes, ...blogRoutes, ...videoRoutes, ...courseRoutes]
}
