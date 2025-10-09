"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { getSupabaseBrowserClient } from "@/lib/supabase";

// Get properly configured Supabase client with auth session
const supabase = getSupabaseBrowserClient();

type PublishRecipeButtonProps = {
  aiRecipeId: string;
  aiRecipeTitle: string;
  isPublished: boolean;
  publishedSlug?: string | null;
};

export default function PublishRecipeButton({
  aiRecipeId,
  aiRecipeTitle,
  isPublished,
  publishedSlug,
}: PublishRecipeButtonProps) {
  const [showModal, setShowModal] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const router = useRouter();

  const handlePublish = async () => {
    setIsPublishing(true);

    try {
      // Get auth token
      const {
        data: { session },
      } = await supabase.auth.getSession();

      if (!session) {
        alert("Please sign in to publish recipes");
        window.location.href = "/account";
        return;
      }

      const response = await fetch("/api/publish-ai-recipe", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ aiRecipeId }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to publish recipe");
      }

      // Success!
      alert(
        `Recipe published successfully! You can now find it in the Community Recipes section.`
      );
      setShowModal(false);

      // Redirect to published recipe
      router.push(`/community-recipes/${data.slug}`);
    } catch (error: any) {
      console.error("Error publishing recipe:", error);
      alert(error.message || "Failed to publish recipe");
    } finally {
      setIsPublishing(false);
    }
  };

  if (isPublished && publishedSlug) {
    return (
      <a
        href={`/community-recipes/${publishedSlug}`}
        className="inline-flex items-center gap-2 rounded-lg bg-emerald-600 px-6 py-3 text-white font-semibold hover:bg-emerald-700 transition-colors"
      >
        <span>🌟</span>
        View Published Recipe
      </a>
    );
  }

  return (
    <>
      <button
        onClick={() => setShowModal(true)}
        className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-600 to-teal-600 px-6 py-3 text-white font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg hover:shadow-xl"
      >
        <span>🧑‍🍳</span>
        Publish to Community
      </button>

      {/* Publish Confirmation Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-md w-full space-y-4">
            <div className="flex items-center gap-3">
              <span className="text-3xl">🧑‍🍳</span>
              <h3 className="text-xl font-bold">Publish to Community</h3>
            </div>

            <div className="space-y-3 text-sm text-gray-700">
              <p>
                <strong>"{aiRecipeTitle}"</strong> will be published to the{" "}
                <strong>Community Recipes</strong> section.
              </p>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <p className="font-semibold text-blue-900 mb-1">
                  What happens when you publish:
                </p>
                <ul className="list-disc list-inside space-y-1 text-blue-800">
                  <li>Recipe appears on the /community-recipes page</li>
                  <li>Other users can view and comment</li>
                  <li>You'll be credited as the creator</li>
                  <li>You can delete it anytime</li>
                </ul>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-lg p-3">
                <p className="font-semibold text-amber-900 mb-1">
                  ⚠️ Please note:
                </p>
                <ul className="list-disc list-inside space-y-1 text-amber-800">
                  <li>You cannot edit once published</li>
                  <li>Recipe will be labeled as AI-assisted</li>
                  <li>Must follow community guidelines</li>
                </ul>
              </div>
            </div>

            <div className="flex items-center gap-3 pt-2">
              <button
                onClick={() => setShowModal(false)}
                className="flex-1 px-4 py-2 border rounded-lg text-sm hover:bg-gray-50 disabled:opacity-50"
                disabled={isPublishing}
              >
                Cancel
              </button>
              <button
                onClick={handlePublish}
                className="flex-1 px-4 py-2 bg-emerald-600 text-white rounded-lg text-sm hover:bg-emerald-700 disabled:opacity-50 font-semibold"
                disabled={isPublishing}
              >
                {isPublishing ? "Publishing..." : "Publish Recipe"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
