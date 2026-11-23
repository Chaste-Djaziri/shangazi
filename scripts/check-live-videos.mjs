// scripts/check-live-videos.mjs
// Read-only comparison of the rendered public page with current published content.
const response = await fetch("https://shangazi.rw/videos", {cache:"no-store"});
const html = await response.text();
for (const value of [
  "CHEATING DOESN’T START IN BED",
  "IMPAMVU 10 zituma ABAGORE",
  "Shangazi Emma Claudine atangiranye umwaka",
]) {
  console.log(JSON.stringify({ title: value, htmlPresent: html.includes(value) }));
}
console.log(JSON.stringify({status:response.status, htmlBytes:html.length, nextData:html.includes("__next_f")}));
