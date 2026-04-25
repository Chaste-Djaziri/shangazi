"use client";

import Image from "next/image";
import { useState } from "react";

const testimonials = [
  {
    quote:
      "For a long time, I carried questions about sexual life I didn't know how to ask. Listening and engaging here helped me feel understood and less alone.",
    name: "Mugisha Kevin",
    role: "Student",
    image: "/profile/1.png",
  },
  {
    quote:
      "These conversations gave me language for things I had struggled to explain for years. I left feeling calmer, clearer, and more confident.",
    name: "Uwase Diane",
    role: "Parent",
    image: "/profile/2.png",
  },
  {
    quote:
      "I found practical guidance here without feeling judged. The way the topics are handled made it easier for me to ask honest questions.",
    name: "Ndayisaba Eric",
    role: "Teacher",
    image: "/profile/3.png",
  },
];

export default function Testimonials() {
  const [activeIndex, setActiveIndex] = useState(0);
  const activeTestimonial = testimonials[activeIndex];

  const showPrevious = () => {
    setActiveIndex((current) => (current === 0 ? testimonials.length - 1 : current - 1));
  };

  const showNext = () => {
    setActiveIndex((current) => (current === testimonials.length - 1 ? 0 : current + 1));
  };

  return (
    <section className="home-testimonials">
      <div className="home-testimonials-inner">
        <div className="home-testimonials-visual">
          <Image
            src="/images/tstimonials.png"
            alt="Community members walking together"
            width={1440}
            height={849}
            sizes="(max-width: 768px) calc(100vw - 48px), (max-width: 1200px) 48vw, 560px"
            className="home-testimonials-image"
          />
        </div>

        <div className="home-testimonials-content">
          <p className="home-testimonials-kicker">Testimonials</p>
          <h2 className="home-testimonials-title">Voices from the Community</h2>
          <p className="home-testimonials-description">
            We are grateful to hear from people who found clarity, comfort and direction through these conversations.
          </p>

          <div className="home-testimonials-card">
            <div className="home-testimonials-quote-wrap">
              <p className="home-testimonials-quote">“{activeTestimonial.quote}”</p>
            </div>

            <div className="home-testimonials-footer">
              <div className="home-testimonials-person">
                <Image
                  src={activeTestimonial.image}
                  alt={activeTestimonial.name}
                  width={60}
                  height={60}
                  sizes="60px"
                  className="home-testimonials-avatar"
                />
                <div className="home-testimonials-person-copy">
                  <p className="home-testimonials-name">{activeTestimonial.name}</p>
                  <p className="home-testimonials-role">{activeTestimonial.role}</p>
                </div>
              </div>

              <div className="home-testimonials-controls" aria-label="Testimonial controls">
                <button type="button" className="home-testimonials-control" onClick={showPrevious} aria-label="Previous testimonial">
                  <span aria-hidden="true">‹</span>
                </button>
                <button type="button" className="home-testimonials-control" onClick={showNext} aria-label="Next testimonial">
                  <span aria-hidden="true">›</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
