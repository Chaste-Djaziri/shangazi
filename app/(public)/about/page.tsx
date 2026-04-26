import type { Metadata } from "next"
import Image from "next/image"

export const metadata: Metadata = {
  title: "About | Shangazi Emma Claudine",
  description:
    "Learn more about Shangazi Emma Claudine, her story, her media journey, and her work guiding honest conversations for young people, couples, and families.",
  keywords: [
    "Emma Claudine",
    "Shangazi",
    "Shangazi Emma Claudine",
    "Rwandan journalist",
    "content creator",
    "about Shangazi",
  ],
  alternates: {
    canonical: "https://shangazi.rw/about",
  },
  openGraph: {
    title: "About Shangazi Emma Claudine",
    description:
      "Meet Shangazi Emma Claudine and explore her experience in media, youth guidance, and open conversations that create trust.",
    url: "https://shangazi.rw/about",
    type: "article",
    images: [
      {
        url: "/profile/about.png",
        width: 1200,
        height: 630,
        alt: "About Shangazi Emma Claudine",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    title: "About Shangazi Emma Claudine",
    description:
      "Explore Shangazi Emma Claudine's background, impact, and trusted voice in honest conversations.",
    images: ["/profile/about.png"],
  },
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
            <div className="about-detail-icon relative group">
              <a
                className="about-detail-icon-link block"
                href="https://www.youtube.com/@shangaziemmaclaudine"
                target="_blank"
                rel="noreferrer"
              >
                <div className="absolute -top-2 -left-6 z-10 bg-[#FF0000] text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-xl shadow-red-500/20 transition-transform">
                  500K+ Subscribers
                </div>
                <Image src="/socials/youtube.png" alt="YouTube" width={260} height={260} priority />
              </a>
            </div>
          </div>

          <div className="about-detail-row about-detail-row-reverse">
            <div className="about-detail-icon relative group">
              <a
                className="about-detail-icon-link block"
                href="https://www.facebook.com/emmaclaudine1/"
                target="_blank"
                rel="noreferrer"
              >
                <div className="absolute -top-2 -right-6 z-10 bg-[#1877F2] text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-xl shadow-blue-500/20 transition-transform">
                  267K+ Followers
                </div>
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
            <div className="about-detail-icon relative group">
              <a
                className="about-detail-icon-link block"
                href="https://www.tiktok.com/@shangazi_emmaclaudine"
                target="_blank"
                rel="noreferrer"
              >
                <div className="absolute -top-2 -left-6 z-10 bg-black text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-xl transition-transform">
                  172.1K+ Followers
                </div>
                <Image src="/socials/tiktok.png" alt="TikTok" width={260} height={260} />
              </a>
            </div>
          </div>

          <div className="about-detail-row about-detail-row-reverse">
            <div className="about-detail-icon relative group">
              <a
                className="about-detail-icon-link block"
                href="https://www.instagram.com/shangaziemmaclaudine1/"
                target="_blank"
                rel="noreferrer"
              >
                <div className="absolute -top-2 -right-6 z-10 bg-gradient-to-tr from-[#f9ce34] via-[#ee2a7b] to-[#6228d7] text-white px-4 py-2 rounded-2xl font-bold text-sm shadow-xl transition-transform">
                  62.8K+ Followers
                </div>
                <Image src="/socials/instagram.png" alt="Instagram" width={260} height={260} />
              </a>
            </div>
            <div className="about-detail-text">
              <h2 className="about-detail-title">
                Authentic <span className="about-highlight-primary">Engagement</span>
              </h2>
              <p className="about-detail-body">
                Through Instagram, Shangazi maintains a close and visual connection with her community, sharing daily wisdom,
                behind-the-scenes moments, and interactive guidance that brings honest conversations directly to her followers&apos; feeds.
              </p>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
