import RecipeCard from "./RecipeCard";

type RelatedRecipe = {
  slug: string;
  title: string;
  description?: string;
  heroImage?: {
    asset?: {
      url: string;
      metadata?: {
        lqip?: string;
      };
    };
    alt?: string;
  };
  brand?: {
    _id: string;
    title: string;
    slug: string;
  };
  categories?: Array<{
    _id: string;
    title: string;
    slug: string;
    description?: string;
  }>;
  ratingSum?: number;
  ratingCount?: number;
};

interface RelatedRecipesProps {
  recipes: RelatedRecipe[];
  title?: string;
}

export default function RelatedRecipes({ recipes, title = "You Might Also Like" }: RelatedRecipesProps) {
  if (!recipes || recipes.length === 0) return null;

  return (
    <section className="mt-12 pt-8 border-t border-gray-200">
      <h2 className="text-2xl md:text-3xl font-bold mb-6">{title}</h2>
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((recipe) => (
          <RecipeCard key={recipe.slug} r={recipe} />
        ))}
      </div>
    </section>
  );
}
