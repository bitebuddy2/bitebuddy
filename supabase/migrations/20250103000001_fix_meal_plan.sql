-- Check if table exists and verify structure
-- This migration fixes any issues with the meal_plan table

-- First, drop existing policies if they exist (to allow re-creation)
DROP POLICY IF EXISTS "Users can view their own meal plans" ON meal_plan;
DROP POLICY IF EXISTS "Users can insert their own meal plans" ON meal_plan;
DROP POLICY IF EXISTS "Users can update their own meal plans" ON meal_plan;
DROP POLICY IF EXISTS "Users can delete their own meal plans" ON meal_plan;

-- Recreate policies
CREATE POLICY "Users can view their own meal plans"
  ON meal_plan FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own meal plans"
  ON meal_plan FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own meal plans"
  ON meal_plan FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own meal plans"
  ON meal_plan FOR DELETE
  USING (auth.uid() = user_id);
