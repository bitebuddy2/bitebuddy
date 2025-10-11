"use client";

import React, { useState, useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import { client } from "@/sanity/client";
import { allArticlesQuery } from "@/sanity/queries";
import ArticleCard from "@/components/ArticleCard";
import ArticleSearch from "@/components/ArticleSearch";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

interface Article {
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
  featured?: boolean;
}

const CATEGORIES = [
  { value: "all", label: "All Articles" },
  { value: "cooking-techniques", label: "Cooking Techniques" },
  { value: "ingredient-guides", label: "Ingredient Guides" },
  { value: "food-trends", label: "Food Trends" },
  { value: "meal-prep-planning", label: "Meal Prep & Planning" },
  { value: "healthy-eating", label: "Healthy Eating" },
  { value: "copycat-secrets", label: "Restaurant Secrets" },
  { value: "kitchen-equipment", label: "Kitchen Equipment" },
  { value: "seasonal-cooking", label: "Seasonal Cooking" },
];

function ArticlesContent() {
  const searchParams = useSearchParams();
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);
  const category = searchParams.get('category');

  useEffect(() => {
    async function fetchArticles() {
      try {
        const data = await client.fetch<Article[]>(allArticlesQuery);
        setArticles(data || []);
      } catch (error) {
        console.error('Error fetching articles:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  // Filter by category if specified
  const filteredArticles = category && category !== "all"
    ? articles.filter((article) => article.category === category)
    : articles;

  // Separate featured and regular articles
  const featuredArticles = filteredArticles.filter((a) => a.featured);
  const regularArticles = filteredArticles.filter((a) => !a.featured);

  if (loading) {
    return (
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading articles...</span>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-6xl">
      {/* Search Bar */}
      <div className="mb-6">
        <ArticleSearch />
      </div>

      <div className="px-4 py-8">
        <div className="mb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-2">Food & Cooking Articles</h1>
          <p className="text-gray-600 text-lg">
            Expert tips, trending topics, and techniques to elevate your cooking
          </p>
        </div>

        {/* Category Filter */}
        <div className="mb-8 flex flex-wrap gap-2">
          {CATEGORIES.map((cat) => (
            <a
              key={cat.value}
              href={cat.value === "all" ? "/articles" : `/articles?category=${cat.value}`}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                (!category && cat.value === "all") || category === cat.value
                  ? "bg-emerald-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {cat.label}
            </a>
          ))}
        </div>

      {filteredArticles.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500 text-lg">No articles yet. Check back soon!</p>
        </div>
      ) : (
        <>
          {/* Featured Articles */}
          {featuredArticles.length > 0 && (
            <section className="mb-12">
              <h2 className="text-2xl font-bold mb-6">Featured Articles</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {featuredArticles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            </section>
          )}

          {/* Regular Articles */}
          {regularArticles.length > 0 && (
            <section>
              {featuredArticles.length > 0 && (
                <h2 className="text-2xl font-bold mb-6">Latest Articles</h2>
              )}
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {regularArticles.map((article) => (
                  <ArticleCard key={article._id} article={article} />
                ))}
              </div>
            </section>
          )}
        </>
      )}

        {/* JSON-LD: Breadcrumbs */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              itemListElement: [
                { "@type": "ListItem", position: 1, name: "Home", item: `${SITE_URL}` },
                { "@type": "ListItem", position: 2, name: "Articles", item: `${SITE_URL}/articles` },
              ],
            }),
          }}
        />
      </div>
    </main>
  );
}

export default function ArticlesPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading articles...</span>
          </div>
        </div>
      </main>
    }>
      <ArticlesContent />
    </Suspense>
  );
}
