# Google OAuth Setup - Detailed Step-by-Step Guide

## Part 1: Set Up OAuth Consent Screen with Your Branding

### Step 1: Access OAuth Consent Screen

1. Go to **Google Cloud Console**: https://console.cloud.google.com/
2. Make sure your "BiteBuddy" project is selected (top left dropdown)
3. In the left sidebar, click: **APIs & Services** → **OAuth consent screen**
4. You'll see a page asking you to configure the consent screen

---

### Step 2: Choose User Type

You'll see two options:

- **Internal** - Only for Google Workspace users (you probably don't have this)
- **External** - For everyone (choose this one)

✅ Select **External**
Click **CREATE**

---

### Step 3: Configure OAuth Consent Screen - Page 1 (App Information)

Now you'll see a form with multiple sections. Fill it out **exactly** as shown below:

#### **App information** section:

**App name** (required)
```
BiteBuddy
```
This is what users will see: "Choose an account to continue to BiteBuddy"

**User support email** (required)
- Click the dropdown
- Select your email address

**App logo** (optional but recommended)
- Click "Choose File"
- Upload an image:
  - Format: PNG or JPG
  - Size: 120x120 pixels minimum
  - Must be square
  - Shows next to your app name in the OAuth screen
- If you don't have a logo, skip this for now (you can add it later)

---

#### **App domain** section:

**Application home page** (optional but recommended)
```
https://bitebuddy.uk
```

**Application privacy policy link** (required)
```
https://bitebuddy.uk/privacy
```
⚠️ This MUST be a working URL. Make sure your privacy page is live!

**Application terms of service link** (optional)
```
https://bitebuddy.uk/terms
```
If you don't have a terms page, you can skip this or create one

---

#### **Authorized domains** section:

This tells Google which domains your app uses.

Click **+ ADD DOMAIN**

**Domain 1:**
```
bitebuddy.uk
```
⚠️ Don't include "https://" or "www." - just the domain

Click **+ ADD DOMAIN** again

**Domain 2:**
```
supabase.co
```
This is needed because the redirect goes through Supabase

---

#### **Developer contact information** section:

**Email addresses** (required)
```
your-email@gmail.com
```
Enter your email address (can add multiple, separated by commas)

---

Click **SAVE AND CONTINUE** at the bottom

---

### Step 4: Configure OAuth Consent Screen - Page 2 (Scopes)

This page is about what data your app can access.

**For basic authentication, you don't need to add anything here.**

The default scopes are:
- `.../auth/userinfo.email`
- `.../auth/userinfo.profile`
- `openid`

These are automatically included and are all you need for sign-in.

✅ Just click **SAVE AND CONTINUE** (don't add any scopes)

---

### Step 5: Configure OAuth Consent Screen - Page 3 (Test Users)

This page lets you add specific users who can test your app before it's verified.

**For now, you can skip this.**

✅ Click **SAVE AND CONTINUE**

---

### Step 6: Summary

Review your settings. You should see:
- ✅ App name: BiteBuddy
- ✅ Privacy policy: https://bitebuddy.uk/privacy
- ✅ Authorized domains: bitebuddy.uk, supabase.co

✅ Click **BACK TO DASHBOARD**

Your OAuth consent screen is now configured! 🎉

---

## Part 2: Create OAuth Credentials

Now we need to create the actual credentials (Client ID and Secret).

### Step 1: Go to Credentials Page

In the left sidebar, click: **APIs & Services** → **Credentials**

---

### Step 2: Create OAuth Client ID

At the top of the page, click the **+ CREATE CREDENTIALS** button

From the dropdown, select: **OAuth client ID**

---

### Step 3: Configure OAuth Client

You'll see a form. Fill it out:

#### **Application type** (required)
- Click the dropdown
- Select: **Web application**

---

#### **Name** (required)
```
BiteBuddy Production
```
This is just for your reference in the Google Cloud Console

---

#### **Authorized JavaScript origins**

This is where your app is hosted.

Click **+ ADD URI**

**URI 1:**
```
https://bitebuddy.uk
```

Click **+ ADD URI** again

**URI 2:**
```
https://www.bitebuddy.uk
```
(in case users visit with www)

**For local development, also add:**

Click **+ ADD URI** again

**URI 3:**
```
http://localhost:3000
```

---

#### **Authorized redirect URIs**

This is where Google sends users after they sign in.

Click **+ ADD URI**

**URI 1 (MOST IMPORTANT):**
```
https://mvbaskfbcsxwrkqziztt.supabase.co/auth/v1/callback
```
⚠️ **This MUST be exact!** Copy it carefully.
- Must include `https://`
- Must include `/auth/v1/callback` at the end
- Must match your Supabase project URL exactly

**For local development, also add:**

Click **+ ADD URI** again

**URI 2:**
```
http://localhost:3000/auth/callback
```

---

#### Review your settings:

Your form should now look like this:

```
Application type: Web application
Name: BiteBuddy Production

Authorized JavaScript origins:
  https://bitebuddy.uk
  https://www.bitebuddy.uk
  http://localhost:3000

Authorized redirect URIs:
  https://mvbaskfbcsxwrkqziztt.supabase.co/auth/v1/callback
  http://localhost:3000/auth/callback
```

✅ Click **CREATE** at the bottom

---

## Part 3: Copy the Client ID and Client Secret

### Step 1: The Popup

After clicking CREATE, you'll see a popup titled **"OAuth client created"**

⚠️ **This is the MOST IMPORTANT part!**

The popup shows:

```
Your Client ID
1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com

Your Client Secret
GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ12
```

(Your actual values will be different)

---

### Step 2: Copy These Values

**Method 1: Use the copy buttons**
- Click the 📋 copy icon next to each value
- Paste them into a temporary text file

**Method 2: Select and copy**
- Click and drag to select the Client ID
- Press Ctrl+C (Windows) or Cmd+C (Mac)
- Paste into a text file
- Repeat for Client Secret

---

### Step 3: Save These Somewhere Safe

Create a temporary text file on your desktop:

```
GOOGLE OAUTH CREDENTIALS FOR BITEBUDDY
========================================

Client ID:
1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com

Client Secret:
GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ12

Date created: [today's date]
```

⚠️ **Security notes:**
- Don't share these publicly
- Don't commit to Git
- The Client ID is safe to expose (users see it)
- The Client Secret must stay private!

---

### Step 4: Close the Popup

Click **OK** to close the popup

**Don't worry if you lose these values!**
- You can always view the Client ID in the Credentials page
- You can create a new Client Secret if needed

---

## What Each Credential Does

### Client ID
```
1234567890-abcdefghijklmnopqrstuvwxyz123456.apps.googleusercontent.com
```
- **Public** - Users can see this
- Identifies your app to Google
- Used in the OAuth request
- Like a "username" for your app

### Client Secret
```
GOCSPX-aBcDeFgHiJkLmNoPqRsTuVwXyZ12
```
- **Private** - Must be kept secret
- Proves your app is legitimate
- Used by Supabase to communicate with Google
- Like a "password" for your app

---

## Next: Add These to Supabase

Now that you have your credentials, follow these steps:

### 1. Go to Supabase Dashboard
```
https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/settings/auth
```

### 2. Scroll down to "Auth Providers"

Find **Google** in the list

### 3. Enable and Configure

Toggle **ON**: "Enable Sign in with Google"

You'll see a form with two fields:

**Authorized Client ID:**
```
Paste your Client ID here
(the long one ending in .apps.googleusercontent.com)
```

Toggle **ON**: "Use custom OAuth credentials"

Two new fields appear:

**OAuth client ID:**
```
Paste your Client ID here again
(same value as above)
```

**OAuth client secret:**
```
Paste your Client Secret here
(the one starting with GOCSPX-)
```

### 4. Save

Click **Save** at the bottom of the page

---

## Visual Example

Here's what your Google Cloud Console should look like:

### OAuth Consent Screen:
```
┌─────────────────────────────────────────┐
│ OAuth consent screen                     │
├─────────────────────────────────────────┤
│ App name: BiteBuddy                     │
│ User support email: you@gmail.com       │
│ Logo: [your-logo.png]                   │
│                                          │
│ App domain:                              │
│ Home page: https://bitebuddy.uk         │
│ Privacy: https://bitebuddy.uk/privacy   │
│ Terms: https://bitebuddy.uk/terms       │
│                                          │
│ Authorized domains:                      │
│ • bitebuddy.uk                          │
│ • supabase.co                           │
│                                          │
│ Developer contact: you@gmail.com        │
└─────────────────────────────────────────┘
```

### Credentials:
```
┌─────────────────────────────────────────┐
│ OAuth 2.0 Client IDs                     │
├─────────────────────────────────────────┤
│ Name: BiteBuddy Production              │
│ Type: Web application                    │
│                                          │
│ Client ID:                               │
│ 1234...apps.googleusercontent.com       │
│                                          │
│ JavaScript origins:                      │
│ • https://bitebuddy.uk                  │
│ • https://www.bitebuddy.uk              │
│ • http://localhost:3000                 │
│                                          │
│ Redirect URIs:                           │
│ • https://mvbask...supabase.co/auth/... │
│ • http://localhost:3000/auth/callback   │
└─────────────────────────────────────────┘
```

---

## Testing Your Setup

### 1. Clear Browser Cache
- Press F12 (open DevTools)
- Right-click the refresh button
- Click "Empty Cache and Hard Reload"

### 2. Test Sign In
- Go to: https://bitebuddy.uk/account
- Click "Sign in with Google"

### 3. What You Should See

**Before (with Supabase default):**
```
Choose an account to continue to
mvbaskfbcsxwrkqziztt.supabase.co
```

**After (with your custom OAuth):**
```
[Your Logo]
Choose an account to continue to
BiteBuddy
```

Much better! 🎉

---

## Troubleshooting

### "Error 400: redirect_uri_mismatch"

**Cause:** The redirect URI doesn't match exactly

**Fix:**
1. Go to Google Cloud Console → Credentials
2. Click your OAuth client ID
3. Check that this URI is listed EXACTLY:
   ```
   https://mvbaskfbcsxwrkqziztt.supabase.co/auth/v1/callback
   ```
4. No extra slashes, spaces, or characters
5. Save and wait 5 minutes

### Still shows Supabase domain

**Cause:** Using old credentials or cache

**Fix:**
1. Check Supabase has "Use custom OAuth credentials" enabled
2. Clear browser cookies completely
3. Try in incognito/private window
4. Wait 10 minutes for changes to propagate

### "This app isn't verified"

**Cause:** Normal for new OAuth apps

**Fix:**
This is expected! Users can still sign in by clicking:
- "Advanced" → "Go to BiteBuddy (unsafe)"

To remove this warning:
- Add test users in Google Cloud Console
- Or submit for verification (takes 1-2 weeks)

---

## Summary Checklist

After following this guide, you should have:

- ✅ Created Google Cloud Project "BiteBuddy"
- ✅ Configured OAuth consent screen with your branding
- ✅ Created OAuth credentials (Client ID + Secret)
- ✅ Copied both credentials safely
- ✅ Added credentials to Supabase
- ✅ Tested and verified it works

**What changes for users:**
- ❌ Before: "...continue to mvbaskfbcsxwrkqziztt.supabase.co"
- ✅ After: "...continue to BiteBuddy" (with your logo!)

---

## Need More Help?

If you're stuck on a specific step:
1. Double-check all URLs match exactly
2. Make sure there are no typos in the redirect URI
3. Wait 5-10 minutes after making changes
4. Try in a different browser or incognito mode
5. Check for errors in browser console (F12)

**Common mistakes:**
- ❌ Wrong redirect URI (missing /auth/v1/callback)
- ❌ Forgot to enable "Use custom OAuth credentials" in Supabase
- ❌ Typo in Client ID or Secret
- ❌ Privacy policy link doesn't work (404 error)
