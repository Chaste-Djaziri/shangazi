"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import Link from "next/link";
import { authClient } from "@/auth-client";
import { useRouter, usePathname } from "next/navigation";
import { Search, LogOut, X, Menu, PanelLeftClose, PanelLeft } from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";

export default function MainHeader() {
  const router = useRouter();
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { isCollapsed, toggleCollapsed, toggleMobile } = useSidebar();
  const [isSearchExpanded, setIsSearchExpanded] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const searchInputRef = useRef<HTMLInputElement>(null);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  const toggleSearch = () => {
    setIsSearchExpanded(!isSearchExpanded);
    if (!isSearchExpanded) {
      setTimeout(() => searchInputRef.current?.focus(), 100);
    }
  };

  const handleSearch = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setIsSearchExpanded(false);
    }
  };

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsSearchExpanded(false);
        setSearchQuery("");
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  return (
    <div className="header-container !max-w-full !px-8 h-20 flex items-center justify-between">
      {/* Left: Sidebar Toggle & Section Title */}
      <div className="flex items-center gap-4">
        {/* Mobile Menu Trigger */}
        <button 
          onClick={toggleMobile}
          className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-500"
          aria-label="Open menu"
        >
          <Menu size={22} />
        </button>

        {/* Desktop Sidebar Toggle */}
        <button 
          onClick={toggleCollapsed}
          className="hidden lg:flex p-2 hover:bg-gray-100 rounded-lg transition-colors text-gray-400 hover:text-primary"
          aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
        >
          {isCollapsed ? <PanelLeft size={22} /> : <PanelLeftClose size={22} />}
        </button>

        <div className={`flex items-center gap-2 transition-opacity duration-300 ${isSearchExpanded ? "opacity-0 invisible w-0" : "opacity-100 visible"}`}>
          <h2 className="text-xl font-serif text-gray-800 lg:hidden">SEC Portal</h2>
          <div className="hidden lg:flex items-center gap-2 text-sm text-gray-400 font-marcellus text-nowrap">
            <span>SEC Portal</span>
            <span>/</span>
            <span className="text-gray-900 font-bold uppercase tracking-wider">
              {pathname.includes("/articles") ? "Articles" : 
               pathname.includes("/exclusive-courses") ? "Courses" : 
               pathname.includes("/exclusive-videos") ? "Videos" : 
               pathname.includes("/profile") ? "Profile" : 
               pathname.includes("/settings") ? "Settings" : "Discover"}
            </span>
          </div>
        </div>
      </div>

      <nav className="hidden xl:flex items-center gap-6 ml-8">
        <Link href="/discover" className={`text-sm font-marcellus transition-colors ${pathname === "/discover" ? "text-primary font-bold" : "text-gray-500 hover:text-primary"}`}>Discover</Link>
        <Link href="/articles" className={`text-sm font-marcellus transition-colors ${pathname.includes("/articles") ? "text-primary font-bold" : "text-gray-500 hover:text-primary"}`}>Articles</Link>
        <Link href="/exclusive-courses" className={`text-sm font-marcellus transition-colors ${pathname.includes("/exclusive-courses") ? "text-primary font-bold" : "text-gray-500 hover:text-primary"}`}>Courses</Link>
        <Link href="/exclusive-videos" className={`text-sm font-marcellus transition-colors ${pathname.includes("/exclusive-videos") ? "text-primary font-bold" : "text-gray-500 hover:text-primary"}`}>Videos</Link>
      </nav>

      {/* Center/Right: Expanding Search & Actions */}
      <div className="flex-1 flex items-center justify-end gap-6">
        {/* Portal Specific Search */}
        <div 
          className={`relative flex items-center transition-all duration-300 ease-in-out ${
            isSearchExpanded ? "flex-1 max-w-md" : "w-10"
          }`}
        >
          <button 
            onClick={toggleSearch}
            className={`p-2 text-gray-400 hover:text-primary transition-colors z-10 ${isSearchExpanded ? "absolute left-2" : ""}`}
            aria-label={isSearchExpanded ? "Close search" : "Open search"}
          >
            {isSearchExpanded ? <Search size={18} /> : <Search size={22} />}
          </button>
          
          <input
            ref={searchInputRef}
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            placeholder="Search portal content, guidance, articles..."
            className={`w-full bg-gray-50 border border-transparent rounded-full py-2 pl-10 pr-10 outline-none focus:border-primary/30 focus:bg-white transition-all duration-300 font-marcellus text-sm ${
              isSearchExpanded ? "opacity-100 scale-100" : "opacity-0 scale-95 pointer-events-none"
            }`}
          />

          {isSearchExpanded && (
            <button 
              onClick={() => {
                setSearchQuery("");
                setIsSearchExpanded(false);
              }}
              className="absolute right-3 p-1 text-gray-400 hover:text-gray-600 transition-colors"
            >
              <X size={16} />
            </button>
          )}
        </div>

        {/* User Profile & Logout */}
        <div className={`flex items-center gap-4 pl-6 border-l border-gray-100 transition-all duration-300 ${isSearchExpanded ? "hidden sm:flex" : "flex"}`}>
          <button 
            onClick={handleLogout}
            className="hidden md:block text-sm font-marcellus text-gray-400 hover:text-red-600 transition-colors"
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
  );
}
