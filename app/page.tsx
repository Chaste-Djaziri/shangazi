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
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
