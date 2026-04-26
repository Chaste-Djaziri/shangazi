import SkeletonBlock from "./SkeletonBlock"

export default function VideoListSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20" role="status" aria-live="polite" aria-label="Loading videos">
      <header className="mb-16 text-center max-w-2xl mx-auto flex flex-col items-center">
        <SkeletonBlock className="h-12 w-48 mb-4" />
        <SkeletonBlock className="h-6 w-full max-w-md" />
      </header>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {Array.from({ length: 8 }).map((_, index) => (
          <div key={index} className="flex flex-col gap-4">
            <SkeletonBlock className="aspect-video rounded-3xl" />
            <div className="px-1">
              <SkeletonBlock className="h-6 w-3/4 mb-2" />
              <SkeletonBlock className="h-4 w-1/2" />
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
