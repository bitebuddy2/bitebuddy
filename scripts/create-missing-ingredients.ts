#!/usr/bin/env npx tsx

/**
 * Create missing ingredient documents in Sanity
 */

import { client } from "../src/sanity/client";

const missingIngredients = [
  {
    "_id": "ingredient.fine-sea-salt",
    "_type": "ingredient",
    "name": "Fine Sea Salt"
  },
  {
    "_id": "ingredient.sausage-meat",
    "_type": "ingredient",
    "name": "Sausage Meat"
  },
  {
    "_id": "ingredient.puff-pastry",
    "_type": "ingredient",
    "name": "Puff Pastry"
  },
  {
    "_id": "ingredient.breadcrumbs",
    "_type": "ingredient",
    "name": "Breadcrumbs"
  },
  {
    "_id": "ingredient.onion",
    "_type": "ingredient",
    "name": "Onion"
  },
  {
    "_id": "ingredient.garlic",
    "_type": "ingredient",
    "name": "Garlic"
  },
  {
    "_id": "ingredient.sage",
    "_type": "ingredient",
    "name": "Sage"
  },
  {
    "_id": "ingredient.black-pepper",
    "_type": "ingredient",
    "name": "Black Pepper"
  },
  {
    "_id": "ingredient.egg",
    "_type": "ingredient",
    "name": "Egg"
  },
  {
    "_id": "ingredient.milk",
    "_type": "ingredient",
    "name": "Milk"
  }
];

async function createMissingIngredients() {
  console.log("🏗️  Creating Missing Ingredient Documents");
  console.log("========================================\n");

  try {
    console.log(`Creating ${missingIngredients.length} missing ingredient documents...`);

    for (const ingredient of missingIngredients) {
      console.log(`   Creating: ${ingredient.name} (${ingredient._id})`);

      try {
        const result = await client.createOrReplace(ingredient);
        console.log(`   ✅ Created: ${result._id}`);
      } catch (error) {
        console.log(`   ❌ Failed to create ${ingredient._id}:`, error);
      }
    }

    console.log("\n🎉 Ingredient creation complete!");
    console.log("\nNow testing search functionality...");

    // Test search after creating ingredients
    const { default: testSearchQueries } = await import('./test-search-queries');
    await testSearchQueries();

  } catch (error) {
    console.error("❌ Error creating ingredients:", error);
  }
}

if (require.main === module) {
  createMissingIngredients().catch(console.error);
}

export default createMissingIngredients;