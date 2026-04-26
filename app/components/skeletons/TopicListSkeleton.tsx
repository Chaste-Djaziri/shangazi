import SkeletonBlock from "./SkeletonBlock"

export default function TopicListSkeleton() {
  return (
    <section className="topics">
      <div className="topics-container">
        <div className="topics-content">
          <SkeletonBlock className="h-4 w-24 mb-4 mx-auto" />
          <SkeletonBlock className="h-12 w-96 mb-6 mx-auto" />
          <SkeletonBlock className="h-6 w-full max-w-2xl mb-12 mx-auto" />
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {Array.from({ length: 3 }).map((_, index) => (
              <div key={index} className="bg-white rounded-[40px] overflow-hidden shadow-sm border border-gray-100 flex flex-col h-[600px]">
                <div className="p-8 lg:p-10 flex-1">
                  <div className="w-16 h-16 rounded-full bg-gray-50 flex items-center justify-center mb-6">
                    <SkeletonBlock className="w-8 h-8 rounded-full" />
                  </div>
                  <SkeletonBlock className="h-8 w-3/4 mb-4" />
                  <SkeletonBlock className="h-4 w-full mb-2" />
                  <SkeletonBlock className="h-4 w-full mb-2" />
                  <SkeletonBlock className="h-4 w-2/3 mb-6" />
                  <SkeletonBlock className="h-6 w-32" />
                </div>
                <SkeletonBlock className="h-[254px] w-full" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
