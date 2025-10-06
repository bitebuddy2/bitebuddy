# GDPR & EU Cookie Consent Compliance

## Overview
This document explains how BiteBuddy complies with EU's GDPR, ePrivacy Directive, and Google's EU user consent policy for AdSense and Analytics.

---

## Implementation Summary

### ✅ What We've Implemented

1. **Cookie Consent Banner** (`src/components/CookieConsent.tsx`)
   - Displayed on first visit to all users
   - Two clear options: "Essential Only" or "Accept All"
   - Expandable details explaining each cookie type
   - Consent choice stored in localStorage
   - Link to Privacy Policy

2. **Google Consent Mode v2** (`src/app/layout.tsx`)
   - Default state: All consent **denied** until user chooses
   - Consent types covered:
     - `ad_storage` - AdSense cookies
     - `ad_user_data` - User data for ads
     - `ad_personalization` - Personalized ads
     - `analytics_storage` - Google Analytics
     - `functionality_storage` - Functional cookies
     - `security_storage` - Always granted (required for site security)

3. **User Choice Handling**
   - **"Accept All"**: Grants consent for ads and analytics
   - **"Essential Only"**: Denies ads/analytics, only security cookies allowed
   - Choice persists across sessions via localStorage

---

## How It Works

### Initial Page Load (Before Consent)
1. Consent Mode initializes with everything **denied** (except security)
2. AdSense script loads but won't set personalized cookies
3. Analytics loads but won't track until consent granted
4. Cookie banner appears

### User Accepts All
1. `gtag('consent', 'update')` called with all permissions **granted**
2. AdSense can now serve personalized ads
3. Analytics starts tracking
4. Choice saved to localStorage

### User Chooses Essential Only
1. Consent remains **denied** for ads/analytics
2. AdSense shows non-personalized ads (if any)
3. Analytics doesn't track
4. Choice saved to localStorage

### Returning Visitors
- If previously accepted: Consent auto-granted on page load
- If previously declined: Consent stays denied
- Banner doesn't show again

---

## GDPR Compliance Checklist

✅ **Consent before cookies** - Default state denies all non-essential cookies
✅ **Clear information** - Banner explains what cookies are used for
✅ **Granular choice** - Users can accept all or essential only
✅ **Easy to decline** - "Essential Only" button equally prominent
✅ **Persistent choice** - User's decision remembered
✅ **Revocable consent** - Users can change their mind (via Privacy Policy page)
✅ **Privacy Policy link** - Provided in banner and details

---

## Google AdSense EU Compliance

### Requirements Met:
1. ✅ **Consent before personalized ads** - Consent Mode v2 implemented
2. ✅ **User controls** - Clear accept/decline options
3. ✅ **Information disclosure** - Banner explains advertising cookies
4. ✅ **Non-personalized ads fallback** - When consent denied

### Consent Mode Benefits:
- Even without consent, Google can still measure ad performance in aggregate
- Ads can still be shown (non-personalized)
- You still get basic reporting
- Compliant with EU regulations

---

## Testing Your Implementation

### 1. Test Cookie Banner
1. Clear browser data (localStorage)
2. Visit your site
3. Banner should appear
4. Click "Show details" - verify all info is clear
5. Click "Essential Only" - banner disappears
6. Refresh page - banner shouldn't appear again

### 2. Test Consent in DevTools
1. Open browser DevTools → Application → Local Storage
2. Check for `cookie-consent` key
3. Value should be either `all` or `essential`

### 3. Test Google Tag Manager (if applicable)
1. Install "Google Analytics Debugger" extension
2. Open DevTools → Console
3. Check for consent mode messages
4. Should see: "Consent updated: {ad_storage: 'granted', ...}"

### 4. Test AdSense
1. After deployment, wait 24-48 hours
2. Visit your site in EU (or use VPN)
3. Accept cookies
4. Ads should appear (if approved by AdSense)
5. Decline cookies - non-personalized ads may still show

---

## Next Steps

### Required:
1. ✅ Deploy this code to production
2. ⚠️ **Create/Update Privacy Policy** page at `/privacy` with:
   - What cookies you use
   - Why you use them
   - How users can control them
   - How to withdraw consent
   - Link to Google's privacy policy

### Optional (Recommended):
1. Add a "Cookie Settings" link in your footer
2. Create a settings page where users can change their consent choice
3. Add consent logging for compliance records
4. Consider adding a cookie policy page separate from privacy policy

---

## Privacy Policy Requirements

Your Privacy Policy should include:

### 1. Cookie Information
- Types of cookies used (Essential, Analytics, Advertising)
- Why each cookie is used
- How long cookies last
- Third parties that set cookies (Google)

### 2. Google Services Disclosure
```
We use Google Analytics to understand how visitors use our site.
We use Google AdSense to show advertisements.

Google may use cookies and similar technologies to:
- Personalize ads
- Measure ad performance
- Understand site usage

For more information, visit:
- Google's Privacy Policy: https://policies.google.com/privacy
- How Google uses data: https://policies.google.com/technologies/partner-sites
```

### 3. User Rights (GDPR)
- Right to access personal data
- Right to deletion
- Right to object to processing
- How to exercise these rights
- Contact information

### 4. Consent Management
- How users can accept/decline cookies
- How to withdraw consent
- How to change cookie preferences

---

## Sample Cookie Settings Page

Consider creating `/settings/cookies` or adding to `/account`:

```tsx
// Example implementation
function CookieSettings() {
  const [consent, setConsent] = useState(localStorage.getItem('cookie-consent'));

  function updateConsent(choice: 'all' | 'essential') {
    localStorage.setItem('cookie-consent', choice);
    setConsent(choice);
    window.location.reload(); // Reload to apply changes
  }

  return (
    <div>
      <h2>Cookie Preferences</h2>
      <p>Current setting: {consent === 'all' ? 'All cookies' : 'Essential only'}</p>

      <button onClick={() => updateConsent('all')}>Accept All</button>
      <button onClick={() => updateConsent('essential')}>Essential Only</button>
    </div>
  );
}
```

---

## Important Notes

⚠️ **This is not legal advice** - Consider consulting with a lawyer for full GDPR compliance

✅ **Google Consent Mode v2** is required as of March 2024 for EEA/UK

✅ **Essential cookies** (security, authentication) don't require consent

⚠️ **AdSense approval** may still deny your application for other reasons (content, traffic, etc.)

---

## Additional Resources

- [Google Consent Mode](https://support.google.com/analytics/answer/9976101)
- [AdSense EU Consent Policy](https://support.google.com/adsense/answer/13554116)
- [GDPR Cookie Consent](https://gdpr.eu/cookies/)
- [Google's Consent Management Platform](https://support.google.com/fundingchoices)

---

## Support

If you need to implement a more advanced consent management solution:
- Consider using a Google-certified CMP (Consent Management Platform)
- Examples: OneTrust, Cookiebot, Usercentrics
- These provide more granular controls and compliance documentation
