// Test the fixed frontend fetch logic
import { client } from '../src/sanity/client';
import { recipesByIngredientNamesQuery } from '../src/sanity/queries';

// Parse function from search page
function parseNames(q?: string): string[] {
  return (q || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

async function testFixedFrontend() {
  console.log('🔍 Testing FIXED Frontend Logic');

  // Simulate the exact URL parameter
  const searchParamsQ = "sausage meat, egg, thyme";

  const names = parseNames(searchParamsQ);
  const hasQuery = names.length > 0;

  console.log('1. searchParams.q:', JSON.stringify(searchParamsQ));
  console.log('2. parsed names:', names);
  console.log('3. hasQuery:', hasQuery);

  // NEW FIXED VERSION - direct query result, not data.recipes
  const recipes = hasQuery
    ? await client.fetch(recipesByIngredientNamesQuery, {
        names,
        namesLower: names.map(name => name.toLowerCase()),
        searchPattern: `*(${names.map(name => name.toLowerCase()).join("|")})*`
      })
    : [];

  console.log('4. recipes returned:', recipes.length);

  if (recipes.length > 0) {
    console.log('✅ SUCCESS! Recipe found:');
    console.log('   title:', recipes[0].title);
    console.log('   slug:', recipes[0].slug);
    console.log('   totalMatches:', recipes[0].totalMatches);
    console.log('   matched ingredients:', recipes[0].matched?.map((m: any) => m.name).join(', '));

    console.log('\n5. Display tags would be:');
    names.forEach((name, i) => {
      console.log(`   "${name}"`);
    });
  } else {
    console.log('❌ No recipes found');
  }
}

testFixedFrontend().catch(console.error);