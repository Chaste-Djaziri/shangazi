import SkeletonBlock from "./SkeletonBlock"

export default function FooterSkeleton() {
  return (
    <footer className="skeleton-footer" aria-hidden="true">
      <div className="skeleton-footer-inner">
        <div className="skeleton-footer-brand">
          <SkeletonBlock className="skeleton-logo" />
          <SkeletonBlock className="skeleton-line w-56" />
          <SkeletonBlock className="skeleton-line w-44" />
        </div>
        <div className="skeleton-footer-links">
          <SkeletonBlock className="skeleton-line w-24" />
          <SkeletonBlock className="skeleton-line w-20" />
          <SkeletonBlock className="skeleton-line w-28" />
          <SkeletonBlock className="skeleton-line w-24" />
        </div>
        <div className="skeleton-footer-links">
          <SkeletonBlock className="skeleton-line w-24" />
          <SkeletonBlock className="skeleton-line w-20" />
          <SkeletonBlock className="skeleton-line w-28" />
          <SkeletonBlock className="skeleton-line w-24" />
        </div>
        <div className="skeleton-footer-links">
          <SkeletonBlock className="skeleton-line w-24" />
          <SkeletonBlock className="skeleton-line w-20" />
          <SkeletonBlock className="skeleton-line w-28" />
          <SkeletonBlock className="skeleton-line w-24" />
        </div>
      </div>
    </footer>
  )
}
