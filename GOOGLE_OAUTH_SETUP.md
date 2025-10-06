# Fix Google OAuth to Show BiteBuddy Instead of Supabase

## The Problem
You're seeing "Choose an account to continue to mvbaskfbcsxwrkqziztt.supabase.co" because you're using Supabase's default Google OAuth credentials.

## The Solution
Create your own Google OAuth app with your branding.

---

## Step-by-Step Instructions

### Part 1: Create Google OAuth App (15 minutes)

#### 1. Go to Google Cloud Console
Visit: https://console.cloud.google.com/

#### 2. Create a New Project
- Click the project dropdown (top left)
- Click "New Project"
- Project name: `BiteBuddy`
- Click "Create"
- Wait for the project to be created
- Select your new project from the dropdown

#### 3. Configure OAuth Consent Screen
- In the left menu, go to: **APIs & Services** → **OAuth consent screen**
- Select **External** (unless you have Google Workspace)
- Click **Create**

**Fill in the form:**

**App information:**
- App name: `BiteBuddy`
- User support email: (select your email)

**App logo (optional but recommended):**
- Upload your logo (120x120px minimum)
- Find your logo at: `D:\bitebuddy\public\logo.png` (if you have one)

**App domain:**
- Application home page: `https://bitebuddy.uk`
- Application privacy policy link: `https://bitebuddy.uk/privacy`
- Application terms of service link: `https://bitebuddy.uk/terms`

**Authorized domains:**
- Click "Add Domain"
- Enter: `bitebuddy.uk`
- Click "Add Domain" again
- Enter: `supabase.co` (needed for redirect)

**Developer contact information:**
- Enter your email address

- Click **Save and Continue**

**Scopes page:**
- Click **Save and Continue** (default scopes are fine)

**Test users page:**
- Click **Save and Continue** (you can add test users later if needed)

**Summary page:**
- Review and click **Back to Dashboard**

#### 4. Create OAuth Credentials
- In the left menu, go to: **APIs & Services** → **Credentials**
- Click **+ Create Credentials** (top)
- Select **OAuth client ID**

**Configure:**
- Application type: **Web application**
- Name: `BiteBuddy Production`

**Authorized JavaScript origins:**
Click "+ Add URI" for each:
```
https://bitebuddy.uk
https://www.bitebuddy.uk
```

**Authorized redirect URIs:**
Click "+ Add URI" for each:
```
https://mvbaskfbcsxwrkqziztt.supabase.co/auth/v1/callback
http://localhost:3000/auth/callback
```

- Click **Create**

**Important:** You'll see a popup with:
- Client ID: `1234567890-xxxxxxxxxxxxxxxxxxxxxxxx.apps.googleusercontent.com`
- Client Secret: `GOCSPX-xxxxxxxxxxxxxxxxxxxxx`

**⚠️ COPY BOTH OF THESE - You'll need them in the next step!**

---

### Part 2: Update Supabase (2 minutes)

#### 1. Go to Supabase Auth Settings
Visit: https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/settings/auth

#### 2. Scroll to Auth Providers Section
Find "Google" in the list of providers

#### 3. Configure Google Provider
- Toggle **ON**: "Enable Sign in with Google"
- Toggle **ON**: "Use custom OAuth credentials"

**Enter your credentials:**
- **Authorized Client ID:** Paste the Client ID from Google Cloud Console
- **Client Secret (for OAuth):** Paste the Client Secret from Google Cloud Console

#### 4. Save
- Click **Save** at the bottom

---

### Part 3: Test (1 minute)

#### 1. Clear Browser Data
- Open Chrome/Firefox DevTools (F12)
- Right-click the refresh button → "Empty Cache and Hard Reload"
- Or: Clear cookies for your site

#### 2. Test Sign In
- Go to: https://bitebuddy.uk/account
- Click "Sign in with Google"

**You should now see:**
- ✅ "Choose an account to continue to **BiteBuddy**"
- ✅ Your logo (if you uploaded one)
- ✅ Clean, professional appearance

---

## For Local Development

If you want this to work on localhost too:

### Option A: Add localhost to the same OAuth app
- Go back to Google Cloud Console → Credentials
- Edit your "BiteBuddy Production" OAuth client
- Add to Authorized JavaScript origins: `http://localhost:3000`
- Add to Authorized redirect URIs: `http://localhost:3000/auth/callback`

### Option B: Create separate OAuth app for development
- Create a second OAuth client ID called "BiteBuddy Development"
- Use localhost URLs only
- Use those credentials in your local Supabase project

---

## Troubleshooting

### Issue: "Error 400: redirect_uri_mismatch"

**Solution:**
1. Go to Google Cloud Console → Credentials
2. Click your OAuth client ID
3. Make sure these redirect URIs are added:
   ```
   https://mvbaskfbcsxwrkqziztt.supabase.co/auth/v1/callback
   ```
4. Wait 5 minutes for changes to propagate
5. Try again

### Issue: Still shows Supabase domain

**Solution:**
- Make sure you enabled "Use custom OAuth credentials" in Supabase
- Clear browser cookies completely
- Try in incognito/private window
- Wait 5-10 minutes for DNS/cache to update

### Issue: "This app isn't verified" warning

**Solution:**
This is normal for new OAuth apps. You have 3 options:

1. **Ignore it (Recommended for now):**
   - Users can click "Advanced" → "Go to BiteBuddy (unsafe)"
   - This doesn't affect functionality

2. **Add test users:**
   - Google Cloud Console → OAuth consent screen → Test users
   - Add specific email addresses
   - They won't see the warning

3. **Submit for verification (Later):**
   - After you have real users
   - Go to OAuth consent screen → "Publish App"
   - Fill out verification form
   - Takes 1-2 weeks for Google to review

---

## Security Notes

⚠️ **Keep your Client Secret safe!**
- Never commit it to Git
- Store it only in Supabase dashboard
- Don't share it publicly

✅ **Client ID is public** - it's safe to expose in your frontend code

---

## What You've Achieved

After completing these steps:
- ✅ Professional OAuth consent screen with your branding
- ✅ "BiteBuddy" shown instead of Supabase URL
- ✅ Your logo displayed (if uploaded)
- ✅ Full control over OAuth experience
- ✅ Free (no cost for Google OAuth)

---

## Next Steps (Optional)

1. **Add your logo** to OAuth consent screen if you haven't already
2. **Submit for Google verification** once you have users (removes "unverified" warning)
3. **Monitor OAuth usage** in Google Cloud Console

---

## Need Help?

If you get stuck:
1. Check Supabase logs: https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/logs/edge-logs
2. Check Google Cloud Console errors
3. Make sure all URLs match exactly (no trailing slashes)
4. Wait 5-10 minutes after making changes

**Common URLs to check:**
- Supabase callback: `https://mvbaskfbcsxwrkqziztt.supabase.co/auth/v1/callback`
- Your site: `https://bitebuddy.uk`
- Privacy Policy: `https://bitebuddy.uk/privacy`
- Terms: `https://bitebuddy.uk/terms`
