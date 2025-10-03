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
  // Read the ndjson file
  const fileContent = fs.readFileSync('recipes-30-uk-copycats-v3.ndjson', 'utf-8');
  const lines = fileContent.trim().split('\n');
  const recipes = lines.map(line => JSON.parse(line));

  console.log(`Found ${recipes.length} recipes to process`);

  // Transform each recipe
  const transformed = recipes.map(recipe => {
    if (recipe._type !== 'recipe') return recipe;

    // Check if ingredients is a flat array of ingredientItem
    if (recipe.ingredients && Array.isArray(recipe.ingredients)) {
      const firstItem = recipe.ingredients[0];
      if (firstItem && firstItem._type === 'ingredientItem') {
        // Transform to ingredientGroup structure
        recipe.ingredients = [
          {
            _type: 'ingredientGroup',
            _key: 'main-ingredients',
            heading: null,
            items: recipe.ingredients.map((item: any) => ({
              _type: 'object',
              _key: item._key || Math.random().toString(36).substring(7),
              ingredientText: item.name,
              quantity: item.quantity || null,
              unit: item.unit || null,
              notes: item.notes || null
            }))
          }
        ];
        console.log(`✓ Fixed ${recipe.title}`);
      }
    }

    // Also check if steps is a simple array of strings
    if (recipe.steps && Array.isArray(recipe.steps)) {
      const firstStep = recipe.steps[0];
      if (typeof firstStep === 'string') {
        recipe.steps = recipe.steps.map((stepText: string, index: number) => ({
          _type: 'object',
          _key: `step-${index}`,
          step: [
            {
              _type: 'block',
              style: 'normal',
              children: [
                {
                  _type: 'span',
                  text: stepText,
                  marks: []
                }
              ],
              markDefs: []
            }
          ]
        }));
      }
    }

    return recipe;
  });

  // Write back to a new file
  const output = transformed.map(r => JSON.stringify(r)).join('\n');
  fs.writeFileSync('recipes-30-uk-copycats-fixed.ndjson', output);
  console.log('\n✓ Wrote fixed recipes to recipes-30-uk-copycats-fixed.ndjson');
}

main();
