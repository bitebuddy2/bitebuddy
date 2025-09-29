#!/usr/bin/env npx tsx

/**
 * Final comprehensive test of the search functionality
 */

import { client } from "../src/sanity/client";
import { groq } from "next-sanity";

async function finalSearchTest() {
  console.log("🎯 Final Search Functionality Test");
  console.log("==================================\n");

  try {
    // 1. Verify all ingredients exist
    console.log("1. Verifying ingredient documents exist...");
    const ingredients = await client.fetch(groq`*[_type == "ingredient"] { _id, name }`);
    console.log(`   Found ${ingredients.length} ingredient documents`);

    const targetIngredients = ["sausage meat", "egg", "thyme"];
    const foundIngredients = ingredients.filter((ing: any) =>
      targetIngredients.some(target =>
        ing.name.toLowerCase().includes(target.toLowerCase())
      )
    );

    console.log(`   Target ingredients found: ${foundIngredients.length}/3`);
    foundIngredients.forEach((ing: any) => {
      console.log(`     ✅ ${ing.name} (${ing._id})`);
    });

    // 2. Test search page functionality exactly as the page does it
    console.log("\n2. Testing search page functionality...");
    const names = ["sausage meat", "egg", "thyme"];
    const namesLower = names.map(name => name.toLowerCase());
    const searchPattern = `*(${names.map(name => name.toLowerCase()).join("|")})*`;

    console.log(`   Search parameters:`);
    console.log(`     names: [${names.join(", ")}]`);
    console.log(`     namesLower: [${namesLower.join(", ")}]`);
    console.log(`     searchPattern: "${searchPattern}"`);

    const searchPageQuery = groq`
      *[_type == "recipe" && defined(ingredients)] {
        "slug": slug.current,
        title,
        introText,
        servings, prepMin, cookMin, ratingSum, ratingCount,
        brand->{
          title,
          "slug": slug.current,
          logo{ asset->{ url, metadata{ lqip } }, alt }
        },
        heroImage{ asset->{ url, metadata{ lqip, dimensions } }, alt },

        // Get all ingredient names for debugging
        "allIngredients": ingredients[].items[]{
          "text": ingredientText,
          "ref": ingredientRef->name
        },

        // Simplified dynamic matching that works reliably
        "matched": ingredients[].items[
          // Check ingredientText field
          (defined(ingredientText) && (
            lower(ingredientText) in $namesLower ||
            lower(ingredientText) match $searchPattern
          ))
          ||
          // Check ingredientRef->name field
          (defined(ingredientRef->name) && (
            lower(ingredientRef->name) in $namesLower ||
            lower(ingredientRef->name) match $searchPattern
          ))
        ]{
          "name": coalesce(ingredientRef->name, ingredientText)
        },

        "totalMatches": count(ingredients[].items[
          // Check ingredientText field
          (defined(ingredientText) && (
            lower(ingredientText) in $namesLower ||
            lower(ingredientText) match $searchPattern
          ))
          ||
          // Check ingredientRef->name field
          (defined(ingredientRef->name) && (
            lower(ingredientRef->name) in $namesLower ||
            lower(ingredientRef->name) match $searchPattern
          ))
        ])
      } | order(totalMatches desc, _createdAt desc)[totalMatches > 0]
    `;

    const searchResults = await client.fetch(searchPageQuery, {
      names,
      namesLower,
      searchPattern
    });

    console.log(`   Results: ${searchResults.length} recipes found`);

    if (searchResults.length > 0) {
      searchResults.forEach((recipe: any) => {
        console.log(`     📝 ${recipe.title}`);
        console.log(`        Total matches: ${recipe.totalMatches}`);
        console.log(`        Matched ingredients: ${recipe.matched.map((m: any) => m.name).join(", ")}`);
        console.log(`        All ingredients: ${recipe.allIngredients.map((ing: any) => ing.ref || ing.text).filter(Boolean).join(", ")}`);
      });
    } else {
      console.log("     ❌ No results found");
    }

    // 3. Test API route query
    console.log("\n3. Testing API route query...");
    const apiQuery = groq`
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

    const term = "sausage meat|egg|thyme";
    console.log(`   Search term: "${term}"`);

    const apiResults = await client.fetch(apiQuery, { term });
    console.log(`   Results: ${apiResults.length} recipes found`);

    if (apiResults.length > 0) {
      apiResults.forEach((recipe: any) => {
        console.log(`     📝 ${recipe.title}`);
      });
    } else {
      console.log("     ❌ No results found with API query");
    }

    // 4. Test individual search terms
    console.log("\n4. Testing individual search terms...");

    for (const term of targetIngredients) {
      console.log(`\n   Testing "${term}":`);

      const singleTermQuery = groq`
        *[_type == "recipe" &&
          count(ingredients[].items[
            (defined(ingredientText) && lower(ingredientText) match $pattern) ||
            (defined(ingredientRef->name) && lower(ingredientRef->name) match $pattern)
          ]) > 0
        ] {
          title,
          "matchedIngredients": ingredients[].items[
            (defined(ingredientText) && lower(ingredientText) match $pattern) ||
            (defined(ingredientRef->name) && lower(ingredientRef->name) match $pattern)
          ] {
            "name": coalesce(ingredientRef->name, ingredientText)
          }
        }
      `;

      const pattern = `*${term.toLowerCase()}*`;
      const singleResults = await client.fetch(singleTermQuery, { pattern });

      console.log(`     Results: ${singleResults.length} recipes`);
      singleResults.forEach((recipe: any) => {
        console.log(`       - ${recipe.title}: ${recipe.matchedIngredients.map((m: any) => m.name).join(", ")}`);
      });
    }

    console.log("\n🎉 Search functionality test complete!");

  } catch (error) {
    console.error("❌ Error during final test:", error);
  }
}

if (require.main === module) {
  finalSearchTest().catch(console.error);
}

export default finalSearchTest;