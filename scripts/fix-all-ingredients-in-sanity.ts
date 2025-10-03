import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function main() {
  // Fetch all recipes
  const recipes = await client.fetch('*[_type == "recipe"]{ _id, title, ingredients }');
  console.log(`Found ${recipes.length} recipes to check`);

  for (const recipe of recipes) {
    if (!recipe.ingredients || !Array.isArray(recipe.ingredients)) continue;

    const firstItem = recipe.ingredients[0];

    // Check if it's the old flat structure
    if (firstItem && firstItem._type === 'ingredientItem') {
      console.log(`\n🔧 Fixing: ${recipe.title}`);

      // Transform to new structure
      const fixedIngredients = [
        {
          _type: 'ingredientGroup',
          _key: 'main-ingredients',
          heading: null,
          items: recipe.ingredients.map((item: any) => ({
            _type: 'object',
            _key: item._key || Math.random().toString(36).substring(7),
            ingredientText: item.name,
            quantity: item.quantity || null,
            unit: item.unit || null,
            notes: item.notes || null
          }))
        }
      ];

      // Update the recipe
      await client
        .patch(recipe._id)
        .set({ ingredients: fixedIngredients })
        .commit();

      console.log(`✓ Fixed ${recipe.title}`);
    } else if (firstItem && firstItem._type === 'ingredientGroup') {
      console.log(`✓ ${recipe.title} already correct`);
    }
  }

  console.log('\n✓ Done fixing all recipes');
}

main();
