"use client";

import { useState } from "react";
import { scaleIngredients } from "@/lib/scaleIngredients";
import type { IngredientGroup } from "@/sanity.types";
import AffiliateButton from "./AffiliateButton";

interface RecipeIngredientsProps {
  originalServings?: number;
  ingredientGroups: IngredientGroup[];
  recipeSlug: string;
  brandTitle?: string;
}

export default function RecipeIngredients({
  originalServings,
  ingredientGroups,
  recipeSlug,
  brandTitle,
}: RecipeIngredientsProps) {
  const [scaledIngredients, setScaledIngredients] = useState(ingredientGroups);
  const [currentServings, setCurrentServings] = useState(originalServings || 1);

  const handleServingsChange = (newServings: number) => {
    if (!originalServings || newServings < 1 || newServings > 100) return;

    setCurrentServings(newServings);
    const multiplier = newServings / originalServings;
    const scaled = scaleIngredients(ingredientGroups, multiplier);
    setScaledIngredients(scaled);
  };

  const incrementServings = () => handleServingsChange(currentServings + 1);
  const decrementServings = () => handleServingsChange(currentServings - 1);
  const resetServings = () => handleServingsChange(originalServings || 1);

  return (
    <section className="ingredients-section rounded-2xl border p-4">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-xl font-semibold tracking-tight">Ingredients</h2>

        {originalServings && (
          <div className="flex items-center gap-2">
            <button
              onClick={decrementServings}
              disabled={currentServings <= 1}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors no-print"
              aria-label="Decrease servings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M20 12H4" />
              </svg>
            </button>

            <div className="flex flex-col items-center min-w-[80px]">
              <input
                type="number"
                value={currentServings}
                onChange={(e) => handleServingsChange(parseInt(e.target.value) || 1)}
                min={1}
                max={100}
                className="w-16 text-center border border-gray-300 rounded-lg px-2 py-1 text-sm font-medium no-print"
              />
              <span className="text-xs text-gray-500 mt-0.5">servings</span>
            </div>

            <button
              onClick={incrementServings}
              disabled={currentServings >= 100}
              className="flex items-center justify-center w-8 h-8 rounded-lg border border-gray-300 bg-white text-gray-700 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors no-print"
              aria-label="Increase servings"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
              </svg>
            </button>

            {currentServings !== originalServings && (
              <button
                onClick={resetServings}
                className="ml-2 text-xs text-emerald-600 hover:text-emerald-700 font-medium no-print"
              >
                Reset
              </button>
            )}
          </div>
        )}
      </div>

      {Array.isArray(scaledIngredients) && scaledIngredients.length > 0 ? (
        <div className="space-y-5">
          {scaledIngredients.map((group: IngredientGroup, gi: number) => (
            <div key={gi}>
              {group.heading ? <h4 className="mb-2 font-semibold">{group.heading}</h4> : null}
              <ul className="space-y-2 text-sm">
                {group.items?.map((it, ii: number) => {
                  const name = it.ingredientText || it.ingredientRef?.name || "Ingredient";
                  const qtyUnit = [it.quantity, it.unit].filter(Boolean).join(" ");
                  const label = [qtyUnit, name].filter(Boolean).join(" ");

                  return (
                    <li key={ii} className="flex items-start gap-2">
                      <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600 flex-shrink-0" />
                      <div className="flex-1">
                        <div>
                          <strong>{label}</strong>
                          {it.notes ? ` — ${it.notes}` : ""}
                        </div>

                        {/* Affiliate retailer buttons */}
                        {it.ingredientRef?.retailerLinks && it.ingredientRef.retailerLinks.length > 0 && (
                          <div className="mt-2 flex flex-wrap gap-2 no-print">
                            {it.ingredientRef.retailerLinks.map((link, linkIdx: number) => (
                              <AffiliateButton
                                key={linkIdx}
                                url={link.url}
                                retailer={link.retailer}
                                ingredient={name}
                                recipe={recipeSlug}
                                brand={brandTitle}
                                label={link.label || `Buy at ${link.retailer}`}
                              />
                            ))}
                          </div>
                        )}
                      </div>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-600">No ingredients listed.</p>
      )}
    </section>
  );
}
