// scripts/fix-chicken-selects-refs.ts
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
  console.log("Finding missing ingredients...");

  const salt = await client.fetch(
    `*[_type == "ingredient" && name == "Fine sea salt"][0]`
  );

  const flour = await client.fetch(
    `*[_type == "ingredient" && name == "Plain flour"][0]`
  );

  const paprika = await client.fetch(
    `*[_type == "ingredient" && name == "Paprika"][0]`
  );

  if (!salt || !flour || !paprika) {
    console.log("❌ Required ingredients not found!");
    console.log("Salt:", salt ? "✅" : "❌");
    console.log("Plain flour:", flour ? "✅" : "❌");
    console.log("Paprika:", paprika ? "✅" : "❌");
    return;
  }

  console.log("✅ Found Fine sea salt:", salt._id);
  console.log("✅ Found Plain flour:", flour._id);
  console.log("✅ Found Paprika:", paprika._id);

  // Get the recipe
  const recipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "mcdonalds-chicken-selects"][0]`
  );

  if (!recipe) {
    console.log("❌ Recipe not found!");
    return;
  }

  console.log("\nFixing ingredient references...");

  const updatedIngredients = recipe.ingredients.map((group: any) => ({
    ...group,
    items: group.items.map((item: any) => {
      // Fix salt in marinade (1 tsp in "For the Marinade")
      if (
        item.quantity === "1" &&
        item.unit === "tsp" &&
        !item.notes &&
        group.heading === "For the Marinade"
      ) {
        console.log("  Fixing Fine sea salt in marinade...");
        return {
          ...item,
          ingredientRef: {
            _type: "reference",
            _ref: salt._id,
          },
        };
      }

      // Fix plain flour (100 g in "For the Coating")
      if (
        item.quantity === "100" &&
        item.unit === "g" &&
        !item.notes &&
        group.heading === "For the Coating"
      ) {
        console.log("  Fixing Plain flour reference...");
        return {
          ...item,
          ingredientRef: {
            _type: "reference",
            _ref: flour._id,
          },
        };
      }

      // Fix paprika (1 tsp in "For the Coating")
      if (
        item.quantity === "1" &&
        item.unit === "tsp" &&
        !item.notes &&
        group.heading === "For the Coating" &&
        !item.ingredientRef?._ref
      ) {
        console.log("  Fixing Paprika reference...");
        return {
          ...item,
          ingredientRef: {
            _type: "reference",
            _ref: paprika._id,
          },
        };
      }

      // Fix salt in coating (1 tsp, last salt in "For the Coating")
      if (
        item.quantity === "1" &&
        item.unit === "tsp" &&
        !item.notes &&
        group.heading === "For the Coating" &&
        !item.ingredientRef?._ref
      ) {
        console.log("  Fixing Fine sea salt in coating...");
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
