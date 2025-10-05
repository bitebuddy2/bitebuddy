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
        <div className="mx-auto max-w-6xl px-4 sm:px-6 py-8 sm:py-12 md:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight bg-gradient-to-r from-emerald-600 to-emerald-800 bg-clip-text text-transparent pb-2 leading-tight">
            UK Copycat Recipes & Smart AI Meal Ideas
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-3xl text-sm sm:text-base md:text-lg text-gray-700 leading-relaxed px-2">
            Recreate your favourite UK restaurant dishes like Greggs, Nando&apos;s, and Wagamama — fast and simple. When you&apos;re out of ideas, our AI Recipe Generator helps you whip up something new in minutes.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Link
              href="/recipes"
              className="w-full sm:w-auto rounded-full bg-emerald-600 px-8 py-3.5 text-sm font-semibold text-white hover:bg-emerald-700 hover:scale-105 transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* INGREDIENT FINDER */}
      <IngredientFinder />

      {/* Ad between sections */}
      <div className="mx-auto max-w-6xl px-4 py-4 sm:py-6">
        <AdPlaceholder size="leaderboard" />
      </div>

      {/* BRAND BAR */}
      <BrandBar brands={brands} />

      {/* LATEST RECIPES */}
      <LatestRecipes recipes={recipes} />
    </main>
  );
}
