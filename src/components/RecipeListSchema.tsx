type CardRecipe = {
  slug: string;
  title: string;
  description?: string;
  heroImage?: {
    asset?: {
      url: string;
    };
  };
  ratingSum?: number;
  ratingCount?: number;
};

interface RecipeListSchemaProps {
  recipes: CardRecipe[];
}

export default function RecipeListSchema({ recipes }: RecipeListSchemaProps) {
  const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: recipes.slice(0, 50).map((recipe, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Recipe",
        "@id": `${SITE_URL}/recipes/${recipe.slug}`,
        name: recipe.title,
        url: `${SITE_URL}/recipes/${recipe.slug}`,
        description: recipe.description,
        image: recipe.heroImage?.asset?.url,
        aggregateRating: recipe.ratingSum && recipe.ratingCount && recipe.ratingCount > 0 ? {
          "@type": "AggregateRating",
          ratingValue: (recipe.ratingSum / recipe.ratingCount).toFixed(1),
          ratingCount: recipe.ratingCount,
        } : undefined,
      }
    }))
  };

  const breadcrumbSchema = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: SITE_URL
      },
      {
        "@type": "ListItem",
        position: 2,
        name: "Recipes",
        item: `${SITE_URL}/recipes`
      }
    ]
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }}
      />
    </>
  );
}
