// scripts/test-recipe-query.ts
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_WRITE_TOKEN!;
const apiVersion = "2023-01-01";

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false });

// Use the exact same query as in your frontend
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

async function testRecipeQuery() {
  console.log("🔍 Testing recipe query with actual frontend query...\n");

  // First, get all recipe slugs
  const slugs = await client.fetch(`*[_type == "recipe" && defined(slug.current)]{ "slug": slug.current }`);
  console.log(`Found ${slugs.length} recipes with slugs:`);
  slugs.forEach((s: any, i: number) => {
    console.log(`  ${i + 1}. ${s.slug}`);
  });
  console.log();

  // Test each recipe
  for (const { slug } of slugs) {
    console.log(`📄 Testing recipe: ${slug}`);

    try {
      const recipe = await client.fetch(recipeBySlugQuery, { slug });

      if (!recipe) {
        console.log(`   ❌ Recipe not found for slug: ${slug}`);
        continue;
      }

      console.log(`   ✅ Recipe found: ${recipe.title}`);

      if (!recipe.ingredients || recipe.ingredients.length === 0) {
        console.log(`   ⚠️  No ingredients found`);
        continue;
      }

      console.log(`   📋 Checking ${recipe.ingredients.length} ingredient group(s):`);

      recipe.ingredients.forEach((group: any, gi: number) => {
        console.log(`     Group ${gi + 1}${group.heading ? ` (${group.heading})` : ""}:`);

        if (!group.items || group.items.length === 0) {
          console.log(`       ⚠️  No items in this group`);
          return;
        }

        group.items.forEach((item: any, ii: number) => {
          const name = item.ingredientText || item.ingredientRef?.name || "Ingredient";
          const qtyUnit = [item.quantity, item.unit].filter(Boolean).join(" ");
          const label = [qtyUnit, name].filter(Boolean).join(" ");

          // Check for issues
          if (name === "Ingredient") {
            console.log(`       ${ii + 1}. 🔴 FALLBACK: "${label}" (no ingredientText or ingredientRef.name)`);
            console.log(`          - ingredientText: ${JSON.stringify(item.ingredientText)}`);
            console.log(`          - ingredientRef: ${JSON.stringify(item.ingredientRef)}`);
          } else if (item.ingredientRef?.name === null || item.ingredientRef?.name === undefined) {
            console.log(`       ${ii + 1}. 🟡 NULL REF: "${label}" (ingredientRef exists but name is null/undefined)`);
            console.log(`          - ingredientRef: ${JSON.stringify(item.ingredientRef)}`);
          } else {
            console.log(`       ${ii + 1}. ✅ "${label}"`);
          }
        });
      });

    } catch (error) {
      console.log(`   ❌ Error fetching recipe: ${error}`);
    }

    console.log();
  }
}

testRecipeQuery().catch((e) => {
  console.error("Test failed:", e.message || e);
  process.exit(1);
});