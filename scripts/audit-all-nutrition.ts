import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function auditNutrition() {
  const recipes = await client.fetch<any[]>(`
    *[_type == "recipe"] | order(title asc){
      _id,
      title,
      servings,
      nutrition
    }
  `);

  console.log(`Auditing ${recipes.length} recipes\n`);
  console.log('Recipe Title'.padEnd(50), 'Servings', 'Calories', 'Protein', 'Fat', 'Carbs', 'Status');
  console.log('-'.repeat(120));

  let hasNutrition = 0;
  let missingNutrition = 0;
  let suspiciousCalories = [];

  for (const recipe of recipes) {
    const { title, servings, nutrition } = recipe;

    if (!nutrition || !nutrition.calories) {
      console.log(
        title.padEnd(50),
        (servings || '?').toString().padEnd(8),
        '❌ MISSING NUTRITION'
      );
      missingNutrition++;
      continue;
    }

    hasNutrition++;

    const { calories, protein, fat, carbs } = nutrition;

    // Estimate calories from macros: protein(4 kcal/g) + carbs(4 kcal/g) + fat(9 kcal/g)
    const estimatedCalories = (protein || 0) * 4 + (carbs || 0) * 4 + (fat || 0) * 9;
    const difference = Math.abs(calories - estimatedCalories);
    const percentDiff = estimatedCalories > 0 ? (difference / estimatedCalories) * 100 : 0;

    // Flag suspicious entries:
    // - Very low calories (< 50) unless it's a dip/sauce
    // - Very high calories (> 2000) for single serving
    // - Calories don't match macros (>30% difference)
    let status = '✅ OK';
    let isSuspicious = false;

    if (calories < 50 && !title.toLowerCase().includes('dip') && !title.toLowerCase().includes('sauce')) {
      status = '⚠️ VERY LOW';
      isSuspicious = true;
    } else if (calories > 2000) {
      status = '⚠️ VERY HIGH';
      isSuspicious = true;
    } else if (percentDiff > 30 && estimatedCalories > 0) {
      status = `⚠️ MISMATCH (${Math.round(percentDiff)}% diff, est: ${Math.round(estimatedCalories)})`;
      isSuspicious = true;
    }

    console.log(
      title.substring(0, 50).padEnd(50),
      servings.toString().padEnd(8),
      calories.toString().padEnd(8),
      (protein || '?').toString().padEnd(7),
      (fat || '?').toString().padEnd(7),
      (carbs || '?').toString().padEnd(7),
      status
    );

    if (isSuspicious) {
      suspiciousCalories.push({ title, servings, nutrition, estimatedCalories });
    }
  }

  console.log('\n' + '='.repeat(120));
  console.log(`\nSummary:`);
  console.log(`  Total recipes: ${recipes.length}`);
  console.log(`  With nutrition: ${hasNutrition}`);
  console.log(`  Missing nutrition: ${missingNutrition}`);
  console.log(`  Suspicious entries: ${suspiciousCalories.length}`);

  if (suspiciousCalories.length > 0) {
    console.log(`\n⚠️ Recipes needing review:`);
    suspiciousCalories.forEach(r => {
      console.log(`  - ${r.title} (${r.servings} servings): ${r.nutrition.calories} kcal (estimated: ${Math.round(r.estimatedCalories)} kcal)`);
    });
  }
}

auditNutrition();
