import SkeletonBlock from "./SkeletonBlock"

export default function PageSkeleton() {
  return (
    <main className="skeleton-page" role="status" aria-live="polite" aria-label="Loading content">
      <section className="skeleton-hero">
        <SkeletonBlock className="skeleton-line w-64 h-6" />
        <SkeletonBlock className="skeleton-line w-96" />
        <SkeletonBlock className="skeleton-line w-72" />
      </section>

      <section className="skeleton-grid">
        {Array.from({ length: 6 }).map((_, index) => (
          <div className="skeleton-card" key={`card-${index}`}>
            <SkeletonBlock className="skeleton-media" />
            <SkeletonBlock className="skeleton-line w-40" />
            <SkeletonBlock className="skeleton-line w-56" />
            <SkeletonBlock className="skeleton-line w-32" />
          </div>
        ))}
      </section>
    </main>
  )
}
