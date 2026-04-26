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
  X,
  Compass,
  MessageSquare,
  Bell,
  Shield,
  Play
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

  const groups = [
    {
      title: "Navigation",
      links: [
        { href: "/discover", label: "Discovery", icon: Compass },
        { href: "/articles", label: "Articles", icon: BookOpen },
        { href: "/courses", label: "Courses", icon: LayoutDashboard },
        { href: "/videos", label: "Videos", icon: Play },
        { href: "/booking", label: "My Guidance", icon: Calendar },
      ]
    },
    {
      title: "Community",
      links: [
        { href: "/messages", label: "Messages", icon: MessageSquare },
        { href: "/notifications", label: "Updates", icon: Bell },
      ]
    },
    {
      title: "Account",
      links: [
        { href: "/profile", label: "My Profile", icon: User },
        { href: "/settings", label: "Settings", icon: Settings },
      ]
    }
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
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60] lg:hidden transition-all duration-300"
          onClick={() => setIsMobileOpen(false)}
        />
      )}

      <aside 
        className={`fixed left-0 top-0 h-screen bg-white border-r border-gray-100 transition-all duration-300 z-[70] flex flex-col
          ${isMobileOpen ? "translate-x-0 shadow-2xl" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-20" : "lg:w-64"}
          w-[280px]
        `}
      >
        {/* Logo Section */}
        <div className="flex items-center justify-center h-20 px-4 border-b border-gray-50">
          <Link href="/discover" className="relative transition-all duration-300">
            {isCollapsed ? (
              <Image
                src="/logo/Shangazi Logo Variations-2.png"
                alt="Shangazi Logo"
                width={36}
                height={36}
                priority
                className="w-9 h-9 object-contain"
              />
            ) : (
              <Image
                src="/logo/Shangazi Logo Variations-1.png"
                alt="Shangazi Logo"
                width={140}
                height={48}
                priority
                className="w-auto h-9 object-contain"
              />
            )}
          </Link>
          <button 
            onClick={() => setIsMobileOpen(false)}
            className="lg:hidden absolute right-4 p-2 hover:bg-gray-50 rounded-lg transition-colors text-gray-400"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Groups */}
        <nav className="flex-1 px-3 py-6 space-y-8 overflow-y-auto custom-scrollbar">
          {groups.map((group, idx) => (
            <div key={idx} className="space-y-1">
              {!isCollapsed && (
                <p className="px-4 text-[10px] font-bold text-gray-400 uppercase tracking-[0.15em] mb-3">
                  {group.title}
                </p>
              )}
              <div className="space-y-1">
                {group.links.map((link) => {
                  const Icon = link.icon;
                  const isActive = pathname === link.href;
                  return (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={`flex items-center gap-3 px-4 py-2.5 rounded-xl transition-all group relative ${
                        isActive 
                          ? "bg-primary/5 text-primary" 
                          : "text-gray-500 hover:bg-gray-50 hover:text-gray-900"
                      }`}
                    >
                      {/* Active Indicator Line */}
                      {isActive && (
                        <div className="absolute left-0 top-1/4 bottom-1/4 w-1 bg-primary rounded-r-full" />
                      )}
                      
                      <Icon size={20} className={`shrink-0 transition-transform duration-200 group-hover:scale-110 ${isActive ? "text-primary" : "text-gray-400 group-hover:text-gray-600"}`} />
                      
                      <span className={`font-marcellus text-[15px] font-medium transition-opacity duration-200 
                        ${isCollapsed ? "lg:opacity-0 lg:absolute" : "opacity-100"}`}>
                        {link.label}
                      </span>

                      {/* Tooltip for collapsed state */}
                      {isCollapsed && (
                        <div className="absolute left-full ml-4 px-3 py-2 bg-gray-900 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 hidden lg:block whitespace-nowrap z-[100] shadow-xl translate-x-[-10px] group-hover:translate-x-0">
                          {link.label}
                          <div className="absolute left-[-4px] top-1/2 -translate-y-1/2 border-8 border-transparent border-right-gray-900" />
                        </div>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Bottom Section */}
        <div className="p-3 space-y-1 border-t border-gray-100 bg-gray-50/50">
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-2.5 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all group relative"
          >
            <LogOut size={20} className="shrink-0 text-gray-400 group-hover:text-red-500" />
            <span className={`font-marcellus text-[15px] font-medium transition-opacity duration-200 
              ${isCollapsed ? "lg:opacity-0 lg:absolute" : "opacity-100"}`}>
              Logout
            </span>
            {isCollapsed && (
              <div className="absolute left-full ml-4 px-3 py-2 bg-red-600 text-white text-xs rounded-lg opacity-0 group-hover:opacity-100 pointer-events-none transition-all duration-200 hidden lg:block whitespace-nowrap z-[100] shadow-xl translate-x-[-10px] group-hover:translate-x-0">
                Logout
              </div>
            )}
          </button>
        </div>
      </aside>
    </>
  );
}
