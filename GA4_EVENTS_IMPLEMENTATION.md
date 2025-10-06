# GA4 Custom Events Implementation

## Overview
This document describes the custom Google Analytics 4 (GA4) events implemented in the BiteBuddy application for tracking user interactions and conversions.

## Implemented Events

### 1. affiliate_click
**Already Implemented** ✅

Tracks when users click on affiliate links to purchase ingredients.

**Parameters:**
- `recipe` - Name of the recipe
- `ingredient` - Ingredient being purchased
- `retailer` - Retailer name (e.g., "Tesco", "Asda")
- `dest_domain` - Destination domain
- `brand` - Brand name (optional)

**Location:** `src/lib/analytics.ts`

---

### 2. save_recipe
**Newly Implemented** ✅

Tracks when users save recipes to their account.

**Parameters:**
- `recipe_slug` - Unique slug of the recipe
- `recipe_title` - Title of the recipe (optional)

**Implementation:**
- Function: `trackSaveRecipe()` in `src/lib/analytics.ts`
- Component: `src/components/SaveButton.tsx`
- Triggered: When a user successfully saves a recipe (not on unsave)

---

### 3. generate_ai_recipe
**Newly Implemented** ✅

Tracks AI recipe generation attempts (both successful and failed).

**Parameters:**
- `prompt` - User's input prompt
- `success` - Boolean indicating success/failure
- `recipe_title` - Generated recipe title (on success)
- `method` - Cooking method selected (if not "Any")
- `portions` - Number of portions
- `diet` - Dietary preference selected (if not "None")

**Implementation:**
- Function: `trackGenerateAIRecipe()` in `src/lib/analytics.ts`
- Component: `src/components/IngredientFinder.tsx`
- Triggered:
  - On successful recipe generation
  - On failed generation (errors, rate limits, etc.)

---

## Files Modified

### 1. `src/lib/analytics.ts`
- Added `trackSaveRecipe()` function
- Added `trackGenerateAIRecipe()` function

### 2. `src/components/SaveButton.tsx`
- Imported `trackSaveRecipe` from analytics
- Added `recipeTitle` prop to component interface
- Called `trackSaveRecipe()` after successful save

### 3. `src/components/IngredientFinder.tsx`
- Imported `trackGenerateAIRecipe` from analytics
- Tracks successful AI recipe generation with full details
- Tracks failed generation attempts (rate limits, errors)

---

## Usage in GA4

These events will appear in your GA4 console under:
- **Reports** → **Engagement** → **Events**
- **Explore** → Create custom reports using these events

### Recommended GA4 Conversions
Consider marking these as conversions in GA4:
1. `affiliate_click` - Revenue potential
2. `save_recipe` - User engagement
3. `generate_ai_recipe` (where success=true) - Feature usage

### Sample GA4 Exploration Queries

**AI Recipe Success Rate:**
```
Event: generate_ai_recipe
Dimension: success
Metric: Event count
```

**Most Popular Cooking Methods:**
```
Event: generate_ai_recipe
Dimension: method
Metric: Event count
Filter: success = true
```

**Recipe Save Rate:**
```
Event: save_recipe
Metric: Total users, Event count
```

---

## Testing

To verify events are firing:

1. Open your site in a browser
2. Open Developer Tools (F12)
3. Go to Network tab, filter by "collect"
4. Perform an action (save recipe, generate AI recipe, click affiliate link)
5. Check the network request for `gtag/collect` with your event parameters

Alternatively, use **Google Analytics Debugger** Chrome extension for real-time event monitoring.

---

## Next Steps

1. ✅ Deploy these changes to production
2. ✅ Wait 24-48 hours for data to populate in GA4
3. Monitor event counts in GA4 Real-time reports
4. Create custom reports/dashboards for these events
5. Set up conversion tracking if needed
6. Consider setting up GA4 audiences based on these events
