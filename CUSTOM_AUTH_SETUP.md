# Custom Authentication Setup Guide

## Problem
When users sign in, they see "Choose an account to continue to mvbaskfbcsxwrkqziztt.supabase.co" instead of your domain (bitebuddy.uk).

## Solutions

---

## Solution 1: Update Site URL (Quickest)

This changes the OAuth consent screen to show your domain.

### Steps:

1. **Go to Supabase Dashboard:**
   ```
   https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/settings/auth
   ```

2. **Scroll to "Site URL":**
   - Change from: `http://localhost:3000`
   - Change to: `https://bitebuddy.uk`

3. **Update Redirect URLs:**
   Add these URLs to the allowed list:
   ```
   https://bitebuddy.uk/**
   https://www.bitebuddy.uk/**
   http://localhost:3000/**
   ```

4. **Save Changes**

5. **Test:**
   - Try signing in again
   - Should now show "Choose an account to continue to bitebuddy.uk"

---

## Solution 2: Custom Google OAuth App (Recommended)

Create your own Google OAuth application with full branding control.

### Step 1: Create Google Cloud Project

1. Go to: https://console.cloud.google.com/
2. Click **"Select a project"** → **"New Project"**
3. Name it: `BiteBuddy`
4. Click **"Create"**

### Step 2: Enable Google+ API

1. In the project, go to: **APIs & Services** → **Library**
2. Search for: `Google+ API`
3. Click **"Enable"**

### Step 3: Configure OAuth Consent Screen

1. Go to: **APIs & Services** → **OAuth consent screen**
2. Select: **External**
3. Click **"Create"**

**Fill in the form:**
```
App name: BiteBuddy
User support email: your-email@bitebuddy.uk
App logo: Upload your logo (120x120px)
Application home page: https://bitebuddy.uk
Application privacy policy: https://bitebuddy.uk/privacy
Application terms of service: https://bitebuddy.uk/terms
Authorized domains: bitebuddy.uk
Developer contact: your-email@bitebuddy.uk
```

4. Click **"Save and Continue"**
5. **Scopes:** Click **"Add or Remove Scopes"**
   - Add: `email`, `profile`, `openid`
   - Click **"Update"** → **"Save and Continue"**
6. **Test users:** Skip this (or add test emails if in development)
7. Click **"Back to Dashboard"**

### Step 4: Create OAuth Credentials

1. Go to: **APIs & Services** → **Credentials**
2. Click: **"Create Credentials"** → **"OAuth client ID"**
3. Application type: **Web application**
4. Name: `BiteBuddy Auth`

**Authorized JavaScript origins:**
```
https://bitebuddy.uk
https://www.bitebuddy.uk
http://localhost:3000
```

**Authorized redirect URIs:**
```
https://mvbaskfbcsxwrkqziztt.supabase.co/auth/v1/callback
http://localhost:3000/auth/v1/callback
```

5. Click **"Create"**
6. **Copy** the **Client ID** and **Client Secret**

### Step 5: Update Supabase

1. Go to: https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/settings/auth
2. Scroll to: **Auth Providers** → **Google**
3. Enable: ☑️ **"Enable Sign in with Google"**
4. Enable: ☑️ **"Use custom OAuth credentials"**
5. Paste:
   - **Client ID:** (from Google Cloud Console)
   - **Client Secret:** (from Google Cloud Console)
6. Click **"Save"**

### Step 6: Test

1. Clear browser cookies
2. Go to your site: https://bitebuddy.uk/account
3. Click "Sign in with Google"
4. Should now show: **"Choose an account to continue to BiteBuddy"** with your logo

---

## Solution 3: Custom SMTP (For Email-based Auth)

If you use email/password or magic link authentication, set up custom SMTP to use your domain.

### Recommended Providers:

**1. SendGrid (Free tier: 100 emails/day)**
- Sign up: https://sendgrid.com/
- Get API key
- Verify your domain

**2. Mailgun (Free tier: 5000 emails/month)**
- Sign up: https://mailgun.com/
- Get SMTP credentials
- Verify your domain

**3. Gmail (For testing only)**
- Use App Password (not main password)
- Limited to 500 emails/day

### Setup in Supabase:

1. Go to: https://supabase.com/dashboard/project/mvbaskfbcsxwrkqziztt/settings/auth
2. Scroll to: **SMTP Settings**
3. Click: **"Enable Custom SMTP"**

**Example with SendGrid:**
```
Sender email: noreply@bitebuddy.uk
Sender name: BiteBuddy
Host: smtp.sendgrid.net
Port: 587
Minimum interval: 60
Username: apikey
Password: SG.xxxxxxxxxxxxxxxxxxxx
```

4. Click **"Save"**

### Update Email Templates:

1. Go to: **Authentication** → **Email Templates**
2. Update each template:
   - **Confirm signup**
   - **Magic Link**
   - **Change Email**
   - **Reset Password**

**Example customization:**
```html
<h2>Welcome to BiteBuddy!</h2>
<p>Click the link below to confirm your email:</p>
<p><a href="{{ .ConfirmationURL }}">Confirm your email</a></p>
```

Replace all instances of Supabase URLs with `https://bitebuddy.uk`

---

## Solution 4: Custom Domain for Supabase (Advanced)

**Note:** This requires Supabase Pro plan ($25/month)

1. Go to: **Settings** → **Custom Domains**
2. Add domain: `auth.bitebuddy.uk`
3. Add DNS records as instructed
4. Wait for verification

---

## Recommended Approach

For most users, I recommend:

1. ✅ **Start with Solution 1** (Update Site URL) - Takes 2 minutes
2. ✅ **Then do Solution 2** (Custom Google OAuth) - Full branding control
3. ⚠️ **Optionally do Solution 3** (Custom SMTP) - If you use email auth

This gives you:
- ✅ Your domain shown in OAuth consent
- ✅ Your branding and logo
- ✅ Professional appearance
- ✅ No cost (all free)

---

## Testing Checklist

After setup:
- [ ] OAuth consent shows "BiteBuddy" instead of Supabase
- [ ] Your logo appears in the consent screen
- [ ] Emails come from noreply@bitebuddy.uk (if using custom SMTP)
- [ ] Redirect URLs work correctly
- [ ] Test on production and localhost

---

## Troubleshooting

**Issue: "Redirect URI mismatch"**
- Make sure you added all redirect URIs to both Google Cloud Console and Supabase

**Issue: Still shows Supabase domain**
- Clear browser cache and cookies
- Check that Site URL is set to your domain in Supabase
- Wait 5-10 minutes for changes to propagate

**Issue: Emails not sending**
- Verify SMTP credentials are correct
- Check sender email is verified with your email provider
- Check Supabase logs for errors

**Issue: "App not verified" warning in Google OAuth**
- Normal for apps in development
- Submit for Google verification (takes ~1 week)
- Or add users as "test users" in Google Cloud Console

---

## Need Help?

- Google OAuth Guide: https://developers.google.com/identity/protocols/oauth2
- Supabase Auth Docs: https://supabase.com/docs/guides/auth
- SendGrid Setup: https://docs.sendgrid.com/for-developers/sending-email/integrating-with-the-smtp-api
