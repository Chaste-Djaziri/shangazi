import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Login | Shangazi Emma Claudine",
  description:
    "Sign in to manage your bookings, newsletter preferences, and profile with Emma Claudine (Shangazi).",
  keywords: ["Emma Claudine", "Shangazi", "Shangazi Emma Claudine", "login", "account"],
}

export default function LoginPage() {
  return (
    <main className="static-page">
      <section className="static-hero">
        <div className="static-hero-content">
          <h1 className="static-title">Login</h1>
          <p className="static-subtitle">Account access will be available soon.</p>
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
