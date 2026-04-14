import Image from "next/image"
import Link from "next/link"

export default function About() {
  return (
    <section className="about">
      <div className="about-container">
        <div className="about-content">
          <div className="about-title-block">
            <p className="about-kicker">Meet Shangazi</p>
          </div>
          <div className="about-subtitle-block">
            <h2 className="about-title">Who is Shangazi Emma Claudine</h2>
          </div>
          <div className="about-description-block">
            <p className="about-text">
              Emma Claudine, widely known as Shangazi, is a Rwandan communicator, media professional and trusted voice for honest conversations. She is known for guiding young people, couples and parents through topics around relationships, personal growth and life experiences with clarity, care and respect.
            </p>
            <p className="about-text">
              The name &ldquo;Shangazi&rdquo; reflects her warm, approachable way of addressing subjects many people struggle to talk about openly.
            </p>
          </div>
          <div className="about-cta-block">
            <Link href="/about" className="about-button">
              <span>Read More</span>
              <Image
                src="/vectors/right_arrow.svg"
                alt=""
                width={10}
                height={10}
                className="about-button-icon"
              />
            </Link>
          </div>
        </div>
        <div className="about-card-group">
          <div className="about-card-column">
            <div className="about-experience-card" aria-label="20 plus years experience">
              <p className="about-experience-number">20 +</p>
              <p className="about-experience-label">Years Experience</p>
            </div>
            <div className="about-tertiary-card" aria-hidden="true" />
          </div>
          <div className="about-card-column">
            <div className="about-secondary-card" aria-hidden="true" />
            <div className="about-quaternary-card" aria-hidden="true" />
          </div>
        </div>
      </div>
    </section>
  )
}
