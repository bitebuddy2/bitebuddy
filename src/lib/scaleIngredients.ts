import type { IngredientGroup } from "@/sanity.types";

/**
 * Scales ingredient quantities by a multiplier
 * Handles fractions, decimals, and ranges
 */
export function scaleQuantity(quantity: string | undefined, multiplier: number): string {
  if (!quantity) return "";

  // Handle ranges like "1-2" or "1 to 2"
  const rangeMatch = quantity.match(/^(\d+(?:\.?\d+)?)\s*[-to]\s*(\d+(?:\.?\d+)?)$/);
  if (rangeMatch) {
    const min = parseFloat(rangeMatch[1]) * multiplier;
    const max = parseFloat(rangeMatch[2]) * multiplier;
    return `${formatNumber(min)}-${formatNumber(max)}`;
  }

  // Handle fractions like "1/2", "1 1/2"
  const fractionMatch = quantity.match(/^(\d+)?\s*(\d+)\/(\d+)$/);
  if (fractionMatch) {
    const whole = fractionMatch[1] ? parseInt(fractionMatch[1]) : 0;
    const numerator = parseInt(fractionMatch[2]);
    const denominator = parseInt(fractionMatch[3]);
    const decimal = whole + (numerator / denominator);
    const scaled = decimal * multiplier;
    return formatNumber(scaled);
  }

  // Handle decimals and whole numbers
  const numberMatch = quantity.match(/^(\d+(?:\.?\d+)?)$/);
  if (numberMatch) {
    const num = parseFloat(numberMatch[1]) * multiplier;
    return formatNumber(num);
  }

  // If we can't parse it, return original
  return quantity;
}

/**
 * Formats a number for display, converting to fractions when appropriate
 */
function formatNumber(num: number): string {
  // If it's a whole number, return as is
  if (Number.isInteger(num)) {
    return num.toString();
  }

  // Common fractions
  const fractions: { [key: string]: string } = {
    "0.25": "¼",
    "0.33": "⅓",
    "0.5": "½",
    "0.66": "⅔",
    "0.75": "¾",
  };

  const wholeNumber = Math.floor(num);
  const decimal = num - wholeNumber;
  const decimalRounded = decimal.toFixed(2);

  // Check if the decimal part matches a common fraction
  if (fractions[decimalRounded]) {
    if (wholeNumber === 0) {
      return fractions[decimalRounded];
    }
    return `${wholeNumber} ${fractions[decimalRounded]}`;
  }

  // For other decimals, show 1 decimal place if not whole
  if (decimal < 0.1) {
    return wholeNumber.toString();
  }
  return num.toFixed(1);
}

/**
 * Scales all ingredients in ingredient groups
 */
export function scaleIngredients(
  ingredientGroups: IngredientGroup[] | undefined,
  multiplier: number
): IngredientGroup[] {
  if (!ingredientGroups) return [];

  return ingredientGroups.map(group => ({
    ...group,
    items: group.items?.map(item => ({
      ...item,
      quantity: item.quantity ? scaleQuantity(item.quantity, multiplier) : item.quantity,
    })),
  }));
}
