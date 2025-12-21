import SkeletonBlock from "./SkeletonBlock"

export default function BlogDetailSkeleton() {
  return (
    <main className="skeleton-page" role="status" aria-live="polite" aria-label="Loading blog post">
      <section className="skeleton-hero">
        <SkeletonBlock className="skeleton-media h-56" />
        <SkeletonBlock className="skeleton-line w-64 h-6" />
        <SkeletonBlock className="skeleton-line w-40" />
      </section>

      <section className="skeleton-stack">
        <SkeletonBlock className="skeleton-line w-full" />
        <SkeletonBlock className="skeleton-line w-11/12" />
        <SkeletonBlock className="skeleton-line w-10/12" />
        <SkeletonBlock className="skeleton-line w-9/12" />
      </section>
    </main>
  )
}
