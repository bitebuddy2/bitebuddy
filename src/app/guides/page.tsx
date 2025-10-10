import React from "react";
import Link from "next/link";
import Image from "next/image";
import type { Metadata } from "next";
import { client } from "@/sanity/client";
import { allGuidesQuery } from "@/sanity/queries";

export const metadata: Metadata = {
  title: "Cooking Guides & Tips - Learn Kitchen Skills | Bite Buddy",
  description: "Master kitchen techniques and cooking methods with our comprehensive guides. From air fryer basics to knife skills and more.",
  openGraph: {
    title: "Cooking Guides & Tips - Learn Kitchen Skills | Bite Buddy",
    description: "Master kitchen techniques and cooking methods with our comprehensive guides. From air fryer basics to knife skills and more.",
  },
  twitter: {
    title: "Cooking Guides & Tips - Learn Kitchen Skills | Bite Buddy",
    description: "Master kitchen techniques and cooking methods with our comprehensive guides. From air fryer basics to knife skills and more.",
  },
};

export const revalidate = 60;

export default async function GuidesPage() {
  const guides = await client.fetch<any[]>(allGuidesQuery);

  return (
    <main className="mx-auto max-w-6xl px-4 py-8">
      <h1 className="text-4xl font-bold tracking-tight mb-2">Cooking Guides</h1>
      <p className="text-gray-600 text-lg mb-8">
        Master kitchen techniques and improve your cooking skills with our step-by-step guides.
      </p>

      {guides.length === 0 ? (
        <div className="text-center py-12 bg-gray-50 rounded-lg">
          <p className="text-gray-500">No guides yet. Check back soon!</p>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {guides.map((guide) => (
            <Link
              key={guide.slug}
              href={`/guides/${guide.slug}`}
              className="group bg-white rounded-lg border overflow-hidden hover:shadow-lg transition-shadow"
            >
              {guide.heroImage?.asset?.url && (
                <div className="relative h-48 overflow-hidden">
                  <Image
                    src={guide.heroImage.asset.url}
                    alt={guide.heroImage.alt || guide.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                </div>
              )}
              <div className="p-4">
                <h2 className="text-xl font-semibold mb-2 group-hover:text-emerald-600 transition-colors">
                  {guide.title}
                </h2>
                {guide.description && (
                  <p className="text-gray-600 text-sm line-clamp-2">{guide.description}</p>
                )}
                {guide.category && (
                  <span className="inline-block mt-3 text-xs bg-emerald-100 text-emerald-800 px-2 py-1 rounded-full">
                    {guide.category}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}

      <div className="mt-8">
        <Link href="/recipes" className="text-emerald-600 hover:underline">
          ← Back to recipes
        </Link>
      </div>
    </main>
  );
}
