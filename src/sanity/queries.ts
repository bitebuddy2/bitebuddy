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
  _createdAt,
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
  },

  // Categories
  categories[]->{
    _id,
    title,
    "slug": slug.current,
    description
  },

  // User-generated recipe credit
  createdBy
}
`;

export const allRecipesForCardsQuery = groq/* groq */ `
*[_type == "recipe"] | order(_updatedAt desc){
  "slug": slug.current,
  title,
  description,
  introText,
  servings,
  prepMin,
  cookMin,
  kcal, // optional if you store per-serving kcal
  createdBy,
  isSignature, // optional boolean in your schema
  ratingSum,
  ratingCount,
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
  },
  categories[]->{
    _id,
    title,
    "slug": slug.current
  }
}
`;

// ✅ Recipe search by ingredient names - shows recipes with any matches, ordered by match count
export const recipesByIngredientNamesQuery = groq/* groq */ `
*[_type == "recipe" && defined(ingredients)] {
  "slug": slug.current,
  title,
  introText,
  servings, prepMin, cookMin, ratingSum, ratingCount,
  brand->{
    title,
    "slug": slug.current,
    logo{ asset->{ url, metadata{ lqip } }, alt }
  },
  heroImage{ asset->{ url, metadata{ lqip, dimensions } }, alt },

  // Get all ingredient names for debugging
  "allIngredients": ingredients[].items[]{
    "text": ingredientText,
    "ref": ingredientRef->name,
    "refId": ingredientRef._ref
  },

  // Enhanced matching including ingredient ID fallback for missing docs
  "matched": ingredients[].items[
    // Check ingredientText field
    (defined(ingredientText) && (
      lower(ingredientText) in $namesLower ||
      lower(ingredientText) match $searchPattern
    ))
    ||
    // Check ingredientRef->name field (when document exists)
    (defined(ingredientRef->name) && (
      lower(ingredientRef->name) in $namesLower ||
      lower(ingredientRef->name) match $searchPattern
    ))
    ||
    // Fallback: match common ingredient ID patterns for missing docs
    (defined(ingredientRef._ref) && (
      ingredientRef._ref == "ingredient.sausage-meat" && ("sausage meat" in $names || "sausage" in $names) ||
      ingredientRef._ref == "ingredient.egg" && "egg" in $names ||
      ingredientRef._ref == "ingredient.thyme" && "thyme" in $names ||
      ingredientRef._ref == "ingredient.onion" && "onion" in $names ||
      ingredientRef._ref == "ingredient.garlic" && "garlic" in $names ||
      ingredientRef._ref == "ingredient.sage" && "sage" in $names ||
      ingredientRef._ref == "ingredient.black-pepper" && ("black pepper" in $names || "pepper" in $names) ||
      ingredientRef._ref == "ingredient.milk" && "milk" in $names ||
      ingredientRef._ref == "ingredient.fine-sea-salt" && ("salt" in $names || "sea salt" in $names) ||
      ingredientRef._ref == "ingredient.breadcrumbs" && ("breadcrumbs" in $names || "bread" in $names) ||
      ingredientRef._ref == "ingredient.puff-pastry" && ("pastry" in $names || "puff pastry" in $names) ||
      ingredientRef._ref match "*sausage*" && "sausage" in $names ||
      ingredientRef._ref match "*egg*" && "egg" in $names ||
      ingredientRef._ref match "*thyme*" && "thyme" in $names ||
      ingredientRef._ref match "*onion*" && "onion" in $names ||
      ingredientRef._ref match "*garlic*" && "garlic" in $names
    ))
  ]{
    "name": coalesce(
      ingredientRef->name,
      ingredientText,
      // Convert ref ID to readable name as fallback
      select(
        ingredientRef._ref == "ingredient.sausage-meat" => "Sausage Meat",
        ingredientRef._ref == "ingredient.egg" => "Egg",
        ingredientRef._ref == "ingredient.thyme" => "Thyme",
        ingredientRef._ref == "ingredient.onion" => "Onion",
        ingredientRef._ref == "ingredient.garlic" => "Garlic",
        ingredientRef._ref == "ingredient.sage" => "Sage",
        ingredientRef._ref == "ingredient.black-pepper" => "Black Pepper",
        ingredientRef._ref == "ingredient.milk" => "Milk",
        ingredientRef._ref == "ingredient.fine-sea-salt" => "Fine Sea Salt",
        ingredientRef._ref == "ingredient.breadcrumbs" => "Breadcrumbs",
        ingredientRef._ref == "ingredient.puff-pastry" => "Puff Pastry",
        ingredientRef._ref
      )
    )
  },

  "totalMatches": count(ingredients[].items[
    // Check ingredientText field
    (defined(ingredientText) && (
      lower(ingredientText) in $namesLower ||
      lower(ingredientText) match $searchPattern
    ))
    ||
    // Check ingredientRef->name field (when document exists)
    (defined(ingredientRef->name) && (
      lower(ingredientRef->name) in $namesLower ||
      lower(ingredientRef->name) match $searchPattern
    ))
    ||
    // Fallback: match common ingredient ID patterns for missing docs
    (defined(ingredientRef._ref) && (
      ingredientRef._ref == "ingredient.sausage-meat" && ("sausage meat" in $names || "sausage" in $names) ||
      ingredientRef._ref == "ingredient.egg" && "egg" in $names ||
      ingredientRef._ref == "ingredient.thyme" && "thyme" in $names ||
      ingredientRef._ref == "ingredient.onion" && "onion" in $names ||
      ingredientRef._ref == "ingredient.garlic" && "garlic" in $names ||
      ingredientRef._ref == "ingredient.sage" && "sage" in $names ||
      ingredientRef._ref == "ingredient.black-pepper" && ("black pepper" in $names || "pepper" in $names) ||
      ingredientRef._ref == "ingredient.milk" && "milk" in $names ||
      ingredientRef._ref == "ingredient.fine-sea-salt" && ("salt" in $names || "sea salt" in $names) ||
      ingredientRef._ref == "ingredient.breadcrumbs" && ("breadcrumbs" in $names || "bread" in $names) ||
      ingredientRef._ref == "ingredient.puff-pastry" && ("pastry" in $names || "puff pastry" in $names) ||
      ingredientRef._ref match "*sausage*" && "sausage" in $names ||
      ingredientRef._ref match "*egg*" && "egg" in $names ||
      ingredientRef._ref match "*thyme*" && "thyme" in $names ||
      ingredientRef._ref match "*onion*" && "onion" in $names ||
      ingredientRef._ref match "*garlic*" && "garlic" in $names
    ))
  ])
} | order(totalMatches desc, _createdAt desc)[totalMatches >= 2]
`;

// ✅ Get all brands for filtering
export const allBrandsQuery = groq/* groq */ `
*[_type == "brand"] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  logo{
    asset->{ url, metadata{ lqip } },
    alt
  }
}
`;

// ✅ Get all brands with recipe counts for the brands listing page
export const allBrandsWithRecipeCountQuery = groq/* groq */ `
*[_type == "brand"] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  description,
  logo{
    asset->{ url, metadata{ lqip } },
    alt
  },
  "recipeCount": count(*[_type == "recipe" && references(^._id)])
}
`;

// ✅ Get all categories for filtering
export const allCategoriesQuery = groq/* groq */ `
*[_type == "category"] | order(title asc){
  _id,
  title,
  "slug": slug.current,
  description
}
`;

// ✅ Get all products
export const allProductsQuery = groq/* groq */ `
*[_type == "product"] | order(featured desc, title asc){
  _id,
  title,
  "slug": slug.current,
  description,
  image{
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt
  },
  category,
  price,
  affiliateLink,
  retailer,
  featured,
  rating
}
`;

// ✅ Get products by category
export const productsByCategoryQuery = groq/* groq */ `
*[_type == "product" && category == $category] | order(featured desc, title asc){
  _id,
  title,
  "slug": slug.current,
  description,
  image{
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt
  },
  category,
  price,
  affiliateLink,
  retailer,
  featured,
  rating
}
`;

// ✅ Get single product by slug
export const productBySlugQuery = groq/* groq */ `
*[_type == "product" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  image{
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt
  },
  category,
  price,
  affiliateLink,
  retailer,
  featured,
  rating,
  relatedRecipes[]->{
    _id,
    title,
    "slug": slug.current,
    heroImage{
      asset->{
        url,
        metadata { lqip }
      },
      alt
    }
  }
}
`;

// ✅ Community recipes for cards
export const allCommunityRecipesQuery = groq/* groq */ `
*[_type == "communityRecipe"] | order(_updatedAt desc){
  "slug": slug.current,
  title,
  description,
  introText,
  servings,
  prepMin,
  cookMin,
  ratingSum,
  ratingCount,
  heroImage{
    asset->{ url, metadata { lqip, dimensions } },
    alt
  },
  createdBy
}
`;

// ✅ Single community recipe by slug
export const communityRecipeBySlugQuery = groq/* groq */ `
*[_type == "communityRecipe" && slug.current == $slug][0]{
  _id,
  _createdAt,
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
  introText,
  ingredients,
  steps,
  tips,
  faqs,
  nutrition,
  ratingCount,
  ratingSum,
  createdBy
}
`;

// ✅ Get brand by slug
export const brandBySlugQuery = groq/* groq */ `
*[_type == "brand" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description,
  logo{
    asset->{ url, metadata{ lqip } },
    alt
  }
}
`;

// ✅ Get recipes by brand slug
export const recipesByBrandQuery = groq/* groq */ `
*[_type == "recipe" && brand->slug.current == $brandSlug] | order(_createdAt desc){
  "slug": slug.current,
  title,
  description,
  introText,
  servings,
  prepMin,
  cookMin,
  ratingSum,
  ratingCount,
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
  },
  categories[]->{
    _id,
    title,
    "slug": slug.current
  }
}
`;

// ✅ Get category by slug
export const categoryBySlugQuery = groq/* groq */ `
*[_type == "category" && slug.current == $slug][0]{
  _id,
  title,
  "slug": slug.current,
  description
}
`;

// ✅ Get recipes by category slug
export const recipesByCategoryQuery = groq/* groq */ `
*[_type == "recipe" && references(*[_type == "category" && slug.current == $categorySlug][0]._id)] | order(_createdAt desc){
  "slug": slug.current,
  title,
  description,
  introText,
  servings,
  prepMin,
  cookMin,
  ratingSum,
  ratingCount,
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
  },
  categories[]->{
    _id,
    title,
    "slug": slug.current
  }
}
`;

// ✅ Get all brand slugs for generateStaticParams
export const brandSlugsQuery = groq/* groq */ `
*[_type == "brand" && defined(slug.current)][]{
  "slug": slug.current
}
`;

// ✅ Get all category slugs for generateStaticParams
export const categorySlugsQuery = groq/* groq */ `
*[_type == "category" && defined(slug.current)][]{
  "slug": slug.current
}
`;

// ✅ Get all cooking guides
export const allGuidesQuery = groq/* groq */ `
*[_type == "guide"] | order(_createdAt desc){
  _id,
  title,
  "slug": slug.current,
  description,
  heroImage{
    asset->{ url, metadata{ lqip, dimensions } },
    alt
  },
  category
}
`;

// ✅ Get guide by slug
export const guideBySlugQuery = groq/* groq */ `
*[_type == "guide" && slug.current == $slug][0]{
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug.current,
  description,
  heroImage{
    asset->{
      _id,
      url,
      metadata { lqip, dimensions }
    },
    alt
  },
  content,
  steps[]{
    title,
    description,
    image{
      asset->{ url, metadata{ lqip } },
      alt
    }
  },
  category,
  relatedRecipes[]->{
    _id,
    title,
    "slug": slug.current,
    heroImage{
      asset->{ url, metadata{ lqip } },
      alt
    }
  }
}
`;

// ✅ Get all guide slugs for generateStaticParams
export const guideSlugsQuery = groq/* groq */ `
*[_type == "guide" && defined(slug.current)][]{
  "slug": slug.current
}
`;
