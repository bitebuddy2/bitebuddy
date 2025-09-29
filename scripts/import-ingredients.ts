// scripts/import-ingredients.ts
import { createClient } from "@sanity/client";
import dotenv from "dotenv";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-10-01",
  token: process.env.SANITY_WRITE_TOKEN!, // make sure this is set
  useCdn: false,
});

const ingredients = [
  {
    name: "Sausage meat",
    calories: 310,
    protein: 15,
    carbs: 2,
    fat: 28,
  },
  {
    name: "Puff pastry",
    calories: 558,
    protein: 6.9,
    carbs: 45,
    fat: 38,
  },
  {
    name: "Breadcrumbs",
    calories: 351,
    protein: 13,
    carbs: 71,
    fat: 5,
  },
  {
    name: "Onion",
    calories: 40,
    protein: 1.1,
    carbs: 9.3,
    fat: 0.1,
  },
  {
    name: "Garlic",
    calories: 149,
    protein: 6.4,
    carbs: 33,
    fat: 0.5,
  },
  {
    name: "Sage",
    calories: 315,
    protein: 11,
    carbs: 60,
    fat: 13,
  },
  {
    name: "Thyme",
    calories: 101,
    protein: 5.6,
    carbs: 24,
    fat: 1.7,
  },
  {
    name: "Black pepper",
    calories: 251,
    protein: 10,
    carbs: 64,
    fat: 3.3,
  },
  {
    name: "Fine sea salt",
    calories: 0,
    protein: 0,
    carbs: 0,
    fat: 0,
  },
  {
    name: "Egg",
    calories: 155,
    protein: 13,
    carbs: 1.1,
    fat: 11,
  },
  {
    name: "Milk",
    calories: 42,
    protein: 3.4,
    carbs: 5,
    fat: 1,
  },
];


async function run() {
  for (const ing of ingredients) {
    const existing = await client.fetch(
      `*[_type == "ingredient" && name == $name][0]`,
      { name: ing.name }
    );

    if (existing) {
      console.log(`✅ Found existing ingredient: ${ing.name}`);
      // patch missing nutrition fields
      await client
        .patch(existing._id)
        .setIfMissing({
          calories: ing.calories,
          protein: ing.protein,
          carbs: ing.carbs,
          fat: ing.fat,
        })
        .commit();
    } else {
      console.log(`➕ Creating new ingredient: ${ing.name}`);
      await client.create({
        _type: "ingredient",
        ...ing,
      });
    }
  }
  console.log("Done ✅");
}

run().catch(console.error);
