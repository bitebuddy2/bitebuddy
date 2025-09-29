# Automatic Nutrition Recalculation Setup

This guide explains how to set up automatic nutrition recalculation for your BiteBuddy recipes using Sanity webhooks.

## What This Does

When you update a recipe or ingredient in Sanity Studio, the system will automatically recalculate the nutrition information for affected recipes. No more manual API calls!

## Prerequisites

✅ Your API endpoints are already set up:
- `/api/recalc-nutrition` - Recalculates nutrition for a specific recipe
- `/api/recalc-nutrition/ingredient-changed` - Recalculates nutrition for all recipes using a changed ingredient

✅ Your environment variables are configured:
- `NUTRITION_WEBHOOK_SECRET=nutrition-webhook-secret-2024` (for security)

## Development Setup with ngrok

For development, Sanity webhooks can't call localhost URLs. Use ngrok to create a public tunnel:

**Quick Start**: See [NGROK_WEBHOOK_GUIDE.md](./NGROK_WEBHOOK_GUIDE.md) for step-by-step ngrok setup.

## Manual Webhook Setup (After ngrok is running)

Follow these steps to set up webhooks manually through the Sanity Dashboard:

### 1. Access Sanity Dashboard

1. Go to [https://www.sanity.io/manage](https://www.sanity.io/manage)
2. Select your project: **Bite Buddy Studio** (ID: `6yu50an1`)
3. Go to **API** tab in the left sidebar
4. Click on **Webhooks**

### 2. Create Recipe Webhook

Click **"Add webhook"** and configure:

**Basic Settings:**
- **Name**: `Nutrition Recalc - Recipe Changes`
- **Description**: `Automatically recalculate nutrition when recipes are modified`
- **URL**: `https://YOUR-NGROK-URL.ngrok-free.app/api/recalc-nutrition?secret=nutrition-webhook-secret-2024`
  - Replace `YOUR-NGROK-URL` with your actual ngrok URL
  - For production: Use your live domain instead of ngrok
- **HTTP method**: `POST`

**Trigger Settings:**
- **Dataset**: `production`
- **Filter**: `_type == "recipe"`
- **Include drafts**: `false` (unchecked)

**Advanced Settings:**
- **Headers**: Add `Content-Type: application/json`

### 3. Create Ingredient Webhook

Click **"Add webhook"** again and configure:

**Basic Settings:**
- **Name**: `Nutrition Recalc - Ingredient Changes`
- **Description**: `Recalculate nutrition for all recipes when ingredients are modified`
- **URL**: `https://YOUR-NGROK-URL.ngrok-free.app/api/recalc-nutrition/ingredient-changed?secret=nutrition-webhook-secret-2024`
  - Replace `YOUR-NGROK-URL` with your actual ngrok URL
  - For production: Use your live domain instead of ngrok
- **HTTP method**: `POST`

**Trigger Settings:**
- **Dataset**: `production`
- **Filter**: `_type == "ingredient"`
- **Include drafts**: `false` (unchecked)

**Advanced Settings:**
- **Headers**: Add `Content-Type: application/json`

## Testing the Setup

### Test Recipe Changes

1. **Start your dev server**: `npm run dev`
2. **Edit a recipe** in Sanity Studio (`http://localhost:3000/studio`)
3. **Check your server logs** - you should see nutrition recalculation messages
4. **Verify the recipe's nutrition field** was updated

### Test Ingredient Changes

1. **Edit an ingredient** in Sanity Studio
2. **Check server logs** - you should see multiple recipes being updated
3. **Verify affected recipes** have updated nutrition

### Manual Testing

You can also test the endpoints directly:

```bash
# Test single recipe recalculation
curl -X POST http://localhost:3000/api/recalc-nutrition?secret=nutrition-webhook-secret-2024 \\
  -H "Content-Type: application/json" \\
  -d '{"recipeId": "your-recipe-id"}'

# Test ingredient change (recalculates all affected recipes)
curl -X POST http://localhost:3000/api/recalc-nutrition/ingredient-changed?secret=nutrition-webhook-secret-2024 \\
  -H "Content-Type: application/json" \\
  -d '{"ingredientId": "your-ingredient-id"}'
```

## Production Deployment

When deploying to production:

1. **Update webhook URLs** in Sanity Dashboard to use your production domain
2. **Set environment variables** on your hosting platform:
   ```
   NUTRITION_WEBHOOK_SECRET=nutrition-webhook-secret-2024
   NEXT_PUBLIC_SITE_URL=https://your-domain.com
   ```

## Troubleshooting

### Webhooks Not Firing

1. **Check webhook status** in Sanity Dashboard - should show "Active"
2. **Verify URL is accessible** from external sources (not just localhost)
3. **Check server logs** for incoming webhook requests
4. **Ensure secret matches** between webhooks and environment variable

### Nutrition Not Updating

1. **Check API endpoint logs** for errors
2. **Verify recipe has valid ingredients** with nutrition data
3. **Check ingredient references** are properly linked
4. **Ensure recipe has valid `servings` count**

### Webhook Delivery Failures

1. **Check webhook delivery logs** in Sanity Dashboard
2. **Verify server is running** and accessible
3. **Check for SSL/HTTPS requirements** in production
4. **Ensure webhook secret is correct**

## Security Notes

- The webhook secret (`NUTRITION_WEBHOOK_SECRET`) protects your endpoints from unauthorized access
- Only set up webhooks for your actual domain, not localhost, in production
- Consider rate limiting if you have many simultaneous updates

## How It Works

1. **Recipe Update**: User modifies a recipe → Webhook fires → Single recipe nutrition recalculated
2. **Ingredient Update**: User modifies an ingredient → Webhook fires → All recipes using that ingredient get recalculated
3. **Automatic Updates**: No manual intervention needed - nutrition stays in sync automatically

The system is designed to be efficient, only recalculating what's necessary when changes occur.