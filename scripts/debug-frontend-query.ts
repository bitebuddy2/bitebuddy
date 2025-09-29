// scripts/debug-frontend-query.ts
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_WRITE_TOKEN!;
const apiVersion = "2023-01-01";

// Create client with same config as frontend
const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false });

// Use the EXACT same query as the frontend
const recipeBySlugQuery = `
*[_type == "recipe" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  servings,
  prepMin,
  cookMin,
  heroImage{
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt
  },

  // New long-form fields
  introText,
  brandContext,

  // Ingredients (grouped, with reference deref)
  ingredients[]{
    heading,
    items[]{
      quantity,
      unit,
      notes,
      ingredientText,
      ingredientRef->{
        _id,
        name,
        allergens,
        kcal100, protein100, fat100, carbs100,
        density_g_per_ml, gramsPerPiece
      }
    }
  },

  // Method steps
  steps[]{
    step,
    stepImage{
      asset->{
        _id,
        url,
        metadata { lqip, dimensions }
      },
      alt
    }
  },

  // Extras
  tips[],
  faqs[]{ question, answer },
  nutrition{ calories, protein, fat, carbs },

  // Community
  ratingCount,
  ratingSum,

  // SEO
  seoTitle,
  seoDescription,
  canonicalUrl,

  // Relations
  collections[]->{
    _id,
    title,
    "slug": slug.current
  }
}
`;

async function debugFrontendQuery() {
  console.log("🔍 Debugging exact frontend query configuration...\n");

  const slug = "greggs-sausage-roll-homemade-copycat";

  console.log("Client configuration:");
  console.log(`  Project ID: ${projectId}`);
  console.log(`  Dataset: ${dataset}`);
  console.log(`  API Version: ${apiVersion}`);
  console.log(`  Use CDN: false`);
  console.log();

  try {
    console.log(`🔄 Fetching recipe with slug: ${slug}`);
    const recipe = await client.fetch(recipeBySlugQuery, { slug });

    if (!recipe) {
      console.log("❌ No recipe found!");
      return;
    }

    console.log(`✅ Recipe found: ${recipe.title}`);
    console.log(`📋 Raw ingredients data:`, JSON.stringify(recipe.ingredients, null, 2));

    if (!recipe.ingredients || recipe.ingredients.length === 0) {
      console.log("⚠️ No ingredients array found!");
      return;
    }

    console.log(`\n🔍 Detailed ingredient analysis:`);
    recipe.ingredients.forEach((group: any, gi: number) => {
      console.log(`\nGroup ${gi + 1}:`);
      console.log(`  Heading: ${group.heading || "(none)"}`);
      console.log(`  Items count: ${group.items?.length || 0}`);

      if (group.items && group.items.length > 0) {
        group.items.forEach((item: any, ii: number) => {
          console.log(`\n  Item ${ii + 1}:`);
          console.log(`    quantity: ${JSON.stringify(item.quantity)}`);
          console.log(`    unit: ${JSON.stringify(item.unit)}`);
          console.log(`    notes: ${JSON.stringify(item.notes)}`);
          console.log(`    ingredientText: ${JSON.stringify(item.ingredientText)}`);
          console.log(`    ingredientRef: ${JSON.stringify(item.ingredientRef)}`);

          // Simulate the exact frontend logic
          const name = item.ingredientText || item.ingredientRef?.name || "Ingredient";
          const qtyUnit = [item.quantity, item.unit].filter(Boolean).join(" ");
          const label = [qtyUnit, name].filter(Boolean).join(" ");

          console.log(`    ➡️ Computed name: "${name}"`);
          console.log(`    ➡️ Final label: "${label}"`);

          if (name === "Ingredient") {
            console.log(`    🚨 PROBLEM: This will show as fallback "Ingredient"`);
          }
        });
      }
    });

  } catch (error) {
    console.error("❌ Query failed:", error);
  }
}

debugFrontendQuery();