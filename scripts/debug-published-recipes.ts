import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

const supabase = createClient(supabaseUrl, supabaseServiceKey);

async function debugPublishedRecipes() {
  console.log('🔍 Checking published recipes in database...\n');

  const userId = 'f2bd6477-0506-486c-85ab-e89981589ebf'; // bitebuddy2@gmail.com

  // Check all AI recipes
  const { data: allRecipes, error: allError } = await supabase
    .from('saved_ai_recipes')
    .select('*')
    .eq('user_id', userId);

  console.log(`📊 Total AI recipes for user: ${allRecipes?.length || 0}\n`);

  if (allRecipes && allRecipes.length > 0) {
    const published = allRecipes.filter(r => r.is_published === true);
    const unpublished = allRecipes.filter(r => r.is_published !== true);

    console.log(`✅ Published recipes: ${published.length}`);
    console.log(`❌ Unpublished recipes: ${unpublished.length}\n`);

    if (published.length > 0) {
      console.log('📋 Published recipes details:\n');
      published.forEach(recipe => {
        console.log('---');
        console.log('Title:', recipe.title);
        console.log('ID:', recipe.id);
        console.log('Slug:', recipe.slug);
        console.log('Sanity ID:', recipe.sanity_recipe_id);
        console.log('Published At:', recipe.published_at);
        console.log('is_published:', recipe.is_published);
        console.log();
      });
    }

    if (unpublished.length > 0) {
      console.log('📋 Unpublished recipes:\n');
      unpublished.forEach(recipe => {
        console.log('---');
        console.log('Title:', recipe.title);
        console.log('ID:', recipe.id);
        console.log('is_published:', recipe.is_published);
        console.log();
      });
    }
  }

  // Test the exact query that CommunityHistory uses
  console.log('\n🧪 Testing CommunityHistory query...\n');

  const { data: recipes, error: recipesError } = await supabase
    .from('saved_ai_recipes')
    .select('id, title, slug, published_at, sanity_recipe_id')
    .eq('user_id', userId)
    .eq('is_published', true)
    .order('published_at', { ascending: false });

  if (recipesError) {
    console.error('❌ Query error:', recipesError);
  } else {
    console.log(`✅ Query returned ${recipes?.length || 0} recipes`);
    if (recipes && recipes.length > 0) {
      recipes.forEach(r => {
        console.log('  -', r.title);
      });
    } else {
      console.log('\n💡 This is why nothing shows in Community History!');
      console.log('   No recipes have is_published = true');
    }
  }
}

debugPublishedRecipes();
