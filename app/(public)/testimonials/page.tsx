import type { Metadata } from "next";
import Image from "next/image";
import TestimonialForm from "../../components/testimonials/TestimonialForm";
import { Star } from "lucide-react";
import db from "@/src/db";

export const metadata: Metadata = {
  title: "Testimonials | Shangazi Emma Claudine",
  description:
    "What people are saying about Emma Claudine (Shangazi) and Shangazi Emma Claudine's impact on youth and communities.",
  keywords: [
    "Emma Claudine",
    "Shangazi",
    "Shangazi Emma Claudine",
    "Shangazi Emma Claudine testimonials",
    "Emma Claudine feedback",
    "Shangazi impact",
    "Rwanda testimonials",
    "Shangazi community stories",
  ],
};

async function getApprovedTestimonials() {
  try {
    const res = await db.query(
      "SELECT name, content as quote, rating, avatar_url FROM public.testimonials WHERE is_approved = true ORDER BY created_at DESC"
    );
    return res.rows;
  } catch (e) {
    return [];
  }
}

const fallbackTestimonials = [
  {
    quote: "Shangazi has been a guiding light for me during my toughest times. Her honest conversations about reproductive health changed how I view my own body and future.",
    name: "Aline M.",
    rating: 5,
  },
  {
    quote: "The courses on the SEC Portal are so deep and practical. I've learned more about healthy relationships here than anywhere else.",
    name: "Jean-Paul K.",
    rating: 5,
  },
  {
    quote: "Her guidance is filled with wisdom and empathy. I feel safe and understood every time I watch her videos.",
    name: "Sandra U.",
    rating: 5,
  },
  {
    quote: "Murakoze cyane Shangazi! Your impact on the youth of Rwanda is immeasurable.",
    name: "Divine I.",
    rating: 5,
  },
  {
    quote: "The honest and transparent approach Emma Claudine takes is exactly what our generation needs today.",
    name: "Cedric N.",
    rating: 5,
  },
  {
    quote: "Highly recommend booking a guidance session. It's life-changing.",
    name: "Patience G.",
    rating: 5,
  },
];

export default async function TestimonialsPage() {
  const approvedTestimonials = await getApprovedTestimonials();
  const displayTestimonials = approvedTestimonials.length > 0 ? approvedTestimonials : fallbackTestimonials;
  
  // Create variations for the marquee
  const marqueeA = [...displayTestimonials, ...displayTestimonials];
  const marqueeB = [...displayTestimonials.slice().reverse(), ...displayTestimonials.slice().reverse()];

  return (
    <main className="testimonials-page">
      <section className="testimonials-hero">
        <div className="testimonials-hero-content">
          <h1 className="testimonials-title">Testimonials</h1>
          <p className="font-marcellus text-gray-500 max-w-xl mx-auto mt-4">
            Hear from our community members about their journey and growth through Shangazi&apos;s guidance.
          </p>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-marquee">
            <div className="testimonials-row marquee-forward">
              {marqueeA.map((item, idx) => (
                <div key={`row-a-${idx}`} className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar flex items-center justify-center bg-[#1d5c19]/10 text-[#1d5c19] font-bold text-lg overflow-hidden shrink-0 relative">
                      {item.avatar_url ? (
                        <Image src={item.avatar_url} alt={item.name} fill className="object-cover" />
                      ) : (
                        (item.name?.[0] || "U").toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="testimonial-name">{item.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            fill={i < (item.rating || 5) ? "#1d5c19" : "none"} 
                            className={i < (item.rating || 5) ? "text-[#1d5c19]" : "text-gray-200"} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-content">
                    <p className="testimonial-quote line-clamp-4">{item.quote}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="testimonials-row marquee-reverse">
              {marqueeB.map((item, idx) => (
                <div key={`row-b-${idx}`} className="testimonial-card">
                  <div className="testimonial-header">
                    <div className="testimonial-avatar flex items-center justify-center bg-[#1d5c19]/10 text-[#1d5c19] font-bold text-lg overflow-hidden shrink-0 relative">
                      {item.avatar_url ? (
                        <Image src={item.avatar_url} alt={item.name} fill className="object-cover" />
                      ) : (
                        (item.name?.[0] || "U").toUpperCase()
                      )}
                    </div>
                    <div className="flex flex-col">
                      <p className="testimonial-name">{item.name}</p>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star 
                            key={i} 
                            size={10} 
                            fill={i < (item.rating || 5) ? "#1d5c19" : "none"} 
                            className={i < (item.rating || 5) ? "text-[#1d5c19]" : "text-gray-200"} 
                          />
                        ))}
                      </div>
                    </div>
                  </div>
                  <div className="testimonial-content">
                    <p className="testimonial-quote line-clamp-4">{item.quote}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Submission Form Section */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-6 lg:px-10">
           <TestimonialForm />
        </div>
      </section>
    </main>
  );
}
