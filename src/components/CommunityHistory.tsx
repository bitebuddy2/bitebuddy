"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { client } from "@/sanity/client";
import Link from "next/link";
import Image from "next/image";

type PublishedRecipe = {
  id: string;
  title: string;
  slug: string;
  published_at: string;
  sanity_recipe_id: string;
};

type CommentHistory = {
  id: string;
  comment_text: string;
  image_url: string | null;
  created_at: string;
  recipe_slug: string | null;
  ai_recipe_id: string | null;
  recipe_title: string;
};

export default function CommunityHistory({ userId }: { userId: string }) {
  const [publishedRecipes, setPublishedRecipes] = useState<PublishedRecipe[]>([]);
  const [comments, setComments] = useState<CommentHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [deletingRecipeId, setDeletingRecipeId] = useState<string | null>(null);

  useEffect(() => {
    if (userId) {
      fetchData();
    }
  }, [userId]);

  const fetchData = async () => {
    try {
      console.log("Fetching community history for user:", userId);

      // Fetch published recipes
      const { data: recipes, error: recipesError } = await supabase
        .from("saved_ai_recipes")
        .select("id, title, slug, published_at, sanity_recipe_id")
        .eq("user_id", userId)
        .eq("is_published", true)
        .order("published_at", { ascending: false });

      if (recipesError) {
        console.error("Error fetching published recipes:", recipesError);
        throw recipesError;
      }

      console.log("Published recipes:", recipes);
      setPublishedRecipes(recipes || []);

      // Fetch user's comments
      const { data: commentsData, error: commentsError } = await supabase
        .from("recipe_comments")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false })
        .limit(50);

      if (commentsError) {
        console.error("Error fetching comments:", commentsError);
        throw commentsError;
      }

      console.log("Comments data:", commentsData);

      // Get recipe titles for comments
      const commentsWithTitles: CommentHistory[] = [];

      for (const comment of commentsData || []) {
        let recipeTitle = "Unknown Recipe";

        try {
          if (comment.recipe_slug) {
            // Sanity recipe - fetch actual title from Sanity
            try {
              const sanityRecipe = await client.fetch(
                `*[_type == "recipe" && slug.current == $slug][0]{ title }`,
                { slug: comment.recipe_slug }
              );
              if (sanityRecipe?.title) {
                recipeTitle = sanityRecipe.title;
              } else {
                // Fallback to formatted slug
                recipeTitle = comment.recipe_slug
                  .split("-")
                  .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ");
              }
            } catch (sanityError) {
              console.error("Error fetching Sanity recipe:", sanityError);
              recipeTitle = comment.recipe_slug
                .split("-")
                .map((word: string) => word.charAt(0).toUpperCase() + word.slice(1))
                .join(" ");
            }
          } else if (comment.ai_recipe_id) {
            // AI recipe from Supabase
            const { data: aiRecipe } = await supabase
              .from("saved_ai_recipes")
              .select("title")
              .eq("id", comment.ai_recipe_id)
              .single();

            if (aiRecipe) {
              recipeTitle = aiRecipe.title;
            }
          }
        } catch (titleError) {
          console.error("Error getting recipe title:", titleError);
        }

        commentsWithTitles.push({
          ...comment,
          recipe_title: recipeTitle,
        });
      }

      console.log("Comments with titles:", commentsWithTitles);
      setComments(commentsWithTitles);
    } catch (error) {
      console.error("Error fetching community history:", error);
      // Don't throw - just show empty state
      setComments([]);
      setPublishedRecipes([]);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteRecipe = async (recipeId: string, sanityRecipeId: string) => {
    if (!confirm("Are you sure you want to delete this published recipe? This cannot be undone.")) {
      return;
    }

    setDeletingRecipeId(recipeId);

    try {
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Please sign in");
        return;
      }

      const response = await fetch("/api/delete-published-recipe", {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ recipeId, sanityRecipeId }),
      });

      if (!response.ok) {
        const data = await response.json();
        throw new Error(data.error || "Failed to delete recipe");
      }

      // Refresh list
      await fetchData();
      alert("Recipe deleted successfully");
    } catch (error: any) {
      console.error("Error deleting recipe:", error);
      alert(error.message || "Failed to delete recipe");
    } finally {
      setDeletingRecipeId(null);
    }
  };

  const handleDeleteComment = async (commentId: string, imageUrl: string | null) => {
    if (!confirm("Are you sure you want to delete this comment?")) {
      return;
    }

    try {
      // Delete image if exists
      if (imageUrl) {
        const imagePath = imageUrl.split("/comment-images/")[1];
        if (imagePath) {
          await supabase.storage.from("comment-images").remove([imagePath]);
        }
      }

      // Delete comment
      const { error } = await supabase
        .from("recipe_comments")
        .delete()
        .eq("id", commentId);

      if (error) throw error;

      // Refresh list
      await fetchData();
    } catch (error) {
      console.error("Error deleting comment:", error);
      alert("Failed to delete comment");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <div className="flex items-center space-x-2">
          <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
          <span className="text-gray-600">Loading...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl space-y-8">
      {/* Published Recipes Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>🧑‍🍳</span>
          Your Published Recipes
        </h2>

        {publishedRecipes.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              You haven't published any recipes yet.
            </p>
            <p className="text-sm text-gray-500">
              Create recipes with our AI Recipe Generator and publish them to share with the community!
            </p>
            <Link
              href="/ai-recipe-generator"
              className="inline-block mt-4 px-6 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
              Create Recipe
            </Link>
          </div>
        ) : (
          <div className="grid gap-4 md:grid-cols-2">
            {publishedRecipes.map((recipe) => (
              <div
                key={recipe.id}
                className="border rounded-lg p-4 bg-white hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-lg mb-1 truncate">
                      {recipe.title}
                    </h3>
                    <p className="text-xs text-gray-500 mb-3">
                      Published on{" "}
                      {new Date(recipe.published_at).toLocaleDateString("en-GB", {
                        day: "numeric",
                        month: "short",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Link
                    href={`/recipes/${recipe.slug}`}
                    className="flex-1 text-center px-4 py-2 bg-emerald-600 text-white text-sm rounded hover:bg-emerald-700"
                  >
                    View Recipe
                  </Link>
                  <button
                    onClick={() => handleDeleteRecipe(recipe.id, recipe.sanity_recipe_id)}
                    disabled={deletingRecipeId === recipe.id}
                    className="px-4 py-2 border border-red-300 text-red-600 text-sm rounded hover:bg-red-50 disabled:opacity-50"
                  >
                    {deletingRecipeId === recipe.id ? "Deleting..." : "Delete"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Comments History Section */}
      <div>
        <h2 className="text-2xl font-bold mb-4 flex items-center gap-2">
          <span>💬</span>
          Your Comments History
        </h2>

        {comments.length === 0 ? (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">
              You haven't commented on any recipes yet.
            </p>
            <p className="text-sm text-gray-500">
              Share your thoughts, tips, and photos on recipes you've tried!
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {comments.map((comment) => {
              const recipeUrl = comment.recipe_slug
                ? `/recipes/${comment.recipe_slug}`
                : comment.ai_recipe_id
                ? `/ai-recipe/${comment.ai_recipe_id}`
                : "#";

              return (
                <div
                  key={comment.id}
                  className="border rounded-lg p-4 bg-white hover:shadow-sm transition-shadow"
                >
                  <div className="flex items-start gap-3">
                    {comment.image_url && (
                      <div className="relative w-20 h-20 flex-shrink-0">
                        <Image
                          src={comment.image_url}
                          alt="Comment image"
                          fill
                          className="object-cover rounded"
                        />
                      </div>
                    )}

                    <div className="flex-1 min-w-0">
                      <div className="flex items-start justify-between mb-2">
                        <div>
                          <Link
                            href={recipeUrl}
                            className="font-semibold hover:text-emerald-600 inline-block"
                          >
                            {comment.recipe_title}
                          </Link>
                          <p className="text-xs text-gray-500">
                            {new Date(comment.created_at).toLocaleDateString("en-GB", {
                              day: "numeric",
                              month: "short",
                              year: "numeric",
                            })}
                          </p>
                        </div>
                      </div>

                      <p className="text-sm text-gray-700 mb-3 line-clamp-2">
                        {comment.comment_text}
                      </p>

                      <div className="flex items-center gap-2">
                        <Link
                          href={recipeUrl}
                          className="text-xs text-emerald-600 hover:text-emerald-700"
                        >
                          View on Recipe →
                        </Link>
                        <span className="text-gray-300">|</span>
                        <button
                          onClick={() => handleDeleteComment(comment.id, comment.image_url)}
                          className="text-xs text-red-600 hover:text-red-700"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
