-- Create table to store AI-generated recipes
CREATE TABLE IF NOT EXISTS saved_ai_recipes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  intro_text TEXT,
  servings INTEGER,
  prep_min INTEGER,
  cook_min INTEGER,
  ingredients JSONB NOT NULL DEFAULT '[]'::jsonb,
  steps JSONB NOT NULL DEFAULT '[]'::jsonb,
  tips JSONB DEFAULT '[]'::jsonb,
  faqs JSONB DEFAULT '[]'::jsonb,
  nutrition JSONB,
  brand_name TEXT,
  data JSONB, -- Store full recipe object for backward compatibility
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE saved_ai_recipes ENABLE ROW LEVEL SECURITY;

-- Policies for authenticated users to manage their own recipes
CREATE POLICY "Users can view own AI recipes"
  ON saved_ai_recipes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own AI recipes"
  ON saved_ai_recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own AI recipes"
  ON saved_ai_recipes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own AI recipes"
  ON saved_ai_recipes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Policy for public read access (for sharing)
CREATE POLICY "Anyone can view AI recipes for sharing"
  ON saved_ai_recipes
  FOR SELECT
  USING (true);

-- Create indexes for faster lookups
CREATE INDEX idx_saved_ai_recipes_user_id ON saved_ai_recipes(user_id);
CREATE INDEX idx_saved_ai_recipes_created_at ON saved_ai_recipes(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_saved_ai_recipes_updated_at
  BEFORE UPDATE ON saved_ai_recipes
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
