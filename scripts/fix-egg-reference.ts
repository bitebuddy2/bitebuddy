// scripts/fix-egg-reference.ts
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

async function fixEggReference() {
  // Check if Egg ingredient exists
  const eggIngredient = await client.fetch(
    `*[_type == "ingredient" && name == "Egg"][0]`
  );

  let eggId: string;

  if (!eggIngredient) {
    console.log("Creating Egg ingredient...");
    const newEgg = await client.create({
      _type: "ingredient",
      name: "Egg",
      kcal100: 155,
      protein100: 13,
      fat100: 11,
      carbs100: 1.1,
      gramsPerPiece: 50,
      allergens: ["eggs"],
    });
    eggId = newEgg._id;
    console.log("✅ Created Egg ingredient:", eggId);
  } else {
    eggId = eggIngredient._id;
    console.log("✅ Found existing Egg ingredient:", eggId);
  }

  // Get the recipe
  const recipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "pret-a-manger-chocolate-chunk-cookie"][0]`
  );

  console.log("\nUpdating recipe with correct Egg reference...");

  // Find the broken egg reference in ingredients and fix it
  const updatedIngredients = recipe.ingredients.map((group: any) => ({
    ...group,
    items: group.items.map((item: any) => {
      // Check if this is the egg item (2 piece with missing or broken reference)
      if (item.quantity === "2" && item.unit === "piece" && item.notes === "large") {
        return {
          ...item,
          ingredientRef: {
            _type: "reference",
            _ref: eggId,
          },
        };
      }
      return item;
    }),
  }));

  await client.patch(recipe._id).set({ ingredients: updatedIngredients }).commit();

  console.log("✅ Recipe updated with correct Egg reference!");
}

fixEggReference().catch(console.error);
