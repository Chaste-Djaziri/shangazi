import imageUrlBuilder from "@sanity/image-url"
import type { SanityImageSource } from "@sanity/image-url/lib/types/types"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import type { PortableTextBlock } from "next-sanity"

import { client } from "@/sanity/client"

export const metadata: Metadata = {
  title: "Blogs | Shangazi Emma Claudine",
  description: "Latest blogs and articles from Shangazi Emma Claudine, focusing on reproductive health, relationships, and youth empowerment.",
  keywords: [
    "Shangazi Emma Claudine blog",
    "Emma Claudine articles",
    "Rwanda blogs",
    "reproductive health blog",
    "youth counseling articles",
    "Shangazi content",
  ],
}

type BlogPost = {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  image?: SanityImageSource
  body?: PortableTextBlock[]
}

const POSTS_QUERY = `*[
  _type == "post" && defined(slug.current)
]|order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  image,
  body
}`

const options = { next: { revalidate: 600 } }

const { projectId, dataset } = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? imageUrlBuilder({ projectId, dataset }).image(source) : null

type PortableTextChild = { _type?: string; text?: string }

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

const buildExcerpt = (body?: PortableTextBlock[]) => {
  const text = toPlainText(body)
  if (!text) return "No description available."
  return text.length > 180 ? `${text.slice(0, 180)}...` : text
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

async function getBlogs(): Promise<BlogPost[]> {
  const posts = await client.fetch<BlogPost[]>(POSTS_QUERY, {}, options)
  return posts ?? []
}

export default async function BlogPage() {
  const blogs = await getBlogs()

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
          {blogs.length === 0 ? <div className="blog-empty">No posts available right now.</div> : null}
          {blogs.length > 0 ? (
            <div className="blog-layout">
              <div className="blog-main">
                <h2 className="blog-section-heading">
                  Blogs / <span className="blog-section-accent">Articles</span>
                </h2>
                <div className="blog-list">
                  {blogs.map((post) => {
                    const imageUrl = post.image ? urlFor(post.image)?.width(600).height(400).url() : undefined
                    const altText = post.title

                    return (
                      <article key={post._id} className="blog-row-card">
                        <div className="blog-row-media">
                          {imageUrl ? (
                            <Image
                              src={imageUrl}
                              alt={altText}
                              fill
                              sizes="(max-width: 768px) 100vw, 300px"
                              className="blog-row-image"
                            />
                          ) : (
                            <div className="blog-row-placeholder" aria-hidden="true" />
                          )}
                        </div>
                        <div className="blog-row-content">
                          <h3 className="blog-row-title">{post.title}</h3>
                          <p className="blog-row-description">{buildExcerpt(post.body)}</p>
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
                    const imageUrl = post.image ? urlFor(post.image)?.width(200).height(200).url() : undefined
                    const altText = post.title
                    return (
                      <Link
                        key={`trend-${post._id}`}
                        prefetch
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
          ) : null}
        </div>
      </section>
    </main>
  )
}
