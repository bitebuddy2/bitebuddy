#!/usr/bin/env npx tsx

/**
 * Test the new improved search implementation
 */

import { client } from "../src/sanity/client";
import { recipesByIngredientNamesQuery } from "../src/sanity/queries";

async function testNewSearch() {
  console.log("🚀 Testing New Improved Search Implementation");
  console.log("============================================\n");

  // Test exact user input: "sausage meat, egg, thyme"
  const userInput = "sausage meat, egg, thyme";
  const searchTerms = userInput.split(",").map(s => s.trim()).filter(Boolean);

  console.log(`User searched for: "${userInput}"`);
  console.log(`Parsed search terms: [${searchTerms.map(t => `"${t}"`).join(", ")}]\n`);

  // Test new query
  console.log("1. Testing new recipesByIngredientNamesQuery...");
  try {
    const results = await client.fetch(recipesByIngredientNamesQuery, {
      names: searchTerms,
      namesLower: searchTerms.map(name => name.toLowerCase()),
      searchPattern: `*(${searchTerms.map(name => name.toLowerCase()).join("|")})*`
    });
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
    console.error("   Full error:", JSON.stringify(error, null, 2));
  }

  // Test case variations
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
      const results = await client.fetch(recipesByIngredientNamesQuery, {
        names: variation,
        namesLower: variation.map(name => name.toLowerCase()),
        searchPattern: `*(${variation.map(name => name.toLowerCase()).join("|")})*`
      });
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
      const results = await client.fetch(recipesByIngredientNamesQuery, {
        names: [term],
        namesLower: [term.toLowerCase()],
        searchPattern: `*${term.toLowerCase()}*`
      });
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

  // Test partial matching
  console.log("\n4. Testing partial matching...");
  const partialTests = [
    ["sausage"],          // Should match "sausage meat"
    ["meat"],             // Should match "sausage meat"
    ["eggs"],             // Should NOT match "egg" (different word)
    ["sage"],             // Should match "sage"
  ];

  for (const [index, testTerms] of partialTests.entries()) {
    console.log(`   Testing partial match ${index + 1}: [${testTerms.map(t => `"${t}"`).join(", ")}]`);
    try {
      const results = await client.fetch(recipesByIngredientNamesQuery, {
        names: testTerms,
        namesLower: testTerms.map(name => name.toLowerCase()),
        searchPattern: `*(${testTerms.map(name => name.toLowerCase()).join("|")})*`
      });
      console.log(`     → ${results.length} results`);
      if (results.length > 0) {
        results.forEach((recipe: any) => {
          console.log(`       - ${recipe.title}`);
          console.log(`         Matched: ${recipe.matched.map((m: any) => m.name).filter(Boolean).join(", ")}`);
        });
      }
    } catch (error) {
      console.log(`     → Error: ${error}`);
    }
  }

  console.log("\n✅ New Implementation Analysis:");
  console.log("==============================");
  console.log("The new query should provide:");
  console.log("1. Case-insensitive matching");
  console.log("2. Dynamic partial matching (both directions)");
  console.log("3. No hardcoded ingredient patterns");
  console.log("4. Better match scoring");
}

if (require.main === module) {
  testNewSearch().catch(console.error);
}

export default testNewSearch;