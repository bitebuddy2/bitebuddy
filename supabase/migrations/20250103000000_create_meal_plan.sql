-- Create meal_plan table for 14-day meal planner
CREATE TABLE IF NOT EXISTS meal_plan (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  meal_type TEXT NOT NULL CHECK (meal_type IN ('breakfast', 'lunch', 'dinner', 'snack')),
  recipe_type TEXT NOT NULL CHECK (recipe_type IN ('published', 'ai')),
  recipe_slug TEXT, -- for published recipes
  ai_recipe_id UUID, -- for AI recipes, references saved_ai_recipes(id)
  notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT TIMEZONE('utc', NOW()),
  UNIQUE(user_id, date, meal_type)
);

-- Enable RLS
ALTER TABLE meal_plan ENABLE ROW LEVEL SECURITY;

-- Policy: Users can only see their own meal plans
CREATE POLICY "Users can view their own meal plans"
  ON meal_plan FOR SELECT
  USING (auth.uid() = user_id);

-- Policy: Users can insert their own meal plans
CREATE POLICY "Users can insert their own meal plans"
  ON meal_plan FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Policy: Users can update their own meal plans
CREATE POLICY "Users can update their own meal plans"
  ON meal_plan FOR UPDATE
  USING (auth.uid() = user_id);

-- Policy: Users can delete their own meal plans
CREATE POLICY "Users can delete their own meal plans"
  ON meal_plan FOR DELETE
  USING (auth.uid() = user_id);

-- Create index for faster queries
CREATE INDEX idx_meal_plan_user_date ON meal_plan(user_id, date);

-- Update updated_at timestamp trigger
CREATE OR REPLACE FUNCTION update_meal_plan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = TIMEZONE('utc', NOW());
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_meal_plan_updated_at
  BEFORE UPDATE ON meal_plan
  FOR EACH ROW
  EXECUTE FUNCTION update_meal_plan_updated_at();
