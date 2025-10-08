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

async function checkSanityForChocolate() {
  console.log('🔍 Checking Sanity for "Chocolate Banana Apple Meringue Delight"...\n');

  try {
    // Search for recipes with chocolate in the title
    const recipes = await client.fetch(
      `*[_type == "recipe" && title match "*Chocolate*Banana*"]{
        _id,
        title,
        slug,
        createdBy
      }`
    );

    if (recipes.length > 0) {
      console.log(`✅ Found ${recipes.length} matching recipe(s) in Sanity:\n`);
      recipes.forEach((recipe: any) => {
        console.log('---');
        console.log('Title:', recipe.title);
        console.log('Sanity ID:', recipe._id);
        console.log('Slug:', recipe.slug?.current || 'N/A');
        console.log('Created By:', recipe.createdBy?.userName || 'N/A');
        console.log();
      });
    } else {
      console.log('❌ Recipe NOT found in Sanity');
      console.log('\nThis confirms the publishing failed before reaching Sanity.');
      console.log('The API endpoint likely returned an error.');
    }

    // Check all recent Bite Buddy Kitchen recipes
    console.log('\n📋 Recent Bite Buddy Kitchen recipes:\n');
    const recentRecipes = await client.fetch(
      `*[_type == "recipe" && brand._ref == "bite-buddy-kitchen"] | order(_createdAt desc) [0...5]{
        _id,
        title,
        slug,
        _createdAt,
        createdBy
      }`
    );

    if (recentRecipes.length > 0) {
      console.log(`Found ${recentRecipes.length} recent community recipe(s):\n`);
      recentRecipes.forEach((recipe: any) => {
        console.log('---');
        console.log('Title:', recipe.title);
        console.log('Created At:', recipe._createdAt);
        console.log('Created By:', recipe.createdBy?.userName || 'N/A');
        console.log();
      });
    } else {
      console.log('No community recipes found');
    }

  } catch (error: any) {
    console.error('❌ Error:', error.message);
  }
}

checkSanityForChocolate();
