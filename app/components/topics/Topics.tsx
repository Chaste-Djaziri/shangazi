"use client";

import { useRef, useEffect } from "react";
import gsap from "gsap";

interface Topic {
  title: string;
  description: string;
  icon: JSX.Element;
}

const topics: Topic[] = [
  {
    title: "Reproductive Health",
    description: "Comprehensive discussions on sexual wellness, contraception, and anatomy for both men and women.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
      </svg>
    ),
  },
  {
    title: "Relationships & Marriage",
    description: "Practical advice on building healthy relationships, rekindling love, and navigating marital challenges.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
  },
  {
    title: "Youth Guidance",
    description: "Guidance on adolescence, puberty, body changes, emotional health, and child development.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
      </svg>
    ),
  },
  {
    title: "Intimacy & Sexual Wellness",
    description: "Advice on enhancing sexual experiences, understanding partner needs, and addressing common misconceptions.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  },
  {
    title: "Video Series",
    description: 'Popular series including "Umwana mu nda" on fetal development and "Ibyo mu Buriri" on sexual intimacy.',
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <circle cx="12" cy="12" r="10" />
        <polygon points="10 8 16 12 10 16 10 8" />
      </svg>
    ),
  },
  {
    title: "Educational Content",
    description: "Accessible content that makes complex topics understandable for a broad audience of all ages.",
    icon: (
      <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
        <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
        <line x1="8" y1="7" x2="16" y2="7" />
        <line x1="8" y1="11" x2="16" y2="11" />
        <line x1="8" y1="15" x2="12" y2="15" />
      </svg>
    ),
  },
];

export default function Topics() {
  const topicsRef = useRef<HTMLElement>(null);
  const contentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline();
            
            if (contentRef.current) {
              const title = contentRef.current.querySelector(".topics-title");
              const subtitle = contentRef.current.querySelector(".topics-subtitle");
              const cards = contentRef.current.querySelectorAll(".topic-card");

              tl.fromTo(
                title,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" }
              )
              .fromTo(
                subtitle,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
                "-=0.4"
              )
              .fromTo(
                cards,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
                "-=0.4"
              );

              observer.disconnect();
            }
          }
        });
      },
      {
        threshold: 0.2,
      }
    );

    if (topicsRef.current) {
      observer.observe(topicsRef.current);
    }

    return () => {
      observer.disconnect();
    };
  }, []);

  return (
    <section className="topics" ref={topicsRef}>
      <div className="topics-container">
        <div className="topics-content" ref={contentRef}>
          <h2 className="topics-title">
            Topics I <span className="topics-title-accent">Cover</span>
          </h2>
          <p className="topics-subtitle">Core content themes and expertise areas</p>
          <div className="topics-grid">
            {topics.map((topic, index) => (
              <div key={index} className="topic-card">
                <div className="topic-icon">{topic.icon}</div>
                <h3 className="topic-title">{topic.title}</h3>
                <p className="topic-description">{topic.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
