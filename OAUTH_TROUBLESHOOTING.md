# OAuth Troubleshooting - Still Showing Supabase Domain

## Problem
You're still seeing "Choose an account to continue to mvbaskfbcsxwrkqziztt.supabase.co" even after setting up custom OAuth.

## Most Common Causes

### 1. Custom OAuth Credentials Not Enabled in Supabase ⚠️ MOST LIKELY

**Check this first:**

1. Go to: https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/settings/auth
2. Scroll down to **Auth Providers** section
3. Find **Google** in the list
4. Make sure you see these toggles:

```
☑️ Enable Sign in with Google
☑️ Use custom OAuth credentials
```

**BOTH must be toggled ON!**

If "Use custom OAuth credentials" is OFF, Supabase uses their default credentials (which shows the Supabase domain).

---

### 2. Wrong Credentials in Supabase

**Verify your credentials are entered correctly:**

In the Google provider section, you should see:

```
Authorized Client ID:
[YOUR-PROJECT-ID].apps.googleusercontent.com

☑️ Use custom OAuth credentials

OAuth client ID:
[YOUR-PROJECT-ID].apps.googleusercontent.com

OAuth client secret:
GOCSPX-xxxxxxxxxxxxxxxxxxxxx
```

**Common mistakes:**
- ❌ Entered the Client Secret in the Client ID field
- ❌ Copy-pasted with extra spaces
- ❌ Only filled in "Authorized Client ID" but not "OAuth client ID"
- ❌ Forgot to click "Save" at the bottom

---

### 3. Browser Cache

**Clear your browser cache:**

1. Open browser DevTools (F12)
2. Go to **Application** tab (Chrome) or **Storage** tab (Firefox)
3. Expand **Cookies** in left sidebar
4. Delete all cookies for your site
5. Or: Right-click refresh → "Empty Cache and Hard Reload"
6. Or: Try in Incognito/Private window

---

### 4. Supabase Changes Not Propagated Yet

**Wait 5-10 minutes:**
- Supabase may take a few minutes to apply changes
- Google OAuth may cache the old settings

**Try:**
- Wait 10 minutes
- Try signing in again
- Use a different browser or incognito mode

---

## Step-by-Step Verification Checklist

### ✅ Step 1: Verify Google Cloud Console

Go to: https://console.cloud.google.com/apis/credentials

**Check:**
- [ ] You have an OAuth 2.0 Client ID created
- [ ] Name is "BiteBuddy Production" (or similar)
- [ ] Type is "Web application"
- [ ] You can see the Client ID (ends with .apps.googleusercontent.com)

**Click on your OAuth client to edit it:**

**JavaScript origins should include:**
- [ ] https://bitebuddy.co.uk
- [ ] https://www.bitebuddy.co.uk

**Redirect URIs should include:**
- [ ] https://mvbaskfbcsxwrkqziztt.supabase.co/auth/v1/callback

⚠️ **If the redirect URI is missing or wrong, add it and click Save**

---

### ✅ Step 2: Verify Supabase Configuration

Go to: https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/settings/auth

**Scroll to "Auth Providers"**

**Find "Google" and verify:**

1. **Is "Enable Sign in with Google" toggled ON?**
   - [ ] Yes (green toggle)
   - [ ] No (grey toggle) ← **TURN IT ON**

2. **Is "Use custom OAuth credentials" toggled ON?**
   - [ ] Yes (green toggle)
   - [ ] No (grey toggle) ← **TURN IT ON**

3. **Are both Client ID fields filled in?**
   - [ ] "Authorized Client ID" has your Client ID
   - [ ] "OAuth client ID" has your Client ID (same value)

4. **Is "OAuth client secret" filled in?**
   - [ ] Yes, starts with GOCSPX-
   - [ ] No ← **ADD IT**

5. **Did you click "Save" at the bottom?**
   - [ ] Yes
   - [ ] No ← **CLICK SAVE NOW**

---

### ✅ Step 3: Get Fresh Credentials

If you're not sure your credentials are correct, get them again:

1. Go to: https://console.cloud.google.com/apis/credentials
2. Find your "BiteBuddy Production" OAuth client
3. Click on it
4. You'll see **Client ID** on the page
5. For the **Client Secret**:
   - Click "Add Secret" or "Reset Secret"
   - Copy the new secret
6. Go back to Supabase and paste both values again

---

### ✅ Step 4: Test with Network Tab

Let's see what's actually happening:

1. Open your site: https://bitebuddy.co.uk/account
2. Open DevTools (F12)
3. Go to **Network** tab
4. Click "Sign in with Google"
5. Look for a request to Google

**What to look for:**

In the request URL, you should see:
```
client_id=YOUR-PROJECT-ID.apps.googleusercontent.com
```

