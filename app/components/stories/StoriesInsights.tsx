import Image from "next/image";
import Link from "next/link";

interface StoriesInsightsProps {
  blogs?: any[];
}

export default function StoriesInsights({ blogs = [] }: StoriesInsightsProps) {
  if (blogs.length === 0) return null;

  const [featuredStory, ...sideStories] = blogs;

  return (
    <section className="stories-insights">
      <div className="stories-insights-container">
        <div className="stories-insights-content">
          <div className="stories-insights-header">
            <div className="stories-insights-header-copy">
              <p className="stories-insights-kicker">Stories &amp; Insights</p>
              <h2 className="stories-insights-title">Thoughts for Everyday Life</h2>
              <p className="stories-insights-description">
                Explore real stories, shared experiences and guided reflections that help make sense of relationships,
                growth and personal challenges.
              </p>
            </div>

            <div className="stories-insights-actions">
              <Link href="/blog" className="stories-insights-button">
                <span>All Blog</span>
                <Image src="/vectors/right_arrow.svg" alt="" width={10} height={10} className="stories-insights-button-icon" />
              </Link>
            </div>
          </div>

          <div className={`stories-insights-grid ${sideStories.length === 0 ? "stories-insights-single" : ""}`}>
            <article
              className="stories-featured-card"
            >
              <div className="stories-featured-card-media">
                <Image
                  src={featuredStory.image || "/backgrounds/stories_1.png"}
                  alt={featuredStory.title}
                  fill
                  sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1200px) 100vw, 630px"
                  className="stories-featured-image"
                />
              </div>
              <div className="stories-featured-card-overlay" />
              <div className="stories-featured-card-content">
                <p className="stories-card-category stories-card-category-light">Guidance</p>
                <h3 className="stories-featured-card-title">{featuredStory.title}</h3>
                <p className="stories-featured-card-description line-clamp-2">{featuredStory.description}</p>
                <Link href={`/blog/${featuredStory.slug}`} className="stories-read-more stories-read-more-light">
                  <span>Read More</span>
                  <Image src="/vectors/right_arrow.svg" alt="" width={10} height={11} className="stories-read-more-icon" />
                </Link>
              </div>
            </article>

            {sideStories.length > 0 && (
              <div className="stories-side-list">
                {sideStories.map((story) => (
                  <article key={story.slug} className="stories-side-card">
                    <div className="stories-side-card-image">
                      <Image
                        src={story.image || "/images/topics_2.png"}
                        alt={story.title}
                        fill
                        sizes="(max-width: 768px) calc(100vw - 48px), 330px"
                        className="stories-side-image"
                      />
                    </div>
                    <div className="stories-side-card-content">
                      <p className="stories-card-category">Insight</p>
                      <h3 className="stories-side-card-title line-clamp-2">{story.title}</h3>
                      <Link href={`/blog/${story.slug}`} className="stories-read-more">
                        <span>Read More</span>
                        <Image src="/vectors/right_green_arrow.svg" alt="" width={10} height={11} className="stories-read-more-icon" />
                      </Link>
                    </div>
                  </article>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}
