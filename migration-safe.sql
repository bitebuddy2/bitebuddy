-- Drop existing policies if they exist (to allow re-running)
DROP POLICY IF EXISTS "Users can view own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;
DROP POLICY IF EXISTS "Users can update own preferences" ON user_preferences;

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_user_preferences_timestamp ON user_preferences;
DROP TRIGGER IF EXISTS create_user_preferences_on_signup ON auth.users;

-- Create user preferences table (IF NOT EXISTS handles if table exists)
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Recipe Preferences
  default_serving_size INTEGER DEFAULT 4,
  preferred_units TEXT DEFAULT 'metric' CHECK (preferred_units IN ('metric', 'imperial')),
  default_dietary_restrictions TEXT[] DEFAULT '{}',
  default_spice_level TEXT DEFAULT 'medium' CHECK (default_spice_level IN ('mild', 'medium', 'hot')),
  default_cooking_methods TEXT[] DEFAULT '{}',

  -- Privacy Settings
  show_name_on_recipes BOOLEAN DEFAULT true,
  profile_public BOOLEAN DEFAULT true,

  -- Notification Preferences
  email_comments BOOLEAN DEFAULT true,
  email_replies BOOLEAN DEFAULT true,
  email_weekly_roundup BOOLEAN DEFAULT false,
  email_features BOOLEAN DEFAULT true,
  email_meal_reminders BOOLEAN DEFAULT false,

  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Users can view their own preferences
CREATE POLICY "Users can view own preferences"
  ON user_preferences FOR SELECT
  USING (auth.uid() = user_id);

-- Users can insert their own preferences
CREATE POLICY "Users can insert own preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own preferences
CREATE POLICY "Users can update own preferences"
  ON user_preferences FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Create index on user_id (drop first if exists)
DROP INDEX IF EXISTS idx_user_preferences_user_id;
CREATE INDEX idx_user_preferences_user_id ON user_preferences(user_id);

-- Function to update updated_at
CREATE OR REPLACE FUNCTION update_user_preferences_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to update updated_at
CREATE TRIGGER update_user_preferences_timestamp
  BEFORE UPDATE ON user_preferences
  FOR EACH ROW
  EXECUTE FUNCTION update_user_preferences_updated_at();

-- Function to create default preferences for new users
CREATE OR REPLACE FUNCTION create_default_user_preferences()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to create preferences when user signs up
CREATE TRIGGER create_user_preferences_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_user_preferences();
