# Stripe Integration Setup Guide

This guide will help you set up Stripe payments and subscriptions for Bite Buddy.

## Prerequisites

- Stripe account (sign up at https://stripe.com)
- Supabase project with database access
- Environment variables configured

## Step 1: Create Stripe Product & Prices

1. Go to Stripe Dashboard → Products
2. Click "Add Product"
3. Enter product details:
   - Name: "Bite Buddy Premium"
   - Description: "Unlock unlimited AI recipes, 14-day meal planner, and ad-free experience"

4. **Add Monthly Price:**
   - Click "Add another price"
   - Pricing model: Recurring
   - Billing period: Monthly
   - Price: £4.99 GBP
   - Save and copy the **Price ID** (starts with `price_`)

5. **Add Yearly Price:**
   - Click "Add another price"
   - Pricing model: Recurring
   - Billing period: Yearly
   - Price: £39 GBP
   - Save and copy the **Price ID** (starts with `price_`)

6. Add both price IDs to your `.env.local`:
   ```
   STRIPE_PRICE_ID_MONTHLY=price_xxxxxxxxxxxxx
   STRIPE_PRICE_ID_YEARLY=price_xxxxxxxxxxxxx
   ```

## Step 2: Get Stripe API Keys

1. Go to Stripe Dashboard → Developers → API Keys
2. Copy the **Publishable key** and add to `.env.local`:
   ```
   NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_xxxxxxxxxxxxx
   ```
3. Copy the **Secret key** and add to `.env.local`:
   ```
   STRIPE_SECRET_KEY=sk_test_xxxxxxxxxxxxx
   ```

## Step 3: Set Up Webhook

1. Go to Stripe Dashboard → Developers → Webhooks
2. Click "Add endpoint"
3. Enter webhook URL:
   - For production: `https://yourdomain.com/api/webhooks/stripe`
   - For development: Use ngrok or Stripe CLI
4. Select events to listen to:
   - `checkout.session.completed`
   - `customer.subscription.updated`
   - `customer.subscription.deleted`
   - `invoice.payment_failed`
5. Click "Add endpoint"
6. Copy the **Signing secret** and add to `.env.local`:
   ```
   STRIPE_WEBHOOK_SECRET=whsec_xxxxxxxxxxxxx
   ```

## Step 4: Run Supabase Migrations

Run the SQL migrations to create the required database tables:

```bash
# Connect to your Supabase database and run:
# 1. supabase/migrations/add_user_subscriptions.sql
# 2. supabase/migrations/add_ai_generation_tracking.sql
```

Or use the Supabase SQL Editor to paste and run the contents of each migration file.

## Step 5: Testing with Stripe CLI (Development)

For local development, use Stripe CLI to forward webhooks:

```bash
# Install Stripe CLI
# https://stripe.com/docs/stripe-cli

# Login
stripe login

# Forward webhooks to local server
stripe listen --forward-to localhost:3000/api/webhooks/stripe
```

The CLI will output a webhook signing secret (starts with `whsec_`). Use this for `STRIPE_WEBHOOK_SECRET` in development.

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Sign in to your account
3. Click "Upgrade to Premium"
4. **Choose a plan:**
   - Monthly: £4.99/month
   - Yearly: £39/year (35% savings)
5. Use Stripe test card: `4242 4242 4242 4242`
   - Any future expiry date
   - Any 3-digit CVC
   - Any billing details
6. Complete checkout
7. Verify:
   - User is redirected back to account page
   - Premium badge appears
   - 14-day meal planner is accessible
   - AI recipe generator is unlimited

## Test Cards

- **Success**: 4242 4242 4242 4242
- **Decline**: 4000 0000 0000 0002
- **Requires authentication**: 4000 0025 0000 3155

## Premium Features

Once subscribed, users get:

✅ **14-Day Meal Planner** (Free: 3 days)
✅ **Unlimited AI Recipe Generator** (Free: 1/day)
✅ **Ad-Free Experience**
✅ **Save Recipes** (Free users can also save recipes)
✅ **Priority Support**

## Subscription Management

Users can manage their subscription (update payment method, cancel, etc.) by clicking "Manage Subscription" on their account page. This opens the Stripe Customer Portal.

## Production Checklist

Before going live:

- [ ] Switch to Stripe live mode keys
- [ ] Update webhook endpoint to production URL
- [ ] Set `NEXT_PUBLIC_SITE_URL` to production domain
- [ ] Test live mode subscription flow
- [ ] Enable Stripe Customer Portal in Dashboard
- [ ] Set up billing email notifications in Stripe

## Troubleshooting

**Webhooks not working?**
- Check webhook signing secret matches `.env.local`
- Verify endpoint URL is correct
- Check Stripe Dashboard → Webhooks for failed deliveries
- View server logs for errors

**Subscription not activating?**
- Check `user_subscriptions` table in Supabase
- Verify webhook events are being received
- Check server logs for API errors

**Rate limiting not working?**
- Verify `ai_generation_log` table exists
- Check user is logged in when generating recipes
- Ensure userId is being passed to API

## Support

For Stripe support: https://support.stripe.com
For integration issues: Check server logs and Stripe Dashboard webhooks section
