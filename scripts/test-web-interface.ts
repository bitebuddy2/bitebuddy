#!/usr/bin/env npx tsx

/**
 * Test the web interface search functionality by simulating the exact
 * parameters that would be passed from the search page
 */

import { client } from "../src/sanity/client";
import { recipesByIngredientNamesQuery } from "../src/sanity/queries";

async function testWebInterface() {
  console.log("🌐 Testing Web Interface Search Functionality");
  console.log("=============================================\n");

  // Simulate the exact parseNames function from the search page
  function parseNames(q?: string): string[] {
    return (q || "")
      .split(",")
      .map(s => s.trim())
      .filter(Boolean);
  }

  // Test the exact search the user was trying: "sausage meat, egg, thyme"
  const userQuery = "sausage meat, egg, thyme";
  const names = parseNames(userQuery);
  const hasQuery = names.length > 0;

  console.log(`User query: "${userQuery}"`);
  console.log(`Parsed names: [${names.map(n => `"${n}"`).join(", ")}]`);
  console.log(`Has query: ${hasQuery}\n`);

  if (hasQuery) {
    // Use the exact same parameters as the search page
    const searchParams = {
      names,
      namesLower: names.map(name => name.toLowerCase()),
      searchPattern: `*(${names.map(name => name.toLowerCase()).join("|")})*`
    };

    console.log("Search parameters:");
    console.log(`  names: [${searchParams.names.map(n => `"${n}"`).join(", ")}]`);
    console.log(`  namesLower: [${searchParams.namesLower.map(n => `"${n}"`).join(", ")}]`);
    console.log(`  searchPattern: "${searchParams.searchPattern}"\n`);

    try {
      const data = await client.fetch(recipesByIngredientNamesQuery, searchParams);
      const recipes = (data as any) || [];

      console.log(`✅ Query successful! Found ${recipes.length} recipes\n`);

      if (recipes.length > 0) {
        recipes.forEach((recipe: any, index: number) => {
          console.log(`Recipe ${index + 1}: ${recipe.title}`);
          console.log(`  Slug: ${recipe.slug}`);
          console.log(`  Total matches: ${recipe.totalMatches}`);
          console.log(`  Matched ingredients: ${recipe.matched.map((m: any) => m.name).join(", ")}`);
          console.log(`  All ingredients: ${recipe.allIngredients.map((ing: any) => ing.text || ing.ref).filter(Boolean).join(", ")}`);
          if (recipe.brand?.title) {
            console.log(`  Brand: ${recipe.brand.title}`);
          }
          console.log("");
        });
      }

      console.log("🎉 SUCCESS: The user's search 'sausage meat, egg, thyme' should now work!");
      console.log("The search will find recipes containing ANY of those ingredients.");
      console.log("Recipes with more matching ingredients will appear first.");

    } catch (error) {
      console.error("❌ Query failed:", error);
    }
  }

  // Test a few more edge cases
  console.log("\n🧪 Testing additional cases:");
  console.log("==============================");

  const testCases = [
    "chicken",                    // Single ingredient
    "chicken, beef",              // Two ingredients
    "nonexistent ingredient",     // Should return no results
    "SAUSAGE MEAT",              // Uppercase
    "sausage",                   // Partial match
    "Egg, Milk"                  // Mixed case
  ];

  for (const testCase of testCases) {
    const testNames = parseNames(testCase);
    console.log(`\nTesting: "${testCase}"`);

    try {
      const testResults = await client.fetch(recipesByIngredientNamesQuery, {
        names: testNames,
        namesLower: testNames.map(name => name.toLowerCase()),
        searchPattern: `*(${testNames.map(name => name.toLowerCase()).join("|")})*`
      });

      console.log(`  → ${testResults.length} results`);
      if (testResults.length > 0) {
        testResults.slice(0, 2).forEach((recipe: any) => {
          console.log(`    - ${recipe.title} (${recipe.totalMatches} matches)`);
        });
      }
    } catch (error) {
      console.log(`  → Error: ${error}`);
    }
  }
}

if (require.main === module) {
  testWebInterface().catch(console.error);
}

export default testWebInterface;