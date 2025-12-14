import type { Metadata } from "next"
import Link from "next/link"

export const metadata: Metadata = {
  title: "Login | Shangazi",
  description: "Sign in to manage your bookings, newsletter preferences, and profile.",
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
          <p>
            We&apos;re preparing member access for bookings, newsletters, and upcoming courses. In the meantime, feel
            free to explore our latest <Link href="/blog">articles</Link> or <Link href="/contact">get in touch</Link>.
          </p>
        </div>
      </section>
    </main>
  )
}
