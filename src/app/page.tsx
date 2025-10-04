import LatestRecipes from "@/components/LatestRecipes";
import TopSearch from "@/components/TopSearch";
import IngredientFinder from "@/components/IngredientFinder";
import BrandBar from "@/components/BrandBar";
import AdPlaceholder from "@/components/AdPlaceholder";
import { client } from "@/sanity/client";
import { allRecipesForCardsQuery, allBrandsQuery } from "@/sanity/queries";
import Link from "next/link";

export default async function HomePage() {
  const [recipes, brands] = await Promise.all([
    client.fetch(allRecipesForCardsQuery),
    client.fetch(allBrandsQuery)
  ]);

  return (
    <main>
      {/* TOP SEARCH (title) */}
      <TopSearch />

      {/* HERO */}
      <section className="border-b bg-gradient-to-b from-emerald-50 to-transparent">
        <div className="mx-auto max-w-6xl px-4 py-16 text-center">
          <h1 className="text-5xl font-extrabold tracking-tight md:text-6xl bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent">
            UK Copycat Recipes, Made Easy
          </h1>
          <p className="mx-auto mt-4 max-w-2xl text-lg text-gray-700 leading-relaxed">
            Simple, fast, and tasty—recreate Greggs, Nando&apos;s, Wagamama and more.
          </p>
          <div className="mt-6 flex justify-center gap-4">
            <Link
              href="/recipes"
              className="rounded-full bg-emerald-600 px-6 py-3 text-sm font-semibold text-white hover:bg-emerald-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* INGREDIENT FINDER */}
      <IngredientFinder />

      {/* Ad between sections */}
      <div className="mx-auto max-w-6xl px-4 py-6">
        <AdPlaceholder size="leaderboard" />
      </div>

      {/* BRAND BAR */}
      <BrandBar brands={brands} />

      {/* LATEST RECIPES */}
      <LatestRecipes recipes={recipes} />
    </main>
  );
}
