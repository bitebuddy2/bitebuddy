"use client";

import { useState } from "react";

interface RecipeScalerProps {
  originalServings: number;
  onServingsChange: (multiplier: number) => void;
}

export default function RecipeScaler({ originalServings, onServingsChange }: RecipeScalerProps) {
  const [servings, setServings] = useState(originalServings);

  const handleServingsChange = (newServings: number) => {
    if (newServings < 1 || newServings > 100) return;
    setServings(newServings);
    const multiplier = newServings / originalServings;
    onServingsChange(multiplier);
  };

  const increment = () => handleServingsChange(servings + 1);
  const decrement = () => handleServingsChange(Math.max(1, servings - 1));

  return (
    <div className="flex items-center gap-3 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 rounded-lg">
      <div className="flex-1 flex items-center gap-3">
        <div>
          <label htmlFor="servings" className="block text-sm font-medium text-gray-700 mb-1">
            Adjust Servings
          </label>
          <p className="text-xs text-gray-600">
            Original recipe serves {originalServings}
          </p>
        </div>

        <button
          onClick={() => handleServingsChange(originalServings)}
          disabled={servings === originalServings}
          className="px-3 py-1.5 text-xs font-medium text-emerald-700 bg-white border border-emerald-300 rounded-lg hover:bg-emerald-50 hover:text-emerald-800 disabled:opacity-0 disabled:pointer-events-none transition-opacity whitespace-nowrap"
          aria-label="Reset to original servings"
        >
          Reset
        </button>
      </div>

      <div className="flex items-center gap-2">
        <button
          onClick={decrement}
          disabled={servings <= 1}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-emerald-600 text-emerald-600 font-bold text-lg hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Decrease servings"
        >
          −
        </button>

        <input
          id="servings"
          type="number"
          min="1"
          max="100"
          value={servings}
          onChange={(e) => handleServingsChange(parseInt(e.target.value) || 1)}
          className="w-16 h-10 text-center text-lg font-semibold border-2 border-emerald-600 rounded-lg focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        <button
          onClick={increment}
          disabled={servings >= 100}
          className="w-10 h-10 flex items-center justify-center rounded-lg bg-white border-2 border-emerald-600 text-emerald-600 font-bold text-lg hover:bg-emerald-50 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          aria-label="Increase servings"
        >
          +
        </button>
      </div>
    </div>
  );
}
