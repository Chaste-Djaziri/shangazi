import Link from "next/link"

export default function SeoHighlights() {
  return (
    <section className="seo-highlights">
      <div className="seo-highlights-container">
        <p className="seo-highlights-kicker">Emma Claudine • Shangazi</p>
        <h2 className="seo-highlights-title">Shangazi Emma Claudine: trusted media voice and youth mentor</h2>
        <p className="seo-highlights-text">
          Shangazi Emma Claudine is a Rwandan journalist and content creator known for honest conversations on
          reproductive health, relationships, and youth empowerment. Explore her latest stories, media features, and
          community impact.
        </p>
        <div className="seo-highlights-links">
          <Link href="/about" className="seo-highlights-link">
            About Emma Claudine
          </Link>
          <Link href="/blog" className="seo-highlights-link">
            Shangazi Blog
          </Link>
          <Link href="/media" className="seo-highlights-link">
            Media Features
          </Link>
        </div>
      </div>
    </section>
  )
}
