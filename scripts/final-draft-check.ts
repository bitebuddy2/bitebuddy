import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false, // Important: disable CDN for immediate results
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function checkDraft() {
  try {
    console.log('Checking for Greggs Vegan Sausage Roll draft...\n');

    // Direct check by ID
    const draftById = await client.getDocument('drafts.recipe-greggs-vegan-sausage-roll');

    if (draftById) {
      console.log('✅ Draft found by direct ID lookup:');
      console.log('   ID:', draftById._id);
      console.log('   Title:', draftById.title);
      console.log('   Updated:', draftById._updatedAt);
      console.log('\n🎉 SUCCESS! The recipe is now a draft in Sanity Studio.');
    } else {
      console.log('❌ Draft not found');
    }

  } catch (error: any) {
    if (error.statusCode === 404) {
      console.log('❌ Draft does not exist (404 error)');
    } else {
      console.error('Error:', error.message);
    }
  }
}

checkDraft();
