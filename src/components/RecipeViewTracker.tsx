"use client";

import { useEffect } from "react";
import { trackRecipeView } from "@/lib/analytics";

interface RecipeViewTrackerProps {
  recipeSlug: string;
  recipeTitle: string;
  brand?: string;
  categories?: string[];
}

export default function RecipeViewTracker({
  recipeSlug,
  recipeTitle,
  brand,
  categories,
}: RecipeViewTrackerProps) {
  useEffect(() => {
    // Track recipe view on mount
    trackRecipeView({
      recipe_slug: recipeSlug,
      recipe_title: recipeTitle,
      brand,
      categories,
    });
  }, [recipeSlug, recipeTitle, brand, categories]);

  return null; // This component doesn't render anything
}
