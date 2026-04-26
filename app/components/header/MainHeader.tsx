"use client";

import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";

export default function MainHeader() {
  const router = useRouter();

  const handleLogout = async () => {
    await authClient.signOut();
    router.push("/login");
  };

  return (
    <header className="header border-b border-gray-100">
      <div className="header-container">
        <Link href="/discover" className="logo-link">
          <Image
            src="/logo/Shangazi Logo Variations-1.png"
            alt="Shangazi Logo"
            width={120}
            height={40}
            priority
            className="logo-image"
            style={{ width: "auto", height: "auto" }}
          />
        </Link>

        <nav className="nav desktop-nav">
          <Link href="/discover" className="nav-link">
            Discover
          </Link>
          <Link href="/blog" className="nav-link">
            Articles
          </Link>
          <Link href="/booking" className="nav-link">
            My Guidance
          </Link>
        </nav>

        <div className="header-actions">
          <button 
            type="button" 
            className="ask-shangazi-button"
            onClick={handleLogout}
          >
            <span className="ask-shangazi-text">Logout</span>
          </button>
        </div>
      </div>
    </header>
  );
}
