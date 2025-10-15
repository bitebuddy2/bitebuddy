"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ContextualSignupPrompt from "./ContextualSignupPrompt";

const PROMPT_SHOWN_KEY = 'recipe_view_prompt_shown';

export default function RecipeViewPrompt() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showPrompt, setShowPrompt] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    // Check authentication
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data.user);

      if (!data.user) {
        // Always increment the view count
        const currentCount = parseInt(localStorage.getItem('recipe_views_count') || '0', 10);
        const newCount = currentCount + 1;
        localStorage.setItem('recipe_views_count', newCount.toString());
        setViewCount(newCount);

        // Check if prompt has already been shown in this session
        const promptShown = sessionStorage.getItem(PROMPT_SHOWN_KEY);

        // Show prompt if count >= 3 and not already shown
        if (newCount >= 3 && !promptShown) {
          setShowPrompt(true);
          sessionStorage.setItem(PROMPT_SHOWN_KEY, 'true');
        }
      } else {
        // For authenticated users, just load the count for display purposes
        const currentCount = parseInt(localStorage.getItem('recipe_views_count') || '0', 10);
        setViewCount(currentCount);
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run once on mount

  const handleDismiss = () => {
    setShowPrompt(false);
    // Keep the flag set so it doesn't show again this session
  };

  // Don't show for authenticated users
  if (isAuthenticated || !showPrompt) return null;

  return (
    <ContextualSignupPrompt
      type="recipe-views"
      count={viewCount}
      onDismiss={handleDismiss}
    />
  );
}
