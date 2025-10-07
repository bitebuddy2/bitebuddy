import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import type { Metadata } from "next";

import { client } from "@/sanity/client";
import { recipeBySlugQuery, recipeSlugsQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import StarRating from "@/components/StarRating";
import ShareRow from "@/components/ShareRow";
import SaveButton from "@/components/SaveButton";
import AffiliateButton from "@/components/AffiliateButton";
import AdPlaceholder from "@/components/AdPlaceholder";

// 👇 use ONE of these imports depending on which fix you chose:
// Option A: relative import (quick fix)
// use alias (recommended, since you updated tsconfig)
import type { Recipe, RecipeSlug, IngredientGroup, IngredientItem, Step } from "@/sanity.types";
// Option B: keep alias after tsconfig fix
// import type { Recipe, RecipeSlug, IngredientGroup } from "@/sanity.types";

/* ---------------- Helpers ---------------- */

function portableToPlainText(blocks: unknown): string {
  if (!Array.isArray(blocks)) return "";
  return (blocks as any[])
    .map((b) => {
      if (typeof b === "string") return b;
      if ((b as any)?._type === "block" && Array.isArray((b as any).children)) {
        return (b as any).children.map((c: any) => c?.text || "").join("");
      }
      return "";
    })
    .join("\n")
    .trim();
}

function hasNutrition(n?: { calories?: number; protein?: number; fat?: number; carbs?: number }) {
  if (!n) return false;
  return ["calories", "protein", "fat", "carbs"].some((k) => n[k as keyof typeof n] != null);
}

function ingredientLines(groups: IngredientGroup[] | undefined) {
  if (!groups) return [];
  const out: string[] = [];
  for (const group of groups) {
    for (const item of group.items || []) {
      const name = item.ingredientText || item.ingredientRef?.name || "Ingredient";
      const qtyUnit = [item.quantity, item.unit].filter(Boolean).join(" ");
      const label = [qtyUnit, name, item.notes].filter(Boolean).join(" ");
      out.push(label);
    }
  }
  return out;
}

function toPlainIngredients(groups: IngredientGroup[] = []): string[] {
  return groups
    .flatMap(group => group.items || [])
    .map((item) => {
      const amt = [item.quantity, item.unit].filter(Boolean).join(" ");
      const name = item.ingredientText || item.ingredientRef?.name || "";
      return [amt, name].filter(Boolean).join(" ");
    })
    .filter(Boolean);
}

function totalTimeISO(prep?: number, cook?: number) {
  const total = (prep || 0) + (cook || 0);
  return total ? `PT${total}M` : undefined;
}

/* --------------- Static params / metadata --------------- */

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

export async function generateStaticParams() {
  const slugs = await client.fetch<RecipeSlug[]>(recipeSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const recipe = await client.fetch<Recipe | null>(recipeBySlugQuery, { slug });

  if (!recipe) {
    return {
      title: "Recipe not found | Bite Buddy",
      robots: { index: false }, // Keep 404 pages noindexed
    };
  }

  const title = `${recipe.title} | Bite Buddy`;
  const description =
    recipe.seoDescription || recipe.description || recipe.introText || "UK copycat recipes made easy.";
  const image = recipe.heroImage?.asset?.url;
  const url = `${SITE_URL}/recipes/${recipe.slug}`;

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

export default async function RecipePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const recipe = await client.fetch<Recipe | null>(recipeBySlugQuery, { slug });

  // TEMP DEBUG: Log what we actually received
  if (process.env.NODE_ENV === 'development') {
    console.log('🔍 FRONTEND DEBUG - Recipe data received:');
    console.log('  Title:', recipe?.title);
    console.log('  Ingredients:', JSON.stringify(recipe?.ingredients, null, 2));

    // Debug each ingredient item specifically
    recipe?.ingredients?.forEach((group, gi) => {
      console.log(`Group ${gi + 1}:`, group.heading || '(no heading)');
      group.items?.forEach((item, ii) => {
        const name = item.ingredientText || item.ingredientRef?.name || "Ingredient";
        console.log(`  Item ${ii + 1}: ${item.quantity} ${item.unit} ${name}`);
        if (name === "Ingredient") {
          console.warn(`  ⚠️ Fallback used for item ${ii + 1}:`, {
            ingredientText: item.ingredientText,
            ingredientRef: item.ingredientRef,
            hasRef: !!item.ingredientRef,
            refName: item.ingredientRef?.name
          });
        }
      });
    });
  }

  if (!recipe) notFound();

  const {
    title, description, heroImage, servings, prepMin, cookMin,
    introText, brandContext, ingredients, steps, tips, faqs, nutrition, categories
  } = recipe;

  const totalMin = (prepMin || 0) + (cookMin || 0);

  const heroUrl =
    heroImage?.asset?.url ??
    (heroImage ? urlForImage(heroImage).width(1200).height(700).url() : undefined);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "Recipe",
    name: recipe.title,
    description: recipe.description || recipe.introText,
    datePublished: (recipe as any)._createdAt,
    dateModified: (recipe as any)._updatedAt,
    recipeCuisine: "British",
    recipeCategory: "Main course",
    recipeYield: recipe.servings ? String(recipe.servings) : undefined,
    prepTime: recipe.prepMin ? `PT${recipe.prepMin}M` : undefined,
    cookTime: recipe.cookMin ? `PT${recipe.cookMin}M` : undefined,
    totalTime: totalTimeISO(recipe.prepMin, recipe.cookMin),
    image: recipe.heroImage?.asset?.url ? [recipe.heroImage.asset.url] : undefined,
    author: { "@type": "Organization", name: "Bite Buddy" },
    publisher: { "@type": "Organization", name: "Bite Buddy" },
    recipeIngredient: toPlainIngredients(recipe.ingredients),
    recipeInstructions: (recipe.steps || []).map((s, idx: number) => ({
      "@type": "HowToStep",
      position: idx + 1,
      text: portableToPlainText(s.step),
      url: `${SITE_URL}/recipes/${recipe.slug}#step-${idx + 1}`,
      image: s.stepImage?.asset?.url || recipe.heroImage?.asset?.url,
    })),
    keywords: recipe.categories?.map((c: any) => c.title).join(", ") || undefined,
    nutrition: hasNutrition(recipe.nutrition) ? {
      "@type": "NutritionInformation",
      calories: recipe.nutrition?.calories ? `${recipe.nutrition.calories} calories` : undefined,
      proteinContent: recipe.nutrition?.protein ? `${recipe.nutrition.protein} g` : undefined,
      fatContent: recipe.nutrition?.fat ? `${recipe.nutrition.fat} g` : undefined,
      carbohydrateContent: recipe.nutrition?.carbs ? `${recipe.nutrition.carbs} g` : undefined,
    } : undefined,
    aggregateRating:
      typeof recipe.ratingSum === "number" && typeof recipe.ratingCount === "number" && recipe.ratingCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (recipe.ratingSum / recipe.ratingCount).toFixed(1),
            ratingCount: recipe.ratingCount,
          }
        : undefined,
  };

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/recipes" className="text-sm text-emerald-700 underline">
        ← Back to all recipes
      </Link>

      <h1 className="mt-2 text-3xl font-bold">{title}</h1>
      {description && <p className="mt-2 text-gray-700">{description}</p>}

      {categories && categories.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {categories.map((category: any) => (
            <span
              key={category._id}
              className="inline-block rounded-full bg-emerald-100 px-3 py-1 text-xs font-medium text-emerald-800"
            >
              {category.title}
            </span>
          ))}
        </div>
      )}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        {servings ? <span>Serves: {servings}</span> : null}
        {prepMin != null ? <span>Prep: {prepMin} mins</span> : null}
        {cookMin != null ? <span>Cook: {cookMin} mins</span> : null}
        {totalMin ? <span>Total: {totalMin} mins</span> : null}
      </div>

      <div className="mt-4 flex flex-wrap items-center gap-3">
        <ShareRow title={recipe.title} url={`${SITE_URL}/recipes/${recipe.slug}`} />
        <SaveButton recipeSlug={recipe.slug} />
      </div>

      <div className="mt-4">
        <StarRating
          recipeId={recipe._id}
          ratingSum={recipe.ratingSum || 0}
          ratingCount={recipe.ratingCount || 0}
          slug={recipe.slug}
        />
      </div>

      {heroUrl ? (
        <Image
          src={heroUrl}
          alt={heroImage?.alt || title}
          width={1200}
          height={700}
          className="mt-6 w-full rounded-2xl border object-cover"
        />
      ) : null}

      {introText ? (
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-semibold tracking-tight">Why you’ll love it</h2>
          <p className="text-gray-800">{introText}</p>
        </section>
      ) : null}

      {brandContext && brandContext.length > 0 ? (
        <section className="mt-6">
          <h2 className="mb-2 text-xl font-semibold tracking-tight">About the original</h2>
          <div className="prose prose-neutral">
            <PortableText value={brandContext} />
          </div>
        </section>
      ) : null}

      <hr className="mt-8 border-gray-200" />

      {/* Ad before recipe content */}
      <div className="mt-8 mb-6">
        <AdPlaceholder size="leaderboard" />
      </div>

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        <section className="rounded-2xl border p-4">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Ingredients</h2>

          {Array.isArray(ingredients) && ingredients.length > 0 ? (
            <div className="space-y-5">
              {ingredients.map((group: IngredientGroup, gi: number) => (
                <div key={gi}>
                  {group.heading ? <h4 className="mb-2 font-semibold">{group.heading}</h4> : null}
                  <ul className="space-y-2 text-sm">
                    {group.items?.map((it, ii: number) => {
                      const name = it.ingredientText || it.ingredientRef?.name || "Ingredient";
                      const qtyUnit = [it.quantity, it.unit].filter(Boolean).join(" ");
                      const label = [qtyUnit, name].filter(Boolean).join(" ");

                      // Debug: warn in development if ingredient data is missing
                      if (process.env.NODE_ENV === 'development' && name === "Ingredient") {
                        console.warn(`Missing ingredient data for item ${ii + 1} in ${recipe.title}:`, {
                          ingredientText: it.ingredientText,
                          ingredientRef: it.ingredientRef,
                          quantity: it.quantity,
                          unit: it.unit
                        });
                      }

                      return (
                        <li key={ii} className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600 flex-shrink-0" />
                          <div className="flex-1">
                            <div>
                              <strong>{label}</strong>
                              {it.notes ? ` — ${it.notes}` : ""}
                            </div>

                            {/* Affiliate retailer buttons */}
                            {it.ingredientRef?.retailerLinks && it.ingredientRef.retailerLinks.length > 0 && (
                              <div className="mt-2 flex flex-wrap gap-2">
                                {it.ingredientRef.retailerLinks.map((link, linkIdx: number) => (
                                  <AffiliateButton
                                    key={linkIdx}
                                    url={link.url}
                                    retailer={link.retailer}
                                    ingredient={name}
                                    recipe={recipe.slug}
                                    brand={recipe.brand?.title}
                                    label={link.label || `Buy at ${link.retailer}`}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No ingredients listed.</p>
          )}
        </section>

        <section className="rounded-2xl border p-4">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Method</h2>
          {Array.isArray(steps) && steps.length > 0 ? (
            <ol className="list-decimal space-y-5 pl-5 text-sm">
              {steps.map((s, i: number) => (
                <li key={i}>
                  <div className="prose prose-neutral">
                    <PortableText value={s.step} />
                  </div>
                  {s.stepImage?.asset?.url ? (
                    <Image
                      src={s.stepImage.asset.url}
                      alt={s.stepImage.alt || `Step ${i + 1}`}
                      width={s.stepImage.asset.metadata?.dimensions?.width || 1200}
                      height={s.stepImage.asset.metadata?.dimensions?.height || 800}
                      className="mt-2 rounded-lg"
                    />
                  ) : null}
                </li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-600">No instructions yet.</p>
          )}
        </section>
      </div>

      {!!(tips && tips.length) && (
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-semibold tracking-tight">Tips & Variations</h2>
          <ul className="list-disc pl-5 text-sm text-gray-800">
            {tips.map((t: string, i: number) => <li key={i}>{t}</li>)}
          </ul>
        </section>
      )}

      {!!(faqs && faqs.length) && (
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-semibold tracking-tight">FAQs</h2>
          <dl className="text-sm">
            {faqs.map((f: { question: string; answer: string }, i: number) => (
              <div key={i} className="mb-3">
                <dt className="font-semibold">{f.question}</dt>
                <dd>{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {hasNutrition(nutrition) && (
        <section className="mt-8">
          <h2 className="mb-2 text-xl font-semibold tracking-tight">Nutrition (per serving)</h2>
          <table className="min-w-full border text-sm">
            <tbody>
              {nutrition?.calories != null && (
                <tr>
                  <th className="text-left p-2 border">Calories</th>
                  <td className="p-2 border">{nutrition.calories} kcal</td>
                </tr>
              )}
              {nutrition?.protein != null && (
                <tr>
                  <th className="text-left p-2 border">Protein</th>
                  <td className="p-2 border">{nutrition.protein} g</td>
                </tr>
              )}
              {nutrition?.fat != null && (
                <tr>
                  <th className="text-left p-2 border">Fat</th>
                  <td className="p-2 border">{nutrition.fat} g</td>
                </tr>
              )}
              {nutrition?.carbs != null && (
                <tr>
                  <th className="text-left p-2 border">Carbs</th>
                  <td className="p-2 border">{nutrition.carbs} g</td>
                </tr>
              )}
            </tbody>
          </table>
        </section>
      )}

      {/* Ad at end of recipe */}
      <div className="mt-8">
        <AdPlaceholder size="rectangle" />
      </div>

      {/* JSON-LD: Recipe */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
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
              { "@type": "ListItem", position: 2, name: title, item: `${SITE_URL}/recipes/${slug}` },
            ],
          }),
        }}
      />
    </main>
  );
}
