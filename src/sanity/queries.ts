export const COURSES_QUERY = `*[_type == "course"] | order(publishedAt desc) {
  _id,
  title,
  "slug": slug.current,
  description,
  instructor,
  "thumbnail": thumbnail.asset->url,
  "firstVideoUrl": modules[0]->videoUrl,
  "lessonCount": count(modules),
  publishedAt
}`;

export const VIDEOS_QUERY = `*[_type == "video"] | order(_createdAt desc) [0...6] {
  _id,
  title,
  "slug": slug.current,
  description,
  videoUrl,
  "thumbnail": thumbnail.asset->url,
  duration
}`;
