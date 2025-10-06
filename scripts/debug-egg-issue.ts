// scripts/debug-egg-issue.ts
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

async function debug() {
  const recipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "pret-a-manger-chocolate-chunk-cookie"][0]`
  );

  console.log("Egg ingredient item structure:");
  const eggItem = recipe.ingredients[0].items.find((item: any) => item.quantity === "2" && item.unit === "piece");
  console.log(JSON.stringify(eggItem, null, 2));

  // Check egg ingredient
  const eggIngredient = await client.fetch(
    `*[_type == "ingredient" && name == "Egg"][0]`
  );
  console.log("\nEgg ingredient:");
  console.log(JSON.stringify(eggIngredient, null, 2));
}

debug().catch(console.error);
