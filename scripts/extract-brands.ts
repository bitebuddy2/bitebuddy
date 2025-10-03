import * as fs from 'fs';

// Read the full recipes file
const fileContent = fs.readFileSync('recipes-30-uk-copycats-FULL.ndjson', 'utf-8');
const lines = fileContent.trim().split('\n');
const allDocs = lines.map(line => JSON.parse(line));

// Separate brands and recipes
const brands = allDocs.filter(doc => doc._type === 'brand');
const recipes = allDocs.filter(doc => doc._type === 'recipe');

console.log(`Found ${brands.length} brands and ${recipes.length} recipes`);

// Write brands to separate file
if (brands.length > 0) {
  const brandsOutput = brands.map(b => JSON.stringify(b)).join('\n');
  fs.writeFileSync('brands.ndjson', brandsOutput);
  console.log('✓ Wrote brands.ndjson');
}

// Write recipes to separate file
const recipesOutput = recipes.map(r => JSON.stringify(r)).join('\n');
fs.writeFileSync('recipes-only.ndjson', recipesOutput);
console.log('✓ Wrote recipes-only.ndjson');
