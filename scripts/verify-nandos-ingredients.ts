// scripts/verify-nandos-ingredients.ts
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

async function verifyIngredients() {
  const recipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "nandos-spicy-rice"][0]{
      title,
      ingredients[]{
        heading,
        items[]{
          quantity,
          unit,
          notes,
          ingredientRef->{
            _id,
            name
          }
        }
      }
    }`
  );

  if (!recipe) {
    console.log("❌ Recipe not found!");
    return;
  }

  console.log("Nando's Spicy Rice Bowl - Ingredient Verification\n");

  recipe.ingredients.forEach((group: any, groupIndex: number) => {
    if (group.heading) {
      console.log(`\n${group.heading}:`);
    }
    group.items.forEach((item: any, itemIndex: number) => {
      const refName = item.ingredientRef?.name || "❌ MISSING";
      const amount = [item.quantity, item.unit].filter(Boolean).join(" ");
      const notes = item.notes ? ` (${item.notes})` : "";
      console.log(`  ${itemIndex + 1}. ${amount} ${refName}${notes}`);
    });
  });

  // Check for broken references
  const allItems = recipe.ingredients.flatMap((g: any) => g.items);
  const broken = allItems.filter((i: any) => !i.ingredientRef || !i.ingredientRef.name);

  if (broken.length > 0) {
    console.log(`\n⚠️  Found ${broken.length} broken ingredient reference(s)!`);
  } else {
    console.log("\n✅ All ingredients properly linked!");
  }
}

verifyIngredients().catch(console.error);
