import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Media | Shangazi",
  description: "Press appearances, interviews, and media resources featuring Shangazi Emma Claudine.",
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
          <p>Media assets and press kits are coming soon. For urgent requests, please email comms@shangazi.rw.</p>
        </div>
      </section>
    </main>
  )
}
