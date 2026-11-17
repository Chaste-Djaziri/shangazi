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
  Compass,
  GraduationCap,
  LogOut,
  PlaySquare,
  Settings2,
  UserRound,
} from "lucide-react";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const mainLinks = [
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
  const { setOpenMobile } = useSidebar();

  useEffect(() => setOpenMobile(false), [pathname, setOpenMobile]);

  const signOut = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  const renderLinks = (links: typeof mainLinks | typeof accountLinks) =>
    links.map(({ href, label, icon: Icon }) => {
      const active = pathname === href || pathname.startsWith(`${href}/`);
      return (
        <SidebarMenuItem key={href} className="flex justify-center">
          <SidebarMenuButton
            render={<Link href={href} aria-label={label} aria-current={active ? "page" : undefined} onClick={() => setOpenMobile(false)} />}
            isActive={active}
            tooltip={label}
            title={label}
            className={`!size-[56px] !rounded-[18px] !justify-center !p-0 !border !transition-colors focus-visible:!ring-[#e71d5b] ${active ? "!border-[#e3e3e3] !bg-[#f0f0f0] !text-[#222222] hover:!bg-[#ebebeb]" : "!border-transparent !bg-transparent !text-[#858585] hover:!bg-[#f4f4f4] hover:!text-[#222222]"}`}
          >
            <Icon className="!size-[30px]" strokeWidth={active ? 2.3 : 1.85} aria-hidden="true" />
            <span className="sr-only">{label}</span>
          </SidebarMenuButton>
        </SidebarMenuItem>
      );
    });

  const displayName = session?.user?.name?.trim() || "My profile";
  const initial = (session?.user?.name?.[0] || session?.user?.email?.[0] || "S").toUpperCase();

  return (
    <Sidebar
      collapsible="icon"
      aria-label="Portal navigation"
      className="!border-0 [&_[data-slot=sidebar-inner]]:!bg-[#fafafa] [&_[data-slot=sidebar-container]]:!border-0"
    >
      <SidebarHeader className="items-center px-0 pb-4 pt-5">
        <Link
          href="/discover"
          aria-label="Shangazi portal home"
          title="Shangazi portal home"
          onClick={() => setOpenMobile(false)}
          className="flex size-[56px] items-center justify-center rounded-[18px] bg-[#f0f0f0] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e71d5b]"
        >
          <Image
            src="/logo/Shangazi Logo Variations-2.png"
            width={42}
            height={42}
            priority
            unoptimized
            alt="Shangazi"
            className="size-[40px] object-contain"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-0" data-lenis-prevent>
        <div className="mx-auto mb-5 h-px w-9 bg-[#e9e9e9]" aria-hidden="true" />
        <nav aria-label="Main navigation">
          <SidebarMenu className="items-center gap-2">
            {renderLinks(mainLinks)}
          </SidebarMenu>
        </nav>
        <div className="mx-auto my-5 h-px w-9 bg-[#e9e9e9]" aria-hidden="true" />
        <nav aria-label="Account navigation">
          <SidebarMenu className="items-center gap-2">
            {renderLinks(accountLinks)}
          </SidebarMenu>
        </nav>
      </SidebarContent>

      <SidebarFooter className="items-center gap-2 border-t-0 px-0 pb-4">
        <SidebarMenu className="items-center gap-1">
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton
              render={<Link href="/profile" aria-label={displayName} onClick={() => setOpenMobile(false)} />}
              tooltip={displayName}
              title={displayName}
              className="!size-[56px] !rounded-[18px] !p-0 !justify-center !bg-transparent hover:!bg-[#f4f4f4]"
            >
              <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-[#1d5c19]">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="" width={40} height={40} unoptimized className="size-full object-cover" />
                ) : <span className="text-lg font-semibold">{initial}</span>}
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton
              onClick={signOut}
              aria-label="Sign out"
              tooltip="Sign out"
              title="Sign out"
              className="!size-[56px] !rounded-[18px] !p-0 !justify-center !bg-transparent !text-[#85877c] hover:!bg-white hover:!text-[#a52a2a]"
            >
              <LogOut className="!size-[30px]" strokeWidth={1.85} aria-hidden="true" />
              <span className="sr-only">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
