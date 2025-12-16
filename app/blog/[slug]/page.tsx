import { createImageUrlBuilder } from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url"
import { marked } from "marked"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import type { ReactNode } from "react"
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity"

import { client } from "@/sanity/client"

type BlogPost = {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  author?: string
  image?: SanityImageSource
  gallery?: SanityImageSource[]
  videoUrl?: string
  externalLinks?: { label?: string; url?: string }[]
  body?: PortableTextBlock[] | string
  content?: string
}

type PortableTextChild = { _type?: string; text?: string }

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  author,
  image,
  gallery,
  videoUrl,
  externalLinks,
  body,
  content
}`

const RELATED_QUERY = `*[
  _type == "post" && defined(slug.current) && slug.current != $slug
]|order(publishedAt desc)[0...5]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  image
}`

const options = { next: { revalidate: 600 } }

const { projectId, dataset } = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null

const portableTextComponentsDetail: PortableTextComponents = {
  block: {
    normal: ({ children }: { children?: ReactNode }) => <p className="mb-4">{children}</p>,
    h2: ({ children }: { children?: ReactNode }) => (
      <h2 className="text-2xl font-semibold mb-3 mt-6">{children}</h2>
    ),
    h3: ({ children }: { children?: ReactNode }) => (
      <h3 className="text-xl font-semibold mb-2 mt-4">{children}</h3>
    ),
  },
  list: {
    bullet: ({ children }: { children?: ReactNode }) => <ul className="list-disc pl-6 mb-4">{children}</ul>,
    number: ({ children }: { children?: ReactNode }) => <ol className="list-decimal pl-6 mb-4">{children}</ol>,
  },
  marks: {
    strong: ({ children }: { children?: ReactNode }) => <strong className="font-semibold">{children}</strong>,
    em: ({ children }: { children?: ReactNode }) => <em className="italic">{children}</em>,
  },
}

const toPlainText = (blocks?: PortableTextBlock[] | string) => {
  if (typeof blocks === "string") {
    const html = marked.parse(blocks, { async: false }) as string
    return html.replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim()
  }

  return (blocks ?? [])
    .map((block) => {
      if (block._type !== "block" || !Array.isArray(block.children)) return ""
      return block.children
        .map((child) =>
          typeof child === "object" && "text" in child ? (child as PortableTextChild).text ?? "" : "",
        )
        .join("")
    })
    .join(" ")
    .trim()
}
const renderMarkdown = (value?: string) => {
  if (!value) return ""
  return marked.parse(value, { async: false }) as string
}

const buildEmbed = (videoUrl?: string): { embedUrl?: string; externalUrl?: string } => {
  if (!videoUrl) return {}
  try {
    const url = new URL(videoUrl)
    const host = url.hostname.toLowerCase()
    const path = url.pathname.replace("/", "")

    if (host.includes("youtube.com")) {
      const id = url.searchParams.get("v")
      if (id) return { embedUrl: `https://www.youtube.com/embed/${id}` }
    }
    if (host === "youtu.be") {
      if (path) return { embedUrl: `https://www.youtube.com/embed/${path}` }
    }
    if (host.includes("vimeo.com") && path) {
      return { embedUrl: `https://player.vimeo.com/video/${path}` }
    }
  } catch {
    return { externalUrl: videoUrl }
  }
  return { externalUrl: videoUrl }
}

const extractYouTubeId = (videoUrl?: string) => {
  if (!videoUrl) return undefined
  try {
    const url = new URL(videoUrl)
    const host = url.hostname.toLowerCase()
    const segments = url.pathname.split("/").filter(Boolean)
    const lastSegment = segments[segments.length - 1]

    if (host.includes("youtube.com")) {
      return url.searchParams.get("v") ?? (segments.includes("embed") ? lastSegment : undefined)
    }
    if (host === "youtu.be") {
      return lastSegment
    }
  } catch {
    return undefined
  }
  return undefined
}

