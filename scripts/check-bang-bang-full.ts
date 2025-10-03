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
    *[_type == "recipe" && slug.current == "wagamama-bang-bang-cauliflower"][0]{
      _id,
      title,
      "slug": slug.current,
      description,
      servings,
      prepMin,
      cookMin,
      heroImage{
        asset->{
          _id,
          url,
          metadata { lqip, dimensions }
        },
        alt
      },

      // New long-form fields
      introText,
      brandContext,

      // Ingredients (grouped, with reference deref)
      ingredients[]{
        heading,
        items[]{
          quantity,
          unit,
          notes,
          ingredientText,
          ingredientRef->{
            _id,
            name,
            allergens,
            kcal100, protein100, fat100, carbs100,
            density_g_per_ml, gramsPerPiece,
            retailerLinks[]{
              retailer,
              url,
              label
            }
          }
        }
      },

      // Method steps
      steps[]{
        step,
        stepImage{
          asset->{
            _id,
            url,
            metadata { lqip, dimensions }
          },
          alt
        }
      },

      // Extras
      tips[],
      faqs[]{ question, answer },
      nutrition{ calories, protein, fat, carbs },

      // Community
      ratingCount,
      ratingSum,

      // SEO
      seoTitle,
      seoDescription,
      canonicalUrl,

      // Brand
      brand->{
        _id,
        title,
        "slug": slug.current,
        logo
      }
    }
  `);

  console.log('Recipe found:', recipe?.title);
  console.log('\n=== INGREDIENT DETAILS ===');
  recipe?.ingredients?.forEach((group: any, i: number) => {
    console.log(`\nGroup ${i + 1}: ${group.heading || '(main)'}`);
    group.items?.forEach((item: any, j: number) => {
      console.log(`  ${j + 1}. ${item.quantity} ${item.unit || ''} ${item.ingredientText || item.ingredientRef?.name || '???'}`);
      if (item.ingredientRef) {
        console.log(`     - Has ref: ${item.ingredientRef._id}`);
        console.log(`     - Name: ${item.ingredientRef.name}`);
        console.log(`     - Retailer links: ${item.ingredientRef.retailerLinks?.length || 0}`);
      } else {
        console.log(`     - NO REF (using ingredientText: ${item.ingredientText})`);
      }
    });
  });

  console.log('\n=== OTHER FIELDS ===');
  console.log('Brand:', recipe?.brand?.title);
  console.log('Intro text:', recipe?.introText?.substring(0, 50) + '...');
  console.log('Brand context:', recipe?.brandContext ? 'YES' : 'NO');
  console.log('Steps:', recipe?.steps?.length);
  console.log('Tips:', recipe?.tips?.length);
  console.log('FAQs:', recipe?.faqs?.length);
  console.log('Nutrition:', recipe?.nutrition ? 'YES' : 'NO');
}

checkRecipe();
