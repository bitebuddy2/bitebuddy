"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import ContextualSignupPrompt from "./ContextualSignupPrompt";

const PROMPT_SHOWN_KEY = 'recipe_view_prompt_shown';
const PROMPT_DISMISSED_KEY = 'recipe_view_prompt_dismissed';

export default function RecipeViewPrompt() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [showPrompt, setShowPrompt] = useState(false);
  const [viewCount, setViewCount] = useState(0);

  useEffect(() => {
    // Check authentication
    supabase.auth.getUser().then(({ data }) => {
      const isAuth = !!data.user;
      setIsAuthenticated(isAuth);

      // Only proceed if user is NOT authenticated
      if (!isAuth) {
        // Always increment the view count
        const currentCount = parseInt(localStorage.getItem('recipe_views_count') || '0', 10);
        const newCount = currentCount + 1;
        localStorage.setItem('recipe_views_count', newCount.toString());
        setViewCount(newCount);

        // Check if prompt was dismissed by user
        const promptDismissed = sessionStorage.getItem(PROMPT_DISMISSED_KEY);
        const promptShown = sessionStorage.getItem(PROMPT_SHOWN_KEY);

        // Show prompt if count >= 3, already shown before, and not dismissed
        // OR if count >= 3 and never shown before
        if (newCount >= 3 && !promptDismissed) {
          setShowPrompt(true);
          if (!promptShown) {
            sessionStorage.setItem(PROMPT_SHOWN_KEY, 'true');
          }
        }
      }
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Runs on every component mount (each new recipe page)

  const handleDismiss = () => {
    setShowPrompt(false);
    sessionStorage.setItem(PROMPT_DISMISSED_KEY, 'true');
  };

  // Don't render anything while checking auth or if authenticated
  if (isAuthenticated === null || isAuthenticated || !showPrompt) return null;

  return (
    <ContextualSignupPrompt
      type="recipe-views"
      count={viewCount}
      onDismiss={handleDismiss}
    />
  );
}
