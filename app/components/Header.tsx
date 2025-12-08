"use client";

import Image from "next/image";
import Link from "next/link";
import Dropdown from "./Dropdown";

export default function Header() {
  const aboutLinks = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
  ];

  const contentLinks = [
    { href: "/content", label: "Content Page" },
    { href: "/blog", label: "Blog / Articles" },
    { href: "/media", label: "Media" },
  ];

  const impactLinks = [
    { href: "/testimonials", label: "Testimonials" },
    { href: "/impact", label: "Impact" },
    { href: "/social-proof", label: "Social Proof" },
  ];

  const getInvolvedLinks = [
    { href: "/newsletter", label: "Newsletter" },
    { href: "/booking", label: "Booking" },
    { href: "/donation", label: "Donation" },
  ];

  const helpLinks = [
    { href: "/contact", label: "Contact" },
    { href: "/faq", label: "FAQ" },
  ];

  return (
    <header className="header">
      <div className="header-container">
        <Link href="/" className="logo-link">
          <Image
            src="/logo.png"
            alt="Shangazi Logo"
            width={180}
            height={65}
            priority
            className="logo-image logo-default"
          />
          <Image
            src="/tv-logo.png"
            alt="Shangazi Logo"
            width={220}
            height={80}
            priority
            className="logo-image logo-tv"
          />
        </Link>

        <nav className="nav">
          <Link href="/" className="nav-link">
            Home
          </Link>
          <Dropdown label="About" links={aboutLinks} />
          <Dropdown label="Content" links={contentLinks} />
          <Dropdown label="Impact" links={impactLinks} />
          <Dropdown label="Get Involved" links={getInvolvedLinks} />
          <Dropdown label="Help" links={helpLinks} />
        </nav>
      </div>
      <Link href="/login" className="profile-icon" aria-label="Profile">
        <svg
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
        >
          <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"></path>
          <circle cx="12" cy="7" r="4"></circle>
        </svg>
      </Link>
    </header>
  );
}
