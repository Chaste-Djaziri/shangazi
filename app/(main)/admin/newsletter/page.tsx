// app/(main)/admin/newsletter/page.tsx
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { isNewsletterAdmin } from "@/src/newsletter/admin";
import NewsletterAdmin from "@/app/components/newsletter/NewsletterAdmin";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Newsletter Admin | Shangazi",
  robots: { index: false, follow: false },
};

export default async function NewsletterAdminPage() {
  if (!(await isNewsletterAdmin())) notFound();
  return <NewsletterAdmin />;
}
