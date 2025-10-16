import LatestRecipes from "@/components/LatestRecipes";
import TopSearch from "@/components/TopSearch";
import IngredientFinder from "@/components/IngredientFinder";
import BrandBar from "@/components/BrandBar";
import AdPlaceholder from "@/components/AdPlaceholder";
import { client } from "@/sanity/client";
import { allRecipesForCardsQuery, allBrandsQuery } from "@/sanity/queries";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "UK Copycat Recipes & AI Recipe Generator | Bite Buddy",
  description: "Recreate UK restaurant favourites from Greggs, Nando's & Wagamama at home. Plus, use our free AI Recipe Generator for instant personalized meal ideas.",
  openGraph: {
    title: "UK Copycat Recipes & AI Recipe Generator | Bite Buddy",
    description: "Recreate UK restaurant favourites from Greggs, Nando's & Wagamama at home. Plus, use our free AI Recipe Generator for instant personalized meal ideas.",
  },
  twitter: {
    title: "UK Copycat Recipes & AI Recipe Generator | Bite Buddy",
    description: "Recreate UK restaurant favourites from Greggs, Nando's & Wagamama at home. Plus, use our free AI Recipe Generator for instant personalized meal ideas.",
  },
};

export default async function HomePage() {
  const [recipes, brands] = await Promise.all([
    client.fetch(allRecipesForCardsQuery),
    client.fetch(allBrandsQuery)
  ]);

  // Filter out Bite Buddy Kitchen recipes from home page
  const biteBuddyBrand = brands.find((b: any) => b.slug === 'bite-buddy-kitchen');
  const filteredRecipes = recipes.filter((r: any) => r.brand?._id !== biteBuddyBrand?._id);

  return (
    <main>
      {/* TOP SEARCH (title) */}
      <TopSearch />

      {/* HERO */}
      <section className="relative border-b overflow-hidden min-h-[350px] sm:min-h-[400px]">
        {/* Background Image */}
        <Image
          src="/Hero.jpg"
          alt="Hero Background"
          fill
          priority
          className="object-cover"
          quality={90}
        />
        {/* Dark overlay for better text readability */}
        <div className="absolute inset-0 bg-black/40" />

        {/* Content */}
        <div className="relative mx-auto max-w-6xl px-5 sm:px-6 py-10 sm:py-12 md:py-16 text-center">
          <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-extrabold tracking-tight text-white pb-2 leading-tight drop-shadow-lg">
            UK Copycat Recipes & Smart AI Meal Ideas
          </h1>
          <p className="mx-auto mt-4 sm:mt-6 max-w-3xl text-base sm:text-lg md:text-xl text-white leading-relaxed px-2 drop-shadow-md">
            Recreate your favourite UK restaurant dishes like Greggs, Nando&apos;s, and Wagamama — fast and simple. When you&apos;re out of ideas, our AI Recipe Generator helps you whip up something new in minutes.
          </p>
          <div className="mt-6 sm:mt-8 flex flex-col sm:flex-row justify-center gap-3 sm:gap-4 px-4 sm:px-0">
            <Link
              href="/recipes"
              className="w-full sm:w-auto rounded-full bg-emerald-600 px-8 py-4 text-base font-semibold text-white hover:bg-emerald-700 hover:scale-105 active:scale-95 transition-all duration-200 shadow-lg hover:shadow-xl"
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
      <LatestRecipes recipes={filteredRecipes} />
    </main>
  );
}
