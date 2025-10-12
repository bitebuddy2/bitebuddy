"use client";

import { useState, useEffect } from "react";
import RecipeCard from "@/components/RecipeCard";
import { client } from "../../sanity/client";
import { allCommunityRecipesQuery } from "../../sanity/queries";

type CommunityRecipe = {
  slug: string;
  title: string;
  description?: string;
  introText?: string;
  servings?: number;
  prepMin?: number;
  cookMin?: number;
  ratingSum?: number;
  ratingCount?: number;
  heroImage?: {
    asset?: { url: string; metadata?: { lqip?: string } };
    alt?: string;
  };
  createdBy?: {
    userName: string;
    cookingMethod?: string;
    spiceLevel?: string;
    dietaryPreference?: string;
  };
};

export default function CommunityRecipesPage() {
  const [recipes, setRecipes] = useState<CommunityRecipe[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    async function fetchData() {
      try {
        const recipesData = await client.fetch(allCommunityRecipesQuery);
        setRecipes(recipesData || []);
      } catch (error) {
        console.error('Error fetching community recipes:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  // Filter by search query
  let filteredRecipes = recipes;
  if (searchQuery.trim()) {
    filteredRecipes = filteredRecipes.filter(recipe =>
      recipe.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      recipe.createdBy?.userName.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl p-4">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading community recipes...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl">
      {/* Header */}
      <header className="p-4 mb-4 md:mb-6">
        <h1 className="text-4xl font-bold tracking-tight">Community Recipes</h1>
        <p className="mt-1 text-gray-600">
          Discover AI-generated recipes created by our community members
        </p>
      </header>

      <div className="p-4 pt-0">
        {/* Search Bar */}
        <div className="mb-6">
          <div className="relative">
            <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none">
              <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search by recipe name, description, or creator..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-12 pr-4 py-3 border-2 border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 text-gray-900 shadow-sm hover:shadow-md transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                aria-label="Clear search"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* Recipe Count */}
        {searchQuery && (
          <div className="mb-4 text-sm text-gray-600">
            Showing {filteredRecipes.length} recipe{filteredRecipes.length === 1 ? '' : 's'}
          </div>
        )}

        {/* Recipes Grid */}
        {recipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg mb-4">
              No community recipes yet.
            </p>
            <p className="text-gray-400">
              Be the first to create and share a recipe using our AI Recipe Generator!
            </p>
          </div>
        ) : filteredRecipes.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500 mb-2">No recipes found matching your search.</p>
            <button
              onClick={() => setSearchQuery("")}
              className="text-emerald-600 hover:text-emerald-700 underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredRecipes.map((r) => (
              <RecipeCard key={r.slug} r={r} isCommunity={true} />
            ))}
          </ul>
        )}

        {/* Info Section */}
        {recipes.length > 0 && (
          <div className="mt-12 bg-emerald-50 border border-emerald-200 rounded-lg p-6">
            <h2 className="text-xl font-bold text-emerald-900 mb-2">
              About Community Recipes
            </h2>
            <p className="text-emerald-800 text-sm">
              These recipes were created by members of our community using our AI Recipe Generator.
              Each recipe is personalized based on the creator's preferences for cooking method,
              spice level, and dietary requirements. Try them out and create your own!
            </p>
          </div>
        )}
      </div>
    </main>
  );
}
