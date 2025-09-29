// scripts/publish-draft.ts
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_WRITE_TOKEN!;
const apiVersion = "2023-01-01";

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false });

async function publishDraft() {
  console.log("🔍 Looking for draft recipes...\n");

  // Find all draft documents
  const drafts = await client.fetch(`*[_id in path("drafts.**") && _type == "recipe"]{_id, title, "slug": slug.current}`);

  console.log(`Found ${drafts.length} draft recipe(s):`);
  drafts.forEach((draft: any, i: number) => {
    console.log(`  ${i + 1}. ${draft.title} (${draft._id})`);
  });

  if (drafts.length === 0) {
    console.log("No drafts found to publish.");
    return;
  }

  console.log("\n📤 Publishing drafts...");

  for (const draft of drafts) {
    try {
      // Get the full draft document
      const fullDraft = await client.getDocument(draft._id);
      const publishId = draft._id.replace('drafts.', '');

      // Create published version
      await client.createOrReplace({
        ...fullDraft,
        _id: publishId,
      });

      // Delete the draft
      await client.delete(draft._id);

      console.log(`✅ Published: ${draft.title} (${publishId})`);
    } catch (error) {
      console.log(`❌ Failed to publish ${draft.title}: ${error}`);
    }
  }

  console.log("\n✅ Draft publishing completed!");
}

publishDraft().catch((e) => {
  console.error("Publish draft failed:", e.message || e);
  process.exit(1);
});