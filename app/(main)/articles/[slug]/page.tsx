import { createImageUrlBuilder } from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url"
import { marked } from "marked"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound, redirect } from "next/navigation"
import type { ReactNode } from "react"
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity"
import { client } from "@/sanity/client"
import { neonAuth } from "@neondatabase/auth/next/server"

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
  isPublic?: boolean
}

type PortableTextChild = { _type?: string; text?: string }

// Portal query fetches any post regardless of isPublic
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
  content,
  isPublic
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

const options = { next: { revalidate: 60 } }

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

const formatDate = (value?: string) => {
  if (!value) return ""
  const date = new Date(value)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function PortalBlogDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { user } = await neonAuth()
  if (!user) redirect("/login")

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

  const relatedPosts = (related ?? []).filter((post) => post.slug && post._id !== blog._id)
  
  const heroUrl = blog.image ? urlFor(blog.image)?.width(1600).height(900).url() : undefined
  const galleryUrls =
    blog.gallery?.map((img) => ({
      url: urlFor(img)?.width(800).height(600).url(),
      alt: blog.title,
    })) ?? []
  
  const embed = buildEmbed(blog.videoUrl)

  return (
    <main className="max-w-5xl mx-auto pb-20">
      {/* Article Header */}
      <div className="mb-8">
        <Link href="/articles" className="text-primary font-bold text-xs uppercase tracking-widest hover:underline flex items-center gap-2 mb-6">
          ← Back to Articles
        </Link>
        
        <div className="flex items-center gap-3 mb-4">
          <span className="text-xs font-bold text-gray-400 uppercase tracking-widest">
            {formatDate(blog.publishedAt)}
          </span>
          {!blog.isPublic && (
            <span className="bg-primary/10 text-primary text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
              Premium
            </span>
          )}
        </div>

        <h1 className="text-4xl lg:text-5xl font-serif text-gray-900 leading-tight mb-6">
          {blog.title}
        </h1>

        {blog.author && (
          <p className="text-gray-500 font-marcellus">
            By <span className="text-gray-900 font-bold">{blog.author}</span> • {viewsCount} views
          </p>
        )}
      </div>

      {heroUrl && (
        <div className="relative aspect-[21/9] rounded-3xl overflow-hidden mb-12 shadow-2xl">
          <Image src={heroUrl} alt={blog.title} fill className="object-cover" priority />
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        <div className="lg:col-span-2">
          {/* Article Body */}
          <div className="prose prose-lg max-w-none font-marcellus text-gray-700">
            {Array.isArray(blog.body) ? (
              <PortableText value={blog.body} components={portableTextComponentsDetail} />
            ) : typeof blog.body === "string" ? (
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.body) }} />
            ) : blog.content ? (
              <div dangerouslySetInnerHTML={{ __html: renderMarkdown(blog.content) }} />
            ) : null}
          </div>

          {/* Video Embed if exists */}
          {embed.embedUrl && (
            <div className="mt-12 aspect-video rounded-2xl overflow-hidden shadow-lg">
              <iframe
                src={embed.embedUrl}
                title={blog.title}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                allowFullScreen
              />
            </div>
          )}

          {/* Gallery */}
          {galleryUrls.length > 0 && (
            <div className="mt-16 grid grid-cols-2 gap-4">
              {galleryUrls.map((img, idx) => (
                <div key={idx} className="relative aspect-[4/3] rounded-2xl overflow-hidden">
                  <Image src={img.url!} alt={img.alt} fill className="object-cover" />
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Sidebar / Related */}
        <aside className="space-y-8">
          <div className="bg-gray-50 rounded-3xl p-8 border border-gray-100">
            <h3 className="text-xl font-serif mb-6">More Articles</h3>
            <div className="space-y-6">
              {relatedPosts.map((post) => {
                const thumb = post.image ? urlFor(post.image)?.width(200).height(200).url() : undefined
                return (
                  <Link key={post._id} href={`/articles/${post.slug}`} className="flex gap-4 group">
                    <div className="relative w-16 h-16 rounded-xl overflow-hidden shrink-0 bg-gray-200">
                      {thumb && <Image src={thumb} alt={post.title} fill className="object-cover group-hover:scale-110 transition-transform" />}
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-gray-900 group-hover:text-primary transition-colors line-clamp-2">
                        {post.title}
                      </h4>
                      <p className="text-[10px] text-gray-400 mt-1 uppercase tracking-widest">
                        {formatDate(post.publishedAt)}
                      </p>
                    </div>
                  </Link>
                )
              })}
            </div>
          </div>
        </aside>
      </div>
    </main>
  )
}
