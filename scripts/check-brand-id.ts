import { createClient } from '@sanity/client';
import { config } from 'dotenv';

config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: '2025-09-24',
  useCdn: false,
  token: process.env.SANITY_WRITE_TOKEN,
});

async function checkBrands() {
  console.log('🔍 Checking brand IDs...\n');

  // Check the brand that was assigned
  const assignedBrand = await client.fetch(
    `*[_type == "brand" && _id == $id][0]{ _id, title, slug }`,
    { id: 'f74f9ecf-fbac-4d0e-8b31-00916ba5bf56' }
  );

  console.log('📋 Assigned brand (f74f9ecf-fbac-4d0e-8b31-00916ba5bf56):');
  if (assignedBrand) {
    console.log('Title:', assignedBrand.title);
    console.log('Slug:', assignedBrand.slug?.current);
  } else {
    console.log('❌ Brand not found');
  }

  console.log('\n---\n');

  // Check Bite Buddy Kitchen
  const biteBuddyKitchen = await client.fetch(
    `*[_type == "brand" && slug.current == "bite-buddy-kitchen"][0]{ _id, title, slug }`
  );

  console.log('📋 Bite Buddy Kitchen brand:');
  if (biteBuddyKitchen) {
    console.log('ID:', biteBuddyKitchen._id);
    console.log('Title:', biteBuddyKitchen.title);
    console.log('Slug:', biteBuddyKitchen.slug?.current);
  } else {
    console.log('❌ Bite Buddy Kitchen brand not found!');
  }

  console.log('\n---\n');

  // List all brands
  const allBrands = await client.fetch(
    `*[_type == "brand"]{ _id, title, slug } | order(title asc)`
  );

  console.log('📋 All brands:');
  allBrands.forEach((b: any) => {
    console.log(`- ${b.title} (${b.slug?.current}) - ID: ${b._id}`);
  });
}

checkBrands();
