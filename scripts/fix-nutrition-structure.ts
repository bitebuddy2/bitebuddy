import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function main() {
  // Fetch all recipes with flat nutrition fields
  const recipes = await client.fetch(`
    *[_type == "recipe"]{
      _id,
      title,
      calories,
      protein,
      fat,
      carbs,
      nutrition
    }
  `);

  console.log(`Found ${recipes.length} recipes to check`);

  for (const recipe of recipes) {
    // Check if it has flat fields
    const hasFlat = recipe.calories || recipe.protein || recipe.fat || recipe.carbs;
    const hasNested = recipe.nutrition;

    if (hasFlat && !hasNested) {
      console.log(`\n🔧 Fixing: ${recipe.title}`);

      // Create nested structure
      const nutrition = {
        calories: recipe.calories || null,
        protein: recipe.protein || null,
        fat: recipe.fat || null,
        carbs: recipe.carbs || null
      };

      // Update recipe
      await client
        .patch(recipe._id)
        .set({ nutrition })
        .unset(['calories', 'protein', 'fat', 'carbs'])
        .commit();

      console.log(`✓ Fixed ${recipe.title}`);
    } else if (hasNested) {
      console.log(`✓ ${recipe.title} already has nested nutrition`);
    } else {
      console.log(`⚠ ${recipe.title} has no nutrition data`);
    }
  }

  console.log('\n✓ Done fixing all recipes');
}

main();
