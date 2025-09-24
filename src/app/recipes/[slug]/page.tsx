import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { recipeBySlugQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

// Sanity portable-text blocks -> plain text (simple helper)
type StepBlock = { _type?: string; children?: { text?: string }[] } | string;
function blockToText(b: StepBlock) {
  if (typeof b === "string") return b;
  if (b && typeof b === "object" && Array.isArray(b.children)) {
    return b.children.map((c) => c?.text || "").join("");
  }
  return "";
}

// SEO: dynamic <title>, OG image, etc. based on recipe
export async function generateMetadata({ params }: { params: { slug: string } }) {
  const data = await client.fetch(recipeBySlugQuery, { slug: params.slug });
  if (!data) return {};
  return {
    title: `${data.title} — Bite Buddy`,
    description: data.description || "UK copycat recipe",
    openGraph: {
      images: data.heroImage ? [urlForImage(data.heroImage).width(1200).height(630).url()] : [],
    },
  };
}

export default async function RecipePage({ params }: { params: { slug: string } }) {
  const recipe = await client.fetch(recipeBySlugQuery, { slug: params.slug });
  if (!recipe) notFound();

  const steps: StepBlock[] = Array.isArray(recipe.instructions) ? recipe.instructions : [];

  return (
    <main className="mx-auto max-w-4xl px-4 py-8">
      <Link href="/recipes" className="text-sm text-emerald-700 underline">
        ← Back to all recipes
      </Link>

      <h1 className="mt-2 text-3xl font-bold">{recipe.title}</h1>
      {recipe.description && <p className="mt-2 text-gray-700">{recipe.description}</p>}

      <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-gray-600">
        {recipe.servings ? <span>Serves: {recipe.servings}</span> : null}
        {recipe.prepTime ? <span>Prep: {recipe.prepTime} mins</span> : null}
        {recipe.cookTime ? <span>Cook: {recipe.cookTime} mins</span> : null}
      </div>

      {recipe.heroImage ? (
        <Image
          src={urlForImage(recipe.heroImage).width(1200).height(700).url()}
          alt={recipe.heroImage?.alt || recipe.title}
          width={1200}
          height={700}
          className="mt-6 w-full rounded-2xl border object-cover"
        />
      ) : null}

      <hr className="mt-8 border-gray-200" />

      <div className="mt-8 grid gap-8 md:grid-cols-2">
        {/* Ingredients */}
        <section className="rounded-2xl border p-4">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Ingredients</h2>
          {Array.isArray(recipe.ingredients) && recipe.ingredients.length > 0 ? (
            <ul className="space-y-2 text-sm">
              {recipe.ingredients.map((ing: any, i: number) => (
                <li key={i} className="flex items-start gap-2">
                  <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
                  <span>
                    <strong>
                      {ing?.quantity ? `${ing.quantity} ` : ""}
                      {ing?.unit || ""}
                    </strong>{" "}
                    {ing?.item?.name || ing?.name || "Ingredient"}
                    {ing?.note ? ` — ${ing.note}` : ""}
                  </span>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-gray-600">No ingredients listed.</p>
          )}
        </section>

        {/* Instructions */}
        <section className="rounded-2xl border p-4">
          <h2 className="mb-3 text-xl font-semibold tracking-tight">Instructions</h2>
          {steps.length > 0 ? (
            <ol className="list-decimal space-y-3 pl-5 text-sm">
              {steps.map((s, i) => (
                <li key={i}>{blockToText(s)}</li>
              ))}
            </ol>
          ) : (
            <p className="text-gray-600">No instructions yet.</p>
          )}
        </section>
      </div>
    </main>
  );
}
