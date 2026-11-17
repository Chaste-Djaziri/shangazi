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
    <SidebarMenu >
      {items.map(({ href, label, icon: Icon }) => {
        const isActive = pathname === href || pathname.startsWith(`${href}/`);

        return (
          <SidebarMenuItem key={href}>
            <SidebarMenuButton
              render={<Link href={href} onClick={() => setOpenMobile(false)} aria-current={isActive ? "page" : undefined} />}
              isActive={isActive}
              tooltip={label}
            >
              <Icon />
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
    <Sidebar collapsible="icon">
      <SidebarHeader >
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

      <SidebarContent data-lenis-prevent>
        <SidebarGroup>
          <SidebarGroupLabel >
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

      <SidebarFooter >
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              render={<Link href="/profile" onClick={() => setOpenMobile(false)} />}
              tooltip={name}
              size="lg"
            >
              <span className="flex size-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-sidebar-accent text-sm font-semibold">
                {session?.user?.image ? (
                  <Image src={session.user.image} alt="" width={32} height={32} unoptimized className="size-full object-cover" />
                ) : initial}
              </span>
              <span className="min-w-0 flex-1">
                <span className="block truncate text-sm font-medium">{name}</span>
                <span className="block truncate text-xs text-muted-foreground">{email}</span>
              </span>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={signOut}
              tooltip="Sign out"
            >
              <LogOut />
              <span>Sign out</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
