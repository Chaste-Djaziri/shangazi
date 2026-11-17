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
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

const explore = [
  { href: "/discover", label: "Discover", icon: Compass },
  { href: "/articles", label: "Articles", icon: BookOpenText },
  { href: "/exclusive-courses", label: "Courses", icon: GraduationCap },
  { href: "/exclusive-videos", label: "Videos", icon: PlaySquare },
  { href: "/booking", label: "Book guidance", icon: CalendarDays },
] as const;

const account = [
  { href: "/profile", label: "My profile", icon: UserRound },
  { href: "/settings", label: "Settings", icon: Settings2 },
] as const;

export default function MainSidebar() {
  const pathname = usePathname();
  const { data: session } = authClient.useSession();
  const { setOpenMobile } = useSidebar();

  useEffect(() => {
    setOpenMobile(false);
  }, [pathname, setOpenMobile]);

  const signOut = async () => {
    await authClient.signOut();
    window.location.href = "/login";
  };

  const menu = (items: typeof explore | typeof account) => (
    <SidebarMenu className="gap-1">
      {items.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton
              render={<Link href={href} onClick={() => setOpenMobile(false)} aria-current={isActive ? "page" : undefined} />}
              isActive={isActive}
              tooltip={label}
              className="!h-10 rounded-md px-3 font-[Manrope] !text-[13px] font-medium text-[#667269] hover:text-[#1d5c19] data-active:font-semibold data-active:!text-[#1d5c19] group-data-[collapsible=icon]:!size-10"
            >
              <Icon className="!size-[18px]" strokeWidth={isActive ? 2 : 1.8} />
              <span>{label}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        );
      })}
    </SidebarMenu>
  );

  const name = session?.user?.name?.trim() || "Your account";
  const email = session?.user?.email || "SEC Portal";
  const initial = (session?.user?.name?.[0] || session?.user?.email?.[0] || "S").toUpperCase();

  return (
    <Sidebar
      collapsible="icon"
      variant="sidebar"
      className="text-sidebar-foreground"
    >
      <SidebarHeader className="h-20 justify-center px-5 group-data-[collapsible=icon]:px-2">
        <Link href="/discover" onClick={() => setOpenMobile(false)} aria-label="Shangazi portal home" className="flex items-center outline-offset-4">
          <Image
            src="/logo/Shangazi Logo Variations-1.png"
            alt="Shangazi"
            width={136}
            height={42}
            priority
            unoptimized
            className="h-9 w-auto max-w-[136px] object-contain group-data-[collapsible=icon]:hidden"
          />
          <Image
            src="/logo/Shangazi Logo Variations-2.png"
            alt=""
            width={36}
            height={36}
            priority
            unoptimized
            className="hidden size-9 object-contain group-data-[collapsible=icon]:block"
          />
        </Link>
      </SidebarHeader>

      <SidebarContent className="gap-4 px-2 pt-4" data-lenis-prevent>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-[Manrope] text-[10px] uppercase tracking-[0.14em] text-[#9aa29b]">
            Explore
          </SidebarGroupLabel>
          <SidebarGroupContent>{menu(explore)}</SidebarGroupContent>
        </SidebarGroup>
        <SidebarGroup>
          <SidebarGroupLabel className="px-3 font-[Manrope] text-[10px] uppercase tracking-[0.14em] text-[#9aa29b]">
            Your space
          </SidebarGroupLabel>
          <SidebarGroupContent>{menu(account)}</SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="gap-1 p-3">
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/profile" onClick={() => setOpenMobile(false)} />}
              tooltip={name}
              size="lg"
              className="!h-12 rounded-md px-2 group-data-[collapsible=icon]:!size-10"
            >
              <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full font-[Manrope] text-sm font-semibold text-[#1d5c19]">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="" width={32} height={32} unoptimized className="size-full object-cover" />
                ) : initial}
              </span>
              <span className="min-w-0 flex-1 font-[Manrope]">
                <span className="block truncate text-[12px] font-semibold text-[#29352c]">{name}</span>
                <span className="block truncate text-[11px] text-[#89918a]">{email}</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              tooltip="Sign out"
              className="!h-10 rounded-md px-3 font-[Manrope] !text-[13px] text-[#8f6565] hover:!text-[#a52a2a] group-data-[collapsible=icon]:!size-10"
            >
              <LogOut className="!size-[18px]" />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
