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
  Mail,
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
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

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

function RailTooltip({ label }: { label: string }) {
  return (
    <TooltipContent
      side="right"
      align="center"
      sideOffset={14}
      className="!z-[100] !max-w-none !whitespace-nowrap !rounded-xl !bg-[#202420] !px-3.5 !py-2.5 !font-[Manrope] !text-[13px] !font-semibold !leading-none !text-white shadow-[0_8px_26px_rgba(0,0,0,0.17)]"
    >
      {label}
    </TooltipContent>
  );
}

export default function MainSidebar({ newsletterAdmin = false }: { newsletterAdmin?: boolean }) {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { setOpenMobile } = useSidebar();

  useEffect(() => setOpenMobile(false), [pathname, setOpenMobile]);

  const signOut = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  // Use real links for the icon rail: shadcn SidebarMenuButton enforces a
  // 32px collapsed size, which previously shrank the active background.
  const renderLinks = (links: ReadonlyArray<{ href: string; label: string; icon: typeof Compass }>) =>
    links.map(({ href, label, icon: Icon }) => {
      const active = pathname === href || pathname.startsWith(`${href}/`);
      return (
        <SidebarMenuItem key={href} className="flex justify-center">
          <Tooltip>
            <TooltipTrigger render={
              <Link
                href={href}
                aria-label={label}
                aria-current={active ? "page" : undefined}
                onClick={() => setOpenMobile(false)}
                className={`flex h-[60px] w-[60px] shrink-0 items-center justify-center rounded-[18px] border transition-colors duration-150 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e71d5b] ${
                  active
                    ? "border-[#dedede] bg-[#ebebeb] text-[#222222]"
                    : "border-transparent bg-transparent text-[#858585] hover:text-[#222222]"
                }`}
              />
            }>
              <Icon className="size-[32px] shrink-0" strokeWidth={active ? 2.2 : 1.9} aria-hidden="true" />
            </TooltipTrigger>
            <RailTooltip label={label} />
          </Tooltip>
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
        <Tooltip>
          <TooltipTrigger render={<Link
          href="/discover"
          aria-label="Shangazi portal home"
          onClick={() => setOpenMobile(false)}
          className="flex size-[56px] items-center justify-center rounded-[18px] bg-transparent focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#e71d5b]"
        />}>
          <Image
            src="/logo/Shangazi Logo Variations-2.png"
            width={42}
            height={42}
            priority
            unoptimized
            alt="Shangazi"
            className="size-[40px] object-contain"
          />
          </TooltipTrigger>
          <RailTooltip label="Shangazi home" />
        </Tooltip>
      </SidebarHeader>

      <SidebarContent className="gap-0 px-0" data-lenis-prevent>
        <div className="mx-auto mb-5 h-px w-9 bg-[#e9e9e9]" aria-hidden="true" />
        <nav aria-label="Main navigation">
          <SidebarMenu className="items-center gap-3">
            {renderLinks(mainLinks)}
          </SidebarMenu>
        </nav>
        <div className="mx-auto my-5 h-px w-9 bg-[#e9e9e9]" aria-hidden="true" />
        <nav aria-label="Account navigation">
          <SidebarMenu className="items-center gap-2">
            {renderLinks(accountLinks)}
            {newsletterAdmin && renderLinks([{ href: "/admin/newsletter", label: "Newsletter Studio", icon: Mail }])}
          </SidebarMenu>
        </nav>
      </SidebarContent>

      <SidebarFooter className="items-center gap-2 px-0 pb-4">
        <SidebarMenu className="items-center gap-2">
          <SidebarMenuItem className="flex justify-center">
            <Tooltip>
              <TooltipTrigger render={
                <Link href="/profile" aria-label={displayName} onClick={() => setOpenMobile(false)} className="flex size-[60px] items-center justify-center rounded-[18px] focus-visible:outline-2 focus-visible:outline-[#e71d5b]" />
              }>
                <span className="flex size-10 shrink-0 items-center justify-center overflow-hidden rounded-full text-[#252525]">
                  {session?.user?.image ? (
                    <Image src={session.user.image} alt="" width={40} height={40} unoptimized className="size-full object-cover" />
                  ) : <span className="text-lg font-semibold">{initial}</span>}
                </span>
              </TooltipTrigger>
              <RailTooltip label={displayName} />
            </Tooltip>
          </SidebarMenuItem>
          <SidebarMenuItem className="flex justify-center">
            <Tooltip>
              <TooltipTrigger render={
                <button type="button" onClick={signOut} aria-label="Sign out" className="flex size-[60px] items-center justify-center rounded-[18px] text-[#858585] hover:text-[#a52a2a] focus-visible:outline-2 focus-visible:outline-[#e71d5b]" />
              }>
                <LogOut size={32} strokeWidth={1.9} aria-hidden="true" />
              </TooltipTrigger>
              <RailTooltip label="Sign out" />
            </Tooltip>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
