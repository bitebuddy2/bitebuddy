import React from "react";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import type { Metadata } from "next";

import { client } from "@/sanity/client";
import { recipeBySlugQuery, recipeSlugsQuery, relatedRecipesByBrandQuery, relatedRecipesQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";
import StarRating from "@/components/StarRating";
import ShareRow from "@/components/ShareRow";
import SaveButton from "@/components/SaveButton";
import AffiliateButton from "@/components/AffiliateButton";
import AdPlaceholder from "@/components/AdPlaceholder";
import CommentSection from "@/components/CommentSection";
import RecipeViewTracker from "@/components/RecipeViewTracker";
import PrintButton from "@/components/PrintButton";
import RecipeShoppingListButton from "@/components/RecipeShoppingListButton";
import MobileRecipeActions from "@/components/MobileRecipeActions";
import StickyRecipeHeader from "@/components/StickyRecipeHeader";
import RelatedRecipes from "@/components/RelatedRecipes";
import RecipeViewPrompt from "@/components/RecipeViewPrompt";
import ExitIntentPrompt from "@/components/ExitIntentPrompt";
import RecipeIngredients from "@/components/RecipeInteractions";
import CookingModeToggle from "@/components/CookingModeToggle";
import AddToCollectionButton from "@/components/AddToCollectionButton";
import { supabase } from "@/lib/supabase";

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

  // Get save count for social proof
  const { count: saveCount } = await supabase
    .from("saved_recipes")
    .select("*", { count: "exact", head: true })
    .eq("recipe_slug", recipe.slug);

  // Fetch related recipes - prioritize brand-only if brand exists
  const relatedRecipes = recipe.brand
    ? await client.fetch<any[]>(relatedRecipesByBrandQuery, {
        currentSlug: recipe.slug,
        brandId: recipe.brand._id,
      })
    : await client.fetch<any[]>(relatedRecipesQuery, {
        currentSlug: recipe.slug,
        brandId: undefined,
        categoryIds: recipe.categories?.map((c: any) => c._id) || [],
      });

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
    recipeCategory: recipe.categories?.[0]?.title || "Main course",
    recipeYield: recipe.servings ? String(recipe.servings) : undefined,
    prepTime: recipe.prepMin ? `PT${recipe.prepMin}M` : undefined,
    cookTime: recipe.cookMin ? `PT${recipe.cookMin}M` : undefined,
    totalTime: totalTimeISO(recipe.prepMin, recipe.cookMin),
    image: recipe.heroImage?.asset?.url ? [recipe.heroImage.asset.url] : undefined,
    author: {
      "@type": "Organization",
      name: "Bite Buddy",
      url: SITE_URL,
    },
    publisher: {
      "@type": "Organization",
      name: "Bite Buddy",
      url: SITE_URL,
      logo: {
        "@type": "ImageObject",
        url: `${SITE_URL}/logo.png`,
      }
    },
    recipeIngredient: toPlainIngredients(recipe.ingredients),
    recipeInstructions: (recipe.steps || []).map((s, idx: number) => ({
      "@type": "HowToStep",
      name: `Step ${idx + 1}`,
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
      servingSize: recipe.servings ? `${recipe.servings} servings` : undefined,
    } : undefined,
    aggregateRating:
      typeof recipe.ratingSum === "number" && typeof recipe.ratingCount === "number" && recipe.ratingCount > 0
        ? {
            "@type": "AggregateRating",
            ratingValue: (recipe.ratingSum / recipe.ratingCount).toFixed(1),
            ratingCount: recipe.ratingCount,
            bestRating: "5",
            worstRating: "1",
          }
        : undefined,
    isAccessibleForFree: true,
    suitableForDiet: recipe.categories?.some((c: any) => c.title.toLowerCase().includes('vegan')) ? "https://schema.org/VeganDiet" :
                      recipe.categories?.some((c: any) => c.title.toLowerCase().includes('vegetarian')) ? "https://schema.org/VegetarianDiet" :
                      undefined,
  };

  return (
    <main className="mx-auto max-w-4xl px-5 md:px-4 py-6 md:py-8">
      {/* Track recipe view for analytics */}
      <RecipeViewTracker
        recipeSlug={recipe.slug}
        recipeTitle={recipe.title}
        brand={recipe.brand?.title}
        categories={recipe.categories?.map((c: any) => c.title)}
      />

      {/* Mobile floating action buttons */}
      <MobileRecipeActions
        recipeSlug={recipe.slug}
        recipeTitle={recipe.title}
        brand={recipe.brand?.title}
      />

      {/* Sticky header with key actions (desktop only) */}
      <StickyRecipeHeader
        recipeSlug={recipe.slug}
        recipeTitle={recipe.title}
        brand={recipe.brand?.title}
      />

      {/* Breadcrumb Navigation */}
      <nav className="mb-4 text-sm md:text-sm text-gray-600">
        <Link href="/" className="hover:text-emerald-600">Home</Link>
        <span className="hidden sm:inline"> / </span>
        <span className="sm:hidden"> › </span>
        <Link href="/recipes" className="hover:text-emerald-600">Recipes</Link>
        {recipe.brand && (
          <>
            <span className="hidden sm:inline"> / </span>
            <span className="sm:hidden"> › </span>
            <Link href={`/recipes/brands/${recipe.brand.slug}`} className="hover:text-emerald-600 max-w-[100px] sm:max-w-none inline-block truncate align-bottom">
              {recipe.brand.title}
            </Link>
          </>
        )}
      </nav>

      <h1 className="mt-2 text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold leading-tight">{title}</h1>

      {/* User credit for AI-generated community recipes */}
      {(recipe as any).createdBy && (
        <div className="mt-3 flex flex-wrap items-center gap-2 text-sm text-gray-600">
          <span className="inline-flex items-center gap-1.5 rounded-full bg-emerald-50 px-3 py-1 text-emerald-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
            </svg>
            <span>Created by <strong>{(recipe as any).createdBy.userName}</strong></span>
          </span>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-purple-50 px-3 py-1 text-purple-700">
            <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
              <path d="M13 7H7v6h6V7z" />
              <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd" />
            </svg>
            <span>AI Generated</span>
          </span>
          {(recipe as any)._createdAt && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-gray-100 px-3 py-1 text-gray-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M6 2a1 1 0 00-1 1v1H4a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-1V3a1 1 0 10-2 0v1H7V3a1 1 0 00-1-1zm0 5a1 1 0 000 2h8a1 1 0 100-2H6z" clipRule="evenodd" />
              </svg>
              <span>{new Date((recipe as any)._createdAt).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}</span>
            </span>
          )}
          {/* Cooking preferences badges */}
          {(recipe as any).createdBy?.spiceLevel && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-orange-50 px-3 py-1 text-orange-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path d="M13.586 3.586a2 2 0 112.828 2.828l-.793.793-2.828-2.828.793-.793zM11.379 5.793L3 14.172V17h2.828l8.38-8.379-2.83-2.828z" />
              </svg>
              <span>{(recipe as any).createdBy.spiceLevel} Spice</span>
            </span>
          )}
          {(recipe as any).createdBy?.dietaryPreference && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-blue-50 px-3 py-1 text-blue-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M3 3a1 1 0 000 2v8a2 2 0 002 2h2.586l-1.293 1.293a1 1 0 101.414 1.414L10 15.414l2.293 2.293a1 1 0 001.414-1.414L12.414 15H15a2 2 0 002-2V5a1 1 0 100-2H3zm11 4a1 1 0 10-2 0v4a1 1 0 102 0V7zm-3 1a1 1 0 10-2 0v3a1 1 0 102 0V8zM8 9a1 1 0 00-2 0v2a1 1 0 102 0V9z" clipRule="evenodd" />
              </svg>
              <span>{(recipe as any).createdBy.dietaryPreference}</span>
            </span>
          )}
          {(recipe as any).createdBy?.cookingMethod && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-3 py-1 text-indigo-700">
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M12.395 2.553a1 1 0 00-1.45-.385c-.345.23-.614.558-.822.88-.214.33-.403.713-.57 1.116-.334.804-.614 1.768-.84 2.734a31.365 31.365 0 00-.613 3.58 2.64 2.64 0 01-.945-1.067c-.328-.68-.398-1.534-.398-2.654A1 1 0 005.05 6.05 6.981 6.981 0 003 11a7 7 0 1011.95-4.95c-.592-.591-.98-.985-1.348-1.467-.363-.476-.724-1.063-1.207-2.03zM12.12 15.12A3 3 0 017 13s.879.5 2.5.5c0-1 .5-4 1.25-4.5.5 1 .786 1.293 1.371 1.879A2.99 2.99 0 0113 13a2.99 2.99 0 01-.879 2.121z" clipRule="evenodd" />
              </svg>
              <span>{(recipe as any).createdBy.cookingMethod}</span>
            </span>
          )}
        </div>
      )}

      {description && <p className="mt-2 text-gray-700">{description}</p>}

      {/* Last Updated Date */}
      {(recipe as any)._updatedAt && (
        <p className="mt-2 text-sm text-gray-500">
          Last updated: {new Date((recipe as any)._updatedAt).toLocaleDateString('en-GB', {
            day: 'numeric',
            month: 'long',
            year: 'numeric'
          })}
        </p>
      )}

      {/* Social proof - save count */}
      {saveCount !== null && saveCount > 0 && (
        <div className="mt-3 flex items-center gap-2">
          <div className="inline-flex items-center gap-1.5 rounded-full bg-rose-50 border border-rose-200 px-3 py-1.5 text-sm">
            <svg className="w-4 h-4 text-rose-600" fill="currentColor" viewBox="0 0 24 24">
              <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
            </svg>
            <span className="font-medium text-rose-900">
              Saved by <strong>{saveCount}</strong> {saveCount === 1 ? 'person' : 'people'}
            </span>
          </div>
        </div>
      )}

      {categories && categories.length > 0 && (
        <div className="mt-3 flex flex-wrap items-center gap-2 sm:gap-2">
          {categories.map((category: any) => (
            <span
              key={category._id}
              className="inline-block rounded-full bg-emerald-100 px-3 py-1.5 text-xs sm:text-xs font-medium text-emerald-800"
            >
              {category.title}
            </span>
          ))}
        </div>
      )}

      <div className="recipe-timings mt-4 flex flex-wrap items-center gap-3 sm:gap-4 text-sm sm:text-base text-gray-600">
        {servings ? <span>Serves: {servings}</span> : null}
        {prepMin != null ? <span>Prep: {prepMin} mins</span> : null}
        {cookMin != null ? <span>Cook: {cookMin} mins</span> : null}
        {totalMin ? <span className="font-semibold">Total: {totalMin} mins</span> : null}
      </div>

      <div className="mt-5 flex flex-wrap items-center gap-3 sm:gap-3 md:gap-4">
        <ShareRow title={recipe.title} url={`${SITE_URL}/recipes/${recipe.slug}`} />
        <SaveButton recipeSlug={recipe.slug} recipeTitle={recipe.title} />
        <AddToCollectionButton recipeSlug={recipe.slug} />
        <CookingModeToggle />
        <PrintButton
          recipeSlug={recipe.slug}
          recipeTitle={recipe.title}
          brand={recipe.brand?.title}
        />
        <RecipeShoppingListButton
          recipeSlug={recipe.slug}
          recipeTitle={recipe.title}
          ingredients={recipe.ingredients || []}
        />
        {recipe.brand && (
          <Link
            href={`/recipes/brands/${recipe.brand.slug}`}
            className="inline-flex items-center gap-2 rounded-lg border-2 border-gray-300 bg-white px-4 py-2.5 text-sm font-medium text-gray-700 transition-all hover:border-emerald-500 hover:bg-emerald-50 hover:text-emerald-700"
          >
            {recipe.brand.logo?.asset?.url && (
              <Image
                src={recipe.brand.logo.asset.url}
                alt={recipe.brand.logo.alt || recipe.brand.title}
                width={20}
                height={20}
                className="object-contain"
              />
            )}
            <span>More {recipe.brand.title} Recipes</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        )}
      </div>

      {/* Recipe View Prompt for non-authenticated users */}
      <RecipeViewPrompt />

      {/* Rate This Recipe CTA */}
      <div className="mt-6 rounded-lg bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-200 p-5">
        <div className="flex items-start gap-3">
          <div className="flex-shrink-0 text-3xl">⭐</div>
          <div className="flex-1">
            <h2 className="text-lg font-semibold text-gray-900 mb-1">Rate This Recipe</h2>
            <p className="text-sm text-gray-700 mb-3">
              Tried this recipe? Your rating helps others discover great dishes and appears in Google search results!
            </p>
            <StarRating
              recipeId={recipe._id}
              ratingSum={recipe.ratingSum || 0}
              ratingCount={recipe.ratingCount || 0}
              slug={recipe.slug}
              recipeTitle={recipe.title}
            />
          </div>
        </div>
      </div>

      {heroUrl ? (
        <div className="mt-6 relative aspect-[4/3] md:aspect-[16/9] w-full rounded-2xl overflow-hidden border">
          <Image
            src={heroUrl}
            alt={heroImage?.alt || title}
            fill
            className="object-cover"
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        </div>
      ) : null}

      {introText ? (
        <section className="intro-section mt-8">
          <h2 className="mb-2 text-xl font-semibold tracking-tight">Why you'll love it</h2>
          <p className="text-gray-800">{introText}</p>
        </section>
      ) : null}

      {brandContext && brandContext.length > 0 ? (
        <section className="brand-context-section mt-6">
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

      <div className="ingredients-method-container mt-8 grid gap-6 sm:gap-8 md:gap-10 md:grid-cols-2">
        <RecipeIngredients
          originalServings={recipe.servings}
          ingredientGroups={recipe.ingredients || []}
          recipeSlug={recipe.slug}
          brandTitle={recipe.brand?.title}
        />

        <section className="method-section rounded-2xl border p-5 sm:p-6 md:p-4">
          <h2 className="mb-4 text-xl font-semibold tracking-tight">Method</h2>
          {Array.isArray(steps) && steps.length > 0 ? (
            <ol className="list-decimal space-y-5 pl-5 text-base md:text-sm leading-relaxed">
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
        <section className="tips-section mt-8">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Tips & Variations</h2>
          <ul className="list-disc pl-5 space-y-2 text-base md:text-sm text-gray-800 leading-relaxed">
            {tips.map((t: string, i: number) => <li key={i}>{t}</li>)}
          </ul>
        </section>
      )}

      {!!(faqs && faqs.length) && (
        <section className="faqs-section mt-8">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">FAQs</h2>
          <dl className="text-base md:text-sm space-y-4">
            {faqs.map((f: { question: string; answer: string }, i: number) => (
              <div key={i} className="mb-3">
                <dt className="font-semibold mb-1.5 text-gray-900">{f.question}</dt>
                <dd className="text-gray-700 leading-relaxed">{f.answer}</dd>
              </div>
            ))}
          </dl>
        </section>
      )}

      {hasNutrition(nutrition) && (
        <section className="nutrition-section mt-8">
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

      {/* Related Recipes for internal linking */}
      <RelatedRecipes recipes={relatedRecipes} title={recipe.brand ? `More ${recipe.brand.title} Recipes` : "You Might Also Like"} />

      {/* Comment Section */}
      <section className="mt-12">
        <CommentSection recipeSlug={recipe.slug} />
      </section>

      {/* Exit Intent Prompt for non-authenticated users */}
      <ExitIntentPrompt recipeTitle={recipe.title} />

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

      {/* JSON-LD: FAQ Schema - helps with featured snippets in Google */}
      {faqs && faqs.length > 0 && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{
            __html: JSON.stringify({
              "@context": "https://schema.org",
              "@type": "FAQPage",
              mainEntity: faqs.map((faq: { question: string; answer: string }) => ({
                "@type": "Question",
                name: faq.question,
                acceptedAnswer: {
                  "@type": "Answer",
                  text: faq.answer,
                },
              })),
            }),
          }}
        />
      )}
    </main>
  );
}
