import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services | Shangazi Emma Claudine",
  description:
    "Discover services from Emma Claudine (Shangazi) and Shangazi Emma Claudine, including workshops, talks, and collaborations.",
  keywords: [
    "Emma Claudine",
    "Shangazi",
    "Shangazi Emma Claudine",
    "Emma Claudine workshops",
    "Shangazi collaborations",
    "Rwanda speaker",
    "Shangazi booking",
  ],
}

export default function ServicesPage() {
  return (
    <main className="services-page">
      <section className="services-hero">
        <div className="services-hero-content">
          <h1 className="services-title">Services</h1>
        </div>
      </section>

      <section className="services-coming-soon">
        <div className="services-coming-container">
          <p className="services-coming-text">Coming Soon</p>
        </div>
      </section>
    </main>
  )
}
