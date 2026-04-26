import { defineField, defineType } from "sanity"

export const courseType = defineType({
  name: "course",
  title: "Course",
  type: "document",
  fields: [
    defineField({
      name: "isPublic",
      title: "Is Public?",
      type: "boolean",
      description: "If checked, this course will be visible on the public website. Otherwise, it's only available in the SEC Portal. Note: If a course is private, all its videos are automatically private within its context.",
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
      rows: 6,
    }),
    defineField({
      name: "instructor",
      type: "string",
      initialValue: "Emma Claudine",
    }),
    defineField({
      name: "thumbnail",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "modules",
      title: "Lessons / Videos",
      type: "array",
      of: [{ type: "reference", to: [{ type: "video" }] }],
      description: "Add and order the videos that make up this course.",
    }),
    defineField({
      name: "publishedAt",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
  ],
})
