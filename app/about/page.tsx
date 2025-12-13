import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About Shangazi",
  description:
    "Learn about Shangazi Emma Claudine, a leading Rwandan journalist and content creator empowering youth through education and open dialogue.",
}

export default function AboutPage() {
  return (
    <main className="about-page">
      <section className="about-hero">
        <div className="about-hero-content">
          <h1 className="about-hero-title">
            About <span className="about-title-accent">Shangazi</span>
          </h1>
        </div>
      </section>

      <section className="about-page-section">
        <div className="about-page-container">
          <div className="about-detail-row">
            <div className="about-detail-text">
              <h2 className="about-detail-title">
                Prominent Rwandan <span className="about-highlight-accent">Journalist</span> &{" "}
                <span className="about-highlight-accent">Content Creator</span>
              </h2>
              <p className="about-detail-body">
                Emma Claudine, known as &quot;Shangazi Emma-Claudine,&quot; is a prominent Rwandan journalist and content
                creator whose YouTube channel focuses on reproductive health, relationships, family planning, and youth
                counseling. Her channel has garnered over 410,000 subscribers and more than 30 million views as of April
                2025.
              </p>
            </div>
            <div className="about-detail-icon">
              <a
                className="about-detail-icon-link"
                href="https://www.youtube.com/@emmaclaudine/videos"
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/socials/youtube.png" alt="YouTube" width={260} height={260} priority />
              </a>
            </div>
          </div>

          <div className="about-detail-row about-detail-row-reverse">
            <div className="about-detail-icon">
              <a
                className="about-detail-icon-link"
                href="https://www.facebook.com/emmaclaudine1"
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/socials/facebook.png" alt="Facebook" width={260} height={260} />
              </a>
            </div>
            <div className="about-detail-text">
              <h2 className="about-detail-title">
                Breaking Taboos Through <span className="about-highlight-primary">Education</span>
              </h2>
              <p className="about-detail-body">
                In 2005, Emma launched the radio program &quot;Imenye Nawe&quot; on Radio Salus, focusing on reproductive
                health and sexuality. Her empathetic approach earned her the affectionate title &quot;Shangazi&quot;
                (Auntie) among young listeners. She later became the Managing Editor of Ni Nyampinga, a magazine by Girl
                Effect Rwanda.
              </p>
            </div>
          </div>

          <div className="about-detail-row">
            <div className="about-detail-text">
              <h2 className="about-detail-title">
                Impact and <span className="about-highlight-accent">Recognition</span>
              </h2>
              <p className="about-detail-body">
                Emma Claudine&apos;s work has been crucial in breaking taboos and providing accurate information to Rwandan
                youth. Her efforts have been recognized internationally, highlighting her role in empowering young people
                through education and open dialogue.
              </p>
            </div>
            <div className="about-detail-icon">
              <a
                className="about-detail-icon-link"
                href="https://www.tiktok.com/@emmaclaudine1"
                target="_blank"
                rel="noreferrer"
              >
                <Image src="/socials/tiktok.png" alt="TikTok" width={260} height={260} />
              </a>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
