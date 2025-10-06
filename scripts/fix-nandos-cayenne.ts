// scripts/fix-nandos-cayenne.ts
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

async function fixCayenne() {
  console.log("Checking for cayenne pepper ingredient...");

  // Check if cayenne pepper exists (not red bell pepper)
  const cayenne = await client.fetch(
    `*[_type == "ingredient" && name == "Cayenne pepper"][0]`
  );

  let cayenneId: string;

  if (!cayenne) {
    console.log("Creating Cayenne pepper ingredient...");
    const doc = await client.create({
      _type: "ingredient",
      name: "Cayenne pepper",
      synonyms: ["ground cayenne"],
      kcal100: 318,
      protein100: 12,
      fat100: 17,
      carbs100: 57,
      allergens: [],
    });
    cayenneId = doc._id;
    console.log("✅ Created Cayenne pepper:", cayenneId);
  } else {
    cayenneId = cayenne._id;
    console.log("✅ Found existing Cayenne pepper:", cayenneId);
  }

  // Get the recipe and check if cayenne is correctly referenced
  const recipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "nandos-spicy-rice"][0]`
  );

  if (!recipe) {
    console.log("❌ Recipe not found!");
    return;
  }

  console.log("\nChecking recipe ingredients for cayenne reference...");

  // Find the cayenne item and check if it's pointing to the wrong ingredient
  const updatedIngredients = recipe.ingredients.map((group: any) => ({
    ...group,
    items: group.items.map((item: any) => {
      // Check if this is the cayenne item (0.5 tsp)
      if (
        item.quantity === "0.5" &&
        item.unit === "tsp" &&
        item.notes === "adjust to taste"
      ) {
        console.log("Found cayenne item, updating reference...");
        return {
          ...item,
          ingredientRef: {
            _type: "reference",
            _ref: cayenneId,
          },
        };
      }
      return item;
    }),
  }));

  await client.patch(recipe._id).set({ ingredients: updatedIngredients }).commit();

  console.log("✅ Recipe updated with correct cayenne pepper reference!");
}

fixCayenne().catch(console.error);
