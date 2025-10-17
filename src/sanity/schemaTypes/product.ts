import { defineType, defineField } from "sanity";

export const product = defineType({
  name: "product",
  title: "Product",
  type: "document",
  fields: [
    defineField({
      name: "title",
      title: "Product Name",
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
      name: "description",
      title: "Description",
      type: "text",
      rows: 3,
      description: "Keep under 200 characters for optimal display on product cards",
      validation: (Rule) => Rule.required().max(200).warning("Description should be under 200 characters for best display"),
    }),
    defineField({
      name: "image",
      title: "Product Image",
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
          { title: "Kitchen Essentials", value: "kitchen-essentials" },
          { title: "Specialty Ingredients", value: "specialty-ingredients" },
          { title: "Cookbooks", value: "cookbooks" },
          { title: "Appliances", value: "appliances" },
          { title: "Bakeware", value: "bakeware" },
          { title: "Cookware", value: "cookware" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "price",
      title: "Price (GBP)",
      type: "number",
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: "affiliateLink",
      title: "Affiliate Link",
      type: "url",
      description: "Amazon affiliate link or other retailer link",
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "retailer",
      title: "Retailer",
      type: "string",
      options: {
        list: [
          { title: "Amazon", value: "amazon" },
          { title: "Tesco", value: "tesco" },
          { title: "Ocado", value: "ocado" },
          { title: "Waitrose", value: "waitrose" },
          { title: "Sous Chef", value: "souschef" },
          { title: "Other", value: "other" },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: "featured",
      title: "Featured Product",
      type: "boolean",
      description: "Show this product prominently on the products page",
      initialValue: false,
    }),
    defineField({
      name: "rating",
      title: "Rating (out of 5)",
      type: "number",
      validation: (Rule) => Rule.min(0).max(5),
    }),
    defineField({
      name: "relatedRecipes",
      title: "Related Recipes",
      type: "array",
      of: [
        {
          type: "reference",
          to: [{ type: "recipe" }],
        },
      ],
      description: "Recipes that use or recommend this product",
    }),
  ],
  preview: {
    select: {
      title: "title",
      category: "category",
      media: "image",
    },
    prepare(selection) {
      const { title, category } = selection;
      return {
        title,
        subtitle: category || "No category",
        media: selection.media,
      };
    },
  },
});
