#!/usr/bin/env npx tsx

/**
 * Analyze missing ingredient documents and create them
 */

import { client } from "../src/sanity/client";
import { groq } from "next-sanity";

async function analyzeMissingIngredients() {
  console.log("🔍 Missing Ingredients Analysis");
  console.log("===============================\n");

  // Get all ingredient references used in recipes
  const usedRefsQuery = groq`
    *[_type == "recipe" && defined(ingredients)] {
      "refs": ingredients[].items[].ingredientRef._ref
    }
  `;

  // Get all existing ingredient documents
  const existingIngredientsQuery = groq`
    *[_type == "ingredient"] {
      _id,
      name
    }
  `;

  try {
    console.log("1. Finding all ingredient references used in recipes...");
    const recipeData = await client.fetch(usedRefsQuery);

    // Flatten and deduplicate refs
    const allRefs = new Set<string>();
    recipeData.forEach((recipe: any) => {
      if (recipe.refs) {
        recipe.refs.forEach((ref: string) => {
          if (ref) allRefs.add(ref);
        });
      }
    });

    console.log(`   Found ${allRefs.size} unique ingredient references`);

    console.log("\n2. Finding existing ingredient documents...");
    const existingIngredients = await client.fetch(existingIngredientsQuery);
    const existingIds = new Set(existingIngredients.map((ing: any) => ing._id));

    console.log(`   Found ${existingIngredients.length} existing ingredient documents`);

    console.log("\n3. Identifying missing ingredient documents:");
    const missingRefs = Array.from(allRefs).filter(ref => !existingIds.has(ref));

    console.log(`   Missing: ${missingRefs.length} ingredient documents`);

    if (missingRefs.length > 0) {
      console.log("   Missing ingredient IDs:");
      missingRefs.forEach(ref => {
        // Extract likely name from ID
        const likelyName = ref.replace('ingredient.', '').replace(/-/g, ' ');
        console.log(`     - ${ref} → likely name: "${likelyName}"`);
      });
    }

    console.log("\n4. Existing ingredient documents:");
    existingIngredients.forEach((ing: any) => {
      console.log(`   ✅ ${ing._id}: "${ing.name}"`);
    });

    console.log("\n5. Analysis Summary:");
    console.log("   ==================");
    console.log(`   - Total ingredient references in recipes: ${allRefs.size}`);
    console.log(`   - Existing ingredient documents: ${existingIngredients.length}`);
    console.log(`   - Missing ingredient documents: ${missingRefs.length}`);
    console.log("");
    console.log("   🎯 THE PROBLEM:");
    console.log("   The search isn't working because most ingredient references");
    console.log("   point to non-existent ingredient documents. The GROQ queries");
    console.log("   that use 'ingredientRef->name' return null for these missing docs.");
    console.log("");
    console.log("   💡 SOLUTIONS:");
    console.log("   1. Create the missing ingredient documents");
    console.log("   2. Modify search to work with ingredient reference IDs directly");
    console.log("   3. Add fallback search logic for missing references");

    // Generate ingredient documents that need to be created
    console.log("\n6. Suggested ingredient documents to create:");
    missingRefs.forEach(ref => {
      const likelyName = ref.replace('ingredient.', '').replace(/-/g, ' ');
      const capitalizedName = likelyName
        .split(' ')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join(' ');

      console.log(`   {`);
      console.log(`     "_id": "${ref}",`);
      console.log(`     "_type": "ingredient",`);
      console.log(`     "name": "${capitalizedName}"`);
      console.log(`   },`);
    });

  } catch (error) {
    console.error("❌ Error during analysis:", error);
  }
}

if (require.main === module) {
  analyzeMissingIngredients().catch(console.error);
}

export default analyzeMissingIngredients;