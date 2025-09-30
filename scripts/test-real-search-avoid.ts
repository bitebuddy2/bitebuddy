// Test script to check if allIngredients data is returned from real Sanity query
import { client } from "../src/sanity/client";
import { recipesByIngredientNamesQuery } from "../src/sanity/queries";

async function testRealSearch() {
  console.log('🧪 Testing Real Search with allIngredients Data\n');

  try {
    // Test search for common ingredients
    const names = ["chicken", "garlic"];
    const recipes = await client.fetch(recipesByIngredientNamesQuery, {
      names,
      namesLower: names.map(name => name.toLowerCase()),
      searchPattern: `*(${names.map(name => name.toLowerCase()).join("|")}).*`
    });

    console.log(`Found ${recipes.length} recipes for ingredients: ${names.join(", ")}\n`);

    if (recipes.length > 0) {
      const firstRecipe = recipes[0];
      console.log(`Sample Recipe: "${firstRecipe.title}"`);
      console.log(`Has allIngredients field: ${!!firstRecipe.allIngredients}`);

      if (firstRecipe.allIngredients) {
        console.log(`Number of ingredients: ${firstRecipe.allIngredients.length}`);
        console.log('Sample ingredients:');
        firstRecipe.allIngredients.slice(0, 5).forEach((ing: any, i: number) => {
          console.log(`  ${i + 1}. text: "${ing.text}", ref: "${ing.ref}", refId: "${ing.refId}"`);
        });

        // Test avoid filtering on real data
        console.log('\n🔍 Testing avoid filtering with "chicken":');
        const hasChickenInText = firstRecipe.title.toLowerCase().includes('chicken') ||
          (firstRecipe.description || '').toLowerCase().includes('chicken');

        const hasChickenInIngredients = firstRecipe.allIngredients.some((ing: any) =>
          (ing.text || '').toLowerCase().includes('chicken') ||
          (ing.ref || '').toLowerCase().includes('chicken')
        );

        console.log(`  - Has 'chicken' in title/description: ${hasChickenInText}`);
        console.log(`  - Has 'chicken' in ingredients: ${hasChickenInIngredients}`);
        console.log(`  - Would be filtered out: ${hasChickenInText || hasChickenInIngredients}`);
      } else {
        console.log('❌ allIngredients field is missing - filtering may not work properly');
      }
    } else {
      console.log('No recipes found for test ingredients');
    }

  } catch (error) {
    console.error('Error:', error);
  }
}

testRealSearch();