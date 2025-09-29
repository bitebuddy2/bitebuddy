// Test the improved flexible ingredient parsing
function parseNames(q?: string): string[] {
  if (!q) return [];

  // If no commas, semicolons, or pipes, treat spaces as separators
  // Otherwise, only split on explicit separators (commas, semicolons, pipes, or 2+ spaces)
  const hasExplicitSeparators = /[,;|]|\s{2,}/.test(q);

  const splitPattern = hasExplicitSeparators
    ? /[,;|]+|\s{2,}/ // Split on comma, semicolon, pipe, or 2+ spaces
    : /\s+/; // Split on any whitespace if no explicit separators

  return q
    .split(splitPattern)
    .map(s => s.trim())
    .filter(Boolean)
    .filter(ingredient => ingredient.length > 1); // Filter out single characters
}

function normalizeIngredients(input: string): string {
  if (!input) return "";

  // If no commas, semicolons, or pipes, treat spaces as separators
  // Otherwise, only split on explicit separators (commas, semicolons, pipes, or 2+ spaces)
  const hasExplicitSeparators = /[,;|]|\s{2,}/.test(input);

  const splitPattern = hasExplicitSeparators
    ? /[,;|]+|\s{2,}/ // Split on comma, semicolon, pipe, or 2+ spaces
    : /\s+/; // Split on any whitespace if no explicit separators

  const ingredients = input
    .split(splitPattern)
    .map(s => s.trim())
    .filter(Boolean)
    .filter(ingredient => ingredient.length > 1); // Filter out single characters

  return ingredients.join(", ");
}

const testInputs = [
  "sausage meat, egg, thyme", // commas
  "sausage meat egg thyme", // spaces only
  "sausage meat  egg  thyme", // multiple spaces
  "sausage meat; egg; thyme", // semicolons
  "sausage meat | egg | thyme", // pipes
  "chicken breast onion garlic", // spaces only, multi-word ingredient
  "olive oil garlic bread", // spaces only
  "sausage meat,egg,thyme", // no spaces after commas
  "  sausage meat  ,  egg  ,  thyme  ", // extra spaces with commas
];

console.log('🔍 Testing IMPROVED Flexible Ingredient Parsing\n');

testInputs.forEach((input, i) => {
  const parsed = parseNames(input);
  const normalized = normalizeIngredients(input);

  console.log(`${i + 1}. Input: "${input}"`);
  console.log(`   Parsed: [${parsed.map(s => `"${s}"`).join(', ')}]`);
  console.log(`   Normalized URL: "${normalized}"`);
  console.log('');
});