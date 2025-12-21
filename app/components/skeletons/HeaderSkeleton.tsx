import SkeletonBlock from "./SkeletonBlock"

export default function HeaderSkeleton() {
  return (
    <header className="skeleton-header" aria-hidden="true">
      <div className="skeleton-header-inner">
        <SkeletonBlock className="skeleton-logo" />
        <div className="skeleton-nav">
          <SkeletonBlock className="skeleton-line w-24" />
          <SkeletonBlock className="skeleton-line w-20" />
          <SkeletonBlock className="skeleton-line w-24" />
          <SkeletonBlock className="skeleton-line w-20" />
        </div>
        <div className="skeleton-actions">
          <SkeletonBlock className="skeleton-circle w-10 h-10" />
          <SkeletonBlock className="skeleton-circle w-10 h-10" />
        </div>
      </div>
    </header>
  )
}
