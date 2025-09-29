// Test the flexible ingredient parsing
function parseNames(q?: string): string[] {
  if (!q) return [];

  // Handle multiple separators: commas, semicolons, pipes, or multiple spaces
  return q
    .split(/[,;|]+|\s{2,}/) // Split on comma, semicolon, pipe, or 2+ spaces
    .map(s => s.trim())
    .filter(Boolean)
    .filter(ingredient => ingredient.length > 1); // Filter out single characters
}

function normalizeIngredients(input: string): string {
  if (!input) return "";

  // Split on various separators and rejoin with commas
  const ingredients = input
    .split(/[,;|]+|\s{2,}/) // Split on comma, semicolon, pipe, or 2+ spaces
    .map(s => s.trim())
    .filter(Boolean)
    .filter(ingredient => ingredient.length > 1); // Filter out single characters

  return ingredients.join(", ");
}

const testInputs = [
  "sausage meat, egg, thyme",
  "sausage meat egg thyme",
  "sausage meat  egg  thyme", // multiple spaces
  "sausage meat; egg; thyme",
  "sausage meat | egg | thyme",
  "sausage meat,egg,thyme", // no spaces after commas
  "  sausage meat  ,  egg  ,  thyme  ", // extra spaces
  "chicken breast  onion  garlic", // multiple spaces between
];

console.log('🔍 Testing Flexible Ingredient Parsing\n');

testInputs.forEach((input, i) => {
  const parsed = parseNames(input);
  const normalized = normalizeIngredients(input);

  console.log(`${i + 1}. Input: "${input}"`);
  console.log(`   Parsed: [${parsed.map(s => `"${s}"`).join(', ')}]`);
  console.log(`   Normalized URL: "${normalized}"`);
  console.log('');
});