import { defineType, defineField } from "sanity";

export default defineType({
  name: "ingredient",
  title: "Ingredient",
  type: "document",
  fields: [
    defineField({ name: "name", title: "Name", type: "string", validation: r => r.required() }),
    defineField({ name: "synonyms", title: "Synonyms (search/matching)", type: "array", of: [{ type: "string" }] }),

    // Nutrition per 100g (as sold / as used)
    defineField({ name: "kcal100", title: "Calories per 100g (kcal)", type: "number" }),
    defineField({ name: "protein100", title: "Protein per 100g (g)", type: "number" }),
    defineField({ name: "fat100", title: "Fat per 100g (g)", type: "number" }),
    defineField({ name: "carbs100", title: "Carbs per 100g (g)", type: "number" }),

    // Unit conversion helpers (optional but super useful)
    defineField({
      name: "density_g_per_ml",
      title: "Density (g/ml) for volume→weight",
      type: "number",
      description: "Water≈1.00, oil≈0.92, honey≈1.42"
    }),
    defineField({
      name: "gramsPerPiece",
      title: "Typical grams per piece",
      type: "number",
      description: "e.g., 1 egg ≈ 50g, 1 onion ≈ 150g"
    }),

    // Allergens etc. (already in your plan)
    defineField({ name: "allergens", title: "Allergens", type: "array", of: [{ type: "string" }] }),

    // Affiliate retailer links
    defineField({
      name: "retailerLinks",
      title: "Retailer Links",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "retailer", title: "Retailer Name", type: "string", validation: r => r.required() }),
            defineField({ name: "url", title: "Affiliate URL", type: "url", validation: r => r.required() }),
            defineField({ name: "label", title: "Button Label (optional)", type: "string", placeholder: "Buy at Tesco" })
          ],
          preview: {
            select: { title: "retailer", subtitle: "url" }
          }
        }
      ]
    })
  ],
  preview: { select: { title: "name" } }
});
