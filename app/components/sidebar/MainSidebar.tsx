// app/components/sidebar/MainSidebar.tsx
"use client";

import { useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { authClient } from "@/auth-client";
import {
  BookOpenText,
  CalendarDays,
  ChevronRight,
  Compass,
  GraduationCap,
  LogOut,
  PlaySquare,
  Settings2,
  UserRound,
  X,
} from "lucide-react";
import { useSidebar } from "../../contexts/SidebarContext";

const primaryLinks = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/articles", label: "Articles", icon: BookOpenText },
  { href: "/exclusive-courses", label: "Courses", icon: GraduationCap },
  { href: "/exclusive-videos", label: "Videos", icon: PlaySquare },
  { href: "/booking", label: "Book guidance", icon: CalendarDays },
] as const;

const accountLinks = [
  { href: "/profile", label: "My profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings2 },
] as const;

export default function MainSidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { isCollapsed, isMobileOpen, setIsMobileOpen } = useSidebar();

  useEffect(() => {
    setIsMobileOpen(false);
  }, [pathname, setIsMobileOpen]);

  useEffect(() => {
    if (!isMobileOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key === "Escape") setIsMobileOpen(false);
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [isMobileOpen, setIsMobileOpen]);

  const handleLogout = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  const renderLink = (link: (typeof primaryLinks)[number] | (typeof accountLinks)[number]) => {
    const Icon = link.icon;
    const active = pathname === link.href || pathname.startsWith(link.href + "/");

    return (
      <Link
        key={link.href}
        href={link.href}
        aria-current={active ? "page" : undefined}
        title={isCollapsed ? link.label : undefined}
        onClick={() => setIsMobileOpen(false)}
        className={`group relative flex h-11 items-center gap-3 rounded-lg px-3 text-sm font-medium transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d5c19] ${
          active
            ? "bg-[#eaf2e8] text-[#1d5c19]"
            : "text-[#5c675d] hover:bg-[#f3f6f1] hover:text-[#183d1a]"
        } ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}
      >
        <Icon size={19} strokeWidth={active ? 2.1 : 1.8} className="shrink-0" aria-hidden="true" />
        <span className={`min-w-0 truncate font-[Manrope] ${isCollapsed ? "lg:sr-only" : ""}`}>
          {link.label}
        </span>
        {active && !isCollapsed && <span className="ml-auto h-1.5 w-1.5 rounded-full bg-[#1d5c19]" aria-hidden="true" />}
      </Link>
    );
  };

  const displayName = session?.user?.name?.trim() || "Your account";
  const email = session?.user?.email || "SEC Portal";
  const initial = (session?.user?.name?.[0] || session?.user?.email?.[0] || "S").toUpperCase();

  return (
    <>
      {isMobileOpen && (
        <button
          type="button"
          aria-label="Close navigation"
          onClick={() => setIsMobileOpen(false)}
          className="fixed inset-0 z-[60] bg-[#102110]/40 lg:hidden"
        />
      )}

      <aside
        aria-label="Portal navigation"
        className={`fixed inset-y-0 left-0 z-[70] flex w-[272px] flex-col border-r border-[#e6ebe4] bg-white transition-[width,transform] duration-200 ease-out
          ${isMobileOpen ? "translate-x-0 shadow-xl" : "-translate-x-full lg:translate-x-0"}
          ${isCollapsed ? "lg:w-[80px]" : "lg:w-64"}`}
      >
        <div className={`flex h-20 shrink-0 items-center border-b border-[#eef0eb] px-5 ${isCollapsed ? "lg:justify-center lg:px-2" : "justify-between"}`}>
          <Link
            href="/discover"
            title="Shangazi SEC Portal"
            onClick={() => setIsMobileOpen(false)}
            className="flex min-w-0 items-center gap-3 rounded-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#1d5c19]"
          >
            <Image
              src={isCollapsed ? "/logo/Shangazi Logo Variations-2.png" : "/logo/Shangazi Logo Variations-1.png"}
              alt="Shangazi"
              width={isCollapsed ? 38 : 136}
              height={42}
              priority
              unoptimized
              className={`h-9 object-contain object-left ${isCollapsed ? "w-9" : "w-[136px]"}`}
            />
          </Link>
          <button
            type="button"
            onClick={() => setIsMobileOpen(false)}
            aria-label="Close sidebar"
            className="ml-auto rounded-lg p-2 text-[#526252] hover:bg-[#f3f6f1] lg:hidden"
          >
            <X size={20} />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-3 py-6" data-lenis-prevent>
          <nav aria-label="Main navigation" className="space-y-1">
            <p className={`mb-3 px-3 font-[Manrope] text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a094] ${isCollapsed ? "lg:sr-only" : ""}`}>
              Explore
            </p>
            {primaryLinks.map(renderLink)}
          </nav>

          <div className="my-6 border-t border-[#eef0eb]" />

          <nav aria-label="Account navigation" className="space-y-1">
            <p className={`mb-3 px-3 font-[Manrope] text-[10px] font-bold uppercase tracking-[0.16em] text-[#94a094] ${isCollapsed ? "lg:sr-only" : ""}`}>
              Your space
            </p>
            {accountLinks.map(renderLink)}
          </nav>
        </div>

        <div className="shrink-0 border-t border-[#eef0eb] p-3">
          <Link
            href="/profile"
            onClick={() => setIsMobileOpen(false)}
            title={isCollapsed ? displayName : undefined}
            className={`flex items-center gap-3 rounded-lg px-2 py-2.5 transition-colors hover:bg-[#f5f7f3] ${isCollapsed ? "lg:justify-center" : ""}`}
          >
            <span className="flex h-9 w-9 shrink-0 items-center justify-center overflow-hidden rounded-full bg-[#eaf2e8] font-[Manrope] text-sm font-semibold text-[#1d5c19]">
              {session?.user?.image ? (
                <Image src={session.user.image} alt="" width={36} height={36} unoptimized className="h-full w-full object-cover" />
              ) : initial}
            </span>
            <span className={`min-w-0 flex-1 ${isCollapsed ? "lg:sr-only" : ""}`}>
              <span className="block truncate font-[Manrope] text-[13px] font-semibold text-[#233528]">{displayName}</span>
              <span className="block truncate font-[Manrope] text-[11px] text-[#879187]">{email}</span>
            </span>
            {!isCollapsed && <ChevronRight size={15} className="shrink-0 text-[#9da79e]" aria-hidden="true" />}
          </Link>
          <button
            type="button"
            onClick={handleLogout}
            title={isCollapsed ? "Sign out" : undefined}
            className={`mt-1 flex h-10 w-full items-center gap-3 rounded-lg px-3 font-[Manrope] text-[13px] font-medium text-[#7b5555] transition-colors hover:bg-[#fff2f2] hover:text-[#a52a2a] focus-visible:outline-2 focus-visible:outline-[#a52a2a] ${isCollapsed ? "lg:justify-center lg:px-0" : ""}`}
          >
            <LogOut size={18} strokeWidth={1.8} aria-hidden="true" />
            <span className={isCollapsed ? "lg:sr-only" : ""}>Sign out</span>
          </button>
        </div>
      </aside>
    </>
  );
}
