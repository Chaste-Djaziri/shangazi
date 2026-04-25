import SkeletonBlock from "./SkeletonBlock"

function SkeletonSectionTitle() {
  return (
    <div className="skeleton-section-copy">
      <SkeletonBlock className="skeleton-line w-28 h-5" />
      <SkeletonBlock className="skeleton-line w-80 h-12" />
      <SkeletonBlock className="skeleton-line w-96 h-5" />
    </div>
  )
}

export default function HomePageSkeleton() {
  return (
    <main className="skeleton-home" role="status" aria-live="polite" aria-label="Loading homepage">
      <section className="skeleton-home-hero">
        <SkeletonBlock className="skeleton-home-hero-media" />
        <div className="skeleton-home-hero-overlay">
          <div className="skeleton-home-hero-copy">
            <SkeletonBlock className="skeleton-line w-36 h-5" />
            <SkeletonBlock className="skeleton-line w-[28rem] h-14" />
            <SkeletonBlock className="skeleton-line w-[22rem] h-14" />
            <div className="skeleton-home-cta-row">
              <SkeletonBlock className="skeleton-button-lg" />
              <SkeletonBlock className="skeleton-pill-wide" />
            </div>
          </div>
          <div className="skeleton-home-watch">
            <SkeletonBlock className="skeleton-circle w-12 h-12" />
            <SkeletonBlock className="skeleton-line w-24 h-4" />
          </div>
        </div>
      </section>

      <section className="skeleton-home-split">
        <div className="skeleton-home-text">
          <SkeletonSectionTitle />
          <SkeletonBlock className="skeleton-line w-full h-4" />
          <SkeletonBlock className="skeleton-line w-11/12 h-4" />
          <SkeletonBlock className="skeleton-line w-10/12 h-4" />
          <SkeletonBlock className="skeleton-button-md" />
        </div>
        <div className="skeleton-home-image-grid">
          <SkeletonBlock className="skeleton-media rounded-[28px]" />
          <SkeletonBlock className="skeleton-media rounded-[28px]" />
          <SkeletonBlock className="skeleton-media rounded-[28px]" />
          <SkeletonBlock className="skeleton-media rounded-[28px]" />
        </div>
      </section>

      <section className="skeleton-home-stats">
        {Array.from({ length: 4 }).map((_, index) => (
          <div className="skeleton-card skeleton-home-stat-card" key={`stat-${index}`}>
            <SkeletonBlock className="skeleton-line w-28 h-10" />
            <SkeletonBlock className="skeleton-line w-36 h-4" />
          </div>
        ))}
      </section>

      <section className="skeleton-home-section">
        <SkeletonSectionTitle />
        <div className="skeleton-home-cards">
          {Array.from({ length: 3 }).map((_, index) => (
            <div className="skeleton-card skeleton-home-topic-card" key={`topic-${index}`}>
              <SkeletonBlock className="skeleton-circle w-14 h-14" />
              <SkeletonBlock className="skeleton-line w-40 h-6" />
              <SkeletonBlock className="skeleton-line w-full h-4" />
              <SkeletonBlock className="skeleton-line w-11/12 h-4" />
              <SkeletonBlock className="skeleton-line w-24 h-4" />
              <SkeletonBlock className="skeleton-media skeleton-home-card-media" />
            </div>
          ))}
        </div>
      </section>

      <section className="skeleton-home-section">
        <div className="skeleton-home-stories-header">
          <SkeletonSectionTitle />
          <SkeletonBlock className="skeleton-button-md" />
        </div>
        <div className="skeleton-home-stories">
          <SkeletonBlock className="skeleton-media skeleton-home-story-feature" />
          <div className="skeleton-home-story-stack">
            <div className="skeleton-card skeleton-home-story-card">
              <SkeletonBlock className="skeleton-media skeleton-home-story-thumb" />
              <div className="skeleton-home-story-copy">
                <SkeletonBlock className="skeleton-line w-24 h-4" />
                <SkeletonBlock className="skeleton-line w-52 h-6" />
                <SkeletonBlock className="skeleton-line w-24 h-4" />
              </div>
            </div>
            <div className="skeleton-card skeleton-home-story-card">
              <SkeletonBlock className="skeleton-media skeleton-home-story-thumb" />
              <div className="skeleton-home-story-copy">
                <SkeletonBlock className="skeleton-line w-24 h-4" />
                <SkeletonBlock className="skeleton-line w-52 h-6" />
                <SkeletonBlock className="skeleton-line w-24 h-4" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="skeleton-home-banner">
        <SkeletonBlock className="skeleton-home-banner-media" />
        <div className="skeleton-home-banner-copy">
          <SkeletonBlock className="skeleton-line w-28 h-5" />
          <SkeletonBlock className="skeleton-line w-[32rem] h-12" />
          <div className="skeleton-home-watch">
            <SkeletonBlock className="skeleton-circle w-12 h-12" />
            <SkeletonBlock className="skeleton-line w-24 h-4" />
          </div>
        </div>
      </section>

      <section className="skeleton-home-split skeleton-home-testimonials">
        <SkeletonBlock className="skeleton-media skeleton-home-testimonial-media" />
        <div className="skeleton-home-text">
          <SkeletonSectionTitle />
          <div className="skeleton-card skeleton-home-quote-card">
            <SkeletonBlock className="skeleton-line w-full h-6" />
            <SkeletonBlock className="skeleton-line w-11/12 h-6" />
            <SkeletonBlock className="skeleton-line w-8/12 h-6" />
            <div className="skeleton-home-quote-footer">
              <div className="skeleton-home-quote-person">
                <SkeletonBlock className="skeleton-circle w-14 h-14" />
                <div className="skeleton-home-story-copy">
                  <SkeletonBlock className="skeleton-line w-28 h-5" />
                  <SkeletonBlock className="skeleton-line w-20 h-4" />
                </div>
              </div>
              <div className="skeleton-home-controls">
                <SkeletonBlock className="skeleton-circle w-11 h-11" />
                <SkeletonBlock className="skeleton-circle w-11 h-11" />
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="skeleton-home-contact">
        <div className="skeleton-home-text">
          <SkeletonSectionTitle />
          <SkeletonBlock className="skeleton-line w-full h-4" />
          <SkeletonBlock className="skeleton-line w-10/12 h-4" />
        </div>
        <div className="skeleton-card skeleton-home-form">
          <div className="skeleton-home-form-grid">
            <SkeletonBlock className="skeleton-line w-full h-16" />
            <SkeletonBlock className="skeleton-line w-full h-16" />
            <SkeletonBlock className="skeleton-line w-full h-16" />
            <SkeletonBlock className="skeleton-line w-full h-16" />
          </div>
          <SkeletonBlock className="skeleton-media skeleton-home-textarea" />
          <SkeletonBlock className="skeleton-button-lg" />
        </div>
      </section>
    </main>
  )
}
