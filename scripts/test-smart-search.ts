// Test the search functionality with smart parsing
import { client } from '../src/sanity/client';
import { recipesByIngredientNamesQuery } from '../src/sanity/queries';

// Smart parsing function from search page
function parseNames(q?: string): string[] {
  if (!q) return [];

  // Handle explicit separators first: commas, semicolons, pipes, or 2+ spaces
  if (/[,;|]|\s{2,}/.test(q)) {
    return q
      .split(/[,;|]+|\s{2,}/)
      .map(s => s.trim())
      .filter(Boolean)
      .filter(ingredient => ingredient.length > 1);
  }

  // For space-only input, try to intelligently split on single spaces
  // but keep common multi-word ingredients together
  const commonMultiWord = [
    'sausage meat', 'chicken breast', 'olive oil', 'sea salt', 'black pepper',
    'red wine', 'white wine', 'coconut milk', 'soy sauce', 'fish sauce',
    'tomato paste', 'beef stock', 'chicken stock', 'cream cheese', 'caster sugar',
    'plain flour', 'self raising flour', 'double cream', 'single cream'
  ];

  let result = q;

  // Replace known multi-word ingredients with temporary placeholders
  const placeholders: { [key: string]: string } = {};
  commonMultiWord.forEach((phrase, index) => {
    if (result.toLowerCase().includes(phrase.toLowerCase())) {
      const placeholder = `__MULTIWORD_${index}__`;
      placeholders[placeholder] = phrase;
      result = result.replace(new RegExp(phrase, 'gi'), placeholder);
    }
  });

  // Split on single spaces
  const parts = result
    .split(/\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  // Restore multi-word ingredients
  const restored = parts.map(part => {
    if (part.startsWith('__MULTIWORD_')) {
      return placeholders[part] || part;
    }
    return part;
  });

  return restored.filter(ingredient => ingredient.length > 1);
}

async function testSmartSearch() {
  console.log('🔍 Testing Smart Search with Multiple Input Formats\n');

  const testInputs = [
    "sausage meat, egg, thyme", // commas - should work
    "sausage meat egg thyme", // spaces only - should work with smart parsing
  ];

  for (const [index, input] of testInputs.entries()) {
    console.log(`${index + 1}. Testing: "${input}"`);

    const names = parseNames(input);
    console.log(`   Parsed names: [${names.map(s => `"${s}"`).join(', ')}]`);

    if (names.length > 0) {
      try {
        const recipes = await client.fetch(recipesByIngredientNamesQuery, {
          names,
          namesLower: names.map(name => name.toLowerCase()),
          searchPattern: `*(${names.map(name => name.toLowerCase()).join("|")})*`
        });

        console.log(`   Results: ${recipes.length} recipe(s) found`);

        if (recipes.length > 0) {
          console.log(`   ✅ Recipe: "${recipes[0].title}"`);
          console.log(`   ✅ Matches: ${recipes[0].totalMatches} ingredients`);
          console.log(`   ✅ Matched: ${recipes[0].matched?.map((m: any) => m.name).join(', ')}`);
        } else {
          console.log('   ❌ No recipes found');
        }
      } catch (error) {
        console.log(`   ❌ Error: ${error}`);
      }
    }

    console.log('');
  }
}

testSmartSearch().catch(console.error);