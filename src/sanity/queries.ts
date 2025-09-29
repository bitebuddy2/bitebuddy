import { groq } from "next-sanity";

// ✅ Homepage / list pages (grid of recipes)
export const allRecipesQuery = groq/* groq */ `
*[_type == "recipe"] | order(_createdAt desc){
  "slug": slug.current,
  title,
  heroImage{
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt
  }
}
`;

// ✅ All slugs for static params (Next.js generateStaticParams)
export const recipeSlugsQuery = groq/* groq */ `
*[_type == "recipe" && defined(slug.current)][]{
  "slug": slug.current
}
`;

// ✅ Single recipe detail page
export const recipeBySlugQuery = groq/* groq */ `
*[_type == "recipe" && slug.current == $slug][0]{
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
        density_g_per_ml, gramsPerPiece
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
`;

export const allRecipesForCardsQuery = groq/* groq */ `
*[_type == "recipe"] | order(_createdAt desc){
  "slug": slug.current,
  title,
  description,
  introText,
  servings,
  prepMin,
  cookMin,
  kcal, // optional if you store per-serving kcal
  isSignature, // optional boolean in your schema
  heroImage{
    asset->{ url, metadata { lqip, dimensions } },
    alt
  },
  brand->{
    _id,
    title,
    "slug": slug.current,
    logo{
      asset->{ url, metadata { lqip } },
      alt
    }
  }
}
`;
