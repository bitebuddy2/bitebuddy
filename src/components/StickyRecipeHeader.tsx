"use client";

import { useState, useEffect } from "react";
import SaveButton from "./SaveButton";
import PrintButton from "./PrintButton";

interface StickyRecipeHeaderProps {
  recipeSlug: string;
  recipeTitle: string;
  brand?: string;
}

export default function StickyRecipeHeader({ recipeSlug, recipeTitle, brand }: StickyRecipeHeaderProps) {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show sticky header after scrolling past 400px
      setIsVisible(window.scrollY > 400);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  if (!isVisible) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-40 bg-white border-b border-gray-200 shadow-md animate-slide-down hidden md:block">
      <div className="mx-auto max-w-4xl px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex-1 min-w-0">
          <h2 className="text-sm font-semibold text-gray-900 truncate">{recipeTitle}</h2>
          {brand && <p className="text-xs text-gray-600">{brand}</p>}
        </div>
        <div className="flex items-center gap-2">
          <SaveButton recipeSlug={recipeSlug} recipeTitle={recipeTitle} />
          <PrintButton recipeSlug={recipeSlug} recipeTitle={recipeTitle} brand={brand} />
        </div>
      </div>
    </div>
  );
}
