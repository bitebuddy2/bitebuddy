export type IngredientRef = {
  _id: string;
  name: string;
  kcal100?: number;
  protein100?: number;
  fat100?: number;
  carbs100?: number;
  density_g_per_ml?: number;
  gramsPerPiece?: number;
};

export type LineItem = {
  ingredientText?: string;
  ingredientRef?: IngredientRef;
  quantity?: string; // allow "1.5"
  unit?: string;     // "g","kg","ml","l","tsp","tbsp","cup","piece","clove","egg"...
  notes?: string;
};

export type IngredientGroup = { heading?: string; items: LineItem[] };

export type NutritionTotals = {
  kcal: number; protein: number; fat: number; carbs: number;
};

const VOLUME_ML: Record<string, number> = {
  ml: 1, l: 1000, tsp: 5, tbsp: 15, cup: 240
};

const WEIGHT_G: Record<string, number> = {
  g: 1, kg: 1000
};

function toNumber(n?: string) {
  if (!n) return 0;
  // supports "1 1/2", "1/2", "1.5"
  const s = n.trim();
  if (s.includes("/")) {
    const parts = s.split(" ");
    const frac = parts.pop()!;
    const [a, b] = frac.split("/").map(Number);
    const base = parts.length ? Number(parts[0]) : 0;
    return base + (a && b ? a / b : 0);
  }
  return Number(s);
}

function normalizeToGrams(item: LineItem): number {
  const qty = toNumber(item.quantity);
  const u = (item.unit || "").toLowerCase();

  // weight units
  if (u in WEIGHT_G) return qty * WEIGHT_G[u];

  // volume units → need density
  if (u in VOLUME_ML) {
    const ml = qty * VOLUME_ML[u];
    const density = item.ingredientRef?.density_g_per_ml;
    if (density) return ml * density;
    // no density known: best-effort fallback (water≈1)
    return ml * 1.0;
  }

  // piece-like units → gramsPerPiece
  if (["piece","egg","clove","onion","garlic","breast"].includes(u) || !u) {
    const gpp = item.ingredientRef?.gramsPerPiece;
    if (gpp) return qty * gpp;
  }

  // unknown → 0g (skip)
  return 0;
}

function applyPer100g(grams: number, ing?: IngredientRef): NutritionTotals {
  const f = grams / 100;
  return {
    kcal: (ing?.kcal100 || 0) * f,
    protein: (ing?.protein100 || 0) * f,
    fat: (ing?.fat100 || 0) * f,
    carbs: (ing?.carbs100 || 0) * f
  };
}

export function sumRecipeNutrition(groups: IngredientGroup[]): NutritionTotals {
  return (groups || []).flatMap(g => g.items || []).reduce((acc, it) => {
    const g = normalizeToGrams(it);
    const n = applyPer100g(g, it.ingredientRef);
    acc.kcal += n.kcal;
    acc.protein += n.protein;
    acc.fat += n.fat;
    acc.carbs += n.carbs;
    return acc;
  }, { kcal: 0, protein: 0, fat: 0, carbs: 0 } as NutritionTotals);
}

export function perServing(t: NutritionTotals, servings?: number) {
  const s = Math.max(1, servings || 1);
  return {
    calories: Math.round(t.kcal),
    protein: Math.round((t.protein / s) * 10) / 10,
    fat: Math.round((t.fat / s) * 10) / 10,
    carbs: Math.round((t.carbs / s) * 10) / 10
  };
}
