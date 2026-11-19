// app/components/newsletter/NewsletterAdmin.tsx
"use client";

import { useCallback, useEffect, useMemo, useState, type FormEvent } from "react";
import { Mail, Send, Users, RefreshCw, FilePlus2, AlertTriangle } from "lucide-react";

type Contact = { id: string; email: string; first_name?: string; last_name?: string; created_at?: string; unsubscribed?: boolean };
type Segment = { id: string; name: string };
type Broadcast = { id: string; name?: string; subject?: string; status?: string; created_at?: string; segment_id?: string };

type Data = { segmentId: string; segments: Segment[]; contacts: Contact[]; broadcasts: Broadcast[] };

const fieldClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm outline-none focus:border-[#be1d51] focus:ring-1 focus:ring-[#be1d51]";
const controlClass = "inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-800 transition hover:bg-gray-50 disabled:opacity-50";

export default function NewsletterAdmin() {
  const [data, setData] = useState<Data | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [search, setSearch] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [newSegmentName, setNewSegmentName] = useState("");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [confirmId, setConfirmId] = useState<string | null>(null);
  const [confirmText, setConfirmText] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const response = await fetch("/api/admin/newsletter", { cache: "no-store" });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Could not load newsletter data.");
      setData(result as Data);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Could not load newsletter data.");
    } finally { setLoading(false); }
  }, []);

  useEffect(() => { void load(); }, [load]);

  const subscribers = useMemo(() => (data?.contacts || []).filter((c) =>
    [c.email, c.first_name, c.last_name].join(" ").toLowerCase().includes(search.toLowerCase())
  ), [data, search]);

  const action = async (payload: Record<string, string>) => {
    setBusy(true);
    setError("");
    setMessage("");
    try {
      const response = await fetch("/api/admin/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Operation failed.");
      setMessage(result.message || "Saved.");
      setConfirmId(null);
      setConfirmText("");
      await load();
    } catch (e) { setError(e instanceof Error ? e.message : "Operation failed."); }
    finally { setBusy(false); }
  };

  const createDraft = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    await action({ action: "draft", subject, title: title || subject, content });
  };

  const active = (data?.contacts || []).filter((c) => !c.unsubscribed).length;

  return (
    <main className="mx-auto max-w-[1360px] space-y-9 pb-20 font-[Manrope]">
      <header className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-[#9b9b9b]">Shangazi administration</p>
          <h1 className="font-[Fraunces] text-4xl text-[#222]">Newsletter</h1>
          <p className="mt-3 text-sm text-gray-500">Subscribers and campaigns are managed directly through Resend.</p>
        </div>
        <button type="button" onClick={() => void load()} disabled={loading || busy} className={controlClass}><RefreshCw size={16} /> Refresh</button>
      </header>

      {error && <p role="alert" className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700">{error}</p>}
      {message && <p role="status" className="rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-800">{message}</p>}

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-gray-200 p-6"><Users size={22} className="text-gray-500" /><p className="mt-4 text-3xl font-semibold">{loading ? "…" : data?.contacts.length ?? "–"}</p><p className="mt-1 text-sm text-gray-500">Total contacts in segment</p></div>
        <div className="rounded-2xl border border-gray-200 p-6"><Mail size={22} className="text-gray-500" /><p className="mt-4 text-3xl font-semibold">{loading ? "…" : active}</p><p className="mt-1 text-sm text-gray-500">Subscribed contacts</p></div>
        <div className="rounded-2xl border border-gray-200 p-6"><Send size={22} className="text-gray-500" /><p className="mt-4 text-3xl font-semibold">{loading ? "…" : data?.broadcasts.length ?? "–"}</p><p className="mt-1 text-sm text-gray-500">Recent broadcasts</p></div>
      </div>

      <section className="rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="mb-5 flex flex-wrap items-center justify-between gap-4">
          <div>
            <h2 className="font-[Fraunces] text-2xl">Subscribers</h2>
            <p className="mt-1 text-xs text-gray-500">Segment: {data?.segments.find((s) => s.id === data.segmentId)?.name || "Shangazi Newsletter"}</p>
          </div>
          <input aria-label="Search newsletter subscribers" placeholder="Search subscribers…" className={fieldClass + " max-w-[300px]"} value={search} onChange={(e) => setSearch(e.target.value)} />
        </div>
        <form className="mb-6 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); void action({ action: "add-contact", email: contactEmail }).then(() => setContactEmail("")); }}>
          <input aria-label="Existing contact email" className={fieldClass + " max-w-[340px]"} placeholder="Existing contact email to add" type="email" required value={contactEmail} onChange={(e) => setContactEmail(e.target.value)} />
          <button className={controlClass} type="submit" disabled={busy || !data}>Add existing contact</button>
        </form>
        <div className="overflow-x-auto">
          <table className="w-full min-w-[540px] text-left text-sm">
            <thead><tr className="border-b text-xs uppercase tracking-wide text-gray-500"><th className="py-3 pr-4">Email</th><th className="py-3 pr-4">Name</th><th className="py-3 pr-4">Status</th><th className="py-3 pr-4">Joined</th><th className="py-3">Action</th></tr></thead>
            <tbody>{subscribers.map((c) => <tr key={c.id} className="border-b border-gray-100">
              <td className="py-3 pr-4 font-medium">{c.email}</td>
              <td className="py-3 pr-4">{[c.first_name, c.last_name].filter(Boolean).join(" ") || "—"}</td>
              <td className="py-3 pr-4">{c.unsubscribed ? "Unsubscribed" : "Subscribed"}</td>
              <td className="py-3 pr-4">{c.created_at ? new Date(c.created_at).toLocaleDateString() : "—"}</td><td className="py-3"><button type="button" className="text-xs text-red-700 hover:underline" disabled={busy} onClick={() => { if (window.confirm(`Remove ${c.email} from the newsletter segment?`)) void action({ action: "remove-contact", email: c.email }); }}>Remove</button></td>
            </tr>)}</tbody>
          </table>
          {!loading && !subscribers.length && <p className="py-10 text-center text-sm text-gray-500">No subscribers found.</p>}
        </div>
      </section>

      <section className="rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h2 className="font-[Fraunces] text-2xl">Resend segments</h2>
        <p className="mb-4 mt-2 text-sm text-gray-500">Manage mailing-list groups. The active newsletter segment is protected from deletion.</p>
        <form className="mb-5 flex flex-wrap gap-2" onSubmit={(e) => { e.preventDefault(); void action({ action: "create-segment", name: newSegmentName }).then(() => setNewSegmentName("")); }}>
          <input aria-label="New segment name" className={fieldClass + " max-w-[340px]"} value={newSegmentName} onChange={(e) => setNewSegmentName(e.target.value)} placeholder="New segment name" minLength={3} maxLength={100} required />
          <button type="submit" className={controlClass} disabled={busy || !data}>Create segment</button>
        </form>
        <div className="space-y-2">{(data?.segments || []).map((segment) => <div key={segment.id} className="flex flex-wrap items-center justify-between gap-2 border-t border-gray-100 py-3">
          <div><p className="text-sm font-semibold">{segment.name}</p><p className="text-xs text-gray-400">{segment.id === data?.segmentId ? "Newsletter — protected" : "Other segment"}</p></div>
          <div className="flex gap-2">
            <button type="button" disabled={busy} className={controlClass} onClick={() => { const name = window.prompt("Rename segment", segment.name); if (name && name.trim() !== segment.name) void action({ action: "rename-segment", segmentId: segment.id, name: name.trim() }); }}>Rename</button>
            {segment.id !== data?.segmentId && <button type="button" disabled={busy} className={controlClass + " !text-red-700"} onClick={() => { if (window.confirm(`Permanently delete the segment "${segment.name}"? This can affect saved broadcasts.`)) void action({ action: "delete-segment", segmentId: segment.id, confirmation: "DELETE SEGMENT" }); }}>Delete</button>}
          </div>
        </div>)}</div>
      </section>

      <section className="rounded-2xl border border-gray-200 p-6 sm:p-8">
        <div className="mb-6 flex items-center gap-3"><FilePlus2 size={22} /><div><h2 className="font-[Fraunces] text-2xl">Create a broadcast draft</h2><p className="text-sm text-gray-500">Drafts are saved to Resend. Saving does not send emails.</p></div></div>
        <form onSubmit={(e) => void createDraft(e)} className="max-w-3xl space-y-4">
          <label className="block text-sm font-medium">Email subject<input required maxLength={200} className={fieldClass + " mt-2"} value={subject} onChange={(e) => setSubject(e.target.value)} /></label>
          <label className="block text-sm font-medium">Heading (optional)<input maxLength={200} className={fieldClass + " mt-2"} value={title} onChange={(e) => setTitle(e.target.value)} /></label>
          <label className="block text-sm font-medium">Message<textarea required minLength={5} rows={8} className={fieldClass + " mt-2"} value={content} onChange={(e) => setContent(e.target.value)} placeholder="Write the email text. Leave a blank line between paragraphs." /></label>
          <p className="text-xs text-gray-500">The branded email includes first-name personalization and a Resend unsubscribe link.</p>
          <button type="submit" disabled={busy || !data} className="inline-flex items-center gap-2 rounded-xl bg-[#252525] px-5 py-3 text-sm font-semibold text-white hover:bg-[#444] disabled:opacity-50"><FilePlus2 size={16} /> Save draft to Resend</button>
        </form>
      </section>

      <section className="rounded-2xl border border-gray-200 p-6 sm:p-8">
        <h2 className="mb-2 font-[Fraunces] text-2xl">Broadcasts</h2>
        <p className="mb-6 text-sm text-gray-500">Sending is an explicit, separate action. Only drafts targeting the newsletter segment can be sent here.</p>
        <div className="space-y-3">
          {(data?.broadcasts || []).filter((b) => b.segment_id === data?.segmentId).map((b) => (
            <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-gray-100 p-4">
              <div className="min-w-0"><p className="truncate text-sm font-semibold">{b.subject || b.name || "Untitled campaign"}</p><p className="mt-1 text-xs text-gray-500">{b.status || "Unknown"} · {b.created_at ? new Date(b.created_at).toLocaleDateString() : ""}</p></div>
              {b.status === "draft" && <button type="button" onClick={() => { setConfirmId(b.id); setConfirmText(""); }} className={controlClass}>Review send</button>}
            </div>
          ))}
          {!loading && !data?.broadcasts.length && <p className="text-sm text-gray-500">No broadcasts yet.</p>}
        </div>
      </section>

      {confirmId && <div role="dialog" aria-modal="true" aria-label="Send newsletter confirmation" className="fixed inset-0 z-[100] flex items-center justify-center bg-black/50 p-4">
        <div className="w-full max-w-lg rounded-2xl bg-white p-7 shadow-2xl">
          <div className="flex items-center gap-2 text-red-700"><AlertTriangle size={22} /><h3 className="text-xl font-semibold">Send newsletter to subscribers?</h3></div>
          <p className="mt-4 text-sm text-gray-600">This will start delivery through Resend to the selected newsletter audience. Review the draft in Resend before sending.</p>
          <label className="mt-5 block text-sm font-medium">Type SEND NEWSLETTER<input autoFocus className={fieldClass + " mt-2"} value={confirmText} onChange={(e) => setConfirmText(e.target.value)} /></label>
          <div className="mt-6 flex justify-end gap-3"><button type="button" className={controlClass} onClick={() => setConfirmId(null)}>Cancel</button><button type="button" disabled={busy || confirmText !== "SEND NEWSLETTER"} className="rounded-xl bg-red-700 px-4 py-2.5 text-sm font-semibold text-white disabled:opacity-50" onClick={() => void action({ action: "send", broadcastId: confirmId, confirmation: confirmText })}>Confirm and send</button></div>
        </div>
      </div>}
    </main>
  );
}
