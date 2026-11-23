// scripts/check-video-visibility.mjs
// Read-only diagnostic. Never prints API credentials.
import { createClient } from "@sanity/client";
const client = createClient({
  projectId: "tj1gjp4u", dataset: "production", apiVersion: "2024-01-01",
  useCdn: false, perspective: "published"
});
const videos = await client.fetch(`*[_type == "video"] | order(_createdAt desc) {
  _id, title, "slug": slug.current, isPublic, _createdAt, _updatedAt
}`);
console.log(JSON.stringify({
  publishedTotal: videos.length,
  firstSix: videos.slice(0,6).map(v=>({ title:v.title, public:v.isPublic===true, slugAvailable:Boolean(v.slug) })),
  excludedAfterFirstSix: videos.slice(6).map(v=>({ title:v.title, public:v.isPublic===true, slugAvailable:Boolean(v.slug) })),
  publicCount: videos.filter(v=>v.isPublic===true && v.slug).length,
  memberOnlyCount: videos.filter(v=>v.isPublic!==true && v.slug).length,
},null,2));