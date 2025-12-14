import { createClient } from "next-sanity"

const token = process.env.SANITY_API_READ_TOKEN

export const client = createClient({
  projectId: "tj1gjp4u",
  dataset: "production",
  apiVersion: "2024-01-01",
  // Disable the CDN so published + draft content is available when a token is set.
  useCdn: false,
  token,
  perspective: token ? "previewDrafts" : "published",
})
