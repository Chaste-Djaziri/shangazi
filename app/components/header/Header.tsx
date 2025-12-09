"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "./Dropdown";

export default function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    // Prevent body scroll when sidebar is open
    if (isSidebarOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen]);

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

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const closeSidebar = () => {
    setIsSidebarOpen(false);
  };

  return (
    <>
      <header className={`header ${isScrolled ? "scrolled" : ""}`}>
        <div className="header-container">
          <Link href="/" className="logo-link" onClick={closeSidebar}>
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

          <nav className="nav desktop-nav">
            <Link href="/" className="nav-link">
              Home
            </Link>
            <Dropdown label="About" links={aboutLinks} />
            <Dropdown label="Content" links={contentLinks} />
            <Dropdown label="Impact" links={impactLinks} />
            <Dropdown label="Get Involved" links={getInvolvedLinks} />
            <Dropdown label="Help" links={helpLinks} />
          </nav>

          <div className="header-actions">
            <Link href="/login" className="profile-icon desktop-profile" aria-label="Profile">
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

            <button
              className="menu-toggle"
              onClick={toggleSidebar}
              aria-label="Toggle menu"
              aria-expanded={isSidebarOpen}
            >
              <span className={`menu-icon ${isSidebarOpen ? "open" : ""}`}>
                <span></span>
                <span></span>
                <span></span>
              </span>
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <button className="sidebar-close" onClick={closeSidebar} aria-label="Close menu">
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
              <line x1="18" y1="6" x2="6" y2="18"></line>
              <line x1="6" y1="6" x2="18" y2="18"></line>
            </svg>
          </button>
        </div>

        <nav className="sidebar-nav">
          <Link href="/" className="sidebar-link" onClick={closeSidebar}>
            Home
          </Link>
          <div className="sidebar-dropdown">
            <div className="sidebar-dropdown-label">About</div>
            <div className="sidebar-dropdown-links">
              {aboutLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="sidebar-dropdown-link"
                  onClick={closeSidebar}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="sidebar-dropdown">
            <div className="sidebar-dropdown-label">Content</div>
            <div className="sidebar-dropdown-links">
              {contentLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="sidebar-dropdown-link"
                  onClick={closeSidebar}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="sidebar-dropdown">
            <div className="sidebar-dropdown-label">Impact</div>
            <div className="sidebar-dropdown-links">
              {impactLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="sidebar-dropdown-link"
                  onClick={closeSidebar}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="sidebar-dropdown">
            <div className="sidebar-dropdown-label">Get Involved</div>
            <div className="sidebar-dropdown-links">
              {getInvolvedLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="sidebar-dropdown-link"
                  onClick={closeSidebar}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="sidebar-dropdown">
            <div className="sidebar-dropdown-label">Help</div>
            <div className="sidebar-dropdown-links">
              {helpLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  className="sidebar-dropdown-link"
                  onClick={closeSidebar}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        <div className="sidebar-footer">
          <Link href="/login" className="sidebar-profile" onClick={closeSidebar} aria-label="Profile">
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
            <span>Profile</span>
          </Link>
        </div>
      </aside>
    </>
  );
}


