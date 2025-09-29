import RecipeCard from "@/components/RecipeCard";
import { client } from "../../sanity/client";
import { allRecipesForCardsQuery } from "../../sanity/queries";

type CardRecipe = Parameters<typeof RecipeCard>[0]["r"];

export const revalidate = 60; // ISR: refresh every 60s

export default async function RecipesIndexPage() {
  const recipes: CardRecipe[] = await client.fetch(allRecipesForCardsQuery);

  return (
    <main className="mx-auto max-w-6xl p-4">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">All Recipes</h1>
          <p className="mt-1 text-gray-600">
            Simple, fast, and tasty—recreate UK favourites at home.
          </p>
        </div>
      </header>

      {(!recipes || recipes.length === 0) ? (
        <p className="text-gray-500">
          No recipes yet. Add one in Sanity Studio to see it here.
        </p>
      ) : (
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((r) => (
            <RecipeCard key={r.slug} r={r} />
          ))}
        </ul>
      )}
    </main>
  );
}