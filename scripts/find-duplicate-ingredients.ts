// scripts/find-duplicate-ingredients.ts
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

async function findDuplicates() {
  // Get all ingredients
  const allIngredients = await client.fetch(
    `*[_type == "ingredient"] | order(name asc) {_id, name, _createdAt}`
  );

  // Group by name
  const grouped = allIngredients.reduce((acc: any, ing: any) => {
    if (!acc[ing.name]) {
      acc[ing.name] = [];
    }
    acc[ing.name].push(ing);
    return acc;
  }, {});

  // Find duplicates
  const duplicates = Object.entries(grouped).filter(
    ([_, ings]: [string, any]) => ings.length > 1
  );

  if (duplicates.length === 0) {
    console.log("✅ No duplicates found!");
    return;
  }

  console.log(`⚠️  Found ${duplicates.length} duplicate ingredient names:\n`);

  for (const [name, ings] of duplicates as [string, any][]) {
    console.log(`\n"${name}" - ${ings.length} versions:`);
    ings.forEach((ing: any) => {
      const created = new Date(ing._createdAt).toLocaleString();
      console.log(`  - ${ing._id} (created: ${created})`);
    });
  }

  console.log("\n\nTo delete duplicates, I can create a script that keeps the oldest version");
  console.log("and deletes the newer ones. Should I create that script?");
}

findDuplicates().catch(console.error);
