import React from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { client } from "@/sanity/client";
import { categoryBySlugQuery, recipesByCategoryQuery, categorySlugsQuery } from "@/sanity/queries";
import RecipeCard from "@/components/RecipeCard";
import CategoryPageTracker from "@/components/CategoryPageTracker";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

/* --------------- Static params / metadata --------------- */

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(categorySlugsQuery);
  return slugs.map(({ slug }) => ({ categorySlug: slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ categorySlug: string }> }): Promise<Metadata> {
  const { categorySlug } = await params;
  const category = await client.fetch<any>(categoryBySlugQuery, { slug: categorySlug });

  if (!category) {
    return {
      title: "Category not found | Bite Buddy",
      robots: { index: false },
    };
  }

  const title = `${category.title} Recipes | Bite Buddy`;
  const description =
    category.description ||
    `Browse our collection of ${category.title} recipes. UK restaurant copycat recipes made simple.`;
  const url = `${SITE_URL}/recipes/categories/${categorySlug}`;

  return {
    title,
    description,
    alternates: { canonical: `/recipes/categories/${categorySlug}` },
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

export default async function CategoryPage({ params }: { params: Promise<{ categorySlug: string }> }) {
  const { categorySlug } = await params;
  const category = await client.fetch<any>(categoryBySlugQuery, { slug: categorySlug });
  const recipes = await client.fetch<any[]>(recipesByCategoryQuery, { categorySlug });

  if (!category) notFound();

  // Schema.org ItemList structured data for recipe collection
  const itemListSchema = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    name: `${category.title} Recipes`,
    description: `Collection of ${category.title} recipes`,
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
      {/* Track category page view for analytics */}
      <CategoryPageTracker
        categorySlug={categorySlug}
        categoryTitle={category.title}
        recipeCount={recipes.length}
      />

      <Link href="/recipes" className="text-sm text-emerald-700 underline mb-4 inline-block">
        ← Back to all recipes
      </Link>

      <div className="mb-6">
        <h1 className="text-4xl font-bold tracking-tight">{category.title} Recipes</h1>
        <p className="text-gray-600 mt-1">
          {recipes.length} {recipes.length === 1 ? "recipe" : "recipes"}
        </p>
      </div>

      {category.description && (
        <p className="text-gray-700 mb-8 text-lg">{category.description}</p>
      )}

      {recipes.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-500 text-lg">No recipes yet in this category.</p>
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
              { "@type": "ListItem", position: 2, name: "Categories", item: `${SITE_URL}/recipes/categories` },
              { "@type": "ListItem", position: 3, name: category.title, item: `${SITE_URL}/recipes/categories/${categorySlug}` },
            ],
          }),
        }}
      />
    </main>
  );
}
