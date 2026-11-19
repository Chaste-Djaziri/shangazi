// scripts/setup-newsletter-segment.mjs
// Run from repository root: node --env-file=.env scripts/setup-newsletter-segment.mjs
import { readFile, writeFile } from "node:fs/promises";

const key = process.env.RESEND_MARKETING_API_KEY || process.env.RESEND_API_KEY;
if (!key) throw new Error("RESEND_MARKETING_API_KEY is not configured.");

async function call(path, options = {}) {
  const response = await fetch("https://api.resend.com" + path, {
    ...options,
    headers: { Authorization: `Bearer ${key}`, ...(options.body ? { "Content-Type": "application/json" } : {}) },
  });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(response.status === 401 ? "Resend key lacks contact/segment permissions. Configure RESEND_MARKETING_API_KEY with full access." : `Resend request failed (${response.status}): ${body.message || "Unknown response"}`);
  return body;
}

const expectedName = "Shangazi Newsletter";
const configured = process.env.RESEND_NEWSLETTER_SEGMENT_ID || process.env.RESEND_SEGMENT_ID;
let selected = null;
if (configured) {
  try {
    const existing = await call(`/segments/${encodeURIComponent(configured)}`);
    if (existing.name === expectedName) selected = existing;
  } catch {
    // The legacy ID may refer to a deleted segment or an old audience.
  }
}

if (!selected) {
  let after;
  for (let page = 0; page < 20 && !selected; page++) {
    const query = new URLSearchParams({ limit: "100" });
    if (after) query.set("after", after);
    const result = await call("/segments?" + query);
    selected = (result.data || []).find((segment) => segment.name === expectedName) || null;
    if (!result.has_more || !result.data?.length) break;
    after = result.data.at(-1).id;
  }
}

if (!selected) {
  selected = await call("/segments", { method: "POST", body: JSON.stringify({ name: expectedName }) });
  console.log("Created dedicated newsletter segment.");
} else console.log("Reusing existing dedicated newsletter segment.");

if (!selected.id) throw new Error("Resend did not return the newsletter segment ID.");
const file = ".env";
const existingEnv = await readFile(file, "utf8");
const nextLine = `RESEND_NEWSLETTER_SEGMENT_ID=${selected.id}`;
const updated = /^RESEND_NEWSLETTER_SEGMENT_ID=.*$/m.test(existingEnv)
  ? existingEnv.replace(/^RESEND_NEWSLETTER_SEGMENT_ID=.*$/m, nextLine)
  : existingEnv.trimEnd() + "\n" + nextLine + "\n";
if (updated !== existingEnv) await writeFile(file, updated, { mode: 0o600 });
console.log(`Configured ${expectedName} in local .env: ${selected.id}`);
console.log("Set RESEND_NEWSLETTER_SEGMENT_ID in production hosting settings as well.");
