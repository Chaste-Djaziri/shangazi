"use client"

import Image from "next/image"

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
              <div className="hero-title-section">
                <p className="hero-overlay-title">Welcome to Shangazi</p>
              </div>
              <div className="hero-headline-section">
                <h1 className="hero-headline">A Safe Space for Real Questions</h1>
              </div>
              <div className="hero-cta-section">
                <button type="button" className="hero-talk-button" aria-label="Let's Talk">
                  <span className="hero-talk-text">Let's Talk</span>
                  <Image src="/vectors/chat_black.svg" alt="" width={16} height={16} className="hero-talk-icon" />
                </button>
                <div className="hero-profile-cluster" aria-label="Community members">
                  <div className="hero-profile-visuals">
                    <div className="hero-profile-images">
                      <Image src="/profile/1.png" alt="Community member one" width={72} height={72} className="hero-profile-image" />
                      <Image src="/profile/2.png" alt="Community member two" width={72} height={72} className="hero-profile-image" />
                      <Image src="/profile/3.png" alt="Community member three" width={72} height={72} className="hero-profile-image" />
                    </div>
                    <button type="button" className="hero-profile-arrow-button" aria-label="Open community">
                      <Image
                        src="/vectors/top_right_arrow_black.svg"
                        alt=""
                        width={24}
                        height={24}
                        className="hero-profile-arrow-icon"
                      />
                    </button>
                  </div>
                  <div className="hero-profile-copy">
                    <p className="hero-profile-text">2000+ questions listened to &amp; answered</p>
                  </div>
                </div>
              </div>
            </div>
            <div className="hero-content-right">
              <button type="button" className="hero-play-button" aria-label="Play video">
                <Image src="/vectors/play.svg" alt="" width={16} height={16} className="hero-play-icon" />
              </button>
              <p className="hero-overlay-link">Watch Videos</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
