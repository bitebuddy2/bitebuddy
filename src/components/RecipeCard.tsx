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
  heroImage?: {
    asset?: { url: string; metadata?: { lqip?: string } };
    alt?: string;
  };
};

function pill(label: string) {
  return (
    <span className="inline-flex items-center rounded-full border border-gray-200 bg-gray-50 px-2.5 py-1 text-xs font-medium text-gray-600">
      {label}
    </span>
  );
}

export default function RecipeCard({ r }: { r: CardRecipe }) {
  const imgUrl = r.heroImage?.asset?.url;
  const lqip = r.heroImage?.asset?.metadata?.lqip;
  const alt = r.heroImage?.alt || r.title;

  const blurb = r.description || r.introText || "";
  const truncated =
    blurb.length > 220 ? blurb.slice(0, 217).trimEnd() + "…" : blurb;

  return (
    <li className="group overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm transition hover:shadow-md">
      <Link href={`/recipes/${r.slug}`} className="block focus:outline-none focus:ring-2 focus:ring-emerald-500/50">
        {/* Top image */}
        <div className="relative aspect-[16/9] bg-gray-100">
          {imgUrl ? (
            <Image
              src={imgUrl}
              alt={alt}
              fill
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              placeholder={lqip ? "blur" : "empty"}
              blurDataURL={lqip}
              className="object-cover"
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
        <div className="flex items-center gap-2 px-4 pt-3 text-sm">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-gray-900 text-white">
            <ChainLogo className="h-3.5 w-3.5" />
          </span>
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-gray-700">
            Kitchen by Bite Buddy
          </span>
        </div>

        {/* Title & blurb */}
        <div className="px-4 pb-4 pt-2">
          <h3 className="mb-1 text-xl font-semibold tracking-tight group-hover:underline">
            {r.title}
          </h3>
          {blurb && <p className="mb-3 text-gray-600">{truncated}</p>}

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
