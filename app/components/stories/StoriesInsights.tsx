import Image from "next/image";
import Link from "next/link";

const storyCards = [
  {
    category: "Tips",
    title: "What People Rarely Say Out Loud",
    description:
      "Short reflections inspired by real questions and shared experiences from the community.",
    image: "/backgrounds/stories_1.png",
    href: "/blog",
    featured: true,
  },
  {
    category: "Mental Health",
    title: "Common Myths vs Everyday Reality",
    image: "/images/topics_2.png",
    href: "/blog",
  },
  {
    category: "Insight",
    title: "The Truth About Sex: Myths vs. Reality",
    image: "/images/topics_3.png",
    href: "/blog",
  },
];

export default function StoriesInsights() {
  const [featuredStory, ...sideStories] = storyCards;

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

          <div className="stories-insights-grid">
            <article
              className="stories-featured-card"
            >
              <div className="stories-featured-card-media">
                <Image
                  src={featuredStory.image}
                  alt={featuredStory.title}
                  fill
                  sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1200px) 100vw, 630px"
                  className="stories-featured-image"
                />
              </div>
              <div className="stories-featured-card-overlay" />
              <div className="stories-featured-card-content">
                <p className="stories-card-category stories-card-category-light">{featuredStory.category}</p>
                <h3 className="stories-featured-card-title">{featuredStory.title}</h3>
                <p className="stories-featured-card-description">{featuredStory.description}</p>
                <Link href={featuredStory.href} className="stories-read-more stories-read-more-light">
                  <span>Read More</span>
                  <Image src="/vectors/right_arrow.svg" alt="" width={10} height={11} className="stories-read-more-icon" />
                </Link>
              </div>
            </article>

            <div className="stories-side-list">
              {sideStories.map((story) => (
                <article key={story.title} className="stories-side-card">
                  <div className="stories-side-card-image">
                    <Image
                      src={story.image}
                      alt={story.title}
                      fill
                      sizes="(max-width: 768px) calc(100vw - 48px), 330px"
                      className="stories-side-image"
                    />
                  </div>
                  <div className="stories-side-card-content">
                    <p className="stories-card-category">{story.category}</p>
                    <h3 className="stories-side-card-title">{story.title}</h3>
                    <Link href={story.href} className="stories-read-more">
                      <span>Read More</span>
                      <Image src="/vectors/right_green_arrow.svg" alt="" width={10} height={11} className="stories-read-more-icon" />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
