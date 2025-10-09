# Fix: AI Recipes Security Issue - Users Seeing Other Users' Recipes

## Problem

When logging into the `/account` page, users could see **ALL** AI-generated recipes from **ALL** users, not just their own. This is a serious privacy and security issue.

## Root Causes

### 1. Overly Permissive RLS Policy (Primary Issue)

In `supabase/migrations/20250104000000_create_saved_ai_recipes.sql` lines 46-50:

```sql
CREATE POLICY "Anyone can view AI recipes for sharing"
  ON saved_ai_recipes
  FOR SELECT
  USING (true);
```

This policy allows **anyone** (including authenticated users) to view **all** AI recipes from **all** users. It was likely added to enable sharing, but it bypassed the user-specific security policy.

### 2. Missing User Filter in Query (Secondary Issue)

In `src/app/account/page.tsx` line 996 (before fix):

```typescript
supabase.from("saved_ai_recipes").select("*").order("created_at", { ascending:false })
```

This query fetched ALL recipes without filtering by `user_id`. Even though RLS should have prevented this, the overly permissive policy on line 46-50 above made it return all recipes.

## The Fix

### Step 1: Remove the Overly Permissive RLS Policy

Apply this SQL in Supabase Dashboard → SQL Editor:

```sql
-- Drop the overly permissive policy
DROP POLICY IF EXISTS "Anyone can view AI recipes for sharing" ON saved_ai_recipes;
```

After this fix, only the original user-specific policy remains (from lines 26-29):

```sql
CREATE POLICY "Users can view own AI recipes"
  ON saved_ai_recipes
  FOR SELECT
  USING (auth.uid() = user_id);
```

This ensures users can **only** see their own AI recipes on the account page.

### Step 2: Add Explicit User Filtering (Defense in Depth)

Updated `src/app/account/page.tsx` to explicitly filter by `user_id`:

```typescript
async function fetchAIRecipes() {
  // Get current user
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) {
    setLoading(false);
    return;
  }

  // Fetch only current user's recipes
  const { data } = await supabase
    .from("saved_ai_recipes")
    .select("*")
    .eq("user_id", user.id) // ✅ Explicitly filter by user_id
    .order("created_at", { ascending: false });

  setItems(data ?? []);
  setLoading(false);
}
```

This provides defense-in-depth: even if RLS policies are misconfigured, the query itself only requests the current user's data.

## How to Apply

### Apply the Database Fix

1. **Go to Supabase Dashboard:**
   👉 https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/editor

2. **Click "SQL Editor"** in the left sidebar

3. **Click "New Query"**

4. **Copy and paste this SQL:**

```sql
-- Fix AI recipes RLS to prevent users from seeing each other's recipes
DROP POLICY IF EXISTS "Anyone can view AI recipes for sharing" ON saved_ai_recipes;
```

5. **Click "Run"** (or press Ctrl+Enter)

6. You should see: **"Success. No rows returned"**

### The Code Fix (Already Applied)

The code fix in `src/app/account/page.tsx` has already been applied. No further action needed.

## How Sharing Still Works

**Q: If we removed the public policy, how can users still share AI recipes?**

**A:** The public `/ai-recipe/[id]` page uses the **Supabase service role key** which bypasses all RLS policies:

```typescript
// In src/app/ai-recipe/[id]/page.tsx
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY! // ✅ Service role bypasses RLS
);
```

This allows:
- ✅ Users can share recipe links with anyone
- ✅ Anyone with the link can view the recipe
- ❌ Users **cannot** browse other users' recipes on `/account`

This is the correct behavior for a sharing feature with privacy.

## Testing

### Test 1: Verify Users Only See Their Own Recipes

1. **Sign in with Account A**
2. Go to `/account` → "AI-Generated Recipes" tab
3. Note the recipes shown

4. **Sign out and sign in with Account B**
5. Go to `/account` → "AI-Generated Recipes" tab
6. **Expected:** Should only see Account B's recipes, NOT Account A's recipes

### Test 2: Verify Sharing Still Works

1. **Sign in with Account A**
2. Create or open an AI recipe
3. Click "Share" and copy the link (e.g., `/ai-recipe/abc-123`)

4. **Sign out or use incognito window**
5. Paste the shared link
6. **Expected:** The recipe should load and be viewable by anyone with the link

### Test 3: Verify RLS Policies

Run this query in Supabase SQL Editor to verify the policies:

```sql
SELECT
  schemaname,
  tablename,
  policyname,
  permissive,
  roles,
  cmd,
  qual
FROM pg_policies
WHERE tablename = 'saved_ai_recipes'
ORDER BY policyname;
```

**Expected policies:**

| policyname | cmd | qual |
|------------|-----|------|
| Users can delete own AI recipes | DELETE | (auth.uid() = user_id) |
| Users can insert own AI recipes | INSERT | (auth.uid() = user_id) |
| Users can update own AI recipes | UPDATE | (auth.uid() = user_id) |
| Users can view own AI recipes | SELECT | (auth.uid() = user_id) |

**Should NOT see:**
- ❌ "Anyone can view AI recipes for sharing" (this was the problematic policy)

## Impact

### Before Fix
- 🔴 **Critical Security Issue:** All users could see all AI recipes
- 🔴 **Privacy Violation:** Recipe data leaked across accounts
- 🔴 **Compliance Risk:** GDPR violation (users seeing others' personal data)

### After Fix
- ✅ **Private by Default:** Users only see their own AI recipes
- ✅ **Sharing Works:** Public sharing via direct links still functional
- ✅ **Defense in Depth:** Both RLS and query-level filtering in place
- ✅ **Compliance:** Proper data isolation between users

## Related Files

- `supabase/migrations/20250104000000_create_saved_ai_recipes.sql` - Original migration with problematic policy
- `src/app/account/page.tsx` - Fixed to add explicit user filtering (line 996)
- `src/app/ai-recipe/[id]/page.tsx` - Public sharing page (uses service role key)
- `fix-ai-recipes-rls.sql` - SQL fix to apply
- `FIX_AI_RECIPES_SECURITY.md` - This document

## Lessons Learned

1. **Never use `USING (true)` for RLS policies** unless you explicitly want public read access
2. **Always test RLS policies with multiple user accounts** before deploying
3. **Use explicit user filtering in queries** as defense-in-depth
4. **Separate public sharing from private data access:**
   - Private views: Use RLS with user-specific policies
   - Public sharing: Use service role key on dedicated public routes
5. **Document why permissive policies exist** if they're truly needed

## Prevention for Future

When adding new tables with user data:

1. **Always enable RLS:** `ALTER TABLE table_name ENABLE ROW LEVEL SECURITY;`
2. **Start restrictive:** Only allow users to see their own data
3. **Add permissions explicitly:** Don't default to public access
4. **Test with multiple accounts:** Sign in with different users and verify isolation
5. **Use `.eq("user_id", user.id)` in queries** as an additional safety measure
6. **Review all SELECT policies** periodically to ensure no overly permissive rules

## Success Indicators

After applying the fix:

- ✅ Users only see their own AI recipes on `/account` page
- ✅ Shared recipe links still work for anyone with the URL
- ✅ No console errors or unexpected behavior
- ✅ RLS policies pass the verification query above

If you see any issues, check:
1. Supabase logs: https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/logs/postgres-logs
2. Browser console for errors
3. Network tab to see actual query results
