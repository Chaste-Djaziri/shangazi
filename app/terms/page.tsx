import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Terms of Service | Shangazi",
  description: "Review the terms for using Shangazi Emma Claudine’s digital platforms.",
}

export default function TermsPage() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <h1 className="static-title">Terms of Service</h1>
          <p className="static-subtitle">Guidelines for using our website and services.</p>
        </div>
      </section>

      <section className="static-content">
        <div className="static-card">
          <p>
            Our detailed terms will be shared soon. By using this site you agree to fair use and respectful engagement.
            Questions? <Link href="/contact">Contact us</Link>.
          </p>
        </div>
      </section>
    </main>
  )
}
