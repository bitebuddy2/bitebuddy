// scripts/convert-american-hot-to-draft.ts
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

async function convertToDraft() {
  const recipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "pizza-express-american-hot"][0]`
  );

  if (!recipe) {
    console.log("❌ Pizza Express American Hot recipe not found!");
    return;
  }

  console.log("✅ Found recipe:", recipe.title);
  console.log("   ID:", recipe._id);

  // Check if it's already a draft
  if (recipe._id.startsWith("drafts.")) {
    console.log("📝 Recipe is already a draft!");
    return;
  }

  // Create as draft
  const draftData = {
    ...recipe,
    _id: `drafts.${recipe._id}`,
  };

  delete draftData._rev; // Remove revision to avoid conflicts

  await client.createOrReplace(draftData);

  console.log("\n✅ Recipe converted to DRAFT:", draftData._id);
  console.log("\nNext steps:");
  console.log("1. Open Sanity Studio");
  console.log("2. Edit the draft to add hero image and any other details");
  console.log("3. Click 'Publish' when ready to make it live");
  console.log("\nNote: The original published version still exists.");
  console.log("You can delete it in Sanity Studio if you want only the draft.");
}

convertToDraft().catch(console.error);
