"use client";
import { getSupabaseBrowserClient } from "@/lib/supabase";
import { useEffect, useState, Suspense } from "react";
import { client } from "@/sanity/client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { User } from "lucide-react";
import MealPlannerCalendar from "@/components/MealPlannerCalendar";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";
import ShareRow from "@/components/ShareRow";
import Link from "next/link";
import CommunityHistory from "@/components/CommunityHistory";
import AccountSettings from "@/components/AccountSettings";

// Get properly configured Supabase client with auth session
const supabase = getSupabaseBrowserClient();

function AccountContent() {
  const [user, setUser] = useState<any>(null);
  const searchParams = useSearchParams();
  const mode = searchParams.get('mode');

  useEffect(() => {
    // Get initial user
    supabase.auth.getUser().then(({ data }) => setUser(data.user));

    // Listen for auth state changes to pick up metadata updates
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user ?? null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Show password reset form if mode is reset-password
  if (mode === 'reset-password') {
    return <PasswordResetForm />;
  }

  if (!user) {
    return <LoginForm />;
  }

  return <Dashboard user={user} searchParams={searchParams} />;
}

export default function AccountPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-white flex items-center justify-center"><p>Loading...</p></div>}>
      <AccountContent />
    </Suspense>
  );
}

function LoginForm() {
  const [authMode, setAuthMode] = useState<'signin' | 'signup' | 'reset'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [firstName, setFirstName] = useState('');
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showPassword, setShowPassword] = useState(false);

  const handleEmailPasswordAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      const client = getSupabaseBrowserClient(rememberMe);

      if (authMode === 'reset') {
        const { error } = await client.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/account?mode=reset-password`,
        });

        if (error) throw error;
        setMessage({ type: 'success', text: 'Password reset email sent! Check your inbox.' });
        setEmail('');
      } else if (authMode === 'signup') {
        const { error } = await client.auth.signUp({
          email,
          password,
          options: {
            emailRedirectTo: `${window.location.origin}/`,
            data: {
              first_name: firstName,
            },
          },
        });

        if (error) {
          // Check if user already exists
          if (error.message.toLowerCase().includes('already registered') ||
              error.message.toLowerCase().includes('already exists') ||
              error.message.toLowerCase().includes('user already registered')) {
            // Switch to sign-in mode and show helpful message
            setAuthMode('signin');
            setMessage({ type: 'error', text: 'This email is already registered. Please sign in instead.' });
            setPassword(''); // Clear password for security
            setLoading(false);
            return;
          }
          throw error;
        }
        setMessage({ type: 'success', text: 'Account created! Check your email to verify.' });
      } else {
        const { error } = await client.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        window.location.href = '/';
      }
    } catch (error: any) {
      // Simplify Supabase password requirement error
      let errorMessage = error.message || 'Authentication failed';
      if (errorMessage.includes('abcdefghijklmnopqrstuvwxyz') || errorMessage.includes('Password should contain')) {
        errorMessage = 'Password must include: lowercase, uppercase, number, and special character';
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    const client = getSupabaseBrowserClient(rememberMe);
    await client.auth.signInWithOAuth({
      provider: "google",
      options: {
        redirectTo: `${window.location.origin}/`
      }
    });
  };


  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Welcome to Bite Buddy</h1>
          <p className="mt-2 text-sm text-gray-600">
            {authMode === 'reset' ? 'Reset your password' : 'Sign in to save your favorite recipes'}
          </p>
        </div>

        {message && (
          <div className={`rounded-lg p-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <div className="mt-8 space-y-4">
          {/* Google Sign In */}
          {authMode !== 'reset' && (
            <button
              className="w-full flex items-center justify-center gap-3 rounded-lg bg-black px-4 py-3 text-white font-medium hover:bg-gray-900 transition-colors"
              onClick={handleGoogleSignIn}
              disabled={loading}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
          )}

          {authMode !== 'reset' && (
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white text-gray-500">Or</span>
              </div>
            </div>
          )}

          {/* Email/Password Form */}
          <form onSubmit={handleEmailPasswordAuth} className="space-y-4">
            {authMode === 'signup' && (
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  type="text"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="John"
                />
              </div>
            )}

            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="you@example.com"
              />
            </div>

            {authMode !== 'reset' && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    required
                    className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                    placeholder="••••••••"
                    minLength={6}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
                  >
                    {showPassword ? (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                      </svg>
                    ) : (
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>
            )}

            {authMode === 'signin' && (
              <div className="flex items-center justify-between">
                <label className="flex items-center">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500"
                  />
                  <span className="ml-2 text-sm text-gray-700">Remember me</span>
                </label>
                <button
                  type="button"
                  onClick={() => setAuthMode('reset')}
                  className="text-sm text-emerald-600 hover:text-emerald-700"
                >
                  Forgot password?
                </button>
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
            >
              {loading ? 'Loading...' : authMode === 'reset' ? 'Send Reset Email' : authMode === 'signup' ? 'Sign Up' : 'Sign In'}
            </button>
          </form>

          {/* Mode Toggle */}
          <div className="text-center text-sm">
            {authMode === 'reset' ? (
              <button
                onClick={() => setAuthMode('signin')}
                className="text-emerald-600 hover:text-emerald-700"
              >
                Back to sign in
              </button>
            ) : (
              <>
                <span className="text-gray-600">
                  {authMode === 'signin' ? "Don't have an account? " : "Already have an account? "}
                </span>
                <button
                  onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
                  className="text-emerald-600 hover:text-emerald-700 font-medium"
                >
                  {authMode === 'signin' ? 'Sign up' : 'Sign in'}
                </button>
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function PasswordResetForm() {
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handlePasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    if (newPassword !== confirmPassword) {
      setMessage({ type: 'error', text: 'Passwords don\'t match' });
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setMessage({ type: 'error', text: 'Password too short (min 6 characters)' });
      setLoading(false);
      return;
    }

    try {
      const { error } = await supabase.auth.updateUser({
        password: newPassword,
      });

      if (error) throw error;

      setMessage({ type: 'success', text: 'Password updated! Redirecting...' });

      // Redirect to account page after a short delay
      setTimeout(() => {
        window.location.href = '/account';
      }, 2000);
    } catch (error: any) {
      // Simplify Supabase password requirement error
      let errorMessage = error.message || 'Failed to update password';
      if (errorMessage.includes('abcdefghijklmnopqrstuvwxyz') || errorMessage.includes('Password should contain')) {
        errorMessage = 'Password must include: lowercase, uppercase, number, and special character';
      }
      setMessage({ type: 'error', text: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-white flex items-center justify-center px-4">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">Reset Your Password</h1>
          <p className="mt-2 text-sm text-gray-600">
            Enter your new password below
          </p>
        </div>

        {message && (
          <div className={`rounded-lg p-4 ${
            message.type === 'success' ? 'bg-green-50 text-green-800' : 'bg-red-50 text-red-800'
          }`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handlePasswordReset} className="space-y-4">
          <div>
            <label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-1">
              New Password
            </label>
            <div className="relative">
              <input
                id="newPassword"
                type={showNewPassword ? "text" : "password"}
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowNewPassword(!showNewPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showNewPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <div>
            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
              Confirm Password
            </label>
            <div className="relative">
              <input
                id="confirmPassword"
                type={showConfirmPassword ? "text" : "password"}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                className="w-full rounded-lg border border-gray-300 px-4 py-2 pr-10 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                placeholder="••••••••"
                minLength={6}
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
              >
                {showConfirmPassword ? (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                  </svg>
                )}
              </button>
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full rounded-lg bg-emerald-600 px-4 py-3 text-white font-medium hover:bg-emerald-700 transition-colors disabled:opacity-50"
          >
            {loading ? 'Updating...' : 'Update Password'}
          </button>
        </form>

        <div className="text-center text-sm">
          <a href="/account" className="text-emerald-600 hover:text-emerald-700 font-medium">
            Back to Account
          </a>
        </div>
      </div>
    </div>
  );
}

function Dashboard({ user, searchParams }: { user: any; searchParams: any }) {
  const tabParam = searchParams.get("tab");
  const aiRecipeId = searchParams.get("ai");
  const [activeTab, setActiveTab] = useState<"recipes" | "planner" | "community" | "settings">(
    tabParam === "planner" ? "planner" : tabParam === "community" ? "community" : tabParam === "settings" ? "settings" : "recipes"
  );
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);
  const [avatarUrl, setAvatarUrl] = useState<string | null>(user?.user_metadata?.avatar_url || null);
  const [avatarError, setAvatarError] = useState(false);
  const [uploadingAvatar, setUploadingAvatar] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [isDeletingAccount, setIsDeletingAccount] = useState(false);
  const { isPremium, subscription } = useSubscription();
  const hasStripeCustomer = subscription?.stripe_customer_id;

  // Get user's display name
  const userName = user?.user_metadata?.first_name ||
                   user?.user_metadata?.full_name ||
                   user?.user_metadata?.name ||
                   user?.email?.split('@')[0] ||
                   'there';

  // Sync avatarUrl with user metadata changes
  useEffect(() => {
    // Import the helper to get correct avatar (custom or OAuth)
    import('@/lib/getUserAvatar').then(({ getUserAvatar }) => {
      const avatar = getUserAvatar(user);
      if (avatar) {
        setAvatarUrl(avatar);
        setAvatarError(false);
      }
    });
  }, [user]);

  // Debug: Log avatar URL
  console.log('Avatar URL:', avatarUrl);

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Import compression utilities
    const { compressImage, validateImageFile, formatFileSize } = await import('@/lib/imageCompression');

    // Validate file
    const validationError = validateImageFile(file);
    if (validationError) {
      alert(validationError);
      return;
    }

    setUploadingAvatar(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please sign in to upload a profile picture');
        setUploadingAvatar(false);
        return;
      }

      // Compress image before upload
      const originalSize = file.size;
      const compressedFile = await compressImage(file, {
        maxWidth: 400,
        maxHeight: 400,
        quality: 0.85,
        maxSizeMB: 1, // Target 1MB for fast uploads
      });

      const compressedSize = compressedFile.size;
      console.log(`Compressed image: ${formatFileSize(originalSize)} → ${formatFileSize(compressedSize)}`);

      const formData = new FormData();
      formData.append('file', compressedFile);

      const response = await fetch('/api/upload-avatar', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Upload failed');
      }

      console.log('Upload successful, new avatar URL:', data.avatarUrl);

      // Update local state immediately with the new URL from API response
      setAvatarUrl(data.avatarUrl);
      setAvatarError(false);

      // Refresh session to update user metadata (triggers onAuthStateChange)
      await supabase.auth.refreshSession();

      alert('Profile picture updated successfully!');
    } catch (error: any) {
      console.error('Avatar upload error:', error);
      alert(error.message || 'Failed to upload profile picture');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleAvatarDelete = async () => {
    if (!confirm('Are you sure you want to remove your profile picture?')) {
      return;
    }

    setUploadingAvatar(true);

    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) return;

      const response = await fetch('/api/upload-avatar', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete profile picture');
      }

      // Refresh session to get updated user metadata
      const { data: { session: newSession } } = await supabase.auth.refreshSession();

      // Update local state with the refreshed user metadata
      setAvatarUrl(newSession?.user?.user_metadata?.avatar_url || null);

      alert('Profile picture removed successfully!');
    } catch (error) {
      console.error('Avatar delete error:', error);
      alert('Failed to delete profile picture');
    } finally {
      setUploadingAvatar(false);
    }
  };

  const handleManageSubscription = async () => {
    setIsManagingSubscription(true);
    try {
      const response = await fetch("/api/create-portal-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ userId: user.id }),
      });

      const data = await response.json();

      if (!response.ok) {
        console.error("Portal session error:", data);
        alert(`Failed to open subscription management: ${data.error || 'Please try again.'}`);
        setIsManagingSubscription(false);
        return;
      }

      if (data.url) {
        window.location.href = data.url;
      }
    } catch (error) {
      console.error("Error opening customer portal:", error);
      alert("Failed to open subscription management. Please try again.");
      setIsManagingSubscription(false);
    }
  };

  const handleDeleteAccount = async () => {
    if (deleteConfirmText !== 'DELETE') {
      alert('Please type DELETE to confirm account deletion');
      return;
    }

    setIsDeletingAccount(true);
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        alert('Please sign in to delete your account');
        setIsDeletingAccount(false);
        return;
      }

      const response = await fetch('/api/auth/delete-account', {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${session.access_token}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || 'Failed to delete account');
      }

      // Sign out and redirect
      await supabase.auth.signOut();
      alert('Your account has been successfully deleted.');
      window.location.href = '/';
    } catch (error: any) {
      console.error('Account deletion error:', error);
      alert(error.message || 'Failed to delete account. Please try again.');
      setIsDeletingAccount(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header Section with Greeting */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-6 mb-4">
            {/* Profile Picture and Info */}
            <div className="flex items-start gap-4 flex-1">
              {/* Profile Picture */}
              <div className="relative group">
                <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full border-4 border-emerald-500 bg-emerald-600 flex items-center justify-center overflow-hidden">
                  {avatarUrl && !avatarError ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={avatarUrl}
                      src={avatarUrl}
                      alt={userName}
                      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                      onError={(e) => {
                        console.error('Image failed to load:', avatarUrl);
                        console.error('Error:', e);
                        setAvatarError(true);
                      }}
                      onLoad={(e) => {
                        console.log('Image loaded successfully:', avatarUrl);
                        console.log('Image element:', e.currentTarget);
                      }}
                    />
                  ) : (
                    <User className="w-12 h-12 sm:w-16 sm:h-16 text-white" />
                  )}
                </div>

                {/* Upload/Delete overlay */}
                <div className="absolute inset-0 rounded-full bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex gap-1">
                    <label className="cursor-pointer p-2 bg-emerald-600 rounded-full hover:bg-emerald-700 transition-colors">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={handleAvatarUpload}
                        disabled={uploadingAvatar}
                        className="hidden"
                      />
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                      </svg>
                    </label>
                    {avatarUrl && (
                      <button
                        onClick={handleAvatarDelete}
                        disabled={uploadingAvatar}
                        className="p-2 bg-red-600 rounded-full hover:bg-red-700 transition-colors"
                      >
                        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>

                {uploadingAvatar && (
                  <div className="absolute inset-0 rounded-full bg-black bg-opacity-50 flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white"></div>
                  </div>
                )}
              </div>

              {/* User Info */}
              <div className="flex-1">
                <div className="flex flex-wrap items-center gap-3 mb-2">
                  <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">
                    Hi {userName} 👋
                  </h1>
                  {isPremium && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1 text-sm font-semibold text-white">
                      ⭐ Premium
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-gray-600">
                  Here's your saved recipes and meal plan
                </p>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">
                  {user.email}
                </p>
              </div>
            </div>

            {/* Action Buttons - Fixed for mobile */}
            <div className="flex flex-col items-end gap-3">
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                {isPremium ? (
                  <button
                    onClick={hasStripeCustomer ? handleManageSubscription : () => window.open('https://billing.stripe.com/p/login/bJe5kw1rffNQ6C10k22VG00', '_blank')}
                    disabled={isManagingSubscription}
                    className="whitespace-nowrap rounded-lg border border-emerald-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 transition-colors"
                  >
                    {isManagingSubscription ? "Loading..." : "Manage Subscription"}
                  </button>
                ) : (
                  <button
                    onClick={() => setShowUpgradeModal(true)}
                    className="whitespace-nowrap rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:from-emerald-600 hover:to-emerald-700 transition-all"
                  >
                    ⭐ Upgrade to Premium
                  </button>
                )}
                <button
                  onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
                  className="whitespace-nowrap rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
                >
                  Sign Out
                </button>
              </div>
              {/* Member since date */}
              <p className="text-xs text-gray-500">
                Member since {new Date(user.created_at).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
              </p>
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 mb-6">
          <nav className="-mb-px flex space-x-8">
            <button
              onClick={() => setActiveTab("recipes")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "recipes"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Saved Recipes
            </button>
            <button
              onClick={() => setActiveTab("planner")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "planner"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              Meal Planner
            </button>
            <button
              onClick={() => setActiveTab("community")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "community"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              🧑‍🍳 Community History
            </button>
            <button
              onClick={() => setActiveTab("settings")}
              className={`py-2 px-1 border-b-2 font-medium text-sm ${
                activeTab === "settings"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300"
              }`}
            >
              ⚙️ Settings
            </button>
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "recipes" ? (
          <div className="max-w-4xl">
            <SavedPublished />
            <SavedAI aiRecipeId={aiRecipeId} />
          </div>
        ) : activeTab === "planner" ? (
          <MealPlannerCalendar />
        ) : activeTab === "community" ? (
          <CommunityHistory userId={user.id} />
        ) : (
          <AccountSettings
            user={user}
            onDeleteAccount={handleDeleteAccount}
            showDeleteConfirm={showDeleteConfirm}
            setShowDeleteConfirm={setShowDeleteConfirm}
            deleteConfirmText={deleteConfirmText}
            setDeleteConfirmText={setDeleteConfirmText}
            isDeletingAccount={isDeletingAccount}
          />
        )}

        {/* Upgrade Modal */}
        {showUpgradeModal && user && (
          <UpgradeModal
            isOpen={showUpgradeModal}
            onClose={() => setShowUpgradeModal(false)}
            userId={user.id}
          />
        )}
      </div>
    </div>
  );
}


function SavedPublished() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedSlugs, setSelectedSlugs] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    async function fetchSavedRecipes() {
      const { data: saved } = await supabase.from("saved_recipes").select("recipe_slug");
      if (!saved || saved.length === 0) {
        setLoading(false);
        return;
      }

      // Fetch recipe details from Sanity
      const slugs = saved.map(s => s.recipe_slug);
      const recipes = await client.fetch(
        `*[_type == "recipe" && slug.current in $slugs]{
          _id,
          title,
          "slug": slug.current,
          description,
          heroImage{
            asset->{url},
            alt
          }
        }`,
        { slugs }
      );

      setItems(recipes);
      setLoading(false);
    }
    fetchSavedRecipes();
  }, []);

  async function unsave(slug: string) {
    await supabase.from("saved_recipes").delete().eq("recipe_slug", slug);
    setItems(items.filter(r => r.slug !== slug));
  }

  async function bulkUnsave() {
    if (selectedSlugs.size === 0) return;

    if (!confirm(`Are you sure you want to remove ${selectedSlugs.size} recipe${selectedSlugs.size > 1 ? 's' : ''}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      // Delete all selected recipes
      const { error } = await supabase
        .from("saved_recipes")
        .delete()
        .in("recipe_slug", Array.from(selectedSlugs));

      if (error) throw error;

      // Update local state
      setItems(items.filter(r => !selectedSlugs.has(r.slug)));
      setSelectedSlugs(new Set());
    } catch (error) {
      console.error('Bulk unsave error:', error);
      alert('Failed to remove recipes. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  function toggleSelection(slug: string) {
    const newSelection = new Set(selectedSlugs);
    if (newSelection.has(slug)) {
      newSelection.delete(slug);
    } else {
      newSelection.add(slug);
    }
    setSelectedSlugs(newSelection);
  }

  function toggleSelectAll() {
    if (selectedSlugs.size === filteredItems.length) {
      setSelectedSlugs(new Set());
    } else {
      setSelectedSlugs(new Set(filteredItems.map(r => r.slug)));
    }
  }

  // Filter recipes based on search query
  const filteredItems = items.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <section className="mb-10">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">Saved Recipes</h2>
        <div className="flex items-center gap-2">
          {selectionMode && selectedSlugs.size > 0 && (
            <button
              onClick={bulkUnsave}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isDeleting ? 'Removing...' : `Remove ${selectedSlugs.size}`}
            </button>
          )}
          {items.length > 0 && (
            <button
              onClick={() => {
                setSelectionMode(!selectionMode);
                if (selectionMode) {
                  setSelectedSlugs(new Set()); // Clear selections when exiting selection mode
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                selectionMode
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {selectionMode ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Select Multiple
                </>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No saved recipes yet. Browse recipes and save your favorites!</p>
        ) : (
          <>
            {/* Search input and select all */}
            <div className="mb-4 space-y-3">
              <input
                type="text"
                placeholder="Search saved recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {selectionMode && filteredItems.length > 0 && (
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedSlugs.size === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Select All ({filteredItems.length})</span>
                </label>
              )}
            </div>

            {filteredItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recipes match your search.</p>
            ) : (
              <div className="grid gap-4 sm:grid-cols-2">
                {filteredItems.map((recipe) => (
              <div
                key={recipe.slug}
                className={`bg-white rounded-lg overflow-hidden hover:shadow-md transition-all ${
                  selectionMode && selectedSlugs.has(recipe.slug)
                    ? 'border-2 border-emerald-500 bg-emerald-50'
                    : 'border border-gray-200'
                }`}
              >
                {selectionMode && (
                  <div className="p-3 border-b border-gray-100">
                    <label className="flex items-center gap-2 cursor-pointer">
                      <input
                        type="checkbox"
                        checked={selectedSlugs.has(recipe.slug)}
                        onChange={() => toggleSelection(recipe.slug)}
                        className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                      />
                      <span className="text-sm text-gray-700">Select</span>
                    </label>
                  </div>
                )}
                <a href={`/recipes/${recipe.slug}`} className="block">
                  {recipe.heroImage?.asset?.url && (
                    <Image
                      src={recipe.heroImage.asset.url}
                      alt={recipe.heroImage.alt || recipe.title}
                      width={400}
                      height={250}
                      className="w-full h-40 object-cover"
                    />
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-gray-900 hover:text-emerald-600 break-words">{recipe.title}</h3>
                    {recipe.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{recipe.description}</p>
                    )}
                  </div>
                </a>
                {!selectionMode && (
                  <div className="px-4 pb-4">
                    <button
                      onClick={() => unsave(recipe.slug)}
                      className="text-sm text-red-600 hover:text-red-700 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                )}
              </div>
            ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}

function SavedAI({ aiRecipeId }: { aiRecipeId?: string | null }) {
  const [items, setItems] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set());
  const [isDeleting, setIsDeleting] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);

  useEffect(() => {
    async function fetchAIRecipes() {
      // Get current user
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        setLoading(false);
        return;
      }

      // Fetch only current user's recipes
      const { data } = await supabase
        .from("saved_ai_recipes")
        .select("*")
        .eq("user_id", user.id) // Explicitly filter by user_id
        .order("created_at", { ascending: false });

      setItems(data ?? []);
      setLoading(false);

      // Auto-open recipe if ID is in URL
      if (aiRecipeId && data) {
        const recipe = data.find((r: any) => r.id === aiRecipeId);
        if (recipe) {
          setSelectedRecipe(recipe);

          // Scroll to AI recipes section after a brief delay
          setTimeout(() => {
            const element = document.getElementById('ai-recipes-section');
            if (element) {
              element.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }
          }, 100);
        }
      }
    }

    fetchAIRecipes();
  }, [aiRecipeId]);

  async function deleteRecipe(id: string) {
    await supabase.from("saved_ai_recipes").delete().eq("id", id);
    setItems(items.filter(r => r.id !== id));
    if (selectedRecipe?.id === id) setSelectedRecipe(null);
  }

  async function bulkDeleteRecipes() {
    if (selectedIds.size === 0) return;

    if (!confirm(`Are you sure you want to delete ${selectedIds.size} recipe${selectedIds.size > 1 ? 's' : ''}?`)) {
      return;
    }

    setIsDeleting(true);
    try {
      // Delete all selected recipes
      const { error } = await supabase
        .from("saved_ai_recipes")
        .delete()
        .in("id", Array.from(selectedIds));

      if (error) throw error;

      // Update local state
      setItems(items.filter(r => !selectedIds.has(r.id)));
      setSelectedIds(new Set());
    } catch (error) {
      console.error('Bulk delete error:', error);
      alert('Failed to delete recipes. Please try again.');
    } finally {
      setIsDeleting(false);
    }
  }

  function toggleSelection(id: string) {
    const newSelection = new Set(selectedIds);
    if (newSelection.has(id)) {
      newSelection.delete(id);
    } else {
      newSelection.add(id);
    }
    setSelectedIds(newSelection);
  }

  function toggleSelectAll() {
    if (selectedIds.size === filteredItems.length) {
      setSelectedIds(new Set());
    } else {
      setSelectedIds(new Set(filteredItems.map(r => r.id)));
    }
  }

  // Filter AI recipes based on search query
  const filteredItems = items.filter(recipe =>
    recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (selectedRecipe) {
    return (
      <section id="ai-recipes-section">
        <div className="mb-4 flex items-center justify-between">
          <button
            onClick={() => setSelectedRecipe(null)}
            className="flex items-center gap-2 text-sm text-gray-600 hover:text-gray-900"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to AI Recipes
          </button>
          <div className="flex items-center gap-3">
            <ShareRow
              title={selectedRecipe.title}
              url={`${window.location.origin}/ai-recipe/${selectedRecipe.id}`}
            />
            <button
              onClick={() => deleteRecipe(selectedRecipe.id)}
              className="text-sm text-red-600 hover:text-red-700"
            >
              Delete
            </button>
          </div>
        </div>

        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <div className="inline-flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 mb-2">
            <span>🤖</span>
            <span>AI Generated Recipe</span>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">{selectedRecipe.title}</h2>
          {selectedRecipe.description && (
            <p className="text-gray-700 mb-4">{selectedRecipe.description}</p>
          )}

          {selectedRecipe.intro_text && (
            <div className="mb-6">
              <h4 className="font-semibold text-lg mb-2">Why you'll love it</h4>
              <p className="text-gray-700">{selectedRecipe.intro_text}</p>
            </div>
          )}

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">👥</span>
              <span><strong>Serves:</strong> {selectedRecipe.servings}</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">⏱️</span>
              <span><strong>Prep:</strong> {selectedRecipe.prep_min}m</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">🔥</span>
              <span><strong>Cook:</strong> {selectedRecipe.cook_min}m</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="text-gray-500">⏰</span>
              <span><strong>Total:</strong> {selectedRecipe.prep_min + selectedRecipe.cook_min}m</span>
            </div>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="rounded-xl border p-4">
              <h4 className="flex items-center space-x-2 font-semibold text-lg mb-3">
                <span className="text-gray-500">🥄</span>
                <span>Ingredients</span>
              </h4>
              <ul className="space-y-2 text-sm">
                {selectedRecipe.ingredients?.map((ingredient: any, i: number) => {
                  const amount = [ingredient.amount, ingredient.unit].filter(Boolean).join(" ");
                  const label = amount ? `${amount} ${ingredient.name}` : ingredient.name;
                  return (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600 flex-shrink-0" />
                      <span className="text-gray-700">{label}</span>
                    </li>
                  );
                })}
              </ul>
            </div>

            <div className="rounded-xl border p-4">
              <h4 className="flex items-center space-x-2 font-semibold text-lg mb-3">
                <span className="text-gray-500">👨‍🍳</span>
                <span>Method</span>
              </h4>
              <ol className="space-y-3 text-sm">
                {selectedRecipe.steps?.map((step: string, i: number) => (
                  <li key={i} className="flex gap-3">
                    <span className="flex-shrink-0 w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-semibold">
                      {i + 1}
                    </span>
                    <span className="text-gray-700">{step}</span>
                  </li>
                ))}
              </ol>
            </div>
          </div>

          {selectedRecipe.tips && selectedRecipe.tips.length > 0 && (
            <div className="mt-6">
              <h4 className="flex items-center space-x-2 font-semibold text-lg mb-3">
                <span className="text-gray-500">💡</span>
                <span>Tips & Variations</span>
              </h4>
              <ul className="space-y-2 text-sm">
                {selectedRecipe.tips.map((tip: string, i: number) => (
                  <li key={i} className="flex items-start gap-2">
                    <span className="mt-1 h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0" />
                    <span className="text-gray-700">{tip}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {selectedRecipe.faqs && selectedRecipe.faqs.length > 0 && (
            <div className="mt-6">
              <h4 className="flex items-center space-x-2 font-semibold text-lg mb-3">
                <span className="text-gray-500">❓</span>
                <span>FAQs</span>
              </h4>
              <div className="space-y-3">
                {selectedRecipe.faqs.map((faq: any, i: number) => (
                  <div key={i} className="bg-gray-50 p-4 rounded-lg">
                    <div className="font-medium text-gray-800 mb-1">Q: {faq.question}</div>
                    <div className="text-gray-700">A: {faq.answer}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {selectedRecipe.nutrition && (
            <div className="mt-6">
              <h4 className="flex items-center space-x-2 font-semibold text-lg mb-3">
                <span className="text-gray-500">📊</span>
                <span>Nutrition (per serving)</span>
              </h4>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                <div className="bg-emerald-50 p-3 rounded text-center">
                  <div className="font-semibold text-emerald-700">{selectedRecipe.nutrition.calories}</div>
                  <div className="text-xs text-gray-600">calories</div>
                </div>
                <div className="bg-blue-50 p-3 rounded text-center">
                  <div className="font-semibold text-blue-700">{selectedRecipe.nutrition.protein}g</div>
                  <div className="text-xs text-gray-600">protein</div>
                </div>
                <div className="bg-yellow-50 p-3 rounded text-center">
                  <div className="font-semibold text-yellow-700">{selectedRecipe.nutrition.fat}g</div>
                  <div className="text-xs text-gray-600">fat</div>
                </div>
                <div className="bg-orange-50 p-3 rounded text-center">
                  <div className="font-semibold text-orange-700">{selectedRecipe.nutrition.carbs}g</div>
                  <div className="text-xs text-gray-600">carbs</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </section>
    );
  }

  return (
    <section id="ai-recipes-section">
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-xl font-semibold text-gray-900">AI-Generated Recipes</h2>
        <div className="flex items-center gap-2">
          {selectionMode && selectedIds.size > 0 && (
            <button
              onClick={bulkDeleteRecipes}
              disabled={isDeleting}
              className="flex items-center gap-2 px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition-colors disabled:opacity-50 text-sm font-medium"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              {isDeleting ? 'Deleting...' : `Delete ${selectedIds.size}`}
            </button>
          )}
          {items.length > 0 && (
            <button
              onClick={() => {
                setSelectionMode(!selectionMode);
                if (selectionMode) {
                  setSelectedIds(new Set()); // Clear selections when exiting selection mode
                }
              }}
              className={`flex items-center gap-2 px-4 py-2 rounded-lg transition-colors text-sm font-medium ${
                selectionMode
                  ? 'bg-gray-600 text-white hover:bg-gray-700'
                  : 'bg-emerald-600 text-white hover:bg-emerald-700'
              }`}
            >
              {selectionMode ? (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                  Cancel
                </>
              ) : (
                <>
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  Select Multiple
                </>
              )}
            </button>
          )}
        </div>
      </div>
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No AI recipes yet. Generate custom recipes with AI!</p>
        ) : (
          <>
            {/* Search input and select all */}
            <div className="mb-4 space-y-3">
              <input
                type="text"
                placeholder="Search AI-generated recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
              />
              {selectionMode && filteredItems.length > 0 && (
                <label className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={selectedIds.size === filteredItems.length && filteredItems.length > 0}
                    onChange={toggleSelectAll}
                    className="rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                  />
                  <span>Select All ({filteredItems.length})</span>
                </label>
              )}
            </div>

            {filteredItems.length === 0 ? (
              <p className="text-gray-500 text-center py-8">No recipes match your search.</p>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {filteredItems.map((r) => (
              <div
                key={r.id}
                className={`bg-white rounded-lg p-4 hover:shadow-md transition-all ${
                  selectionMode && selectedIds.has(r.id)
                    ? 'border-2 border-emerald-500 bg-emerald-50'
                    : 'border border-gray-200'
                }`}
              >
                <div className="flex items-start gap-3">
                  {selectionMode && (
                    <input
                      type="checkbox"
                      checked={selectedIds.has(r.id)}
                      onChange={() => toggleSelection(r.id)}
                      className="mt-1 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500 cursor-pointer"
                    />
                  )}
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex-1">
                    <Link href={`/ai-recipe/${r.id}`} className="block">
                      <h3 className="font-semibold text-gray-900 hover:text-emerald-600">{r.title}</h3>
                      {r.description && (
                        <p className="text-sm text-gray-600 mt-1 line-clamp-2">{r.description}</p>
                      )}
                      <p className="text-xs text-gray-500 mt-2">
                        {new Date(r.created_at).toLocaleDateString()}
                      </p>
                    </Link>
                    <div className="mt-2 flex items-center gap-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault();
                          setSelectedRecipe(r);
                        }}
                        className="text-xs text-emerald-600 hover:text-emerald-700"
                      >
                        View Details
                      </button>
                      <span className="text-gray-300">•</span>
                      <ShareRow
                        title={r.title}
                        url={`${window.location.origin}/ai-recipe/${r.id}`}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
              </div>
            )}
          </>
        )}
      </div>
    </section>
  );
}
