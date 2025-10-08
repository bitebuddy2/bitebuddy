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

    // Fetch Bite Buddy Kitchen brand
    const biteBuddyKitchen = await sanityClient.fetch(
      `*[_type == "brand" && slug.current == "bite-buddy-kitchen"][0]{ _id }`
    );

    if (!biteBuddyKitchen) {
      return NextResponse.json(
        { error: "Bite Buddy Kitchen brand not found in Sanity" },
        { status: 500 }
      );
    }

    // Transform ingredients to Sanity format
    const ingredients = aiRecipe.ingredients || [];
    const ingredientGroups = [
      {
        _type: "ingredientGroup",
        _key: "main",
        heading: "Ingredients",
        items: ingredients.map((ing: any, idx: number) => ({
          _type: "ingredientItem",
          _key: `ing-${idx}`,
          quantity: ing.amount || "",
          unit: ing.unit || "",
          ingredientText: ing.name || "",
          notes: "",
        })),
      },
    ];

    // Transform steps to Sanity format
    const steps = (aiRecipe.steps || []).map((step: string, idx: number) => ({
      _type: "step",
      _key: `step-${idx}`,
      step: [
        {
          _type: "block",
          _key: `block-${idx}`,
          style: "normal",
          children: [
            {
              _type: "span",
              text: step,
            },
          ],
        },
      ],
    }));

    // Get user display name
    const userName =
      user.user_metadata?.first_name ||
      user.user_metadata?.name ||
      user.email?.split("@")[0] ||
      "Anonymous";

    // Create recipe in Sanity
    const sanityRecipe = {
      _type: "recipe",
      title: aiRecipe.title,
      slug: {
        _type: "slug",
        current: slug,
      },
      description: aiRecipe.description || aiRecipe.intro_text || aiRecipe.title,
      heroImage: {
        _type: "image",
        asset: {
          _type: "reference",
          _ref: "image-placeholder", // You'll need a default image
        },
        alt: aiRecipe.title,
      },
      servings: aiRecipe.servings || 4,
      prepMin: aiRecipe.prep_min || 0,
      cookMin: aiRecipe.cook_min || 0,
      introText: aiRecipe.intro_text || aiRecipe.description || "",
      ingredients: ingredientGroups,
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
      brand: {
        _type: "reference",
        _ref: biteBuddyKitchen._id,
      },
      createdBy: {
        _type: "createdBy",
        userId: user.id,
        userName: userName,
        userEmail: user.email,
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
      // Don't fail the request, recipe is already created in Sanity
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
