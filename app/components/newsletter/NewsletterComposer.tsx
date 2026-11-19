// app/components/newsletter/NewsletterComposer.tsx
"use client";
import { useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { Bold, Italic, Link2, Image as ImageIcon, Heading2, List, ListOrdered, Quote, Eye, Save, Code2, ArrowLeft, Monitor, Smartphone } from "lucide-react";
import { NewsletterNotice } from "./NewsletterNotice";
import { useNewsletterAdmin, newsletterApi, fieldClass, buttonClass, primaryClass } from "./useNewsletterAdmin";

const templates = {
  blank: { subject: "", title: "", content: "" },
  digest: { subject: "New from Shangazi this week", title: "Your weekly Shangazi update", content: "Hello! Here's what's new from Shangazi.\n\n## Featured story\n\nWrite a brief introduction to this week's article.\n\n[Read the full story](https://shangazi.rw/blog)\n\n## Latest video\n\nShare a video highlight and why it's worth watching.\n\n[Watch now](https://shangazi.rw/videos)" },
  announcement: { subject: "An update from Shangazi", title: "We have news to share", content: "We have an important update for our community.\n\n## What's new\n\nExplain the announcement here.\n\n**Thank you for being part of the Shangazi community.**" },
};

export default function NewsletterComposer({ selectedSegment, editId }: { selectedSegment?: string; editId?: string }) {
  const router = useRouter();
  const { data, error: loadError } = useNewsletterAdmin();
  const [segment, setSegment] = useState(selectedSegment || "");
  const [subject, setSubject] = useState("");
  const [title, setTitle] = useState("");
  const [previewText, setPreviewText] = useState("");
  const [content, setContent] = useState("");
  const [html, setHtml] = useState("");
  const [mode, setMode] = useState<"desktop" | "mobile">("desktop");
  const [showPreview, setShowPreview] = useState(true);
  const [saving, setSaving] = useState(false);
  const [previewing, setPreviewing] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [draftLoaded, setDraftLoaded] = useState(false);
  type PublishedContent = {
    id: string; title: string; slug: string; kind: string;
    description?: string; image?: string; author?: string; publishedAt?: string;
    duration?: string; instructor?: string; lessonCount?: number; videoUrl?: string;
  };
  const [sanityItems, setSanityItems] = useState<PublishedContent[]>([]);
  const [sanitySearch, setSanitySearch] = useState("");
  const [sanityLoading, setSanityLoading] = useState(true);
  const input = useRef<HTMLTextAreaElement>(null);

  useEffect(() => { if (!segment && data?.segmentId) setSegment(data.segmentId); }, [data,segment]);
  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/newsletter?view=content", { cache: "no-store" })
      .then(async (response) => { if (!response.ok) throw new Error("Unable to load content"); return response.json(); })
      .then((result) => { if (!cancelled) setSanityItems(result.items || []); })
      .catch(() => { if (!cancelled) setSanityItems([]); })
      .finally(() => { if (!cancelled) setSanityLoading(false); });
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!editId || draftLoaded) return;
    const controller = new AbortController();
    fetch(`/api/admin/newsletter?view=broadcast&broadcastId=${encodeURIComponent(editId)}`, { signal: controller.signal })
      .then(async (res) => { const body = await res.json(); if (!res.ok) throw new Error(body.error || "Unable to load draft."); return body.broadcast; })
      .then((b) => {
        if (b.status !== "draft") throw new Error("Only drafts can be edited.");
        setSubject(b.subject || ""); setTitle(b.subject || ""); setContent(b.text || "");
        setPreviewText(b.preview_text || ""); setSegment(b.segment_id || "");
        setDraftLoaded(true);
        if (!b.text) setMessage("This draft has no editable plain-text source. You can create a new version using the composer.");
      })
      .catch((e) => { if (!controller.signal.aborted) setError(e instanceof Error ? e.message : "Unable to load draft."); });
    return () => controller.abort();
  }, [editId,draftLoaded]);

  const apply = (before: string, after = before, placeholder = "text") => {
    const node = input.current; if (!node) return;
    const a = node.selectionStart, b = node.selectionEnd;
    const selection = content.slice(a,b) || placeholder;
    const next = content.slice(0,a) + before + selection + after + content.slice(b);
    setContent(next);setHtml("");
    requestAnimationFrame(() => { node.focus();node.setSelectionRange(a+before.length,a+before.length+selection.length); });
  };
  const preview = async () => {
    setPreviewing(true);setError("");
    try {
      const result = await newsletterApi({ action: "preview", title: title || subject || "Shangazi newsletter", subject, content });
      setHtml(result.html);
      setShowPreview(true);
    } catch (e) { setError(e instanceof Error ? e.message : "Preview unavailable."); }
    finally { setPreviewing(false); }
  };
  const save = async () => {
    setSaving(true);setError("");setMessage("");
    try {
      if (!segment) throw new Error("Choose an audience group.");
      if (editId && !draftLoaded) throw new Error("The original draft has not been loaded.");
      const result = await newsletterApi({
        action: editId ? "update-draft" : "draft", broadcastId: editId,
        segmentId: segment, subject, title: title || subject, previewText, content,
      });
      router.push(`/admin/newsletter/broadcasts/${result.id}`);
      router.refresh();
    } catch(e){setError(e instanceof Error ? e.message : "Unable to save draft.");}
    finally{setSaving(false);}
  };
  const insertSanity = (item: PublishedContent) => {
    const kind = item.kind === "post" ? "blog" : item.kind === "video" ? "videos" : "courses";
    const label = item.kind === "video" ? "Watch the video" : item.kind === "course" ? "Explore the course" : "Read the article";
    const category = item.kind === "video" ? "GUIDANCE VIDEO" : item.kind === "course" ? "COURSE" : "ARTICLE";
    const url = `https://shangazi.rw/${kind}/${encodeURIComponent(item.slug)}`;
    // Sanity image URLs are public and suitable for rendering in email clients.
    let thumbnail = item.image || "";
    if (!thumbnail && item.kind === "video" && item.videoUrl) {
      try {
        const parsed = new URL(item.videoUrl);
        let videoId = "";
        if (parsed.hostname === "youtu.be" || parsed.hostname === "www.youtu.be") videoId = parsed.pathname.slice(1).split("/")[0];
        if (["youtube.com", "www.youtube.com", "m.youtube.com"].includes(parsed.hostname)) {
          videoId = parsed.searchParams.get("v") || (parsed.pathname.startsWith("/embed/") ? parsed.pathname.split("/")[2] : "");
        }
        if (/^[\w-]{11}$/.test(videoId)) thumbnail = `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`;
      } catch { /* Only known public video hosts are supported. */ }
    }
    const escapeMarkdown = (value: string) => value.replace(/[<>*_[\]\\]/g, " ").replace(/\s+/g, " ").trim();
    const title = escapeMarkdown(item.title);
    const description = escapeMarkdown(item.description || "").slice(0, 240);
    const pieces = [category];
    if (item.publishedAt && !Number.isNaN(Date.parse(item.publishedAt))) {
      pieces.push(new Date(item.publishedAt).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }));
    }
    if (item.author) pieces.push(escapeMarkdown(item.author));
    if (item.instructor) pieces.push(escapeMarkdown(item.instructor));
    if (item.duration) pieces.push(escapeMarkdown(String(item.duration)));
    if (item.kind === "course" && typeof item.lessonCount === "number") pieces.push(`${item.lessonCount} lessons`);

    const block = [
      "---",
      thumbnail.startsWith("https://") ? `![${title}](${thumbnail})` : "",
      `### [${title}](${url})`,
      `*${pieces.join(" · ")}*`,
      description,
      `**[${label} →](${url})**`,
      "---",
    ].filter(Boolean).join("\n\n");
    setContent((previous) => `${previous.trimEnd()}\n\n${block}\n`);
    setHtml("");
  };

  const chooseTemplate = (key: keyof typeof templates) => {
    if ((subject || content) && !window.confirm("Replace the current draft with the selected template?")) return;
    const value = templates[key];setSubject(value.subject);setTitle(value.title);setContent(value.content);setHtml("");
  };
  const toolbar = [
    { label: "Bold", icon: Bold, before: "**", after: "**", placeholder:"bold text" },
    { label: "Italic", icon: Italic, before: "*", after: "*", placeholder:"italic text" },
    { label: "Heading", icon: Heading2, before: "## ", after: "", placeholder:"Heading" },
    { label: "Bulleted list", icon: List, before: "- ", after: "", placeholder:"List item" },
    { label: "Numbered list", icon: ListOrdered, before: "1. ", after: "", placeholder:"List item" },
    { label: "Quote", icon: Quote, before: "> ", after: "", placeholder:"Quoted text" },
    { label: "Link", icon: Link2, before: "[", after: "](https://shangazi.rw)", placeholder:"link text" },
    { label: "Image", icon: ImageIcon, before: "![", after: "](https://example.com/photo.jpg)", placeholder:"Image description" },
  ];

  return <div className="space-y-6">
    <header className="flex flex-wrap items-center justify-between gap-4"><div><Link href="/admin/newsletter/broadcasts" className="mb-3 inline-flex items-center gap-2 text-xs text-gray-500 hover:text-gray-900"><ArrowLeft size={14}/> Broadcasts</Link><h2 className="font-[Fraunces] text-3xl">{editId ? "Edit broadcast draft" : "Compose broadcast"}</h2><p className="mt-2 text-sm text-gray-500">Design a responsive email and save it as an unsent Resend draft.</p></div><div className="flex flex-wrap gap-2"><button type="button" onClick={() => void preview()} disabled={previewing || !content} className={buttonClass}><Eye size={15}/>{previewing ? "Rendering…" : "Preview email"}</button><button type="button" onClick={() => void save()} disabled={saving || !subject || !content || !segment} className={primaryClass}><Save size={15}/>{saving ? "Saving…" : "Save draft"}</button></div></header>
    <NewsletterNotice error={error || loadError} message={message}/>
    <div className="flex flex-wrap items-center gap-3 rounded-xl border border-[#f1d7e1] bg-[#fff8fa] p-4"><span className="text-sm font-semibold text-[#863a56]">Start with a template:</span>{Object.keys(templates).map((key) => <button type="button" key={key} onClick={() => chooseTemplate(key as keyof typeof templates)} className="rounded-lg border border-[#ecd2da] bg-white px-3 py-2 text-xs font-semibold capitalize text-[#863a56] hover:bg-[#faedf2]">{key === "digest" ? "Weekly digest" : key}</button>)}</div>
    <div className="grid min-w-0 gap-5 xl:grid-cols-[minmax(0,1fr)_minmax(320px,0.9fr)]">
      <section className="min-w-0 space-y-5 rounded-2xl border border-gray-200 p-5 sm:p-7">
        <label className="block text-sm font-semibold">To: Audience group<select className={fieldClass+" mt-2"} value={segment} onChange={(e) => setSegment(e.target.value)} disabled={Boolean(editId)}><option value="">Select group…</option>{(data?.segments || []).map((g) => <option key={g.id} value={g.id}>{g.name}</option>)}</select></label>
        <label className="block text-sm font-semibold">Subject<input className={fieldClass+" mt-2"} required maxLength={200} value={subject} onChange={(e) => setSubject(e.target.value)} placeholder="The email subject line" /></label>
        <label className="block text-sm font-semibold">Inbox preview text<input className={fieldClass+" mt-2"} maxLength={200} value={previewText} onChange={(e) => setPreviewText(e.target.value)} placeholder="A short teaser shown in the inbox" /></label>
        <label className="block text-sm font-semibold">Email heading<input className={fieldClass+" mt-2"} maxLength={200} value={title} onChange={(e) => {setTitle(e.target.value);setHtml("");}} placeholder="Visible heading inside the email" /></label>
        <div><div className="mb-2 flex flex-wrap items-center justify-between gap-2"><label htmlFor="newsletter-body" className="text-sm font-semibold">Email body · Rich text Markdown</label><span className="inline-flex items-center gap-1 text-xs text-gray-500"><Code2 size={13}/> Markdown</span></div>
          <div className="flex flex-wrap gap-1 rounded-t-xl border border-gray-200 bg-gray-50 p-2">{toolbar.map(({label,icon:Icon,before,after,placeholder})=><button type="button" key={label} title={label} aria-label={label} onClick={() => apply(before,after,placeholder)} className="rounded-lg p-2 text-gray-600 hover:bg-white hover:text-[#a63562]"><Icon size={17}/></button>)}</div>
          <textarea id="newsletter-body" ref={input} rows={18} className={fieldClass+" resize-y !rounded-t-none !border-t-0 font-mono text-[13px] leading-7"} value={content} onChange={(e) => {setContent(e.target.value);setHtml("");}} placeholder="Write your story. Use headings, **bold text**, lists, [links](https://...), and ![images](https://...)."/>
          <p className="mt-2 text-xs leading-5 text-gray-500">Images must use publicly accessible HTTPS URLs. Raw HTML is intentionally escaped to protect recipients. The footer always includes an unsubscribe link.</p>
        </div>
        <div className="rounded-xl border border-gray-100 bg-[#fafafa] p-4">
          <h3 className="text-sm font-semibold">Insert published Shangazi content</h3>
          <p className="mt-1 text-xs text-gray-500">Articles, videos, and courses come from Sanity. Click to insert a linked section into the email.</p>
          <input className={fieldClass+" mt-3"} placeholder="Search published content…" aria-label="Search Sanity content" value={sanitySearch} onChange={(e) => setSanitySearch(e.target.value)}/>
          <div className="mt-3 max-h-[340px] space-y-2 overflow-y-auto">
            {sanityItems.filter((item) => [item.title, item.description, item.author, item.instructor].filter(Boolean).join(" ").toLowerCase().includes(sanitySearch.toLowerCase())).slice(0,12).map((item) =>
              <button type="button" key={item.id} onClick={() => insertSanity(item)} className="group flex w-full items-start gap-3 rounded-xl border border-gray-100 bg-white p-2.5 text-left transition hover:border-[#e4b8c8] hover:bg-[#fff8fa]">
                <div className="relative h-[74px] w-[105px] shrink-0 overflow-hidden rounded-lg bg-gray-100">
                  {item.image ? <Image src={item.image} alt="" width={210} height={148} unoptimized className="h-full w-full object-cover"/> :
                    <div className="flex h-full items-center justify-center text-xs font-semibold text-gray-400">{item.kind === "video" ? "VIDEO" : item.kind === "post" ? "ARTICLE" : "COURSE"}</div>}
                </div>
                <span className="min-w-0 flex-1">
                  <span className="mb-1 block text-[10px] font-bold uppercase tracking-widest text-[#a63562]">{item.kind === "post" ? "Article" : item.kind === "video" ? "Video" : "Course"}
                    {item.duration ? ` · ${item.duration}` : ""}
                    {item.publishedAt && !Number.isNaN(Date.parse(item.publishedAt)) ? ` · ${new Date(item.publishedAt).toLocaleDateString("en-US",{month:"short",year:"numeric"})}` : ""}
                  </span>
                  <span className="block line-clamp-2 text-xs font-semibold leading-5 text-gray-800">{item.title}</span>
                  <span className="mt-1 block line-clamp-2 text-[11px] leading-4 text-gray-500">{item.description || item.instructor || item.author || "Insert this published content into the newsletter."}</span>
                </span>
              </button>
            )}
            {!sanityLoading && !sanityItems.length && <p className="text-xs text-gray-500">No published content available.</p>}
            {sanityLoading && <p className="text-xs text-gray-500">Loading Sanity content…</p>}
          </div>
        </div>
      </section>
      <section className="min-w-0 rounded-2xl border border-gray-200 p-4 sm:p-5">
        <div className="mb-4 flex flex-wrap items-center justify-between gap-3"><div className="flex items-center gap-2"><Eye size={18}/><h3 className="font-semibold">Email preview</h3></div><div className="flex gap-1"><button type="button" className={mode==="desktop"?primaryClass:buttonClass} onClick={() => setMode("desktop")}><Monitor size={15}/></button><button type="button" className={mode==="mobile"?primaryClass:buttonClass} onClick={() => setMode("mobile")}><Smartphone size={15}/></button></div></div>
        <div className="overflow-x-auto rounded-xl bg-gray-100 p-3"><iframe title="Rendered newsletter preview" sandbox="" className="mx-auto block h-[660px] rounded-lg border border-gray-200 bg-white" style={{ width:mode==="mobile"?"360px":"100%",maxWidth:"100%" }} srcDoc={html || "<p style='font-family:Arial;padding:32px;color:#777'>Click Preview email to render your draft.</p>"}/></div>
        <div className="mt-4 text-xs text-gray-500"><p>Preview shows email-compatible styling. Personalization and unsubscribe links are replaced by Resend at delivery.</p><button type="button" onClick={() => void preview()} disabled={previewing} className="mt-3 font-semibold text-[#a63562] hover:underline">Refresh rendered preview</button></div>
      </section>
    </div>
  </div>;
}
