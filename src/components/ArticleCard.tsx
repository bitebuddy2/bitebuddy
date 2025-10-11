import Link from "next/link";
import Image from "next/image";

type Article = {
  _id: string;
  title: string;
  slug: string;
  excerpt?: string;
  category: string;
  publishedAt: string;
  heroImage?: {
    asset?: {
      url: string;
      metadata?: { lqip?: string; dimensions?: { width: number; height: number } };
    };
    alt?: string;
  };
  author?: {
    name: string;
  };
};

const CATEGORY_LABELS: Record<string, string> = {
  "cooking-techniques": "Cooking Techniques",
  "ingredient-guides": "Ingredient Guides",
  "food-trends": "Food Trends",
  "meal-prep-planning": "Meal Prep & Planning",
  "healthy-eating": "Healthy Eating",
  "copycat-secrets": "Restaurant Copycat Secrets",
  "kitchen-equipment": "Kitchen Equipment",
  "seasonal-cooking": "Seasonal Cooking",
};

export default function ArticleCard({ article }: { article: Article }) {
  const imgUrl = article.heroImage?.asset?.url;
  const lqip = article.heroImage?.asset?.metadata?.lqip;
  const alt = article.heroImage?.alt || article.title;
  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;

  const date = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
      })
    : '';

  return (
    <article className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={`/articles/${article.slug}`} className="block">
        {/* Image */}
        {imgUrl && (
          <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
            <Image
              src={imgUrl}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder={lqip ? "blur" : "empty"}
              blurDataURL={lqip}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
            {/* Category Badge */}
            <div className="absolute top-3 left-3">
              <span className="inline-block rounded-full bg-emerald-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                {categoryLabel}
              </span>
            </div>
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Meta info */}
          <div className="flex items-center gap-3 mb-3 text-xs text-gray-500">
            {article.author?.name && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                </svg>
                {article.author.name}
              </span>
            )}
            {date && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
                </svg>
                {date}
              </span>
            )}
          </div>

          {/* Title */}
          <h2 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
            {article.title}
          </h2>

          {/* Excerpt */}
          {article.excerpt && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-3">
              {article.excerpt}
            </p>
          )}

          {/* Read more */}
          <div className="mt-4 flex items-center text-emerald-600 font-medium text-sm group-hover:gap-2 transition-all">
            Read more
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
