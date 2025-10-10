"use client";

import AddToShoppingListButton from "./AddToShoppingListButton";
import { ShoppingListItem } from "@/hooks/useShoppingList";

interface RecipeShoppingListButtonProps {
  recipeSlug: string;
  recipeTitle: string;
  ingredients: any[]; // Raw Sanity ingredient groups
}

export default function RecipeShoppingListButton({
  recipeSlug,
  recipeTitle,
  ingredients,
}: RecipeShoppingListButtonProps) {
  // Transform Sanity ingredients to shopping list format
  const shoppingListItem: ShoppingListItem = {
    recipeSlug,
    recipeTitle,
    ingredients: ingredients.flatMap((group) =>
      (group.items || []).map((item: any) => ({
        quantity: item.quantity,
        unit: item.unit,
        name: item.ingredientText || item.ingredientRef?.name || "Ingredient",
        notes: item.notes,
      }))
    ),
  };

  return <AddToShoppingListButton recipe={shoppingListItem} />;
}
