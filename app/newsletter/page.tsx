import type { Metadata } from "next"
import NewsletterForm from "../components/newsletter/NewsletterForm"

export const metadata: Metadata = {
  title: "Newsletter | Shangazi Emma Claudine",
  description: "Sign up to receive updates from Shangazi Emma Claudine on reproductive health, relationships, and youth empowerment.",
  keywords: [
    "Shangazi Emma Claudine newsletter",
    "Emma Claudine updates",
    "Shangazi email list",
    "Rwanda newsletter",
    "Shangazi latest news",
  ],
}

export default function NewsletterPage() {
  return (
    <main className="newsletter-page">
      <section className="newsletter-hero">
        <div className="newsletter-hero-content">
          <h1 className="newsletter-title">Newsletter</h1>
        </div>
      </section>

      <section className="newsletter-section">
        <div className="newsletter-container">
          <div className="newsletter-copy">
            <h2 className="newsletter-heading">
              Sign Up For <span className="about-highlight-accent">Newsletter</span>
            </h2>
            <p className="newsletter-subtext">
              Lorem ipsum dolor sit amet, consectetur adipiscing elit. In accumsan dui at lacus egestas varius. Sed at
              congue felis.
            </p>
          </div>

          <NewsletterForm />
        </div>
      </section>
    </main>
  )
}
