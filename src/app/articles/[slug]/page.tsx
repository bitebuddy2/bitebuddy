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
import ArticleRecipeCard from "@/components/ArticleRecipeCard";
import ArticleProductCard from "@/components/ArticleProductCard";
import JumpToRecipeButton from "@/components/JumpToRecipeButton";

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
      {/* Jump to Recipe button - only shows if article has recipes */}
      {article.relatedRecipes && article.relatedRecipes.length > 0 && (
        <JumpToRecipeButton />
      )}
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
            block: {
              h2: ({ children }: any) => (
                <h2 className="text-3xl font-bold text-gray-900 mt-12 mb-6 pb-3 border-b-2 border-emerald-600">
                  {children}
                </h2>
              ),
              h3: ({ children }: any) => (
                <h3 className="text-2xl font-bold text-gray-900 mt-10 mb-4 flex items-center gap-3">
                  <span className="w-1 h-8 bg-emerald-600 rounded-full"></span>
                  {children}
                </h3>
              ),
              h4: ({ children }: any) => (
                <h4 className="text-xl font-semibold text-gray-800 mt-8 mb-3">
                  {children}
                </h4>
              ),
              blockquote: ({ children }: any) => (
                <blockquote className="border-l-4 border-emerald-600 pl-6 py-2 my-8 bg-emerald-50 rounded-r-lg italic text-gray-700">
                  {children}
                </blockquote>
              ),
              normal: ({ children }: any) => (
                <p className="text-gray-700 leading-relaxed mb-6">
                  {children}
                </p>
              ),
            },
            list: {
              bullet: ({ children }: any) => (
                <ul className="space-y-3 my-6 ml-6">
                  {children}
                </ul>
              ),
              number: ({ children }: any) => (
                <ol className="space-y-3 my-6 ml-6 list-decimal">
                  {children}
                </ol>
              ),
            },
            listItem: {
              bullet: ({ children }: any) => (
                <li className="flex items-start gap-3">
                  <span className="text-emerald-600 text-xl leading-none mt-1">•</span>
                  <span className="flex-1">{children}</span>
                </li>
              ),
              number: ({ children }: any) => (
                <li className="text-gray-700 ml-2">
                  {children}
                </li>
              ),
            },
            marks: {
              strong: ({ children }: any) => (
                <strong className="font-bold text-gray-900">{children}</strong>
              ),
              em: ({ children }: any) => (
                <em className="italic text-gray-700">{children}</em>
              ),
              code: ({ children }: any) => (
                <code className="bg-gray-100 text-emerald-700 px-2 py-1 rounded text-sm font-mono">
                  {children}
                </code>
              ),
              link: ({ children, value }: any) => (
                <a
                  href={value?.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-emerald-600 hover:text-emerald-700 underline font-medium"
                >
                  {children}
                </a>
              ),
            },
            types: {
              image: ({ value }: any) => (
                <div className="relative my-8 rounded-lg overflow-hidden shadow-md">
                  <Image
                    src={value.asset.url}
                    alt={value.alt || "Article image"}
                    width={value.asset.metadata?.dimensions?.width || 1200}
                    height={value.asset.metadata?.dimensions?.height || 800}
                    className="w-full"
                  />
                  {value.caption && (
                    <p className="text-center text-sm text-gray-600 mt-3 italic">{value.caption}</p>
                  )}
                </div>
              ),
              table: ({ value }: any) => (
                <div className="my-8 overflow-x-auto">
                  {value.caption && (
                    <p className="text-sm font-semibold text-gray-700 mb-3">{value.caption}</p>
                  )}
                  <table className="min-w-full border-collapse border border-gray-300 shadow-sm">
                    {value.hasHeader && value.rows?.length > 0 && (
                      <thead>
                        <tr className="bg-emerald-600">
                          {value.rows[0].cells?.map((cell: string, idx: number) => (
                            <th
                              key={idx}
                              className="border border-emerald-700 px-6 py-3 text-left text-sm font-bold text-white"
                            >
                              {cell}
                            </th>
                          ))}
                        </tr>
                      </thead>
                    )}
                    <tbody>
                      {value.rows?.slice(value.hasHeader ? 1 : 0).map((row: any, rowIdx: number) => (
                        <tr key={rowIdx} className={rowIdx % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                          {row.cells?.map((cell: string, cellIdx: number) => (
                            <td
                              key={cellIdx}
                              className="border border-gray-300 px-6 py-4 text-sm text-gray-700"
                            >
                              {cell}
                            </td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
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

      {/* Featured Recipes */}
      {article.relatedRecipes && article.relatedRecipes.length > 0 && (
        <section className="mb-12" data-recipes-section>
          <h2 className="text-3xl font-bold mb-6">Recipes Featured in This Article</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {article.relatedRecipes.map((recipe: any) => (
              <ArticleRecipeCard key={recipe._id} recipe={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* Affiliate Products */}
      {article.affiliateProducts && article.affiliateProducts.length > 0 && (
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-6">Recommended Products</h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {article.affiliateProducts.map((product: any) => (
              <ArticleProductCard key={product._id} product={product} />
            ))}
          </div>
          <p className="text-sm text-gray-600 mt-4 italic">
            We may earn a commission from purchases made through these links at no extra cost to you.
            This helps us continue creating great content for you!
          </p>
        </section>
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
