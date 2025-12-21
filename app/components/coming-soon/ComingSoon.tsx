import Link from "next/link"

type ComingSoonProps = {
  title: string
  subtitle?: string
  description?: string
  primaryHref?: string
  primaryLabel?: string
  secondaryHref?: string
  secondaryLabel?: string
}

export default function ComingSoon({
  title,
  subtitle = "Coming soon",
  description = "We are crafting this experience with care. Check back soon for updates.",
  primaryHref = "/",
  primaryLabel = "Back to Home",
  secondaryHref = "/contact",
  secondaryLabel = "Contact Us",
}: ComingSoonProps) {
  return (
    <main className="coming-soon">
      <section className="coming-soon-card">
        <p className="coming-soon-kicker">Shangazi Emma Claudine</p>
        <h1 className="coming-soon-title">{title}</h1>
        <p className="coming-soon-subtitle">{subtitle}</p>
        <p className="coming-soon-description">{description}</p>
        <div className="coming-soon-actions">
          <Link className="coming-soon-btn primary" href={primaryHref}>
            {primaryLabel}
          </Link>
          <Link className="coming-soon-btn secondary" href={secondaryHref}>
            {secondaryLabel}
          </Link>
        </div>
      </section>
    </main>
  )
}
