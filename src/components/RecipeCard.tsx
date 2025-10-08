"use client";

import Link from "next/link";
import Image from "next/image";
import ChainLogo from "./ChainLogo";

type CardRecipe = {
  slug: string;
  title: string;
  description?: string;
  introText?: string;
  servings?: number;
  prepMin?: number;
  cookMin?: number;
  kcal?: number;
  isSignature?: boolean;
  ratingSum?: number;
  ratingCount?: number;
  heroImage?: {
    asset?: { url: string; metadata?: { lqip?: string } };
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
  categories?: {
    _id: string;
    title: string;
    slug: string;
    description?: string;
  }[];
};

function pill(label: string) {
  return (
    <span className="inline-flex items-center rounded-full border border-emerald-100 bg-emerald-50 px-3 py-1.5 text-xs font-medium text-emerald-700 transition-colors hover:bg-emerald-100">
      {label}
    </span>
  );
}

function MicroStars({ ratingSum = 0, ratingCount = 0 }: { ratingSum?: number; ratingCount?: number }) {
  // Don't show anything if there are no ratings or invalid data
  if (!ratingCount || ratingCount === 0 || !ratingSum || ratingSum === 0) return null;

  const average = ratingSum / ratingCount;

  // Additional safety check for valid average
  if (isNaN(average) || average <= 0) return null;

  const fullStars = Math.floor(average);
  const hasHalfStar = average - fullStars >= 0.5;
  const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);

  return (
    <div className="flex items-center gap-1 text-xs text-gray-600">
      <div className="flex items-center">
        {/* Full stars */}
        {Array.from({ length: fullStars }).map((_, i) => (
          <svg key={`full-${i}`} className="w-3 h-3 text-yellow-400 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        ))}

        {/* Half star */}
        {hasHalfStar && (
          <svg className="w-3 h-3 text-yellow-400" viewBox="0 0 20 20">
            <defs>
              <clipPath id="half">
                <rect x="0" y="0" width="10" height="20"/>
              </clipPath>
            </defs>
            <path className="fill-current" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
            <path className="fill-gray-300" clipPath="url(#half)" d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        )}

        {/* Empty stars */}
        {Array.from({ length: emptyStars }).map((_, i) => (
          <svg key={`empty-${i}`} className="w-3 h-3 text-gray-300 fill-current" viewBox="0 0 20 20">
            <path d="M10 15l-5.878 3.09 1.123-6.545L.489 6.91l6.572-.955L10 0l2.939 5.955 6.572.955-4.756 4.635 1.123 6.545z"/>
          </svg>
        ))}
      </div>

      <span className="ml-1">
        {average.toFixed(1)} ({ratingCount})
      </span>
    </div>
  );
}

export default function RecipeCard({ r }: { r: CardRecipe }) {
  // Use AI Generated.jpg as fallback for Bite Buddy Kitchen recipes without images
  const imgUrl = r.heroImage?.asset?.url ||
    (r.brand?.slug === 'bite-buddy-kitchen' ? '/AI Generated.jpg' : null);
  const lqip = r.heroImage?.asset?.metadata?.lqip;
  const alt = r.heroImage?.alt || r.title;

  const blurb = r.description || r.introText || "";
  const truncated =
    blurb.length > 220 ? blurb.slice(0, 217).trimEnd() + "…" : blurb;

  return (
    <li className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1">
      <Link href={`/recipes/${r.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
        {/* Top image */}
        <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder={lqip ? "blur" : "empty"}
              blurDataURL={lqip}
              className="object-cover transition-transform duration-500 group-hover:scale-110"
            />
          ) : (
            <div className="absolute inset-0 grid place-items-center text-gray-400 text-sm">
              No image
            </div>
          )}

          {/* Signature badge (top-left) */}
          {r.isSignature && (
            <span className="absolute left-3 top-3 inline-flex items-center gap-1 rounded-full bg-white/90 px-2.5 py-1 text-xs font-semibold text-emerald-700 ring-1 ring-emerald-200 backdrop-blur">
              <span className="h-1.5 w-1.5 rounded-full bg-emerald-600" />
              Signature Recipe
            </span>
          )}
        </div>

        {/* Brand tag (under image) */}
        {r.brand && (
          <div className="flex items-center gap-2 px-4 pt-3 text-sm">
            <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white overflow-hidden">
              {r.brand.logo?.asset?.url ? (
                <Image
                  src={r.brand.logo.asset.url}
                  alt={r.brand.logo.alt || r.brand.title}
                  width={24}
                  height={24}
                  className="object-cover"
                />
              ) : (
                <ChainLogo className="h-3.5 w-3.5" />
              )}
            </span>
            <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
              {r.brand.title}
            </span>
          </div>
        )}

        {/* Title & blurb */}
        <div className="px-5 pb-5 pt-3">
          <h3 className="mb-2 text-xl font-bold tracking-tight text-gray-900 group-hover:text-emerald-600 transition-colors">
            {r.title}
          </h3>
          {blurb && <p className="mb-4 text-gray-600 leading-relaxed">{truncated}</p>}

          {/* Rating stars */}
          <div className="mb-3">
            <MicroStars ratingSum={r.ratingSum} ratingCount={r.ratingCount} />
          </div>

          {/* Meta pills */}
          <div className="flex flex-wrap gap-2">
            {typeof r.prepMin === "number" && pill(`Prep  ${r.prepMin} mins`)}
            {typeof r.cookMin === "number" && pill(`Cook  ${r.cookMin} mins`)}
            {typeof r.servings === "number" && pill(`Serve  ${r.servings}`)}
            {typeof r.kcal === "number" && pill(`Kcal  ${r.kcal}`)}
          </div>
        </div>
      </Link>
    </li>
  );
}
