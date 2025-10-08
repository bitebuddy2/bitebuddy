// scripts/convert-yo-sushi-to-drafts.ts
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

async function convertToDrafts() {
  console.log("Converting Yo! Sushi recipes to drafts...\n");

  const recipes = await client.fetch(
    `*[_type == "recipe" && slug.current match "yo-sushi-*"]{ _id, title, slug }`
  );

  console.log(`Found ${recipes.length} Yo! Sushi recipes\n`);

  for (const recipe of recipes) {
    console.log(`Processing: ${recipe.title}`);

    // Check if draft already exists
    const draftId = `drafts.${recipe._id}`;
    const existingDraft = await client.fetch(
      `*[_id == $draftId][0]`,
      { draftId }
    );

    if (existingDraft) {
      console.log(`  ⚠️  Draft already exists for ${recipe.title}`);
      continue;
    }

    // Get the full document
    const fullDoc = await client.fetch(`*[_id == $id][0]`, { id: recipe._id });

    // Create draft version
    const draftDoc = {
      ...fullDoc,
      _id: draftId,
    };

    await client.create(draftDoc);
    console.log(`  ✅ Created draft: ${draftId}`);

    // Delete the published version
    await client.delete(recipe._id);
    console.log(`  ✅ Deleted published version: ${recipe._id}`);
  }

  console.log("\n🎉 All Yo! Sushi recipes converted to drafts!");
}

convertToDrafts().catch(console.error);
