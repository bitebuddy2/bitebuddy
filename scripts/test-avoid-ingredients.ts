// Test script to verify "ingredients to avoid" filtering works

// Mock recipe data to test the filtering logic
const mockRecipes = [
  {
    slug: "test-1",
    title: "Chicken Tikka Masala",
    description: "Creamy curry with tender chicken",
    allIngredients: [
      { text: "chicken breast", ref: null },
      { text: "tomatoes", ref: null },
      { text: "cream", ref: null },
      { text: "garlic", ref: null }
    ]
  },
  {
    slug: "test-2",
    title: "Vegetable Stir Fry",
    description: "Fresh vegetables in soy sauce",
    allIngredients: [
      { text: "broccoli", ref: null },
      { text: "carrots", ref: null },
      { text: "soy sauce", ref: null },
      { text: "peanuts", ref: null }
    ]
  },
  {
    slug: "test-3",
    title: "Beef Wellington",
    description: "Tender beef wrapped in pastry",
    allIngredients: [
      { text: "beef", ref: null },
      { text: "puff pastry", ref: null },
      { text: "mushrooms", ref: null }
    ]
  }
];

// Copy the filtering function logic
function filterByAvoidedIngredients(recipes: any[], avoid: string) {
  return recipes.filter(recipe => {
    if (!avoid.trim()) return true;

    const avoidList = avoid.toLowerCase().split(',').map(item => item.trim()).filter(Boolean);

    // Check recipe text (title, description, intro)
    const text = `${recipe.title} ${recipe.description || ''}`.toLowerCase();
    const hasAvoidedInText = avoidList.some(avoided => text.includes(avoided));

    // Check actual ingredients list if available
    let hasAvoidedInIngredients = false;
    if (recipe.allIngredients) {
      const ingredientNames = recipe.allIngredients
        .map((ing: any) => (ing.text || ing.ref || '').toLowerCase())
        .filter(Boolean);

      hasAvoidedInIngredients = avoidList.some(avoided =>
        ingredientNames.some(ingredient =>
          ingredient.includes(avoided) || avoided.includes(ingredient)
        )
      );
    }

    return !(hasAvoidedInText || hasAvoidedInIngredients);
  });
}

console.log('🧪 Testing "Ingredients to Avoid" Filtering\n');

const testCases = [
  {
    name: "Avoid 'chicken'",
    avoid: "chicken",
    expected: ["Vegetable Stir Fry", "Beef Wellington"]
  },
  {
    name: "Avoid 'nuts, peanuts'",
    avoid: "nuts, peanuts",
    expected: ["Chicken Tikka Masala", "Beef Wellington"]
  },
  {
    name: "Avoid 'beef'",
    avoid: "beef",
    expected: ["Chicken Tikka Masala", "Vegetable Stir Fry"]
  },
  {
    name: "Avoid 'dairy, cream'",
    avoid: "dairy, cream",
    expected: ["Vegetable Stir Fry", "Beef Wellington"]
  },
  {
    name: "Avoid nothing",
    avoid: "",
    expected: ["Chicken Tikka Masala", "Vegetable Stir Fry", "Beef Wellington"]
  }
];

testCases.forEach((test, i) => {
  console.log(`${i + 1}. ${test.name}:`);
  console.log(`   Avoid: "${test.avoid}"`);

  const filtered = filterByAvoidedIngredients(mockRecipes, test.avoid);
  const resultTitles = filtered.map(r => r.title);

  console.log(`   Results: [${resultTitles.join(', ')}]`);
  console.log(`   Expected: [${test.expected.join(', ')}]`);

  const isCorrect = JSON.stringify(resultTitles.sort()) === JSON.stringify(test.expected.sort());
  console.log(`   ✅ ${isCorrect ? 'PASS' : 'FAIL'}`);
  console.log('');
});

console.log('Test completed! Check results above.');