// src/newsletter/admin.ts
import "server-only";
import { neonAuth } from "@neondatabase/auth/next/server";

// Only explicitly allowlisted email accounts can manage subscribers/broadcasts.
// Never infer admin privileges from having a regular SEC Portal account.
export async function isNewsletterAdmin() {
  const allow = (process.env.NEWSLETTER_ADMIN_EMAILS || "").split(",").map(x => x.trim().toLowerCase()).filter(Boolean);
  if (!allow.length) return false;
  const { user } = await neonAuth();
  return Boolean(user?.email && allow.includes(user.email.toLowerCase()));
}
