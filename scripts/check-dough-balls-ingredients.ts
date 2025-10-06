// scripts/check-dough-balls-ingredients.ts
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

async function checkIngredients() {
  // Check both draft and published
  const draft = await client.fetch(
    `*[_id == "drafts.recipe-pizza-express-dough-balls-with-garlic-butter"][0]{
      ...,
      ingredients[]{
        ...,
        heading,
        items[]{
          ...,
          ingredientRef->{
            _id,
            name
          }
        }
      }
    }`
  );

  const published = await client.fetch(
    `*[_id == "recipe-pizza-express-dough-balls-with-garlic-butter"][0]{
      ...,
      ingredients[]{
        ...,
        heading,
        items[]{
          ...,
          ingredientRef->{
            _id,
            name
          }
        }
      }
    }`
  );

  const recipe = draft || published;

  if (!recipe) {
    console.log("❌ Recipe not found in draft or published!");
    return;
  }

  console.log(`Checking ${draft ? "DRAFT" : "PUBLISHED"} version\n`);

  console.log("Recipe ingredients:");
  recipe.ingredients.forEach((group: any, groupIndex: number) => {
    console.log(`\nGroup ${groupIndex + 1}: ${group.heading || "No heading"}`);
    group.items.forEach((item: any, itemIndex: number) => {
      const refName = item.ingredientRef?.name || "MISSING";
      const refId = item.ingredientRef?._id || "NO ID";
      console.log(
        `  ${itemIndex + 1}. ${item.quantity} ${item.unit} - Ref: ${refName} (${refId})`
      );
      if (item.notes) {
        console.log(`      Notes: ${item.notes}`);
      }
    });
  });

  // Check for any broken references
  const brokenRefs = recipe.ingredients.flatMap((group: any) =>
    group.items.filter((item: any) => !item.ingredientRef || !item.ingredientRef.name)
  );

  if (brokenRefs.length > 0) {
    console.log("\n⚠️  Found broken ingredient references:");
    brokenRefs.forEach((item: any) => {
      console.log(`  - ${item.quantity} ${item.unit} ${item.notes || ""}`);
    });
  }
}

checkIngredients().catch(console.error);
