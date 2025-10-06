// scripts/fix-mayo-and-delete-duplicate.ts
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

async function fixAndDelete() {
  const oldId = "MzvZsF5fYfr166NK0hikNb";
  const newId = "ingredient.mayonnaise";

  console.log("Finding recipes that use the duplicate mayonnaise...");

  // Get all recipes that reference the old mayo
  const recipes = await client.fetch(
    `*[_type == "recipe" && references($id)]`,
    { id: oldId }
  );

  console.log(`Found ${recipes.length} recipe(s) to update\n`);

  for (const recipe of recipes) {
    console.log(`Updating: ${recipe.title}`);

    // Update all ingredient references
    const updatedIngredients = recipe.ingredients.map((group: any) => ({
      ...group,
      items: group.items.map((item: any) => {
        if (item.ingredientRef?._ref === oldId) {
          return {
            ...item,
            ingredientRef: {
              ...item.ingredientRef,
              _ref: newId,
            },
          };
        }
        return item;
      }),
    }));

    await client.patch(recipe._id).set({ ingredients: updatedIngredients }).commit();
    console.log(`  ✓ Updated`);
  }

  console.log(`\nDeleting duplicate ingredient: ${oldId}`);
  await client.delete(oldId);
  console.log("✓ Deleted");

  console.log("\n✅ All done! Duplicate cleaned up.");
}

fixAndDelete().catch(console.error);
