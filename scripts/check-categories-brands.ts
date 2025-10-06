// scripts/check-categories-brands.ts
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

async function checkCategoriesAndBrands() {
  console.log("Fetching categories...\n");
  const categories = await client.fetch('*[_type == "category"]{ _id, title, slug }');
  console.log("Categories:", JSON.stringify(categories, null, 2));

  console.log("\n\nFetching brands...\n");
  const brands = await client.fetch('*[_type == "brand"]{ _id, name, slug }');
  console.log("Brands:", JSON.stringify(brands, null, 2));
}

checkCategoriesAndBrands().catch(console.error);
