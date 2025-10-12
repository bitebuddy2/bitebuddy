import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";
import { client } from "../../sanity/client";
import { recipesByIngredientNamesQuery } from "../../sanity/queries";
import SearchBar from "@/components/SearchBar";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Search Recipes by Ingredients - What's in my Fridge? | Bite Buddy",
  description: "Find recipes based on ingredients you already have. Enter ingredients like chicken, orzo, onion and discover delicious UK copycat recipes you can make right now.",
  alternates: {
    canonical: "https://bitebuddy.co.uk/search",
  },
  openGraph: {
    title: "Search Recipes by Ingredients - What's in my Fridge? | Bite Buddy",
    description: "Find recipes based on ingredients you already have. Enter ingredients like chicken, orzo, onion and discover delicious UK copycat recipes you can make right now.",
  },
  twitter: {
    title: "Search Recipes by Ingredients - What's in my Fridge? | Bite Buddy",
    description: "Find recipes based on ingredients you already have. Enter ingredients like chicken, orzo, onion and discover delicious UK copycat recipes you can make right now.",
  },
};

// Parse ingredients from various formats into clean list
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

  // For space-only input, use capitalization to detect ingredient boundaries
  // Example: "white bread Cheddar cheese" -> ["white bread", "Cheddar cheese"]
  const words = q.split(/\s+/);
  const ingredients: string[] = [];
  let currentIngredient: string[] = [];

  for (let i = 0; i < words.length; i++) {
    const word = words[i];
    const isCapitalized = /^[A-Z]/.test(word);
    const isFirstWord = i === 0;

    // Start a new ingredient if:
    // 1. This is a capitalized word AND it's not the first word
    // 2. OR we haven't started an ingredient yet
    if ((isCapitalized && !isFirstWord && currentIngredient.length > 0) || currentIngredient.length === 0) {
      // Save previous ingredient if exists
      if (currentIngredient.length > 0) {
        ingredients.push(currentIngredient.join(' '));
        currentIngredient = [];
      }
    }

    currentIngredient.push(word);
  }

  // Don't forget the last ingredient
  if (currentIngredient.length > 0) {
    ingredients.push(currentIngredient.join(' '));
  }

  return ingredients.filter(ingredient => ingredient.length > 1);
}

export const revalidate = 30;
type PageProps = { searchParams: Promise<{ q?: string }> };

export default async function SearchPage({ searchParams }: PageProps) {
  const { q } = await searchParams;
  const names = parseNames(q);
  const hasQuery = names.length > 0;

  const recipes = hasQuery
    ? await client.fetch(recipesByIngredientNamesQuery, {
        names,
        namesLower: names.map(name => name.toLowerCase()),
        searchPattern: `*(${names.map(name => name.toLowerCase()).join("|")})*`
      })
    : [];

  return (
    <main className="mx-auto max-w-6xl p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">What's in my fridge?</h1>
        <p className="text-gray-600">Type ingredients separated by commas (e.g. <em>chicken, orzo, onion</em>).</p>

        <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <div className="flex items-start space-x-2">
            <svg className="w-4 h-4 text-blue-600 mt-0.5 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
            </svg>
            <div className="text-xs text-blue-800">
              <strong>Search Notice:</strong> Recipe matches are based on ingredient names and may not be exact. For personalized recipes with specific methods, portions, and dietary needs, try the <Link href="/" className="underline font-medium">ingredient finder</Link> on the homepage.
            </div>
          </div>
        </div>
      </header>

      <SearchBar defaultQuery={q ?? ""} />

      {hasQuery && (
        <p className="mt-4 text-sm text-gray-600">
          Showing results for:{" "}
          {names.map((n, i) => (
            <span key={i} className="mr-2 inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5">
              {n}
            </span>
          ))}
        </p>
      )}

      <section className="mt-6">
        {recipes.length === 0 ? (
          <p className="text-gray-500">
            {hasQuery ? "No recipes matched those ingredients yet." : "Enter ingredients to search."}
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r: any) => (
              <li key={r.slug}>
                <RecipeCard r={r} />
                {/* Optional: show matched ingredients below the card */}
                {r.matched?.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    Matches: {r.matched.map((m: any) => m.name || m).filter(Boolean).join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Quick link back */}
      <div className="mt-8">
        <Link href="/recipes" className="text-emerald-700 hover:underline">Browse all recipes →</Link>
      </div>
    </main>
  );
}