import Link from "next/link";
import Image from "next/image";

type Recipe = {
  _id: string;
  _type: string;
  title: string;
  slug: string;
  description?: string;
  introText?: string;
  servings?: number;
  prepMin?: number;
  cookMin?: number;
  ratingSum?: number;
  ratingCount?: number;
  heroImage?: {
    asset?: {
      url: string;
      metadata?: { lqip?: string; dimensions?: { width: number; height: number } };
    };
    alt?: string;
  };
  brand?: {
    _id: string;
    title: string;
    slug: string;
    logo?: {
      asset?: { url: string; metadata?: { lqip?: string } };
      alt?: string;
    };
  };
  createdBy?: string;
};

export default function ArticleRecipeCard({ recipe }: { recipe: Recipe }) {
  const imgUrl = recipe.heroImage?.asset?.url;
  const lqip = recipe.heroImage?.asset?.metadata?.lqip;
  const alt = recipe.heroImage?.alt || recipe.title;
  const totalTime = (recipe.prepMin || 0) + (recipe.cookMin || 0);
  const avgRating = recipe.ratingCount && recipe.ratingSum
    ? (recipe.ratingSum / recipe.ratingCount).toFixed(1)
    : null;

  // Determine the base path based on recipe type
  const basePath = recipe._type === "communityRecipe" ? "/community-recipes" : "/recipes";

  return (
    <article className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300 hover:-translate-y-1">
      <Link href={`${basePath}/${recipe.slug}`} className="block">
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
            {/* Brand or Community Badge */}
            {recipe.brand ? (
              <div className="absolute top-3 left-3 bg-white/95 backdrop-blur-sm rounded-lg px-3 py-1.5 shadow-md">
                {recipe.brand.logo?.asset?.url ? (
                  <Image
                    src={recipe.brand.logo.asset.url}
                    alt={recipe.brand.logo.alt || recipe.brand.title}
                    width={80}
                    height={30}
                    className="h-6 w-auto object-contain"
                  />
                ) : (
                  <span className="text-sm font-semibold text-gray-800">{recipe.brand.title}</span>
                )}
              </div>
            ) : recipe.createdBy ? (
              <div className="absolute top-3 left-3">
                <span className="inline-block rounded-full bg-purple-600 px-3 py-1 text-xs font-semibold text-white shadow-md">
                  Community
                </span>
              </div>
            ) : null}
          </div>
        )}

        {/* Content */}
        <div className="p-5">
          {/* Title */}
          <h3 className="text-xl font-bold text-gray-900 mb-2 group-hover:text-emerald-600 transition-colors line-clamp-2">
            {recipe.title}
          </h3>

          {/* Description */}
          {(recipe.description || recipe.introText) && (
            <p className="text-gray-600 text-sm leading-relaxed line-clamp-2 mb-3">
              {recipe.description || recipe.introText}
            </p>
          )}

          {/* Meta info */}
          <div className="flex flex-wrap items-center gap-3 text-xs text-gray-500">
            {totalTime > 0 && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
                </svg>
                {totalTime} min
              </span>
            )}
            {recipe.servings && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fillRule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
                </svg>
                {recipe.servings} servings
              </span>
            )}
            {avgRating && (
              <span className="flex items-center gap-1">
                <svg className="w-4 h-4 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                </svg>
                {avgRating} ({recipe.ratingCount})
              </span>
            )}
          </div>

          {/* View Recipe Link */}
          <div className="mt-4 flex items-center text-emerald-600 font-medium text-sm group-hover:gap-2 transition-all">
            View recipe
            <svg className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </div>
        </div>
      </Link>
    </article>
  );
}
