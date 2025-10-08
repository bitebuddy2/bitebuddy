-- Check saved_recipes RLS policies
-- Run this in Supabase SQL Editor

-- Check if RLS is enabled
SELECT
  schemaname,
  tablename,
  rowsecurity as "RLS Enabled"
FROM pg_tables
WHERE tablename = 'saved_recipes';

-- Check all policies
SELECT
  policyname as "Policy Name",
  cmd as "Command",
  permissive as "Type",
  roles as "Roles",
  qual as "USING Expression"
FROM pg_policies
WHERE tablename = 'saved_recipes'
ORDER BY policyname;

-- Check table structure
SELECT
  column_name as "Column",
  data_type as "Type",
  is_nullable as "Nullable"
FROM information_schema.columns
WHERE table_name = 'saved_recipes'
ORDER BY ordinal_position;
