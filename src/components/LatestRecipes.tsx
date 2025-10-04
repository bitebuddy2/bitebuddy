"use client";

import { useState } from "react";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";

type CardRecipe = Parameters<typeof RecipeCard>[0]["r"];

export default function LatestRecipes({ recipes }: { recipes: CardRecipe[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayedRecipes = showAll ? recipes : recipes.slice(0, 3);

  return (
    <section className="mx-auto max-w-6xl px-4 py-12">
      <div className="mb-6 flex items-center justify-between">
        <h2 className="text-3xl font-bold text-gray-900">Latest Recipes</h2>
        <Link href="/recipes" className="text-sm font-medium text-emerald-600 hover:text-emerald-700 hover:underline transition-colors">
          View all →
        </Link>
      </div>

      {recipes.length === 0 ? (
        <p className="text-gray-500">No recipes yet — add one in the Studio.</p>
      ) : (
        <>
          <ul className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {displayedRecipes.map((r) => (
              <RecipeCard key={r.slug} r={r} />
            ))}
          </ul>

          {recipes.length > 3 && (
            <div className="mt-8 flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="rounded-full border-2 border-emerald-600 bg-white px-8 py-3 text-sm font-semibold text-emerald-600 hover:bg-emerald-600 hover:text-white hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg"
              >
                {showAll ? "Show Less" : `Show More (${recipes.length - 3} more)`}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
