import SkeletonBlock from "./SkeletonBlock"

export default function BlogListSkeleton() {
  return (
    <main className="skeleton-page" role="status" aria-live="polite" aria-label="Loading blog list">
      <section className="skeleton-hero">
        <SkeletonBlock className="skeleton-line w-40 h-6" />
        <SkeletonBlock className="skeleton-line w-80" />
      </section>

      <section className="skeleton-blog-list">
        {Array.from({ length: 5 }).map((_, index) => (
          <article className="skeleton-blog-row" key={`blog-row-${index}`}>
            <SkeletonBlock className="skeleton-media" />
            <div className="skeleton-blog-text">
              <SkeletonBlock className="skeleton-line w-56" />
              <SkeletonBlock className="skeleton-line w-72" />
              <SkeletonBlock className="skeleton-line w-40" />
            </div>
          </article>
        ))}
      </section>
    </main>
  )
}
