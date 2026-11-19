// app/(main)/admin/newsletter/broadcasts/page.tsx
import type { Metadata } from "next";
import NewsletterBroadcasts from "@/app/components/newsletter/NewsletterBroadcasts";
export const metadata: Metadata = { title: "Broadcasts | Newsletter Studio", robots: { index: false, follow: false } };
export default function Page() { return <NewsletterBroadcasts />; }
