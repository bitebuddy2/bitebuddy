import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import type { Metadata } from "next";

import { client } from "@/sanity/client";
import { productBySlugQuery, productSlugsQuery } from "@/sanity/queries";
import ShareRow from "@/components/ShareRow";
import ArticleRecipeCard from "@/components/ArticleRecipeCard";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

const RETAILER_LABELS: Record<string, string> = {
  amazon: "Amazon",
  tesco: "Tesco",
  ocado: "Ocado",
  waitrose: "Waitrose",
  souschef: "Sous Chef",
  other: "Retailer",
};

const CATEGORY_LABELS: Record<string, string> = {
  "kitchen-essentials": "Kitchen Essentials",
  "specialty-ingredients": "Specialty Ingredients",
  "cookbooks": "Cookbooks",
  "appliances": "Appliances",
  "bakeware": "Bakeware",
  "cookware": "Cookware",
};

/* --------------- Static params / metadata --------------- */

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(productSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const product = await client.fetch<any>(productBySlugQuery, { slug });

  if (!product) {
    return {
      title: "Product not found | Bite Buddy",
      robots: { index: false },
    };
  }

  const title = `${product.title} | Bite Buddy`;
  const description = product.description || `Shop ${product.title} at ${product.retailer ? RETAILER_LABELS[product.retailer] || product.retailer : 'our partner retailers'}.`;
  const image = product.image?.asset?.url;
  const url = `${SITE_URL}/products/${product.slug}`;

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
      images: image ? [{ url: image }] : undefined,
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

export default async function ProductDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const product = await client.fetch<any>(productBySlugQuery, { slug });

  if (!product) notFound();

  const categoryLabel = product.category ? CATEGORY_LABELS[product.category] || product.category : null;
  const retailerLabel = product.retailer ? RETAILER_LABELS[product.retailer] || product.retailer : "Shop";

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <nav className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
          <ol className="flex items-center space-x-2 text-sm">
            <li>
              <Link href="/" className="text-gray-500 hover:text-gray-700 transition">
                Home
              </Link>
            </li>
            <li className="text-gray-400">/</li>
            <li>
              <Link href="/products" className="text-gray-500 hover:text-gray-700 transition">
                Products
              </Link>
            </li>
            {categoryLabel && (
              <>
                <li className="text-gray-400">/</li>
                <li className="text-gray-900 font-medium">{categoryLabel}</li>
              </>
            )}
          </ol>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Product Details Section */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 gap-8 p-8">
            {/* Product Image */}
            <div className="relative aspect-square bg-gray-50 rounded-lg overflow-hidden">
              {product.image?.asset?.url ? (
                <Image
                  src={product.image.asset.url}
                  alt={product.image.alt || product.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  placeholder={product.image.asset.metadata?.lqip ? "blur" : "empty"}
                  blurDataURL={product.image.asset.metadata?.lqip}
                  className="object-contain p-8"
                  priority
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <span className="text-gray-400">No image available</span>
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="flex flex-col">
              {/* Category Badge */}
              {categoryLabel && (
                <span className="inline-block w-fit text-xs font-semibold text-emerald-700 bg-emerald-50 px-3 py-1 rounded-full mb-4">
                  {categoryLabel}
                </span>
              )}

              {/* Title */}
              <h1 className="text-4xl font-bold text-gray-900 mb-4">
                {product.title}
              </h1>

              {/* Rating */}
              {product.rating && (
                <div className="flex items-center gap-2 mb-6">
                  <div className="flex items-center">
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        className={`w-6 h-6 ${i < Math.floor(product.rating) ? 'text-yellow-500' : 'text-gray-300'}`}
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                      </svg>
                    ))}
                  </div>
                  <span className="text-lg font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
                </div>
              )}

              {/* Description */}
              {product.description && (
                <p className="text-gray-700 text-lg leading-relaxed mb-6">
                  {product.description}
                </p>
              )}

              {/* Price */}
              {product.price && (
                <div className="mb-6">
                  <span className="text-5xl font-bold text-emerald-600">
                    £{product.price.toFixed(2)}
                  </span>
                </div>
              )}

              {/* CTA Buttons */}
              <div className="flex flex-col sm:flex-row gap-4 mb-6">
                {product.affiliateLink && (
                  <a
                    href={product.affiliateLink}
                    target="_blank"
                    rel="nofollow noopener noreferrer sponsored"
                    className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-bold text-lg px-8 py-4 rounded-lg hover:bg-emerald-700 transition-colors"
                  >
                    Buy on {retailerLabel}
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                    </svg>
                  </a>
                )}

                <ShareRow title={product.title} url={`${SITE_URL}/products/${product.slug}`} buttonText="Share" />
              </div>

              {/* Affiliate Disclosure */}
              {product.affiliateLink && (
                <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
                  <p className="text-sm text-amber-800 leading-relaxed">
                    <strong>Affiliate Disclosure:</strong> As an affiliate, we may earn a commission from qualifying purchases made through the link above. This helps support our site at no extra cost to you.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Related Recipes Section */}
        {product.relatedRecipes && product.relatedRecipes.length > 0 && (
          <section className="mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-6">
              Recipes Using This Product
            </h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {product.relatedRecipes.map((recipe: any) => (
                <ArticleRecipeCard key={recipe._id} recipe={recipe} />
              ))}
            </div>
          </section>
        )}

        {/* Back to Products Link */}
        <div className="text-center mt-8">
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium transition"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Back to All Products
          </Link>
        </div>
      </main>
    </div>
  );
}
