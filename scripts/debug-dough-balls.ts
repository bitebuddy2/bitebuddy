// scripts/debug-dough-balls.ts
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

async function debug() {
  const published = await client.fetch(
    `*[_id == "recipe-pizza-express-dough-balls-with-garlic-butter"][0]`
  );

  console.log("Published recipe structure:");
  console.log(JSON.stringify(published, null, 2));
}

debug().catch(console.error);
