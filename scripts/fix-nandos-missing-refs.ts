// scripts/fix-nandos-missing-refs.ts
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-09-24",
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});

async function fixMissingRefs() {
  console.log("Finding Garlic and Fine sea salt ingredients...");

  const garlic = await client.fetch(
    `*[_type == "ingredient" && name == "Garlic"][0]`
  );

  const salt = await client.fetch(
    `*[_type == "ingredient" && name == "Fine sea salt"][0]`
  );

  if (!garlic) {
    console.log("❌ Garlic ingredient not found in database!");
    return;
  }

  if (!salt) {
    console.log("❌ Fine sea salt ingredient not found in database!");
    return;
  }

  console.log("✅ Found Garlic:", garlic._id);
  console.log("✅ Found Fine sea salt:", salt._id);

  // Get the recipe
  const recipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "nandos-spicy-rice"][0]`
  );

  if (!recipe) {
    console.log("❌ Recipe not found!");
    return;
  }

  console.log("\nFixing ingredient references...");

  const updatedIngredients = recipe.ingredients.map((group: any) => ({
    ...group,
    items: group.items.map((item: any) => {
      // Fix garlic reference (3 clove, minced)
      if (
        item.quantity === "3" &&
        item.unit === "clove" &&
        item.notes === "minced"
      ) {
        console.log("  Fixing Garlic reference...");
        return {
          ...item,
          ingredientRef: {
            _type: "reference",
            _ref: garlic._id,
          },
        };
      }

      // Fix salt reference (1 tsp, no notes)
      if (
        item.quantity === "1" &&
        item.unit === "tsp" &&
        !item.notes &&
        (!item.ingredientRef || !item.ingredientRef._ref)
      ) {
        console.log("  Fixing Fine sea salt reference...");
        return {
          ...item,
          ingredientRef: {
            _type: "reference",
            _ref: salt._id,
          },
        };
      }

      return item;
    }),
  }));

  await client.patch(recipe._id).set({ ingredients: updatedIngredients }).commit();

  console.log("\n✅ Recipe updated with correct ingredient references!");
}

fixMissingRefs().catch(console.error);
