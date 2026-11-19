// app/components/newsletter/NewsletterSegments.tsx
"use client";
import { useState, type FormEvent } from "react";
import Link from "next/link";
import { Plus, Layers3, RefreshCw } from "lucide-react";
import { useNewsletterAdmin, NewsletterNotice, fieldClass, buttonClass, primaryClass } from "./useNewsletterAdmin";

export default function NewsletterSegments() {
  const { data, loading, busy, error, message, act, reload } = useNewsletterAdmin();
  const [name, setName] = useState("");
  async function create(e: FormEvent) { e.preventDefault(); if (await act({ action: "create-segment", name })) setName(""); }
  return <div className="space-y-6">
    <header className="flex items-center justify-between gap-3"><div><h2 className="font-[Fraunces] text-3xl">Audience groups</h2><p className="mt-2 text-sm text-gray-500">Resend segments let you target separate newsletters or interest groups.</p></div><button className={buttonClass} onClick={() => void reload()} disabled={loading}><RefreshCw size={15}/> Refresh</button></header>
    <NewsletterNotice error={error} message={message}/>
    <form className="flex flex-wrap gap-2 rounded-2xl border border-gray-200 p-5" onSubmit={(e) => void create(e)}>
      <input required minLength={3} maxLength={100} className={fieldClass + " max-w-[370px]"} placeholder="New group name" value={name} onChange={(e) => setName(e.target.value)} />
      <button disabled={busy} className={primaryClass}><Plus size={16}/> Create group</button>
    </form>
    <div className="space-y-3">{(data?.segments || []).map((g) => {
      const main = g.id === data?.segmentId;
      return <div key={g.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-gray-200 p-5">
        <div className="flex items-center gap-3"><div className="rounded-xl bg-gray-100 p-3"><Layers3 size={20}/></div><div><p className="font-semibold">{g.name}</p><p className="mt-1 text-xs text-gray-500">{main ? "Default newsletter · protected" : "Custom group"} · {g.id}</p></div></div>
        <div className="flex gap-2">
          <Link className={buttonClass} href={`/admin/newsletter/compose?segmentId=${g.id}`}>Compose to group</Link>
          <button className={buttonClass} disabled={busy} onClick={() => { const value=window.prompt("Rename this segment",g.name); if(value && value.trim()!==g.name) void act({action:"rename-segment", segmentId:g.id, name:value.trim()}); }}>Rename</button>
          {!main && <button className={buttonClass+" !text-red-700"} disabled={busy} onClick={() => { if(window.confirm(`Delete the Resend segment "${g.name}"? This may affect saved campaigns.`)) void act({action:"delete-segment",segmentId:g.id,confirmation:"DELETE SEGMENT"}); }}>Delete</button>}
        </div>
      </div>;
    })}</div>
    {!loading && !data?.segments.length && <p className="text-sm text-gray-500">No groups found.</p>}
  </div>;
}
