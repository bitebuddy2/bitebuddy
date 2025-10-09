# Community Recipes Implementation Summary

## Overview
AI-generated recipes have been separated from regular recipes into their own dedicated section with a custom schema tailored to their needs.

## What Was Changed

### 1. New Sanity Schema: `communityRecipe`
**File:** `src/sanity/schemaTypes/communityRecipe.ts`

Created a simplified schema for community recipes with:
- ✅ No brand field (not needed for user-generated content)
- ✅ No brandContext field (not copycat recipes)
- ✅ Simple free-text ingredients (no ingredient references)
- ✅ Plain text steps array (no complex block structure)
- ✅ Required `createdBy` field with user info and preferences
- ✅ Rating system support
- ✅ Tips, FAQs, and nutrition info

### 2. Updated Schema Index
**File:** `src/sanity/schemaTypes/index.ts`
- Added `communityRecipe` to the schema types array

### 3. Migration Script
**File:** `scripts/migrate-ai-recipes.ts`
- Script to migrate existing AI-generated recipes from `recipe` to `communityRecipe`
- Transforms ingredient format from grouped with references to simple text
- Transforms steps from block format to plain text array
- **Run with:** `npx tsx scripts/migrate-ai-recipes.ts`

### 4. Updated API Route
**File:** `src/app/api/publish-ai-recipe/route.ts`
- Changed to create `communityRecipe` documents instead of `recipe`
- Removed brand and category references
- Simplified ingredient and step transformations

### 5. New Community Recipes Page
**File:** `src/app/community-recipes/page.tsx`
- Dedicated page for browsing community recipes
- Search functionality by recipe name, description, or creator
- Shows user attribution and cooking preferences
- Displays cooking method, spice level, and dietary preference badges

### 6. Community Recipe Detail Page
**File:** `src/app/community-recipes/[slug]/page.tsx`
- Full recipe view with all details
- User attribution prominently displayed
- Cooking preference badges
- Nutrition information
- Rating and comment support

### 7. Updated Navigation
**File:** `src/components/Header.tsx`
- Added "Community Recipes" link to the main navigation
- Available in both desktop and mobile menus

### 8. Updated Recipes Page
**File:** `src/app/recipes/page.tsx`
- Removed "Community Recipes" toggle button
- Removed search functionality (was only for community recipes)
- Now only shows regular restaurant copycat recipes
- Simplified filtering (brand and category only)

### 9. Updated RecipeCard Component
**File:** `src/components/RecipeCard.tsx`
- Added `isCommunity` prop to distinguish community recipes
- Shows "By {userName}" instead of brand for community recipes
- Links to correct route (`/community-recipes/[slug]` vs `/recipes/[slug]`)
- Uses AI placeholder image for community recipes without images

### 10. New Queries
**File:** `src/sanity/queries.ts`
- `allCommunityRecipesQuery` - Fetches all community recipes for listing page
- `communityRecipeBySlugQuery` - Fetches single community recipe by slug

## Next Steps

### 1. Deploy Schema to Sanity Studio
```bash
# This will make the new communityRecipe schema available in Sanity Studio
npm run dev
# or for production
npm run build
```

### 2. Run Migration Script (IMPORTANT)
```bash
npx tsx scripts/migrate-ai-recipes.ts
```

This will:
- Find all recipes with "AI Generated" category
- Copy them to new `communityRecipe` documents
- Delete the old recipe documents
- Transform data to match the new schema

### 3. Test the Changes
1. Visit `/community-recipes` to see the new page
2. Check Sanity Studio to see the new "Community Recipe" document type
3. Test creating a new AI recipe to verify it uses the new schema
4. Verify that `/recipes` no longer shows AI-generated recipes

## Benefits Achieved

✅ **Clean Separation in Sanity Studio**
- Community recipes appear as separate document type
- Easy to manage and distinguish from regular recipes

✅ **No Schema Conflicts**
- No more validation warnings about missing fields
- No more "step" type errors
- Proper schema for each recipe type

✅ **Simplified Schema**
- Community recipes don't have unnecessary brand/category complexity
- Free-text ingredients (no need for ingredient references)
- Plain text steps (easier for AI to generate)

✅ **Better Attribution**
- User names displayed instead of generic "Bite Buddy Kitchen"
- Cooking preferences visible on cards and detail pages

✅ **Reserved Brand**
- "Bite Buddy Kitchen" brand is now fully reserved for your future manually curated recipes (non-AI)

✅ **Improved User Experience**
- Dedicated page for community content
- Clear separation between professional and community recipes
- Search functionality specific to community recipes

## Future Enhancements
- Add ability for users to upload images for their community recipes
- Implement reporting/moderation system for community recipes
- Add filtering by cooking method, spice level, dietary preference
- Create user profiles showing all their published recipes
- Add "trending" or "popular" community recipes section
