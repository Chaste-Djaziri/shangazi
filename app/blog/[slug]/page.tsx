import { notFound } from "next/navigation"
import Image from "next/image"
import Link from "next/link"
import { marked } from "marked"
import type { Tokens } from "marked"
import type { Metadata } from "next"

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
const isLocalImage = (src?: string) => {
  if (!src) return true
  return src.includes("localhost") || src.includes("127.0.0.1") || src.includes("::1")
}

const resolveAssetUrl = (src?: string | unknown) => {
  if (!src || typeof src !== "string") return ""
  const trimmed = src.trim()
  if (!trimmed) return ""
  if (trimmed.startsWith("http")) return trimmed
  const base = (STRAPI_BASE ?? "http://localhost:1337").replace(/\/$/, "")
  return `${base}${trimmed}`
}

const isVideoUrl = (href?: string) => {
  if (!href) return false
  try {
    const url = new URL(href)
    const host = url.hostname.toLowerCase()
    return host.includes("youtube.com") || host === "youtu.be" || host.includes("vimeo.com")
  } catch {
    return false
  }
}

const toEmbedUrl = (href: string) => {
  try {
    const url = new URL(href)
    const host = url.hostname.toLowerCase()
    if (host.includes("youtube.com")) {
      const videoId = url.searchParams.get("v")
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }
    if (host === "youtu.be") {
      const videoId = url.pathname.replace("/", "")
      return videoId ? `https://www.youtube.com/embed/${videoId}` : null
    }
    if (host.includes("vimeo.com")) {
      const parts = url.pathname.split("/").filter(Boolean)
      const videoId = parts.pop()
      return videoId ? `https://player.vimeo.com/video/${videoId}` : null
    }
    return null
  } catch {
    return null
  }
}

const isVideoFile = (href?: string | unknown) => {
  if (!href || typeof href !== "string") return false
  return /\.(mp4|webm|mov|m4v|ogg)$/i.test(href.split("?")[0])
}

const renderer = new marked.Renderer()

renderer.image = ({ href = "", title, text = "" }: Tokens.Image) => {
  const url = resolveAssetUrl(href)
  const titleAttr = title ? ` title="${title}"` : ""
  return `<figure class="md-image"><img src="${url}" alt="${text}"${titleAttr} /></figure>`
}

renderer.link = ({ href = "", title, text = "" }: Tokens.Link) => {
  if (isVideoFile(href)) {
    const src = resolveAssetUrl(href)
    const titleAttr = title ? ` title="${title}"` : ""
    return `<div class="md-embed-video md-embed-video-file"><video src="${src}" controls preload="metadata" playsinline${titleAttr ? ` aria-label="${title}"` : ""}>Your browser does not support the video tag.</video></div>`
  }
  if (isVideoUrl(href)) {
    const embed = toEmbedUrl(href)
    if (embed) {
      return `<div class="md-embed-video"><iframe src="${embed}" title="Video" allowfullscreen frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe></div>`
    }
  }
  const titleAttr = title ? ` title="${title}"` : ""
  const hrefSafe = href || "#"
  return `<a href="${hrefSafe}"${titleAttr}>${text || hrefSafe}</a>`
}

const parseMarkdown = (content?: string) => {
  if (!content) return ""
  return marked.parse(content, { renderer })
}

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

function buildEmbed(videoEmbed?: string): { embedHtml?: string; externalUrl?: string } {
  if (!videoEmbed) return {}
  if (videoEmbed.toLowerCase().includes("<iframe")) {
    return { embedHtml: videoEmbed }
  }

  try {
    const url = new URL(videoEmbed)
    const host = url.hostname.toLowerCase()
    let videoId: string | undefined
    if (host.includes("youtube.com")) {
      videoId = url.searchParams.get("v") ?? undefined
    } else if (host === "youtu.be") {
      videoId = url.pathname.replace("/", "")
    }

    if (videoId) {
      const embedUrl = `https://www.youtube.com/embed/${videoId}`
      const iframe = `<iframe src="${embedUrl}" title="Video" allowfullscreen frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"></iframe>`
      return { embedHtml: iframe }
    }

    return { externalUrl: videoEmbed }
  } catch {
    return {}
  }
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const blog = await fetchBlog(decodedSlug)
  if (!blog) {
    return (
      <main className="blog-detail-page">
        <section className="blog-detail-hero" style={{ backgroundImage: 'url("/backgrounds/page-hero-background.png")' }}>
          <div className="blog-detail-overlay" />
          <div className="blog-detail-hero-content">
            <h1 className="blog-detail-title">Blog Not Available</h1>
            <p className="blog-detail-meta">The blog you are looking for could not be found.</p>
          </div>
        </section>
        <section className="blog-detail-section">
          <div className="blog-detail-container blog-detail-empty">
            <div className="blog-detail-main">
              <div className="blog-detail-empty-message">
                <p>We couldn&apos;t load this blog. It may have been removed or is unpublished.</p>
                <Link className="blog-card-link" href="/blog">
                  Back to Blogs
                </Link>
              </div>
            </div>
          </div>
        </section>
      </main>
    )
  }

  const related = await fetchRelated(decodedSlug)
  const embedData = buildEmbed(blog.videoEmbed)

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
                  unoptimized={isLocalImage(blog.thumbnailUrl)}
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
                  dangerouslySetInnerHTML={{ __html: parseMarkdown(blog.content) }}
                />
              ) : null}
            </div>

            {embedData.embedHtml ? (
              <div className="blog-detail-video" dangerouslySetInnerHTML={{ __html: embedData.embedHtml }} />
            ) : embedData.externalUrl ? (
              <div className="blog-detail-video-link">
                <a href={embedData.externalUrl} target="_blank" rel="noreferrer">
                  Watch video
                </a>
              </div>
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
                            unoptimized={isLocalImage(img.url)}
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

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const blog = await fetchBlog(decodedSlug)

  const title = blog?.title ? `${blog.title} | Shangazi` : "Blog | Shangazi"
  const description = blog?.content ? blog.content.slice(0, 150) : "Read the latest story from Shangazi."
  const image = blog?.thumbnailUrl ?? "/profile/about.png"

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shangazi.rw"
  const url = `${baseUrl}/blog/${decodedSlug}`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url,
      images: [{ url: image }],
      type: "article",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: [image],
    },
  }
}
