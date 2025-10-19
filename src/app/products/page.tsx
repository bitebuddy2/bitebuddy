import Image from "next/image";
import Link from "next/link";
import { client } from "@/sanity/client";
import { allProductsQuery } from "@/sanity/queries";
import AffiliateButton from "@/components/AffiliateButton";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Recommended Kitchen Products | Bite Buddy",
  description: "Discover recommended kitchen tools, ingredients, and cookbooks to help you recreate your favourite recipes.",
  alternates: {
    canonical: "/products",
  },
};

type Product = {
  _id: string;
  title: string;
  slug: string;
  description: string;
  image?: {
    asset?: {
      url: string;
      metadata?: { lqip?: string };
    };
    alt?: string;
  };
  category: string;
  price: number;
  affiliateLink: string;
  retailer: string;
  featured?: boolean;
  rating?: number;
};

const categoryLabels: Record<string, string> = {
  "kitchen-essentials": "Kitchen Essentials",
  "specialty-ingredients": "Specialty Ingredients",
  "cookbooks": "Cookbooks",
  "appliances": "Appliances",
  "bakeware": "Bakeware",
  "cookware": "Cookware",
};

export const revalidate = 60;

export default async function ProductsPage() {
  const products: Product[] = await client.fetch(allProductsQuery);

  // Group products by category
  const productsByCategory = products.reduce((acc, product) => {
    if (!acc[product.category]) {
      acc[product.category] = [];
    }
    acc[product.category].push(product);
    return acc;
  }, {} as Record<string, Product[]>);

  const hasProducts = products.length > 0;

  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Products</h1>
        <p className="mt-2 text-gray-600">
          Discover recommended kitchen tools, ingredients, and cookbooks to help you recreate your favourite recipes.
        </p>
      </header>

      {!hasProducts ? (
        // Show placeholder when no products exist
        <>
          <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 h-48 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                <Image
                  src="/Coming soon.png"
                  alt="Kitchen Essentials - Coming Soon"
                  width={400}
                  height={192}
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold">Kitchen Essentials</h3>
              <p className="mt-2 text-sm text-gray-600">
                Must-have tools for recreating restaurant-quality dishes at home.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 h-48 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                <Image
                  src="/Coming soon.png"
                  alt="Specialty Ingredients - Coming Soon"
                  width={400}
                  height={192}
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold">Specialty Ingredients</h3>
              <p className="mt-2 text-sm text-gray-600">
                Hard-to-find ingredients that make all the difference in copycat recipes.
              </p>
            </div>

            <div className="rounded-lg border bg-white p-6 shadow-sm">
              <div className="mb-4 h-48 rounded bg-gray-100 flex items-center justify-center overflow-hidden">
                <Image
                  src="/Coming soon.png"
                  alt="Cookbooks - Coming Soon"
                  width={400}
                  height={192}
                  className="object-contain w-full h-full"
                />
              </div>
              <h3 className="text-lg font-semibold">Cookbooks</h3>
              <p className="mt-2 text-sm text-gray-600">
                Curated collection of cookbooks for UK restaurant-style cooking.
              </p>
            </div>
          </section>

          <section className="mt-12 rounded-lg bg-emerald-50 p-8 text-center">
            <h2 className="text-2xl font-semibold">Coming Soon</h2>
            <p className="mt-2 text-gray-700">
              We&apos;re curating the best products to help you succeed with copycat recipes. Check back soon!
            </p>
          </section>
        </>
      ) : (
        // Show actual products
        <>
          {/* Featured Products */}
          {products.some((p) => p.featured) && (
            <section className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">Featured Products</h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {products
                  .filter((product) => product.featured)
                  .map((product) => (
                    <ProductCard key={product._id} product={product} />
                  ))}
              </div>
            </section>
          )}

          {/* Products by Category */}
          {Object.entries(productsByCategory).map(([category, categoryProducts]) => (
            <section key={category} className="mb-12">
              <h2 className="mb-6 text-2xl font-bold">
                {categoryLabels[category] || category}
              </h2>
              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {categoryProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </section>
          ))}
        </>
      )}
    </main>
  );
}

function ProductCard({ product }: { product: Product }) {
  return (
    <article className="group rounded-lg border bg-white shadow-sm transition hover:shadow-md overflow-hidden">
      <Link href={`/products/${product.slug}`} className="block">
        {/* Product Image */}
        <div className="mb-4 h-48 bg-gray-100 flex items-center justify-center overflow-hidden">
          {product.image?.asset?.url ? (
            <Image
              src={product.image.asset.url}
              alt={product.image.alt || product.title}
              width={400}
              height={192}
              className="object-cover w-full h-full transition-transform duration-300 group-hover:scale-105"
              placeholder={product.image.asset.metadata?.lqip ? "blur" : "empty"}
              blurDataURL={product.image.asset.metadata?.lqip}
            />
          ) : (
            <div className="flex items-center justify-center h-full w-full bg-gray-200 text-gray-400">
              <svg className="w-16 h-16" fill="currentColor" viewBox="0 0 20 20">
                <path
                  fillRule="evenodd"
                  d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          )}
        </div>
      </Link>

      {/* Product Info */}
      <div className="p-6 pt-0">
        <Link href={`/products/${product.slug}`}>
          <h3 className="text-lg font-semibold line-clamp-2 mb-2 group-hover:text-emerald-600 transition-colors">
            {product.title}
          </h3>
        </Link>
        <p className="text-sm text-gray-600 line-clamp-3 mb-4">{product.description}</p>

        {/* Rating */}
        {product.rating && (
          <div className="mb-3 flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <svg
                key={i}
                className={`w-4 h-4 ${
                  i < Math.floor(product.rating || 0) ? "text-yellow-400" : "text-gray-300"
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            ))}
            <span className="ml-1 text-sm text-gray-600">({product.rating})</span>
          </div>
        )}

        {/* Price and CTA */}
        <div className="flex items-center justify-between gap-3">
          <span className="text-xl font-bold text-emerald-600">£{product.price.toFixed(2)}</span>
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium text-sm transition-colors"
          >
            View Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>
      </div>
    </article>
  );
}
