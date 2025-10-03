"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";
import Image from "next/image";
import { useSubscription } from "@/hooks/useSubscription";
import UpgradeModal from "./UpgradeModal";

type MealType = "breakfast" | "lunch" | "dinner" | "snack";

type MealPlanEntry = {
  id: string;
  date: string;
  meal_type: MealType;
  recipe_type: "published" | "ai";
  recipe_slug?: string;
  ai_recipe_id?: string;
  notes?: string;
};

type Recipe = {
  slug?: string;
  id?: string;
  title: string;
  heroImage?: { asset?: { url: string }; alt?: string };
  description?: string;
  type: "published" | "ai";
};

export default function MealPlannerCalendar() {
  const [startDate, setStartDate] = useState<Date>(new Date());
  const [mealPlan, setMealPlan] = useState<Record<string, MealPlanEntry>>({});
  const [savedRecipes, setSavedRecipes] = useState<Recipe[]>([]);
  const [selectedRecipe, setSelectedRecipe] = useState<Recipe | null>(null);
  const [selectedSlot, setSelectedSlot] = useState<{ date: string; mealType: MealType } | null>(null);
  const [loading, setLoading] = useState(true);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);
  const [userId, setUserId] = useState<string>("");
  const { isPremium, loading: subLoading } = useSubscription();

  const mealTypes: MealType[] = ["breakfast", "lunch", "dinner", "snack"];

  // Get user ID
  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data.user) setUserId(data.user.id);
    });
  }, []);

  // Generate days from start date - 3 for free, 14 for premium
  const getDays = () => {
    const days = [];
    const maxDays = isPremium ? 14 : 3;
    for (let i = 0; i < maxDays; i++) {
      const date = new Date(startDate);
      date.setDate(date.getDate() + i);
      days.push(date);
    }
    return days;
  };

  // Fetch meal plan and saved recipes
  useEffect(() => {
    async function fetchData() {
      setLoading(true);

      // Fetch meal plan entries
      const endDate = new Date(startDate);
      const maxDays = isPremium ? 14 : 3;
      endDate.setDate(endDate.getDate() + maxDays);

      const { data: planData } = await supabase
        .from("meal_plan")
        .select("*")
        .gte("date", startDate.toISOString().split("T")[0])
        .lt("date", endDate.toISOString().split("T")[0]);

      if (planData) {
        const planMap: Record<string, MealPlanEntry> = {};
        planData.forEach((entry) => {
          planMap[`${entry.date}-${entry.meal_type}`] = entry;
        });
        setMealPlan(planMap);
      }

      // Fetch saved published recipes
      const { data: savedSlugs } = await supabase.from("saved_recipes").select("recipe_slug");

      let publishedRecipes: Recipe[] = [];
      if (savedSlugs && savedSlugs.length > 0) {
        const { client } = await import("@/sanity/client");
        const slugs = savedSlugs.map((s) => s.recipe_slug);
        const sanityRecipes = await client.fetch(
          `*[_type == "recipe" && slug.current in $slugs]{
            title,
            "slug": slug.current,
            description,
            heroImage{
              asset->{url},
              alt
            }
          }`,
          { slugs }
        );
        publishedRecipes = sanityRecipes.map((r: any) => ({ ...r, type: "published" as const }));
      }

      // Fetch saved AI recipes
      const { data: aiRecipes } = await supabase
        .from("saved_ai_recipes")
        .select("id, title, description")
        .order("created_at", { ascending: false });

      const aiRecipesList: Recipe[] = (aiRecipes || []).map((r) => ({
        id: r.id,
        title: r.title,
        description: r.description,
        type: "ai" as const,
      }));

      setSavedRecipes([...publishedRecipes, ...aiRecipesList]);
      setLoading(false);
    }

    fetchData();
  }, [startDate, isPremium]);

  // Assign recipe to a meal slot
  async function assignRecipe() {
    if (!selectedRecipe || !selectedSlot) return;

    // Get current user
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const entry = {
      user_id: user.id,
      date: selectedSlot.date,
      meal_type: selectedSlot.mealType,
      recipe_type: selectedRecipe.type,
      recipe_slug: selectedRecipe.type === "published" ? selectedRecipe.slug : null,
      ai_recipe_id: selectedRecipe.type === "ai" ? selectedRecipe.id : null,
    };

    const { data, error } = await supabase.from("meal_plan").upsert(entry, {
      onConflict: "user_id,date,meal_type",
    }).select();

    if (error) {
      console.error("Error assigning recipe:", error);
      alert("Failed to assign recipe. Please try again.");
      return;
    }

    if (data) {
      setMealPlan({ ...mealPlan, [`${selectedSlot.date}-${selectedSlot.mealType}`]: data[0] });
      setSelectedSlot(null);
      setSelectedRecipe(null);
    }
  }

  // Remove recipe from meal slot
  async function removeRecipe(date: string, mealType: MealType) {
    const key = `${date}-${mealType}`;
    const entry = mealPlan[key];
    if (!entry) return;

    await supabase.from("meal_plan").delete().eq("id", entry.id);

    const newPlan = { ...mealPlan };
    delete newPlan[key];
    setMealPlan(newPlan);
  }

  // Get recipe for a slot
  function getRecipeForSlot(date: string, mealType: MealType): Recipe | null {
    const entry = mealPlan[`${date}-${mealType}`];
    if (!entry) return null;

    if (entry.recipe_type === "published") {
      return savedRecipes.find((r) => r.slug === entry.recipe_slug) || null;
    } else {
      return savedRecipes.find((r) => r.id === entry.ai_recipe_id) || null;
    }
  }

  const days = getDays();

  const maxDays = isPremium ? 14 : 3;

  return (
    <div className="space-y-6">
      {/* Header with navigation */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">
            {isPremium ? "14-Day" : "3-Day"} Meal Planner
          </h2>
          {!isPremium && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="text-sm text-emerald-600 hover:text-emerald-700 font-medium mt-1"
            >
              ⭐ Upgrade to unlock 14-day planner
            </button>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              const newDate = new Date(startDate);
              newDate.setDate(newDate.getDate() - maxDays);
              setStartDate(newDate);
            }}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            ← Previous {maxDays} days
          </button>
          <button
            onClick={() => setStartDate(new Date())}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Today
          </button>
          <button
            onClick={() => {
              const newDate = new Date(startDate);
              newDate.setDate(newDate.getDate() + maxDays);
              setStartDate(newDate);
            }}
            className="rounded-lg border border-gray-300 px-3 py-1.5 text-sm font-medium text-gray-700 hover:bg-gray-50"
          >
            Next {maxDays} days →
          </button>
        </div>
      </div>

      {/* Calendar Grid */}
      {loading ? (
        <div className="text-center py-12 text-gray-500">Loading meal plan...</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="border border-gray-200 bg-gray-50 p-2 text-left text-sm font-semibold text-gray-700 sticky left-0 z-10">
                  Meal
                </th>
                {days.map((day) => (
                  <th
                    key={day.toISOString()}
                    className="border border-gray-200 bg-gray-50 p-2 text-center text-sm font-semibold text-gray-700 min-w-[150px]"
                  >
                    <div>{day.toLocaleDateString("en-GB", { weekday: "short" })}</div>
                    <div className="text-xs font-normal text-gray-500">
                      {day.toLocaleDateString("en-GB", { month: "short", day: "numeric" })}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {mealTypes.map((mealType) => (
                <tr key={mealType}>
                  <td className="border border-gray-200 bg-gray-50 p-2 text-sm font-medium text-gray-700 capitalize sticky left-0 z-10">
                    {mealType}
                  </td>
                  {days.map((day) => {
                    const dateStr = day.toISOString().split("T")[0];
                    const recipe = getRecipeForSlot(dateStr, mealType);

                    return (
                      <td key={`${dateStr}-${mealType}`} className="border border-gray-200 p-1 align-top">
                        {recipe ? (
                          <div className="relative group">
                            <a
                              href={recipe.type === "published" ? `/recipes/${recipe.slug}` : `/account?tab=recipes&ai=${recipe.id}`}
                              className="block rounded-lg bg-emerald-50 p-2 text-xs hover:bg-emerald-100 transition-colors cursor-pointer"
                              title={`View ${recipe.title}`}
                            >
                              {recipe.heroImage?.asset?.url && (
                                <Image
                                  src={recipe.heroImage.asset.url}
                                  alt={recipe.title}
                                  width={120}
                                  height={80}
                                  className="w-full h-16 object-cover rounded mb-1"
                                />
                              )}
                              <div className="font-medium text-gray-900 line-clamp-2">{recipe.title}</div>
                              {recipe.type === "ai" && (
                                <div className="text-xs text-emerald-600 mt-1">🤖 AI</div>
                              )}
                            </a>
                            <button
                              onClick={(e) => {
                                e.preventDefault();
                                removeRecipe(dateStr, mealType);
                              }}
                              className="absolute top-1 right-1 opacity-0 group-hover:opacity-100 bg-red-500 text-white rounded-full w-5 h-5 flex items-center justify-center text-xs hover:bg-red-600 transition-opacity z-10"
                            >
                              ×
                            </button>
                          </div>
                        ) : (
                          <button
                            onClick={() => setSelectedSlot({ date: dateStr, mealType })}
                            className="w-full h-24 rounded-lg border-2 border-dashed border-gray-300 hover:border-emerald-400 hover:bg-emerald-50 text-gray-400 hover:text-emerald-600 transition-colors text-xs"
                          >
                            + Add
                          </button>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Recipe selection modal */}
      {selectedSlot && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[80vh] overflow-hidden flex flex-col">
            <div className="p-4 border-b flex items-center justify-between">
              <h3 className="text-lg font-semibold">
                Select recipe for {new Date(selectedSlot.date).toLocaleDateString("en-GB", {
                  month: "short",
                  day: "numeric"
                })} - {selectedSlot.mealType}
              </h3>
              <button
                onClick={() => {
                  setSelectedSlot(null);
                  setSelectedRecipe(null);
                }}
                className="text-gray-500 hover:text-gray-700"
              >
                ×
              </button>
            </div>

            <div className="p-4 overflow-y-auto flex-1">
              {savedRecipes.length === 0 ? (
                <p className="text-gray-500 text-center py-8">
                  No saved recipes yet. Save some recipes first!
                </p>
              ) : (
                <div className="grid gap-3 md:grid-cols-2">
                  {savedRecipes.map((recipe) => (
                    <button
                      key={recipe.slug || recipe.id}
                      onClick={() => setSelectedRecipe(recipe)}
                      className={`text-left rounded-lg border-2 p-3 transition-all ${
                        selectedRecipe?.slug === recipe.slug || selectedRecipe?.id === recipe.id
                          ? "border-emerald-500 bg-emerald-50"
                          : "border-gray-200 hover:border-emerald-300"
                      }`}
                    >
                      {recipe.heroImage?.asset?.url && (
                        <Image
                          src={recipe.heroImage.asset.url}
                          alt={recipe.title}
                          width={200}
                          height={120}
                          className="w-full h-24 object-cover rounded mb-2"
                        />
                      )}
                      <div className="font-medium text-gray-900">{recipe.title}</div>
                      {recipe.type === "ai" && (
                        <div className="text-xs text-emerald-600 mt-1">🤖 AI Generated</div>
                      )}
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="p-4 border-t flex justify-end gap-2">
              <button
                onClick={() => {
                  setSelectedSlot(null);
                  setSelectedRecipe(null);
                }}
                className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={assignRecipe}
                disabled={!selectedRecipe}
                className="rounded-lg bg-emerald-600 px-4 py-2 text-sm font-medium text-white hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Assign Recipe
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Upgrade Modal */}
      {showUpgradeModal && userId && (
        <UpgradeModal
          isOpen={showUpgradeModal}
          onClose={() => setShowUpgradeModal(false)}
          userId={userId}
        />
      )}
    </div>
  );
}
