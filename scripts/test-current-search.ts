#!/usr/bin/env npx tsx

/**
 * Test the current search implementation to understand why it's not working
 * for the user's search terms
 */

import { client } from "../src/sanity/client";
import { recipesByIngredientNamesQuery } from "../src/sanity/queries";

async function testCurrentSearch() {
  console.log("🧪 Testing Current Search Implementation");
  console.log("======================================\n");

  // Test exact user input: "sausage meat, egg, thyme"
  const userInput = "sausage meat, egg, thyme";
  const searchTerms = userInput.split(",").map(s => s.trim()).filter(Boolean);

  console.log(`User searched for: "${userInput}"`);
  console.log(`Parsed search terms: [${searchTerms.map(t => `"${t}"`).join(", ")}]\n`);

  // Test current query
  console.log("1. Testing current recipesByIngredientNamesQuery...");
  try {
    const results = await client.fetch(recipesByIngredientNamesQuery, { names: searchTerms });
    console.log(`   Query returned: ${results.length} results\n`);

    if (results.length > 0) {
      results.forEach((recipe: any, index: number) => {
        console.log(`   Recipe ${index + 1}: ${recipe.title}`);
        console.log(`     Slug: ${recipe.slug}`);
        console.log(`     All ingredients: ${recipe.allIngredients.map((ing: any) => ing.text || ing.ref).filter(Boolean).join(", ")}`);
        console.log(`     Matched ingredients: ${recipe.matched.map((m: any) => m.name).filter(Boolean).join(", ")}`);
        console.log(`     Total matches: ${recipe.totalMatches}`);
        console.log("");
      });
    } else {
      console.log("   ❌ No results found!\n");
    }
  } catch (error) {
    console.error("   ❌ Query failed:", error);
  }

  // Let's also test case variations
  console.log("2. Testing case sensitivity...");
  const caseVariations = [
    ["sausage meat", "egg", "thyme"],           // lowercase
    ["Sausage meat", "Egg", "Thyme"],           // title case
    ["SAUSAGE MEAT", "EGG", "THYME"],           // uppercase
    ["Sausage Meat", "egg", "THYME"]            // mixed case
  ];

  for (const [index, variation] of caseVariations.entries()) {
    console.log(`   Testing variation ${index + 1}: [${variation.map(t => `"${t}"`).join(", ")}]`);
    try {
      const results = await client.fetch(recipesByIngredientNamesQuery, { names: variation });
      console.log(`     → ${results.length} results`);
    } catch (error) {
      console.log(`     → Error: ${error}`);
    }
  }

  // Test individual terms
  console.log("\n3. Testing individual search terms...");
  for (const term of searchTerms) {
    console.log(`   Testing "${term}" alone...`);
    try {
      const results = await client.fetch(recipesByIngredientNamesQuery, { names: [term] });
      console.log(`     → ${results.length} results`);
      if (results.length > 0) {
        results.forEach((recipe: any) => {
          console.log(`       - ${recipe.title} (${recipe.totalMatches} matches)`);
        });
      }
    } catch (error) {
      console.log(`     → Error: ${error}`);
    }
  }

  console.log("\n🔍 Issues Identified:");
  console.log("===================");
  console.log("1. Current query should be working based on our data");
  console.log("2. The hardcoded pattern matching is the main limitation");
  console.log("3. Need to implement dynamic pattern matching for scalability");
}

if (require.main === module) {
  testCurrentSearch().catch(console.error);
}

export default testCurrentSearch;