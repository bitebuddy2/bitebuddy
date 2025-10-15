// scripts/check-404-recipes.ts
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

const slugsToCheck = [
  "spicy-chickpea-and-mushroom-stir-fry",
  "caprese-salad-with-pesto-and-pine-nuts",
  "pret-a-manger-falafel-mezze-salad",
];

async function checkRecipes() {
  console.log("🔍 Checking for 404ing recipes...\n");

  for (const slug of slugsToCheck) {
    const recipe = await client.fetch(
      `*[_type == "recipe" && slug.current == $slug][0]{_id, title, "slug": slug.current}`,
      { slug }
    );

    if (recipe) {
      console.log(`✅ Found: ${slug}`);
      console.log(`   Title: ${recipe.title}`);
      console.log(`   ID: ${recipe._id}\n`);
    } else {
      console.log(`❌ NOT FOUND: ${slug}\n`);
    }
  }

  // Also search for similar recipes
  console.log("\n🔎 Searching for similar recipes...\n");

  const similarRecipes = await client.fetch(
    `*[_type == "recipe" && (
      title match "*chickpea*" ||
      title match "*caprese*" ||
      title match "*falafel*" ||
      title match "*mezze*"
    )]{_id, title, "slug": slug.current}`
  );

  if (similarRecipes.length > 0) {
    console.log("Found similar recipes:");
    similarRecipes.forEach((r: any) => {
      console.log(`  - ${r.title} (/${r.slug})`);
    });
  } else {
    console.log("No similar recipes found.");
  }
}

checkRecipes().catch(console.error);
