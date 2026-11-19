// app/components/newsletter/useNewsletterAdmin.ts
"use client";

import { useCallback, useEffect, useState } from "react";

export type Contact = { id: string; email: string; first_name?: string; last_name?: string; unsubscribed?: boolean; created_at?: string };
export type Segment = { id: string; name: string; created_at?: string };
export type Broadcast = { id: string; name?: string; subject?: string; status?: string; segment_id?: string; created_at?: string; preview_text?: string; html?: string; text?: string };
export type NewsletterData = { segmentId: string; segments: Segment[]; contacts: Contact[]; broadcasts: Broadcast[] };

export async function newsletterApi(body: Record<string, unknown>) {
  const response = await fetch("/api/admin/newsletter", {
    method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(body),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(data.error || "Request failed.");
  return data;
}

export function useNewsletterAdmin() {
  const [data, setData] = useState<NewsletterData | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const reload = useCallback(async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/admin/newsletter", { cache: "no-store" });
      const value = await response.json();
      if (!response.ok) throw new Error(value.error || "Failed to load newsletter data.");
      setData(value as NewsletterData);
      setError("");
    } catch (e) { setError(e instanceof Error ? e.message : "Unable to load data."); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { void reload(); }, [reload]);

  const act = async (body: Record<string, unknown>) => {
    setBusy(true); setError(""); setMessage("");
    try {
      const value = await newsletterApi(body);
      setMessage(value.message || "Changes saved.");
      await reload();
      return value;
    } catch (e) { setError(e instanceof Error ? e.message : "Operation failed."); return null; }
    finally { setBusy(false); }
  };
  return { data, loading, busy, error, message, setError, setMessage, reload, act };
}

export const fieldClass = "w-full rounded-xl border border-gray-200 bg-white px-4 py-3 text-sm text-[#262626] outline-none focus:border-[#be1d51] focus:ring-1 focus:ring-[#be1d51]";
export const buttonClass = "inline-flex items-center justify-center gap-2 rounded-xl border border-gray-200 px-4 py-2.5 text-sm font-semibold text-gray-700 transition hover:bg-gray-50 disabled:opacity-50";
export const primaryClass = "inline-flex items-center justify-center gap-2 rounded-xl bg-[#262626] px-5 py-2.5 text-sm font-semibold text-white hover:bg-[#444] disabled:opacity-50";

export { NewsletterNotice } from "./NewsletterNotice";
