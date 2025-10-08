-- Add missing updated_at column to saved_ai_recipes table
-- This column is expected by the update_updated_at_column trigger

ALTER TABLE saved_ai_recipes
ADD COLUMN IF NOT EXISTS updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW();

-- Update existing records to have updated_at = created_at
UPDATE saved_ai_recipes
SET updated_at = created_at
WHERE updated_at IS NULL;
