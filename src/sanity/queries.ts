// List of recipes for the homepage / list pages
export const allRecipesQuery = /* groq */ `
*[_type == "recipe"]{
  "slug": slug.current,
  title,
  heroImage
} | order(_createdAt desc)
`;

// All slugs for static params (detail pages)
export const recipeSlugsQuery = /* groq */ `
*[_type == "recipe" && defined(slug.current)][]{
  "slug": slug.current
}
`;

// Single recipe (detail page) — dereferences ingredient references
export const recipeBySlugQuery = /* groq */ `
*[_type == "recipe" && slug.current == $slug][0]{
  title,
  description,
  servings,
  prepTime,
  cookTime,
  heroImage,
  ingredients[]{
    quantity,
    unit,
    note,
    "item": coalesce(
      item->{
        name,
        allergens
      },
      ingredient->{
        name,
        allergens
      }
    )
  },
  instructions
}
`;
