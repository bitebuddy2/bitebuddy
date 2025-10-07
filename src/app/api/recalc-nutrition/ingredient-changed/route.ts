// src/app/api/recalc-nutrition/ingredient-changed/route.ts
import { NextRequest, NextResponse } from "next/server";
import { groq } from "next-sanity";
import { client } from "@/sanity/client";
import { sumRecipeNutrition, perServing } from "@/lib/nutrition";

/**
 * Webhook endpoint for when ingredients are modified.
 * Recalculates nutrition for ALL recipes that use the changed ingredient.
 *
 * Supports:
 *  - Sanity webhook: body contains ingredient _id (or ids[0])
 *  - Optional secret: ?secret=XYZ (set NUTRITION_WEBHOOK_SECRET in env to enforce)
 */

const RECIPES_USING_INGREDIENT_QUERY = groq/* groq */ `
*[_type == "recipe" && (
  // New grouped ingredients structure
  ingredients[].items[].ingredientRef._ref == $ingredientId ||
  // Legacy flat ingredients structure
  ingredients[].ingredientRef._ref == $ingredientId
)]{
  _id
}
`;

const RECIPE_QUERY = groq/* groq */ `
*[_type == "recipe" && _id == $id][0]{
  _id,
  servings,
  nutrition,

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

  // Parse body (webhook)
  let body: any = {};
  try {
    body = await req.json();
  } catch {
    return bad(400, "Invalid JSON body");
  }

  let ingredientId: string | undefined =
    body?.ingredientId || body?._id || (Array.isArray(body?.ids) ? body.ids[0] : undefined);

  if (!ingredientId) return bad(400, "Missing ingredientId / _id");

  try {
    // Find all recipes that use this ingredient
    const affectedRecipes = await client.fetch<{ _id: string }[]>(
      RECIPES_USING_INGREDIENT_QUERY,
      { ingredientId }
    );

    console.log(`🔄 Ingredient ${ingredientId} changed, recalculating nutrition for ${affectedRecipes.length} recipes`);

    const results = [];

    // Recalculate nutrition for each affected recipe
    for (const { _id: recipeId } of affectedRecipes) {
      try {
        // Fetch recipe with ingredients
        const recipe = await client.fetch<any>(RECIPE_QUERY, { id: recipeId });
        if (!recipe?._id) {
          console.warn(`⚠️ Recipe ${recipeId} not found, skipping`);
          continue;
        }

        // Check if nutrition already has manual values (skip auto-calculation if so)
        const hasManualNutrition = recipe.nutrition && (
          recipe.nutrition.calories ||
          recipe.nutrition.protein ||
          recipe.nutrition.fat ||
          recipe.nutrition.carbs
        );

        if (hasManualNutrition) {
          console.log(`⏭️ Recipe ${recipe._id} has manual nutrition values, skipping`);
          results.push({
            recipeId: recipe._id,
            success: true,
            skipped: true,
            message: "Has manual nutrition values"
          });
          continue;
        }

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

        results.push({
          recipeId: recipe._id,
          success: true,
          totals,
          per
        });

        console.log(`✅ Updated nutrition for recipe ${recipe._id}`);

      } catch (error) {
        console.error(`❌ Error updating recipe ${recipeId}:`, error);
        results.push({
          recipeId,
          success: false,
          error: error instanceof Error ? error.message : 'Unknown error'
        });
      }
    }

    const successCount = results.filter(r => r.success).length;
    const failureCount = results.filter(r => !r.success).length;

    return NextResponse.json({
      ok: true,
      ingredientId,
      affectedRecipes: affectedRecipes.length,
      updated: successCount,
      failed: failureCount,
      results
    });

  } catch (error) {
    console.error('❌ Error processing ingredient change:', error);
    return bad(500, `Error processing ingredient change: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
}