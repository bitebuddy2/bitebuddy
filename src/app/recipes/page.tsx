"use client";

import { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import RecipeCard from "@/components/RecipeCard";
import { client } from "../../sanity/client";
import { allRecipesForCardsQuery, allBrandsQuery, allCategoriesQuery } from "../../sanity/queries";

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

type Category = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
};

function RecipesContent() {
  const searchParams = useSearchParams();
  const [recipes, setRecipes] = useState<CardRecipe[]>([]);
  const [brands, setBrands] = useState<Brand[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedBrand, setSelectedBrand] = useState<string>("all");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const [recipesData, brandsData, categoriesData] = await Promise.all([
          client.fetch(allRecipesForCardsQuery),
          client.fetch(allBrandsQuery),
          client.fetch(allCategoriesQuery)
        ]);
        setRecipes(recipesData || []);
        setBrands(brandsData || []);
        setCategories(categoriesData || []);
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

  let filteredRecipes = recipes;

  // Filter by brand
  if (selectedBrand !== "all") {
    filteredRecipes = filteredRecipes.filter(recipe => recipe.brand?._id === selectedBrand);
  }

  // Filter by category
  if (selectedCategory !== "all") {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.categories?.some((cat: any) => cat._id === selectedCategory)
    );
  }

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
    <main className="mx-auto max-w-6xl">
      {/* Standalone Banner */}
      <header className="p-4 mb-4 md:mb-6">
        <h1 className="text-4xl font-bold tracking-tight">All Recipes</h1>
        <p className="mt-1 text-gray-600">
          Simple, fast, and tasty—recreate UK favourites at home.
        </p>
      </header>

      {/* Filter and Recipes Section */}
      <div className="p-4 pt-0">
        {/* Brand Filter Dropdown */}
        <div className="mb-4 flex justify-end">
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
        </div>

        {/* Category Filter Buttons */}
        {categories.length > 0 && (
          <div className="mb-6">
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === "all"
                    ? "bg-emerald-600 text-white"
                    : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                }`}
              >
                All Categories
              </button>
              {categories.map((category) => {
                const count = recipes.filter(r =>
                  r.categories?.some((cat: any) => cat._id === category._id)
                ).length;
                return (
                  <button
                    key={category._id}
                    onClick={() => setSelectedCategory(category._id)}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                      selectedCategory === category._id
                        ? "bg-emerald-600 text-white"
                        : "bg-emerald-100 text-emerald-800 hover:bg-emerald-200"
                    }`}
                  >
                    {category.title} ({count})
                  </button>
                );
              })}
            </div>
          </div>
        )}

      {(!recipes || recipes.length === 0) ? (
        <p className="text-gray-500">
          No recipes yet. Add one in Sanity Studio to see it here.
        </p>
      ) : (
        <>
          {(selectedBrand !== "all" || selectedCategory !== "all") && (
            <div className="mb-4 flex items-center space-x-2">
              <span className="text-sm text-gray-600">
                Showing {filteredRecipes.length} recipe{filteredRecipes.length === 1 ? '' : 's'}
                {selectedBrand !== "all" && selectedBrand !== "no-brand" &&
                  ` from ${brands.find(b => b._id === selectedBrand)?.title}`}
                {selectedBrand === "no-brand" && " without a brand"}
                {selectedCategory !== "all" &&
                  ` in ${categories.find(c => c._id === selectedCategory)?.title}`}
              </span>
              {(selectedBrand !== "all" || selectedCategory !== "all") && (
                <button
                  onClick={() => {
                    setSelectedBrand("all");
                    setSelectedCategory("all");
                  }}
                  className="text-sm text-emerald-600 hover:text-emerald-700 underline"
                >
                  Clear filters
                </button>
              )}
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
      </div>
    </main>
  );
}

export default function RecipesIndexPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading recipes...</span>
          </div>
        </div>
      </main>
    }>
      <RecipesContent />
    </Suspense>
  );
}