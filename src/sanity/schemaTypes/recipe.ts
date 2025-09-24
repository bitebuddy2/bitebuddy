import {defineType, defineField} from "sanity";

export default defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    defineField({ name: "title", title: "Title", type: "string", validation: r => r.required() }),
    defineField({ name: "slug", title: "Slug", type: "slug", options: { source: "title" }, validation: r => r.required() }),
    defineField({ name: "description", title: "Description", type: "text" }),
    defineField({ name: "heroImage", title: "Hero Image", type: "image" }),
    defineField({ name: "servings", title: "Servings", type: "number" }),
    defineField({ name: "prepTime", title: "Prep Time (minutes)", type: "number" }),
    defineField({ name: "cookTime", title: "Cook Time (minutes)", type: "number" }),
defineField({
  name: "ingredients",
  title: "Ingredients",
  type: "array",
  of: [
    {
      type: "object",
      fields: [
        {
          name: "item",
          title: "Ingredient",
          type: "reference",
          to: [{ type: "ingredient" }],
          validation: r => r.required(),
        },
        { name: "quantity", title: "Quantity", type: "string" }, // e.g. "400g", "1", "½ tsp"
        { name: "unit", title: "Unit (optional)", type: "string" }, // e.g. "g", "tsp" (optional if included in quantity)
        { name: "note", title: "Note (optional)", type: "string" }, // e.g. "finely chopped"
      ]
    }
  ]
}),    defineField({ name: "instructions", title: "Instructions", type: "array", of: [{ type: "block" }] }),
  ],
});
