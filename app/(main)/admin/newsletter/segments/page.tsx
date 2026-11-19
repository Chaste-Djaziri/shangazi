// app/(main)/admin/newsletter/segments/page.tsx
import type { Metadata } from "next";
import NewsletterSegments from "@/app/components/newsletter/NewsletterSegments";
export const metadata: Metadata = { title: "Audience Groups | Newsletter Studio", robots: { index: false, follow: false } };
export default function Page() { return <NewsletterSegments />; }
