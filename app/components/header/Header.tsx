"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import Dropdown from "./Dropdown";
import { authClient } from "@/auth-client";
import SkeletonBlock from "../skeletons/SkeletonBlock";

export default function Header() {
  const { data: session, isPending } = authClient.useSession();
  const headerRef = useRef<HTMLElement | null>(null);
  const lastScrollYRef = useRef(0);
  const isHeroInViewRef = useRef(false);
  const [isFloatingMenuVisible, setIsFloatingMenuVisible] = useState(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [openDropdown, setOpenDropdown] = useState<string | null>(null);

  useEffect(() => {
    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      const headerHeight = headerRef.current?.offsetHeight ?? 0;
      const isPastHeader = currentScrollY > headerHeight;
      const isScrollingUp = currentScrollY < lastScrollYRef.current;

      setIsFloatingMenuVisible(isPastHeader && isScrollingUp && !isHeroInViewRef.current);
      lastScrollYRef.current = Math.max(currentScrollY, 0);
    };

    const heroElement = document.querySelector(".hero");
    const heroObserver = heroElement
      ? new IntersectionObserver(([entry]) => {
          isHeroInViewRef.current = entry.isIntersecting;

          if (entry.isIntersecting) {
            setIsFloatingMenuVisible(false);
          }
        })
      : null;

    if (heroElement && heroObserver) {
      heroObserver.observe(heroElement);
    }

    lastScrollYRef.current = window.scrollY;
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => {
      window.removeEventListener("scroll", handleScroll);
      heroObserver?.disconnect();
    };
  }, []);

  useEffect(() => {
    // Prevent body scroll when an overlay panel is open
    if (isSidebarOpen || isSearchOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isSidebarOpen, isSearchOpen]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const aboutLinks = [
    { href: "/about", label: "About" },
    { href: "/services", label: "Services" },
  ];

  const contentLinks = [
    { href: "/blog", label: "Blog / Articles" },
    { href: "/courses", label: "Courses" },
    { href: "/videos", label: "Videos" },
    { href: "/topics", label: "Topics" },
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
    setOpenDropdown(null); // Close any open dropdowns when sidebar closes
  };

  const toggleDropdown = (label: string) => {
    setOpenDropdown(openDropdown === label ? null : label);
  };

  const openSearchModal = () => {
    setIsSearchOpen(true);
    setIsSidebarOpen(false);
  };

  const closeSearchModal = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  return (
    <>
      <header ref={headerRef} className="header">
        <div className="header-container">
          <Link href="/" prefetch={false} className="logo-link" onClick={closeSidebar}>
            <Image
              src="/logo/Shangazi Logo Variations-1.png"
              alt="Shangazi Logo"
              width={156}
              height={52}
              priority
              sizes="156px"
              className="logo-image logo-default"
              style={{ width: "auto", height: "auto" }}
            />
            <Image
              src="/tv-logo.png"
              alt="Shangazi Logo"
              width={220}
              height={80}
              priority
              sizes="220px"
              className="logo-image logo-tv"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>

          <nav className="nav desktop-nav">
            <Link href="/" prefetch={false} className="nav-link">
              Home
            </Link>
            <Dropdown label="About" links={aboutLinks} />
            <Dropdown label="Content" links={contentLinks} />
            <Dropdown label="Impact" links={impactLinks} />
            <Dropdown label="Get Involved" links={getInvolvedLinks} />
            <Dropdown label="Help" links={helpLinks} />
          </nav>

          <div className="header-actions">
            <div className="desktop-header-tools">
              <button type="button" className="profile-icon desktop-profile" aria-label="Open search" onClick={openSearchModal}>
                <Image src="/vectors/search.svg" alt="" width={21} height={21} className="profile-icon-image" />
              </button>

              <Link 
                href={session ? "/discover" : "/login"} 
                className="ask-shangazi-button desktop-ask-shangazi" 
                aria-label={session ? "Portal" : "Login"}
              >
                <span className="ask-shangazi-text">{session ? "Portal" : "Login"}</span>
              </Link>
            </div>

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

      {isFloatingMenuVisible && !isSidebarOpen && (
        <button
          type="button"
          className="floating-menu-button"
          onClick={toggleSidebar}
          aria-label="Open menu"
          aria-expanded={isSidebarOpen}
        >
          Menu
        </button>
      )}

      {/* Sidebar Overlay */}
      <div className={`sidebar-overlay ${isSidebarOpen ? "active" : ""}`} onClick={closeSidebar}></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isSidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <Link href="/" prefetch={false} className="sidebar-logo-link" onClick={closeSidebar}>
            <Image
              src="/logo/Shangazi Logo Variations-1.png"
              alt="Shangazi Logo"
              width={130}
              height={46}
              priority
              sizes="130px"
              className="sidebar-logo"
              style={{ width: "auto", height: "auto" }}
            />
          </Link>
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
          <Link href="/" prefetch={false} className="sidebar-link" onClick={closeSidebar}>
            Home
          </Link>
          <div className="sidebar-dropdown">
            <button
              type="button"
              className="sidebar-dropdown-label"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown("About");
              }}
              aria-expanded={openDropdown === "About"}
            >
              About
              <span className="sidebar-dropdown-arrow">
                {openDropdown === "About" ? "−" : "+"}
              </span>
            </button>
            <div className={`sidebar-dropdown-links ${openDropdown === "About" ? "open" : ""}`}>
              {aboutLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  prefetch={false}
                  className="sidebar-dropdown-link"
                  onClick={closeSidebar}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="sidebar-dropdown">
            <button
              type="button"
              className="sidebar-dropdown-label"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown("Content");
              }}
              aria-expanded={openDropdown === "Content"}
            >
              Content
              <span className="sidebar-dropdown-arrow">
                {openDropdown === "Content" ? "−" : "+"}
              </span>
            </button>
            <div className={`sidebar-dropdown-links ${openDropdown === "Content" ? "open" : ""}`}>
              <Link href="/blog" prefetch={false} className="sidebar-dropdown-link" onClick={closeSidebar}>Blog / Articles</Link>
              <Link href="/courses" prefetch={false} className="sidebar-dropdown-link" onClick={closeSidebar}>Courses</Link>
              <Link href="/videos" prefetch={false} className="sidebar-dropdown-link" onClick={closeSidebar}>Videos</Link>
              <Link href="/topics" prefetch={false} className="sidebar-dropdown-link" onClick={closeSidebar}>Topics</Link>
            </div>
          </div>
          <div className="sidebar-dropdown">
            <button
              type="button"
              className="sidebar-dropdown-label"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown("Impact");
              }}
              aria-expanded={openDropdown === "Impact"}
            >
              Impact
              <span className="sidebar-dropdown-arrow">
                {openDropdown === "Impact" ? "−" : "+"}
              </span>
            </button>
            <div className={`sidebar-dropdown-links ${openDropdown === "Impact" ? "open" : ""}`}>
              {impactLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  prefetch={false}
                  className="sidebar-dropdown-link"
                  onClick={closeSidebar}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="sidebar-dropdown">
            <button
              type="button"
              className="sidebar-dropdown-label"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown("Get Involved");
              }}
              aria-expanded={openDropdown === "Get Involved"}
            >
              Get Involved
              <span className="sidebar-dropdown-arrow">
                {openDropdown === "Get Involved" ? "−" : "+"}
              </span>
            </button>
            <div className={`sidebar-dropdown-links ${openDropdown === "Get Involved" ? "open" : ""}`}>
              {getInvolvedLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  prefetch={false}
                  className="sidebar-dropdown-link"
                  onClick={closeSidebar}
                >
                  {link.label}
                </Link>
              ))}
            </div>
          </div>
          <div className="sidebar-dropdown">
            <button
              type="button"
              className="sidebar-dropdown-label"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleDropdown("Help");
              }}
              aria-expanded={openDropdown === "Help"}
            >
              Help
              <span className="sidebar-dropdown-arrow">
                {openDropdown === "Help" ? "−" : "+"}
              </span>
            </button>
            <div className={`sidebar-dropdown-links ${openDropdown === "Help" ? "open" : ""}`}>
              {helpLinks.map((link, index) => (
                <Link
                  key={index}
                  href={link.href}
                  prefetch={false}
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
          <button
            type="button"
            className="sidebar-profile"
            onClick={openSearchModal}
            aria-label="Open search"
          >
            <Image src="/vectors/search.svg" alt="" width={21} height={21} className="profile-icon-image" />
            <span>Search</span>
          </button>
        </div>
      </aside>

      {isSearchOpen ? (
        <div className="search-modal-overlay" onClick={closeSearchModal} role="presentation">
          <div
            className="search-modal"
            role="dialog"
            aria-modal="true"
            aria-labelledby="site-search-title"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="search-modal-header">
              <div>
                <h2 id="site-search-title">Search Shangazi</h2>
                <p>Search pages, articles, and topics across the site.</p>
              </div>
              <button type="button" className="search-modal-close" onClick={closeSearchModal} aria-label="Close search">
                ×
              </button>
            </div>

            <div className="search-modal-input-wrap">
              <Image src="/vectors/search.svg" alt="" width={18} height={18} className="search-modal-icon" />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="search-modal-input"
                placeholder="Search the site"
                autoFocus
              />
            </div>

            <div className="search-modal-body">
              {searchQuery.trim() ? (
                <p className="search-modal-hint">Search results for “{searchQuery}” can be wired up next.</p>
              ) : (
                <p className="search-modal-hint">Start typing to search Shangazi content.</p>
              )}
            </div>
          </div>
        </div>
      ) : null}
    </>
  );
}
