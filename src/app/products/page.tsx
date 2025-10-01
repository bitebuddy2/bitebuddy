"use client";

import Link from "next/link";
import { trackAffiliateClick } from "@/lib/analytics";

export default function ProductsPage() {
  function handleAffiliateClick(ingredient: string, retailer: string) {
    trackAffiliateClick(ingredient, retailer);
  }
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <header className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight">Products</h1>
        <p className="mt-2 text-gray-600">
          Discover recommended kitchen tools, ingredients, and cookbooks to help you recreate your favourite recipes.
        </p>
      </header>

      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {/* Placeholder product cards - can be populated from Sanity later */}
        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 h-48 rounded bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Product Image</span>
          </div>
          <h3 className="text-lg font-semibold">Kitchen Essentials</h3>
          <p className="mt-2 text-sm text-gray-600">
            Must-have tools for recreating restaurant-quality dishes at home.
          </p>
          <Link
            href="#"
            className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Learn More →
          </Link>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 h-48 rounded bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Product Image</span>
          </div>
          <h3 className="text-lg font-semibold">Specialty Ingredients</h3>
          <p className="mt-2 text-sm text-gray-600">
            Hard-to-find ingredients that make all the difference in copycat recipes.
          </p>
          <Link
            href="#"
            className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Learn More →
          </Link>
        </div>

        <div className="rounded-lg border bg-white p-6 shadow-sm">
          <div className="mb-4 h-48 rounded bg-gray-100 flex items-center justify-center">
            <span className="text-gray-400 text-sm">Product Image</span>
          </div>
          <h3 className="text-lg font-semibold">Cookbooks</h3>
          <p className="mt-2 text-sm text-gray-600">
            Curated collection of cookbooks for UK restaurant-style cooking.
          </p>
          <Link
            href="#"
            className="mt-4 inline-block text-sm font-medium text-emerald-600 hover:text-emerald-700"
          >
            Learn More →
          </Link>
        </div>
      </section>

      <section className="mt-12 rounded-lg bg-emerald-50 p-8 text-center">
        <h2 className="text-2xl font-semibold">Coming Soon</h2>
        <p className="mt-2 text-gray-700">
          We&apos;re curating the best products to help you succeed with copycat recipes. Check back soon!
        </p>
      </section>

      {/* Example affiliate tracking button (for testing GA conversion tracking) */}
      <section className="mt-12 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 p-8">
        <h3 className="text-lg font-semibold mb-4 text-center">
          🧪 Affiliate Tracking Demo
        </h3>
        <p className="text-sm text-gray-600 mb-6 text-center max-w-2xl mx-auto">
          Click the button below to test affiliate conversion tracking. This will fire an{" "}
          <code className="bg-gray-200 px-2 py-1 rounded">affiliate_click</code> event in
          Google Analytics with ingredient and retailer parameters.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
          <button
            onClick={() => handleAffiliateClick("Sausage meat", "Tesco")}
            className="px-6 py-3 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition"
          >
            Buy Sausage Meat at Tesco
          </button>
          <button
            onClick={() => handleAffiliateClick("Puff pastry", "Sainsbury's")}
            className="px-6 py-3 bg-orange-600 text-white font-semibold rounded-lg hover:bg-orange-700 transition"
          >
            Buy Puff Pastry at Sainsbury&apos;s
          </button>
        </div>
        <p className="text-xs text-gray-500 mt-4 text-center">
          After clicking, check GA4 → Reports → Engagement → Events to see <strong>affiliate_click</strong> events
        </p>
      </section>
    </main>
  );
}
