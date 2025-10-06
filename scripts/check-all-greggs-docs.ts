import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function checkAllDocs() {
  try {
    // Check both drafts and published
    const results = await client.fetch(`
      *[_id match "*greggs*" || slug.current match "*greggs*"]{
        _id,
        _type,
        title,
        "isDraft": _id in path("drafts.**"),
        _updatedAt
      } | order(_updatedAt desc)
    `);

    console.log('All Greggs-related documents:');
    console.log(JSON.stringify(results, null, 2));

  } catch (error) {
    console.error('Error:', error);
  }
}

checkAllDocs();
