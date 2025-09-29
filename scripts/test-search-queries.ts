#!/usr/bin/env npx tsx

/**
 * Test the current search queries to understand what's happening
 */

import { client } from "../src/sanity/client";
import { groq } from "next-sanity";
import { recipesByIngredientNamesQuery } from "../src/sanity/queries";

// Test the API route search query (corrected syntax)
const apiSearchQuery = groq`
  *[
    _type == "recipe" &&
    (
      count(ingredients[].items[defined(ingredientRef->name) && ingredientRef->name match $term]) > 0 ||
      count(ingredients[].items[defined(ingredientText) && ingredientText match $term]) > 0
    )
  ]{
    title,
    "slug": slug.current,
    heroImage
  } | order(_createdAt desc)[0...24]
`;

// Test with dereferenced ingredients
const dereferencedSearchQuery = groq`
*[_type == "recipe" && defined(ingredients)] {
  title,
  "slug": slug.current,
  "allIngredients": ingredients[].items[]{
    "text": ingredientText,
    "refName": ingredientRef->name,
    "refId": ingredientRef->_id,
    quantity,
    unit
  },
  "searchDebug": {
    "hasIngredientText": count(ingredients[].items[defined(ingredientText)]) > 0,
    "hasIngredientRefs": count(ingredients[].items[defined(ingredientRef)]) > 0,
    "totalItems": count(ingredients[].items[])
  }
}
`;

// Test pattern matching
const patternTestQuery = groq`
*[_type == "recipe" && defined(ingredients)] {
  title,
  "slug": slug.current,
  "testMatches": {
    "sausageInText": count(ingredients[].items[ingredientText match "*sausage*"]) > 0,
    "sausageInRef": count(ingredients[].items[ingredientRef->name match "*sausage*"]) > 0,
    "eggInText": count(ingredients[].items[ingredientText match "*egg*"]) > 0,
    "eggInRef": count(ingredients[].items[ingredientRef->name match "*egg*"]) > 0,
    "thymeInText": count(ingredients[].items[ingredientText match "*thyme*"]) > 0,
    "thymeInRef": count(ingredients[].items[ingredientRef->name match "*thyme*"]) > 0
  }
}
`;

async function testSearchQueries() {
  console.log("🧪 Testing Search Queries");
  console.log("========================\n");

  const searchTerms = ["sausage meat", "egg", "thyme"];

  try {
    // 1. Test the API route query
    console.log("1. Testing API route query:");
    console.log("   Query: API search endpoint format");

    // Support multiple ingredients: "chicken, thyme" → "chicken|thyme"
    const parts = "sausage meat, egg, thyme".split(",").map((s) => s.trim()).filter(Boolean);
    const term = parts.length ? parts.join("|") : "sausage meat, egg, thyme";
    console.log(`   Search term: "${term}"`);

    const apiResults = await client.fetch(apiSearchQuery, { term });
    console.log(`   Results: ${apiResults.length} recipes found`);

    if (apiResults.length > 0) {
      apiResults.forEach((recipe: any) => {
        console.log(`     - ${recipe.title}`);
      });
    } else {
      console.log("     (No results)");
    }

    // 2. Test the search page query
    console.log("\n2. Testing search page query:");
    console.log("   Query: recipesByIngredientNamesQuery");

    const names = searchTerms;
    const namesLower = names.map(name => name.toLowerCase());
    const searchPattern = `*(${names.map(name => name.toLowerCase()).join("|")})*`;

    console.log(`   Names: [${names.join(", ")}]`);
    console.log(`   Names Lower: [${namesLower.join(", ")}]`);
    console.log(`   Search Pattern: "${searchPattern}"`);

    const searchPageResults = await client.fetch(recipesByIngredientNamesQuery, {
      names,
      namesLower,
      searchPattern
    });

    console.log(`   Results: ${searchPageResults.length} recipes found`);

    if (searchPageResults.length > 0) {
      searchPageResults.forEach((recipe: any) => {
        console.log(`     - ${recipe.title} (${recipe.totalMatches} matches)`);
        if (recipe.matched && recipe.matched.length > 0) {
          console.log(`       Matched: ${recipe.matched.map((m: any) => m.name).join(", ")}`);
        }
      });
    } else {
      console.log("     (No results)");
    }

    // 3. Test dereferenced query to see what's available
    console.log("\n3. Testing dereferenced ingredient data:");
    const dereferencedResults = await client.fetch(dereferencedSearchQuery);

    dereferencedResults.forEach((recipe: any) => {
      console.log(`   Recipe: ${recipe.title}`);
      console.log(`     Debug: ${JSON.stringify(recipe.searchDebug, null, 6)}`);
      console.log(`     Ingredients:`);

      recipe.allIngredients.forEach((ing: any, index: number) => {
        console.log(`       ${index + 1}. ${ing.quantity || ''} ${ing.unit || ''} ${ing.refName || ing.text || '[No name]'}`);
      });
    });

    // 4. Test pattern matching
    console.log("\n4. Testing pattern matching:");
    const patternResults = await client.fetch(patternTestQuery);

    patternResults.forEach((recipe: any) => {
      console.log(`   Recipe: ${recipe.title}`);
      console.log(`     Pattern matches: ${JSON.stringify(recipe.testMatches, null, 6)}`);
    });

    // 5. Manual check - what ingredient documents exist?
    console.log("\n5. Checking ingredient documents:");
    const ingredientDocs = await client.fetch(groq`*[_type == "ingredient"] { _id, name }`);
    console.log(`   Found ${ingredientDocs.length} ingredient documents:`);
    ingredientDocs.forEach((ing: any) => {
      console.log(`     - ${ing._id}: "${ing.name}"`);
    });

    // 6. Check if there are any recipes that would match with proper dereferencing
    console.log("\n6. Testing if sausage meat reference exists:");
    const sausageMeatTest = await client.fetch(groq`
      *[_type == "recipe" && count(ingredients[].items[ingredientRef._ref == "ingredient.sausage-meat"]) > 0] {
        title,
        "sausageIngredients": ingredients[].items[ingredientRef._ref == "ingredient.sausage-meat"]
      }
    `);

    console.log(`   Recipes with sausage-meat reference: ${sausageMeatTest.length}`);
    sausageMeatTest.forEach((recipe: any) => {
      console.log(`     - ${recipe.title}: ${recipe.sausageIngredients.length} sausage-meat refs`);
    });

  } catch (error) {
    console.error("❌ Error during search testing:", error);
  }
}

if (require.main === module) {
  testSearchQueries().catch(console.error);
}

export default testSearchQueries;