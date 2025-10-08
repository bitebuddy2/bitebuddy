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
  const [showBiteBuddyKitchen, setShowBiteBuddyKitchen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const [recipesData, brandsData, categoriesData] = await Promise.all([
          client.fetch(allRecipesForCardsQuery),
          client.fetch(allBrandsQuery),
          client.fetch(allCategoriesQuery)
        ]);

        // Sort recipes: Bite Buddy Kitchen recipes go last
        const biteBuddyBrand = brandsData?.find((b: Brand) => b.slug === "bite-buddy-kitchen");
        const sortedRecipes = recipesData?.sort((a: CardRecipe, b: CardRecipe) => {
          const aIsBiteBuddy = a.brand?._id === biteBuddyBrand?._id;
          const bIsBiteBuddy = b.brand?._id === biteBuddyBrand?._id;
          if (aIsBiteBuddy && !bIsBiteBuddy) return 1; // a goes after b
          if (!aIsBiteBuddy && bIsBiteBuddy) return -1; // b goes after a
          return 0; // maintain original order
        });

        setRecipes(sortedRecipes || []);
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

  // Filter by Bite Buddy Kitchen (user-generated recipes)
  if (showBiteBuddyKitchen) {
    // Find Bite Buddy Kitchen brand
    const biteBuddyKitchenBrand = brands.find(b => b.slug === "bite-buddy-kitchen");
    if (biteBuddyKitchenBrand) {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.brand?._id === biteBuddyKitchenBrand._id);
    }
  } else {
    // Filter by brand
    if (selectedBrand !== "all") {
      filteredRecipes = filteredRecipes.filter(recipe => recipe.brand?._id === selectedBrand);
    }
  }

  // Filter by category
  if (selectedCategory !== "all") {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.categories?.some((cat: any) => cat._id === selectedCategory)
    );
  }

  // Filter by search query (only when showBiteBuddyKitchen is true)
  if (showBiteBuddyKitchen && searchQuery.trim()) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase())
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
        {/* Bite Buddy Kitchen Filter Button */}
        <div className="mb-6">
          <button
            onClick={() => {
              setShowBiteBuddyKitchen(!showBiteBuddyKitchen);
              if (!showBiteBuddyKitchen) {
                setSelectedBrand("all");
                setSelectedCategory("all");
                setSearchQuery(""); // Clear search when switching to community recipes
              } else {
                setSearchQuery(""); // Clear search when switching away from community recipes
              }
            }}
            className={`w-full md:w-auto px-6 py-4 rounded-xl font-semibold text-left transition-all ${
              showBiteBuddyKitchen
                ? "bg-gradient-to-r from-emerald-600 to-teal-600 text-white shadow-lg"
                : "bg-gradient-to-r from-emerald-50 to-teal-50 text-emerald-800 hover:from-emerald-100 hover:to-teal-100 border-2 border-emerald-200"
            }`}
          >
            <div className="flex items-center gap-3">
              <span className="text-2xl">🧑‍🍳</span>
              <div className="flex-1">
                <div className="flex items-center gap-2">
                  <span className="text-lg">Community Recipes</span>
                  {(() => {
                    const biteBuddyBrand = brands.find(b => b.slug === "bite-buddy-kitchen");
                    const count = biteBuddyBrand
                      ? recipes.filter(r => r.brand?._id === biteBuddyBrand._id).length
                      : 0;
                    return count > 0 && (
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        showBiteBuddyKitchen
                          ? "bg-white/20 text-white"
                          : "bg-emerald-200 text-emerald-800"
                      }`}>
                        {count}
                      </span>
                    );
                  })()}
                </div>
                <p className={`text-xs mt-1 ${
                  showBiteBuddyKitchen ? "text-white/90" : "text-emerald-700"
                }`}>
                  User-generated recipes created with AI assistance
                </p>
              </div>
              <svg
                className={`w-5 h-5 transition-transform ${showBiteBuddyKitchen ? "rotate-180" : ""}`}
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </div>
          </button>

          {/* Search input for Community Recipes */}
          {showBiteBuddyKitchen && (
            <div className="mt-4">
              <input
                type="text"
                placeholder="Search community recipes..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900"
              />
            </div>
          )}
        </div>

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
              disabled={showBiteBuddyKitchen}
              className="rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm focus:border-emerald-400 focus:outline-none min-w-[160px] disabled:opacity-50 disabled:cursor-not-allowed"
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
            <h3 className="text-sm font-medium text-gray-700 mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setSelectedCategory("all")}
                className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
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
                    className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
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