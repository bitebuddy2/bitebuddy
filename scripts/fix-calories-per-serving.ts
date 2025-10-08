import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function fixCalories() {
  // Get all recipes with nutrition data
  const recipes = await client.fetch<any[]>(`
    *[_type == "recipe" && defined(nutrition.calories) && defined(servings)]{
      _id,
      title,
      servings,
      nutrition
    }
  `);

  console.log(`Found ${recipes.length} recipes with nutrition data`);

  for (const recipe of recipes) {
    const { _id, title, servings, nutrition } = recipe;

    // Check if calories need to be divided by servings
    // If the calories are much higher than protein/fat/carbs would suggest per serving,
    // it's likely showing total calories instead of per-serving
    const caloriesPerServing = Math.round(nutrition.calories / servings);

    console.log(`\n${title} (${servings} servings)`);
    console.log(`  Current: ${nutrition.calories} kcal`);
    console.log(`  Should be: ${caloriesPerServing} kcal per serving`);

    // Update the recipe
    await client
      .patch(_id)
      .set({
        nutrition: {
          ...nutrition,
          calories: caloriesPerServing
        }
      })
      .commit();

    console.log(`  ✅ Updated`);
  }

  console.log(`\n✅ Fixed ${recipes.length} recipes`);
}

fixCalories();
