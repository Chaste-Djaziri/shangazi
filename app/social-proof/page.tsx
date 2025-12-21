import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Social Proof | Shangazi Emma Claudine",
  description:
    "Community stories, testimonials, and proof of impact from Emma Claudine (Shangazi) and Shangazi Emma Claudine.",
  keywords: ["Emma Claudine", "Shangazi", "Shangazi Emma Claudine", "social proof", "impact"],
}

export default function SocialProofPage() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <h1 className="static-title">Social Proof</h1>
          <p className="static-subtitle">What partners and audiences are saying.</p>
        </div>
      </section>

      <section className="static-content">
        <div className="static-card">
          <p>Coming soon.</p>
        </div>
      </section>
    </main>
  )
}
