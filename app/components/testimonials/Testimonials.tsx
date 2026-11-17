"use client";

import Image from "../LocalSafeImage";
import { useState } from "react";

import type { ApprovedTestimonial } from "@/src/testimonials";

export default function Testimonials({ testimonials }: { testimonials: ApprovedTestimonial[] }) {
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

          {activeTestimonial ? <div className="home-testimonials-card">
            <div className="home-testimonials-quote-wrap">
              <p className="home-testimonials-quote">“{activeTestimonial.quote}”</p>
            </div>

            <div className="home-testimonials-footer">
              <div className="home-testimonials-person">
                {activeTestimonial.avatar_url ? (
                  <Image src={activeTestimonial.avatar_url} alt={activeTestimonial.name} width={60} height={60} sizes="60px" className="home-testimonials-avatar" />
                ) : (
                  <span className="home-testimonials-avatar flex items-center justify-center rounded-full bg-gray-100 font-bold text-gray-600" aria-hidden="true">{activeTestimonial.name?.charAt(0).toUpperCase() || "U"}</span>
                )}
                <div className="home-testimonials-person-copy">
                  <p className="home-testimonials-name">{activeTestimonial.name}</p>
                  
                </div>
              </div>

              {testimonials.length > 1 && <div className="home-testimonials-controls" aria-label="Testimonial controls">
                <button type="button" className="home-testimonials-control" onClick={showPrevious} aria-label="Previous testimonial">
                  <span aria-hidden="true">‹</span>
                </button>
                <button type="button" className="home-testimonials-control" onClick={showNext} aria-label="Next testimonial">
                  <span aria-hidden="true">›</span>
                </button>
              </div>}
            </div>
          </div> : (
            <div className="home-testimonials-card">
              <div className="home-testimonials-quote-wrap">
                <p className="home-testimonials-quote">Community stories will appear here once submissions have been reviewed and approved.</p>
              </div>
              <a href="/testimonials" className="underline underline-offset-4">Share your experience</a>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
