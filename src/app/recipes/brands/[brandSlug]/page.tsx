import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { client } from "@/sanity/client";
import { brandBySlugQuery, recipesByBrandQuery, brandSlugsQuery } from "@/sanity/queries";
import RecipeCard from "@/components/RecipeCard";
import BrandPageTracker from "@/components/BrandPageTracker";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

/* --------------- Static params / metadata --------------- */

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(brandSlugsQuery);
  return slugs.map(({ slug }) => ({ brandSlug: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ brandSlug: string }> }): Promise<Metadata> {
  const { brandSlug } = await params;
  const brand = await client.fetch<any>(brandBySlugQuery, { slug: brandSlug });

  if (!brand) {
    return {
      title: "Brand not found | Bite Buddy",
      robots: { index: false },
    };
  }

  const title = `${brand.title} Copycat Recipes | Bite Buddy`;
  const description =
    brand.description ||
    `Recreate your favourite ${brand.title} dishes at home with our tested copycat recipes. Simple ingredients, authentic flavours.`;
  const url = `${SITE_URL}/recipes/brands/${brandSlug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Bite Buddy",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
}

/* ---------------------- Page ---------------------- */

export default async function BrandPage({ params }: { params: Promise<{ brandSlug: string }> }) {
  const { brandSlug } = await params;
  const brand = await client.fetch<any>(brandBySlugQuery, { slug: brandSlug });
  const recipes = await client.fetch<any[]>(recipesByBrandQuery, { brandSlug });

  if (!brand) notFound();

  // Schema.org ItemList structured data for recipe collection
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${brand.title} Recipes`,
    description: `Collection of ${brand.title} copycat recipes`,
    numberOfItems: recipes.length,
    itemListElement: recipes.map((recipe, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Recipe",
        name: recipe.title,
        url: `${SITE_URL}/recipes/${recipe.slug}`,
        image: recipe.heroImage?.asset?.url,
        description: recipe.description || recipe.introText,
      },
    })),
  };

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      {/* Track brand page view for analytics */}
      <BrandPageTracker
        brandSlug={brandSlug}
        brandTitle={brand.title}
        recipeCount={recipes.length}
      />

      <Link href="/recipes" className="text-sm text-emerald-700 underline mb-4 inline-block">
        ← Back to all recipes
      </Link>

      <div className="flex items-center gap-4 mb-6">
        {brand.logo?.asset?.url && (
          <Image
            src={brand.logo.asset.url}
            alt={brand.logo.alt || brand.title}
            width={80}
            height={80}
            className="rounded-lg border object-contain"
          />
        )}
        <div>
          <h1 className="text-4xl font-bold tracking-tight">{brand.title} Recipes</h1>
          <p className="text-gray-600 mt-1">
            {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
          </p>
        </div>
      </div>

      {brand.description && (
        <p className="text-gray-700 mb-8 text-lg">{brand.description}</p>
      )}

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No recipes yet for this brand.</p>
          <Link href="/contact" className="text-emerald-600 hover:underline mt-2 inline-block">
            Request a recipe →
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {recipes.map((recipe) => (
            <RecipeCard key={recipe.slug} r={recipe} />
          ))}
        </div>
      )}

      {/* Schema.org ItemList structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(itemListSchema) }}
      />

      {/* JSON-LD: Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Recipes", item: `${SITE_URL}/recipes` },
              { "@type": "ListItem", position: 2, name: "Brands", item: `${SITE_URL}/recipes/brands` },
              { "@type": "ListItem", position: 3, name: brand.title, item: `${SITE_URL}/recipes/brands/${brandSlug}` },
            ],
          }),
        }}
      />
    </main>
  );
}
