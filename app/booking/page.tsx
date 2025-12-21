import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Booking | Shangazi Emma Claudine",
  description:
    "Book engagements with Emma Claudine (Shangazi) and Shangazi Emma Claudine for keynotes, workshops, panels, or consultations.",
  keywords: [
    "Emma Claudine",
    "Shangazi",
    "Shangazi Emma Claudine",
    "Book Shangazi Emma Claudine",
    "Emma Claudine booking",
    "Shangazi speaking",
    "Rwanda keynote",
    "Shangazi workshop",
  ],
}

export default function BookingPage() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <h1 className="static-title">Booking</h1>
          <p className="static-subtitle">Speaking engagements and workshops.</p>
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
