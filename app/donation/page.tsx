import type { Metadata } from "next"
import DonationDetails from "../components/donation/DonationDetails"

export const metadata: Metadata = {
  title: "Donation | Shangazi Emma Claudine",
  description: "Support Shangazi Emma Claudine's mission to empower youth through education and open dialogue.",
  keywords: [
    "Donate to Shangazi Emma Claudine",
    "Shangazi donation",
    "Emma Claudine support",
    "Rwanda youth donation",
    "Shangazi contribution",
  ],
}

export default function DonationPage() {
  return (
    <main className="donation-page">
      <section className="donation-hero">
        <div className="donation-hero-content">
          <h1 className="donation-title">Donation</h1>
        </div>
      </section>

      <section className="donation-section">
        <div className="donation-container">
          <div className="donation-copy">
            <h2 className="donation-heading">
              Support <span className="about-highlight-accent">Shangazi</span>
            </h2>
            <p className="donation-subtext">
              Your contribution fuels programs that inform and empower youth with accurate reproductive health knowledge,
              counseling, and community outreach.
            </p>
            <p className="donation-subtext">
              Prefer a different channel? Email comms@shangazi.rw and we&apos;ll share tailored instructions.
            </p>
          </div>

          <DonationDetails />
        </div>
      </section>
    </main>
  )
}
