// app/(main)/admin/newsletter/broadcasts/[id]/page.tsx
import type { Metadata } from "next";
import NewsletterBroadcastDetail from "@/app/components/newsletter/NewsletterBroadcastDetail";
export const metadata: Metadata = { title: "Broadcast Details | Newsletter Studio", robots: { index: false, follow: false } };
export default async function Page({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  return <NewsletterBroadcastDetail id={id} />;
}
