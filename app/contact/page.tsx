import type { Metadata } from "next"
import Contact from "../components/contact/Contact"

export const metadata: Metadata = {
  title: "Contact",
  description: "Get in touch with Shangazi Emma Claudine for inquiries, guidance, or collaborations.",
}

export default function ContactPage() {
  return (
    <main className="contact-page">
      <section className="contact-hero">
        <div className="contact-hero-content">
          <h1 className="contact-hero-title">Contact</h1>
          <p className="contact-hero-subtitle">Reach out for questions, collaborations, or guidance.</p>
        </div>
      </section>
      <Contact />
    </main>
  )
}
