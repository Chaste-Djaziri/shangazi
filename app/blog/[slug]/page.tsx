import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { marked } from "marked"

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
    content?: string
    video_embed?: string
    external_links?: { label?: string; url?: string }[]
    thumbnail?: StrapiImage
    images?: StrapiImage[]
  }
  title?: string
  description?: string
  slug?: string
  publishedAt?: string
  content?: string
  video_embed?: string
  external_links?: { label?: string; url?: string }[]
  thumbnail?: StrapiImage
  images?: StrapiImage[]
}

type StrapiResponse = { data?: StrapiBlogRaw[] }

type BlogPost = {
  id: number | string
  title: string
  slug?: string
  publishedAt?: string
  content?: string
  videoEmbed?: string
  externalLinks?: { label?: string; url?: string }[]
  thumbnailUrl?: string
  thumbnailAlt?: string
  gallery?: { url?: string; alt?: string }[]
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
  // @ts-expect-error allow flexible shapes
  const attrs: StrapiImageAttributes | undefined = image?.data?.attributes ?? image
  if (!attrs) return {}
  const url = buildStrapiUrl(attrs.url)
  const alt = attrs.alternativeText
  return { url, alt }
}

const normalizeBlog = (raw: StrapiBlogRaw): BlogPost => {
  const attrs = raw.attributes ?? raw
  const { url, alt } = extractImageUrl(attrs?.thumbnail)
  const gallery =
    attrs?.images?.map((img) => {
      const { url: gUrl, alt: gAlt } = extractImageUrl(img)
      return { url: gUrl, alt: gAlt }
    }) ?? []

  return {
    id: raw.id ?? raw.documentId ?? crypto.randomUUID(),
    title: attrs?.title ?? "Untitled",
    slug: attrs?.slug,
    publishedAt: attrs?.publishedAt,
    content: attrs?.content,
    videoEmbed: attrs?.video_embed,
    externalLinks: attrs?.external_links,
    thumbnailUrl: url,
    thumbnailAlt: alt ?? attrs?.title ?? "Blog image",
    gallery,
  }
}

const buildHeaders = () => {
  const headers: Record<string, string> = { "Content-Type": "application/json" }
  if (STRAPI_TOKEN) {
    headers.Authorization = `Bearer ${STRAPI_TOKEN}`
  }
  return headers
}

async function fetchBlog(slug: string): Promise<BlogPost | null> {
  const base = (STRAPI_BASE ?? "http://localhost:1337").replace(/\/$/, "")
  const params = new URLSearchParams()
  params.set("filters[slug][$eq]", slug)
  params.set("populate", "*")
  if (STRAPI_TOKEN) params.set("publicationState", "preview")

  const res = await fetch(`${base}/api/blogs?${params.toString()}`, {
    headers: buildHeaders(),
    next: { revalidate: 300 },
  })

  if (!res.ok) {
    return null
  }

  const json = (await res.json()) as StrapiResponse
  const item = json.data?.[0]
  if (!item) return null
  return normalizeBlog(item)
}

async function fetchRelated(slug?: string): Promise<BlogPost[]> {
  const base = (STRAPI_BASE ?? "http://localhost:1337").replace(/\/$/, "")
  const params = new URLSearchParams()
  params.set("populate", "thumbnail")
  params.set("pagination[pageSize]", "5")
  params.set("sort", "publishedAt:desc")
  if (slug) params.set("filters[slug][$ne]", slug)
  if (STRAPI_TOKEN) params.set("publicationState", "preview")

  const res = await fetch(`${base}/api/blogs?${params.toString()}`, {
    headers: buildHeaders(),
    next: { revalidate: 300 },
  })
  if (!res.ok) return []
  const json = (await res.json()) as StrapiResponse
  return (json.data ?? []).map(normalizeBlog)
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

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const slug = decodeURIComponent(params.slug)
  const blog = await fetchBlog(slug)
  if (!blog) return notFound()

  const related = await fetchRelated(slug)

  return (
    <main className="blog-detail-page">
      <section className="blog-detail-hero" style={{ backgroundImage: `url(${blog.thumbnailUrl ?? "/backgrounds/page-hero-background.png"})` }}>
        <div className="blog-detail-overlay" />
      </section>

      <section className="blog-detail-section">
        <div className="blog-detail-container">
          <article className="blog-detail-main">
            {blog.thumbnailUrl ? (
              <div className="blog-detail-thumb">
                <Image
                  src={blog.thumbnailUrl}
                  alt={blog.thumbnailAlt ?? blog.title}
                  fill
                  unoptimized
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="blog-detail-thumb-img"
                />
              </div>
            ) : null}

            <div className="blog-detail-body">
              <p className="blog-detail-meta">{formatDate(blog.publishedAt)}</p>
              <h1 className="blog-detail-title">{blog.title}</h1>
              {blog.content ? (
                <div
                  className="blog-detail-content-html"
                  dangerouslySetInnerHTML={{ __html: marked.parse(blog.content) }}
                />
              ) : null}
            </div>

            {blog.videoEmbed ? (
              <div className="blog-detail-video" dangerouslySetInnerHTML={{ __html: blog.videoEmbed }} />
            ) : null}

            {blog.externalLinks && blog.externalLinks.length > 0 ? (
              <div className="blog-detail-links">
                <h3>External Links</h3>
                <ul>
                  {blog.externalLinks.map((link, idx) =>
                    link?.url ? (
                      <li key={idx}>
                        <a href={link.url} target="_blank" rel="noreferrer">
                          {link.label ?? link.url}
                        </a>
                      </li>
                    ) : null,
                  )}
                </ul>
              </div>
            ) : null}

            {blog.gallery && blog.gallery.length > 0 ? (
              <div className="blog-detail-gallery">
                {blog.gallery.map(
                  (img, idx) =>
                    img.url && (
                      <div key={idx} className="blog-detail-gallery-item">
                        <Image
                          src={img.url}
                          alt={img.alt ?? blog.title}
                          fill
                          unoptimized
                          sizes="(max-width: 768px) 100vw, 400px"
                          className="blog-detail-gallery-img"
                        />
                      </div>
                    ),
                )}
              </div>
            ) : null}
          </article>

          <aside className="blog-detail-sidebar">
            <h2 className="blog-trending-heading">Trending</h2>
            <div className="blog-trending-list">
              {related.slice(0, 4).map((post) => {
                const imageUrl = post.thumbnailUrl
                const altText = post.thumbnailAlt ?? post.title
                return (
                  <Link key={`detail-trend-${post.id}`} className="blog-trending-item" href={post.slug ? `/blog/${post.slug}` : "#"}>
                    <div className="blog-trending-thumb">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={altText} fill unoptimized sizes="80px" className="blog-trending-image" />
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
      </section>
    </main>
  )
}
