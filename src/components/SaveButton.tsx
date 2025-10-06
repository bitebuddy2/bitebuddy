"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { trackSaveRecipe } from "@/lib/analytics";

interface SaveButtonProps {
  recipeSlug: string;
  recipeTitle?: string;
}

export default function SaveButton({ recipeSlug, recipeTitle }: SaveButtonProps) {
  const [user, setUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkSaved() {
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);

      if (user) {
        const { data } = await supabase
          .from("saved_recipes")
          .select("recipe_slug")
          .eq("user_id", user.id)
          .eq("recipe_slug", recipeSlug)
          .single();

        setIsSaved(!!data);
      }
      setLoading(false);
    }
    checkSaved();
  }, [recipeSlug]);

  async function toggleSave() {
    if (!user) {
      window.location.href = "/account";
      return;
    }

    setLoading(true);
    if (isSaved) {
      // Unsave
      await supabase
        .from("saved_recipes")
        .delete()
        .eq("user_id", user.id)
        .eq("recipe_slug", recipeSlug);
      setIsSaved(false);
    } else {
      // Save
      await supabase
        .from("saved_recipes")
        .insert({ user_id: user.id, recipe_slug: recipeSlug });
      setIsSaved(true);

      // Track save event
      trackSaveRecipe({
        recipe_slug: recipeSlug,
        recipe_title: recipeTitle,
      });
    }
    setLoading(false);
  }

  return (
    <button
      onClick={toggleSave}
      disabled={loading}
      className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 disabled:opacity-50"
      title={isSaved ? "Remove from saved recipes" : "Save recipe"}
    >
      {loading ? (
        <svg className="w-5 h-5 animate-spin" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
        </svg>
      ) : isSaved ? (
        <svg className="w-5 h-5 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
          <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
        </svg>
      ) : (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z"/>
        </svg>
      )}
      {isSaved ? "Saved" : "Save"}
    </button>
  );
}
