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

async function checkRecipe() {
  console.log('🔍 Checking for published recipe in Sanity...\n');

  // Check by Sanity ID
  const byId = await client.fetch(
    `*[_id == $id][0]{ _id, title, slug, brand, createdBy }`,
    { id: 'czv5QnE4jWWmyJTFsYmcUd' }
  );

  console.log('📋 By Sanity ID (czv5QnE4jWWmyJTFsYmcUd):');
  if (byId) {
    console.log('✅ Recipe found!');
    console.log('Title:', byId.title);
    console.log('Slug:', byId.slug?.current);
    console.log('Brand:', byId.brand);
    console.log('Created By:', byId.createdBy);
  } else {
    console.log('❌ Not found by ID');
  }

  console.log('\n---\n');

  // Check by slug
  const bySlug = await client.fetch(
    `*[_type == "recipe" && slug.current == $slug][0]{ _id, title, slug, brand, createdBy }`,
    { slug: 'apple-and-spinach-chicken-rice-bowl' }
  );

  console.log('📋 By slug (apple-and-spinach-chicken-rice-bowl):');
  if (bySlug) {
    console.log('✅ Recipe found!');
    console.log('Title:', bySlug.title);
    console.log('Sanity ID:', bySlug._id);
    console.log('Brand:', bySlug.brand);
    console.log('Created By:', bySlug.createdBy);
  } else {
    console.log('❌ Not found by slug');
  }

  console.log('\n---\n');

  // Check all Bite Buddy Kitchen recipes
  const allBBK = await client.fetch(
    `*[_type == "recipe" && brand._ref == "bite-buddy-kitchen"]{ _id, title, slug, _createdAt } | order(_createdAt desc) [0...5]`
  );

  console.log('📋 Recent Bite Buddy Kitchen recipes:');
  if (allBBK && allBBK.length > 0) {
    console.log(`Found ${allBBK.length} recipe(s):\n`);
    allBBK.forEach((r: any) => {
      console.log('---');
      console.log('Title:', r.title);
      console.log('Slug:', r.slug?.current);
      console.log('ID:', r._id);
      console.log('Created:', r._createdAt);
    });
  } else {
    console.log('❌ No Bite Buddy Kitchen recipes found');
  }
}

checkRecipe();
