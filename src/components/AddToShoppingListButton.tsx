"use client";

import { useState } from "react";
import { useShoppingList, ShoppingListItem } from "@/hooks/useShoppingList";
import { trackGenerateShoppingList } from "@/lib/analytics";

interface AddToShoppingListButtonProps {
  recipe: ShoppingListItem;
}

export default function AddToShoppingListButton({ recipe }: AddToShoppingListButtonProps) {
  const { addRecipe, hasRecipe, items } = useShoppingList();
  const [showSuccess, setShowSuccess] = useState(false);
  const isAdded = hasRecipe(recipe.recipeSlug);

  const handleAdd = () => {
    addRecipe(recipe);
    setShowSuccess(true);

    // Track analytics
    trackGenerateShoppingList({
      recipe_slugs: [...items.map(i => i.recipeSlug), recipe.recipeSlug],
      recipe_count: items.length + 1,
    });

    // Hide success message after 2 seconds
    setTimeout(() => setShowSuccess(false), 2000);
  };

  return (
    <div className="relative">
      <button
        onClick={handleAdd}
        disabled={isAdded}
        className={`flex items-center gap-2 rounded-lg border px-4 py-3 min-h-[44px] text-sm font-medium transition-colors ${
          isAdded
            ? "border-emerald-300 bg-emerald-50 text-emerald-700 cursor-not-allowed"
            : "border-gray-300 bg-white text-gray-700 hover:bg-gray-50"
        }`}
        title={isAdded ? "Already in shopping list" : "Add to shopping list"}
      >
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"
          />
        </svg>
        {isAdded ? "In Shopping List" : "Add to Shopping List"}
      </button>

      {showSuccess && (
        <div className="absolute top-full mt-2 left-0 right-0 bg-emerald-600 text-white text-xs px-3 py-2 rounded-lg shadow-lg text-center animate-fade-in">
          Added to shopping list! <a href="/shopping-list" className="underline font-medium">View list →</a>
        </div>
      )}
    </div>
  );
}
