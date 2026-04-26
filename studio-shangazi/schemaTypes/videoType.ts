import { defineField, defineType } from "sanity"

export const videoType = defineType({
  name: "video",
  title: "Video",
  type: "document",
  fields: [
    defineField({
      name: "isPublic",
      title: "Is Public?",
      type: "boolean",
      description: "If checked, this video will be visible on the public website. Otherwise, it's only available in the SEC Portal.",
      initialValue: false,
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "slug",
      type: "slug",
      options: { source: "title" },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "description",
      type: "text",
      rows: 4,
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL",
      type: "url",
      description: "Paste a YouTube, Vimeo, or Google Drive link.",
    }),
    defineField({
      name: "videoFile",
      title: "Video File",
      type: "file",
      description: "Upload a video file directly to Sanity.",
      options: {
        accept: "video/*",
      },
    }),
    defineField({
      name: "thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "duration",
      type: "string",
      description: "Duration of the video (e.g., 12:45).",
    }),
  ],
})
