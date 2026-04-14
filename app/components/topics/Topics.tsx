import Image from "next/image";
import Link from "next/link";
import { topicsData } from "./topics-data";

interface TopicsProps {
  limit?: number;
  showAllButton?: boolean;
}

export default function Topics({ limit, showAllButton = false }: TopicsProps) {
  const topics = typeof limit === "number" ? topicsData.slice(0, limit) : topicsData;

  return (
    <section className="topics">
      <div className="topics-container">
        <div className="topics-content">
          <p className="topics-kicker">Our Focus</p>
          <h2 className="topics-title">Guidance That Feels Personal</h2>
          <p className="topics-subtitle">
            We create space for learning, reflection and support through open dialogue, shared stories and practical guidance
            that helps people move forward, not feel judged.
          </p>
          <div className="topics-grid">
            {topics.map((topic, index) => (
              <div key={index} className="topic-card">
                <div className="topic-card-top">
                  <div className="topic-icon-badge">
                    <Image src="/vectors/love.svg" alt="" width={31} height={34} className="topic-icon-image" />
                  </div>
                  <h3 className="topic-title">{topic.title}</h3>
                  <p className="topic-description">{topic.description}</p>
                  <button type="button" className="topic-read-more">
                    <span>Read More</span>
                    <Image src="/vectors/right_red_arrow.svg" alt="" width={10} height={10} className="topic-read-more-icon" />
                  </button>
                </div>
                <div className="topic-image-wrap">
                  <Image src={topic.image} alt={topic.title} width={381} height={254} className="topic-image" />
                </div>
              </div>
            ))}
          </div>
          {showAllButton ? (
            <div className="topics-view-more">
              <Link href="/topics" className="topics-view-more-button">
                <span>All Topics</span>
                <Image src="/vectors/right_arrow.svg" alt="" width={10} height={10} className="topics-view-more-icon" />
              </Link>
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
