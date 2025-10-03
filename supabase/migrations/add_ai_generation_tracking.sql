-- Create table to track AI recipe generations
CREATE TABLE IF NOT EXISTS ai_generation_log (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE ai_generation_log ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Users can view own generation log"
  ON ai_generation_log
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own generation log"
  ON ai_generation_log
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create index for faster lookups
CREATE INDEX idx_ai_generation_log_user_id_created_at ON ai_generation_log(user_id, created_at DESC);
