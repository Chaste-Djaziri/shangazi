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
            className="!size-[52px] !rounded-2xl !p-0 !justify-center !bg-transparent !text-[#858b83] hover:!bg-transparent hover:!text-[#1d5c19] data-active:!bg-transparent data-active:!text-[#1d5c19] focus-visible:!ring-[#1d5c19]"
          >
            <Icon className="!size-[26px]" strokeWidth={active ? 2.3 : 1.85} aria-hidden="true" />
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
      className="!border-0 !bg-transparent [&_[data-slot=sidebar-inner]]:!bg-transparent [&_[data-slot=sidebar-container]]:!border-0"
    >
      <SidebarHeader className="items-center px-0 pb-3 pt-4">
        <Link
          href="/discover"
          aria-label="Shangazi portal home"
          title="Shangazi portal home"
          onClick={() => setOpenMobile(false)}
          className="flex size-[52px] items-center justify-center rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#1d5c19]"
        >
          <Image
            src="/logo/Shangazi Logo Variations-2.png"
            width={42}
            height={42}
            priority
            unoptimized
            alt="Shangazi"
            className="size-[42px] object-contain"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-0" data-lenis-prevent>
        <nav aria-label="Main navigation">
          <SidebarMenu className="items-center gap-1">
            {renderLinks(mainLinks)}
          </SidebarMenu>
        </nav>
        <div className="my-3" aria-hidden="true" />
        <nav aria-label="Account navigation">
          <SidebarMenu className="items-center gap-1">
            {renderLinks(accountLinks)}
          </SidebarMenu>
        </nav>
      </SidebarContent>

      <SidebarFooter className="items-center gap-1 px-0 pb-4">
        <SidebarMenu className="items-center gap-1">
          <SidebarMenuItem className="flex justify-center">
            <SidebarMenuButton
              render={<Link href="/profile" aria-label={displayName} onClick={() => setOpenMobile(false)} />}
              tooltip={displayName}
              title={displayName}
              className="!size-[52px] !rounded-2xl !p-0 !justify-center !bg-transparent hover:!bg-transparent"
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
              className="!size-[52px] !rounded-2xl !p-0 !justify-center !bg-transparent !text-[#858b83] hover:!bg-transparent hover:!text-[#a52a2a]"
            >
              <LogOut className="!size-[26px]" strokeWidth={1.85} aria-hidden="true" />
              <span className="sr-only">Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
