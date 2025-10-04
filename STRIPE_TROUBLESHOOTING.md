# Stripe Integration Troubleshooting - Current Status

## Problem
Stripe checkout failing on production with error: "Invalid plan selected"

## Root Cause
Environment variables not loading in Vercel production. Logs show:
```
STRIPE_PRICE_ID_YEARLY: undefined
STRIPE_PRICE_ID_MONTHLY: undefined
```

## What's Working
- ✅ Local development works fine
- ✅ Test mode was working with test keys
- ✅ Stripe keys have been rotated to new live keys
- ✅ Code is correct and has debug logging added

## Current Stripe Keys (Live Mode)

### In Stripe Dashboard (Live Mode)
- **Secret Key**: `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`
- **Publishable Key**: `pk_live_51SEDST3K8VQT04c4GvVbCmD59M5RQtKBAn5wFvaRkyzn4QxvrMzBGtEQv9FfJ1X40i5i4IZt6gq5TDWlTPsuWdrx00unlUnbYa`
- **Webhook Secret**: `whsec_YKP1qpqwsbXkGIDns8Q7yGZC6TSSzDBU`
- **Monthly Price ID**: `price_1SEDl83K8VQT04c4qhwXhu8N`
- **Yearly Price ID**: `price_1SEDnA3K8VQT04c48mISYoNR`

### Supabase
- **Service Role Key**: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12YmFza2ZiY3N4d3JrcXppenR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM2NDY4OCwiZXhwIjoyMDc0OTQwNjg4fQ.aGO1lU77kA0ldPU1GSjLX0Z3gYZy1xDfOVwRAZRk8Bw`

## Next Steps to Fix

### Option 1: Delete and Re-add Variables in Vercel (RECOMMENDED)
1. Go to Vercel → Settings → Environment Variables
2. **DELETE ALL** Stripe/Supabase variables (sometimes they get corrupted)
3. **Re-add them fresh** with exact names:
   - `STRIPE_SECRET_KEY` = `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`
   - `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` = `pk_live_51SEDST3K8VQT04c4GvVbCmD59M5RQtKBAn5wFvaRkyzn4QxvrMzBGtEQv9FfJ1X40i5i4IZt6gq5TDWlTPsuWdrx00unlUnbYa`
   - `STRIPE_WEBHOOK_SECRET` = `whsec_YKP1qpqwsbXkGIDns8Q7yGZC6TSSzDBU`
   - `STRIPE_PRICE_ID_MONTHLY` = `price_1SEDl83K8VQT04c4qhwXhu8N`
   - `STRIPE_PRICE_ID_YEARLY` = `price_1SEDnA3K8VQT04c48mISYoNR`
   - `SUPABASE_SERVICE_ROLE_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im12YmFza2ZiY3N4d3JrcXppenR0Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1OTM2NDY4OCwiZXhwIjoyMDc0OTQwNjg4fQ.aGO1lU77kA0ldPU1GSjLX0Z3gYZy1xDfOVwRAZRk8Bw`

4. **IMPORTANT**: Check "Production" for ALL variables
5. Go to Deployments → Redeploy
6. **UNCHECK** "Use existing Build Cache"
7. Wait for deployment to complete
8. Test checkout at https://bitebuddy.co.uk/account

### Option 2: Vercel CLI (Alternative)
```bash
vercel env add STRIPE_SECRET_KEY production
# Paste value when prompted
# Repeat for all 6 variables
vercel --prod
```

## How to Test After Fix
1. Go to https://bitebuddy.co.uk/account
2. Sign in with Google
3. Click "Upgrade to Premium"
4. Select Monthly or Yearly
5. Click "Upgrade Now"
6. Should redirect to Stripe checkout (not show error)

## Debug Logs Location
- Vercel Dashboard → Deployments → Latest → Functions tab
- Click on `/api/create-checkout-session` to see logs
- Look for the console.log output showing price IDs

## Recent Changes Made
- ✅ Rotated Stripe secret key
- ✅ Added debug logging to checkout route
- ✅ Improved error handling in UpgradeModal
- ✅ Updated local `.env.local` with new keys
- ✅ Created footer pages (About, Terms, Work With Us, Privacy)
- ✅ Added "Coming soon" images to product cards
- ✅ Fixed AI recipe hide/show on refresh

## Files Modified
- `src/app/api/create-checkout-session/route.ts` - Added debug logging
- `src/components/UpgradeModal.tsx` - Better error messages
- `src/app/about/page.tsx` - Created with founder story
- `src/components/Footer.tsx` - Updated with links
- `src/components/Header.tsx` - Added About Us link
- `.env.local` - Updated with new Stripe keys (not in git)

## Important Notes
- `.env.local` is NOT committed to git (in .gitignore) - this is correct for security
- Webhook endpoint is set up at: https://bitebuddy.co.uk/api/webhooks/stripe
- Stripe is in LIVE mode (accepting real payments once fixed)
- Customer Portal is enabled in Stripe dashboard
