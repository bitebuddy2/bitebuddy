"use client";
import { supabase, getSupabaseBrowserClient } from "@/lib/supabase";
import { useEffect, useState, Suspense } from "react";
import { client } from "@/sanity/client";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import MealPlannerCalendar from "@/components/MealPlannerCalendar";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "@/components/UpgradeModal";
import ShareRow from "@/components/ShareRow";
import Link from "next/link";

function AccountContent() {
  const [user, setUser] = useState<any>(null);
  const searchParams = useSearchParams();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

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
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

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
          },
        });

        if (error) throw error;
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
      setMessage({ type: 'error', text: error.message || 'Authentication failed' });
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
                <input
                  id="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full rounded-lg border border-gray-300 px-4 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  placeholder="••••••••"
                  minLength={6}
                />
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

function Dashboard({ user, searchParams }: { user: any; searchParams: any }) {
  const tabParam = searchParams.get("tab");
  const aiRecipeId = searchParams.get("ai");
  const [activeTab, setActiveTab] = useState<"recipes" | "planner">(tabParam === "planner" ? "planner" : "recipes");
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [isManagingSubscription, setIsManagingSubscription] = useState(false);
  const { isPremium, subscription } = useSubscription();
  const hasStripeCustomer = subscription?.stripe_customer_id;

  // Get user's display name
  const userName = user?.user_metadata?.full_name ||
                   user?.user_metadata?.name ||
                   user?.email?.split('@')[0] ||
                   'there';

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

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-6xl px-4 py-8">
        {/* Header Section with Greeting */}
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4 mb-4">
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

            {/* Action Buttons - Fixed for mobile */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-3">
              {isPremium && hasStripeCustomer ? (
                <button
                  onClick={handleManageSubscription}
                  disabled={isManagingSubscription}
                  className="whitespace-nowrap rounded-lg border border-emerald-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-emerald-600 hover:bg-emerald-50 disabled:opacity-50 transition-colors"
                >
                  {isManagingSubscription ? "Loading..." : "Manage Subscription"}
                </button>
              ) : !isPremium ? (
                <button
                  onClick={() => setShowUpgradeModal(true)}
                  className="whitespace-nowrap rounded-lg bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 sm:px-4 py-2 text-xs sm:text-sm font-semibold text-white hover:from-emerald-600 hover:to-emerald-700 transition-all"
                >
                  ⭐ Upgrade to Premium
                </button>
              ) : null}
              <button
                onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
                className="whitespace-nowrap rounded-lg border border-gray-300 px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                Sign Out
              </button>
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
          </nav>
        </div>

        {/* Tab Content */}
        {activeTab === "recipes" ? (
          <div className="max-w-4xl">
            <SavedPublished />
            <SavedAI aiRecipeId={aiRecipeId} />
          </div>
        ) : (
          <MealPlannerCalendar />
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

  return (
    <section className="mb-10">
      <h2 className="text-xl font-semibold mb-4 text-gray-900">Saved Recipes</h2>
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No saved recipes yet. Browse recipes and save your favorites!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((recipe) => (
              <div key={recipe.slug} className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:shadow-md transition-shadow">
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
                    <h3 className="font-semibold text-gray-900 hover:text-emerald-600">{recipe.title}</h3>
                    {recipe.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{recipe.description}</p>
                    )}
                  </div>
                </a>
                <div className="px-4 pb-4">
                  <button
                    onClick={() => unsave(recipe.slug)}
                    className="text-sm text-red-600 hover:text-red-700 hover:underline"
                  >
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

function SavedAI({ aiRecipeId }: { aiRecipeId?: string | null }) {
  const [items, setItems] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("saved_ai_recipes").select("*").order("created_at", { ascending:false })
      .then(({ data }) => {
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
      });
  }, [aiRecipeId]);

  async function deleteRecipe(id: string) {
    await supabase.from("saved_ai_recipes").delete().eq("id", id);
    setItems(items.filter(r => r.id !== id));
    if (selectedRecipe?.id === id) setSelectedRecipe(null);
  }

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
      <h2 className="text-xl font-semibold mb-4 text-gray-900">AI-Generated Recipes</h2>
      <div className="bg-gray-50 rounded-lg border border-gray-200 p-6">
        {loading ? (
          <p className="text-gray-500 text-center py-8">Loading...</p>
        ) : items.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No AI recipes yet. Generate custom recipes with AI!</p>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {items.map((r) => (
              <div
                key={r.id}
                className="bg-white rounded-lg border border-gray-200 p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
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
      </div>
    </section>
  );
}