**If you see:**
```
client_id=123456789.apps.googleusercontent.com (some random number)
```
This means Supabase is using the default credentials!

**Fix:** Go back to Supabase and make sure "Use custom OAuth credentials" is ON

---

## Screenshot Guide: What It Should Look Like

### In Supabase (Auth Providers → Google):

```
┌─────────────────────────────────────────────────────┐
│ Google                                               │
├─────────────────────────────────────────────────────┤
│                                                      │
│ ☑️ Enable Sign in with Google                      │
│                                                      │
│ Authorized Client ID (for authorized redirect URIs) │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 123456-abc.apps.googleusercontent.com          │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ ☑️ Use custom OAuth credentials                    │
│                                                      │
│ OAuth client ID                                      │
│ ┌─────────────────────────────────────────────────┐ │
│ │ 123456-abc.apps.googleusercontent.com          │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ OAuth client secret                                  │
│ ┌─────────────────────────────────────────────────┐ │
│ │ GOCSPX-xxxxxxxxxxxxxxxxxxxxxxx                 │ │
│ └─────────────────────────────────────────────────┘ │
│                                                      │
│ [Save]                                              │
└─────────────────────────────────────────────────────┘
```

**IMPORTANT:** Both checkboxes must be ☑️ (checked/green)

---

## Common Mistakes & Fixes

### Mistake 1: "Use custom OAuth credentials" is OFF
**Fix:** Toggle it ON, paste credentials, click Save

### Mistake 2: Only filled "Authorized Client ID"
**Fix:** Also fill "OAuth client ID" and "OAuth client secret"

### Mistake 3: Credentials in wrong fields
**Fix:**
- Client ID goes in both "Authorized Client ID" and "OAuth client ID"
- Client Secret (GOCSPX-) goes in "OAuth client secret"

### Mistake 4: Forgot to Save
**Fix:** Scroll to bottom, click "Save"

### Mistake 5: Wrong Google Cloud project
**Fix:** Make sure you're looking at the right project in Google Cloud Console

---

## Quick Test

After fixing:

1. **Clear browser cache completely**
2. **Wait 5 minutes**
3. **Open incognito window**
4. **Go to:** https://bitebuddy.co.uk/account
5. **Click "Sign in with Google"**

**Expected result:**
```
Choose an account to continue to
BiteBuddy
```

**If you still see:**
```
Choose an account to continue to
mvbaskfbcsxwrkqziztt.supabase.co
```

Then "Use custom OAuth credentials" is definitely not enabled in Supabase.

---

## Emergency Debug Steps

### Option 1: Double-Check Everything

Go through this checklist one more time:
1. [ ] Google OAuth client exists
2. [ ] Redirect URI includes: https://mvbaskfbcsxwrkqziztt.supabase.co/auth/v1/callback
3. [ ] Copied Client ID correctly (no spaces)
4. [ ] Copied Client Secret correctly (no spaces)
5. [ ] "Enable Sign in with Google" is ON in Supabase
6. [ ] "Use custom OAuth credentials" is ON in Supabase
7. [ ] Both Client ID and Client Secret pasted in Supabase
8. [ ] Clicked "Save" in Supabase
9. [ ] Waited 5 minutes
10. [ ] Cleared browser cache

### Option 2: Start Fresh

If nothing works:
1. In Supabase, toggle "Use custom OAuth credentials" OFF
2. Click Save
3. Wait 1 minute
4. Toggle "Use custom OAuth credentials" ON
5. Re-paste Client ID and Secret
6. Click Save
7. Wait 5 minutes
8. Test again

### Option 3: Create New OAuth Client

In Google Cloud Console:
1. Create a NEW OAuth client ID
2. Name it "BiteBuddy Production v2"
3. Add the same redirect URIs
4. Get the new Client ID and Secret
5. Paste into Supabase
6. Test

---

## What To Send Me If Still Not Working

If you've tried everything and it's still not working, take screenshots of:

1. **Supabase Auth Settings:**
   - Screenshot of the Google provider section
   - Make sure I can see the toggles and fields

2. **Google Cloud Console:**
   - Screenshot of your OAuth client configuration
   - Make sure I can see the redirect URIs

3. **Browser Network Tab:**
   - Screenshot of the OAuth request showing the client_id

This will help me diagnose the exact issue!

---

## The Most Likely Issue

Based on the symptoms, **99% chance** it's one of these:

1. ❌ "Use custom OAuth credentials" toggle is OFF
2. ❌ Credentials are in wrong fields
3. ❌ Didn't click "Save"
4. ❌ Browser cache showing old OAuth screen

**Go to Supabase auth settings RIGHT NOW and double-check that toggle is ON!**
