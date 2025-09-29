// Quick debug script to test search parsing
import { client } from '../src/sanity/client';
import { recipesByIngredientNamesQuery } from '../src/sanity/queries';

// Parse function from search page
function parseNames(q?: string): string[] {
  return (q || "")
    .split(",")
    .map(s => s.trim())
    .filter(Boolean);
}

async function debugSearchParsing() {
  console.log('🔍 DEBUGGING SEARCH PARSING');

  const testQuery = "sausage meat, egg, thyme";
  console.log('\n1. Raw query:', JSON.stringify(testQuery));

  const names = parseNames(testQuery);
  console.log('2. Parsed names:', names);
  console.log('3. Names length:', names.length);
  console.log('4. Names joined with |:', names.join('|'));

  const namesLower = names.map(name => name.toLowerCase());
  console.log('5. Names lower:', namesLower);

  const searchPattern = `*(${names.map(name => name.toLowerCase()).join("|")})*`;
  console.log('6. Search pattern:', searchPattern);

  console.log('\n🔍 Testing GROQ query...');
  try {
    const data = await client.fetch(recipesByIngredientNamesQuery, {
      names,
      namesLower,
      searchPattern
    });

    console.log('7. Query result:', JSON.stringify(data, null, 2));
  } catch (error) {
    console.error('❌ GROQ Query Error:', error);
  }
}

debugSearchParsing().catch(console.error);