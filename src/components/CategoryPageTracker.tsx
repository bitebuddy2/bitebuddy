"use client";

import { useEffect } from "react";
import { trackViewCategoryPage } from "@/lib/analytics";

interface CategoryPageTrackerProps {
  categorySlug: string;
  categoryTitle: string;
  recipeCount: number;
}

export default function CategoryPageTracker({
  categorySlug,
  categoryTitle,
  recipeCount,
}: CategoryPageTrackerProps) {
  useEffect(() => {
    // Track category page view on mount
    trackViewCategoryPage({
      category_slug: categorySlug,
      category_title: categoryTitle,
      recipe_count: recipeCount,
    });
  }, [categorySlug, categoryTitle, recipeCount]);

  return null; // This component doesn't render anything
}
