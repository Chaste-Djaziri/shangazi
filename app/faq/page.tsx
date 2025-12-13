import type { Metadata } from "next"

const faqs = [
  {
    question: "What topics does Shangazi cover?",
    answer:
      "Reproductive health, relationships, family planning, youth counseling, and breaking taboos through open dialogue.",
  },
  {
    question: "How can I book Shangazi for an event?",
    answer: "Visit the Booking page to request a date and share your event details. We respond within 2 business days.",
  },
  {
    question: "Can I get private advice?",
    answer:
      "Yes. Use the Contact page to send confidential questions. We prioritize respectful, accurate information.",
  },
  {
    question: "Where can I follow Shangazi online?",
    answer: "Find Shangazi on YouTube, Facebook, TikTok, and Instagram for the latest content and updates.",
  },
  {
    question: "Are sessions available in Kinyarwanda?",
    answer:
      "Yes. Shangazi provides guidance in Kinyarwanda and English, depending on audience needs and context.",
  },
  {
    question: "How do I support the mission?",
    answer:
      "You can donate via the Donation page or share content to help spread accurate information to more young people.",
  },
]

export const metadata: Metadata = {
  title: "FAQ | Shangazi Emma Claudine",
  description: "Frequently asked questions about Shangazi Emma Claudine, her content, and how to collaborate or get support.",
  keywords: [
    "Shangazi Emma Claudine FAQ",
    "Emma Claudine questions",
    "Shangazi support",
    "Shangazi information",
    "Shangazi Emma Claudine help",
  ],
}

export default function FAQPage() {
  return (
    <main className="faq-page">
      <section className="faq-hero">
        <div className="faq-hero-content">
          <h1 className="faq-title">Frequently Asked Questions</h1>
          <p className="faq-subtitle">Answers to the most common questions about Shangazi and her work.</p>
        </div>
      </section>

      <section className="faq-section">
        <div className="faq-container">
          <div className="faq-grid">
            {faqs.map((item) => (
              <details key={item.question} className="faq-item">
                <summary className="faq-question">
                  <span>{item.question}</span>
                  <span className="faq-icon" aria-hidden="true">
                    <span className="faq-icon-plus">+</span>
                    <span className="faq-icon-minus">−</span>
                  </span>
                </summary>
                <p className="faq-answer">{item.answer}</p>
              </details>
            ))}
          </div>
        </div>
      </section>
    </main>
  )
}
