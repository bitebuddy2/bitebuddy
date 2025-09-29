#!/usr/bin/env npx tsx

/**
 * Comprehensive debug script to examine all ingredient data in the database
 * This will help understand the exact structure and content of ingredients
 */

import { client } from "../src/sanity/client";
import { groq } from "next-sanity";

// Get complete recipe data with detailed ingredient inspection
const getCompleteRecipeDataQuery = groq`
*[_type == "recipe"] {
  _id,
  title,
  "slug": slug.current,
  _createdAt,
  ingredients,
  "rawIngredients": ingredients[].items[]
}
`;

// Get all ingredient references
const getAllIngredientRefsQuery = groq`
*[_type == "ingredient"] {
  _id,
  name,
  synonyms,
  allergens
}
`;

async function comprehensiveIngredientDebug() {
  console.log("🔬 Comprehensive Ingredient Database Analysis");
  console.log("=============================================\n");

  try {
    // 1. Get all recipes with complete ingredient data
    console.log("1. Fetching complete recipe data...");
    const recipes = await client.fetch(getCompleteRecipeDataQuery);
    console.log(`   Found ${recipes.length} recipes in database\n`);

    // 2. Get all ingredient reference documents
    console.log("2. Fetching ingredient reference documents...");
    const ingredientRefs = await client.fetch(getAllIngredientRefsQuery);
    console.log(`   Found ${ingredientRefs.length} ingredient reference documents\n`);

    // 3. Analyze each recipe in detail
    console.log("3. Detailed recipe analysis:");
    console.log("   =============================");

    recipes.forEach((recipe: any, index: number) => {
      console.log(`\n   Recipe ${index + 1}: "${recipe.title}"`);
      console.log(`   Slug: ${recipe.slug}`);
      console.log(`   Created: ${new Date(recipe._createdAt).toISOString()}`);

      if (!recipe.ingredients || recipe.ingredients.length === 0) {
        console.log(`   ❌ No ingredients data`);
        return;
      }

      console.log(`   📊 Ingredients structure:`);

      // Analyze the ingredient groups
      recipe.ingredients.forEach((group: any, groupIndex: number) => {
        console.log(`     Group ${groupIndex + 1}:`);
        console.log(`       Heading: "${group.heading || 'No heading'}"`);

        if (!group.items || group.items.length === 0) {
          console.log(`       ❌ No items in this group`);
          return;
        }

        console.log(`       Items (${group.items.length}):`);
        group.items.forEach((item: any, itemIndex: number) => {
          console.log(`         ${itemIndex + 1}. ${item.quantity || ''} ${item.unit || ''}`);
          console.log(`            Text: "${item.ingredientText || 'No text'}"`);
          console.log(`            Ref ID: ${item.ingredientRef?._ref || 'No ref'}`);
          console.log(`            Notes: "${item.notes || 'No notes'}"`);
        });
      });

      // Analyze raw ingredients for easier access
      if (recipe.rawIngredients) {
        console.log(`   📋 Raw ingredients list (${recipe.rawIngredients.length} total):`);
        recipe.rawIngredients.forEach((item: any, index: number) => {
          const display = [
            item.quantity,
            item.unit,
            item.ingredientText || `[REF: ${item.ingredientRef?._ref}]`
          ].filter(Boolean).join(' ');
          console.log(`     - ${display}`);
        });
      }
    });

    // 4. Analyze ingredient text patterns
    console.log("\n\n4. Ingredient text pattern analysis:");
    console.log("   ==================================");

    const allIngredientTexts = new Set<string>();
    const allIngredientRefs = new Set<string>();

    recipes.forEach((recipe: any) => {
      if (recipe.rawIngredients) {
        recipe.rawIngredients.forEach((item: any) => {
          if (item.ingredientText) {
            allIngredientTexts.add(item.ingredientText);
          }
          if (item.ingredientRef?._ref) {
            allIngredientRefs.add(item.ingredientRef._ref);
          }
        });
      }
    });

    console.log(`   Found ${allIngredientTexts.size} unique ingredient texts:`);
    Array.from(allIngredientTexts).sort().forEach(text => {
      console.log(`     - "${text}"`);
    });

    console.log(`\n   Found ${allIngredientRefs.size} unique ingredient references:`);
    Array.from(allIngredientRefs).sort().forEach(ref => {
      const ingredientDoc = ingredientRefs.find((ing: any) => ing._id === ref);
      console.log(`     - ${ref} → "${ingredientDoc?.name || 'NOT FOUND'}"`);
    });

    // 5. Search term analysis
    console.log("\n\n5. Search term matching analysis:");
    console.log("   ===============================");

    const searchTerms = ["sausage meat", "egg", "thyme", "sausage", "meat"];

    searchTerms.forEach(term => {
      console.log(`\n   🔎 Analyzing matches for "${term}":`);

      // Check text matches
      const textMatches = Array.from(allIngredientTexts).filter(text =>
        text.toLowerCase().includes(term.toLowerCase())
      );

      // Check reference matches
      const refMatches = ingredientRefs.filter((ing: any) =>
        ing.name?.toLowerCase().includes(term.toLowerCase())
      );

      console.log(`     Text matches: ${textMatches.length > 0 ? textMatches.join(', ') : 'None'}`);
      console.log(`     Reference matches: ${refMatches.length > 0 ? refMatches.map((r: any) => r.name).join(', ') : 'None'}`);
    });

    // 6. Current query compatibility check
    console.log("\n\n6. Current query compatibility:");
    console.log("   =============================");
    console.log("   The current search implementation expects:");
    console.log("   - ingredients[].items[].ingredientText (string)");
    console.log("   - ingredients[].items[].ingredientRef->name (dereferenced)");
    console.log("");
    console.log("   Database structure analysis:");
    console.log(`   - ${recipes.length} recipes found`);
    console.log(`   - ${allIngredientTexts.size} ingredient texts found`);
    console.log(`   - ${allIngredientRefs.size} ingredient references found`);
    console.log(`   - ${ingredientRefs.length} ingredient documents found`);

  } catch (error) {
    console.error("❌ Error during analysis:", error);
  }
}

if (require.main === module) {
  comprehensiveIngredientDebug().catch(console.error);
}

export default comprehensiveIngredientDebug;