# Authentication Documentation

## Overview

Bite Buddy uses Supabase for authentication with the following features:

- **Email/Password Authentication** with signup and signin
- **Google OAuth** for social login
- **Magic Link** (passwordless) authentication
- **Password Reset** functionality
- **"Remember Me"** with configurable session persistence
- **Rate Limiting** to prevent abuse

## Features

### 1. Session Persistence ("Remember Me")

The authentication system supports two types of session storage:

- **localStorage** (persistent): Session persists across browser sessions
- **sessionStorage** (temporary): Session expires when browser tab is closed

This is controlled by the `rememberMe` checkbox on the login form.

#### Implementation

```typescript
import { getSupabaseBrowserClient } from '@/lib/supabase';

// With Remember Me (persistent session)
const client = getSupabaseBrowserClient(true);

// Without Remember Me (tab-only session)
const client = getSupabaseBrowserClient(false);
```

### 2. Authentication Methods

#### Email/Password
- **Sign Up**: Creates new account with email verification
- **Sign In**: Authenticates existing users
- Minimum password length: 6 characters
- Email verification required for new accounts

#### Google OAuth
- One-click sign in with Google account
- Respects "Remember Me" setting for session persistence

#### Magic Link
- Passwordless authentication via email
- Rate limited to 3 attempts per 15 minutes
- Link expires after use or timeout

#### Password Reset
- Send reset link to email
- Rate limited to 3 attempts per 15 minutes
- Secure email enumeration prevention (always returns success)

### 3. Rate Limiting

Rate limiting is implemented at two levels:

#### Edge Middleware (Global)
- Location: `src/middleware.ts`
- Limit: 20 requests per 15 minutes per IP across all auth endpoints
- Returns `429 Too Many Requests` when exceeded

#### Endpoint-Specific Rate Limiting
- **Sign In**: 5 attempts per 15 minutes per IP+email
- **Sign Up**: 5 attempts per 15 minutes per IP+email
- **Password Reset**: 3 attempts per 15 minutes per IP+email
- **Magic Link**: 3 attempts per 15 minutes per IP+email

Successful authentication resets the rate limit counter for that identifier.

#### Rate Limit Headers

All auth endpoints return rate limit information:
```
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 3
X-RateLimit-Reset: 1234567890
```

### 4. Security Features

- **IP-based Rate Limiting**: Prevents brute force attacks
- **Email Enumeration Protection**: Password reset always returns success
- **Secure Password Requirements**: Minimum 6 characters (enforced by Supabase)
- **HTTPS Required**: All auth requests should use HTTPS in production
- **Session Tokens**: Auto-refreshing JWT tokens
- **CSRF Protection**: Built into Next.js API routes

## API Endpoints

### POST /api/auth/signin
Sign in with email and password.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response (Success):**
```json
{
  "session": { ... },
  "user": { ... }
}
```

**Response (Rate Limited):**
```json
{
  "error": "Too many attempts. Please try again in 14 minutes."
}
```

### POST /api/auth/signup
Create a new account.

**Request:**
```json
{
  "email": "user@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "user": { ... },
  "session": { ... }
}
```

### POST /api/auth/reset-password
Request a password reset email.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "If an account exists with this email, you will receive a password reset link."
}
```

### POST /api/auth/magic-link
Request a magic link for passwordless login.

**Request:**
```json
{
  "email": "user@example.com"
}
```

**Response:**
```json
{
  "message": "Magic link sent! Check your email."
}
```

## Environment Variables

Required environment variables (see `.env.example`):

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Site URL (for redirect links)
NEXT_PUBLIC_SITE_URL=https://bitebuddy.co.uk
```

## Supabase Setup

### 1. Enable Email/Password Authentication
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Email" provider
3. Configure email templates (optional)

### 2. Enable Google OAuth
1. Go to Supabase Dashboard → Authentication → Providers
2. Enable "Google" provider
3. Add your Google OAuth credentials
4. Add authorized redirect URLs:
   - `http://localhost:3000/auth/callback` (development)
   - `https://bitebuddy.co.uk/auth/callback` (production)

### 3. Configure Email Templates
Customize email templates in Supabase Dashboard → Authentication → Email Templates:
- **Confirm Signup**: Email verification link
- **Reset Password**: Password reset link
- **Magic Link**: Passwordless login link

### 4. URL Configuration
In Supabase Dashboard → Authentication → URL Configuration:
- **Site URL**: `https://bitebuddy.co.uk`
- **Redirect URLs**: Add all valid redirect URLs

## Production Considerations

### Rate Limiting
The current implementation uses in-memory storage for rate limiting, which works well for single-instance deployments. For multi-instance production deployments (e.g., serverless functions), consider:

1. **Vercel KV** (Redis): Shared state across instances
2. **Upstash Redis**: Serverless-friendly Redis
3. **Database-based**: Store rate limit data in Supabase

Example with Vercel KV:
```typescript
import { kv } from '@vercel/kv';

export async function checkRateLimit(identifier: string) {
  const key = `ratelimit:${identifier}`;
  const attempts = await kv.incr(key);

  if (attempts === 1) {
    await kv.expire(key, 900); // 15 minutes
  }

  return {
    isLimited: attempts > 5,
    remaining: Math.max(0, 5 - attempts),
  };
}
```

### Session Management
- **Remember Me = true**: Session persists in localStorage (survives browser restart)
- **Remember Me = false**: Session in sessionStorage (cleared when tab closes)
- Auto-refresh tokens before expiry (handled by Supabase client)

### Security Headers
Consider adding security headers in `next.config.js`:
```javascript
module.exports = {
  async headers() {
    return [
      {
        source: '/api/auth/:path*',
        headers: [
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-XSS-Protection', value: '1; mode=block' },
        ],
      },
    ];
  },
};
```

## Testing

### Manual Testing
1. **Sign Up**: Create account and verify email
2. **Sign In**: Test with correct/incorrect credentials
3. **Remember Me**: Close browser and check if session persists
4. **Rate Limiting**: Make 6+ failed attempts and verify lockout
5. **Password Reset**: Request reset link and verify email
6. **Magic Link**: Request magic link and verify email

### Testing Rate Limits
```bash
# Test sign-in rate limit (should fail after 5 attempts)
for i in {1..6}; do
  curl -X POST http://localhost:3000/api/auth/signin \
    -H "Content-Type: application/json" \
    -d '{"email":"test@example.com","password":"wrong"}'
  echo ""
done
```

## Troubleshooting

### Session not persisting
- Check if "Remember Me" is checked
- Verify localStorage is not disabled in browser
- Check Supabase session expiry settings

### Rate limit false positives
- IP address detection may fail behind certain proxies
- Check `x-forwarded-for` header configuration
- Consider using Vercel KV for accurate rate limiting

### OAuth redirect issues
- Verify redirect URLs in Supabase dashboard
- Check NEXT_PUBLIC_SITE_URL environment variable
- Ensure HTTPS in production

### Email not sending
- Check Supabase email settings
- Verify email templates are configured
- Check spam folder
- Consider custom SMTP provider for production

## Future Enhancements

- [ ] Two-factor authentication (2FA)
- [ ] Social login with more providers (Facebook, Apple, etc.)
- [ ] Account linking (merge multiple auth methods)
- [ ] Session management dashboard (view/revoke active sessions)
- [ ] Login history and suspicious activity alerts
- [ ] CAPTCHA for rate-limited users
