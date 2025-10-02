"use client";
import { supabase } from "@/lib/supabase";
import { useEffect, useState } from "react";
import { client } from "@/sanity/client";
import Image from "next/image";

export default function AccountPage() {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
  }, []);

  if (!user) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="max-w-md w-full space-y-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900">Welcome to Bite Buddy</h1>
            <p className="mt-2 text-sm text-gray-600">Sign in to save your favorite recipes</p>
          </div>
          <div className="mt-8 space-y-3">
            <button
              className="w-full flex items-center justify-center gap-3 rounded-lg bg-black px-4 py-3 text-white font-medium hover:bg-gray-900 transition-colors"
              onClick={() => supabase.auth.signInWithOAuth({ provider: "google" })}
            >
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path fill="currentColor" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
                <path fill="currentColor" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
                <path fill="currentColor" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
                <path fill="currentColor" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
              </svg>
              Continue with Google
            </button>
            <button
              className="w-full rounded-lg border-2 border-gray-300 px-4 py-3 text-gray-700 font-medium hover:bg-gray-50 transition-colors"
              onClick={async () => {
                const email = prompt("Enter your email");
                if (!email) return;
                await supabase.auth.signInWithOtp({ email });
                alert("Check your email for a login link.");
              }}
            >
              Sign in with Email Link
            </button>
          </div>
        </div>
      </div>
    );
  }

  return <Dashboard user={user} />;
}

function Dashboard({ user }: { user: any }) {
  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">My Recipes</h1>
            <p className="mt-1 text-sm text-gray-600">Signed in as {user.email}</p>
          </div>
          <button
            onClick={() => supabase.auth.signOut().then(() => window.location.reload())}
            className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Sign Out
          </button>
        </div>
        <SavedPublished />
        <SavedAI />
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

function SavedAI() {
  const [items, setItems] = useState<any[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    supabase.from("saved_ai_recipes").select("*").order("created_at", { ascending:false })
      .then(({ data }) => {
        setItems(data ?? []);
        setLoading(false);
      });
  }, []);

  async function deleteRecipe(id: string) {
    await supabase.from("saved_ai_recipes").delete().eq("id", id);
    setItems(items.filter(r => r.id !== id));
    if (selectedRecipe?.id === id) setSelectedRecipe(null);
  }

  if (selectedRecipe) {
    return (
      <section>
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
          <button
            onClick={() => deleteRecipe(selectedRecipe.id)}
            className="text-sm text-red-600 hover:text-red-700"
          >
            Delete
          </button>
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
    <section>
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
                onClick={() => setSelectedRecipe(r)}
                className="bg-white rounded-lg border border-gray-200 p-4 cursor-pointer hover:shadow-md transition-shadow"
              >
                <div className="flex items-start gap-3">
                  <svg className="w-5 h-5 text-emerald-600 mt-0.5 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900 hover:text-emerald-600">{r.title}</h3>
                    {r.description && (
                      <p className="text-sm text-gray-600 mt-1 line-clamp-2">{r.description}</p>
                    )}
                    <p className="text-xs text-gray-500 mt-2">
                      {new Date(r.created_at).toLocaleDateString()}
                    </p>
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
