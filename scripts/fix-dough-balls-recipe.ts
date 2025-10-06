// scripts/fix-dough-balls-recipe.ts
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

async function fixRecipe() {
  console.log("Deleting corrupted versions...");

  // Delete both published and draft versions
  await client.delete("recipe-pizza-express-dough-balls-with-garlic-butter").catch(() => {});
  await client.delete("drafts.recipe-pizza-express-dough-balls-with-garlic-butter").catch(() => {});

  console.log("✅ Deleted old versions");
  console.log("\nNow run: npx tsx scripts/create-pizza-express-dough-balls.ts");
}

fixRecipe().catch(console.error);
