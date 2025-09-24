import {defineType, defineField} from "sanity";

export default defineType({
  name: "ingredient",
  title: "Ingredient",
  type: "document",
  fields: [
    defineField({
      name: "name",
      title: "Name",
      type: "string",
      validation: r => r.required(),
    }),
    defineField({
      name: "synonyms",
      title: "Also known as",
      type: "array",
      of: [{ type: "string" }],
    }),
    defineField({
      name: "allergens",
      title: "Allergens",
      type: "array",
      of: [{ type: "string" }],
      options: { layout: "tags" },
    }),
    // Optional: add retailer links now so you’re affiliate-ready later
    defineField({
      name: "retailerLinks",
      title: "Retailer Links",
      type: "array",
      of: [{
        type: "object",
        fields: [
          { name: "retailer", title: "Retailer", type: "string" }, // e.g. Amazon, Tesco
          { name: "url", title: "URL", type: "url" }
        ]
      }]
    }),
  ],
});
