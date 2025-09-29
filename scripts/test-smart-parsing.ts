// Test the smart ingredient parsing that handles multi-word ingredients
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

function normalizeIngredients(input: string): string {
  const ingredients = parseNames(input);
  return ingredients.join(", ");
}

const testInputs = [
  "sausage meat, egg, thyme", // commas
  "sausage meat egg thyme", // spaces only - should keep "sausage meat" together
  "chicken breast onion garlic", // spaces only with multi-word
  "sausage meat  egg  thyme", // multiple spaces - explicit separator
  "olive oil garlic bread", // spaces only - should keep "olive oil" together
  "chicken breast, onion, garlic", // commas with multi-word
  "red wine tomato paste beef stock", // multiple multi-word ingredients
];

console.log('🔍 Testing SMART Multi-Word Ingredient Parsing\n');

testInputs.forEach((input, i) => {
  const parsed = parseNames(input);
  const normalized = normalizeIngredients(input);

  console.log(`${i + 1}. Input: "${input}"`);
  console.log(`   Parsed: [${parsed.map(s => `"${s}"`).join(', ')}]`);
  console.log(`   Normalized URL: "${normalized}"`);
  console.log('');
});