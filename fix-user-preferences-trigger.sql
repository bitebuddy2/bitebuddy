-- Fix the user preferences trigger to work with Google OAuth
-- The issue: RLS policy prevents the trigger from inserting because auth.uid() is NULL during signup

-- Drop the existing trigger and function
DROP TRIGGER IF EXISTS create_user_preferences_on_signup ON auth.users;
DROP FUNCTION IF EXISTS create_default_user_preferences();

-- Recreate the function with SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION create_default_user_preferences()
RETURNS TRIGGER
SECURITY DEFINER -- This allows the function to bypass RLS policies
SET search_path = public
AS $$
BEGIN
  INSERT INTO public.user_preferences (user_id)
  VALUES (NEW.id)
  ON CONFLICT (user_id) DO NOTHING;
  RETURN NEW;
EXCEPTION
  WHEN OTHERS THEN
    -- Log the error but don't fail the user creation
    RAISE WARNING 'Failed to create user preferences for user %: %', NEW.id, SQLERRM;
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Recreate the trigger
CREATE TRIGGER create_user_preferences_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_user_preferences();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO postgres, anon, authenticated, service_role;
GRANT ALL ON public.user_preferences TO postgres, service_role;
GRANT SELECT, INSERT ON public.user_preferences TO authenticated;
