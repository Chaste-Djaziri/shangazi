import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Services",
  description: "Discover upcoming services from Shangazi Emma Claudine.",
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
