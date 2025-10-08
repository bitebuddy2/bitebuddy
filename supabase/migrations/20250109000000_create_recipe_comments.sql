-- Create table for recipe comments
CREATE TABLE IF NOT EXISTS recipe_comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_name TEXT NOT NULL, -- Store user name for easy display
  user_avatar TEXT, -- Store user avatar URL
  recipe_slug TEXT, -- For Sanity recipes
  ai_recipe_id UUID REFERENCES saved_ai_recipes(id) ON DELETE CASCADE, -- For AI recipes
  comment_text TEXT NOT NULL CHECK (char_length(comment_text) >= 10),
  image_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  CONSTRAINT comment_recipe_check CHECK (
    (recipe_slug IS NOT NULL AND ai_recipe_id IS NULL) OR
    (recipe_slug IS NULL AND ai_recipe_id IS NOT NULL)
  )
);

-- Enable RLS
ALTER TABLE recipe_comments ENABLE ROW LEVEL SECURITY;

-- Policies: Anyone can read comments
CREATE POLICY "Comments are viewable by everyone"
  ON recipe_comments FOR SELECT
  USING (true);

-- Users can insert their own comments
CREATE POLICY "Users can insert their own comments"
  ON recipe_comments FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own comments
CREATE POLICY "Users can update their own comments"
  ON recipe_comments FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- Users can delete their own comments
CREATE POLICY "Users can delete their own comments"
  ON recipe_comments FOR DELETE
  USING (auth.uid() = user_id);

-- Create indexes for faster lookups
CREATE INDEX idx_recipe_comments_recipe_slug ON recipe_comments(recipe_slug) WHERE recipe_slug IS NOT NULL;
CREATE INDEX idx_recipe_comments_ai_recipe_id ON recipe_comments(ai_recipe_id) WHERE ai_recipe_id IS NOT NULL;
CREATE INDEX idx_recipe_comments_user_id ON recipe_comments(user_id);
CREATE INDEX idx_recipe_comments_created_at ON recipe_comments(created_at DESC);

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_recipe_comments_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Trigger to automatically update updated_at
CREATE TRIGGER update_recipe_comments_timestamp
  BEFORE UPDATE ON recipe_comments
  FOR EACH ROW
  EXECUTE FUNCTION update_recipe_comments_updated_at();

-- Create storage bucket for comment images
INSERT INTO storage.buckets (id, name, public)
VALUES ('comment-images', 'comment-images', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies for comment images
CREATE POLICY "Comment images are publicly accessible"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'comment-images');

CREATE POLICY "Authenticated users can upload comment images"
  ON storage.objects FOR INSERT
  WITH CHECK (
    bucket_id = 'comment-images'
    AND auth.role() = 'authenticated'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can update their own comment images"
  ON storage.objects FOR UPDATE
  USING (
    bucket_id = 'comment-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );

CREATE POLICY "Users can delete their own comment images"
  ON storage.objects FOR DELETE
  USING (
    bucket_id = 'comment-images'
    AND (storage.foldername(name))[1] = auth.uid()::text
  );
