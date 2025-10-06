// scripts/delete-duplicate-ingredients.ts
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

async function deleteDuplicates() {
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

  console.log(`Found ${duplicates.length} duplicate ingredient names\n`);

  for (const [name, ings] of duplicates as [string, any][]) {
    // Sort by creation date - keep the oldest
    const sorted = [...ings].sort(
      (a, b) =>
        new Date(a._createdAt).getTime() - new Date(b._createdAt).getTime()
    );
    const toKeep = sorted[0];
    const toDelete = sorted.slice(1);

    console.log(`\n"${name}":`);
    console.log(`  ✅ KEEPING: ${toKeep._id} (${new Date(toKeep._createdAt).toLocaleString()})`);

    for (const ing of toDelete) {
      console.log(`  ❌ DELETING: ${ing._id} (${new Date(ing._createdAt).toLocaleString()})`);

      // Check if this ingredient is referenced in any recipes
      const references = await client.fetch(
        `*[_type == "recipe" && references($id)]{_id, title}`,
        { id: ing._id }
      );

      if (references.length > 0) {
        console.log(`     ⚠️  WARNING: This ingredient is used in ${references.length} recipe(s):`);
        references.forEach((r: any) => console.log(`       - ${r.title}`));
        console.log(`     Skipping deletion. You'll need to update these recipes manually.`);
        continue;
      }

      // Safe to delete
      await client.delete(ing._id);
      console.log(`     ✓ Deleted`);
    }
  }

  console.log("\n✅ Done cleaning up duplicates!");
}

deleteDuplicates().catch(console.error);
