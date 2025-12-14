import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"
import { PortableText, type PortableTextBlock } from "next-sanity"

import { client } from "@/sanity/client"

type BlogPost = {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  image?: SanityImageSource
  body?: PortableTextBlock[]
}

type PortableTextChild = { _type?: string; text?: string }

const POST_QUERY = `*[_type == "post" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  image,
  body
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
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null

const toPlainText = (blocks?: PortableTextBlock[]) =>
  (blocks ?? [])
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

const formatDate = (value?: string) => {
  if (!value) return ""
  const date = new Date(value)
  return date.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  })
}

export default async function BlogDetailPage({ params }: { params: { slug: string } }) {
  const decodedSlug = decodeURIComponent(params.slug)
  const [blog, related] = await Promise.all([
    client.fetch<BlogPost | null>(POST_QUERY, { slug: decodedSlug }, options),
    client.fetch<BlogPost[]>(RELATED_QUERY, { slug: decodedSlug }, options),
  ])

  if (!blog) {
    notFound()
  }

  const heroUrl = blog.image ? urlFor(blog.image)?.width(1600).height(900).url() : undefined
  const relatedPosts = (related ?? []).filter((post) => post.slug && post._id !== blog._id)

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
              <p className="blog-detail-meta">{formatDate(blog.publishedAt)}</p>
              <h1 className="blog-detail-title">{blog.title}</h1>
              {Array.isArray(blog.body) ? (
                <div className="blog-detail-content-html prose max-w-none">
                  <PortableText value={blog.body} />
                </div>
              ) : null}
            </div>
          </article>

          <aside className="blog-detail-sidebar">
            <h2 className="blog-trending-heading">Trending</h2>
            <div className="blog-trending-list">
              {relatedPosts.slice(0, 4).map((post) => {
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

export async function generateMetadata({ params }: { params: { slug: string } }): Promise<Metadata> {
  const decodedSlug = decodeURIComponent(params.slug)
  const blog = await client.fetch<BlogPost | null>(POST_QUERY, { slug: decodedSlug }, options)
  if (!blog) {
    notFound()
  }

  const title = blog?.title ? `${blog.title} | Shangazi Emma Claudine` : "Blog | Shangazi Emma Claudine"
  const descriptionText = toPlainText(blog?.body)
  const description = descriptionText
    ? descriptionText.slice(0, 150)
    : "Read the latest story from Shangazi Emma Claudine."

  const image = blog?.image ? urlFor(blog.image)?.width(1200).height(630).url() : "/profile/about.png"

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
