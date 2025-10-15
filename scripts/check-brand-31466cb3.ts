// scripts/check-brand-31466cb3.ts
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

async function checkBrand() {
  const brandId = "31466cb3-1a57-4c90-b57a-633d209604e2";

  console.log("🔍 Checking brand...\n");

  // Get brand info
  const brand = await client.fetch(
    `*[_type == "brand" && _id == $id][0]{_id, title, "slug": slug.current}`,
    { id: brandId }
  );

  if (brand) {
    console.log("✅ Brand found:");
    console.log(`   Title: ${brand.title}`);
    console.log(`   Slug: ${brand.slug}`);
    console.log(`   ID: ${brand._id}\n`);

    // Check for recipes
    const recipes = await client.fetch(
      `*[_type == "recipe" && brand._ref == $brandId]{_id, title, "slug": slug.current}`,
      { brandId }
    );

    console.log(`📊 Recipe count: ${recipes.length}\n`);

    if (recipes.length > 0) {
      console.log("Recipes for this brand:");
      recipes.forEach((r: any) => {
        console.log(`  - ${r.title} (/recipes/${r.slug})`);
      });
    } else {
      console.log("⚠️  No recipes found for this brand!");
      console.log("\nSuggestion: Either:");
      console.log("  1. Create recipes for this brand");
      console.log("  2. Don't show this brand in the filter dropdown if it has 0 recipes");
      console.log(`  3. Redirect /recipes?brand=${brandId} to /recipes`);
    }
  } else {
    console.log("❌ Brand not found!");
  }
}

checkBrand().catch(console.error);
