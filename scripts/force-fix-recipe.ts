// scripts/force-fix-recipe.ts
import { config as loadEnv } from "dotenv";
loadEnv({ path: ".env.local" });

import { createClient } from "@sanity/client";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;
const token = process.env.SANITY_WRITE_TOKEN!;
const apiVersion = "2023-01-01";

const client = createClient({ projectId, dataset, token, apiVersion, useCdn: false });

async function forceFixRecipe() {
  const slug = "greggs-sausage-roll-homemade-copycat";

  console.log(`🔧 Force fixing recipe with slug: ${slug}`);

  // First, let's see ALL documents with this slug (including drafts, published, etc.)
  const allDocs = await client.fetch(`*[slug.current == $slug]{
    _id,
    _type,
    title,
    "isPublished": !(_id in path("drafts.**")),
    ingredients
  }`, { slug });

  console.log(`Found ${allDocs.length} document(s) with this slug:`);
  allDocs.forEach((doc: any, i: number) => {
    console.log(`  ${i + 1}. ${doc._id} (${doc._type}) - Published: ${doc.isPublished} - Title: ${doc.title}`);
    console.log(`     Ingredients: ${doc.ingredients ? `${doc.ingredients.length} groups` : 'null'}`);
  });

  // Find the published recipe document specifically
  const publishedRecipe = allDocs.find((doc: any) => doc.isPublished && doc._type === 'recipe');

  if (!publishedRecipe) {
    console.log("❌ No published recipe found!");
    return;
  }

  console.log(`\n✅ Found published recipe: ${publishedRecipe._id}`);

  // Get the ingredient IDs we need
  const saltId = "ingredient.fine-sea-salt";
  const sausageId = "ingredient.sausage-meat";

  // Verify these ingredients exist
  const ingredients = await client.fetch(`*[_id in [$saltId, $sausageId]]{_id, name}`, { saltId, sausageId });
  console.log(`Found ${ingredients.length} ingredient documents:`, ingredients.map((i: any) => `${i.name} (${i._id})`));

  if (ingredients.length !== 2) {
    console.log("❌ Missing required ingredient documents!");
    return;
  }

  // Create the correct ingredients structure
  const correctIngredients = [
    {
      _type: "ingredientGroup",
      _key: "main-ingredients",
      heading: null,
      items: [
        {
          _type: "ingredientItem",
          _key: "salt",
          quantity: "1",
          unit: "tsp",
          notes: null,
          ingredientText: null,
          ingredientRef: {
            _type: "reference",
            _ref: saltId
          }
        },
        {
          _type: "ingredientItem",
          _key: "sausage",
          quantity: "500",
          unit: "g",
          notes: null,
          ingredientText: null,
          ingredientRef: {
            _type: "reference",
            _ref: sausageId
          }
        }
      ]
    }
  ];

  console.log(`\n🔄 Updating recipe ${publishedRecipe._id} with correct ingredients...`);

  try {
    // Update the published recipe
    const result = await client
      .patch(publishedRecipe._id)
      .set({ ingredients: correctIngredients })
      .commit();

    console.log("✅ Recipe updated successfully!");
    console.log("Updated document ID:", result._id);

    // Verify the update
    console.log("\n🔍 Verifying the update...");
    const verifyQuery = `*[_type == "recipe" && slug.current == $slug][0]{
      _id,
      title,
      ingredients[]{
        heading,
        items[]{
          quantity,
          unit,
          ingredientText,
          ingredientRef->{_id, name}
        }
      }
    }`;

    const updatedRecipe = await client.fetch(verifyQuery, { slug });

    if (updatedRecipe) {
      console.log("✅ Verification successful!");
      console.log("Recipe:", updatedRecipe.title);
      console.log("Ingredients:", JSON.stringify(updatedRecipe.ingredients, null, 2));
    } else {
      console.log("❌ Verification failed - no recipe found");
    }

  } catch (error) {
    console.error("❌ Update failed:", error);
  }
}

forceFixRecipe().catch((e) => {
  console.error("Script failed:", e.message || e);
  process.exit(1);
});