const buildVideoSchema = (
  blog: BlogPost,
  embed: { embedUrl?: string; externalUrl?: string },
  pageUrl: string,
) => {
  const videoId = extractYouTubeId(blog.videoUrl)
  const thumbnail = videoId ? `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg` : undefined
  const description = toPlainText(blog.body ?? blog.content) || blog.title

  if (!embed.embedUrl && !embed.externalUrl) return null

  return {
    "@context": "https://schema.org",
    "@type": "VideoObject",
    name: blog.title ?? "Video",
    description,
    thumbnailUrl: thumbnail ? [thumbnail] : undefined,
    uploadDate: blog.publishedAt ? new Date(blog.publishedAt).toISOString() : undefined,
    embedUrl: embed.embedUrl,
    contentUrl: embed.externalUrl ?? (videoId ? `https://www.youtube.com/watch?v=${videoId}` : undefined),
    url: pageUrl,
  }
}

const formatDate = (value?: string) => {
  if (!value) return ""
  const date = new Date(value)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function BlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const decodedSlug = decodeURIComponent(slug)
  const baseUrl =
    process.env.NEXT_PUBLIC_SITE_URL ?? `http://localhost:${process.env.PORT ?? 3000}`
  const [blog, related] = await Promise.all([
    client.fetch<BlogPost | null>(POST_QUERY, { slug: decodedSlug }, options),
    client.fetch<BlogPost[]>(RELATED_QUERY, { slug: decodedSlug }, options),
  ])

  if (!blog) {
    notFound()
  }

  // Increment view count for this post and fetch updated views
  let viewsCount = 0
  try {
    const incRes = await fetch(new URL(`/api/blog-views`, baseUrl).toString(), {
      method: "POST",
      body: JSON.stringify({ postId: blog._id }),
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })
    const incJson = await incRes.json()
    viewsCount = incJson?.views ?? 0
  } catch (e) {
    viewsCount = 0
  }

  // Fetch view counts for related posts in bulk
  const relatedPosts = (related ?? []).filter((post) => post.slug && post._id !== blog._id)
  let relatedCounts: Record<string, number> = {}
  try {
    const bulkRes = await fetch(new URL(`/api/blog-views/bulk`, baseUrl).toString(), {
      method: "POST",
      body: JSON.stringify({ postIds: relatedPosts.map((p) => p._id) }),
      headers: { "Content-Type": "application/json" },
      cache: "no-store",
    })
    const bulkJson = await bulkRes.json()
    relatedCounts = bulkJson?.counts ?? {}
  } catch {
    relatedCounts = {}
  }

  const heroUrl = blog.image ? urlFor(blog.image)?.width(1600).height(900).url() : undefined
  const galleryUrls =
    blog.gallery?.map((img) => ({
      url: urlFor(img)?.width(800).height(600).url(),
      alt: blog.title,
    })) ?? []
  
  const embed = buildEmbed(blog.videoUrl)
  const pageUrl = `${baseUrl}/blog/${decodedSlug}`
  const videoSchema = buildVideoSchema(blog, embed, pageUrl)

  return (
    <main className="blog-detail-page">
      <section
        className="blog-detail-hero"
        style={{ backgroundImage: `url(${heroUrl ?? "/backgrounds/page-hero-background.png"})` }}
      >
        <div className="blog-detail-overlay" />
      </section>

      <section className="blog-detail-section">
        <div className="blog-detail-container">
          <article className="blog-detail-main">
            {heroUrl ? (
              <div className="blog-detail-thumb">
                <Image
                  src={heroUrl}
                  alt={blog.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 800px"
                  className="blog-detail-thumb-img"
                />
              </div>
            ) : null}

            <div className="blog-detail-body">
              <p className="blog-detail-meta">
                {formatDate(blog.publishedAt)} {blog.author ? "•" : null} {blog.author ? `By ${blog.author}` : null}
                <span className="ml-2 text-sm text-gray-600">{viewsCount} views</span>
              </p>
              <h1 className="blog-detail-title">{blog.title}</h1>
              {Array.isArray(blog.body) ? (
                <div className="blog-detail-content-html prose max-w-none">
                  <PortableText value={blog.body} components={portableTextComponentsDetail} />
                </div>
              ) : typeof blog.body === "string" ? (
                <div
                  className="blog-detail-content-html prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.body) }}
                />
              ) : blog.content ? (
                <div
                  className="blog-detail-content-html prose max-w-none"
                  dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }}
                />
              ) : null}
            </div>

            {embed.embedUrl ? (
              <div className="blog-detail-video">
                <iframe
                  src={embed.embedUrl}
                  title={blog.title}
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                  allowFullScreen
                />
              </div>
            ) : embed.externalUrl ? (
              <div className="blog-detail-video-link">
                <a href={embed.externalUrl} target="_blank" rel="noreferrer">
                  Watch video
                </a>
              </div>
            ) : null}

            {videoSchema ? (
              <script
                type="application/ld+json"
                dangerouslySetInnerHTML={{ __html: JSON.stringify(videoSchema) }}
              />
            ) : null}

            {blog.externalLinks && blog.externalLinks.length > 0 ? (
              <div className="blog-detail-links">
                <h3>External Links</h3>
                <ul>
                  {blog.externalLinks.map(
                    (link, idx) =>
                      link?.url && (
                        <li key={idx}>
                          <a href={link.url} target="_blank" rel="noreferrer">
                            {link.label ?? link.url}
                          </a>
                        </li>
                      ),
                  )}
                </ul>
              </div>
            ) : null}

            {galleryUrls.length > 0 ? (
              <div className="blog-detail-gallery">
                {galleryUrls.map(
                  (img, idx) =>
                    img.url && (
                      <div key={idx} className="blog-detail-gallery-item">
                        <Image
                          src={img.url}
                          alt={img.alt ?? blog.title}
                          fill
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
              {relatedPosts
                .sort((a, b) => (relatedCounts[b._id] ?? 0) - (relatedCounts[a._id] ?? 0))
                .slice(0, 4)
                .map((post) => {
                const imageUrl = post.image ? urlFor(post.image)?.width(200).height(200).url() : undefined
                const altText = post.title
                return (
                  <Link
                    key={`detail-trend-${post._id}`}
                    className="blog-trending-item"
                    href={post.slug ? `/blog/${post.slug}` : "#"}
                  >
                    <div className="blog-trending-thumb">
                      {imageUrl ? (
                        <Image src={imageUrl} alt={altText} fill sizes="80px" className="blog-trending-image" />
                      ) : (
                        <div className="blog-trending-placeholder" aria-hidden="true" />
                      )}
                    </div>
                    <div className="blog-trending-text">
                      <p className="blog-trending-title">{post.title}</p>
                      <p className="text-sm text-gray-600">{relatedCounts[post._id] ?? 0} views</p>
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
  const blog = await client.fetch<BlogPost | null>(POST_QUERY, { slug: decodedSlug }, options)
  if (!blog) {
    notFound()
  }

  const title = blog?.title ? `${blog.title} | Shangazi Emma Claudine` : "Blog | Shangazi Emma Claudine"
  const descriptionText = toPlainText(blog?.body ?? blog?.content)
  const description = descriptionText
    ? descriptionText.slice(0, 150)
    : "Read the latest story from Shangazi Emma Claudine."

  const image =
    blog?.image ? urlFor(blog.image)?.width(1200).height(630).url() ?? "/profile/about.png" : "/profile/about.png"

  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://shangazi.rw"
  const url = `${baseUrl}/blog/${decodedSlug}`

  return {
    title,
    description,
    keywords: [
      blog?.title ?? "Shangazi Emma Claudine blog",
      "Shangazi Emma Claudine",
      "Emma Claudine",
      "Rwanda blog",
      "reproductive health",
      "youth counseling",
      "relationships",
    ],
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
