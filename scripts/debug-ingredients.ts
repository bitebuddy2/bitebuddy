// scripts/debug-ingredients.ts
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_WRITE_TOKEN!;
const apiVersion = "2023-01-01";

if (!projectId || !dataset) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET");
}
if (!token) {
  throw new Error("Missing SANITY_WRITE_TOKEN (Editor/Write token) in .env.local");
}

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false });

async function debugIngredients() {
  console.log("🔍 Investigating ingredient data...\n");

  // 1. Check all ingredient documents
  const ingredients = await client.fetch(`*[_type == "ingredient"]{_id, name, synonyms}`);
  console.log(`📋 Found ${ingredients.length} ingredient documents:`);
  ingredients.forEach((ing: any, i: number) => {
    console.log(`  ${i + 1}. ${ing.name || "[NO NAME]"} (${ing._id})`);
  });
  console.log();

  // 2. Check all recipes and their ingredient usage
  const recipes = await client.fetch(`
    *[_type == "recipe"]{
      _id,
      title,
      "ingredientGroups": ingredients[]{
        heading,
        items[]{
          ingredientText,
          "refId": ingredientRef._ref,
          "refExists": defined(ingredientRef->_id),
          "refName": ingredientRef->name
        }
      }
    }
  `);

  console.log(`🍽️ Found ${recipes.length} recipes. Checking ingredient usage:\n`);

  let totalIngredientItems = 0;
  let itemsWithText = 0;
  let itemsWithRef = 0;
  let itemsWithBrokenRef = 0;
  let itemsWithNullName = 0;

  recipes.forEach((recipe: any) => {
    console.log(`📄 Recipe: ${recipe.title}`);

    if (!recipe.ingredientGroups || recipe.ingredientGroups.length === 0) {
      console.log("   ⚠️  No ingredient groups found");
      return;
    }

    recipe.ingredientGroups.forEach((group: any, gi: number) => {
      if (group.heading) {
        console.log(`   Group ${gi + 1}: ${group.heading}`);
      } else {
        console.log(`   Group ${gi + 1}:`);
      }

      group.items?.forEach((item: any, ii: number) => {
        totalIngredientItems++;

        if (item.ingredientText) {
          itemsWithText++;
          console.log(`     ${ii + 1}. TEXT: "${item.ingredientText}"`);
        } else if (item.refId) {
          itemsWithRef++;
          if (!item.refExists) {
            itemsWithBrokenRef++;
            console.log(`     ${ii + 1}. 🔴 BROKEN REF: ${item.refId} (document doesn't exist)`);
          } else if (!item.refName) {
            itemsWithNullName++;
            console.log(`     ${ii + 1}. 🟡 NULL NAME: ${item.refId} (document exists but no name)`);
          } else {
            console.log(`     ${ii + 1}. ✅ REF: "${item.refName}" (${item.refId})`);
          }
        } else {
          console.log(`     ${ii + 1}. ❌ EMPTY: No text or reference`);
        }
      });
    });
    console.log();
  });

  console.log("📊 Summary:");
  console.log(`   Total ingredient items: ${totalIngredientItems}`);
  console.log(`   Items with text: ${itemsWithText}`);
  console.log(`   Items with references: ${itemsWithRef}`);
  console.log(`   Items with broken references: ${itemsWithBrokenRef}`);
  console.log(`   Items with null names: ${itemsWithNullName}`);

  if (itemsWithBrokenRef > 0 || itemsWithNullName > 0) {
    console.log("\n🚨 Issues found that need fixing:");
    if (itemsWithBrokenRef > 0) {
      console.log(`   - ${itemsWithBrokenRef} broken references (pointing to non-existent documents)`);
    }
    if (itemsWithNullName > 0) {
      console.log(`   - ${itemsWithNullName} references with null names (documents exist but no name field)`);
    }
  } else {
    console.log("\n✅ No obvious issues found!");
  }
}

debugIngredients().catch((e) => {
  console.error("Debug failed:", e.message || e);
  process.exit(1);
});