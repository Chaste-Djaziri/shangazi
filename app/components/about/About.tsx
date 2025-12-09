"use client"

import { useRef, useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import gsap from "gsap"

export default function About() {
  const aboutRef = useRef<HTMLElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const [isExpanded, setIsExpanded] = useState(false)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline()

            if (imageRef.current) {
              tl.fromTo(
                imageRef.current,
                { opacity: 0, x: -50, scale: 0.9, filter: "blur(10px)" },
                {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  filter: "blur(0px)",
                  duration: 1,
                  ease: "power3.out",
                },
              )
            }

            if (contentRef.current) {
              const title = contentRef.current.querySelector(".about-title")
              const text = contentRef.current.querySelector(".about-text")
              const button = contentRef.current.querySelector(".about-button")

              tl.fromTo(
                title,
                { opacity: 0, x: 50, rotateY: 20 },
                { opacity: 1, x: 0, rotateY: 0, duration: 0.9, ease: "back.out(1.7)" },
                "-=0.5",
              )
                .fromTo(
                  text,
                  { opacity: 0, x: 40, y: 10 },
                  { opacity: 1, x: 0, y: 0, duration: 0.85, ease: "power2.out" },
                  "-=0.6",
                )
                .fromTo(
                  button,
                  { opacity: 0, y: 30, scale: 0.8 },
                  { opacity: 1, y: 0, scale: 1, duration: 0.7, ease: "elastic.out(1, 0.5)" },
                  "-=0.5",
                )

              if (button) {
                button.addEventListener("mouseenter", () => {
                  gsap.to(button, { scale: 1.05, duration: 0.3, ease: "power2.out" })
                })
                button.addEventListener("mouseleave", () => {
                  gsap.to(button, { scale: 1, duration: 0.3, ease: "power2.out" })
                })
              }

              observer.disconnect()
            }
          }
        })
      },
      {
        threshold: 0.2,
      },
    )

    if (aboutRef.current) {
      observer.observe(aboutRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768)
    }

    checkMobile()
    window.addEventListener("resize", checkMobile)

    return () => {
      window.removeEventListener("resize", checkMobile)
    }
  }, [])

  return (
    <section className="about" ref={aboutRef}>
      <div className="about-container">
        <div className="about-image-wrapper" ref={imageRef}>
          <Image
            src="/profile/about.png"
            alt="Emma Claudine - Shangazi"
            width={1000}
            height={1200}
            className="about-image"
          />
        </div>
        <div className="about-content" ref={contentRef}>
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
                onClick={() => setIsExpanded(!isExpanded)}
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
