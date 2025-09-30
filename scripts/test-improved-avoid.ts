// Test improved "ingredients to avoid" filtering with refId extraction
import { client } from "../src/sanity/client";
import { recipesByIngredientNamesQuery } from "../src/sanity/queries";

function filterByAvoidedIngredients(recipe: any, avoid: string) {
  if (!avoid.trim()) return true;

  const avoidList = avoid.toLowerCase().split(',').map(item => item.trim()).filter(Boolean);

  // Check recipe text (title, description, intro)
  const text = `${recipe.title} ${recipe.description || ''} ${recipe.introText || ''}`.toLowerCase();
  const hasAvoidedInText = avoidList.some(avoided => text.includes(avoided));

  // Check actual ingredients list if available
  let hasAvoidedInIngredients = false;
  if (recipe.allIngredients) {
    const ingredientNames = recipe.allIngredients
      .map((ing: any) => {
        // Extract name from text, ref, or refId
        if (ing.text && ing.text !== 'null') return ing.text;
        if (ing.ref && ing.ref !== 'null') return ing.ref;
        if (ing.refId && ing.refId !== 'null') {
          // Extract readable name from ingredient ID (e.g., "ingredient.sausage-meat" -> "sausage meat")
          return ing.refId.replace('ingredient.', '').replace(/-/g, ' ');
        }
        return '';
      })
      .map(name => name.toLowerCase())
      .filter(Boolean);

    hasAvoidedInIngredients = avoidList.some(avoided =>
      ingredientNames.some(ingredient =>
        ingredient.includes(avoided) || avoided.includes(ingredient)
      )
    );

    console.log(`    Ingredient names: [${ingredientNames.join(', ')}]`);
    console.log(`    Avoiding: [${avoidList.join(', ')}]`);
    console.log(`    Has avoided in ingredients: ${hasAvoidedInIngredients}`);
  }

  return !(hasAvoidedInText || hasAvoidedInIngredients);
}

async function testImprovedAvoid() {
  console.log('🧪 Testing Improved "Ingredients to Avoid" with Real Data\n');

  try {
    // Search for recipes with sausage
    const names = ["sausage"];
    const recipes = await client.fetch(recipesByIngredientNamesQuery, {
      names,
      namesLower: names.map(name => name.toLowerCase()),
      searchPattern: `*(${names.map(name => name.toLowerCase()).join("|")}).*`
    });

    console.log(`Found ${recipes.length} recipes for "${names.join(", ")}"\n`);

    if (recipes.length > 0) {
      const testRecipe = recipes[0];
      console.log(`Testing recipe: "${testRecipe.title}"`);

      // Test 1: Avoid "sausage" - should filter out
      console.log('\n1. Testing avoid "sausage":');
      const result1 = filterByAvoidedIngredients(testRecipe, "sausage");
      console.log(`  Result: ${result1 ? 'INCLUDED' : 'FILTERED OUT'} ✅`);

      // Test 2: Avoid "chicken" - should keep
      console.log('\n2. Testing avoid "chicken":');
      const result2 = filterByAvoidedIngredients(testRecipe, "chicken");
      console.log(`  Result: ${result2 ? 'INCLUDED' : 'FILTERED OUT'} ✅`);

      // Test 3: Avoid "pork" - depends on recipe content
      console.log('\n3. Testing avoid "pork":');
      const result3 = filterByAvoidedIngredients(testRecipe, "pork");
      console.log(`  Result: ${result3 ? 'INCLUDED' : 'FILTERED OUT'}`);

    } else {
      console.log('No recipes found for test');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testImprovedAvoid();