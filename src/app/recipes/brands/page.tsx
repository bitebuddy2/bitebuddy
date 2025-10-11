import React from "react";
import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

import { client } from "@/sanity/client";
import { allBrandsWithRecipeCountQuery } from "@/sanity/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

export const metadata: Metadata = {
  title: "Browse Recipe Brands | Bite Buddy",
  description:
    "Explore copycat recipes from your favourite restaurants and brands. Learn how to recreate signature dishes at home with our tested recipes.",
  alternates: {
    canonical: `${SITE_URL}/recipes/brands`,
  },
  openGraph: {
    title: "Browse Recipe Brands | Bite Buddy",
    description:
      "Explore copycat recipes from your favourite restaurants and brands. Learn how to recreate signature dishes at home with our tested recipes.",
    url: `${SITE_URL}/recipes/brands`,
    siteName: "Bite Buddy",
    type: "website",
  },
};

interface Brand {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  logo?: {
    asset?: {
      url: string;
      metadata?: {
        lqip?: string;
      };
    };
    alt?: string;
  };
  recipeCount: number;
}

export default async function BrandsPage() {
  const brands = await client.fetch<Brand[]>(allBrandsWithRecipeCountQuery);

  // Filter out brands with no recipes
  const brandsWithRecipes = brands.filter((brand) => brand.recipeCount > 0);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <div className="mb-8">
        <Link href="/recipes" className="text-sm text-emerald-700 underline mb-4 inline-block">
          ← Back to all recipes
        </Link>
        <h1 className="text-4xl font-bold tracking-tight mb-2">Browse by Brand</h1>
        <p className="text-gray-600 text-lg">
          Explore copycat recipes from your favourite restaurants and brands
        </p>
      </div>

      {brandsWithRecipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No brands available yet.</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {brandsWithRecipes.map((brand) => (
            <Link
              key={brand._id}
              href={`/recipes/brands/${brand.slug}`}
              className="group block rounded-lg border border-gray-200 p-6 transition-all hover:border-emerald-500 hover:shadow-md"
            >
              <div className="flex items-center gap-4 mb-3">
                {brand.logo?.asset?.url ? (
                  <Image
                    src={brand.logo.asset.url}
                    alt={brand.logo.alt || brand.title}
                    width={60}
                    height={60}
                    className="rounded-lg object-contain"
                  />
                ) : (
                  <div className="w-[60px] h-[60px] rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-2xl font-bold text-gray-400">
                      {brand.title.charAt(0)}
                    </span>
                  </div>
                )}
                <div className="flex-1">
                  <h2 className="text-xl font-semibold group-hover:text-emerald-600 transition-colors">
                    {brand.title}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {brand.recipeCount} {brand.recipeCount === 1 ? "recipe" : "recipes"}
                  </p>
                </div>
              </div>
              {brand.description && (
                <p className="text-gray-600 text-sm line-clamp-2">{brand.description}</p>
              )}
            </Link>
          ))}
        </div>
      )}

      {/* JSON-LD: Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Recipes", item: `${SITE_URL}/recipes` },
              {
                "@type": "ListItem",
                position: 2,
                name: "Brands",
                item: `${SITE_URL}/recipes/brands`,
              },
            ],
          }),
        }}
      />
    </main>
  );
}
