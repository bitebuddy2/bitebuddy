import { defineType, defineField } from "sanity";

export default defineType({
  name: "brand",
  title: "Brand / Chain",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Name", type: "string", validation: r => r.required() }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: r => r.required(),
    }),
    defineField({
      name: "logo",
      title: "Logo",
      type: "image",
      options: { hotspot: true },
    }),
    defineField({
      name: "description",
      title: "Description",
      type: "text",
      description: "SEO-friendly description of this brand and its recipes (optional)",
      rows: 3,
    }),
  ],
  preview: { select: { title: "title", media: "logo" } },
});
