"use client";

import { useEffect, useState } from 'react';

const STORAGE_KEYS = {
  RECIPE_VIEWS: 'recipe_views_count',
  SEARCH_COUNT: 'search_count',
  AI_GENERATION_COUNT: 'ai_generation_count',
  LAST_RESET: 'activity_last_reset',
};

// Reset counts daily
const RESET_INTERVAL = 24 * 60 * 60 * 1000; // 24 hours

function shouldReset() {
  const lastReset = localStorage.getItem(STORAGE_KEYS.LAST_RESET);
  if (!lastReset) return true;

  const timeSinceReset = Date.now() - parseInt(lastReset, 10);
  return timeSinceReset > RESET_INTERVAL;
}

function resetCounts() {
  localStorage.setItem(STORAGE_KEYS.RECIPE_VIEWS, '0');
  localStorage.setItem(STORAGE_KEYS.SEARCH_COUNT, '0');
  localStorage.setItem(STORAGE_KEYS.AI_GENERATION_COUNT, '0');
  localStorage.setItem(STORAGE_KEYS.LAST_RESET, Date.now().toString());
}

export function useActivityTracking() {
  const [recipeViews, setRecipeViews] = useState(0);
  const [searchCount, setSearchCount] = useState(0);
  const [aiGenerationCount, setAiGenerationCount] = useState(0);

  useEffect(() => {
    // Check if we need to reset counts
    if (shouldReset()) {
      resetCounts();
    }

    // Load current counts
    setRecipeViews(parseInt(localStorage.getItem(STORAGE_KEYS.RECIPE_VIEWS) || '0', 10));
    setSearchCount(parseInt(localStorage.getItem(STORAGE_KEYS.SEARCH_COUNT) || '0', 10));
    setAiGenerationCount(parseInt(localStorage.getItem(STORAGE_KEYS.AI_GENERATION_COUNT) || '0', 10));
  }, []);

  const trackRecipeView = () => {
    const newCount = recipeViews + 1;
    setRecipeViews(newCount);
    localStorage.setItem(STORAGE_KEYS.RECIPE_VIEWS, newCount.toString());
  };

  const trackSearch = () => {
    const newCount = searchCount + 1;
    setSearchCount(newCount);
    localStorage.setItem(STORAGE_KEYS.SEARCH_COUNT, newCount.toString());
  };

  const trackAIGeneration = () => {
    const newCount = aiGenerationCount + 1;
    setAiGenerationCount(newCount);
    localStorage.setItem(STORAGE_KEYS.AI_GENERATION_COUNT, newCount.toString());
  };

  return {
    recipeViews,
    searchCount,
    aiGenerationCount,
    trackRecipeView,
    trackSearch,
    trackAIGeneration,
  };
}
