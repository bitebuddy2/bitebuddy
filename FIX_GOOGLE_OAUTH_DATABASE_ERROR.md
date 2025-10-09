# Fix: Google OAuth "Database error saving new user"

## Problem

When signing in with Google OAuth, you get this error:
```
error=server_error&error_code=unexpected_failure&error_description=Database+error+saving+new+user
```

## Root Cause

The database has a trigger that automatically creates a `user_preferences` record when a new user signs up:

```sql
CREATE TRIGGER create_user_preferences_on_signup
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION create_default_user_preferences();
```

However, this trigger is failing because:

1. The `user_preferences` table has RLS (Row Level Security) enabled
2. The RLS policy requires `auth.uid() = user_id` for INSERT operations
3. When the trigger runs during user creation, `auth.uid()` is `NULL` because the user's session isn't established yet
4. The INSERT fails, which cascades and prevents the user from being created

## Solution

The trigger function needs to bypass RLS using `SECURITY DEFINER`. This allows the function to run with elevated privileges, bypassing RLS policies.

### Option 1: Apply via Supabase Dashboard (Recommended)

1. Go to your Supabase Dashboard: https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt
2. Click **SQL Editor** in the left sidebar
3. Click **New Query**
4. Copy and paste the contents of `fix-user-preferences-trigger.sql` (in your project root)
5. Click **Run** (or press Ctrl+Enter)
6. You should see: "Success. No rows returned"

### Option 2: Apply via Supabase CLI

If you have the Supabase CLI installed:

```bash
supabase db execute -f fix-user-preferences-trigger.sql --project-ref mvbaskfbcsxwrkqziztt
```

### Option 3: Create a New Migration

If you want to track this as a migration:

```bash
# Copy the fix to a new migration
cp fix-user-preferences-trigger.sql supabase/migrations/20250112000000_fix_user_preferences_trigger.sql

# Push to Supabase
supabase db push
```

## What the Fix Does

1. **Drops the existing trigger and function** to start clean
2. **Recreates the function with `SECURITY DEFINER`**
   - This allows it to bypass RLS policies
   - Sets `search_path = public` for security
3. **Adds error handling** so user creation won't fail even if preferences creation fails
4. **Grants necessary permissions** to ensure the trigger works
5. **Recreates the trigger** to use the new function

## How to Test

### 1. Apply the fix (see above)

### 2. Test with a new Google account

1. Go to https://bitebuddy.co.uk/account
2. Sign out if you're already signed in
3. Click "Sign in with Google"
4. Use a Google account that has **never** signed in to BiteBuddy before
5. You should be redirected successfully without any errors

### 3. Verify the user preferences were created

Run this query in Supabase SQL Editor:

```sql
SELECT
  u.email,
  up.*
FROM auth.users u
LEFT JOIN user_preferences up ON up.user_id = u.id
ORDER BY u.created_at DESC
LIMIT 10;
```

You should see:
- Your newly created user's email
- A corresponding `user_preferences` record with default values

## Alternative Solution (If Above Doesn't Work)

If the `SECURITY DEFINER` approach doesn't work due to permissions, you can modify the RLS policy instead:

```sql
-- Drop the restrictive INSERT policy
DROP POLICY IF EXISTS "Users can insert own preferences" ON user_preferences;

-- Create a new policy that allows both user inserts AND system inserts
CREATE POLICY "Users and system can insert preferences"
  ON user_preferences FOR INSERT
  WITH CHECK (
    auth.uid() = user_id  -- User can insert their own
    OR auth.uid() IS NULL  -- OR system (triggers) can insert during signup
  );
```

Apply this via Supabase Dashboard SQL Editor if needed.

## Preventive Measures for Future

When creating triggers that insert into RLS-protected tables during user signup:

1. **Always use `SECURITY DEFINER`** for trigger functions
2. **Add error handling** so trigger failures don't prevent user creation
3. **Test with OAuth providers** (Google, GitHub, etc.) not just email/password
4. **Check Supabase logs** at https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/logs/edge-logs

## Troubleshooting

### Error persists after applying fix

1. **Clear browser cache and cookies**
   - Google OAuth may cache the error state
   - Try in an incognito/private window

2. **Check Supabase logs**
   - Go to: https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/logs/postgres-logs
   - Look for errors around the time you tried to sign in
   - Common errors: permission denied, function not found, RLS policy violation

3. **Verify the trigger exists**
   ```sql
   SELECT
     trigger_name,
     event_manipulation,
     event_object_table,
     action_statement
   FROM information_schema.triggers
   WHERE trigger_name = 'create_user_preferences_on_signup';
   ```

4. **Verify the function has SECURITY DEFINER**
   ```sql
   SELECT
     proname as function_name,
     prosecdef as is_security_definer
   FROM pg_proc
   WHERE proname = 'create_default_user_preferences';
   ```

   `is_security_definer` should be `true` (or `t`)

### Still getting errors?

Check if there are other triggers on `auth.users`:

```sql
SELECT
  trigger_name,
  action_statement
FROM information_schema.triggers
WHERE event_object_table = 'users'
  AND trigger_schema = 'auth'
ORDER BY trigger_name;
```

If you see multiple triggers, one of them may be failing. Check each function for similar RLS issues.

## Related Files

- `supabase/migrations/20250109000002_create_user_preferences.sql` - Original migration with the problematic trigger
- `fix-user-preferences-trigger.sql` - The fix to apply
- `docs/AUTHENTICATION.md` - Full authentication documentation

## Support

If you continue to have issues:

1. Check Supabase Status: https://status.supabase.com/
2. Review Supabase Auth docs: https://supabase.com/docs/guides/auth
3. Check the Supabase Discord: https://discord.supabase.com/

## Success Indicators

After applying the fix, you should be able to:

- ✅ Sign in with Google OAuth without errors
- ✅ See your account page immediately after sign-in
- ✅ Have user preferences automatically created
- ✅ Use all BiteBuddy features normally

No more "Database error saving new user"! 🎉
