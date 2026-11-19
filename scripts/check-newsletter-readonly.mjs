// scripts/check-newsletter-readonly.mjs
// Read-only integration check. Does NOT subscribe, create broadcasts or send emails.
const key = process.env.RESEND_MARKETING_API_KEY;
const segmentId = process.env.RESEND_NEWSLETTER_SEGMENT_ID;
if (!key || !segmentId) throw new Error("Missing marketing key or newsletter segment ID.");
async function check(label, path) {
  const response = await fetch("https://api.resend.com" + path, { headers: { Authorization: `Bearer ${key}` } });
  const body = await response.json().catch(() => ({}));
  if (!response.ok) {
    console.error(`${label}: HTTP ${response.status} — ${body.message || "API error"}`);
    process.exitCode = 1; return;
  }
  console.log(`${label}: OK (${response.status})`);
  if (label === "Newsletter segment") console.log("Segment name:", body.name);
  if (label === "Broadcast list") console.log("Returned campaign count:", body.data?.length ?? 0);
  if (label === "Newsletter contacts") console.log("Returned contact count (first page):", body.data?.length ?? 0);
}
await check("Newsletter segment", `/segments/${segmentId}`);
await check("All segments", "/segments?limit=5");
await check("Newsletter contacts", `/segments/${segmentId}/contacts?limit=5`);
await check("Broadcast list", "/broadcasts?limit=5");
