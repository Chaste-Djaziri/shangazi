// app/(main)/admin/newsletter/compose/page.tsx
import type { Metadata } from "next";
import NewsletterComposer from "@/app/components/newsletter/NewsletterComposer";
export const metadata: Metadata = { title: "Compose Broadcast | Newsletter Studio", robots: { index: false, follow: false } };
export default async function Page({ searchParams }: { searchParams: Promise<{ segmentId?: string; edit?: string }> }) {
  const params = await searchParams;
  return <NewsletterComposer selectedSegment={params.segmentId} editId={params.edit}/>;
}
