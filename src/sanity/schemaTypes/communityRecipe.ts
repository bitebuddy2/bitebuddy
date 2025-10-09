import {defineType, defineField} from "sanity";

export default defineType({
  name: "communityRecipe",
  title: "Community Recipe",
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
      description: "1–2 sentence teaser",
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
          validation: r => r.min(5)
        })
      ]
      // Optional - AI recipes often don't have images
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

    // Intro text
    defineField({
      name: "introText",
      title: "Intro Text",
      description: "Brief introduction to the recipe",
      type: "text",
      rows: 4
    }),

    // Simplified Ingredients (free text only, no references)
    defineField({
      name: "ingredients",
      title: "Ingredients",
      type: "array",
      of: [
        {
          type: "object",
          fields: [
            defineField({
              name: "name",
              title: "Ingredient Name",
              type: "string",
              validation: r => r.required()
            }),
            defineField({
              name: "amount",
              title: "Amount/Quantity",
              type: "string"
            }),
            defineField({
              name: "unit",
              title: "Unit",
              type: "string"
            }),
            defineField({
              name: "notes",
              title: "Notes (optional)",
              type: "string"
            })
          ],
          preview: {
            select: {
              name: "name",
              amount: "amount",
              unit: "unit"
            },
            prepare({ name, amount, unit }) {
              const quantity = [amount, unit].filter(Boolean).join(" ");
              const title = quantity ? `${quantity} ${name}` : name;
              return { title };
            }
          }
        }
      ],
      validation: r => r.required().min(1)
    }),

    // Simplified Steps (plain text array)
    defineField({
      name: "steps",
      title: "Method / Steps",
      type: "array",
      of: [{ type: "text" }],
      validation: r => r.required().min(1)
    }),

    // Tips & FAQs
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

    // Nutrition
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

    // User who created this recipe (REQUIRED for community recipes)
    defineField({
      name: "createdBy",
      title: "Created By",
      description: "User who created this recipe",
      type: "object",
      fields: [
        defineField({ name: "userId", title: "User ID", type: "string", validation: r => r.required() }),
        defineField({ name: "userName", title: "User Name", type: "string", validation: r => r.required() }),
        defineField({ name: "userEmail", title: "User Email", type: "string" }),
        defineField({
          name: "cookingMethod",
          title: "Cooking Method",
          type: "string",
          description: "e.g., Bake, Grill, Air Fry, BBQ"
        }),
        defineField({
          name: "spiceLevel",
          title: "Spice Level",
          type: "string",
          description: "e.g., Mild, Medium, Hot"
        }),
        defineField({
          name: "dietaryPreference",
          title: "Dietary Preference",
          type: "string",
          description: "e.g., Vegetarian, Vegan, Halal, Gluten-free"
        })
      ],
      validation: r => r.required()
    }),

    // Ratings
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
    })
  ],
  preview: {
    select: {
      title: "title",
      media: "heroImage",
      userName: "createdBy.userName",
      servings: "servings"
    },
    prepare({ title, media, userName, servings }) {
      const subtitle = [
        userName ? `By ${userName}` : null,
        servings ? `${servings} servings` : null
      ]
        .filter(Boolean)
        .join(" · ");
      return {
        title: title || "Untitled community recipe",
        media,
        subtitle
      };
    }
  }
});
