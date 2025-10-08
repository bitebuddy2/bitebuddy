import { createClient } from '@supabase/supabase-js';
import { config } from 'dotenv';

config({ path: '.env.local' });

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function checkAndFix() {
  console.log('🔍 Checking if publishing columns exist...\n');

  // Try to select the publishing columns
  const { data, error } = await supabase
    .from('saved_ai_recipes')
    .select('id, title, is_published, slug, sanity_recipe_id, published_at')
    .limit(1);

  if (error) {
    console.log('❌ Error selecting columns:', error.message);
    console.log('\nThis likely means the publishing columns don\'t exist yet.');
    console.log('\nYou need to run this migration in Supabase:');
    console.log('---');
    console.log(`
-- Add columns to saved_ai_recipes for publishing feature
ALTER TABLE saved_ai_recipes
ADD COLUMN IF NOT EXISTS is_published BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS slug TEXT UNIQUE,
ADD COLUMN IF NOT EXISTS sanity_recipe_id TEXT,
ADD COLUMN IF NOT EXISTS published_at TIMESTAMP WITH TIME ZONE;

-- Create index on slug for faster lookups
CREATE INDEX IF NOT EXISTS idx_saved_ai_recipes_slug ON saved_ai_recipes(slug) WHERE slug IS NOT NULL;

-- Create index on is_published for filtering
CREATE INDEX IF NOT EXISTS idx_saved_ai_recipes_published ON saved_ai_recipes(is_published) WHERE is_published = true;

-- Update RLS policies to allow public read access for published recipes
DROP POLICY IF EXISTS "Published AI recipes are viewable by everyone" ON saved_ai_recipes;
CREATE POLICY "Published AI recipes are viewable by everyone"
  ON saved_ai_recipes
  FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);
    `);
    console.log('---\n');
    console.log('Run this in Supabase Dashboard > SQL Editor');
  } else {
    console.log('✅ All publishing columns exist!');
    console.log('Sample data:', data);

    // Now test an update
    const userId = 'f2bd6477-0506-486c-85ab-e89981589ebf';
    const { data: recipes } = await supabase
      .from('saved_ai_recipes')
      .select('id, title, is_published')
      .eq('user_id', userId)
      .eq('is_published', false)
      .limit(1);

    if (recipes && recipes.length > 0) {
      console.log('\n🧪 Testing update on:', recipes[0].title);

      const { data: updated, error: updateError } = await supabase
        .from('saved_ai_recipes')
        .update({
          is_published: true,
          slug: 'test-update-' + Date.now(),
          sanity_recipe_id: 'test-sanity-id',
          published_at: new Date().toISOString(),
        })
        .eq('id', recipes[0].id)
        .select();

      if (updateError) {
        console.log('❌ Update failed:', updateError);
      } else {
        console.log('✅ Update succeeded!', updated);

        // Revert it
        await supabase
          .from('saved_ai_recipes')
          .update({
            is_published: false,
            slug: null,
            sanity_recipe_id: null,
            published_at: null,
          })
          .eq('id', recipes[0].id);
        console.log('✅ Reverted test update');
      }
    }
  }
}

checkAndFix();
