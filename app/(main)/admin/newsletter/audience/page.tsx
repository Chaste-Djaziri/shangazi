// app/(main)/admin/newsletter/audience/page.tsx
import type { Metadata } from "next";
import NewsletterAudience from "@/app/components/newsletter/NewsletterAudience";
export const metadata: Metadata = { title: "Audience | Newsletter Studio", robots: { index: false, follow: false } };
export default function Page() { return <NewsletterAudience />; }
