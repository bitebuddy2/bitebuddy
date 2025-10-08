import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!;

export async function GET(req: NextRequest) {
  try {
    const authHeader = req.headers.get("authorization");
    if (!authHeader) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const token = authHeader.replace("Bearer ", "");
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Verify the user token
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    // Fetch all user data
    const [
      { data: savedRecipes },
      { data: savedAIRecipes },
      { data: mealPlans },
      { data: preferences },
      { data: comments },
      { data: publishedRecipes },
    ] = await Promise.all([
      supabase.from("saved_recipes").select("*").eq("user_id", user.id),
      supabase.from("saved_ai_recipes").select("*").eq("user_id", user.id),
      supabase.from("meal_plans").select("*").eq("user_id", user.id),
      supabase.from("user_preferences").select("*").eq("user_id", user.id).single(),
      supabase.from("recipe_comments").select("*").eq("user_id", user.id),
      supabase
        .from("saved_ai_recipes")
        .select("*")
        .eq("user_id", user.id)
        .eq("is_published", true),
    ]);

    const userData = {
      user: {
        id: user.id,
        email: user.email,
        created_at: user.created_at,
        first_name: user.user_metadata?.first_name,
      },
      saved_recipes: savedRecipes || [],
      saved_ai_recipes: savedAIRecipes || [],
      meal_plans: mealPlans || [],
      preferences: preferences || null,
      comments: comments || [],
      published_recipes: publishedRecipes || [],
      export_date: new Date().toISOString(),
    };

    return NextResponse.json(userData);
  } catch (error: any) {
    console.error("Export user data error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to export user data" },
      { status: 500 }
    );
  }
}
