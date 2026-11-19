// app/(main)/admin/newsletter/layout.tsx
import { notFound } from "next/navigation";
import { isNewsletterAdmin } from "@/src/newsletter/admin";
import NewsletterAdminShell from "@/app/components/newsletter/NewsletterAdminShell";

export const dynamic = "force-dynamic";

export default async function NewsletterLayout({ children }: { children: React.ReactNode }) {
  if (!(await isNewsletterAdmin())) notFound();
  return <NewsletterAdminShell>{children}</NewsletterAdminShell>;
}
