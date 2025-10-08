import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function checkPublishedRecipes() {
  console.log('🔍 Checking published recipes...\n');

  const userId = 'f2bd6477-0506-486c-85ab-e89981589ebf'; // bitebuddy2@gmail.com

  // Get all AI recipes for this user
  const { data: allRecipes, error: allError } = await supabase
    .from('saved_ai_recipes')
    .select('*')
    .eq('user_id', userId);

  if (allError) {
    console.error('❌ Error fetching all recipes:', allError);
    return;
  }

  console.log(`📋 Total AI recipes for user: ${allRecipes?.length || 0}\n`);

  if (allRecipes && allRecipes.length > 0) {
    allRecipes.forEach((recipe, index) => {
      console.log(`--- Recipe ${index + 1} ---`);
      console.log('ID:', recipe.id);
      console.log('Title:', recipe.title);
      console.log('Is Published:', recipe.is_published || false);
      console.log('Slug:', recipe.slug || 'N/A');
      console.log('Sanity Recipe ID:', recipe.sanity_recipe_id || 'N/A');
      console.log('Published At:', recipe.published_at || 'N/A');
      console.log('Created At:', recipe.created_at);
      console.log();
    });
  }

  // Check specifically for published recipes
  console.log('\n🧑‍🍳 Published recipes only:\n');

  const { data: publishedRecipes, error: publishedError } = await supabase
    .from('saved_ai_recipes')
    .select('id, title, slug, published_at, sanity_recipe_id')
    .eq('user_id', userId)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (publishedError) {
    console.error('❌ Error fetching published recipes:', publishedError);
    return;
  }

  console.log(`Found ${publishedRecipes?.length || 0} published recipe(s)`);

  if (publishedRecipes && publishedRecipes.length > 0) {
    publishedRecipes.forEach((recipe) => {
      console.log('\n✅', recipe.title);
      console.log('   Slug:', recipe.slug);
      console.log('   Sanity ID:', recipe.sanity_recipe_id);
      console.log('   Published:', recipe.published_at);
    });
  } else {
    console.log('\n❌ No published recipes found');
    console.log('\nThis means either:');
    console.log('1. The recipe was not successfully published');
    console.log('2. The is_published flag is still false');
    console.log('3. The publishing API failed to update the Supabase record');
  }

  // Check for Chocolate Banana Apple Meringue Delight specifically
  console.log('\n\n🍫 Searching for "Chocolate Banana Apple Meringue Delight"...\n');

  const { data: chocolateRecipe } = await supabase
    .from('saved_ai_recipes')
    .select('*')
    .eq('user_id', userId)
    .ilike('title', '%Chocolate%Banana%');

  if (chocolateRecipe && chocolateRecipe.length > 0) {
    console.log('✅ Found matching recipe(s):');
    chocolateRecipe.forEach((recipe) => {
      console.log('\n---');
      console.log('Title:', recipe.title);
      console.log('Is Published:', recipe.is_published);
      console.log('Slug:', recipe.slug || 'NOT SET');
      console.log('Sanity Recipe ID:', recipe.sanity_recipe_id || 'NOT SET');
      console.log('Published At:', recipe.published_at || 'NOT SET');
    });
  } else {
    console.log('❌ Recipe not found in database');
  }
}

checkPublishedRecipes();
