"use client";

import Image from "next/image";

interface Topic {
  title: string;
  description: string;
  image: string;
}

const topics: Topic[] = [
  {
    title: "Reproductive Health",
    description: "Comprehensive discussions on sexual wellness, contraception, and anatomy for both men and women.",
    image: "/images/topics_1.png",
  },
  {
    title: "Relationships & Marriage",
    description: "Practical advice on building healthy relationships, rekindling love, and navigating marital challenges.",
    image: "/images/topics_2.png",
  },
  {
    title: "Youth Guidance",
    description: "Guidance on adolescence, puberty, body changes, emotional health, and child development.",
    image: "/images/topics_3.png",
  },
  {
    title: "Intimacy & Sexual Wellness",
    description: "Advice on enhancing sexual experiences, understanding partner needs, and addressing common misconceptions.",
    image: "/images/topics_1.png",
  },
  {
    title: "Video Series",
    description: 'Popular series including "Umwana mu nda" on fetal development and "Ibyo mu Buriri" on sexual intimacy.',
    image: "/images/topics_2.png",
  },
  {
    title: "Educational Content",
    description: "Accessible content that makes complex topics understandable for a broad audience of all ages.",
    image: "/images/topics_3.png",
  },
];

export default function Topics() {
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
                    Read More -&gt;
                  </button>
                </div>
                <div className="topic-image-wrap">
                  <Image src={topic.image} alt={topic.title} width={381} height={254} className="topic-image" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
