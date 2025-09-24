export const allRecipesQuery = /* groq */ `
*[_type == "recipe"]{
  "slug": slug.current,
  title,
  heroImage
} | order(_createdAt desc)
`;

export const recipeSlugsQuery = /* groq */ `
*[_type == "recipe" && defined(slug.current)][]{
  "slug": slug.current
}
`;

export const recipeBySlugQuery = /* groq */ `
*[_type == "recipe" && slug.current == $slug][0]{
  title,
  description,
  servings,
  prepTime,
  cookTime,
  heroImage,
  ingredients[]{
    quantity, unit, note,
    item->{
      name,
      allergens
    }
  },
  instructions
}
`;
