"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/auth-client";
import { useRouter } from "next/navigation";
import { Search, LogOut, User } from "lucide-react";

export default function MainHeader() {
  const router = useRouter();
  const { data: session } = authClient.useSession();
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  const closeSearchModal = () => {
    setIsSearchOpen(false);
    setSearchQuery("");
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsSearchOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <>
      <div className="header-container !max-w-full !px-8 h-20 flex items-center justify-between">
        {/* Left: Section Title (Discovery Area) */}
        <div className="flex items-center gap-4">
          <h2 className="text-xl font-serif text-gray-800 lg:hidden">SEC Portal</h2>
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400 font-marcellus">
            <span>SEC Portal</span>
            <span>/</span>
            <span className="text-gray-900 font-bold uppercase tracking-wider">Discover</span>
          </div>
        </div>

        {/* Right: Actions */}
        <div className="flex items-center gap-6">
          {/* Search Trigger */}
          <button 
            onClick={() => setIsSearchOpen(true)}
            className="p-2 text-gray-400 hover:text-primary transition-colors"
            aria-label="Open search"
          >
            <Search size={22} />
          </button>

          {/* User Profile & Logout */}
          <div className="flex items-center gap-4 pl-6 border-l border-gray-100">
            <button 
              onClick={handleLogout}
              className="hidden sm:block text-sm font-marcellus text-gray-400 hover:text-red-600 transition-colors"
            >
              Logout
            </button>
            <Link href="/profile" className="relative w-10 h-10 rounded-full overflow-hidden border-2 border-gray-50 hover:border-primary transition-all duration-300 group">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name || "User"}
                  fill
                  className="object-cover group-hover:scale-110 transition-transform duration-300"
                />
              ) : (
                <div className="w-full h-full bg-primary/5 flex items-center justify-center text-primary font-bold">
                  {(session?.user?.name?.[0] || session?.user?.email?.[0] || "?").toUpperCase()}
                </div>
              )}
            </Link>
          </div>
        </div>
      </div>

      {/* Search Modal (Simplified copy from Header.tsx) */}
      {isSearchOpen && (
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
                <h2 id="site-search-title" className="font-serif">Search SEC Portal</h2>
                <p className="text-sm text-gray-500">Find guidance, articles, and member updates.</p>
              </div>
              <button type="button" className="search-modal-close" onClick={closeSearchModal} aria-label="Close search">
                ×
              </button>
            </div>

            <div className="search-modal-input-wrap">
              <Search className="search-modal-icon text-gray-400" size={18} />
              <input
                type="search"
                value={searchQuery}
                onChange={(event) => setSearchQuery(event.target.value)}
                className="search-modal-input"
                placeholder="Type to search..."
                autoFocus
              />
            </div>

            <div className="search-modal-body">
              {searchQuery.trim() ? (
                <p className="search-modal-hint italic">Searching for “{searchQuery}”...</p>
              ) : (
                <p className="search-modal-hint text-gray-400">Start typing to explore content.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}
