import Image from "next/image"
import Link from "next/link"

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
          <h1 className="blog-title">Blog</h1>
          <p className="blog-subtitle">Latest stories, insights, and updates from Shangazi</p>
        </div>
      </section>

      <section className="blog-section">
        <div className="blog-container">
          {error ? <div className="blog-error">{error}</div> : null}
          {blogs.length === 0 && !error ? <div className="blog-empty">No posts available right now.</div> : null}
          {blogs.length > 0 ? (
            <div className="blog-grid">
              {blogs.map((post) => {
                const imageUrl = post.thumbnailUrl
                const altText = post.thumbnailAlt ?? post.title

                return (
                  <article key={post.id} className="blog-card">
                    <div className="blog-card-media">
                      {imageUrl ? (
                        <Image
                          src={imageUrl}
                          alt={altText}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="blog-card-image"
                        />
                      ) : (
                        <div className="blog-card-placeholder">No Image</div>
                      )}
                    </div>
                    <div className="blog-card-content">
                      <div className="blog-card-meta">{formatDate(post.publishedAt)}</div>
                      <h3 className="blog-card-title">{post.title}</h3>
                      <p className="blog-card-description">{post.description}</p>
                      {post.slug ? (
                        <Link className="blog-card-link" href={`/blog/${post.slug}`}>
                          Read More
                        </Link>
                      ) : null}
                    </div>
                  </article>
                )
              })}
            </div>
          ) : null}
        </div>
      </section>
    </main>
  )
}
