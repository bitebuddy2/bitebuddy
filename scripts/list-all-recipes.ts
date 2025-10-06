// scripts/list-all-recipes.ts
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

async function listRecipes() {
  const recipes = await client.fetch(
    `*[_type == "recipe" && title match "*Pizza Express*" && title match "*Dough*"]{_id, title}`
  );

  console.log("Pizza Express Dough Balls recipes:");
  console.log(JSON.stringify(recipes, null, 2));
}

listRecipes().catch(console.error);
