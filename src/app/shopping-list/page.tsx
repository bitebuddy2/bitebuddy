"use client";

import Link from "next/link";
import { useShoppingList } from "@/hooks/useShoppingList";

export default function ShoppingListPage() {
  const { items, loading, removeRecipe, clearAll, removeIngredientFromRecipe, removeIngredientGlobally, getConsolidatedIngredients } = useShoppingList();

  const consolidated = getConsolidatedIngredients();

  const handlePrint = () => {
    window.print();
  };

  if (loading) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <p className="text-gray-500">Loading shopping list...</p>
      </main>
    );
  }

  if (items.length === 0) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-8">
        <h1 className="text-3xl font-bold mb-4">Shopping List</h1>
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <svg className="w-16 h-16 mx-auto text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.184 1.707.707 1.707H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z" />
          </svg>
          <p className="text-gray-500 text-lg mb-4">Your shopping list is empty</p>
          <Link href="/recipes" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg hover:bg-emerald-700 transition-colors">
            Browse Recipes
          </Link>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-4xl px-4 py-8 shopping-list-print">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold">Shopping List</h1>
          <p className="text-gray-600 mt-1">
            {items.length} {items.length === 1 ? "recipe" : "recipes"} • {consolidated.length} ingredients
          </p>
        </div>
        <div className="flex gap-2 print:hidden">
          <button
            onClick={handlePrint}
            className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
            </svg>
            Print
          </button>
          <button
            onClick={clearAll}
            className="flex items-center gap-2 bg-white border border-red-300 px-4 py-2 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
            Clear All
          </button>
        </div>
      </div>

      {/* Consolidated ingredients */}
      <div className="bg-white rounded-lg border p-6 mb-6">
        <h2 className="text-xl font-semibold mb-4">Ingredients</h2>
        <ul className="space-y-4 ingredient-list">
          {consolidated.map((item, idx) => (
            <li key={idx} className="flex items-start gap-3 pb-4 border-b last:border-b-0 ingredient-item">
              <input type="checkbox" className="mt-1 print:hidden" />
              <div className="flex-1">
                <div className="font-semibold text-gray-900">{item.name}</div>
                {item.quantities.length > 0 && (
                  <div className="text-sm text-gray-600 mt-2 space-y-1 ingredient-quantities">
                    {item.quantities.map((q, qIdx) => {
                      // Find the recipe slug for this quantity
                      const recipe = items.find(r => r.recipeTitle === q.from);
                      return (
                        <div key={qIdx} className="flex items-center justify-between gap-2">
                          <span>
                            {q.quantity} {q.unit} <span className="text-gray-400 recipe-source">({q.from})</span>
                          </span>
                          {recipe && (
                            <button
                              onClick={() => removeIngredientFromRecipe(item.name, recipe.recipeSlug)}
                              className="flex-shrink-0 w-7 h-7 flex items-center justify-center rounded-full bg-red-100 text-red-600 hover:bg-red-600 hover:text-white text-xl font-bold transition-colors print:hidden"
                              title={`Remove from ${q.from}`}
                            >
                              ×
                            </button>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
                {item.notes.length > 0 && (
                  <div className="text-xs text-gray-500 mt-1">
                    {item.notes.join(" • ")}
                  </div>
                )}
                {/* Remove from All Recipes button */}
                {item.quantities.length > 1 && (
                  <button
                    onClick={() => removeIngredientGlobally(item.name)}
                    className="mt-2 text-xs text-red-600 hover:text-red-800 font-medium underline print:hidden"
                  >
                    Remove from All Recipes
                  </button>
                )}
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Recipe list */}
      <div className="bg-gray-50 rounded-lg p-6">
        <h2 className="text-xl font-semibold mb-4">Recipes</h2>
        <ul className="space-y-3">
          {items.map((recipe) => (
            <li key={recipe.recipeSlug} className="flex items-center justify-between">
              <Link
                href={`/recipes/${recipe.recipeSlug}`}
                className="text-emerald-600 hover:underline font-medium"
              >
                {recipe.recipeTitle}
              </Link>
              <button
                onClick={() => removeRecipe(recipe.recipeSlug)}
                className="text-red-600 hover:text-red-700 text-sm print:hidden"
                title="Remove from list"
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </div>

      <div className="mt-8 print:hidden">
        <Link href="/recipes" className="text-emerald-600 hover:underline">
          ← Back to recipes
        </Link>
      </div>
    </main>
  );
}
