// app/components/newsletter/NewsletterBroadcastDetail.tsx
"use client";
import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowLeft, ExternalLink, RefreshCw, Send, Edit3, Eye } from "lucide-react";
import { NewsletterNotice } from "./NewsletterNotice";
import { newsletterApi, buttonClass, primaryClass, type Broadcast } from "./useNewsletterAdmin";

export default function NewsletterBroadcastDetail({ id }: { id: string }) {
  const [broadcast, setBroadcast] = useState<Broadcast | null>(null);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [confirm, setConfirm] = useState("");
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/newsletter?view=broadcast&broadcastId=${encodeURIComponent(id)}`, { cache: "no-store" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Unable to retrieve broadcast.");
      setBroadcast(data.broadcast);
      setError("");
    } catch(e) { setError(e instanceof Error ? e.message : "Unable to retrieve broadcast."); }
    finally { setLoading(false); }
  }, [id]);
  useEffect(() => { void load(); }, [load]);
  const send = async () => {
    setBusy(true);setError("");setMessage("");
    try {
      const value = await newsletterApi({ action: "send", broadcastId: id, confirmation: confirm });
      setMessage(value.message || "Broadcast submitted for delivery.");
      setConfirmOpen(false);setConfirm("");
      await load();
    } catch(e){setError(e instanceof Error ? e.message : "Sending failed.");}
    finally{setBusy(false);}
  };
  return <div className="space-y-6">
    <Link href="/admin/newsletter/broadcasts" className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"><ArrowLeft size={16}/> All broadcasts</Link>
    <div className="flex flex-wrap items-start justify-between gap-4"><div><p className="text-xs font-bold uppercase tracking-widest text-[#9e4265]">Broadcast details</p><h2 className="mt-2 font-[Fraunces] text-3xl">{broadcast?.subject || broadcast?.name || "Email broadcast"}</h2><p className="mt-2 text-sm capitalize text-gray-500">Status: {broadcast?.status || "Loading…"}</p></div><div className="flex flex-wrap gap-2">
      <button className={buttonClass} onClick={() => void load()} disabled={loading}><RefreshCw size={15}/> Refresh</button>
      {broadcast?.status === "draft" && <Link href={`/admin/newsletter/compose?edit=${id}`} className={buttonClass}><Edit3 size={15}/> Edit draft</Link>}
      {broadcast?.status === "draft" && <button className={primaryClass} onClick={() => setConfirmOpen(true)}><Send size={15}/> Send</button>}
    </div></div>
    <NewsletterNotice error={error} message={message}/>
    <div className="grid gap-4 rounded-2xl border border-gray-200 p-5 text-sm sm:grid-cols-2">
      <div><p className="text-xs text-gray-500">Subject</p><p className="mt-1 font-semibold">{broadcast?.subject || "—"}</p></div>
      <div><p className="text-xs text-gray-500">Audience group ID</p><p className="mt-1 break-all font-medium">{broadcast?.segment_id || "—"}</p></div>
      <div><p className="text-xs text-gray-500">Created</p><p className="mt-1">{broadcast?.created_at ? new Date(broadcast.created_at).toLocaleString() : "—"}</p></div>
      <div><p className="text-xs text-gray-500">Preview text</p><p className="mt-1">{broadcast?.preview_text || "—"}</p></div>
    </div>
    <section className="rounded-2xl border border-gray-200 p-5">
      <div className="mb-5 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Eye size={18}/><h3 className="font-semibold">Email preview</h3></div><div className="flex gap-2"><button className={mode === "desktop" ? primaryClass : buttonClass} onClick={() => setMode("desktop")}>Desktop</button><button className={mode === "mobile" ? primaryClass : buttonClass} onClick={() => setMode("mobile")}>Mobile</button></div></div>
      <div className="overflow-auto rounded-xl bg-gray-100 p-3 sm:p-6"><iframe title="Broadcast email HTML preview" sandbox="" className="mx-auto block h-[630px] rounded-lg border border-gray-200 bg-white" style={{ width: mode === "mobile" ? "360px" : "100%", maxWidth: "100%" }} srcDoc={broadcast?.html || "<p style='padding:24px'>No HTML preview is available for this broadcast.</p>"} /></div>
      <p className="mt-3 text-xs text-gray-500">Preview is sandboxed. Resend replaces recipient placeholders and unsubscribe URLs when delivering.</p>
      {broadcast?.text && <details className="mt-5 rounded-xl border border-gray-100 p-4"><summary className="cursor-pointer text-sm font-semibold">Plain-text version</summary><pre className="mt-3 whitespace-pre-wrap break-words text-sm text-gray-600">{broadcast.text}</pre></details>}
    </section>
    {confirmOpen && <div role="dialog" aria-modal="true" aria-label="Confirm broadcast send" className="fixed inset-0 z-[100] grid place-items-center bg-black/50 p-4"><div className="w-full max-w-md rounded-2xl bg-white p-7 shadow-xl"><h3 className="font-[Fraunces] text-2xl">Send this broadcast?</h3><p className="mt-3 text-sm text-gray-600">Resend will deliver this email to the selected audience. This cannot be undone after sending.</p><label className="mt-5 block text-sm font-semibold">Type SEND NEWSLETTER<input className="mt-2 w-full rounded-xl border border-gray-200 p-3" value={confirm} onChange={(e) => setConfirm(e.target.value)}/></label><div className="mt-5 flex justify-end gap-2"><button className={buttonClass} onClick={() => setConfirmOpen(false)}>Cancel</button><button disabled={busy || confirm !== "SEND NEWSLETTER"} className={primaryClass} onClick={() => void send()}>Confirm and send</button></div></div></div>}
    <a className="inline-flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800" href="https://resend.com/broadcasts" target="_blank" rel="noreferrer">View broadcasts in Resend <ExternalLink size={14}/></a>
  </div>;
}
