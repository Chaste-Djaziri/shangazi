import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Blogs",
  description: "Latest blogs and articles from Shangazi Emma Claudine.",
}

type StrapiImageAttributes = {
  url?: string
  alternativeText?: string
  formats?: Record<string, { url?: string }>
}

type StrapiImage =
  | {
      data?: {
        attributes?: StrapiImageAttributes
      }
    }
  | StrapiImageAttributes

type StrapiBlogRaw = {
  id?: number
  documentId?: string
  attributes?: {
    title?: string
    description?: string
    slug?: string
    publishedAt?: string
    thumbnail?: StrapiImage
  }
  title?: string
  description?: string
  slug?: string
  publishedAt?: string
  thumbnail?: StrapiImage
}

type StrapiResponse = {
  data?: StrapiBlogRaw[]
}

type BlogPost = {
  id: number | string
  title: string
  description: string
  slug?: string
  publishedAt?: string
  thumbnailUrl?: string
  thumbnailAlt?: string
}

const STRAPI_BASE =
  process.env.NEXT_PUBLIC_STRAPI_URL ?? process.env.STRAPI_API_URL ?? process.env.STRAPI_URL

const STRAPI_TOKEN = process.env.STRAPI_ACCESS_TOKEN

const isLocalImage = (src?: string) => {
  if (!src) return true
  return src.includes("localhost") || src.includes("127.0.0.1") || src.includes("::1")
}

const buildStrapiUrl = (path?: string) => {
  if (!path) return undefined
  if (path.startsWith("http")) return path
  const base = (STRAPI_BASE ?? "http://localhost:1337").replace(/\/$/, "")
  return `${base}${path}`
}

const extractImageUrl = (image?: StrapiImage): { url?: string; alt?: string } => {
  if (!image) return {}

  // Handle populated media
  // @ts-expect-error allow flexible access shapes
  const attrs: StrapiImageAttributes | undefined = image?.data?.attributes ?? image
  if (!attrs) return {}

  const url = buildStrapiUrl(attrs.url)
  const alt = attrs.alternativeText
  return { url, alt }
}

const normalizeBlog = (raw: StrapiBlogRaw): BlogPost => {
  const attrs = raw.attributes ?? raw
  const { url, alt } = extractImageUrl(attrs?.thumbnail)

  return {
    id: raw.id ?? raw.documentId ?? crypto.randomUUID(),
    title: attrs?.title ?? "Untitled",
    description: attrs?.description ?? "No description available.",
    slug: attrs?.slug,
    publishedAt: attrs?.publishedAt,
    thumbnailUrl: url,
    thumbnailAlt: alt ?? attrs?.title ?? "Blog image",
  }
}

async function getBlogs(): Promise<{ blogs: BlogPost[]; error?: string }> {
  const base = (STRAPI_BASE ?? "http://localhost:1337").replace(/\/$/, "")
  const params = new URLSearchParams()
  params.set("populate", "*")
  params.set("sort", "publishedAt:desc")
  if (STRAPI_TOKEN) {
    params.set("publicationState", "preview")
  } else {
    params.set("publicationState", "live")
  }

  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`
  }

  try {
    const res = await fetch(`${base}/api/blogs?${params.toString()}`, {
      headers,
      next: { revalidate: 300 },
    })

    if (!res.ok) {
      const message = await res.text()
      console.error("Failed to fetch blogs", message)
      return {
        blogs: [],
        error: `Request failed (${res.status}). Check Strapi URL (${base}) and Blog permissions.`,
      }
    }

    const json = (await res.json()) as StrapiResponse
    const items = json.data ?? []
    return { blogs: items.map(normalizeBlog) }
  } catch (error) {
    console.error("Failed to fetch blogs", error)
    return { blogs: [], error: "Network error reaching Strapi." }
  }
}

function formatDate(value?: string) {
  if (!value) return ""
  const date = new Date(value)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function BlogPage() {
  const { blogs, error } = await getBlogs()

  return (
    <main className="blog-page">
      <section className="blog-hero">
        <div className="blog-hero-content">
          <h1 className="blog-title">Blogs</h1>
          <p className="blog-subtitle">Latest stories, insights, and updates from Shangazi</p>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-container">
          {error ? <div className="blog-error">{error}</div> : null}
          {blogs.length === 0 && !error ? <div className="blog-empty">No posts available right now.</div> : null}
          {blogs.length > 0 ? (
            <div className="blog-layout">
              <div className="blog-main">
                <h2 className="blog-section-heading">
                  Blogs / <span className="blog-section-accent">Articles</span>
                </h2>
                <div className="blog-list">
                  {blogs.map((post) => {
                    const imageUrl = post.thumbnailUrl
                    const altText = post.thumbnailAlt ?? post.title

                    return (
                      <article key={post.id} className="blog-row-card">
                        <div className="blog-row-media">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={altText}
                              fill
                              unoptimized={isLocalImage(imageUrl)}
                              sizes="(max-width: 768px) 100vw, 300px"
                              className="blog-row-image"
                            />
                          ) : (
                            <div className="blog-row-placeholder" aria-hidden="true" />
                          )}
                        </div>
                        <div className="blog-row-content">
                          <h3 className="blog-row-title">{post.title}</h3>
                      <p className="blog-row-description">{post.description}</p>
                      <div className="blog-row-meta">{formatDate(post.publishedAt)}</div>
                      {post.slug ? (
                        <Link prefetch className="blog-card-link blog-card-link-inline" href={`/blog/${post.slug}`}>
                          Read More
                        </Link>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
              </div>

              <div className="blog-divider" aria-hidden="true" />

              <aside className="blog-trending">
                <h2 className="blog-trending-heading">Trending</h2>
                <div className="blog-trending-list">
                  {blogs.slice(0, 4).map((post) => {
                    const imageUrl = post.thumbnailUrl
                    const altText = post.thumbnailAlt ?? post.title
                    return (
                      <Link
                        key={`trend-${post.id}`}
                        prefetch
                        className="blog-trending-item"
                        href={post.slug ? `/blog/${post.slug}` : "#"}
                      >
                        <div className="blog-trending-thumb">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={altText}
                              fill
                              unoptimized={isLocalImage(imageUrl)}
                              sizes="80px"
                              className="blog-trending-image"
                            />
                          ) : (
                            <div className="blog-trending-placeholder" aria-hidden="true" />
                          )}
                        </div>
                        <div className="blog-trending-text">
                          <p className="blog-trending-title">{post.title}</p>
                        </div>
                      </Link>
                    )
                  })}
                </div>
              </aside>
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
