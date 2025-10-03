import { createClient } from '@sanity/client';
import * as fs from 'fs';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function main() {
  // Read recipes and extract brand refs
  const fileContent = fs.readFileSync('recipes-30-uk-copycats-FULL.ndjson', 'utf-8');
  const recipes = fileContent.trim().split('\n').map(line => JSON.parse(line));

  const brandRefs = new Set<string>();
  recipes.forEach((recipe: any) => {
    if (recipe.brand?._ref) {
      brandRefs.add(recipe.brand._ref);
    }
  });

  console.log(`Found ${brandRefs.size} unique brand references`);

  // Create brand documents
  const brandMap: {[key: string]: string} = {
    'brand-greggs': 'Greggs',
    'brand-nandos': "Nando's",
    'brand-wagamama': 'Wagamama',
    'brand-kfc': 'KFC',
    'brand-mcdonalds': "McDonald's",
    'brand-costa': 'Costa',
    'brand-starbucks': 'Starbucks',
    'brand-pizza-express': 'Pizza Express',
    'brand-dominos': "Domino's",
    'brand-pret-a-manger': 'Pret A Manger'
  };

  for (const brandId of Array.from(brandRefs)) {
    const brandName = brandMap[brandId] || brandId.replace('brand-', '').replace(/-/g, ' ');
    const slugText = brandId.replace('brand-', '');

    const brandDoc = {
      _id: brandId,
      _type: 'brand',
      title: brandName,
      slug: {
        _type: 'slug',
        current: slugText
      }
    };

    await client.createOrReplace(brandDoc);
    console.log(`✓ Created brand: ${brandName}`);
  }

  console.log('\n✓ All brands created');
}

main();
