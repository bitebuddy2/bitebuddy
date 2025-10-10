"use client";

import { useEffect } from "react";
import { trackViewBrandPage } from "@/lib/analytics";

interface BrandPageTrackerProps {
  brandSlug: string;
  brandTitle: string;
  recipeCount: number;
}

export default function BrandPageTracker({
  brandSlug,
  brandTitle,
  recipeCount,
}: BrandPageTrackerProps) {
  useEffect(() => {
    // Track brand page view on mount
    trackViewBrandPage({
      brand_slug: brandSlug,
      brand_title: brandTitle,
      recipe_count: recipeCount,
    });
  }, [brandSlug, brandTitle, recipeCount]);

  return null; // This component doesn't render anything
}
