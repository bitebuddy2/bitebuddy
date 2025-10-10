import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false
});

async function checkURLIssues() {
  const recipes = await client.fetch<Array<{ _id: string; title: string; slug: string }>>(
    '*[_type == "recipe"]{ _id, title, "slug": slug.current }'
  );

  console.log('Total recipes:', recipes.length);

  // Check for recipes without slugs
  const recipesWithoutSlug = recipes.filter(r => !r.slug);
  console.log('\n❌ Recipes without slug:', recipesWithoutSlug.length);
  if (recipesWithoutSlug.length > 0) {
    console.log('Examples:', JSON.stringify(recipesWithoutSlug.slice(0, 5), null, 2));
  }

  // Check for duplicate slugs
  const slugCounts: Record<string, number> = {};
  recipes.forEach(r => {
    if (r.slug) {
      slugCounts[r.slug] = (slugCounts[r.slug] || 0) + 1;
    }
  });

  const duplicateSlugs = Object.entries(slugCounts).filter(([_, count]) => count > 1);
  console.log('\n❌ Duplicate slugs:', duplicateSlugs.length);
  if (duplicateSlugs.length > 0) {
    console.log('Duplicates:', JSON.stringify(duplicateSlugs, null, 2));
  }

  // Check for slugs with unusual patterns
  const slugsWithUpperCase = recipes.filter(r => r.slug && r.slug !== r.slug.toLowerCase());
  console.log('\n⚠️  Slugs with uppercase:', slugsWithUpperCase.length);

  const slugsWithMultipleDashes = recipes.filter(r => r.slug && r.slug.includes('--'));
  console.log('⚠️  Slugs with multiple dashes:', slugsWithMultipleDashes.length);
  if (slugsWithMultipleDashes.length > 0) {
    console.log('Examples:', slugsWithMultipleDashes.slice(0, 3).map(r => r.slug));
  }

  const slugsStartingOrEndingWithDash = recipes.filter(r => r.slug && (r.slug.startsWith('-') || r.slug.endsWith('-')));
  console.log('⚠️  Slugs starting/ending with dash:', slugsStartingOrEndingWithDash.length);
  if (slugsStartingOrEndingWithDash.length > 0) {
    console.log('Examples:', slugsStartingOrEndingWithDash.slice(0, 3).map(r => r.slug));
  }

  if (recipesWithoutSlug.length === 0 && duplicateSlugs.length === 0 &&
      slugsWithUpperCase.length === 0 && slugsWithMultipleDashes.length === 0 &&
      slugsStartingOrEndingWithDash.length === 0) {
    console.log('\n✅ All recipe URLs look good!');
  }
}

checkURLIssues().catch(console.error);
