// Comprehensive test of "ingredients to avoid" filtering
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
        if (ing.text && ing.text !== 'null') return ing.text;
        if (ing.ref && ing.ref !== 'null') return ing.ref;
        if (ing.refId && ing.refId !== 'null') {
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
  }

  return !(hasAvoidedInText || hasAvoidedInIngredients);
}

async function testComprehensiveAvoid() {
  console.log('🧪 Comprehensive "Ingredients to Avoid" Test\n');

  try {
    // Get a variety of recipes
    const names = ["chicken", "beef", "egg"];
    const recipes = await client.fetch(recipesByIngredientNamesQuery, {
      names,
      namesLower: names.map(name => name.toLowerCase()),
      searchPattern: `*(${names.map(name => name.toLowerCase()).join("|")}).*`
    });

    console.log(`Found ${recipes.length} recipes\n`);

    const testCases = [
      { avoid: "sausage", description: "Avoid sausage" },
      { avoid: "egg, milk", description: "Avoid egg and milk" },
      { avoid: "meat", description: "Avoid meat (should catch many recipes)" },
      { avoid: "nuts, shellfish", description: "Avoid nuts and shellfish" },
      { avoid: "", description: "Avoid nothing (baseline)" }
    ];

    testCases.forEach((test, i) => {
      console.log(`${i + 1}. ${test.description} (avoid: "${test.avoid}"):`);

      const filtered = recipes.filter((recipe: any) =>
        filterByAvoidedIngredients(recipe, test.avoid)
      );

      console.log(`   Before: ${recipes.length} recipes`);
      console.log(`   After: ${filtered.length} recipes`);
      console.log(`   Filtered out: ${recipes.length - filtered.length} recipes`);

      if (filtered.length > 0) {
        console.log(`   Sample remaining: "${filtered[0].title}"`);
      }
      console.log('');
    });

  } catch (error) {
    console.error('Error:', error);
  }
}

testComprehensiveAvoid();