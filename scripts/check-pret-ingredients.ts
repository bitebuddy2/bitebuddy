// scripts/check-pret-ingredients.ts
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
  const recipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "pret-a-manger-chocolate-chunk-cookie"][0]{
      ...,
      ingredients[]{
        ...,
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

  console.log("Recipe ingredients:");
  recipe.ingredients.forEach((group: any, groupIndex: number) => {
    console.log(`\nGroup ${groupIndex + 1}:`);
    group.items.forEach((item: any, itemIndex: number) => {
      const refName = item.ingredientRef?.name || "MISSING";
      const refId = item.ingredientRef?._id || "NO ID";
      console.log(
        `  ${itemIndex + 1}. ${item.quantity} ${item.unit} - Ref: ${refName} (${refId})`
      );
    });
  });

  // Check for any broken references
  const brokenRefs = recipe.ingredients.flatMap((group: any) =>
    group.items.filter((item: any) => !item.ingredientRef)
  );

  if (brokenRefs.length > 0) {
    console.log("\n⚠️  Found broken ingredient references:");
    brokenRefs.forEach((item: any) => {
      console.log(`  - ${item.quantity} ${item.unit}`);
    });
  }
}

checkIngredients().catch(console.error);
