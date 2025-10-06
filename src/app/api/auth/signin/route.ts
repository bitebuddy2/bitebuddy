import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp, resetRateLimit } from '@/lib/rateLimit';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Rate limiting check
    const ip = getClientIp(request.headers);
    const identifier = `${ip}:${email}`;
    const rateLimit = checkRateLimit(identifier);

    if (rateLimit.isLimited) {
      const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { error: `Too many attempts. Please try again in ${resetIn} minutes.` },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '5',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          }
        }
      );
    }

    // Attempt authentication
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        {
          status: 401,
          headers: {
            'X-RateLimit-Remaining': rateLimit.remaining.toString(),
          }
        }
      );
    }

    // Success - reset rate limit for this identifier
    resetRateLimit(identifier);

    return NextResponse.json(
      {
        session: data.session,
        user: data.user,
      },
      {
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      }
    );
  } catch (error) {
    console.error('Sign in error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
