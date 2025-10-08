-- Add cooking preferences columns to saved_ai_recipes table
ALTER TABLE saved_ai_recipes
ADD COLUMN IF NOT EXISTS cooking_method TEXT,
ADD COLUMN IF NOT EXISTS spice_level TEXT,
ADD COLUMN IF NOT EXISTS dietary_preference TEXT;

-- Create indexes for filtering
CREATE INDEX IF NOT EXISTS idx_saved_ai_recipes_cooking_method ON saved_ai_recipes(cooking_method) WHERE cooking_method IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_saved_ai_recipes_spice_level ON saved_ai_recipes(spice_level) WHERE spice_level IS NOT NULL;
CREATE INDEX IF NOT EXISTS idx_saved_ai_recipes_dietary_preference ON saved_ai_recipes(dietary_preference) WHERE dietary_preference IS NOT NULL;
