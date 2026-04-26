"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { authClient } from "@/auth-client";
import { 
  LayoutDashboard, 
  BookOpen, 
  Calendar, 
  User, 
  Settings, 
  LogOut,
  Menu,
  X
} from "lucide-react";
import { useEffect } from "react";
import { useSidebar } from "../../contexts/SidebarContext";

export default function MainSidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  // Close mobile sidebar on route change
  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  const navLinks = [
    { href: "/discover", label: "Discover", icon: LayoutDashboard },
    { href: "/blog", label: "Articles", icon: BookOpen },
    { href: "/booking", label: "My Guidance", icon: Calendar },
  ];

  const bottomLinks = [
    { href: "/profile", label: "Profile", icon: User },
    { href: "/settings", label: "Settings", icon: Settings },
  ];

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  return (
    <>
      {/* Mobile Overlay */}
      {isMobileOpen && (
        <div 
          className="fixed inset-0 bg-black/20 backdrop-blur-sm z-[60] lg:hidden"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 transition-all duration-300 z-[70] flex flex-col
          ${isMobileOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          w-[280px]
        `}
      >
        {/* Logo Section */}
        <div className="p-6 flex items-center justify-between h-20">
          <Link href="/discover" className={`block transition-opacity duration-200 ${isCollapsed ? "lg:opacity-0 lg:invisible" : "opacity-100 visible"}`}>
            <Image
              src="/logo/Shangazi Logo Variations-1.png"
              alt="Shangazi Logo"
              width={120}
              height={40}
              priority
              className="w-auto h-8"
            />
          </Link>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? "bg-primary text-white shadow-lg shadow-primary/20" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className={`font-marcellus font-medium transition-opacity duration-200 
                  ${isCollapsed ? "lg:opacity-0 lg:absolute" : "opacity-100"}`}>
                  {link.label}
                </span>
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden lg:block whitespace-nowrap z-[100]">
                    {link.label}
                  </div>
                )}
              </Link>
            );
          })}
        </nav>

        {/* Bottom Section */}
        <div className="p-4 space-y-2 border-t border-gray-50">
          {bottomLinks.map((link) => {
            const Icon = link.icon;
            const isActive = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all group ${
                  isActive 
                    ? "bg-gray-100 text-gray-900" 
                    : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                }`}
              >
                <Icon size={20} className="shrink-0" />
                <span className={`font-marcellus font-medium transition-opacity duration-200 
                  ${isCollapsed ? "lg:opacity-0 lg:absolute" : "opacity-100"}`}>
                  {link.label}
                </span>
                {isCollapsed && (
                  <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden lg:block whitespace-nowrap z-[100]">
                    {link.label}
                  </div>
                )}
              </Link>
            );
          })}
          
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-3 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group relative"
          >
            <LogOut size={20} className="shrink-0" />
            <span className={`font-marcellus font-medium transition-opacity duration-200 
              ${isCollapsed ? "lg:opacity-0 lg:absolute" : "opacity-100"}`}>
              Logout
            </span>
            {isCollapsed && (
              <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded opacity-0 group-hover:opacity-100 pointer-events-none transition-opacity hidden lg:block whitespace-nowrap z-[100]">
                Logout
              </div>
            )}
          </button>

          {/* User Info */}
          {session?.user && (
            <div className={`mt-4 p-3 bg-gray-50 rounded-xl flex items-center gap-3 overflow-hidden transition-all duration-300 ${isCollapsed ? "lg:p-1 lg:justify-center" : "p-3"}`}>
              <div className="relative w-10 h-10 rounded-full overflow-hidden shrink-0 border border-white shadow-sm">
                {session.user.image ? (
                  <Image
                    src={session.user.image}
                    alt={session.user.name || "User"}
                    fill
                    className="object-cover"
                  />
                ) : (
                  <div className="w-full h-full bg-primary/10 flex items-center justify-center text-primary font-bold">
                    {(session.user.name?.[0] || session.user.email?.[0] || "?").toUpperCase()}
                  </div>
                )}
              </div>
              <div className={`transition-opacity duration-200 ${isCollapsed ? "lg:opacity-0 lg:absolute" : "opacity-100"}`}>
                <p className="text-sm font-bold text-gray-900 truncate max-w-[120px]">
                  {session.user.name || "Member"}
                </p>
                <p className="text-xs text-gray-500 truncate max-w-[120px]">
                  {session.user.email}
                </p>
              </div>
            </div>
          )}
        </div>
      </aside>
    </>
  );
}
