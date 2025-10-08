-- Fix RLS policies for saved_recipes table
-- Run this in Supabase SQL Editor

-- Enable RLS if not already enabled
ALTER TABLE saved_recipes ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist (to avoid conflicts)
DROP POLICY IF EXISTS "Users can view their own saved recipes" ON saved_recipes;
DROP POLICY IF EXISTS "Users can insert their own saved recipes" ON saved_recipes;
DROP POLICY IF EXISTS "Users can delete their own saved recipes" ON saved_recipes;

-- Create policies
-- Users can view their own saved recipes
CREATE POLICY "Users can view their own saved recipes"
  ON saved_recipes
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own saved recipes
CREATE POLICY "Users can insert their own saved recipes"
  ON saved_recipes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own saved recipes
CREATE POLICY "Users can delete their own saved recipes"
  ON saved_recipes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Verify policies
SELECT tablename, policyname, permissive, roles, cmd, qual
FROM pg_policies
WHERE tablename = 'saved_recipes';
