import { NextRequest, NextResponse } from 'next/server';

// Rate limiting for auth routes at the edge
const rateLimitMap = new Map<string, { count: number; resetAt: number }>();

// Clean up old entries periodically
function cleanupRateLimitMap() {
  const now = Date.now();
  for (const [key, value] of rateLimitMap.entries()) {
    if (now > value.resetAt) {
      rateLimitMap.delete(key);
    }
  }
}

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Protect /studio routes with password
  if (pathname.startsWith('/studio')) {
    const isAuthenticated = request.cookies.get('studio-auth')?.value === 'true';

    if (!isAuthenticated) {
      // Redirect to password page
      const url = request.nextUrl.clone();
      url.pathname = '/studio-login';
      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }
  }

  // Only apply to auth API routes
  if (pathname.startsWith('/api/auth/')) {
    // Get IP from headers (Vercel provides this)
    const ip = request.headers.get('x-forwarded-for')?.split(',')[0] ||
               request.headers.get('x-real-ip') ||
               'unknown';

    const now = Date.now();
    const windowMs = 15 * 60 * 1000; // 15 minutes
    const maxRequests = 20; // 20 requests per 15 minutes per IP across all auth endpoints

    const key = `${ip}:auth`;
    const record = rateLimitMap.get(key);

    if (!record || now > record.resetAt) {
      // New window
      rateLimitMap.set(key, { count: 1, resetAt: now + windowMs });
    } else if (record.count >= maxRequests) {
      // Rate limit exceeded
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': Math.ceil((record.resetAt - now) / 1000).toString(),
          }
        }
      );
    } else {
      // Increment counter
      record.count += 1;
      rateLimitMap.set(key, record);
    }

    // Cleanup old entries occasionally (1% chance per request)
    if (Math.random() < 0.01) {
      cleanupRateLimitMap();
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/api/auth/:path*', '/studio/:path*'],
};
