#!/usr/bin/env npx tsx

/**
 * Create a fallback search solution that works with missing ingredient documents
 * by matching against ingredient reference IDs directly
 */

import { client } from "../src/sanity/client";
import { groq } from "next-sanity";

// Enhanced search query that works with both existing docs and missing references
const enhancedSearchQuery = groq`
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

  // Get all ingredient data for debugging
  "allIngredients": ingredients[].items[]{
    "text": ingredientText,
    "refName": ingredientRef->name,
    "refId": ingredientRef._ref,
    quantity,
    unit
  },

  // Enhanced matching that works with missing ingredient documents
  "matched": ingredients[].items[
    // Match ingredientText field
    (defined(ingredientText) && (
      lower(ingredientText) in $namesLower ||
      lower(ingredientText) match $searchPattern
    ))
    ||
    // Match ingredientRef->name field (when document exists)
    (defined(ingredientRef->name) && (
      lower(ingredientRef->name) in $namesLower ||
      lower(ingredientRef->name) match $searchPattern
    ))
    ||
    // FALLBACK: Match ingredient reference ID directly for missing documents
    (defined(ingredientRef._ref) && (
      $searchTermsWithIds[ingredientRef._ref] == true
    ))
  ]{
    "name": coalesce(ingredientRef->name, ingredientText, ingredientRef._ref),
    "refId": ingredientRef._ref
  },

  "totalMatches": count(ingredients[].items[
    // Match ingredientText field
    (defined(ingredientText) && (
      lower(ingredientText) in $namesLower ||
      lower(ingredientText) match $searchPattern
    ))
    ||
    // Match ingredientRef->name field (when document exists)
    (defined(ingredientRef->name) && (
      lower(ingredientRef->name) in $namesLower ||
      lower(ingredientRef->name) match $searchPattern
    ))
    ||
    // FALLBACK: Match ingredient reference ID directly for missing documents
    (defined(ingredientRef._ref) && (
      $searchTermsWithIds[ingredientRef._ref] == true
    ))
  ])
} | order(totalMatches desc, _createdAt desc)[totalMatches > 0]
`;

function createSearchTermMap(searchTerms: string[]): Record<string, boolean> {
  const map: Record<string, boolean> = {};

  searchTerms.forEach(term => {
    const normalizedTerm = term.toLowerCase().trim();

    // Create potential ingredient IDs for common patterns
    const patterns = [
      `ingredient.${normalizedTerm.replace(/\s+/g, '-')}`,  // "sausage meat" → "ingredient.sausage-meat"
      `ingredient.${normalizedTerm.replace(/\s+/g, '')}`,   // "sausage meat" → "ingredient.sausagemeat"
      `ingredient.${normalizedTerm.replace(/\s+/g, '_')}`,  // "sausage meat" → "ingredient.sausage_meat"
    ];

    patterns.forEach(pattern => {
      map[pattern] = true;
    });
  });

  return map;
}

async function testFallbackSearch() {
  console.log("🔄 Testing Fallback Search Solution");
  console.log("===================================\n");

  const searchTerms = ["sausage meat", "egg", "thyme"];

  console.log("1. Creating search parameters...");
  const names = searchTerms;
  const namesLower = names.map(name => name.toLowerCase());
  const searchPattern = `*(${names.map(name => name.toLowerCase()).join("|")})*`;
  const searchTermsWithIds = createSearchTermMap(searchTerms);

  console.log(`   Names: [${names.join(", ")}]`);
  console.log(`   Search pattern: "${searchPattern}"`);
  console.log(`   ID mappings:`);
  Object.keys(searchTermsWithIds).forEach(id => {
    console.log(`     - ${id}`);
  });

  console.log("\n2. Testing enhanced search query...");

  try {
    const results = await client.fetch(enhancedSearchQuery, {
      names,
      namesLower,
      searchPattern,
      searchTermsWithIds
    });

    console.log(`   Results: ${results.length} recipes found`);

    if (results.length > 0) {
      results.forEach((recipe: any) => {
        console.log(`\n   📝 ${recipe.title}`);
        console.log(`      Total matches: ${recipe.totalMatches}`);
        console.log(`      Matched ingredients:`);

        recipe.matched.forEach((match: any) => {
          console.log(`        - ${match.name} ${match.refId ? `(${match.refId})` : ''}`);
        });

        console.log(`      All ingredients:`);
        recipe.allIngredients.forEach((ing: any, index: number) => {
          const name = ing.refName || ing.text || `[${ing.refId}]`;
          console.log(`        ${index + 1}. ${ing.quantity || ''} ${ing.unit || ''} ${name}`);
        });
      });
    } else {
      console.log("     ❌ No results found");
    }

    // 3. Verify the recipe contains expected ingredients by ID
    console.log("\n3. Verifying ingredient references in Greggs recipe...");
    const recipeCheck = await client.fetch(groq`
      *[_type == "recipe" && slug.current == "greggs-sausage-roll-homemade-copycat"][0] {
        title,
        "ingredientRefs": ingredients[].items[].ingredientRef._ref
      }
    `);

    if (recipeCheck) {
      console.log(`   Recipe: ${recipeCheck.title}`);
      console.log(`   Ingredient references:`);
      recipeCheck.ingredientRefs.forEach((ref: string) => {
        const isTarget = Object.keys(searchTermsWithIds).includes(ref);
        console.log(`     ${isTarget ? '🎯' : '  '} ${ref}`);
      });
    }

  } catch (error) {
    console.error("❌ Error testing fallback search:", error);
  }
}

if (require.main === module) {
  testFallbackSearch().catch(console.error);
}

export default testFallbackSearch;