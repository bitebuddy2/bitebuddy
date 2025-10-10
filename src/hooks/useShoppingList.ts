"use client";

import { useState, useEffect } from "react";

export interface ShoppingListItem {
  recipeSlug: string;
  recipeTitle: string;
  ingredients: Array<{
    quantity?: string;
    unit?: string;
    name: string;
    notes?: string;
  }>;
}

const STORAGE_KEY = "bb-shopping-list";

export function useShoppingList() {
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        setItems(JSON.parse(stored));
      }
    } catch (e) {
      console.error("Failed to load shopping list:", e);
    } finally {
      setLoading(false);
    }
  }, []);

  // Save to localStorage whenever items change
  useEffect(() => {
    if (!loading) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
      } catch (e) {
        console.error("Failed to save shopping list:", e);
      }
    }
  }, [items, loading]);

  const addRecipe = (recipe: ShoppingListItem) => {
    setItems((prev) => {
      // Check if recipe already exists
      const exists = prev.some((item) => item.recipeSlug === recipe.recipeSlug);
      if (exists) {
        return prev; // Don't add duplicate
      }
      return [...prev, recipe];
    });
  };

  const removeRecipe = (recipeSlug: string) => {
    setItems((prev) => prev.filter((item) => item.recipeSlug !== recipeSlug));
  };

  const clearAll = () => {
    setItems([]);
  };

  const hasRecipe = (recipeSlug: string) => {
    return items.some((item) => item.recipeSlug === recipeSlug);
  };

  // Consolidate ingredients across all recipes
  const getConsolidatedIngredients = () => {
    const consolidated: Record<
      string,
      {
        name: string;
        quantities: Array<{ quantity: string; unit: string; from: string }>;
        notes: string[];
      }
    > = {};

    items.forEach((recipe) => {
      recipe.ingredients.forEach((ing) => {
        const key = ing.name.toLowerCase();
        if (!consolidated[key]) {
          consolidated[key] = {
            name: ing.name,
            quantities: [],
            notes: [],
          };
        }

        if (ing.quantity || ing.unit) {
          consolidated[key].quantities.push({
            quantity: ing.quantity || "",
            unit: ing.unit || "",
            from: recipe.recipeTitle,
          });
        }

        if (ing.notes && !consolidated[key].notes.includes(ing.notes)) {
          consolidated[key].notes.push(ing.notes);
        }
      });
    });

    return Object.values(consolidated).sort((a, b) =>
      a.name.localeCompare(b.name)
    );
  };

  return {
    items,
    loading,
    addRecipe,
    removeRecipe,
    clearAll,
    hasRecipe,
    getConsolidatedIngredients,
  };
}
