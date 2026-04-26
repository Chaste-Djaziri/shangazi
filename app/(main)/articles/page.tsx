import { createImageUrlBuilder } from "@sanity/image-url"
import { marked } from "marked"
import type { SanityImageSource } from "@sanity/image-url"
import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import type { ReactNode } from "react"
import { PortableText, type PortableTextBlock, type PortableTextComponents } from "next-sanity"
import { client } from "@/sanity/client"
import { neonAuth } from "@neondatabase/auth/next/server"
import { redirect } from "next/navigation"
import { BookOpen } from "lucide-react"

export const metadata: Metadata = {
  title: "Member Blog | SEC Portal",
  description: "Exclusive stories and guidance for SEC Portal members.",
}

type BlogPost = {
  _id: string
  title: string
  slug: string
  publishedAt?: string
  author?: string
  image?: SanityImageSource
  body?: PortableTextBlock[]
  content?: string
  isPublic?: boolean
}

// Portal query fetches all posts
const PORTAL_POSTS_QUERY = `*[
  _type == "post" && defined(slug.current)
]|order(publishedAt desc){
  _id,
  title,
  "slug": slug.current,
  publishedAt,
  author,
  image,
  body,
  content,
  isPublic
}`

const options = { next: { revalidate: 60 } }

const { projectId, dataset } = client.config()
const urlFor = (source: SanityImageSource) =>
  projectId && dataset ? createImageUrlBuilder({ projectId, dataset }).image(source) : null

const portableTextComponentsList: PortableTextComponents = {
  block: {
    normal: ({ children }: { children?: ReactNode }) => <p className="mb-2">{children}</p>,
    h2: ({ children }: { children?: ReactNode }) => <h3 className="text-lg font-semibold">{children}</h3>,
    h3: ({ children }: { children?: ReactNode }) => <h4 className="text-base font-semibold">{children}</h4>,
  },
}

const renderExcerpt = (post: BlogPost) => {
  if (Array.isArray(post.body) && post.body.length > 0) {
    return (
      <div className="prose prose-sm max-w-none line-clamp-3 text-gray-500 font-marcellus">
        <PortableText value={post.body.slice(0, 1)} components={portableTextComponentsList} />
      </div>
    )
  }
  return <p className="text-gray-500 text-sm line-clamp-3 font-marcellus">Read the full article in the portal.</p>
}

const formatDate = (value?: string) => {
  if (!value) return ""
  const date = new Date(value)
  return date.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
}

export default async function PortalBlogPage() {
  const { user } = await neonAuth()
  if (!user) redirect("/login")

  const blogs = await client.fetch<BlogPost[]>(PORTAL_POSTS_QUERY, {}, options)

  return (
    <div className="max-w-full mx-auto pb-20">
      <header className="mb-12">
        <h1 className="text-3xl font-serif text-gray-900 mb-2">Member Articles</h1>
        <p className="text-gray-500 font-marcellus">
          Deep dives and exclusive guidance only for SEC Portal members.
        </p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogs.map((post) => {
          const imageUrl = post.image ? urlFor(post.image)?.width(800).height(500).url() : undefined
          return (
            <Link 
              key={post._id} 
              href={`/articles/${post.slug}`}
              className="group bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col"
            >
              <div className="relative aspect-[16/10] bg-gray-100">
                {imageUrl ? (
                  <Image src={imageUrl} alt={post.title} fill className="object-cover group-hover:scale-105 transition-transform duration-500" />
                ) : (
                  <div className="absolute inset-0 flex items-center justify-center text-gray-300">
                    <BookOpen size={48} />
                  </div>
                )}
                {!post.isPublic && (
                  <div className="absolute top-4 left-4 bg-primary px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-white shadow-sm flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                    Premium
                  </div>
                )}
              </div>
              <div className="p-6 flex-1 flex flex-col">
                <div className="flex items-center gap-2 mb-3">
                  <span className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                    {formatDate(post.publishedAt)}
                  </span>
                </div>
                <h3 className="text-xl font-serif text-gray-900 mb-3 group-hover:text-primary transition-colors line-clamp-2">
                  {post.title}
                </h3>
                {renderExcerpt(post)}
                <div className="mt-6 pt-4 border-t border-gray-50 flex items-center justify-between text-primary font-bold text-xs uppercase tracking-widest">
                  <span>Read Article</span>
                  <div className="w-6 h-6 rounded-full bg-primary/5 flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-colors">
                    →
                  </div>
                </div>
              </div>
            </Link>
          )
        })}
      </div>
    </div>
  )
}
