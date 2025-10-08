import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

// Known correct calorie values per serving from official sources
const correctCalories: Record<string, number> = {
  // Greggs (official nutritional info)
  'Greggs Festive Bake': 420,
  'Greggs Sausage Roll': 311,
  'Greggs Style Steak Bake': 430,

  // KFC (official nutritional info)
  'KFC Original Recipe Chicken': 320, // per piece
  'KFC Popcorn Chicken': 425, // full portion
  'KFC Zinger Burger': 685,

  // McDonald's (official nutritional info)
  'McDonald\'s Big Mac': 563,
  'McDonald\'s Chicken Selects': 420, // 3 pieces
  'McDonald\'s Sausage & Egg McMuffin': 470,

  // Nando's
  'Nando\'s Peri Peri Chicken': 385, // per quarter chicken
  'Nando\'s Spicy Rice Bowl': 245,

  // Pizza Express
  'Pizza Express American Hot': 580, // half pizza typical

  // Pret
  'Pret A Manger Tuna Melt Toastie': 430,

  // Starbucks
  'Starbucks Pumpkin Spice Latte': 310, // Grande size

  // Wagamama (official menu)
  'Wagamama Bang Bang Cauliflower': 290,
  'Wagamama Chicken Firecracker Curry': 610,
  'Wagamama Chicken Katsu Curry': 720,
  'Wagamama Chicken Teriyaki Donburi': 620,
  'Wagamama Chilli Chicken Ramen': 585,
  'Wagamama Kare Burosu Ramen': 480,
  'Wagamama Style Yasai Katsu Curry': 640,
  'Wagamama Yaki Udon': 480,

  // Domino's
  'Domino\'s Garlic and Herb Dip': 115, // per pot (100g)
};

async function restoreCalories() {
  const recipes = await client.fetch<any[]>(`
    *[_type == "recipe"]{
      _id,
      title,
      servings,
      nutrition
    }
  `);

  console.log('Checking and restoring calories...\n');

  for (const recipe of recipes) {
    const { _id, title, servings, nutrition } = recipe;

    if (!nutrition || !correctCalories[title]) {
      continue;
    }

    const { protein, fat, carbs } = nutrition;
    const currentCalories = nutrition.calories;
    const officialCalories = correctCalories[title];

    // Calculate estimated calories from macros
    const estimatedFromMacros = Math.round((protein || 0) * 4 + (carbs || 0) * 4 + (fat || 0) * 9);

    console.log(`\n${title}`);
    console.log(`  Servings: ${servings}`);
    console.log(`  Current calories: ${currentCalories} kcal`);
    console.log(`  Official value: ${officialCalories} kcal`);
    console.log(`  Estimated from macros: ${estimatedFromMacros} kcal`);
    console.log(`  Macros: ${protein}g protein, ${fat}g fat, ${carbs}g carbs`);

    // Determine the correct per-serving value
    let correctPerServing = officialCalories;

    // Check if the official value matches the macros (within 20% tolerance)
    const macroMatchesOfficial = Math.abs(estimatedFromMacros - officialCalories) / officialCalories < 0.2;
    const macroMatchesCurrent = Math.abs(estimatedFromMacros - currentCalories) / Math.max(estimatedFromMacros, 1) < 0.2;

    if (macroMatchesCurrent) {
      console.log(`  ✅ Current value matches macros - keeping ${currentCalories} kcal`);
      continue;
    } else if (macroMatchesOfficial) {
      console.log(`  ✅ Official value matches macros - using ${officialCalories} kcal`);
    } else {
      // Macros don't match official value - use macros as source of truth
      correctPerServing = estimatedFromMacros;
      console.log(`  ⚠️ Using macro-calculated value: ${estimatedFromMacros} kcal (official value doesn't match macros)`);
    }

    // Update if different from current
    if (correctPerServing !== currentCalories) {
      await client
        .patch(_id)
        .set({
          nutrition: {
            ...nutrition,
            calories: correctPerServing
          }
        })
        .commit();

      console.log(`  🔧 Updated from ${currentCalories} to ${correctPerServing} kcal`);
    }
  }

  console.log('\n✅ Calorie restoration complete');
}

restoreCalories();
