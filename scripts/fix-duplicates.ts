// scripts/fix-duplicates.ts
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_WRITE_TOKEN!;
const apiVersion = "2023-01-01";

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false });

async function fixDuplicates() {
  console.log("🔍 Looking for duplicate recipes...\n");

  // Find recipes grouped by slug
  const recipes = await client.fetch(`
    *[_type == "recipe"]{
      _id,
      title,
      "slug": slug.current,
      _createdAt,
      _updatedAt
    } | order(slug asc, _createdAt asc)
  `);

  console.log(`Found ${recipes.length} total recipes`);

  // Group by slug
  const bySlug = new Map();
  recipes.forEach((recipe: any) => {
    if (!bySlug.has(recipe.slug)) {
      bySlug.set(recipe.slug, []);
    }
    bySlug.get(recipe.slug).push(recipe);
  });

  console.log(`Found ${bySlug.size} unique slugs\n`);

  // Check for duplicates
  const duplicates = [];
  for (const [slug, recipeList] of bySlug.entries()) {
    if (recipeList.length > 1) {
      duplicates.push({ slug, recipes: recipeList });
    }
  }

  if (duplicates.length === 0) {
    console.log("✅ No duplicate slugs found!");
    return;
  }

  console.log(`🔴 Found ${duplicates.length} duplicate slug(s):`);

  for (const dup of duplicates) {
    console.log(`\n📄 Slug: ${dup.slug}`);
    console.log(`   Found ${dup.recipes.length} recipes:`);

    dup.recipes.forEach((recipe: any, i: number) => {
      console.log(`   ${i + 1}. ${recipe.title} (${recipe._id})`);
      console.log(`      Created: ${recipe._createdAt}`);
      console.log(`      Updated: ${recipe._updatedAt}`);
    });

    // Keep the most recent one, mark others for deletion
    const sorted = dup.recipes.sort((a: any, b: any) =>
      new Date(b._updatedAt).getTime() - new Date(a._updatedAt).getTime()
    );

    const keepRecipe = sorted[0];
    const deleteRecipes = sorted.slice(1);

    console.log(`   ✅ Will keep: ${keepRecipe.title} (${keepRecipe._id}) - most recent`);
    console.log(`   🗑️  Will delete: ${deleteRecipes.map((r: any) => r._id).join(", ")}`);

    // Confirm before deleting
    console.log(`\n⚠️  About to delete ${deleteRecipes.length} duplicate recipe(s) for slug "${dup.slug}"`);

    for (const recipe of deleteRecipes) {
      try {
        await client.delete(recipe._id);
        console.log(`   ✅ Deleted: ${recipe.title} (${recipe._id})`);
      } catch (error) {
        console.log(`   ❌ Failed to delete ${recipe._id}: ${error}`);
      }
    }
  }

  console.log("\n✅ Duplicate cleanup completed!");
}

fixDuplicates().catch((e) => {
  console.error("Fix duplicates failed:", e.message || e);
  process.exit(1);
});