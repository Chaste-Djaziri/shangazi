import type { Metadata } from "next"

const testimonials = [
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan dui at lacus egestas varius. Sed at congue felis.",
    name: "Names",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan dui at lacus egestas varius. Sed at congue felis.",
    name: "Names",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan dui at lacus egestas varius. Sed at congue felis.",
    name: "Names",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan dui at lacus egestas varius. Sed at congue felis.",
    name: "Names",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan dui at lacus egestas varius. Sed at congue felis.",
    name: "Names",
  },
  {
    quote:
      "Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan dui at lacus egestas varius. Sed at congue felis.",
    name: "Names",
  },
]

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
}

export default function TestimonialsPage() {
  const marqueeA = [...testimonials, ...testimonials]
  const marqueeB = [...testimonials.slice().reverse(), ...testimonials.slice().reverse()]

  return (
    <main className="testimonials-page">
      <section className="testimonials-hero">
        <div className="testimonials-hero-content">
          <h1 className="testimonials-title">Testimonials</h1>
        </div>
      </section>

      <section className="testimonials-section">
        <div className="testimonials-container">
          <div className="testimonials-marquee">
            <div className="testimonials-row marquee-forward">
              {marqueeA.map((item, idx) => (
                <div key={`row-a-${idx}`} className="testimonial-card">
                  <div className="testimonial-avatar" aria-hidden="true" />
                  <div className="testimonial-content">
                    <p className="testimonial-quote">{item.quote}</p>
                    <p className="testimonial-name">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="testimonials-row marquee-reverse">
              {marqueeB.map((item, idx) => (
                <div key={`row-b-${idx}`} className="testimonial-card">
                  <div className="testimonial-avatar" aria-hidden="true" />
                  <div className="testimonial-content">
                    <p className="testimonial-quote">{item.quote}</p>
                    <p className="testimonial-name">{item.name}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
