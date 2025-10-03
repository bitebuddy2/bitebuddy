"use client";

import { useState, useTransition, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import ShareRow from "./ShareRow";
import RecipeCard from "./RecipeCard";
import AdPlaceholder from "./AdPlaceholder";
import { client } from "@/sanity/client";
import { recipesByIngredientNamesQuery } from "@/sanity/queries";
import { supabase } from "@/lib/supabase";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "./UpgradeModal";

type Recipe = {
  slug: string;
  title: string;
  description?: string;
  introText?: string;
  servings?: number;
  prepMin?: number;
  cookMin?: number;
  kcal?: number;
  isSignature?: boolean;
  ratingSum?: number;
  ratingCount?: number;
  heroImage?: {
    asset?: { url: string; metadata?: { lqip?: string } };
    alt?: string;
  };
  brand?: {
    _id: string;
    title: string;
    slug: string;
    logo?: {
      asset?: { url: string; metadata?: { lqip?: string } };
      alt?: string;
    };
  };
  matched?: Array<{ name: string }>;
  totalMatches?: number;
  allIngredients?: Array<{ text?: string; ref?: string; refId?: string }>;
};

const METHODS = ["Any", "Bake", "Grill", "Air Fry", "BBQ"] as const;
const SPICE = ["None", "Mild", "Medium", "Hot"] as const;
const DIETS = ["None", "Vegetarian", "Vegan", "Halal", "Gluten-Free"] as const;

interface GeneratedRecipe {
  title: string;
  description: string;
  introText?: string;
  servings: number;
  prepMin: number;
  cookMin: number;
  ingredients: Array<{ name: string; amount: string; unit?: string }>;
  steps: string[];
  tips?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  nutrition?: { calories: number; protein: number; fat: number; carbs: number };
  brandName?: string;
}

// Parse ingredients from various formats into clean list (from search page)
function parseNames(q?: string): string[] {
  if (!q) return [];

  // Handle explicit separators first: commas, semicolons, pipes, or 2+ spaces
  if (/[,;|]|\s{2,}/.test(q)) {
    return q
      .split(/[,;|]+|\s{2,}/)
      .map(s => s.trim())
      .filter(Boolean)
      .filter(ingredient => ingredient.length > 1);
  }

  // For space-only input, try to intelligently split on single spaces
  // but keep common multi-word ingredients together
  const commonMultiWord = [
    'sausage meat', 'chicken breast', 'olive oil', 'sea salt', 'black pepper',
    'red wine', 'white wine', 'coconut milk', 'soy sauce', 'fish sauce',
    'tomato paste', 'beef stock', 'chicken stock', 'cream cheese', 'caster sugar',
    'plain flour', 'self raising flour', 'double cream', 'single cream'
  ];

  let result = q;

  // Replace known multi-word ingredients with temporary placeholders
  const placeholders: { [key: string]: string } = {};
  commonMultiWord.forEach((phrase, index) => {
    if (result.toLowerCase().includes(phrase.toLowerCase())) {
      const placeholder = `__MULTIWORD_${index}__`;
      placeholders[placeholder] = phrase;
      result = result.replace(new RegExp(phrase, 'gi'), placeholder);
    }
  });

  // Split on single spaces
  const parts = result
    .split(/\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  // Restore multi-word ingredients
  const restored = parts.map(part => {
    if (part.startsWith('__MULTIWORD_')) {
      return placeholders[part] || part;
    }
    return part;
  });

  return restored.filter(ingredient => ingredient.length > 1);
}

// Filter recipes based on user preferences
function filterRecipesByPreferences(recipes: Recipe[], preferences: {
  method: string;
  portions: number;
  spice: string;
  diet: string;
  avoid: string;
}) {
  return recipes.filter(recipe => {
    // Method filtering (infer from title/description)
    if (preferences.method !== "Any") {
      const text = `${recipe.title} ${recipe.description || ''} ${recipe.introText || ''}`.toLowerCase();
      const methodKeywords = {
        'bake': ['baked', 'baking', 'oven', 'roasted', 'roast'],
        'grill': ['grilled', 'grilling', 'barbecue', 'bbq'],
        'air fry': ['air fried', 'air fryer', 'crispy'],
        'bbq': ['barbecue', 'bbq', 'grilled', 'smoky', 'charred']
      };

      const methodKey = preferences.method.toLowerCase() as keyof typeof methodKeywords;
      if (methodKeywords[methodKey]) {
        const hasMethodKeyword = methodKeywords[methodKey].some(keyword => text.includes(keyword));
        if (!hasMethodKeyword) return false;
      }
    }

    // Portions filtering (reasonable range around selected portion)
    if (recipe.servings) {
      const portionDiff = Math.abs(recipe.servings - preferences.portions);
      // Allow recipes that serve within 2 servings of target (flexible)
      if (portionDiff > 2 && recipe.servings < preferences.portions * 0.5) return false;
    }

    // Diet filtering (infer from ingredients and title)
    if (preferences.diet !== "None") {
      const text = `${recipe.title} ${recipe.description || ''} ${recipe.introText || ''}`.toLowerCase();
      const dietKeywords = {
        'vegetarian': {
          exclude: ['meat', 'beef', 'pork', 'lamb', 'chicken', 'turkey', 'fish', 'salmon', 'tuna', 'bacon', 'sausage'],
          include: ['vegetarian', 'veggie']
        },
        'vegan': {
          exclude: ['meat', 'beef', 'pork', 'lamb', 'chicken', 'turkey', 'fish', 'salmon', 'tuna', 'bacon', 'sausage', 'cheese', 'milk', 'cream', 'butter', 'egg'],
          include: ['vegan']
        },
        'halal': {
          exclude: ['pork', 'bacon', 'ham', 'alcohol', 'wine', 'beer'],
          include: ['halal']
        },
        'gluten-free': {
          exclude: ['bread', 'flour', 'pasta', 'wheat', 'gluten'],
          include: ['gluten-free', 'gluten free']
        }
      };

      const dietKey = preferences.diet.toLowerCase().replace('-', '') as keyof typeof dietKeywords;
      if (dietKeywords[dietKey]) {
        const { exclude, include } = dietKeywords[dietKey];

        // Check for explicit diet mentions first
        const hasIncludeKeyword = include.some(keyword => text.includes(keyword));
        if (hasIncludeKeyword) return true;

        // Then check for exclusions
        const hasExcludeKeyword = exclude.some(keyword => text.includes(keyword));
        if (hasExcludeKeyword) return false;
      }
    }

    // Spice level filtering (infer from title/description)
    if (preferences.spice !== "None") {
      const text = `${recipe.title} ${recipe.description || ''} ${recipe.introText || ''}`.toLowerCase();
      const spiceKeywords = {
        'mild': ['mild', 'gentle', 'light'],
        'medium': ['medium', 'moderate', 'spiced'],
        'hot': ['hot', 'spicy', 'fiery', 'chili', 'jalapeño', 'cayenne', 'sriracha', 'ghost pepper', 'scotch bonnet']
      };

      const spiceKey = preferences.spice.toLowerCase() as keyof typeof spiceKeywords;
      if (spiceKeywords[spiceKey]) {
        const hasSpiceKeyword = spiceKeywords[spiceKey].some(keyword => text.includes(keyword));
        // For mild/medium, don't filter out if no spice keywords found
        // For hot, only include if spice keywords are present
        if (preferences.spice === "Hot" && !hasSpiceKeyword) return false;
      }
    }

    // Ingredients to avoid filtering
    if (preferences.avoid.trim()) {
      const avoidList = preferences.avoid.toLowerCase().split(',').map(item => item.trim()).filter(Boolean);

      // Check recipe text (title, description, intro)
      const text = `${recipe.title} ${recipe.description || ''} ${recipe.introText || ''}`.toLowerCase();
      const hasAvoidedInText = avoidList.some(avoided => text.includes(avoided));

      // Check actual ingredients list if available
      let hasAvoidedInIngredients = false;
      if (recipe.allIngredients) {
        const ingredientNames = recipe.allIngredients
          .map(ing => {
            // Extract name from text, ref, or refId
            if (ing.text && ing.text !== 'null') return ing.text;
            if (ing.ref && ing.ref !== 'null') return ing.ref;
            if (ing.refId && ing.refId !== 'null') {
              // Extract readable name from ingredient ID (e.g., "ingredient.sausage-meat" -> "sausage meat")
              return ing.refId.replace('ingredient.', '').replace(/-/g, ' ');
            }
            return '';
          })
          .map(name => name.toLowerCase())
          .filter(Boolean);

        hasAvoidedInIngredients = avoidList.some(avoided =>
          ingredientNames.some(ingredient =>
            ingredient.includes(avoided) || avoided.includes(ingredient)
          )
        );
      }

      if (hasAvoidedInText || hasAvoidedInIngredients) return false;
    }

    return true;
  });
}

export default function IngredientFinder() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Recipe[]>([]);
  const [isPending, start] = useTransition();
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedRecipe, setGeneratedRecipe] = useState<GeneratedRecipe | null>(null);
  const [searchedIngredients, setSearchedIngredients] = useState<string[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const { isPremium } = useSubscription();

  // preferences (used by AI generation)
  const [method, setMethod] = useState<(typeof METHODS)[number]>("Any");
  const [portions, setPortions] = useState(2);
  const [spice, setSpice] = useState<(typeof SPICE)[number]>("None");
  const [diet, setDiet] = useState<(typeof DIETS)[number]>("None");
  const [avoid, setAvoid] = useState("");

  // Get user ID
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  // Load last generated recipe from localStorage on mount
  useEffect(() => {
    const saved = localStorage.getItem("lastGeneratedRecipe");
    if (saved) {
      try {
        const recipe = JSON.parse(saved);
        setGeneratedRecipe(recipe);
      } catch (error) {
        console.error("Failed to load last recipe:", error);
      }
    }
  }, []);

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;

    start(async () => {
      // Parse ingredients using the same logic as search page
      const names = parseNames(query);
      setSearchedIngredients(names);

      if (names.length === 0) {
        setResults([]);
        return;
      }

      try {
        // Use the same Sanity query as the search page
        const recipes = await client.fetch(recipesByIngredientNamesQuery, {
          names,
          namesLower: names.map(name => name.toLowerCase()),
          searchPattern: `*(${names.map(name => name.toLowerCase()).join("|")}).*`
        });

        // Apply preference-based filtering
        const filteredRecipes = filterRecipesByPreferences(recipes || [], {
          method,
          portions,
          spice,
          diet,
          avoid
        });

        setResults(filteredRecipes);
      } catch (error) {
        console.error('Search error:', error);
        setResults([]);
      }
    });
  }

  async function saveAIRecipe() {
    if (!generatedRecipe) return;

    const { data: { user } } = await supabase.auth.getUser();
    if (!user) {
      window.location.href = "/account";
      return;
    }

    setIsSaving(true);
    try {
      const { error } = await supabase.from("saved_ai_recipes").insert({
        user_id: user.id,
        title: generatedRecipe.title,
        description: generatedRecipe.description || "",
        intro_text: generatedRecipe.introText || "",
        servings: generatedRecipe.servings,
        prep_min: generatedRecipe.prepMin,
        cook_min: generatedRecipe.cookMin,
        ingredients: generatedRecipe.ingredients,
        steps: generatedRecipe.steps,
        tips: generatedRecipe.tips || [],
        faqs: generatedRecipe.faqs || [],
        nutrition: generatedRecipe.nutrition || null,
        data: generatedRecipe, // Store full recipe object in data column
      });

      if (error) throw error;

      setIsSaved(true);
    } catch (error: any) {
      console.error("Save error:", error);
      alert(`Failed to save recipe: ${error.message || error}`);
    } finally {
      setIsSaving(false);
    }
  }

  async function onGenerateAI() {
    if (!q.trim()) {
      alert("Please enter a recipe idea or ingredients first!");
      return;
    }

    // Check if user is logged in
    if (!userId) {
      window.location.href = "/account";
      return;
    }

    setIsGenerating(true);
    setGeneratedRecipe(null); // Clear previous recipe
    setResults([]); // Clear search results to hide "No matches found" message
    setSearchedIngredients([]); // Clear searched ingredients display

    try {
      // Basic validation for obvious incompatible combinations
      const query = q.trim().toLowerCase();
      const selectedMethod = method.toLowerCase();

      // Check for obviously incompatible method + food combinations
      const incompatibleCombinations = [
        { foods: ['ramen', 'noodles', 'soup', 'broth'], methods: ['bake', 'grill', 'bbq'] },
        { foods: ['ice cream', 'sorbet', 'frozen'], methods: ['bake', 'grill', 'bbq', 'air fry'] },
        { foods: ['salad', 'raw'], methods: ['bake', 'grill', 'bbq', 'air fry'] },
        { foods: ['smoothie', 'drink', 'beverage'], methods: ['bake', 'grill', 'bbq', 'air fry'] }
      ];

      for (const combo of incompatibleCombinations) {
        const hasFood = combo.foods.some(food => query.includes(food));
        const hasMethod = combo.methods.includes(selectedMethod);
        if (hasFood && hasMethod && method !== "Any") {
          alert("Sorry, this combination isn't possible. Please try a different cooking method or recipe idea.");
          setIsGenerating(false);
          return;
        }
      }

      // Build a comprehensive prompt from all user selections
      const promptParts = [`Create a recipe with: ${q.trim()}`];

      // Add cooking method if specified
      if (method !== "Any") {
        promptParts.push(`using ${method.toLowerCase()} cooking method`);
      }

      // Add serving size
      promptParts.push(`for ${portions} ${portions === 1 ? 'person' : 'people'}`);

      // Add spice level
      if (spice !== "None") {
        const spiceMap = {
          "Mild": "mildly spiced",
          "Medium": "medium spiced",
          "Hot": "hot and spicy"
        };
        promptParts.push(`make it ${spiceMap[spice as keyof typeof spiceMap]}`);
      }

      // Add dietary requirements
      if (diet !== "None") {
        promptParts.push(`suitable for ${diet.toLowerCase()} diet`);
      }

      // Add ingredients to avoid
      if (avoid.trim()) {
        promptParts.push(`avoiding these ingredients: ${avoid.trim()}`);
      }

      const prompt = promptParts.join(", ") + ".";

      // Call the preview API (doesn't save to Sanity)
      const response = await fetch("/api/generate-preview", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt, userId }),
      });

      const data = await response.json();

      if (response.ok && data.ok) {
        // Success! Display the recipe locally
        setGeneratedRecipe(data.recipe);
        setResults([]); // Clear search results to show generated recipe
        setIsSaved(false); // Reset save state for new recipe

        // Save to localStorage as the last generated recipe
        localStorage.setItem("lastGeneratedRecipe", JSON.stringify(data.recipe));
      } else if (response.status === 429 && data.needsUpgrade) {
        // Rate limit hit - show upgrade modal
        setShowUpgradeModal(true);
      } else {
        // Check if it's an impossible combination error
        const errorMsg = data.error || "Unknown error";
        if (errorMsg.toLowerCase().includes("impossible") ||
            errorMsg.toLowerCase().includes("not possible") ||
            errorMsg.toLowerCase().includes("incompatible")) {
          alert("Sorry, this combination isn't possible. Please try a different cooking method or recipe idea.");
        } else {
          alert(`Recipe generation failed: ${errorMsg}`);
        }
      }
    } catch (error) {
      console.error("AI Generation Error:", error);
      alert("Failed to generate recipe. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  }

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-2xl border p-4 bg-white shadow-sm">
        {/* Logo, Title, and Description */}
        <div className="flex flex-col sm:flex-row items-center gap-3 mb-4 pb-3 border-b bg-white">
          <Image
            src="/AI.svg"
            alt="Bite Buddy"
            width={80}
            height={80}
            className="flex-shrink-0"
          />
          <div className="text-center sm:text-left">
            <h2 className="text-lg sm:text-xl font-bold mb-1 text-black">Bite Buddy - The Smartest AI Recipe Generator</h2>
            <p className="text-xs sm:text-sm text-black sm:text-gray-600">
              Turn your ingredients into restaurant-style recipes in seconds with our AI recipe maker
            </p>
          </div>
        </div>

        {/* Primary idea/search input */}
        <form onSubmit={onSearch} className="flex flex-col sm:flex-row gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Enter a recipe idea or ingredients"
            className="h-11 w-full flex-1 rounded-lg border border-gray-300 sm:border-gray-300 px-3 text-sm focus:border-black sm:focus:border-emerald-400 focus:outline-none"
          />
          <div className="flex gap-2">
            <button
              type="submit"
              className="h-11 flex-1 sm:flex-none rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
              disabled={isPending}
              title="Search your recipes first"
            >
              {isPending ? "Searching…" : "Find"}
            </button>
            <button
              type="button"
              onClick={onGenerateAI}
              disabled={isGenerating || !q.trim()}
              className="h-11 flex-1 sm:flex-none rounded-lg px-4 text-sm font-semibold text-white disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
              style={{ backgroundColor: '#FF5757' }}
              title="Use AI to create a new recipe idea from your input"
            >
              {isGenerating ? "Generating..." : "Create AI"}
            </button>
          </div>
        </form>

        <p className="mt-2 text-xs text-gray-500">
          Tip: separate ingredients with commas — e.g. <em>chicken, thyme</em>. Use "Find" to search existing recipes (filtered by your preferences below) or "Create with AI" to generate a new recipe.
        </p>

        {(method !== "Any" || portions !== 2 || spice !== "None" || diet !== "None" || avoid.trim()) && (
          <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
            <div className="flex items-start space-x-2">
              <svg className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
              </svg>
              <div className="text-xs text-amber-800">
                <strong>Filtering Notice:</strong> Existing recipes may not match your preferences completely but are filtered as best as possible. For more results, try leaving method as "Any" and portions as "2".
              </div>
            </div>
          </div>
        )}

        {/* Preferences row (for AI; captured now, used later) */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {/* Method + Portions */}
          <div className="rounded-xl border p-3">
            <div className="mb-2 text-xs font-semibold uppercase text-gray-500">Method</div>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    method === m ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-gray-50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs font-semibold uppercase text-gray-500">Portions</div>
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                className="rounded-full border px-3 py-1 text-xs hover:bg-gray-50"
                onClick={() => setPortions(Math.max(1, portions - 1))}
                aria-label="Decrease portions"
              >
                –
              </button>
              <span className="min-w-[2ch] text-center text-sm font-medium">{portions}</span>
              <button
                type="button"
                className="rounded-full border px-3 py-1 text-xs hover:bg-gray-50"
                onClick={() => setPortions(portions + 1)}
                aria-label="Increase portions"
              >
                +
              </button>
            </div>
          </div>

          {/* Spice + Diet + Avoid */}
          <div className="rounded-xl border p-3">
            <div className="mb-2 text-xs font-semibold uppercase text-gray-500">Spice</div>
            <div className="flex flex-wrap gap-2">
              {SPICE.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpice(s)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    spice === s ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-gray-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs font-semibold uppercase text-gray-500">Diet</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {DIETS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiet(d)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    diet === d ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-gray-50"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                Ingredients to avoid (comma-separated)
              </label>
              <input
                value={avoid}
                onChange={(e) => setAvoid(e.target.value)}
                placeholder="e.g. nuts, shellfish"
                className="h-10 w-full rounded-lg border px-3 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Loading shimmer */}
        {isPending && (
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="overflow-hidden rounded-lg border transition animate-pulse">
                <div className="aspect-[16/10] w-full bg-gray-200" />
                <div className="p-3">
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Searched ingredients display */}
        {searchedIngredients.length > 0 && !generatedRecipe && (
          <div className="mt-4">
            <p className="text-sm text-gray-600 mb-2">
              Showing results for:{" "}
            </p>
            <div className="flex flex-wrap gap-2">
              {searchedIngredients.map((ingredient, i) => (
                <span key={i} className="inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5 text-xs">
                  {ingredient}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Empty state */}
        {!isPending && results.length === 0 && searchedIngredients.length > 0 && !generatedRecipe && (
          <div className="mt-4 p-4 bg-gray-50 rounded-lg">
            <p className="text-sm text-gray-600 mb-2">
              No recipes matched those ingredients with your current preferences.
            </p>
            <div className="text-xs text-gray-500">
              Try adjusting your preferences (method, diet, spice level) or use "Create with AI" to generate a new recipe!
            </div>
          </div>
        )}

        {/* AI Generated Recipe */}
        {generatedRecipe && (
          <div className="mt-6 border rounded-2xl p-6 bg-white shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="inline-flex items-center space-x-2 text-sm text-emerald-700 bg-emerald-50 rounded-full px-3 py-1 mb-2">
                  <span>🤖</span>
                  <span>AI Generated Recipe</span>
                </div>
                <h3 className="text-2xl font-bold text-gray-900">{generatedRecipe.title}</h3>
              </div>
              <div className="flex items-center gap-3">
                <ShareRow
                  title={generatedRecipe.title}
                  url={`${window.location.origin}/recipes?preview=${encodeURIComponent(JSON.stringify(generatedRecipe))}`}
                />
                <button
                  onClick={saveAIRecipe}
                  disabled={isSaving || isSaved}
                  className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                  title={isSaved ? "Recipe saved to your account" : "Save recipe to your account"}
                >
                  {isSaving ? (
                    <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                  ) : isSaved ? (
                    <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
                    </svg>
                  )}
                  {isSaved ? "Saved" : "Save"}
                </button>
              </div>
            </div>

            {generatedRecipe.description && (
              <p className="text-gray-700 mb-4">{generatedRecipe.description}</p>
            )}

            {generatedRecipe.introText && (
              <div className="mb-6">
                <h4 className="font-semibold text-lg mb-2">Why you'll love it</h4>
                <p className="text-gray-700">{generatedRecipe.introText}</p>
              </div>
            )}

            {/* Recipe Info */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">👥</span>
                <span><strong>Serves:</strong> {generatedRecipe.servings}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">⏱️</span>
                <span><strong>Prep:</strong> {generatedRecipe.prepMin}m</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">🔥</span>
                <span><strong>Cook:</strong> {generatedRecipe.cookMin}m</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">⏰</span>
                <span><strong>Total:</strong> {generatedRecipe.prepMin + generatedRecipe.cookMin}m</span>
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
              {/* Ingredients */}
              <div className="rounded-xl border p-4">
                <h4 className="flex items-center space-x-2 font-semibold text-lg mb-3">
                  <span className="text-gray-500">🥄</span>
                  <span>Ingredients</span>
                </h4>
                <ul className="space-y-2 text-sm">
                  {generatedRecipe.ingredients.map((ingredient, i) => {
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
                <h4 className="flex items-center space-x-2 font-semibold text-lg mb-3">
                  <span className="text-gray-500">👨‍🍳</span>
                  <span>Method</span>
                </h4>
                <ol className="space-y-3 text-sm">
                  {generatedRecipe.steps.map((step, i) => (
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
            {generatedRecipe.tips && generatedRecipe.tips.length > 0 && (
              <div className="mt-6">
                <h4 className="flex items-center space-x-2 font-semibold text-lg mb-3">
                  <span className="text-gray-500">💡</span>
                  <span>Tips & Variations</span>
                </h4>
                <ul className="space-y-2 text-sm">
                  {generatedRecipe.tips.map((tip, i) => (
                    <li key={i} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-yellow-500 flex-shrink-0" />
                      <span className="text-gray-700">{tip}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* FAQs */}
            {generatedRecipe.faqs && generatedRecipe.faqs.length > 0 && (
              <div className="mt-6">
                <h4 className="flex items-center space-x-2 font-semibold text-lg mb-3">
                  <span className="text-gray-500">❓</span>
                  <span>FAQs</span>
                </h4>
                <div className="space-y-3">
                  {generatedRecipe.faqs.map((faq, i) => (
                    <div key={i} className="bg-gray-50 p-4 rounded-lg">
                      <div className="font-medium text-gray-800 mb-1">Q: {faq.question}</div>
                      <div className="text-gray-700">A: {faq.answer}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Nutrition */}
            {generatedRecipe.nutrition && (
              <div className="mt-6">
                <h4 className="flex items-center space-x-2 font-semibold text-lg mb-3">
                  <span className="text-gray-500">📊</span>
                  <span>Nutrition (per serving)</span>
                </h4>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div className="bg-emerald-50 p-3 rounded text-center">
                    <div className="font-semibold text-emerald-700">{generatedRecipe.nutrition.calories}</div>
                    <div className="text-xs text-gray-600">calories</div>
                  </div>
                  <div className="bg-blue-50 p-3 rounded text-center">
                    <div className="font-semibold text-blue-700">{generatedRecipe.nutrition.protein}g</div>
                    <div className="text-xs text-gray-600">protein</div>
                  </div>
                  <div className="bg-yellow-50 p-3 rounded text-center">
                    <div className="font-semibold text-yellow-700">{generatedRecipe.nutrition.fat}g</div>
                    <div className="text-xs text-gray-600">fat</div>
                  </div>
                  <div className="bg-orange-50 p-3 rounded text-center">
                    <div className="font-semibold text-orange-700">{generatedRecipe.nutrition.carbs}g</div>
                    <div className="text-xs text-gray-600">carbs</div>
                  </div>
                </div>
              </div>
            )}

            {/* Action to start over */}
            <div className="mt-6 pt-4 border-t text-center">
              <button
                onClick={() => setGeneratedRecipe(null)}
                className="text-sm text-gray-600 hover:text-gray-800"
              >
                ← Generate another recipe
              </button>
            </div>

            {/* Ad at end of AI recipe */}
            <div className="mt-6">
              <AdPlaceholder size="banner" />
            </div>
          </div>
        )}

        {/* Search Results */}
        {!generatedRecipe && results.length > 0 && (
          <section className="mt-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">
                {results.length} Recipe{results.length === 1 ? '' : 's'} Found
              </h3>
              {(method !== "Any" || spice !== "None" || diet !== "None" || avoid.trim()) && (
                <div className="flex items-center space-x-2 text-xs text-gray-600">
                  <span className="inline-flex items-center space-x-1 bg-blue-50 border border-blue-200 rounded-full px-2 py-1">
                    <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M3 3a1 1 0 011-1h12a1 1 0 011 1v3a1 1 0 01-.293.707L12 11.414V15a1 1 0 01-.293.707l-2 2A1 1 0 018 17v-5.586L3.293 6.707A1 1 0 013 6V3z" clipRule="evenodd" />
                    </svg>
                    <span>Filtered by preferences</span>
                  </span>
                </div>
              )}
            </div>
            <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {results.slice(0, 9).map((recipe, index) => (
                <>
                  <div key={recipe.slug}>
                    <RecipeCard r={recipe} />
                    {/* Show matched ingredients below the card */}
                    {recipe.matched && recipe.matched.length > 0 && (
                      <div className="mt-2 text-xs text-gray-500">
                        <p>
                          Matches: {recipe.matched.map((m: any) => m.name || m).filter(Boolean).join(", ")}
                        </p>
                        <p className="text-red-600">
                          Missing: {searchedIngredients.filter(searched =>
                            !recipe.matched?.some((m: any) => {
                              const matchName = (m.name || m).toLowerCase();
                              const searchedLower = searched.toLowerCase();
                              return matchName.includes(searchedLower) || searchedLower.includes(matchName);
                            })
                          ).join(", ")}
                        </p>
                      </div>
                    )}
                  </div>
                  {/* Ad after every 6 recipes */}
                  {(index + 1) % 6 === 0 && index !== results.slice(0, 9).length - 1 && (
                    <div key={`ad-${index}`} className="sm:col-span-2 lg:col-span-3">
                      <AdPlaceholder size="banner" className="my-2" />
                    </div>
                  )}
                </>
              ))}
            </ul>

            {/* Limit note */}
            {results.length > 9 && (
              <p className="mt-4 text-sm text-gray-600">
                Showing 9 of {results.length} recipes.{" "}
                <Link href={`/search?q=${encodeURIComponent(q)}`} className="text-emerald-700 underline">
                  See all results →
                </Link>
              </p>
            )}
          </section>
        )}
      </div>

      {/* Upgrade Modal */}
      {showUpgradeModal && userId && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          userId={userId}
        />
      )}
    </section>
  );
}
