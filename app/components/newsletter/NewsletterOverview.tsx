// app/components/newsletter/NewsletterOverview.tsx
"use client";
import Link from "next/link";
import { ArrowUpRight, UsersRound, Layers3, Send, PenLine, RefreshCw } from "lucide-react";
import { useNewsletterAdmin, NewsletterNotice, buttonClass, type Broadcast } from "./useNewsletterAdmin";

const cards = [
  { href: "/admin/newsletter/audience", name: "Subscribers", icon: UsersRound, detail: "Search and manage email contacts" },
  { href: "/admin/newsletter/segments", name: "Audience groups", icon: Layers3, detail: "Organize contacts into Resend segments" },
  { href: "/admin/newsletter/broadcasts", name: "Broadcasts", icon: Send, detail: "Review draft and sent campaigns" },
  { href: "/admin/newsletter/compose", name: "Compose an email", icon: PenLine, detail: "Rich text, templates, and live preview" },
];

export default function NewsletterOverview() {
  const { data, error, loading, reload } = useNewsletterAdmin();
  const active = (data?.contacts || []).filter((c) => !c.unsubscribed).length;
  return <div className="space-y-8">
    <header className="flex flex-wrap items-center justify-between gap-3">
      <div><h2 className="font-[Fraunces] text-[30px]">Overview</h2><p className="mt-1 text-sm text-gray-500">Your newsletter at a glance.</p></div>
      <button className={buttonClass} onClick={() => void reload()} disabled={loading}><RefreshCw size={15} /> Refresh</button>
    </header>
    <NewsletterNotice error={error}/>
    <div className="grid gap-4 sm:grid-cols-3">
      {[
        { n: loading ? "…" : String(active), l: "Subscribed contacts" },
        { n: loading ? "…" : String(data?.segments.length ?? 0), l: "Audience groups" },
        { n: loading ? "…" : String(data?.broadcasts.length ?? 0), l: "Broadcasts" },
      ].map((item) => <div key={item.l} className="rounded-2xl border border-gray-200 p-6"><p className="text-3xl font-semibold tracking-tight">{item.n}</p><p className="mt-2 text-sm text-gray-500">{item.l}</p></div>)}
    </div>
    <div className="grid gap-4 md:grid-cols-2">{cards.map(({ href, name, icon: Icon, detail }) =>
      <Link key={href} href={href} className="group rounded-2xl border border-gray-200 p-6 transition hover:border-[#d9a4b7] hover:bg-[#fffafb]">
        <div className="flex items-center justify-between"><Icon size={22} className="text-[#a63562]"/><ArrowUpRight size={18} className="text-gray-400 group-hover:text-[#a63562]"/></div>
        <h3 className="mt-5 text-base font-semibold">{name}</h3><p className="mt-1 text-sm text-gray-500">{detail}</p>
      </Link>
    )}</div>
    <section className="rounded-2xl border border-gray-200 p-6">
      <div className="mb-4 flex items-center justify-between"><h3 className="text-lg font-semibold">Recent broadcasts</h3><Link href="/admin/newsletter/broadcasts" className="text-sm font-semibold text-[#a63562]">View all</Link></div>
      {(data?.broadcasts || []).slice(0,5).map((b: Broadcast) => <Link key={b.id} href={`/admin/newsletter/broadcasts/${b.id}`} className="flex items-center justify-between gap-3 border-t border-gray-100 py-4 hover:text-[#a63562]"><div className="min-w-0"><p className="truncate text-sm font-medium">{b.subject || b.name || "Untitled"}</p><p className="mt-1 text-xs text-gray-500">{b.status || "Unknown"} · {b.created_at ? new Date(b.created_at).toLocaleDateString() : ""}</p></div><ArrowUpRight size={16}/></Link>)}
      {!loading && !data?.broadcasts.length && <p className="text-sm text-gray-500">No broadcasts yet. Start in Compose.</p>}
    </section>
  </div>;
}
