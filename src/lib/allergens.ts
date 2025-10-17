import type { IngredientGroup } from "@/sanity.types";

/**
 * Aggregates all unique allergens from a recipe's ingredients
 * @param ingredientGroups - Array of ingredient groups from a recipe
 * @returns Array of unique allergen strings, sorted alphabetically
 */
export function aggregateAllergens(ingredientGroups: IngredientGroup[] = []): string[] {
  const allergenSet = new Set<string>();

  ingredientGroups.forEach((group) => {
    group.items?.forEach((item) => {
      // Only ingredient references have allergen data
      if (item.ingredientRef?.allergens) {
        item.ingredientRef.allergens.forEach((allergen) => {
          allergenSet.add(allergen);
        });
      }
    });
  });

  // Convert to array and sort alphabetically
  return Array.from(allergenSet).sort();
}
