import BlogListSkeleton from "../../components/skeletons/BlogListSkeleton"

export default function Loading() {
  return (
    <div className="max-w-full mx-auto pb-20">
      <header className="mb-12">
        <div className="h-10 w-64 bg-gray-100 rounded-lg animate-pulse mb-4" />
        <div className="h-6 w-96 bg-gray-50 rounded-lg animate-pulse" />
      </header>
      <BlogListSkeleton />
    </div>
  )
}
