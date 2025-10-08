import {defineType, defineField} from "sanity";

export default defineType({
  name: "recipe",
  title: "Recipe",
  type: "document",
  fields: [
    // Core
    defineField({
      name: "title",
      title: "Title",
      type: "string",
      validation: r => r.required().min(3)
    }),
    defineField({
      name: "slug",
      title: "Slug",
      type: "slug",
      options: { source: "title", maxLength: 96 },
      validation: r => r.required()
    }),
    defineField({
      name: "description",
      title: "Short Description",
      description: "1–2 sentence teaser that can double as meta description if needed.",
      type: "text",
      rows: 2,
      validation: r => r.required().min(20)
    }),
    defineField({
      name: "heroImage",
      title: "Hero Image",
      type: "image",
      options: { hotspot: true },
      fields: [
        defineField({
          name: "alt",
          title: "Alt text",
          type: "string",
          validation: r => r.required().min(5)
        })
      ],
      validation: r => r.required()
    }),

    // Timings & yield
    defineField({
      name: "servings",
      title: "Servings",
      type: "number",
      validation: r => r.required().min(1).max(24)
    }),
    defineField({
      name: "prepMin",
      title: "Prep Time (minutes)",
      type: "number",
      validation: r => r.required().min(0).max(24 * 60)
    }),
    defineField({
      name: "cookMin",
      title: "Cook Time (minutes)",
      type: "number",
      validation: r => r.required().min(0).max(24 * 60)
    }),

    // Expanded content for SEO & UX
    defineField({
      name: "introText",
      title: "Intro Text",
      description: "100–200 words: what the dish is, why it’s great, quick context.",
      type: "text",
      rows: 4
    }),
    defineField({
      name: "brandContext",
      title: "Brand / Copycat Context",
      description: "1–3 short paragraphs about the restaurant/chain inspiration.",
      type: "array",
      of: [{ type: "block" }]
    }),

    // Ingredients & Steps
    // If you have a separate Ingredient document type, you can switch 'ingredientRef'
    // to a reference. This structure supports both plain text and referenced items.
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [
        defineField({
          name: "ingredientGroup",
          title: "Ingredient Group",
          type: "object",
          fields: [
            defineField({
              name: "heading",
              title: "Group Heading (optional)",
              type: "string"
            }),
            defineField({
              name: "items",
              title: "Items",
              type: "array",
              of: [
                {
                  name: "ingredientItem",
                  type: "object",
                  fields: [
                    // Use ONE of the two below depending on your data model:
                    defineField({
                      name: "ingredientText",
                      title: "Ingredient (free text)",
                      type: "string",
                      hidden: ({ parent }) => !!parent?.ingredientRef
                    }),
                    defineField({
                      name: "ingredientRef",
                      title: "Ingredient (reference)",
                      type: "reference",
                      to: [{ type: "ingredient" }],
                      hidden: ({ parent }) => !!parent?.ingredientText
                    }),
                    defineField({ name: "quantity", title: "Quantity", type: "string" }),
                    defineField({
                      name: "unit",
                      title: "Unit",
                      type: "string",
                      options: {
                        list: [
                          { title: "g", value: "g" },
                          { title: "kg", value: "kg" },
                          { title: "oz", value: "oz" },
                          { title: "lb", value: "lb" },
                          { title: "ml", value: "ml" },
                          { title: "l", value: "l" },
                          { title: "tsp", value: "tsp" },
                          { title: "tbsp", value: "tbsp" },
                          { title: "cup", value: "cup" },
                          { title: "piece", value: "piece" },
                          { title: "slice", value: "slice" },
                          { title: "clove", value: "clove" },
                          { title: "leaf", value: "leaf" },
                          { title: "sprig", value: "sprig" },
                          { title: "bunch", value: "bunch" },
                          { title: "pinch", value: "pinch" },
                          { title: "dash", value: "dash" },
                          { title: "can", value: "can" },
                          { title: "jar", value: "jar" },
                          { title: "packet", value: "packet" },
                          { title: "sheet", value: "sheet" },
                          { title: "stick", value: "stick" }
                        ],
                        layout: "dropdown"
                      }
                    }),
                    defineField({ name: "notes", title: "Notes", type: "string" })
                  ],
                  preview: {
                    select: {
                      ingredientText: "ingredientText",
                      ingredientName: "ingredientRef.name",
                      quantity: "quantity",
                      unit: "unit",
                      notes: "notes"
                    },
                    prepare({ ingredientText, ingredientName, quantity, unit, notes }) {
                      const ingredient = ingredientName || ingredientText || "Unknown ingredient";
                      const amount = [quantity, unit].filter(Boolean).join(" ");
                      const title = amount ? `${amount} ${ingredient}` : ingredient;
                      return {
                        title,
                        subtitle: notes || undefined
                      };
                    }
                  }
                }
              ]
            })
          ],
          preview: {
            select: {
              heading: "heading",
              items: "items"
            },
            prepare({ heading, items }) {
              const count = items?.length || 0;
              const title = heading || "Ingredients";
              const subtitle = count === 1 ? "1 ingredient" : `${count} ingredients`;
              return {
                title,
                subtitle
              };
            }
          }
        })
      ],
      validation: r => r.required().min(1)
    }),
    defineField({
      name: "steps",
      title: "Method / Steps",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "step",
              title: "Step",
              type: "array",
              of: [{ type: "block" }]
            }),
            defineField({
              name: "stepImage",
              title: "Step Image (optional)",
              type: "image",
              options: { hotspot: true },
              fields: [{ name: "alt", title: "Alt text", type: "string" }]
            })
          ]
        }
      ],
      validation: r => r.required().min(1)
    }),

    // Tips, FAQs, Nutrition
    defineField({
      name: "tips",
      title: "Tips & Variations",
      type: "array",
      of: [{ type: "text" }]
    }),
    defineField({
      name: "faqs",
      title: "FAQs",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({ name: "question", title: "Question", type: "string", validation: r => r.required() }),
            defineField({ name: "answer", title: "Answer", type: "text", rows: 3, validation: r => r.required() })
          ],
          preview: {
            select: { title: "question", subtitle: "answer" }
          }
        }
      ]
    }),
    defineField({
      name: "nutrition",
      title: "Nutrition (per serving, approx.)",
      type: "object",
      fields: [
        defineField({ name: "calories", title: "Calories (kcal)", type: "number" }),
        defineField({ name: "protein", title: "Protein (g)", type: "number" }),
        defineField({ name: "fat", title: "Fat (g)", type: "number" }),
        defineField({ name: "carbs", title: "Carbs (g)", type: "number" })
      ]
    }),

    // Ratings accumulators (for the star widget API)
    defineField({
      name: "ratingCount",
      title: "Rating Count",
      type: "number",
      readOnly: true,
      initialValue: 0
    }),
    defineField({
      name: "ratingSum",
      title: "Rating Sum",
      description: "Sum of all rating values (average = ratingSum / ratingCount).",
      type: "number",
      readOnly: true,
      initialValue: 0
    }),

    // SEO (optional but handy)
    defineField({
      name: "seoTitle",
      title: "SEO Title",
      type: "string",
      validation: r => r.max(60)
    }),
    defineField({
      name: "seoDescription",
      title: "SEO Description",
      type: "text",
      rows: 2,
      validation: r => r.max(160)
    }),
    defineField({
      name: "canonicalUrl",
      title: "Canonical URL (optional)",
      type: "url"
    }),

    // Brand / Chain
    defineField({
      name: "brand",
      title: "Brand",
      description: "The restaurant chain or brand this recipe is inspired by (e.g., Wagamama, Greggs, McDonald's).",
      type: "reference",
      to: [{ type: "brand" }]
    }),

    // Categories
    defineField({
      name: "categories",
      title: "Categories",
      description: "Recipe categories (e.g., Breakfast, Lunch, Dinner, Dessert, Vegetarian, etc.)",
      type: "array",
      of: [{ type: "reference", to: [{ type: "category" }] }]
    }),

    // Created By (for user-generated recipes)
    defineField({
      name: "createdBy",
      title: "Created By",
      description: "User who created this recipe (for community/AI-generated recipes)",
      type: "object",
      fields: [
        defineField({ name: "userId", title: "User ID", type: "string" }),
        defineField({ name: "userName", title: "User Name", type: "string" }),
        defineField({ name: "userEmail", title: "User Email", type: "string" })
      ],
      hidden: ({ document }) => {
        const brand = document?.brand as any;
        return !brand || brand?._ref !== 'bite-buddy-kitchen';
      }
    })
  ],
  preview: {
    select: {
      title: "title",
      media: "heroImage",
      servings: "servings",
      prep: "prepMin",
      cook: "cookMin"
    },
    prepare({ title, media, servings, prep, cook }) {
      const meta = [
        servings ? `${servings} servings` : null,
        (prep ?? null) !== null && (cook ?? null) !== null ? `⏱ ${prep + cook} min total` : null
      ]
        .filter(Boolean)
        .join(" · ");
      return {
        title: title || "Untitled recipe",
        media,
        subtitle: meta
      };
    }
  }
});
