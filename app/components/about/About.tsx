"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"

export default function About() {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth <= 768)
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <section className="about">
      <div className="about-container">
        <div className="about-image-wrapper">
          <Image
            src="/profile/about.png"
            alt="Emma Claudine - Shangazi"
            width={1000}
            height={1200}
            className="about-image"
          />
        </div>
        <div className="about-content">
          <h2 className="about-title">
            About <span className="about-title-accent">Shangazi</span>
          </h2>
          <div className="about-text-wrapper">
            <p className={`about-text ${!isExpanded && isMobile ? "about-text-truncated" : ""}`}>
              Emma Claudine, known as "Shangazi Emma-Claudine," is a prominent Rwandan journalist and content creator with
              over 20 years of experience. Her YouTube channel, focusing on reproductive health, relationships, and youth
              counseling, has reached over 482,000 subscribers and 30 million views. Since launching the radio program
              "Imenye Nawe" in 2005, she has been breaking taboos and empowering Rwandan youth through education and open
              dialogue, earning her the affectionate title "Shangazi" (Auntie) among her listeners.
            </p>
            {isMobile && (
              <button
                className="about-read-more"
                onClick={() => setIsExpanded((prev) => !prev)}
                aria-expanded={isExpanded}
              >
                {isExpanded ? "Show Less" : "...more"}
              </button>
            )}
          </div>
          <Link href="/about" className="about-button">
            Learn More About Shangazi
          </Link>
        </div>
      </div>
    </section>
  )
}
