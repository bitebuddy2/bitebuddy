// Test the exact same fetch as frontend
import { client } from '../src/sanity/client';
import { recipesByIngredientNamesQuery } from '../src/sanity/queries';

// Parse function from search page
function parseNames(q?: string): string[] {
  return (q || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

async function testFrontendFetch() {
  console.log('🔍 Testing Frontend Fetch Logic');

  // Simulate the exact URL parameter
  const searchParamsQ = "sausage meat, egg, thyme";

  const names = parseNames(searchParamsQ);
  const hasQuery = names.length > 0;

  console.log('1. searchParams.q:', JSON.stringify(searchParamsQ));
  console.log('2. parsed names:', names);
  console.log('3. hasQuery:', hasQuery);
  console.log('4. names for display:', names.map((n, i) => `"${n}"`).join(', '));

  if (hasQuery) {
    const data = await client.fetch(recipesByIngredientNamesQuery, {
      names,
      namesLower: names.map(name => name.toLowerCase()),
      searchPattern: `*(${names.map(name => name.toLowerCase()).join("|")})*`
    });

    console.log('5. Query parameters sent:');
    console.log('   names:', names);
    console.log('   namesLower:', names.map(name => name.toLowerCase()));
    console.log('   searchPattern:', `*(${names.map(name => name.toLowerCase()).join("|")})*`);

    const recipes = (data as any).recipes || [];
    console.log('6. recipes returned:', recipes.length);

    if (recipes.length > 0) {
      console.log('7. First recipe:');
      console.log('   title:', recipes[0].title);
      console.log('   slug:', recipes[0].slug);
      console.log('   matches:', recipes[0].matched?.length || 0);
      console.log('   matched ingredients:', recipes[0].matched?.map((m: any) => m.name).join(', '));
    }
  }
}

testFrontendFetch().catch(console.error);