import Image from "next/image";

export default function Hero() {
  return (
    <section className="hero">
      <div className="hero-container">
        <div className="hero-left">
          <h1 className="hero-name">
            <span className="hero-name-pink">Shangazi</span>
            <span className="hero-name-green">Emma Claudine</span>
          </h1>
          <p className="hero-description">
            Your trusted auntie providing guidance on reproductive health, relationships, and personal development.
          </p>
          <div className="hero-actions">
            <a href="/ask-question" className="btn-primary hero-btn">
              Ask a Question
            </a>
            <a href="/topics" className="btn-secondary hero-btn">
              Explore Topics
            </a>
          </div>
        </div>
        <div className="hero-right">
          <div className="hero-image-wrapper">
            <Image
              src="/shangazi.png"
              alt="Shangazi"
              width={800}
              height={600}
              priority
              className="hero-image"
            />
            <a
              href="https://www.youtube.com/@emmaclaudine/videos"
              target="_blank"
              rel="noopener noreferrer"
              className="youtube-subscribers social-link"
            >
              <Image
                src="/socials/youtube.png"
                alt="YouTube"
                width={40}
                height={40}
                className="youtube-icon"
              />
              <div className="subscribers-info">
                <span className="subscribers-count">482K</span>
                <span className="subscribers-label">Subscribers</span>
              </div>
            </a>
            <a
              href="https://www.facebook.com/emmaclaudine1"
              target="_blank"
              rel="noopener noreferrer"
              className="facebook-followers social-link"
            >
              <Image
                src="/socials/facebook.png"
                alt="Facebook"
                width={40}
                height={40}
                className="facebook-icon"
              />
              <div className="followers-info">
                <span className="followers-count">244K</span>
                <span className="followers-label">Followers</span>
              </div>
            </a>
            <a
              href="https://www.tiktok.com/@emmaclaudine1"
              target="_blank"
              rel="noopener noreferrer"
              className="tiktok-followers social-link"
            >
              <Image
                src="/socials/tiktok.png"
                alt="TikTok"
                width={40}
                height={40}
                className="tiktok-icon"
              />
              <div className="followers-info">
                <span className="followers-count">152.3K</span>
                <span className="followers-label">Followers</span>
              </div>
            </a>
            <a
              href="https://www.instagram.com/emmaclaudine1/"
              target="_blank"
              rel="noopener noreferrer"
              className="instagram-followers social-link"
            >
              <Image
                src="/socials/instagram.png"
                alt="Instagram"
                width={40}
                height={40}
                className="instagram-icon"
              />
              <div className="followers-info">
                <span className="followers-count">59.9K</span>
                <span className="followers-label">Followers</span>
              </div>
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}

