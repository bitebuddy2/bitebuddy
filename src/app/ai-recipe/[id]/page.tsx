import { createClient } from "@supabase/supabase-js";
import { notFound } from "next/navigation";
import ShareRow from "@/components/ShareRow";
import Link from "next/link";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

interface Ingredient {
  name: string;
  amount: string;
  unit?: string;
}

interface FAQ {
  question: string;
  answer: string;
}

interface Nutrition {
  calories: number;
  protein: number;
  fat: number;
  carbs: number;
}

interface AIRecipe {
  id: string;
  user_id: string;
  title: string;
  description: string;
  intro_text?: string;
  servings: number;
  prep_min: number;
  cook_min: number;
  ingredients: Ingredient[];
  steps: string[];
  tips?: string[];
  faqs?: FAQ[];
  nutrition?: Nutrition;
  brand_name?: string;
  created_at: string;
}

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: recipe } = await supabase
    .from("saved_ai_recipes")
    .select("title, description")
    .eq("id", id)
    .single();

  if (!recipe) {
    return {
      title: "Recipe Not Found",
    };
  }

  return {
    title: `${recipe.title} | BiteBuddy AI Recipe`,
    description: recipe.description || `Check out this AI-generated recipe: ${recipe.title}`,
  };
}

export default async function AIRecipePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const { data: recipe, error } = await supabase
    .from("saved_ai_recipes")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !recipe) {
    notFound();
  }

  const aiRecipe = recipe as AIRecipe;
  const shareUrl = `${process.env.NEXT_PUBLIC_SITE_URL || 'https://bitebuddy.uk'}/ai-recipe/${aiRecipe.id}`;

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <div className="mb-6">
        <Link href="/account" className="text-sm text-emerald-600 hover:text-emerald-700">
          ← Back to My Recipes
        </Link>
      </div>

      <div className="border rounded-2xl p-6 bg-white shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <div>
            <div className="inline-flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 mb-2">
              <span>🤖</span>
              <span>AI Generated Recipe</span>
            </div>
            <h1 className="text-3xl font-bold text-gray-900">{aiRecipe.title}</h1>
          </div>
          <div className="flex items-center gap-3">
            <ShareRow title={aiRecipe.title} url={shareUrl} />
          </div>
        </div>

        {aiRecipe.description && (
          <p className="text-gray-700 mb-4 text-lg">{aiRecipe.description}</p>
        )}

        {aiRecipe.intro_text && (
          <div className="mb-6">
            <h2 className="font-semibold text-lg mb-2">Why you&apos;ll love it</h2>
            <p className="text-gray-700">{aiRecipe.intro_text}</p>
          </div>
        )}

        {/* Recipe Info */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">👥</span>
            <span><strong>Serves:</strong> {aiRecipe.servings}</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">⏱️</span>
            <span><strong>Prep:</strong> {aiRecipe.prep_min}m</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">🔥</span>
            <span><strong>Cook:</strong> {aiRecipe.cook_min}m</span>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-gray-500">⏰</span>
            <span><strong>Total:</strong> {aiRecipe.prep_min + aiRecipe.cook_min}m</span>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Ingredients */}
          <div className="rounded-xl border p-4">
            <h2 className="flex items-center space-x-2 font-semibold text-lg mb-3">
              <span className="text-gray-500">🥄</span>
              <span>Ingredients</span>
            </h2>
            <ul className="space-y-2 text-sm">
              {aiRecipe.ingredients.map((ingredient, i) => {
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

          {/* Method */}
          <div className="rounded-xl border p-4">
            <h2 className="flex items-center space-x-2 font-semibold text-lg mb-3">
              <span className="text-gray-500">👨‍🍳</span>
              <span>Method</span>
            </h2>
            <ol className="space-y-3 text-sm">
              {aiRecipe.steps.map((step, i) => (
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

        {/* Tips & Variations */}
        {aiRecipe.tips && aiRecipe.tips.length > 0 && (
          <div className="mt-6">
            <h2 className="flex items-center space-x-2 font-semibold text-lg mb-3">
              <span className="text-gray-500">💡</span>
              <span>Tips & Variations</span>
            </h2>
            <ul className="space-y-2 text-sm">
              {aiRecipe.tips.map((tip, i) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0" />
                  <span className="text-gray-700">{tip}</span>
                </li>
              ))}
            </ul>
          </div>
        )}

        {/* FAQs */}
        {aiRecipe.faqs && aiRecipe.faqs.length > 0 && (
          <div className="mt-6">
            <h2 className="flex items-center space-x-2 font-semibold text-lg mb-3">
              <span className="text-gray-500">❓</span>
              <span>FAQs</span>
            </h2>
            <div className="space-y-3">
              {aiRecipe.faqs.map((faq, i) => (
                <div key={i} className="bg-gray-50 p-4 rounded-lg">
                  <div className="font-medium text-gray-800 mb-1">Q: {faq.question}</div>
                  <div className="text-gray-700">A: {faq.answer}</div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Nutrition */}
        {aiRecipe.nutrition && (
          <div className="mt-6">
            <h2 className="flex items-center space-x-2 font-semibold text-lg mb-3">
              <span className="text-gray-500">📊</span>
              <span>Nutrition (per serving)</span>
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
              <div className="bg-emerald-50 p-3 rounded text-center">
                <div className="font-semibold text-emerald-700">{aiRecipe.nutrition.calories}</div>
                <div className="text-xs text-gray-600">calories</div>
              </div>
              <div className="bg-blue-50 p-3 rounded text-center">
                <div className="font-semibold text-blue-700">{aiRecipe.nutrition.protein}g</div>
                <div className="text-xs text-gray-600">protein</div>
              </div>
              <div className="bg-yellow-50 p-3 rounded text-center">
                <div className="font-semibold text-yellow-700">{aiRecipe.nutrition.fat}g</div>
                <div className="text-xs text-gray-600">fat</div>
              </div>
              <div className="bg-orange-50 p-3 rounded text-center">
                <div className="font-semibold text-orange-700">{aiRecipe.nutrition.carbs}g</div>
                <div className="text-xs text-gray-600">carbs</div>
              </div>
            </div>
          </div>
        )}
      </div>
    </main>
  );
}
