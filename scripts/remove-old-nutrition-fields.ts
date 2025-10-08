import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function removeOldFields() {
  // Find recipes with old top-level nutrition fields
  const recipes = await client.fetch<any[]>(`
    *[_type == "recipe" && (
      defined(calories) ||
      defined(protein) ||
      defined(fat) ||
      defined(carbs) ||
      defined(kcal)
    )]{
      _id,
      title,
      calories,
      protein,
      fat,
      carbs,
      kcal
    }
  `);

  console.log(`Found ${recipes.length} recipes with old nutrition fields`);

  for (const recipe of recipes) {
    console.log(`\nRemoving old fields from: ${recipe.title}`);
    const oldFields = {
      calories: recipe.calories,
      protein: recipe.protein,
      fat: recipe.fat,
      carbs: recipe.carbs,
      kcal: recipe.kcal
    };
    console.log(`  Old fields:`, JSON.stringify(oldFields, null, 2));

    // Remove the old top-level fields
    await client
      .patch(recipe._id)
      .unset(['calories', 'protein', 'fat', 'carbs', 'kcal'])
      .commit();

    console.log(`  ✅ Removed`);
  }

  console.log(`\n✅ Cleaned up ${recipes.length} recipes`);
}

removeOldFields();
