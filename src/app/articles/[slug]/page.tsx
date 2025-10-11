import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import type { Metadata } from "next";

import { client } from "@/sanity/client";
import { articleBySlugQuery, articleSlugsQuery, relatedArticlesQuery } from "@/sanity/queries";
import ShareRow from "@/components/ShareRow";
import ArticleCard from "@/components/ArticleCard";
import AdPlaceholder from "@/components/AdPlaceholder";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

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

/* --------------- Static params / metadata --------------- */

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(articleSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const article = await client.fetch<any>(articleBySlugQuery, { slug });

  if (!article) {
    return {
      title: "Article not found | Bite Buddy",
      robots: { index: false },
    };
  }

  const title = article.seoTitle || `${article.title} | Bite Buddy`;
  const description = article.seoDescription || article.excerpt || "Read our latest food and cooking article.";
  const image = article.heroImage?.asset?.url;
  const url = `${SITE_URL}/articles/${article.slug}`;

  return {
    title,
    description,
    alternates: { canonical: url },
    openGraph: {
      title,
      description,
      url,
      siteName: "Bite Buddy",
      type: "article",
      images: image ? [{ url: image }] : undefined,
      publishedTime: article.publishedAt,
      modifiedTime: article._updatedAt,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: image ? [image] : undefined,
    },
  };
}

/* ---------------------- Page ---------------------- */

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const article = await client.fetch<any>(articleBySlugQuery, { slug });

  if (!article) notFound();

  const categoryLabel = CATEGORY_LABELS[article.category] || article.category;
  const publishedDate = article.publishedAt
    ? new Date(article.publishedAt).toLocaleDateString('en-GB', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : '';

  // Calculate reading time (approx 200 words per minute)
  const wordCount = article.content
    ?.map((block: any) => {
      if (block._type === "block" && Array.isArray(block.children)) {
        return block.children.map((c: any) => c?.text || "").join("");
      }
      return "";
    })
    .join(" ")
    .split(/\s+/)
    .filter(Boolean).length || 0;
  const readingTime = Math.ceil(wordCount / 200);

  // Fetch related articles
  const relatedArticles = await client.fetch<any[]>(relatedArticlesQuery, {
    category: article.category,
    currentSlug: article.slug,
  });

  // Article schema for SEO
  const articleSchema = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: article.title,
    description: article.excerpt,
    image: article.heroImage?.asset?.url,
    datePublished: article.publishedAt,
    dateModified: article._updatedAt,
    author: {
      "@type": "Person",
      name: article.author?.name || "Bite Buddy Team",
      description: article.author?.bio,
    },
    publisher: {
      "@type": "Organization",
      name: "Bite Buddy",
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      },
    },
    articleSection: categoryLabel,
    keywords: article.tags?.join(", "),
    wordCount,
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Breadcrumb */}
      <nav className="mb-6 text-sm text-gray-600">
        <Link href="/" className="hover:text-emerald-600">Home</Link>
        {" / "}
        <Link href="/articles" className="hover:text-emerald-600">Articles</Link>
        {" / "}
        <Link href={`/articles?category=${article.category}`} className="hover:text-emerald-600">{categoryLabel}</Link>
        {" / "}
        <span className="text-gray-900">{article.title}</span>
      </nav>

      {/* Category Badge */}
      <div className="mb-4">
        <Link
          href={`/articles?category=${article.category}`}
          className="inline-block rounded-full bg-emerald-600 px-4 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 transition-colors"
        >
          {categoryLabel}
        </Link>
      </div>

      {/* Title */}
      <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-4">{article.title}</h1>

      {/* Excerpt */}
      {article.excerpt && (
        <p className="text-xl text-gray-600 mb-6 leading-relaxed">{article.excerpt}</p>
      )}

      {/* Meta Info */}
      <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600 mb-6 pb-6 border-b">
        {article.author?.name && (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
            <span>By <strong>{article.author.name}</strong></span>
          </div>
        )}
        {publishedDate && (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
            </svg>
            <span>{publishedDate}</span>
          </div>
        )}
        {readingTime > 0 && (
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
            <span>{readingTime} min read</span>
          </div>
        )}
      </div>

      {/* Share Row */}
      <div className="mb-6">
        <ShareRow title={article.title} url={`${SITE_URL}/articles/${article.slug}`} />
      </div>

      {/* Top Ad - After Share Row */}
      <div className="mb-8">
        <AdPlaceholder size="leaderboard" />
      </div>

      {/* Hero Image */}
      {article.heroImage?.asset?.url && (
        <div className="relative aspect-[16/9] mb-8 rounded-2xl overflow-hidden">
          <Image
            src={article.heroImage.asset.url}
            alt={article.heroImage.alt || article.title}
            fill
            className="object-cover"
            priority
          />
        </div>
      )}

      {/* Article Content */}
      <article className="prose prose-lg prose-gray max-w-none mb-12">
        <PortableText
          value={article.content}
          components={{
            types: {
              image: ({ value }: any) => (
                <div className="relative my-8 rounded-lg overflow-hidden">
                  <Image
                    src={value.asset.url}
                    alt={value.alt || "Article image"}
                    width={value.asset.metadata?.dimensions?.width || 1200}
                    height={value.asset.metadata?.dimensions?.height || 800}
                    className="w-full"
                  />
                  {value.caption && (
                    <p className="text-center text-sm text-gray-600 mt-2">{value.caption}</p>
                  )}
                </div>
              ),
            },
          }}
        />
      </article>

      {/* Mid-Content Ad - After Article Content */}
      <div className="mb-12">
        <AdPlaceholder size="rectangle" className="mx-auto" />
      </div>

      {/* Tags */}
      {article.tags && article.tags.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-12 pb-8 border-b">
          <span className="text-sm font-semibold text-gray-700">Tags:</span>
          {article.tags.map((tag: string) => (
            <span key={tag} className="inline-block rounded-full bg-gray-100 px-3 py-1 text-sm text-gray-700">
              {tag}
            </span>
          ))}
        </div>
      )}

      {/* Bottom Ad - Before Related Articles */}
      <div className="mb-12">
        <AdPlaceholder size="leaderboard" />
      </div>

      {/* Related Articles */}
      {relatedArticles.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Related Articles</h2>
          <div className="grid gap-6 md:grid-cols-3">
            {relatedArticles.map((relatedArticle) => (
              <ArticleCard key={relatedArticle._id} article={relatedArticle} />
            ))}
          </div>
        </section>
      )}

      {/* JSON-LD: Article Schema */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(articleSchema) }}
      />

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
              { "@type": "ListItem", position: 3, name: categoryLabel, item: `${SITE_URL}/articles?category=${article.category}` },
              { "@type": "ListItem", position: 4, name: article.title, item: `${SITE_URL}/articles/${slug}` },
            ],
          }),
        }}
      />
    </main>
  );
}
