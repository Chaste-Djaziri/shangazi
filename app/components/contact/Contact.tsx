"use client"

import { useRef, useEffect } from "react"
import Image from "next/image"
import gsap from "gsap"

export default function Contact() {
  const contactRef = useRef<HTMLElement>(null)
  const titleRef = useRef<HTMLHeadingElement>(null)
  const subtitleRef = useRef<HTMLParagraphElement>(null)
  const formRef = useRef<HTMLFormElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline()

            if (titleRef.current) {
              tl.fromTo(
                titleRef.current,
                { opacity: 0, y: 30 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
              )
            }

            if (subtitleRef.current) {
              tl.fromTo(
                subtitleRef.current,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.8, ease: "power3.out" },
                "-=0.5",
              )
            }

            if (formRef.current) {
              const formElements = formRef.current.querySelectorAll("input, textarea, button")
              tl.fromTo(
                formElements,
                { opacity: 0, y: 20 },
                { opacity: 1, y: 0, duration: 0.6, stagger: 0.1, ease: "power3.out" },
                "-=0.4",
              )
            }

            if (imageRef.current) {
              tl.fromTo(
                imageRef.current,
                { opacity: 0, x: 50, scale: 0.95 },
                { opacity: 1, x: 0, scale: 1, duration: 0.8, ease: "power3.out" },
                "-=0.6",
              )
            }

            observer.disconnect()
          }
        })
      },
      {
        threshold: 0.2,
      },
    )

    if (contactRef.current) {
      observer.observe(contactRef.current)
    }

    return () => {
      observer.disconnect()
    }
  }, [])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // Handle form submission here
    console.log("Form submitted")
  }

  return (
    <section className="contact" ref={contactRef}>
      <div className="contact-container">
        <div className="contact-left">
          <div className="contact-content">
            <h2 className="contact-title" ref={titleRef}>
              Ask <span className="contact-title-accent">Shangazi</span>
            </h2>
            <p className="contact-subtitle" ref={subtitleRef}>
              Have a question? I'm here to help with confidential advice.
            </p>
            <form className="contact-form" ref={formRef} onSubmit={handleSubmit}>
              <div className="form-group">
                <label htmlFor="name" className="form-label">
                  Your Name
                </label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  className="form-input"
                  placeholder="Enter your name"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="email" className="form-label">
                  Your Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  className="form-input"
                  placeholder="Enter your email"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="subject" className="form-label">
                  Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  className="form-input"
                  placeholder="What is your question about?"
                  required
                />
              </div>
              <div className="form-group">
                <label htmlFor="message" className="form-label">
                  Your Message
                </label>
                <textarea
                  id="message"
                  name="message"
                  className="form-textarea"
                  placeholder="Share your question or concern..."
                  rows={6}
                  required
                />
              </div>
              <button type="submit" className="contact-submit">
                Send Message
              </button>
            </form>
          </div>
        </div>
        <div className="contact-right" ref={imageRef}>
          <div className="contact-image-wrapper">
            <Image
              src="/profile/emma-claudine-4.jpeg"
              alt="Emma Claudine - Shangazi"
              fill
              className="contact-image"
              priority
            />
          </div>
        </div>
      </div>
    </section>
  )
}
