import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Privacy Policy | Shangazi Emma Claudine",
  description:
    "Learn how Emma Claudine (Shangazi) and Shangazi Emma Claudine collect, use, and protect your information.",
  keywords: ["Emma Claudine", "Shangazi", "Shangazi Emma Claudine", "privacy", "data protection"],
}

export default function PrivacyPage() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <h1 className="static-title">Privacy Policy</h1>
          <p className="static-subtitle">Your privacy and data protection matters to us.</p>
        </div>
      </section>

      <section className="static-content">
        <div className="static-card">
          <p>
            We are preparing a full privacy policy. Until then, we collect minimal information to deliver services and do
            not sell your data. For any privacy-related questions, please{" "}
            <Link href="/contact">reach out to our team</Link>.
          </p>
        </div>
      </section>
    </main>
  )
}
