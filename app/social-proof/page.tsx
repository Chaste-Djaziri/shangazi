import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Social Proof | Shangazi",
  description: "Community stories, testimonials, and proof of Shangazi Emma Claudine’s impact.",
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
          <p>More stories and case studies are on the way. For collaborations, contact comms@shangazi.rw.</p>
        </div>
      </section>
    </main>
  )
}
