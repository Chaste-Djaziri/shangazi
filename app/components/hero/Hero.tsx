"use client"

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-video-frame" aria-hidden="true">
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="/backgrounds/hero_background.mp4" type="video/mp4" />
          </video>
        </div>
      </div>
    </section>
  )
}
