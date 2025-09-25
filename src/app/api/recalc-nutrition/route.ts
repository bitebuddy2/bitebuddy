// src/app/api/recalc-nutrition/route.ts
import { NextRequest, NextResponse } from "next/server";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { sumRecipeNutrition, perServing } from "@/lib/nutrition";

/**
 * Supports:
 *  - Manual POST:      { "recipeId": "<_id>" }
 *  - Sanity webhook:   body contains _id (or ids[0])
 *  - Optional secret:  ?secret=XYZ (set NUTRITION_WEBHOOK_SECRET in env to enforce)
 */

const RECIPE_QUERY = groq/* groq */ `
*[_type == "recipe" && _id == $id][0]{
  _id,
  servings,

  // New grouped-ingredients shape
  ingredients[]{
    items[]{
      quantity,
      unit,
      notes,
      ingredientText,
      ingredientRef->{
        _id, name,
        kcal100, protein100, fat100, carbs100,
        density_g_per_ml, gramsPerPiece
      }
    }
  },

  // Fallback: if you still have legacy flat items,
  // expose them as a single group so the calc still works.
  "legacyItems": select(
    defined(ingredients[].items) => null,
    defined(ingredients) => ingredients[]{
      quantity,
      unit,
      notes,
      ingredientText,
      ingredientRef->{
        _id, name,
        kcal100, protein100, fat100, carbs100,
        density_g_per_ml, gramsPerPiece
      }
    },
    []
  )
}
`;

function bad(status: number, message: string) {
  return NextResponse.json({ error: message }, { status });
}

export async function POST(req: NextRequest) {
  // Optional shared-secret check for webhooks
  const requiredSecret = process.env.NUTRITION_WEBHOOK_SECRET;
  const provided = req.nextUrl.searchParams.get("secret");
  if (requiredSecret && provided !== requiredSecret) {
    return bad(401, "Invalid secret");
  }

  // Parse body (manual or webhook)
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    // ignore — some webhooks send empty bodies but include query params
  }

  let recipeId: string | undefined =
    body?.recipeId || body?._id || (Array.isArray(body?.ids) ? body.ids[0] : undefined);

  if (!recipeId) return bad(400, "Missing recipeId / _id");

  // Fetch recipe with ingredients (new + legacy support)
  const recipe = await client.fetch<any>(RECIPE_QUERY, { id: recipeId });
  if (!recipe?._id) return bad(404, "Recipe not found");

  // Normalise ingredients to the grouped shape expected by the calculator
  const groups =
    Array.isArray(recipe.ingredients) && recipe.ingredients.some((g: any) => Array.isArray(g?.items))
      ? recipe.ingredients
      : recipe.legacyItems?.length
      ? [{ items: recipe.legacyItems }]
      : [];

  // Compute totals and per-serving
  const totals = sumRecipeNutrition(groups);
  const per = perServing(totals, recipe.servings);

  // Patch back into the recipe
  await client.patch(recipe._id).set({ nutrition: per }).commit();

  return NextResponse.json({ ok: true, recipeId: recipe._id, totals, per });
}
