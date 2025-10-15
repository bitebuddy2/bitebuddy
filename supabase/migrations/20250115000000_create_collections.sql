-- Create collections table for organizing saved recipes
CREATE TABLE IF NOT EXISTS public.recipe_collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, name)
);

-- Create junction table for many-to-many relationship between collections and saved recipes
CREATE TABLE IF NOT EXISTS public.collection_recipes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  collection_id UUID NOT NULL REFERENCES public.recipe_collections(id) ON DELETE CASCADE,
  recipe_slug TEXT NOT NULL,
  added_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(collection_id, recipe_slug)
);

-- Add RLS policies
ALTER TABLE public.recipe_collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.collection_recipes ENABLE ROW LEVEL SECURITY;

-- Users can only see their own collections
CREATE POLICY "Users can view own collections"
  ON public.recipe_collections
  FOR SELECT
  USING (auth.uid() = user_id);

-- Users can create their own collections
CREATE POLICY "Users can insert own collections"
  ON public.recipe_collections
  FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Users can update their own collections
CREATE POLICY "Users can update own collections"
  ON public.recipe_collections
  FOR UPDATE
  USING (auth.uid() = user_id);

-- Users can delete their own collections
CREATE POLICY "Users can delete own collections"
  ON public.recipe_collections
  FOR DELETE
  USING (auth.uid() = user_id);

-- Users can only see recipes in their own collections
CREATE POLICY "Users can view own collection recipes"
  ON public.collection_recipes
  FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.recipe_collections
      WHERE recipe_collections.id = collection_recipes.collection_id
      AND recipe_collections.user_id = auth.uid()
    )
  );

-- Users can add recipes to their own collections
CREATE POLICY "Users can insert into own collections"
  ON public.collection_recipes
  FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.recipe_collections
      WHERE recipe_collections.id = collection_id
      AND recipe_collections.user_id = auth.uid()
    )
  );

-- Users can remove recipes from their own collections
CREATE POLICY "Users can delete from own collections"
  ON public.collection_recipes
  FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM public.recipe_collections
      WHERE recipe_collections.id = collection_id
      AND recipe_collections.user_id = auth.uid()
    )
  );

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_recipe_collections_user_id ON public.recipe_collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_collection_id ON public.collection_recipes(collection_id);
CREATE INDEX IF NOT EXISTS idx_collection_recipes_recipe_slug ON public.collection_recipes(recipe_slug);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = timezone('utc'::text, now());
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_recipe_collections_updated_at
  BEFORE UPDATE ON public.recipe_collections
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
