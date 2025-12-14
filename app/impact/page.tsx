import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Impact | Shangazi",
  description: "Explore the impact of Shangazi Emma Claudine across communities and youth programs.",
}

export default function ImpactPage() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <h1 className="static-title">Impact</h1>
          <p className="static-subtitle">Stories, metrics, and initiatives changing lives.</p>
        </div>
      </section>

      <section className="static-content">
        <div className="static-card">
          <p>Impact highlights and program results will be published here. Stay tuned.</p>
        </div>
      </section>
    </main>
  )
}
