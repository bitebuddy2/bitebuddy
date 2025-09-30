// Test script to show how IngredientFinder builds AI prompts
function buildPrompt(q: string, method: string, portions: number, spice: string, diet: string, avoid: string): string {
  const promptParts = [`Create a recipe with: ${q.trim()}`];

  // Add cooking method if specified
  if (method !== "Any") {
    promptParts.push(`using ${method.toLowerCase()} cooking method`);
  }

  // Add serving size
  promptParts.push(`for ${portions} ${portions === 1 ? 'person' : 'people'}`);

  // Add spice level
  if (spice !== "None") {
    const spiceMap = {
      "Mild": "mildly spiced",
      "Medium": "medium spiced",
      "Hot": "hot and spicy"
    };
    promptParts.push(`make it ${spiceMap[spice as keyof typeof spiceMap]}`);
  }

  // Add dietary requirements
  if (diet !== "None") {
    promptParts.push(`suitable for ${diet.toLowerCase()} diet`);
  }

  // Add ingredients to avoid
  if (avoid.trim()) {
    promptParts.push(`avoiding these ingredients: ${avoid.trim()}`);
  }

  return promptParts.join(", ") + ".";
}

console.log('🧪 Testing IngredientFinder AI Prompt Building\n');

const testCases = [
  {
    name: "Basic chicken recipe",
    q: "chicken breast, garlic, herbs",
    method: "Any",
    portions: 2,
    spice: "None",
    diet: "None",
    avoid: ""
  },
  {
    name: "Vegan BBQ for 4 people",
    q: "tofu, vegetables",
    method: "BBQ",
    portions: 4,
    spice: "Medium",
    diet: "Vegan",
    avoid: ""
  },
  {
    name: "Gluten-free bake avoiding nuts",
    q: "salmon, quinoa",
    method: "Bake",
    portions: 1,
    spice: "Mild",
    diet: "Gluten-Free",
    avoid: "nuts, shellfish"
  },
  {
    name: "Hot air-fried halal for 6",
    q: "lamb, rice, spices",
    method: "Air Fry",
    portions: 6,
    spice: "Hot",
    diet: "Halal",
    avoid: "pork"
  }
];

testCases.forEach((test, i) => {
  console.log(`${i + 1}. ${test.name}:`);
  console.log(`   Input: "${test.q}"`);
  console.log(`   Settings: ${test.method}, ${test.portions} people, ${test.spice} spice, ${test.diet} diet, avoid: "${test.avoid}"`);

  const prompt = buildPrompt(test.q, test.method, test.portions, test.spice, test.diet, test.avoid);
  console.log(`   Generated Prompt: "${prompt}"`);
  console.log('');
});