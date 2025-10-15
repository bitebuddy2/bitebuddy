import { defineType, defineField } from "sanity";

export default defineType({
  name: "article",
  title: "Article",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: {
        source: "title",
        maxLength: 96,
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "excerpt",
      title: "Excerpt",
      type: "text",
      description: "Short summary (120-160 characters for SEO)",
      rows: 3,
      validation: (Rule) => Rule.max(200),
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: {
        hotspot: true,
      },
      fields: [
        {
          name: "alt",
          type: "string",
          title: "Alternative text",
        },
      ],
    }),
    defineField({
      name: "category",
      title: "Category",
      type: "string",
      options: {
        list: [
          { title: "Cooking Techniques", value: "cooking-techniques" },
          { title: "Ingredient Guides", value: "ingredient-guides" },
          { title: "Food Trends", value: "food-trends" },
          { title: "Meal Prep & Planning", value: "meal-prep-planning" },
          { title: "Healthy Eating", value: "healthy-eating" },
          { title: "Restaurant Copycat Secrets", value: "copycat-secrets" },
          { title: "Kitchen Equipment", value: "kitchen-equipment" },
          { title: "Seasonal Cooking", value: "seasonal-cooking" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "tags",
      title: "Tags",
      type: "array",
      of: [{ type: "string" }],
      options: {
        layout: "tags",
      },
    }),
    defineField({
      name: "content",
      title: "Content",
      type: "array",
      of: [
        {
          type: "block",
          styles: [
            { title: "Normal", value: "normal" },
            { title: "Heading 2", value: "h2" },
            { title: "Heading 3", value: "h3" },
            { title: "Heading 4", value: "h4" },
            { title: "Quote", value: "blockquote" },
          ],
          lists: [
            { title: "Bullet", value: "bullet" },
            { title: "Numbered", value: "number" },
          ],
          marks: {
            decorators: [
              { title: "Strong", value: "strong" },
              { title: "Emphasis", value: "em" },
              { title: "Code", value: "code" },
            ],
            annotations: [
              {
                name: "link",
                type: "object",
                title: "URL",
                fields: [
                  {
                    title: "URL",
                    name: "href",
                    type: "url",
                  },
                ],
              },
            ],
          },
        },
        {
          type: "image",
          options: { hotspot: true },
          fields: [
            {
              name: "alt",
              type: "string",
              title: "Alternative text",
            },
            {
              name: "caption",
              type: "string",
              title: "Caption",
            },
          ],
        },
        {
          type: "object",
          name: "table",
          title: "Table",
          fields: [
            {
              name: "caption",
              type: "string",
              title: "Caption",
              description: "Optional table caption",
            },
            {
              name: "rows",
              type: "array",
              title: "Table Rows",
              of: [
                {
                  type: "object",
                  name: "tableRow",
                  fields: [
                    {
                      name: "cells",
                      type: "array",
                      title: "Cells",
                      of: [{ type: "string" }],
                    },
                  ],
                },
              ],
            },
            {
              name: "hasHeader",
              type: "boolean",
              title: "First row is header",
              initialValue: true,
            },
          ],
        },
      ],
    }),
    defineField({
      name: "author",
      title: "Author",
      type: "object",
      fields: [
        {
          name: "name",
          type: "string",
          title: "Name",
          initialValue: "Bite Buddy Team",
        },
        {
          name: "bio",
          type: "text",
          title: "Bio",
          rows: 2,
        },
      ],
    }),
    defineField({
      name: "publishedAt",
      title: "Published At",
      type: "datetime",
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: "featured",
      title: "Featured Article",
      type: "boolean",
      description: "Show this article on the homepage",
      initialValue: false,
    }),
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      description: "Override default title for SEO (50-60 characters)",
      validation: (Rule) => Rule.max(70),
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      description: "Meta description for search engines (120-160 characters)",
      rows: 3,
      validation: (Rule) => Rule.max(170),
    }),
    defineField({
      name: "relatedRecipes",
      title: "Related Recipes",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "recipe" }, { type: "communityRecipe" }],
        },
      ],
      description: "Link recipes mentioned or featured in this article",
    }),
    defineField({
      name: "affiliateProducts",
      title: "Affiliate Products",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "product" }],
        },
      ],
      description: "Link affiliate products mentioned in this article",
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "heroImage",
      publishedAt: "publishedAt",
    },
    prepare(selection) {
      const { category, publishedAt } = selection;
      const date = publishedAt ? new Date(publishedAt).toLocaleDateString() : "Not published";
      return {
        ...selection,
        subtitle: `${category} • ${date}`,
      };
    },
  },
});
