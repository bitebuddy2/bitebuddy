import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-09-24',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

async function checkSanityRecipe() {
  console.log('🔍 Checking Sanity for greggs-festive-bake...\n');

  try {
    const recipe = await client.fetch(
      `*[_type == "recipe" && slug.current == $slug][0]{
        _id,
        title,
        slug,
        description,
        heroImage
      }`,
      { slug: 'greggs-festive-bake' }
    );

    if (recipe) {
      console.log('✅ Recipe found in Sanity:');
      console.log('ID:', recipe._id);
      console.log('Title:', recipe.title);
      console.log('Slug:', recipe.slug.current);
      console.log('Description:', recipe.description?.substring(0, 100) + '...');
      console.log('Has Hero Image:', recipe.heroImage ? 'Yes' : 'No');
    } else {
      console.log('❌ Recipe NOT found in Sanity');
      console.log('\nThis is the problem! The comment references a recipe that doesn\'t exist.');
      console.log('The frontend tries to fetch the title and fails, causing the comment to not display.');
    }

    // Check all recipes with "greggs" in the slug
    console.log('\n\n🔍 Searching for all Greggs recipes...');
    const greggRecipes = await client.fetch(
      `*[_type == "recipe" && slug.current match "*greggs*"]{
        _id,
        title,
        slug
      }`
    );

    console.log(`Found ${greggRecipes.length} Greggs recipe(s):`);
    greggRecipes.forEach((r: any) => {
      console.log(`  - ${r.title} (${r.slug.current})`);
    });

  } catch (error: any) {
    console.error('❌ Error fetching from Sanity:', error.message);
  }
}

checkSanityRecipe();
