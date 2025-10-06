import { NextRequest, NextResponse } from 'next/server';
import { checkRateLimit, getClientIp } from '@/lib/rateLimit';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export async function POST(request: NextRequest) {
  try {
    const { email } = await request.json();

    if (!email) {
      return NextResponse.json(
        { error: 'Email is required' },
        { status: 400 }
      );
    }

    // Rate limiting check (more restrictive for password reset)
    const ip = getClientIp(request.headers);
    const identifier = `${ip}:${email}:reset`;
    const rateLimit = checkRateLimit(identifier, {
      maxAttempts: 3,
      windowMs: 15 * 60 * 1000, // 3 attempts per 15 minutes
    });

    if (rateLimit.isLimited) {
      const resetIn = Math.ceil((rateLimit.resetAt - Date.now()) / 1000 / 60);
      return NextResponse.json(
        { error: `Too many password reset requests. Please try again in ${resetIn} minutes.` },
        {
          status: 429,
          headers: {
            'X-RateLimit-Limit': '3',
            'X-RateLimit-Remaining': '0',
            'X-RateLimit-Reset': rateLimit.resetAt.toString(),
          }
        }
      );
    }

    // Send password reset email
    const supabase = createClient(supabaseUrl, supabaseKey);
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/account?mode=reset-password`,
    });

    // Always return success to prevent email enumeration
    // Even if the email doesn't exist, we don't want to leak that information
    if (error) {
      console.error('Password reset error:', error);
    }

    return NextResponse.json(
      { message: 'If an account exists with this email, you will receive a password reset link.' },
      {
        headers: {
          'X-RateLimit-Remaining': rateLimit.remaining.toString(),
        }
      }
    );
  } catch (error) {
    console.error('Password reset error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
