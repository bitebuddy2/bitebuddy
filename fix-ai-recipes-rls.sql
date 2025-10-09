-- Fix AI recipes RLS to prevent users from seeing each other's recipes
-- Issue: The "Anyone can view AI recipes for sharing" policy allows ALL users to see ALL recipes

-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view AI recipes for sharing" ON saved_ai_recipes;

-- The existing "Users can view own AI recipes" policy (lines 26-29 in original migration)
-- should be sufficient for private recipes

-- For public sharing, we'll add a proper policy later with an is_public flag
-- For now, we'll handle sharing through the public /ai-recipe/[id] route which uses service role

-- Verify the correct policies are in place
-- Run this to see current policies:
-- SELECT schemaname, tablename, policyname, permissive, roles, cmd, qual
-- FROM pg_policies
-- WHERE tablename = 'saved_ai_recipes';

-- Expected result: Only user-specific policies should remain
