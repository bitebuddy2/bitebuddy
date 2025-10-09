-- Create day_notes table for meal planner
CREATE TABLE IF NOT EXISTS day_notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  date DATE NOT NULL,
  note TEXT NOT NULL CHECK (char_length(note) <= 100),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, date)
);

-- Enable RLS
ALTER TABLE day_notes ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view their own day notes"
  ON day_notes
  FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own day notes"
  ON day_notes
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own day notes"
  ON day_notes
  FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own day notes"
  ON day_notes
  FOR DELETE
  USING (auth.uid() = user_id);

-- Index for faster lookups
CREATE INDEX idx_day_notes_user_date ON day_notes(user_id, date);

-- Trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_day_notes_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER day_notes_updated_at
  BEFORE UPDATE ON day_notes
  FOR EACH ROW
  EXECUTE FUNCTION update_day_notes_updated_at();
