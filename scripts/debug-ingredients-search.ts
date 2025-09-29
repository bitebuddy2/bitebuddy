#!/usr/bin/env npx tsx

/**
 * Debug script to investigate ingredient search issues
 * This script will:
 * 1. Check what ingredients exist in the database (both text and referenced)
 * 2. Test the current search query with specific terms
 * 3. Help identify why search isn't working
 */

import { client } from "../src/sanity/client";
import { groq } from "next-sanity";

// Get all ingredients from all recipes
const getAllIngredientsQuery = groq`
*[_type == "recipe" && defined(ingredients)] {
  title,
  "slug": slug.current,
  "ingredientData": ingredients[].items[]{
    quantity,
    unit,
    ingredientText,
    "ingredientRefName": ingredientRef->name,
    "ingredientRefId": ingredientRef->_id
  }
}
`;

// Get all standalone ingredient documents
const getAllIngredientDocsQuery = groq`
*[_type == "ingredient"] {
  _id,
  name,
  synonyms
}
`;

// Test current search query
const testCurrentSearchQuery = groq`
*[_type == "recipe" && defined(ingredients)] {
  "slug": slug.current,
  title,

  // Get all ingredient names for debugging
  "allIngredients": ingredients[].items[]{
    "text": ingredientText,
    "ref": ingredientRef->name
  },

  // Current hardcoded partial matching logic
  "matched": ingredients[].items[
    (defined(ingredientText) && (
      ingredientText in $names
      || ingredientText match "*sausage*" && "sausage" in $names
      || ingredientText match "*egg*" && "egg" in $names
      || ingredientText match "*thyme*" && "thyme" in $names
      || ingredientText match "*meat*" && "meat" in $names
    ))
    || (defined(ingredientRef->name) && (
      ingredientRef->name in $names
      || ingredientRef->name match "*sausage*" && "sausage" in $names
      || ingredientRef->name match "*egg*" && "egg" in $names
      || ingredientRef->name match "*thyme*" && "thyme" in $names
      || ingredientRef->name match "*meat*" && "meat" in $names
    ))
  ]{
    "name": coalesce(ingredientRef->name, ingredientText)
  },

  "totalMatches": count(ingredients[].items[
    (defined(ingredientText) && (
      ingredientText in $names
      || ingredientText match "*sausage*" && "sausage" in $names
      || ingredientText match "*egg*" && "egg" in $names
      || ingredientText match "*thyme*" && "thyme" in $names
      || ingredientText match "*meat*" && "meat" in $names
    ))
    || (defined(ingredientRef->name) && (
      ingredientRef->name in $names
      || ingredientRef->name match "*sausage*" && "sausage" in $names
      || ingredientRef->name match "*egg*" && "egg" in $names
      || ingredientRef->name match "*thyme*" && "thyme" in $names
      || ingredientRef->name match "*meat*" && "meat" in $names
    ))
  ])
} | order(totalMatches desc, _createdAt desc)[totalMatches > 0]
`;

async function debugIngredientSearch() {
  console.log("🔍 Debugging Ingredient Search Issues");
  console.log("=====================================\n");

  // 1. Get all ingredients used in recipes
  console.log("1. Fetching all ingredients from recipes...");
  const recipeIngredients = await client.fetch(getAllIngredientsQuery);

  // Flatten and analyze ingredients
  const allIngredients = recipeIngredients.flatMap((recipe: any) =>
    recipe.ingredientData.map((ing: any) => ({
      recipe: recipe.title,
      recipeSlug: recipe.slug,
      text: ing.ingredientText,
      refName: ing.ingredientRefName,
      refId: ing.ingredientRefId,
      quantity: ing.quantity,
      unit: ing.unit
    }))
  );

  console.log(`   Found ${allIngredients.length} ingredient entries across ${recipeIngredients.length} recipes`);

  // Group by ingredient name/text
  const ingredientsByName = new Map<string, any[]>();
  allIngredients.forEach(ing => {
    const name = ing.refName || ing.text || 'Unknown';
    if (!ingredientsByName.has(name)) {
      ingredientsByName.set(name, []);
    }
    ingredientsByName.get(name)!.push(ing);
  });

  console.log(`   Found ${ingredientsByName.size} unique ingredient names\n`);

  // 2. Get standalone ingredient documents
  console.log("2. Fetching standalone ingredient documents...");
  const ingredientDocs = await client.fetch(getAllIngredientDocsQuery);
  console.log(`   Found ${ingredientDocs.length} ingredient documents\n`);

  // 3. Check for the problematic search terms
  const searchTerms = ["sausage meat", "egg", "thyme"];
  console.log("3. Checking for problematic search terms:");
  console.log(`   Searching for: ${searchTerms.join(", ")}\n`);

  searchTerms.forEach(term => {
    console.log(`   🔎 Looking for "${term}":`);

    // Check exact matches
    const exactMatches = Array.from(ingredientsByName.keys())
      .filter(name => name.toLowerCase() === term.toLowerCase());

    // Check partial matches
    const partialMatches = Array.from(ingredientsByName.keys())
      .filter(name => name.toLowerCase().includes(term.toLowerCase()));

    console.log(`      Exact matches: ${exactMatches.length > 0 ? exactMatches.join(", ") : "None"}`);
    console.log(`      Partial matches: ${partialMatches.length > 0 ? partialMatches.join(", ") : "None"}`);

    if (partialMatches.length > 0) {
      console.log(`      Found in recipes:`);
      partialMatches.forEach(match => {
        const recipes = [...new Set(ingredientsByName.get(match)!.map(ing => ing.recipe))];
        console.log(`        "${match}" → ${recipes.join(", ")}`);
      });
    }
    console.log("");
  });

  // 4. Test current search query
  console.log("4. Testing current search query with problematic terms...");
  const testResults = await client.fetch(testCurrentSearchQuery, { names: searchTerms });

  console.log(`   Current query returned ${testResults.length} results`);

  if (testResults.length > 0) {
    testResults.forEach((recipe: any) => {
      console.log(`     📝 ${recipe.title}`);
      console.log(`        All ingredients: ${recipe.allIngredients.map((ing: any) => ing.text || ing.ref).filter(Boolean).join(", ")}`);
      console.log(`        Matched: ${recipe.matched.map((m: any) => m.name).join(", ")} (${recipe.totalMatches} matches)`);
      console.log("");
    });
  } else {
    console.log("     ❌ No results found with current query");
  }

  // 5. Show all ingredient names for manual inspection
  console.log("5. All unique ingredient names in database:");
  console.log("   (This will help identify exact naming patterns)");
  const sortedNames = Array.from(ingredientsByName.keys()).sort();
  sortedNames.forEach((name, index) => {
    if (index < 50) { // Limit output for readability
      console.log(`   - ${name}`);
    }
  });
  if (sortedNames.length > 50) {
    console.log(`   ... and ${sortedNames.length - 50} more`);
  }

  console.log("\n🎯 Analysis Summary:");
  console.log("===================");
  console.log("The current query uses hardcoded pattern matching which only works for");
  console.log("specific terms. The search terms need to be dynamically matched against");
  console.log("actual ingredient names in the database.");
}

if (require.main === module) {
  debugIngredientSearch().catch(console.error);
}

export default debugIngredientSearch;