import { defineField, defineType } from "sanity"

export const postType = defineType({
  name: "post",
  title: "Post",
  type: "document",
  fields: [
    defineField({
      name: "isPublic",
      title: "Is Public?",
      type: "boolean",
      description: "If checked, this post will be visible on the public website. Otherwise, it's only available in the SEC Portal.",
      initialValue: false,
    }),
    defineField({
      name: "title",
      type: "string",
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "author",
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
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: "image",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "gallery",
      type: "array",
      of: [{ type: "image", options: { hotspot: true } }],
    }),
    defineField({
      name: "videoUrl",
      title: "Video URL (YouTube/Vimeo)",
      type: "url",
      description: "Paste a YouTube or Vimeo link to embed.",
    }),
    defineField({
      name: "externalLinks",
      type: "array",
      of: [
        defineField({
          name: "link",
          type: "object",
          fields: [
            { name: "label", type: "string" },
            { name: "url", type: "url", validation: (rule) => rule.required() },
          ],
        }),
      ],
    }),
    defineField({
      name: "body",
      type: "array",
      of: [{ type: "block" }],
    }),
    defineField({
      name: "content",
      title: "Content (Markdown supported)",
      type: "text",
      rows: 12,
      description: "Optional raw markdown body if you prefer writing in Markdown.",
    }),
  ],
})
