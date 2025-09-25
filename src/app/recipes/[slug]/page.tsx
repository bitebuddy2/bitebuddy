import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { PortableText } from "next-sanity";
import type { Metadata } from "next";

import { client } from "@/sanity/client";
import { recipeBySlugQuery, recipeSlugsQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

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
  for (const g of groups) {
    for (const it of g.items || []) {
      const name = it.ingredientText || it.ingredientRef?.name || "Ingredient";
      const qtyUnit = [it.quantity, it.unit].filter(Boolean).join(" ");
      const label = [qtyUnit, name, it.notes].filter(Boolean).join(" ");
      out.push(label);
    }
  }
  return out;
}

/* --------------- Static params / metadata --------------- */

export async function generateStaticParams() {
  const slugs = await client.fetch<RecipeSlug[]>(recipeSlugsQuery);
  return slugs.map(({ slug }) => ({ slug }));
}

export async function generateMetadata(
  { params }: { params: { slug: string } }
): Promise<Metadata> {
  const data = await client.fetch<Recipe | null>(recipeBySlugQuery, { slug: params.slug });
  if (!data) return {};
  const title = `${data.title} — Bite Buddy`;
  const description = data.seoDescription || data.description || "UK copycat recipe";
  const ogImg =
    data.heroImage?.asset?.url ??
    (data.heroImage ? urlForImage(data.heroImage).width(1200).height(630).url() : undefined);

  return {
    title,
    description,
    openGraph: { title, description, images: ogImg ? [{ url: ogImg }] : undefined, type: "article" },
    twitter: { card: "summary_large_image", title, description, images: ogImg ? [ogImg] : undefined }
  };
}

/* ---------------------- Page ---------------------- */

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = await client.fetch<Recipe | null>(recipeBySlugQuery, { slug: params.slug });
  if (!recipe) notFound();

  const {
    title, description, heroImage, servings, prepMin, cookMin,
    introText, brandContext, ingredients, steps, tips, faqs, nutrition
  } = recipe;

  const totalMin = (prepMin || 0) + (cookMin || 0);

  const heroUrl =
    heroImage?.asset?.url ??
    (heroImage ? urlForImage(heroImage).width(1200).height(700).url() : undefined);

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/recipes" className="text-sm text-emerald-700 underline">
        ← Back to all recipes
      </Link>

      <h1 className="mt-2 text-3xl font-bold">{title}</h1>
      {description && <p className="mt-2 text-gray-700">{description}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        {servings ? <span>Serves: {servings}</span> : null}
        {prepMin != null ? <span>Prep: {prepMin} mins</span> : null}
        {cookMin != null ? <span>Cook: {cookMin} mins</span> : null}
        {totalMin ? <span>Total: {totalMin} mins</span> : null}
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
          <h3 className="mb-2 text-lg font-semibold tracking-tight">About the original</h3>
          <div className="prose prose-neutral">
            <PortableText value={brandContext} />
          </div>
        </section>
      ) : null}

      <hr className="mt-8 border-gray-200" />

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
                      return (
                        <li key={ii} className="flex items-start gap-2">
                          <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                          <span>
                            <strong>{label}</strong>
                            {it.notes ? ` — ${it.notes}` : ""}
                          </span>
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

      {/* JSON-LD: Recipe */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            name: title,
            description: description || "UK copycat recipe",
            image: heroUrl ? [heroUrl] : undefined,
            recipeYield: servings ? `${servings} servings` : undefined,
            prepTime: prepMin != null ? `PT${prepMin}M` : undefined,
            cookTime: cookMin != null ? `PT${cookMin}M` : undefined,
            totalTime: (prepMin || cookMin) ? `PT${totalMin}M` : undefined,
            recipeIngredient: ingredientLines(ingredients),
            recipeInstructions: (steps || []).map((s, idx: number) => ({
              "@type": "HowToStep",
              position: idx + 1,
              text: portableToPlainText(s.step),
            })),
            author: { "@type": "Organization", name: "Bite Buddy" },
          }),
        }}
      />

      {/* JSON-LD: Breadcrumbs */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            itemListElement: [
              { "@type": "ListItem", position: 1, name: "Recipes", item: "/recipes" },
              { "@type": "ListItem", position: 2, name: title, item: `/recipes/${params.slug}` },
            ],
          }),
        }}
      />
    </main>
  );
}
