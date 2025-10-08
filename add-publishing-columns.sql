-- Add columns to saved_ai_recipes for publishing feature
-- Run this in Supabase SQL Editor

-- Add columns if they don't exist
DO $$
BEGIN
  -- Add is_published column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_ai_recipes' AND column_name = 'is_published'
  ) THEN
    ALTER TABLE saved_ai_recipes ADD COLUMN is_published BOOLEAN DEFAULT false;
  END IF;

  -- Add slug column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_ai_recipes' AND column_name = 'slug'
  ) THEN
    ALTER TABLE saved_ai_recipes ADD COLUMN slug TEXT UNIQUE;
  END IF;

  -- Add sanity_recipe_id column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_ai_recipes' AND column_name = 'sanity_recipe_id'
  ) THEN
    ALTER TABLE saved_ai_recipes ADD COLUMN sanity_recipe_id TEXT;
  END IF;

  -- Add published_at column
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'saved_ai_recipes' AND column_name = 'published_at'
  ) THEN
    ALTER TABLE saved_ai_recipes ADD COLUMN published_at TIMESTAMP WITH TIME ZONE;
  END IF;
END $$;

-- Create indexes
CREATE INDEX IF NOT EXISTS idx_saved_ai_recipes_slug
  ON saved_ai_recipes(slug) WHERE slug IS NOT NULL;

CREATE INDEX IF NOT EXISTS idx_saved_ai_recipes_published
  ON saved_ai_recipes(is_published) WHERE is_published = true;

-- Drop existing policy if it exists (to avoid conflicts)
DROP POLICY IF EXISTS "Published AI recipes are viewable by everyone" ON saved_ai_recipes;

-- Create RLS policy for public read access to published recipes
CREATE POLICY "Published AI recipes are viewable by everyone"
  ON saved_ai_recipes
  FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);

-- Verify the changes
SELECT
  column_name,
  data_type,
  is_nullable,
  column_default
FROM information_schema.columns
WHERE table_name = 'saved_ai_recipes'
ORDER BY ordinal_position;
