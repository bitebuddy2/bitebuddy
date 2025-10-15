// scripts/find-dollar-slug.ts
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

async function findDollarSlug() {
  console.log("🔍 Searching for documents with '$' in slug...\n");

  const docs = await client.fetch(
    `*[defined(slug) && slug.current match "*$*"]{_type, _id, title, "slug": slug.current}`
  );

  if (docs.length > 0) {
    console.log(`⚠️  Found ${docs.length} document(s) with '$' in slug:\n`);
    docs.forEach((doc: any) => {
      console.log(`Type: ${doc._type}`);
      console.log(`Title: ${doc.title || "(no title)"}`);
      console.log(`Slug: ${doc.slug}`);
      console.log(`ID: ${doc._id}\n`);
    });
  } else {
    console.log("✅ No documents found with '$' in slug.");
    console.log("\nThe '/$' URL might be from:");
    console.log("  1. An external bot/crawler");
    console.log("  2. A broken link somewhere on the site");
    console.log("  3. A URL parameter parsing issue");
  }
}

findDollarSlug().catch(console.error);
