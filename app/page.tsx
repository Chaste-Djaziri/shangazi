import Image from "next/image";

export default function Home() {
  return (
    <main>
      <section className="hero">
        <div className="hero-container">
          <div className="hero-left">
            {/* Left content will go here */}
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
              <div className="youtube-subscribers">
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
              </div>
              <div className="twitter-followers">
                <Image
                  src="/socials/x-twitter.png"
                  alt="Twitter/X"
                  width={40}
                  height={40}
                  className="twitter-icon"
                />
                <div className="followers-info">
                  <span className="followers-count">12.8K</span>
                  <span className="followers-label">Followers</span>
                </div>
              </div>
              <div className="tiktok-followers">
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
              </div>
              <div className="instagram-followers">
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
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
