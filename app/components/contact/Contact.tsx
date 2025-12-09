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
  const contactInfoRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    // Set initial states
    gsap.set([titleRef.current, subtitleRef.current], { opacity: 0, y: 30 })
    if (formRef.current) {
      gsap.set(formRef.current.querySelectorAll(".form-group"), { opacity: 0, y: 20 })
    }
    if (imageRef.current) {
      gsap.set(imageRef.current, { opacity: 0, x: 50, scale: 0.95 })
    }
    if (contactInfoRef.current) {
      gsap.set(contactInfoRef.current.querySelectorAll(".contact-info-column"), { opacity: 0, y: 20 })
      gsap.set(contactInfoRef.current.querySelectorAll(".contact-info-item"), { opacity: 0, y: 10 })
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const tl = gsap.timeline()

            // Animate title
            if (titleRef.current) {
              tl.to(titleRef.current, {
                opacity: 1,
                y: 0,
                duration: 0.8,
                ease: "power3.out",
              })
            }

            // Animate subtitle
            if (subtitleRef.current) {
              tl.to(
                subtitleRef.current,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.8,
                  ease: "power3.out",
                },
                "-=0.5",
              )
            }

            // Animate form groups (including labels and inputs)
            if (formRef.current) {
              const formGroups = formRef.current.querySelectorAll(".form-group")
              tl.to(
                formGroups,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  stagger: 0.1,
                  ease: "power3.out",
                },
                "-=0.4",
              )
            }

            // Animate image container
            if (imageRef.current) {
              tl.to(
                imageRef.current,
                {
                  opacity: 1,
                  x: 0,
                  scale: 1,
                  duration: 0.8,
                  ease: "power3.out",
                },
                "-=0.6",
              )
            }

            // Animate contact info items
            if (contactInfoRef.current) {
              const infoColumns = contactInfoRef.current.querySelectorAll(".contact-info-column")
              const infoItems = contactInfoRef.current.querySelectorAll(".contact-info-item")
              tl.to(
                infoColumns,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.6,
                  stagger: 0.15,
                  ease: "power3.out",
                },
                "-=0.4",
              )
              .to(
                infoItems,
                {
                  opacity: 1,
                  y: 0,
                  duration: 0.4,
                  stagger: 0.08,
                  ease: "power3.out",
                },
                "-=0.3",
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
            <div className="contact-image-overlay"></div>
            <div className="contact-info" ref={contactInfoRef}>
              <div className="contact-info-grid">
                <div className="contact-info-column">
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"></path>
                        <circle cx="12" cy="10" r="3"></circle>
                      </svg>
                    </div>
                    <div className="contact-info-content">
                      <h3 className="contact-info-label">Address</h3>
                      <p className="contact-info-text">Kigali, Rwanda</p>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                        <polyline points="22,6 12,13 2,6"></polyline>
                      </svg>
                    </div>
                    <div className="contact-info-content">
                      <h3 className="contact-info-label">Email</h3>
                      <a href="mailto:info@shangazi.rw" className="contact-info-text">info@shangazi.rw</a>
                    </div>
                  </div>
                </div>
                <div className="contact-info-column">
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"></path>
                      </svg>
                    </div>
                    <div className="contact-info-content">
                      <h3 className="contact-info-label">Phone</h3>
                      <a href="tel:+250788123456" className="contact-info-text">+250 788 123 456</a>
                    </div>
                  </div>
                  <div className="contact-info-item">
                    <div className="contact-info-icon">
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M18 2h-3a4 4 0 0 0-4 4v3H7v3h4v8h3v-8h3l1-3h-4V6a1 1 0 0 1 1-1h3z"></path>
                      </svg>
                    </div>
                    <div className="contact-info-content">
                      <h3 className="contact-info-label">Support</h3>
                      <a href="/support" className="contact-info-text">Get Help</a>
                    </div>
                  </div>
                </div>
              </div>
              <div className="contact-info-item contact-info-socials">
                <h3 className="contact-info-label">Follow Us</h3>
                <div className="contact-socials">
                  <a
                    href="https://www.youtube.com/@emmaclaudine/videos"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link"
                    aria-label="YouTube"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.facebook.com/emmaclaudine1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link"
                    aria-label="Facebook"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.tiktok.com/@emmaclaudine1"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link"
                    aria-label="TikTok"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                  <a
                    href="https://www.instagram.com/emmaclaudine1/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="contact-social-link"
                    aria-label="Instagram"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                    </svg>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}

