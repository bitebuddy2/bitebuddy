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
CREATE POLICY "Published AI recipes are viewable by everyone"
  ON saved_ai_recipes
  FOR SELECT
  USING (is_published = true OR auth.uid() = user_id);
