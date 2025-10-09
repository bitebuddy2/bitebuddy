import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-01-09',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN || 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function migrateAIRecipes() {
  console.log('🔍 Finding AI-generated recipes...');

  // Find all recipes with "AI Generated" category
  const aiRecipes = await client.fetch(
    `*[_type == "recipe" && references(*[_type == "category" && slug.current == "ai-generated"]._id)] {
      _id,
      _createdAt,
      _updatedAt,
      title,
      slug,
      description,
      heroImage,
      servings,
      prepMin,
      cookMin,
      introText,
      ingredients,
      steps,
      tips,
      faqs,
      nutrition,
      createdBy,
      ratingCount,
      ratingSum
    }`
  );

  console.log(`📊 Found ${aiRecipes.length} AI-generated recipes to migrate`);

  if (aiRecipes.length === 0) {
    console.log('✅ No recipes to migrate');
    return;
  }

  let successCount = 0;
  let errorCount = 0;

  for (const recipe of aiRecipes) {
    try {
      console.log(`\n🔄 Migrating: ${recipe.title}`);

      // Transform ingredients from old format to new format
      const transformedIngredients = [];
      if (recipe.ingredients) {
        for (const group of recipe.ingredients) {
          if (group.items) {
            for (const item of group.items) {
              transformedIngredients.push({
                _type: 'object',
                _key: `ing-${Math.random().toString(36).substr(2, 9)}`,
                name: item.ingredientText || item.ingredientRef?.name || 'Unknown ingredient',
                amount: item.quantity || '',
                unit: item.unit || '',
                notes: item.notes || ''
              });
            }
          }
        }
      }

      // Transform steps from block format to plain text
      const transformedSteps = [];
      if (recipe.steps) {
        for (const step of recipe.steps) {
          if (step.step && Array.isArray(step.step)) {
            // Extract text from block content
            const text = step.step
              .map((block: any) =>
                block.children?.map((child: any) => child.text).join('') || ''
              )
              .join('\n')
              .trim();

            if (text) {
              transformedSteps.push(text);
            }
          }
        }
      }

      // Create new communityRecipe document
      const newRecipe = {
        _type: 'communityRecipe',
        title: recipe.title,
        slug: recipe.slug,
        description: recipe.description,
        heroImage: recipe.heroImage,
        servings: recipe.servings,
        prepMin: recipe.prepMin,
        cookMin: recipe.cookMin,
        introText: recipe.introText || recipe.description,
        ingredients: transformedIngredients,
        steps: transformedSteps,
        tips: recipe.tips || [],
        faqs: recipe.faqs || [],
        nutrition: recipe.nutrition,
        createdBy: recipe.createdBy || {
          userId: 'unknown',
          userName: 'Anonymous',
          userEmail: null
        },
        ratingCount: recipe.ratingCount || 0,
        ratingSum: recipe.ratingSum || 0
      };

      // Create the new document
      const result = await client.create(newRecipe);
      console.log(`✅ Created communityRecipe: ${result._id}`);

      // Delete the old recipe document
      await client.delete(recipe._id);
      console.log(`🗑️  Deleted old recipe: ${recipe._id}`);

      successCount++;
    } catch (error: any) {
      console.error(`❌ Error migrating ${recipe.title}:`, error.message);
      errorCount++;
    }
  }

  console.log(`\n📈 Migration complete!`);
  console.log(`✅ Success: ${successCount}`);
  console.log(`❌ Errors: ${errorCount}`);
}

// Run the migration
migrateAIRecipes().catch(console.error);
