// app/components/newsletter/NewsletterAudience.tsx
"use client";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import { RefreshCw, Search, UserPlus } from "lucide-react";
import { useNewsletterAdmin, NewsletterNotice, fieldClass, buttonClass, primaryClass, type Contact } from "./useNewsletterAdmin";

export default function NewsletterAudience() {
  const { data, busy, loading, error, message, act, reload } = useNewsletterAdmin();
  const [search, setSearch] = useState("");
  const [email, setEmail] = useState("");
  const [segment, setSegment] = useState("");
  const groups = data?.segments || [];
  const chosen = segment || data?.segmentId || "";
  const [subFilter, setSubFilter] = useState("all");
  const [groupContacts, setGroupContacts] = useState<Contact[] | null>(null);
  const [groupLoading, setGroupLoading] = useState(false);
  const [refreshGroup, setRefreshGroup] = useState(0);
  const [groupError, setGroupError] = useState("");
  useEffect(() => {
    if (!chosen || chosen === data?.segmentId) { setGroupContacts(null); setGroupError(""); return; }
    const abort = new AbortController();
    setGroupLoading(true); setGroupError("");
    fetch(`/api/admin/newsletter?view=contacts&segmentId=${encodeURIComponent(chosen)}`, { signal: abort.signal, cache: "no-store" })
      .then(async (response) => { const result = await response.json(); if (!response.ok) throw new Error(result.error || "Cannot load group contacts"); return result.contacts as Contact[]; })
      .then((contacts) => setGroupContacts(contacts))
      .catch((err) => { if (!abort.signal.aborted) setGroupError(err instanceof Error ? err.message : "Could not load group"); })
      .finally(() => { if (!abort.signal.aborted) setGroupLoading(false); });
    return () => abort.abort();
  }, [chosen, data?.segmentId, refreshGroup]);
  const rows = useMemo(() => (data?.contacts || []).filter((c) => {
    if (chosen !== data?.segmentId) return false;
    if (subFilter === "active" && c.unsubscribed) return false;
    if (subFilter === "unsubscribed" && !c.unsubscribed) return false;
    return [c.email, c.first_name, c.last_name].join(" ").toLowerCase().includes(search.toLowerCase());
  }), [data, groupContacts, search, chosen, subFilter]);
  async function add(e: FormEvent) {
    e.preventDefault();
    const saved = await act({ action: "add-contact", email, segmentId: chosen });
    if (saved) { setEmail(""); setRefreshGroup((n) => n+1); }
  }
  return <div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-3"><div><h2 className="font-[Fraunces] text-3xl">Audience</h2><p className="mt-2 text-sm text-gray-500">View contacts by segment and manage membership.</p></div><button className={buttonClass} disabled={loading} onClick={() => void reload()}><RefreshCw size={15}/> Refresh</button></header>
    <NewsletterNotice error={error || groupError} message={message}/>
    <div className="grid gap-4 rounded-2xl border border-gray-200 p-5 sm:grid-cols-2">
      <label className="text-sm font-medium">Audience group<select className={fieldClass + " mt-2"} value={chosen} onChange={(e) => setSegment(e.target.value)}>{groups.map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select></label>
      <label className="text-sm font-medium">Subscription status<select className={fieldClass + " mt-2"} value={subFilter} onChange={(e) => setSubFilter(e.target.value)}><option value="all">All contacts</option><option value="active">Subscribed</option><option value="unsubscribed">Unsubscribed</option></select></label>
    </div>
    {groupLoading && <p className="text-sm text-gray-500">Loading group members…</p>}
    <div className="rounded-2xl border border-gray-200 p-5 sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-4"><h3 className="font-semibold">Contacts ({rows.length})</h3><div className="flex items-center gap-2"><Search size={16} className="text-gray-400"/><input className={fieldClass} placeholder="Search email or name" value={search} onChange={(e) => setSearch(e.target.value)} /></div></div>
      <form onSubmit={(e) => void add(e)} className="my-5 flex flex-wrap gap-2"><input type="email" required className={fieldClass + " max-w-[320px]"} placeholder="Existing contact email" value={email} onChange={(e) => setEmail(e.target.value)} /><button disabled={busy || !chosen} className={primaryClass}><UserPlus size={16}/> Add existing contact</button></form>
      <div className="overflow-x-auto"><table className="w-full min-w-[560px] text-left text-sm"><thead><tr className="border-b border-gray-100 text-xs uppercase tracking-wide text-gray-500"><th className="py-3">Email</th><th>Name</th><th>Status</th><th>Added</th><th>Action</th></tr></thead><tbody>{rows.map((c) => <tr key={c.id} className="border-b border-gray-100"><td className="py-3 font-medium">{c.email}</td><td>{[c.first_name,c.last_name].filter(Boolean).join(" ") || "—"}</td><td>{c.unsubscribed ? "Unsubscribed" : "Subscribed"}</td><td>{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td><td><button type="button" disabled={busy} className="text-xs font-medium text-red-700 hover:underline" onClick={() => { if (window.confirm(`Remove ${c.email} from this group?`)) void act({ action: "remove-contact", segmentId: chosen, email: c.email }).then((result) => { if (result) setRefreshGroup((n) => n+1); }); }}>Remove</button></td></tr>)}</tbody></table>{!loading && !rows.length && <p className="py-10 text-center text-sm text-gray-500">No matching contacts.</p>}</div>
    </div>
  </div>;
}
