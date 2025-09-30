import Link from "next/link";
import Image from "next/image";
import TopSearch from "@/components/TopSearch";
import IngredientFinder from "@/components/IngredientFinder";
import RecipeCard from "@/components/RecipeCard";
import { client } from "@/sanity/client";
import { allRecipesForCardsQuery } from "@/sanity/queries";

type CardRecipe = Parameters<typeof RecipeCard>[0]["r"];

export default async function HomePage() {
  const recipes: CardRecipe[] = await client.fetch(allRecipesForCardsQuery);

  return (
    <main>
      {/* TOP SEARCH (title) */}
      <TopSearch />

      {/* HERO */}
      <section className="border-b bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.09),transparent_60%)]">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            UK Copycat Recipes, Made Easy
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-700">
            Simple, fast, and tasty—recreate Greggs, Nando's, Wagamama and more.
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              href="/recipes"
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* INGREDIENT FINDER */}
      <IngredientFinder />

      {/* LATEST RECIPES */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Latest Recipes</h2>
          <Link href="/recipes" className="text-sm text-emerald-700 hover:underline">
            View all
          </Link>
        </div>

        {recipes.length === 0 ? (
          <p className="text-gray-500">No recipes yet — add one in the Studio.</p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.slice(0, 6).map((r) => (
              <RecipeCard key={r.slug} r={r} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
