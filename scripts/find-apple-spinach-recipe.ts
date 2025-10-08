import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function findRecipe() {
  console.log('🔍 Looking for Apple and Spinach recipe in Supabase...\n');

  const userId = 'f2bd6477-0506-486c-85ab-e89981589ebf';

  // Search by title
  const { data: recipes } = await supabase
    .from('saved_ai_recipes')
    .select('*')
    .eq('user_id', userId)
    .ilike('title', '%Apple%Spinach%');

  if (recipes && recipes.length > 0) {
    console.log(`✅ Found ${recipes.length} matching recipe(s):\n`);
    recipes.forEach(r => {
      console.log('---');
      console.log('Title:', r.title);
      console.log('ID:', r.id);
      console.log('is_published:', r.is_published);
      console.log('slug:', r.slug);
      console.log('sanity_recipe_id:', r.sanity_recipe_id);
      console.log('published_at:', r.published_at);
      console.log();
    });
  } else {
    console.log('❌ No matching recipes found');
    console.log('\nSearching all recipes for any with "apple"...\n');

    const { data: allApple } = await supabase
      .from('saved_ai_recipes')
      .select('*')
      .eq('user_id', userId)
      .ilike('title', '%apple%');

    if (allApple && allApple.length > 0) {
      allApple.forEach(r => {
        console.log('- ', r.title, '| is_published:', r.is_published);
      });
    }
  }

  // Check if any recipe has the Sanity ID
  console.log('\n\n🔍 Checking if any recipe has Sanity ID czv5QnE4jWWmyJTFsYmcUd...\n');

  const { data: bySanityId } = await supabase
    .from('saved_ai_recipes')
    .select('*')
    .eq('user_id', userId)
    .eq('sanity_recipe_id', 'czv5QnE4jWWmyJTFsYmcUd');

  if (bySanityId && bySanityId.length > 0) {
    console.log('✅ Found recipe with Sanity ID!');
    console.log('Title:', bySanityId[0].title);
    console.log('is_published:', bySanityId[0].is_published);
  } else {
    console.log('❌ No recipe found with that Sanity ID');
    console.log('This means the Supabase update failed!');
  }
}

findRecipe();
