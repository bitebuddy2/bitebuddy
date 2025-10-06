// scripts/list-all-drafts.ts
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

async function listDrafts() {
  const drafts = await client.fetch(
    `*[_id match "drafts.*" && _type == "recipe"]{_id, title} | order(_id)`
  );

  console.log("All draft recipes:");
  console.log(JSON.stringify(drafts, null, 2));
}

listDrafts().catch(console.error);
