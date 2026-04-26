import Image from "next/image";
import Link from "next/link";

interface StoriesInsightsProps {
  blogs?: any[];
}

const fallbackBlogs = [
  {
    category: "Tips",
    title: "What People Rarely Say Out Loud",
    description: "Short reflections inspired by real questions and shared experiences from the community.",
    image: "/backgrounds/stories_1.png",
    slug: "",
  },
  {
    category: "Mental Health",
    title: "Common Myths vs Everyday Reality",
    image: "/images/topics_2.png",
    slug: "",
  },
  {
    category: "Insight",
    title: "The Truth About Sex: Myths vs. Reality",
    image: "/images/topics_3.png",
    slug: "",
  },
];

export default function StoriesInsights({ blogs = [] }: StoriesInsightsProps) {
  // Only use real blogs if we have at least 3
  const displayBlogs = blogs.length >= 3 ? blogs : fallbackBlogs;
  const [featuredStory, ...sideStories] = displayBlogs;

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
                  src={featuredStory.image || "/backgrounds/stories_1.png"}
                  alt={featuredStory.title}
                  fill
                  sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1200px) 100vw, 630px"
                  className="stories-featured-image"
                />
              </div>
              <div className="stories-featured-card-overlay" />
              <div className="stories-featured-card-content">
                <p className="stories-card-category stories-card-category-light">{featuredStory.category || "Guidance"}</p>
                <h3 className="stories-featured-card-title">{featuredStory.title}</h3>
                <p className="stories-featured-card-description line-clamp-2">{featuredStory.description}</p>
                <Link href={featuredStory.slug ? `/blog/${featuredStory.slug}` : "/blog"} className="stories-read-more stories-read-more-light">
                  <span>Read More</span>
                  <Image src="/vectors/right_arrow.svg" alt="" width={10} height={11} className="stories-read-more-icon" />
                </Link>
              </div>
            </article>

            <div className="stories-side-list">
              {sideStories.map((story, idx) => (
                <article key={story.slug || idx} className="stories-side-card">
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
                    <p className="stories-card-category">{story.category || "Insight"}</p>
                    <h3 className="stories-side-card-title line-clamp-2">{story.title}</h3>
                    <Link href={story.slug ? `/blog/${story.slug}` : "/blog"} className="stories-read-more">
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
