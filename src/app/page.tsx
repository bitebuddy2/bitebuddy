import LatestRecipes from "@/components/LatestRecipes";
import TopSearch from "@/components/TopSearch";
import IngredientFinder from "@/components/IngredientFinder";
import { client } from "@/sanity/client";
import { allRecipesForCardsQuery } from "@/sanity/queries";
import Link from "next/link";

export default async function HomePage() {
  const recipes = await client.fetch(allRecipesForCardsQuery);

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
            Simple, fast, and tasty—recreate Greggs, Nando&apos;s, Wagamama and more.
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
      <LatestRecipes recipes={recipes} />
    </main>
  );
}
