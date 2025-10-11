"use client";

import { useState } from "react";
import SaveButton from "./SaveButton";
import PrintButton from "./PrintButton";

interface MobileRecipeActionsProps {
  recipeSlug: string;
  recipeTitle: string;
  brand?: string;
}

export default function MobileRecipeActions({ recipeSlug, recipeTitle, brand }: MobileRecipeActionsProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      {/* Mobile-only floating action button */}
      <div className="fixed bottom-4 right-4 z-50 md:hidden">
        {/* Action menu */}
        {isOpen && (
          <div className="absolute bottom-16 right-0 flex flex-col gap-2 mb-2">
            <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-600 overflow-hidden">
              <SaveButton recipeSlug={recipeSlug} recipeTitle={recipeTitle} />
            </div>
            <div className="bg-white rounded-lg shadow-lg border-2 border-emerald-600 overflow-hidden">
              <PrintButton recipeSlug={recipeSlug} recipeTitle={recipeTitle} brand={brand} />
            </div>
          </div>
        )}

        {/* Toggle button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex h-14 w-14 items-center justify-center rounded-full bg-emerald-600 text-white shadow-lg transition-all hover:bg-emerald-700 active:scale-95"
          aria-label="Recipe actions"
        >
          {isOpen ? (
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
            </svg>
          )}
        </button>
      </div>
    </>
  );
}
