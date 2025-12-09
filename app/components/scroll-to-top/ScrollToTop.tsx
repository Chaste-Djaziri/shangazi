"use client"

import { useState, useEffect, useRef } from "react"
import gsap from "gsap"

export default function ScrollToTop() {
  const [isVisible, setIsVisible] = useState(false)
  const buttonRef = useRef<HTMLButtonElement>(null)

  useEffect(() => {
    const handleScroll = () => {
      const scrollY = window.scrollY
      setIsVisible(scrollY > 300)
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  useEffect(() => {
    if (buttonRef.current) {
      if (isVisible) {
        gsap.set(buttonRef.current, { display: "flex", pointerEvents: "auto" })
        gsap.fromTo(
          buttonRef.current,
          { opacity: 0, scale: 0.8, y: 20 },
          { opacity: 1, scale: 1, y: 0, duration: 0.3, ease: "power2.out" }
        )
      } else {
        gsap.to(buttonRef.current, {
          opacity: 0,
          scale: 0.8,
          y: 20,
          duration: 0.3,
          ease: "power2.in",
          onComplete: () => {
            if (buttonRef.current) {
              gsap.set(buttonRef.current, { display: "none", pointerEvents: "none" })
            }
          },
        })
      }
    }
  }, [isVisible])

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    })
  }

  return (
    <button
      ref={buttonRef}
      className="scroll-to-top"
      onClick={scrollToTop}
      aria-label="Scroll to top"
    >
      <svg
        width="20"
        height="20"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M18 15l-6-6-6 6" />
      </svg>
    </button>
  )
}
