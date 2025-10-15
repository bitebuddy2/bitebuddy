"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useActivityTracking } from "@/hooks/useActivityTracking";
import ContextualSignupPrompt from "./ContextualSignupPrompt";

const PROMPT_SHOWN_KEY = 'recipe_view_prompt_shown';

export default function RecipeViewPrompt() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const { recipeViews, trackRecipeView } = useActivityTracking();

  useEffect(() => {
    // Check authentication
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data.user);

      if (!data.user) {
        // Check if prompt has already been shown in this session
        const promptShown = sessionStorage.getItem(PROMPT_SHOWN_KEY);

        if (!promptShown) {
          // Track this recipe view
          trackRecipeView();

          // Show prompt after 3+ recipe views (only once per session)
          const newCount = recipeViews + 1;
          if (newCount >= 3) {
            setShowPrompt(true);
            sessionStorage.setItem(PROMPT_SHOWN_KEY, 'true');
          }
        }
      }
    });
  }, [recipeViews, trackRecipeView]);

  const handleDismiss = () => {
    setShowPrompt(false);
    // Keep the flag set so it doesn't show again this session
  };

  // Don't show for authenticated users
  if (isAuthenticated || !showPrompt) return null;

  return (
    <ContextualSignupPrompt
      type="recipe-views"
      count={recipeViews}
      onDismiss={handleDismiss}
    />
  );
}
