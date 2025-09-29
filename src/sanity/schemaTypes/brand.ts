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
  ],
  preview: { select: { title: "title", media: "logo" } },
});
