// Course Queries
export const PORTAL_COURSES_QUERY = `*[_type == "course"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  instructor,
  "thumbnail": thumbnail.asset->url,
  "firstVideoUrl": modules[0]->videoUrl,
  "lessonCount": count(modules),
  isPublic,
  publishedAt
}`;

export const PUBLIC_COURSES_QUERY = `*[_type == "course" && isPublic == true] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  instructor,
  "thumbnail": thumbnail.asset->url,
  "firstVideoUrl": modules[0]->videoUrl,
  "lessonCount": count(modules),
  isPublic,
  publishedAt
}`;

// Video Queries
export const PORTAL_VIDEOS_QUERY = `*[_type == "video"] | order(_createdAt desc) [0...6] {
  _id,
  title,
  "slug": slug.current,
  description,
  videoUrl,
  "thumbnail": thumbnail.asset->url,
  isPublic,
  duration
}`;

export const PUBLIC_VIDEOS_QUERY = `*[_type == "video" && isPublic == true] | order(_createdAt desc) [0...6] {
  _id,
  title,
  "slug": slug.current,
  description,
  videoUrl,
  "thumbnail": thumbnail.asset->url,
  isPublic,
  duration
}`;

// Keep defaults for backward compatibility if needed, but point to portal for discover page
export const COURSES_QUERY = PORTAL_COURSES_QUERY;
export const VIDEOS_QUERY = PORTAL_VIDEOS_QUERY;
