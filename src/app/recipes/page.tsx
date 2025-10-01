"use client";

import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import { client } from "../../sanity/client";
import { allRecipesForCardsQuery, allBrandsQuery } from "../../sanity/queries";

type CardRecipe = Parameters<typeof RecipeCard>[0]["r"];
type Brand = {
  _id: string;
  title: string;
  slug: string;
  logo?: {
    asset?: { url: string; metadata?: { lqip?: string } };
    alt?: string;
  };
};

export default function RecipesIndexPage() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<CardRecipe[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [recipesData, brandsData] = await Promise.all([
          client.fetch(allRecipesForCardsQuery),
          client.fetch(allBrandsQuery)
        ]);
        setRecipes(recipesData || []);
        setBrands(brandsData || []);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Set selected brand from URL parameter
  useEffect(() => {
    const brandParam = searchParams.get('brand');
    if (brandParam) {
      setSelectedBrand(brandParam);
    }
  }, [searchParams]);

  const filteredRecipes = selectedBrand === "all"
    ? recipes
    : recipes.filter(recipe => recipe.brand?._id === selectedBrand);

  const recipesWithoutBrand = recipes.filter(recipe => !recipe.brand);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading recipes...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl p-4">
      <header className="mb-6 flex items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-bold tracking-tight">All Recipes</h1>
          <p className="mt-1 text-gray-600">
            Simple, fast, and tasty—recreate UK favourites at home.
          </p>
        </div>

        {/* Brand Filter Dropdown */}
        <div className="flex flex-col items-end">
          <label htmlFor="brand-filter" className="text-sm font-medium text-gray-700 mb-1">
            Filter by Brand
          </label>
          <select
            id="brand-filter"
            value={selectedBrand}
            onChange={(e) => setSelectedBrand(e.target.value)}
            className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none min-w-[160px]"
          >
            <option value="all">All Brands ({recipes.length})</option>
            {brands.map((brand) => {
              const count = recipes.filter(r => r.brand?._id === brand._id).length;
              return (
                <option key={brand._id} value={brand._id}>
                  {brand.title} ({count})
                </option>
              );
            })}
            {recipesWithoutBrand.length > 0 && (
              <option value="no-brand">No Brand ({recipesWithoutBrand.length})</option>
            )}
          </select>
        </div>
      </header>

      {(!recipes || recipes.length === 0) ? (
        <p className="text-gray-500">
          No recipes yet. Add one in Sanity Studio to see it here.
        </p>
      ) : (
        <>
          {selectedBrand !== "all" && (
            <div className="mb-4 flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Showing {filteredRecipes.length} recipe{filteredRecipes.length === 1 ? '' : 's'}
                {selectedBrand === "no-brand" ? " without a brand" :
                  ` from ${brands.find(b => b._id === selectedBrand)?.title}`}
              </span>
              <button
                onClick={() => setSelectedBrand("all")}
                className="text-sm text-emerald-600 hover:text-emerald-700 underline"
              >
                Clear filter
              </button>
            </div>
          )}

          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {(selectedBrand === "no-brand" ? recipesWithoutBrand : filteredRecipes).map((r) => (
              <RecipeCard key={r.slug} r={r} />
            ))}
          </ul>

          {filteredRecipes.length === 0 && selectedBrand !== "all" && selectedBrand !== "no-brand" && (
            <div className="text-center py-12">
              <p className="text-gray-500 mb-2">No recipes found for this brand.</p>
              <button
                onClick={() => setSelectedBrand("all")}
                className="text-emerald-600 hover:text-emerald-700 underline"
              >
                View all recipes
              </button>
            </div>
          )}
        </>
      )}
    </main>
  );
}