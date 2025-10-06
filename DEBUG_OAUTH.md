# Debug: Why OAuth Still Shows Supabase Domain

## Let's Check What's Actually Being Sent

We need to see which Client ID is actually being used in the OAuth request.

### Step 1: Inspect the OAuth Request

1. Go to https://bitebuddy.co.uk/account
2. Open DevTools (F12)
3. Go to **Network** tab
4. Click **"Sign in with Google"**
5. Look for a request to `accounts.google.com` in the Network tab
6. Click on that request
7. Look at the **Request URL**

**In the URL, you should see:** `client_id=XXXXX`

**Tell me what the client_id value is:**
- Is it: `942085806317-9rv9fs4lk0b2qnbj5e2bajd8rttrabkq.apps.googleusercontent.com` ✅ (YOUR client)
- Or is it something else? ❌ (Supabase default)

This will tell us definitively whether Supabase is using your custom credentials or not.

---

## If the client_id is WRONG (not yours)

That means Supabase is NOT using your custom credentials. Check:

### In Supabase Settings:

Go to: https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/settings/auth

Scroll to where you see Google configuration.

**Look very carefully for ANY toggle, checkbox, or switch that says:**
- "Use custom OAuth credentials"
- "Enable custom client"
- "Override default credentials"
- Or anything similar

**It might be:**
- A toggle switch (ON/OFF)
- A checkbox (☐/☑)
- A radio button

**Make sure it's turned ON/checked!**

---

## If the client_id is CORRECT (matches yours)

But you still see the Supabase domain, then the issue is in Google Cloud Console:

### Check Authorized Domains in Google Cloud Console:

1. Go to: https://console.cloud.google.com/apis/credentials/consent
2. Click "Branding"
3. Scroll to **"Authorized domains"**

**Make sure you have BOTH:**
- `bitebuddy.co.uk` ✅
- `supabase.co` ✅

If `supabase.co` is missing, Google might be using a fallback URL.

---

## Screenshot Request

Can you take a screenshot of:

1. **The Supabase Google provider settings** (the page where you see the Client ID and Secret)
   - Especially show if there are any toggles/checkboxes above or below the Client ID field

2. **The Network tab** showing the OAuth request URL with the client_id parameter visible

This will help me see exactly what's happening!
