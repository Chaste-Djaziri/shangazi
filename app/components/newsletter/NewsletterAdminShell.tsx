// app/components/newsletter/NewsletterAdminShell.tsx
"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, UsersRound, Layers3, Send, PenLine, ExternalLink } from "lucide-react";

const links = [
  { href: "/admin/newsletter", label: "Overview", icon: LayoutDashboard },
  { href: "/admin/newsletter/audience", label: "Audience", icon: UsersRound },
  { href: "/admin/newsletter/segments", label: "Segments", icon: Layers3 },
  { href: "/admin/newsletter/broadcasts", label: "Broadcasts", icon: Send },
  { href: "/admin/newsletter/compose", label: "Compose", icon: PenLine },
];

export default function NewsletterAdminShell({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  return (
    <div className="mx-auto max-w-[1500px] pb-20 font-[Manrope]">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4 border-b border-gray-100 pb-6">
        <div>
          <p className="text-[11px] font-bold uppercase tracking-[0.17em] text-[#a66a80]">Shangazi / Administration</p>
          <h1 className="mt-2 font-[Fraunces] text-3xl font-normal text-[#242424]">Newsletter Studio</h1>
          <p className="mt-2 text-sm text-gray-500">Create and manage email campaigns with Resend.</p>
        </div>
        <a href="https://resend.com/broadcasts" target="_blank" rel="noreferrer" className="inline-flex items-center gap-2 text-xs font-semibold text-[#777] hover:text-[#222]">Resend dashboard <ExternalLink size={14} /></a>
      </div>
      <div className="grid min-w-0 gap-7 lg:grid-cols-[205px_minmax(0,1fr)] xl:gap-10">
        <nav aria-label="Newsletter administration" className="flex gap-1 overflow-x-auto border-b border-gray-100 pb-3 lg:sticky lg:top-24 lg:self-start lg:flex-col lg:overflow-visible lg:border-0 lg:pb-0">
          {links.map(({ href, label, icon: Icon }) => {
            const selected = pathname === href || (href === "/admin/newsletter/broadcasts" && pathname.startsWith(href + "/"));
            return <Link key={href} href={href} aria-current={selected ? "page" : undefined}
              className={`inline-flex shrink-0 items-center gap-3 rounded-xl px-4 py-3 text-sm font-medium transition-colors ${selected ? "bg-[#f8e9ee] text-[#9b214b]" : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"}`}>
              <Icon size={18}/>{label}
            </Link>;
          })}
        </nav>
        <div className="min-w-0">{children}</div>
      </div>
    </div>
  );
}
