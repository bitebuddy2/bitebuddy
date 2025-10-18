import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import type { Metadata } from "next";

import { client } from "@/sanity/client";
import { guideBySlugQuery, guideSlugsQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import RecipeCard from "@/components/RecipeCard";
import GuideViewTracker from "@/components/GuideViewTracker";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

/* --------------- Static params / metadata --------------- */

export async function generateStaticParams() {
  const slugs = await client.fetch<Array<{ slug: string }>>(guideSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const guide = await client.fetch<any>(guideBySlugQuery, { slug });

  if (!guide) {
    return {
      title: "Guide not found | Bite Buddy",
      robots: { index: false },
    };
  }

  const title = `${guide.title} | Bite Buddy`;
  const description = guide.description || "Learn essential cooking techniques and kitchen skills.";
  const image = guide.heroImage?.asset?.url;
  const url = `${SITE_URL}/guides/${guide.slug}`;

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

export default async function GuidePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const guide = await client.fetch<any>(guideBySlugQuery, { slug });

  if (!guide) notFound();

  // Schema.org HowTo structured data
  const howToSchema = {
    "@context": "https://schema.org",
    "@type": "HowTo",
    name: guide.title,
    description: guide.description,
    image: guide.heroImage?.asset?.url ? [guide.heroImage.asset.url] : undefined,
    datePublished: guide._createdAt,
    dateModified: guide._updatedAt,
    step: (guide.steps || []).map((step: any, index: number) => ({
      "@type": "HowToStep",
      name: step.title,
      text: step.description,
      position: index + 1,
      image: step.image?.asset?.url,
      url: `${SITE_URL}/guides/${slug}#step-${index + 1}`,
    })),
    author: { "@type": "Organization", name: "Bite Buddy" },
    publisher: { "@type": "Organization", name: "Bite Buddy" },
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      {/* Track guide view for analytics */}
      <GuideViewTracker guideSlug={slug} guideTitle={guide.title} />

      <Link href="/guides" className="text-sm text-emerald-700 underline">
        ← Back to all guides
      </Link>

      <h1 className="mt-2 text-3xl font-bold">{guide.title}</h1>

      {guide.category && (
        <span className="inline-block mt-2 text-sm bg-emerald-100 text-emerald-800 px-3 py-1 rounded-full">
          {guide.category}
        </span>
      )}

      {guide.description && <p className="mt-4 text-gray-700 text-lg">{guide.description}</p>}

      {guide.heroImage?.asset?.url && (
        <Image
          src={guide.heroImage.asset.url}
          alt={guide.heroImage.alt || guide.title}
          width={1200}
          height={600}
          className="mt-6 w-full rounded-2xl border object-cover"
        />
      )}

      {/* Main content */}
      {guide.content && (
        <div className="mt-8 prose prose-lg prose-neutral max-w-none">
          <PortableText
            value={guide.content}
            components={{
              types: {
                image: ({ value }: any) => {
                  if (!value?.asset) return null;

                  // Get image URL - try direct URL first, fallback to urlForImage helper
                  const imageUrl = value.asset.url || urlForImage(value.asset).url();
                  const lqip = value.asset.metadata?.lqip;
                  const width = value.asset.metadata?.dimensions?.width || 1200;
                  const height = value.asset.metadata?.dimensions?.height || 800;

                  return (
                    <div className="relative my-8 rounded-xl overflow-hidden shadow-lg">
                      <Image
                        src={imageUrl}
                        alt={value.alt || value.caption || "Guide image"}
                        width={width}
                        height={height}
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 80vw, 1200px"
                        placeholder={lqip ? "blur" : "empty"}
                        blurDataURL={lqip}
                        className="w-full h-auto"
                        quality={90}
                      />
                      {value.caption && (
                        <p className="text-center text-sm text-gray-600 mt-4 italic px-4">{value.caption}</p>
                      )}
                    </div>
                  );
                },
              },
            }}
          />
        </div>
      )}

      {/* Steps */}
      {guide.steps && guide.steps.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-6">Step-by-Step Instructions</h2>
          <div className="space-y-8">
            {guide.steps.map((step: any, index: number) => (
              <div key={index} id={`step-${index + 1}`} className="border-l-4 border-emerald-500 pl-6">
                <h3 className="text-xl font-semibold mb-2">
                  Step {index + 1}: {step.title}
                </h3>
                <p className="text-gray-700">{step.description}</p>
                {step.image?.asset?.url && (
                  <Image
                    src={step.image.asset.url}
                    alt={step.image.alt || `Step ${index + 1}`}
                    width={800}
                    height={500}
                    className="mt-4 rounded-lg"
                  />
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      {/* Related recipes */}
      {guide.relatedRecipes && guide.relatedRecipes.length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-semibold mb-4">Related Recipes</h2>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {guide.relatedRecipes.map((recipe: any) => (
              <RecipeCard key={recipe.slug} r={recipe} />
            ))}
          </div>
        </section>
      )}

      {/* Schema.org HowTo structured data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(howToSchema) }}
      />

      {/* JSON-LD: Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Guides", item: `${SITE_URL}/guides` },
              { "@type": "ListItem", position: 2, name: guide.title, item: `${SITE_URL}/guides/${slug}` },
            ],
          }),
        }}
      />
    </main>
  );
}
