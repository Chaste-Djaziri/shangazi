import SkeletonBlock from "./SkeletonBlock"

export default function CourseListSkeleton() {
  return (
    <div className="max-w-[1400px] mx-auto px-6 lg:px-10 py-20" role="status" aria-live="polite" aria-label="Loading courses">
      <header className="mb-16 text-center max-w-2xl mx-auto flex flex-col items-center">
        <SkeletonBlock className="h-12 w-64 mb-4" />
        <SkeletonBlock className="h-6 w-full max-w-md" />
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10">
        {Array.from({ length: 6 }).map((_, index) => (
          <div key={index} className="bg-white rounded-3xl border border-gray-100 overflow-hidden flex flex-col h-[500px]">
            <SkeletonBlock className="aspect-[16/10]" />
            <div className="p-8 flex-1 flex flex-col">
              <SkeletonBlock className="h-8 w-3/4 mb-3" />
              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-full mb-2" />
              <SkeletonBlock className="h-4 w-2/3 mb-6" />
              <div className="mt-auto pt-6 border-t border-gray-50 flex justify-between items-center">
                <SkeletonBlock className="h-4 w-24" />
                <SkeletonBlock className="w-10 h-10 rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
