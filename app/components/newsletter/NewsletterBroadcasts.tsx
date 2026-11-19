// app/components/newsletter/NewsletterBroadcasts.tsx
"use client";
import { useMemo, useState } from "react";
import Link from "next/link";
import { ArrowUpRight, PenLine, RefreshCw } from "lucide-react";
import { useNewsletterAdmin, NewsletterNotice, fieldClass, buttonClass, primaryClass } from "./useNewsletterAdmin";
export default function NewsletterBroadcasts() {
  const { data, loading, error, reload } = useNewsletterAdmin();
  const [status, setStatus] = useState("all");
  const [term, setTerm] = useState("");
  const [group, setGroup] = useState("all");
  const broadcasts = useMemo(() => (data?.broadcasts || []).filter((b) =>
    (status === "all" || b.status === status) && (group === "all" || b.segment_id === group)
    && [b.name,b.subject].join(" ").toLowerCase().includes(term.toLowerCase())
  ), [data, status, term, group]);
  return <div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><h2 className="font-[Fraunces] text-3xl">Broadcasts</h2><p className="mt-2 text-sm text-gray-500">Open any email to inspect content, delivery status and recipients.</p></div><Link href="/admin/newsletter/compose" className={primaryClass}><PenLine size={16}/> New broadcast</Link></header>
    <NewsletterNotice error={error}/>
    <div className="grid gap-3 rounded-2xl border border-gray-200 p-4 sm:grid-cols-3">
      <input className={fieldClass} aria-label="Search broadcasts" placeholder="Search broadcasts…" value={term} onChange={(e) => setTerm(e.target.value)} />
      <select className={fieldClass} aria-label="Filter by status" value={status} onChange={(e) => setStatus(e.target.value)}><option value="all">All statuses</option><option value="draft">Drafts</option><option value="sent">Sent</option><option value="scheduled">Scheduled</option><option value="queued">Queued</option></select>
      <select className={fieldClass} aria-label="Filter by group" value={group} onChange={(e) => setGroup(e.target.value)}><option value="all">All groups</option>{(data?.segments || []).map((g)=><option key={g.id} value={g.id}>{g.name}</option>)}</select>
    </div>
    <section className="overflow-hidden rounded-2xl border border-gray-200">
      <div className="flex items-center justify-between border-b border-gray-100 p-5"><h3 className="font-semibold">{loading ? "Loading…" : `${broadcasts.length} broadcasts`}</h3><button type="button" disabled={loading} className={buttonClass} onClick={() => void reload()}><RefreshCw size={15}/> Refresh</button></div>
      {broadcasts.map((b) => <Link href={`/admin/newsletter/broadcasts/${b.id}`} key={b.id} className="group flex items-center justify-between gap-4 border-b border-gray-100 p-5 last:border-b-0 hover:bg-[#fff8fa]">
        <div className="min-w-0"><p className="truncate font-semibold text-[#242424]">{b.subject || b.name || "Untitled broadcast"}</p><p className="mt-1 text-xs text-gray-500">{data?.segments.find((g) => g.id === b.segment_id)?.name || "Audience"} · {b.created_at ? new Date(b.created_at).toLocaleString() : ""}</p></div>
        <div className="flex items-center gap-3"><span className="rounded-full bg-gray-100 px-3 py-1 text-[11px] font-semibold capitalize text-gray-700">{b.status || "Unknown"}</span><ArrowUpRight size={17} className="text-gray-400 group-hover:text-[#a63562]"/></div>
      </Link>)}
      {!loading && !broadcasts.length && <div className="p-12 text-center text-sm text-gray-500">No matching broadcasts. Create one in Compose.</div>}
    </section>
    <p className="text-xs text-gray-500">Broadcasts created in the Resend visual editor can be viewed here; only API-created drafts should be edited through this interface.</p>
  </div>;
}
