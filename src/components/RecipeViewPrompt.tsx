"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useActivityTracking } from "@/hooks/useActivityTracking";
import ContextualSignupPrompt from "./ContextualSignupPrompt";

export default function RecipeViewPrompt() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { recipeViews, trackRecipeView } = useActivityTracking();

  useEffect(() => {
    // Check authentication
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data.user);

      if (!data.user) {
        // Track this recipe view
        trackRecipeView();

        // Show prompt after 3+ recipe views
        if (recipeViews + 1 >= 3) {
          setShowPrompt(true);
        }
      }
    });
  }, [recipeViews, trackRecipeView]);

  // Don't show for authenticated users
  if (isAuthenticated || !showPrompt) return null;

  return (
    <ContextualSignupPrompt
      type="recipe-views"
      count={recipeViews + 1}
      onDismiss={() => setShowPrompt(false)}
    />
  );
}
