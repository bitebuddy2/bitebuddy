// scripts/publish-pret-cookie.ts
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

async function publishRecipe() {
  // Check for both draft and published versions
  const draft = await client.fetch(
    `*[_id == "drafts.recipe-pret-a-manger-chocolate-chunk-cookie"][0]`
  );

  const published = await client.fetch(
    `*[_id == "recipe-pret-a-manger-chocolate-chunk-cookie"][0]`
  );

  console.log("Draft version:", draft ? "EXISTS" : "NOT FOUND");
  console.log("Published version:", published ? "EXISTS" : "NOT FOUND");

  if (draft) {
    console.log("\n📝 Found draft version. Publishing...");

    // To publish a draft, we need to create/update the published document
    const publishedDoc = {
      ...draft,
      _id: draft._id.replace("drafts.", ""),
    };

    delete publishedDoc._rev; // Remove the revision to avoid conflicts

    await client.createOrReplace(publishedDoc);

    console.log("✅ Recipe published successfully!");
    console.log("\nYou can now:");
    console.log("1. View it in Sanity Studio");
    console.log("2. Delete the draft if you want (or keep working on it)");
    console.log("\nNote: The draft will still exist. You can delete it manually in Sanity Studio or keep it for further edits.");
  } else if (published) {
    console.log("\n✅ Recipe is already published!");
    console.log("You can edit it in Sanity Studio and it will auto-save as a draft.");
  } else {
    console.log("\n❌ Recipe not found in either draft or published state.");
    console.log("You may need to recreate it using the create-pret-cookie.ts script.");
  }
}

publishRecipe().catch(console.error);
