import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { client as sanityClient } from "@/sanity/client";

export async function POST(req: Request) {
  try {
    const { aiRecipeId } = await req.json();

    if (!aiRecipeId) {
      return NextResponse.json(
        { error: "AI recipe ID is required" },
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

    // Fetch the AI recipe from Supabase
    const { data: aiRecipe, error: fetchError } = await supabaseAdmin
      .from("saved_ai_recipes")
      .select("*")
      .eq("id", aiRecipeId)
      .eq("user_id", user.id)
      .single();

    if (fetchError || !aiRecipe) {
      return NextResponse.json(
        { error: "AI recipe not found or you don't have permission" },
        { status: 404 }
      );
    }

    // Check if already published
    if (aiRecipe.is_published) {
      return NextResponse.json(
        {
          error: "Recipe already published",
          slug: aiRecipe.slug,
        },
        { status: 400 }
      );
    }

    // Generate unique slug
    const baseSlug = aiRecipe.title
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");

    let slug = baseSlug;
    let counter = 1;

    // Check if slug exists in Sanity
    while (true) {
      const existing = await sanityClient.fetch(
        `*[_type == "recipe" && slug.current == $slug][0]`,
        { slug }
      );
      if (!existing) break;
      slug = `${baseSlug}-${counter}`;
      counter++;
    }

    // Transform ingredients to simple format for communityRecipe
    const ingredients = (aiRecipe.ingredients || []).map((ing: any) => ({
      _type: "object",
      _key: `ing-${Math.random().toString(36).substr(2, 9)}`,
      name: ing.name || "",
      amount: ing.amount || "",
      unit: ing.unit || "",
      notes: "",
    }));

    // Steps are already plain text array - no transformation needed
    const steps = aiRecipe.steps || [];

    // Get user display name
    const userName =
      user.user_metadata?.first_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Anonymous";

    // Create communityRecipe in Sanity
    const sanityRecipe: any = {
      _type: "communityRecipe",
      title: aiRecipe.title,
      slug: {
        _type: "slug",
        current: slug,
      },
      description: aiRecipe.description || aiRecipe.intro_text || aiRecipe.title,
      // Skip heroImage for now - will be added via placeholder or user upload later
      servings: aiRecipe.servings || 4,
      prepMin: aiRecipe.prep_min || 0,
      cookMin: aiRecipe.cook_min || 0,
      introText: aiRecipe.intro_text || aiRecipe.description || "",
      ingredients: ingredients,
      steps: steps,
      tips: aiRecipe.tips || [],
      faqs: (aiRecipe.faqs || []).map((faq: any) => ({
        question: faq.question,
        answer: faq.answer,
      })),
      nutrition: aiRecipe.nutrition
        ? {
            _type: "nutrition",
            calories: aiRecipe.nutrition.calories,
            protein: aiRecipe.nutrition.protein,
            fat: aiRecipe.nutrition.fat,
            carbs: aiRecipe.nutrition.carbs,
          }
        : undefined,
      createdBy: {
        userId: user.id,
        userName: userName,
        userEmail: user.email,
        cookingMethod: aiRecipe.cooking_method || null,
        spiceLevel: aiRecipe.spice_level || null,
        dietaryPreference: aiRecipe.dietary_preference || null,
      },
      ratingCount: 0,
      ratingSum: 0,
    };

    const sanityResult = await sanityClient.create(sanityRecipe);

    // Update Supabase record
    const { error: updateError } = await supabaseAdmin
      .from("saved_ai_recipes")
      .update({
        is_published: true,
        slug: slug,
        sanity_recipe_id: sanityResult._id,
        published_at: new Date().toISOString(),
      })
      .eq("id", aiRecipeId);

    if (updateError) {
      console.error("Error updating Supabase:", updateError);
      return NextResponse.json(
        {
          error: "Recipe created in Sanity but failed to update database record",
          details: updateError.message,
          sanityId: sanityResult._id,
          slug: slug,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      slug: slug,
      sanityId: sanityResult._id,
      message: "Recipe published successfully!",
    });
  } catch (error: any) {
    console.error("Error publishing recipe:", error);
    return NextResponse.json(
      {
        error: "Failed to publish recipe",
        details: error.message,
      },
      { status: 500 }
    );
  }
}
