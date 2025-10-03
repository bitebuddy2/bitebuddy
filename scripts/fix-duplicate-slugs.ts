import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function main() {
  // Fetch all recipes
  const recipes = await client.fetch('*[_type == "recipe"]{ _id, title, slug }');
  console.log(`Found ${recipes.length} recipes`);

  // Find duplicates
  const slugMap = new Map();
  recipes.forEach((recipe: any) => {
    const slug = recipe.slug?.current;
    if (slug) {
      if (!slugMap.has(slug)) {
        slugMap.set(slug, []);
      }
      slugMap.get(slug).push(recipe);
    }
  });

  // Delete all but the first one with each slug
  for (const [slug, recipeList] of slugMap.entries()) {
    if (recipeList.length > 1) {
      console.log(`\nFound ${recipeList.length} recipes with slug "${slug}":`);
      recipeList.forEach((r: any, i: number) => {
        console.log(`  ${i + 1}. ${r.title} (${r._id})`);
      });

      // Keep the first one, delete the rest
      for (let i = 1; i < recipeList.length; i++) {
        console.log(`  ✗ Deleting duplicate: ${recipeList[i].title}`);
        await client.delete(recipeList[i]._id);
      }
    }
  }

  console.log('\n✓ Done removing duplicates');
}

main();
