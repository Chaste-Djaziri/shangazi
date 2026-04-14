"use client"

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-video-frame">
          <video className="hero-video" autoPlay muted loop playsInline>
            <source src="/backgrounds/hero_background.mp4" type="video/mp4" />
          </video>
          <div className="hero-video-gradient" />
          <div className="hero-overlay-content">
            <div className="hero-content-left">
              <h1 className="hero-overlay-title">Welcome to Shangazi</h1>
            </div>
            <div className="hero-content-right">
              <p className="hero-overlay-link">Watch Videos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
