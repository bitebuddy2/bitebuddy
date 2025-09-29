// scripts/fix-recipe-ingredients.ts
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_WRITE_TOKEN!;
const apiVersion = "2023-01-01";

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false });

async function fixRecipeIngredients() {
  console.log("🔧 Fixing corrupted recipe ingredients...\n");

  // First, let's examine the current broken recipe
  const recipe = await client.fetch(`*[_type == "recipe" && slug.current == "greggs-sausage-roll-homemade-copycat"][0]{
    _id,
    title,
    ingredients
  }`);

  console.log("Current recipe data:");
  console.log(`Title: ${recipe.title}`);
  console.log(`Ingredients:`, JSON.stringify(recipe.ingredients, null, 2));

  // Get the ingredient references we need
  const saltRef = await client.fetch(`*[_type == "ingredient" && _id == "ingredient.fine-sea-salt"][0]._id`);
  const sausageRef = await client.fetch(`*[_type == "ingredient" && _id == "ingredient.sausage-meat"][0]._id`);

  console.log(`\nFound ingredients:`);
  console.log(`Salt ID: ${saltRef}`);
  console.log(`Sausage ID: ${sausageRef}`);

  if (!saltRef || !sausageRef) {
    console.log("❌ Required ingredient documents not found!");
    return;
  }

  // Create the correct ingredients structure
  const correctIngredients = [
    {
      _type: "object",
      heading: null,
      items: [
        {
          _type: "object",
          quantity: "1",
          unit: "tsp",
          notes: null,
          ingredientText: null,
          ingredientRef: {
            _type: "reference",
            _ref: saltRef
          }
        },
        {
          _type: "object",
          quantity: "500",
          unit: "g",
          notes: null,
          ingredientText: null,
          ingredientRef: {
            _type: "reference",
            _ref: sausageRef
          }
        }
      ]
    }
  ];

  console.log(`\nUpdating recipe with correct ingredients...`);

  try {
    await client
      .patch(recipe._id)
      .set({ ingredients: correctIngredients })
      .commit();

    console.log("✅ Recipe ingredients updated successfully!");

    // Verify the fix
    const updatedRecipe = await client.fetch(`*[_type == "recipe" && slug.current == "greggs-sausage-roll-homemade-copycat"][0]{
      _id,
      title,
      ingredients[]{
        heading,
        items[]{
          quantity,
          unit,
          notes,
          ingredientText,
          ingredientRef->{
            _id,
            name
          }
        }
      }
    }`);

    console.log("\n🔍 Verification - Updated recipe ingredients:");
    updatedRecipe.ingredients.forEach((group: any, gi: number) => {
      console.log(`Group ${gi + 1}${group.heading ? ` (${group.heading})` : ""}:`);
      group.items?.forEach((item: any, ii: number) => {
        const name = item.ingredientText || item.ingredientRef?.name || "MISSING";
        const qtyUnit = [item.quantity, item.unit].filter(Boolean).join(" ");
        console.log(`  ${ii + 1}. ${qtyUnit} ${name}`);
      });
    });

  } catch (error) {
    console.error("❌ Failed to update recipe:", error);
  }
}

fixRecipeIngredients().catch((e) => {
  console.error("Fix failed:", e.message || e);
  process.exit(1);
});