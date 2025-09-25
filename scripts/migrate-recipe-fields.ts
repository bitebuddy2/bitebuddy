// scripts/migrate-recipe-fields.ts
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_WRITE_TOKEN!;
const apiVersion = "2023-01-01";

if (!projectId || !dataset) {
  throw new Error("Missing NEXT_PUBLIC_SANITY_PROJECT_ID or NEXT_PUBLIC_SANITY_DATASET");
}
if (!token) {
  throw new Error("Missing SANITY_WRITE_TOKEN (Editor/Write token) in .env.local");
}

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false });

async function run() {
  // Find recipes that still use any legacy fields
  const docs: any[] = await client.fetch(`
    *[_type == "recipe" && (defined(prepTime) || defined(cookTime) || defined(instructions))]{
      _id, title, prepTime, cookTime, instructions
    }
  `);

  console.log(`Found ${docs.length} recipe(s) to migrate`);
  for (const d of docs) {
    const steps =
      Array.isArray(d.instructions)
        ? d.instructions.map((block: any) => ({
            _type: "object",
            step: [block], // wrap old block into the new {step: PortableText[]} shape
          }))
        : undefined;

    const set: Record<string, any> = {};
    if (typeof d.prepTime === "number") set.prepMin = d.prepTime;
    if (typeof d.cookTime === "number") set.cookMin = d.cookTime;
    if (steps && steps.length) set.steps = steps;

    await client
      .patch(d._id)
      .set(set)
      .unset(["prepTime", "cookTime", "instructions"])
      .commit();

    console.log(`✅ Migrated: ${d.title} (${d._id})`);
  }

  console.log("Done.");
}

run().catch((e) => {
  console.error("Migration failed:", e.message || e);
  process.exit(1);
});
