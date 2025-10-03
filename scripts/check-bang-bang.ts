import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  useCdn: false,
  token: 'skA2Rd67rZqonfWgAgvYogt38un3vsyP8u2PgcDaopM9PX3Dv97s6R1Y8VQ0TL0t4Ul8FBZuHZ0kBDxnNtKJjgGwIVMSUMnhM6aVn51Fj2cA64MlAzNVEe8jAPBwQxpyELcDp9nWTqsS0SwI0B5wH5CwTOO9qM3r7G1TpDOhfhQ7N1ciRK2k'
});

async function checkRecipe() {
  const recipe = await client.fetch(`
    *[_type == "recipe" && slug.current match "*bang-bang*"][0]{
      _id,
      title,
      "slug": slug.current,
      description,
      servings,
      prepMin,
      cookMin,
      introText,
      brandContext,
      ingredients,
      steps,
      tips,
      faqs,
      nutrition,
      brand->{
        _id,
        title,
        "slug": slug.current
      }
    }
  `);

  console.log('Recipe found:', recipe?.title);
  console.log('\n=== ALL FIELDS ===');
  console.log(JSON.stringify(recipe, null, 2));
}

checkRecipe();
