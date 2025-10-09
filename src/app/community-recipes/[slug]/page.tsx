import { notFound } from "next/navigation";
import Image from "next/image";
import { client } from "@/sanity/client";
import { communityRecipeBySlugQuery } from "@/sanity/queries";
import StarRating from "@/components/StarRating";
import CommentSection from "@/components/CommentSection";

type CommunityRecipe = {
  _id: string;
  _createdAt: string;
  title: string;
  slug: string;
  description?: string;
  servings: number;
  prepMin: number;
  cookMin: number;
  heroImage?: {
    asset?: { url: string; metadata?: { lqip?: string } };
    alt?: string;
  };
  introText?: string;
  ingredients: Array<{
    name: string;
    amount?: string;
    unit?: string;
    notes?: string;
  }>;
  steps: string[];
  tips?: string[];
  faqs?: Array<{ question: string; answer: string }>;
  nutrition?: {
    calories?: number;
    protein?: number;
    fat?: number;
    carbs?: number;
  };
  ratingCount?: number;
  ratingSum?: number;
  createdBy: {
    userName: string;
    cookingMethod?: string;
    spiceLevel?: string;
    dietaryPreference?: string;
  };
};

export default async function CommunityRecipePage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const recipe: CommunityRecipe | null = await client.fetch(
    communityRecipeBySlugQuery,
    { slug }
  );

  if (!recipe) {
    notFound();
  }

  const imgUrl = recipe.heroImage?.asset?.url || "/ai-generated.jpg";
  const lqip = recipe.heroImage?.asset?.metadata?.lqip;
  const alt = recipe.heroImage?.alt || recipe.title;

  return (
    <article className="mx-auto max-w-4xl px-4 py-8">
      {/* Hero Image */}
      <div className="relative mb-8 aspect-[16/9] w-full overflow-hidden rounded-2xl">
        <Image
          src={imgUrl}
          alt={alt}
          fill
          priority
          className="object-cover"
          placeholder={lqip ? "blur" : "empty"}
          blurDataURL={lqip}
        />
      </div>

      {/* Header */}
      <header className="mb-8">
        <div className="mb-4 flex items-center gap-2 text-sm">
          <span className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-emerald-600 text-white">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </span>
          <span className="rounded-full bg-emerald-50 px-3 py-1 text-emerald-700 font-medium">
            Created by {recipe.createdBy.userName}
          </span>
        </div>

        <h1 className="mb-4 text-4xl font-bold tracking-tight text-gray-900">
          {recipe.title}
        </h1>

        {recipe.description && (
          <p className="mb-6 text-lg text-gray-700">{recipe.description}</p>
        )}

        {/* Recipe Preferences Badges */}
        {(recipe.createdBy.cookingMethod || recipe.createdBy.spiceLevel || recipe.createdBy.dietaryPreference) && (
          <div className="mb-6 flex flex-wrap gap-2">
            {recipe.createdBy.cookingMethod && (
              <span className="inline-flex items-center gap-1 rounded-full bg-indigo-50 px-3 py-1 text-sm text-indigo-700">
                🔥 {recipe.createdBy.cookingMethod}
              </span>
            )}
            {recipe.createdBy.spiceLevel && (
              <span className="inline-flex items-center gap-1 rounded-full bg-orange-50 px-3 py-1 text-sm text-orange-700">
                🌶️ {recipe.createdBy.spiceLevel}
              </span>
            )}
            {recipe.createdBy.dietaryPreference && (
              <span className="inline-flex items-center gap-1 rounded-full bg-blue-50 px-3 py-1 text-sm text-blue-700">
                🥗 {recipe.createdBy.dietaryPreference}
              </span>
            )}
          </div>
        )}

        {/* Meta info */}
        <div className="flex flex-wrap gap-4 text-sm text-gray-600">
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Prep: {recipe.prepMin} min
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            Cook: {recipe.cookMin} min
          </span>
          <span className="flex items-center gap-1">
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
            </svg>
            Serves: {recipe.servings}
          </span>
        </div>
      </header>

      {/* Intro Text */}
      {recipe.introText && (
        <section className="mb-8">
          <p className="text-gray-700 leading-relaxed">{recipe.introText}</p>
        </section>
      )}

      {/* Nutrition Info */}
      {recipe.nutrition && (
        <section className="mb-8 rounded-lg bg-blue-50 p-6">
          <h2 className="mb-3 text-xl font-bold text-gray-900">Nutrition (per serving)</h2>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {recipe.nutrition.calories && (
              <div>
                <div className="text-2xl font-bold text-blue-600">{recipe.nutrition.calories}</div>
                <div className="text-sm text-gray-600">Calories</div>
              </div>
            )}
            {recipe.nutrition.protein && (
              <div>
                <div className="text-2xl font-bold text-blue-600">{recipe.nutrition.protein}g</div>
                <div className="text-sm text-gray-600">Protein</div>
              </div>
            )}
            {recipe.nutrition.fat && (
              <div>
                <div className="text-2xl font-bold text-blue-600">{recipe.nutrition.fat}g</div>
                <div className="text-sm text-gray-600">Fat</div>
              </div>
            )}
            {recipe.nutrition.carbs && (
              <div>
                <div className="text-2xl font-bold text-blue-600">{recipe.nutrition.carbs}g</div>
                <div className="text-sm text-gray-600">Carbs</div>
              </div>
            )}
          </div>
        </section>
      )}

      {/* Ingredients */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Ingredients</h2>
        <ul className="space-y-2 rounded-lg bg-gray-50 p-6">
          {recipe.ingredients.map((ing, idx) => (
            <li key={idx} className="flex items-start gap-2">
              <span className="mt-1.5 h-1.5 w-1.5 flex-shrink-0 rounded-full bg-emerald-600" />
              <span className="text-gray-700">
                {[ing.amount, ing.unit].filter(Boolean).join(" ")} {ing.name}
                {ing.notes && <span className="text-gray-500 text-sm"> ({ing.notes})</span>}
              </span>
            </li>
          ))}
        </ul>
      </section>

      {/* Steps */}
      <section className="mb-8">
        <h2 className="mb-4 text-2xl font-bold text-gray-900">Method</h2>
        <ol className="space-y-4">
          {recipe.steps.map((step, idx) => (
            <li key={idx} className="flex gap-4">
              <span className="flex h-8 w-8 flex-shrink-0 items-center justify-center rounded-full bg-emerald-600 text-sm font-bold text-white">
                {idx + 1}
              </span>
              <p className="flex-1 pt-1 text-gray-700 leading-relaxed">{step}</p>
            </li>
          ))}
        </ol>
      </section>

      {/* Tips */}
      {recipe.tips && recipe.tips.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">Tips & Variations</h2>
          <ul className="space-y-2 rounded-lg bg-yellow-50 p-6">
            {recipe.tips.map((tip, idx) => (
              <li key={idx} className="flex items-start gap-2">
                <span className="text-yellow-600">💡</span>
                <span className="text-gray-700">{tip}</span>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* FAQs */}
      {recipe.faqs && recipe.faqs.length > 0 && (
        <section className="mb-8">
          <h2 className="mb-4 text-2xl font-bold text-gray-900">FAQs</h2>
          <div className="space-y-4">
            {recipe.faqs.map((faq, idx) => (
              <details key={idx} className="rounded-lg bg-gray-50 p-4">
                <summary className="cursor-pointer font-semibold text-gray-900">
                  {faq.question}
                </summary>
                <p className="mt-2 text-gray-700">{faq.answer}</p>
              </details>
            ))}
          </div>
        </section>
      )}

      {/* Rating */}
      <section className="mb-8">
        <StarRating recipeId={recipe._id} ratingCount={recipe.ratingCount} ratingSum={recipe.ratingSum} slug={slug} />
      </section>

      {/* Comments */}
      <section>
        <CommentSection recipeSlug={slug} recipeId={recipe._id} />
      </section>
    </article>
  );
}
