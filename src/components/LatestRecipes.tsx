"use client";

import { useState } from "react";
import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";

type CardRecipe = Parameters<typeof RecipeCard>[0]["r"];

export default function LatestRecipes({ recipes }: { recipes: CardRecipe[] }) {
  const [showAll, setShowAll] = useState(false);
  const displayedRecipes = showAll ? recipes : recipes.slice(0, 6);

  return (
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
        <>
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {displayedRecipes.map((r) => (
              <RecipeCard key={r.slug} r={r} />
            ))}
          </ul>

          {recipes.length > 6 && (
            <div className="mt-6 flex justify-center">
              <button
                onClick={() => setShowAll(!showAll)}
                className="rounded-full border border-emerald-600 bg-white px-6 py-2.5 text-sm font-semibold text-emerald-600 hover:bg-emerald-50 transition"
              >
                {showAll ? "Show Less" : `Show More (${recipes.length - 6} more)`}
              </button>
            </div>
          )}
        </>
      )}
    </section>
  );
}
