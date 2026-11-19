// app/(main)/admin/newsletter/page.tsx
import type { Metadata } from "next";
import NewsletterOverview from "@/app/components/newsletter/NewsletterOverview";
export const metadata: Metadata = { title: "Newsletter Overview | Shangazi", robots: { index: false, follow: false } };
export default function NewsletterPage() { return <NewsletterOverview />; }
