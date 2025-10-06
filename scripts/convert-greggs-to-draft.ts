import { createClient } from '@sanity/client';
import { randomUUID } from 'crypto';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function convertToDraft() {
  try {
    // Get the published recipe
    const publishedRecipe = await client.fetch(`
      *[_id == "recipe-greggs-vegan-sausage-roll"][0]
    `);

    if (!publishedRecipe) {
      console.log('❌ Recipe not found');
      return;
    }

    console.log('📄 Found published recipe:', publishedRecipe._id);

    // Create a draft version with the same _id but with drafts. prefix
    const draftId = `drafts.${publishedRecipe._id}`;

    // Remove Sanity internal fields
    const { _id, _rev, _createdAt, _updatedAt, ...recipeData } = publishedRecipe;

    console.log('📝 Creating draft with ID:', draftId);

    const draft = await client.createOrReplace({
      ...recipeData,
      _id: draftId,
    });

    console.log('✅ Draft created successfully:', draft._id);

    // Verify it exists
    const verify = await client.fetch(`*[_id == $id][0]`, { id: draftId });
    console.log('🔍 Verification:', verify ? 'Draft exists in Sanity' : 'Draft NOT found');

  } catch (error) {
    console.error('Error:', error);
  }
}

convertToDraft();
