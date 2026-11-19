// src/newsletter/senders.ts
// Shared allowlist for composing mail from Shangazi-owned addresses.
// Override with NEWSLETTER_SENDER_ADDRESSES=alias@shangazi.rw,other@shangazi.rw.
export const DEFAULT_SENDER_ADDRESSES = [
  "news@shangazi.rw",
  "contact@shangazi.rw",
  "partner@shangazi.rw",
  "help@shangazi.rw",
  "business@shangazi.rw",
  "comms@shangazi.rw",
] as const;

export function senderAddresses() {
  const configured = process.env.NEWSLETTER_SENDER_ADDRESSES
    ?.split(",").map((value) => value.trim().toLowerCase()).filter(Boolean);
  const addresses = configured?.length ? configured : [...DEFAULT_SENDER_ADDRESSES];
  return Array.from(new Set(addresses.filter((email) =>
    /^[a-z0-9._%+-]+@shangazi\.rw$/.test(email),
  )));
}

export function validatedSender(email: unknown): string | null {
  if (typeof email !== "string") return null;
  const normalized = email.trim().toLowerCase();
  return senderAddresses().includes(normalized) ? `Shangazi <${normalized}>` : null;
}
