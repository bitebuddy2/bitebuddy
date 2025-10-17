"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/image";

interface Collection {
  id: string;
  name: string;
  description?: string;
  created_at: string;
}

interface Recipe {
  _id: string;
  title: string;
  slug: string;
  heroImage?: any;
  description?: string;
  prepMin?: number;
  cookMin?: number;
  servings?: number;
  brand?: {
    title: string;
    slug: string;
  };
}

export default function CollectionViewPage({ params }: { params: Promise<{ id: string }> }) {
  const [collectionId, setCollectionId] = useState<string>("");
  const [collection, setCollection] = useState<Collection | null>(null);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    params.then((p) => {
      setCollectionId(p.id);
      fetchCollectionData(p.id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function fetchCollectionData(id: string) {
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      window.location.href = "/account";
      return;
    }

    // Fetch collection info
    const { data: collectionData } = await supabase
      .from("recipe_collections")
      .select("*")
      .eq("id", id)
      .eq("user_id", user.id)
      .single();

    if (!collectionData) {
      window.location.href = "/account/collections";
      return;
    }

    setCollection(collectionData);

    // Fetch recipe slugs in this collection
    const { data: collectionRecipes } = await supabase
      .from("collection_recipes")
      .select("recipe_slug")
      .eq("collection_id", id)
      .order("added_at", { ascending: false });

    if (collectionRecipes && collectionRecipes.length > 0) {
      const slugs = collectionRecipes.map((r) => r.recipe_slug);

      // Fetch recipe details from Sanity
      const recipesData = await client.fetch(`
        *[_type == "recipe" && slug.current in $slugs]{
          _id,
          title,
          "slug": slug.current,
          heroImage,
          description,
          prepMin,
          cookMin,
          servings,
          brand->{title, "slug": slug.current}
        }
      `, { slugs });

      // Sort recipes to match the order from collection_recipes
      const sortedRecipes = slugs
        .map((slug) => recipesData.find((r: Recipe) => r.slug === slug))
        .filter(Boolean);

      setRecipes(sortedRecipes);
    }

    setLoading(false);
  }

  async function removeFromCollection(recipeSlug: string) {
    if (!confirm("Remove this recipe from the collection?")) return;

    await supabase
      .from("collection_recipes")
      .delete()
      .eq("collection_id", collectionId)
      .eq("recipe_slug", recipeSlug);

    // Refresh recipes
    fetchCollectionData(collectionId);
  }

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600"></div>
        </div>
      </main>
    );
  }

  if (!collection) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-12">
        <div className="text-center py-16">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Collection not found</h1>
          <Link
            href="/account/collections"
            className="text-emerald-600 hover:text-emerald-700 font-medium"
          >
            Back to Collections
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/account/collections"
          className="inline-flex items-center gap-2 text-sm text-gray-600 hover:text-emerald-600 transition-colors mb-4"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Back to Collections
        </Link>

        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{collection.name}</h1>
            {collection.description && (
              <p className="text-gray-600 mt-2">{collection.description}</p>
            )}
            <p className="text-sm text-gray-500 mt-2">
              {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
            </p>
          </div>
        </div>
      </div>

      {/* Recipes Grid */}
      {recipes.length === 0 ? (
        <div className="text-center py-16 bg-gray-50 rounded-2xl">
          <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg className="w-8 h-8 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">No recipes in this collection yet</h2>
          <p className="text-gray-600 mb-6 max-w-md mx-auto">
            Browse recipes and use the "Add to Collection" button to add them here
          </p>
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium hover:bg-emerald-700 transition-colors"
          >
            Browse Recipes
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {recipes.map((recipe) => {
            const heroUrl = recipe.heroImage
              ? urlForImage(recipe.heroImage).width(600).height(400).url()
              : null;

            return (
              <div
                key={recipe._id}
                className="bg-white rounded-2xl border-2 border-gray-200 overflow-hidden hover:shadow-lg hover:border-emerald-300 transition-all group"
              >
                {/* Recipe Image */}
                <Link href={`/recipes/${recipe.slug}`} className="block relative aspect-[4/3] bg-gray-100">
                  {heroUrl ? (
                    <Image
                      src={heroUrl}
                      alt={recipe.title}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-gray-400">
                      <svg className="w-16 h-16" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                    </div>
                  )}
                </Link>

                {/* Recipe Info */}
                <div className="p-4">
                  <Link href={`/recipes/${recipe.slug}`}>
                    <h3 className="font-bold text-lg text-gray-900 mb-2 hover:text-emerald-600 transition-colors line-clamp-2">
                      {recipe.title}
                    </h3>
                  </Link>

                  {recipe.brand && (
                    <p className="text-sm text-emerald-600 font-medium mb-2">
                      {recipe.brand.title}
                    </p>
                  )}

                  {recipe.description && (
                    <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                      {recipe.description}
                    </p>
                  )}

                  {/* Recipe Meta */}
                  <div className="flex flex-wrap gap-3 text-xs text-gray-600 mb-3">
                    {recipe.servings && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                        </svg>
                        {recipe.servings} servings
                      </span>
                    )}
                    {recipe.prepMin && (
                      <span className="flex items-center gap-1">
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {recipe.prepMin + (recipe.cookMin || 0)} mins
                      </span>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex gap-2">
                    <Link
                      href={`/recipes/${recipe.slug}`}
                      className="flex-1 text-center bg-emerald-600 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-emerald-700 transition-colors"
                    >
                      View Recipe
                    </Link>
                    <button
                      onClick={() => removeFromCollection(recipe.slug)}
                      className="px-3 py-2 border border-red-300 rounded-lg hover:bg-red-50 transition-colors"
                      title="Remove from collection"
                    >
                      <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </main>
  );
}
