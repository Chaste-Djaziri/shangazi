"use client"

import { useRef } from "react"
import Image from "next/image"
import Link from "next/link"

const quickLinks = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About" },
  { href: "/topics", label: "Our Focus" },
  { href: "/blog", label: "Stories & Learning" },
  { href: "/media", label: "Videos" },
  { href: "/contact", label: "Contact" },
]

const serviceLinks = [
  { href: "/topics", label: "Reproductive Health" },
  { href: "/topics", label: "Relationships & Marriage" },
  { href: "/topics", label: "Youth Guidance" },
  { href: "/topics", label: "Intimacy & Sexual Wellness" },
  { href: "/media", label: "Video Series" },
  { href: "/blog", label: "Educational Content" },
]

const resourceLinks = [
  { href: "/faq", label: "Help Center" },
  { href: "/contact", label: "Support" },
  { href: "/terms", label: "Term Services" },
  { href: "/blog", label: "Documentation" },
  { href: "/privacy", label: "Privacy Policy" },
]

export default function Footer() {
  const footerRef = useRef<HTMLElement>(null)

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" })
  }

  return (
    <footer className="site-footer" ref={footerRef}>
      <div className="site-footer-shell">
        <div className="site-footer-top">
          <div className="site-footer-brand">
            <Link href="/" prefetch={false} className="site-footer-logo-link">
              <Image
                src="/logo/Shangazi Logo Variations-8.png"
                alt="Shangazi Logo"
                width={191}
                height={72}
                sizes="191px"
                className="site-footer-logo"
              />
            </Link>

            <p className="site-footer-brand-copy">
              Empowering communities through dialogue,
              <br />
              education, and meaningful conversations.
            </p>

            <div className="site-footer-contact">
              <p>Phone : +250 788 597 423</p>
              <p>Email : comms@shangazi.rw</p>
              <p>Location: Kigali, Rwanda</p>
            </div>

            <div className="site-footer-socials">
              <a href="https://www.facebook.com/emmaclaudine1" target="_blank" rel="noopener noreferrer" className="site-footer-social" aria-label="Facebook">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                </svg>
              </a>
              <a href="https://x.com" target="_blank" rel="noopener noreferrer" className="site-footer-social" aria-label="X">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M18.244 2H21.5l-7.12 8.138L22.75 22h-6.555l-5.133-6.71L5.19 22H1.93l7.614-8.701L1.5 2h6.72l4.64 6.13L18.244 2Zm-1.15 18h1.804L7.227 3.894H5.29L17.094 20Z" />
                </svg>
              </a>
              <a href="https://www.youtube.com/@emmaclaudine/videos" target="_blank" rel="noopener noreferrer" className="site-footer-social" aria-label="YouTube">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                </svg>
              </a>
              <a href="https://www.instagram.com/emmaclaudine1/" target="_blank" rel="noopener noreferrer" className="site-footer-social" aria-label="Instagram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069Zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073Zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162Zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4Zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44Z" />
                </svg>
              </a>
              <a href="https://t.me" target="_blank" rel="noopener noreferrer" className="site-footer-social" aria-label="Telegram">
                <svg width="18" height="18" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M21.94 4.62a1.5 1.5 0 0 0-1.57-.24L3.3 11.46a1.5 1.5 0 0 0 .13 2.82l4.29 1.42 1.56 4.96a1.5 1.5 0 0 0 2.62.47l2.4-3.03 4.07 3.03a1.5 1.5 0 0 0 2.37-.91L22.97 6a1.5 1.5 0 0 0-1.03-1.38Zm-3.41 4.02-7.21 6.85-.29 3.13-1.31-4.18 8.81-7.77Z" />
                </svg>
              </a>
            </div>
          </div>

          <div className="site-footer-main">
            <div className="site-footer-newsletter-row">
              <div className="site-footer-newsletter-copy">
                <h3>Subscribe Our Newsletter</h3>
                <p>Subscribe our newsletter to get update information.</p>
              </div>

              <form className="site-footer-newsletter-form">
                <input type="email" aria-label="Email address" />
                <button type="submit" className="site-footer-newsletter-button">
                  <span>Subscribe</span>
                  <Image src="/vectors/subscribe.svg" alt="" width={18} height={18} className="site-footer-newsletter-icon" />
                </button>
              </form>
            </div>

            <div className="site-footer-divider" />

            <div className="site-footer-links-grid">
              <div className="site-footer-links-column">
                <h4>Quick Links</h4>
                <ul>
                  {quickLinks.map((link) => (
                    <li key={link.href}>
                      <Link href={link.href} prefetch={false}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="site-footer-links-column">
                <h4>Services</h4>
                <ul>
                  {serviceLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} prefetch={false}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="site-footer-links-column">
                <h4>Resources</h4>
                <ul>
                  {resourceLinks.map((link) => (
                    <li key={link.label}>
                      <Link href={link.href} prefetch={false}>
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="site-footer-bottom">
          <div className="site-footer-bottom-meta">
            <p className="site-footer-copyright">© Shangazi. All Right Reserved 2026.</p>
            <p className="site-footer-credit">
              <span>Web made by </span>
              <a href="https://micorp.pro" target="_blank" rel="noopener noreferrer">
                Mirror Corporation
              </a>
            </p>
          </div>
          <button type="button" className="site-footer-top-button" onClick={scrollToTop}>
            <span>Back To Top</span>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M12 19V5" />
              <path d="M5 12l7-7 7 7" />
            </svg>
          </button>
        </div>
      </div>
    </footer>
  )
}
