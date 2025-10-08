import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { client as sanityClient } from "@/sanity/client";

export async function DELETE(req: Request) {
  try {
    const { recipeId, sanityRecipeId } = await req.json();

    if (!recipeId || !sanityRecipeId) {
      return NextResponse.json(
        { error: "Recipe ID and Sanity Recipe ID are required" },
        { status: 400 }
      );
    }

    // Initialize Supabase admin client
    const supabaseAdmin = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.SUPABASE_SERVICE_ROLE_KEY!
    );

    // Get current user
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: userError,
    } = await supabaseAdmin.auth.getUser(token);

    if (userError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Verify the user owns this recipe
    const { data: aiRecipe, error: fetchError } = await supabaseAdmin
      .from("saved_ai_recipes")
      .select("*")
      .eq("id", recipeId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !aiRecipe) {
      return NextResponse.json(
        { error: "Recipe not found or you don't have permission" },
        { status: 404 }
      );
    }

    // Delete from Sanity
    try {
      await sanityClient.delete(sanityRecipeId);
    } catch (sanityError) {
      console.error("Error deleting from Sanity:", sanityError);
      // Continue anyway - we still want to update Supabase
    }

    // Update Supabase record
    const { error: updateError } = await supabaseAdmin
      .from("saved_ai_recipes")
      .update({
        is_published: false,
        slug: null,
        sanity_recipe_id: null,
        published_at: null,
      })
      .eq("id", recipeId);

    if (updateError) {
      console.error("Error updating Supabase:", updateError);
      return NextResponse.json(
        { error: "Failed to update recipe status" },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Recipe deleted successfully",
    });
  } catch (error: any) {
    console.error("Error deleting published recipe:", error);
    return NextResponse.json(
      {
        error: "Failed to delete recipe",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
