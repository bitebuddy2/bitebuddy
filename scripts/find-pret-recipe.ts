// scripts/find-pret-recipe.ts
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

async function findRecipe() {
  // Search for any recipe with "pret" or "chocolate chunk cookie" in title
  const recipes = await client.fetch(
    `*[_type == "recipe" && (title match "*pret*" || title match "*chocolate chunk*")]{_id, title, slug}`
  );

  console.log("Found recipes matching search:");
  console.log(JSON.stringify(recipes, null, 2));

  // Also check all recipes to see if it exists with a different slug
  const allRecipes = await client.fetch(
    `*[_type == "recipe"]{_id, title, slug} | order(title asc)`
  );

  console.log(`\nTotal recipes in database: ${allRecipes.length}`);
  console.log("\nAll recipes:");
  allRecipes.forEach((r: any) => {
    console.log(`  ${r._id} - ${r.title}`);
  });
}

findRecipe().catch(console.error);
