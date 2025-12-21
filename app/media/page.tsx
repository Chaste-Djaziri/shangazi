import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Media | Shangazi Emma Claudine",
  description:
    "Press appearances, interviews, and media resources featuring Emma Claudine (Shangazi) and Shangazi Emma Claudine.",
  keywords: ["Emma Claudine", "Shangazi", "Shangazi Emma Claudine", "media", "press"],
}

export default function MediaPage() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <h1 className="static-title">Media</h1>
          <p className="static-subtitle">Interviews, press coverage, and official resources.</p>
        </div>
      </section>

      <section className="static-content">
        <div className="static-card">
          <p>Coming soon. For urgent requests, please email comms@shangazi.rw.</p>
        </div>
      </section>
    </main>
  )
}
