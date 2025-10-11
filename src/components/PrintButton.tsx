"use client";

import { trackPrintRecipe } from "@/lib/analytics";

interface PrintButtonProps {
  recipeSlug: string;
  recipeTitle: string;
  brand?: string;
}

export default function PrintButton({ recipeSlug, recipeTitle, brand }: PrintButtonProps) {
  const handlePrint = () => {
    // Track print event
    trackPrintRecipe({
      recipe_slug: recipeSlug,
      recipe_title: recipeTitle,
      brand,
    });

    // Trigger browser print
    window.print();
  };

  return (
    <button
      onClick={handlePrint}
      className="flex items-center gap-2 rounded-lg bg-white border border-gray-300 px-4 py-3 min-h-[44px] text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors print:hidden"
      aria-label="Print recipe"
    >
      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
      </svg>
      Print Recipe
    </button>
  );
}
