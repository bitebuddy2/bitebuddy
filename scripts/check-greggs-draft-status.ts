import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function checkDraftStatus() {
  try {
    const results = await client.fetch(`
      *[_id match "*greggs-vegan-sausage-roll*"]{
        _id,
        title,
        _updatedAt
      }
    `);

    console.log('Found Greggs Vegan Sausage Roll entries:');
    console.log(JSON.stringify(results, null, 2));

    const hasDraft = results.some((r: any) => r._id.startsWith('drafts.'));
    const hasPublished = results.some((r: any) => !r._id.startsWith('drafts.'));

    console.log('\n📊 Status:');
    console.log(`   Draft exists: ${hasDraft ? '✅' : '❌'}`);
    console.log(`   Published exists: ${hasPublished ? '✅' : '❌'}`);

  } catch (error) {
    console.error('Error:', error);
  }
}

checkDraftStatus();
