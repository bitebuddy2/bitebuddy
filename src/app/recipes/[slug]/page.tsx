import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { client } from "@/sanity/client";
import { recipeBySlugQuery } from "@/sanity/queries";
import { urlForImage } from "@/sanity/image";

type StepBlock = { _type?: string; children?: { text?: string }[] } | string;
function blockToText(b: StepBlock) {
  if (typeof b === "string") return b;
  if (b && typeof b === "object" && Array.isArray(b.children)) {
    return b.children.map((c) => c?.text || "").join("");
  }
  return "";
}

// Dynamic <title> / OG based on the recipe
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
      {recipe.ingredients.map((ing: any, i: number) => {
        const name =
          ing?.item?.name ??
          ing?.ingredient?.name ?? // fallback if schema ever used 'ingredient'
          "Ingredient";

        const qtyUnit = [ing?.quantity, ing?.unit].filter(Boolean).join(" ");

        return (
          <li key={i} className="flex items-start gap-2">
            <span className="mt-1 h-2 w-2 rounded-full bg-emerald-600" />
            <span>
              {qtyUnit && <strong>{qtyUnit} </strong>}
              {name}
              {ing?.note ? ` — ${ing.note}` : ""}
            </span>
          </li>
        );
      })}
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

      {/* JSON-LD: Recipe */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Recipe",
            name: recipe.title,
            description: recipe.description || "UK copycat recipe",
            image: recipe.heroImage
              ? urlForImage(recipe.heroImage).width(1200).height(630).url()
              : undefined,
            recipeYield: recipe.servings ? String(recipe.servings) : undefined,
            prepTime: recipe.prepTime ? `PT${recipe.prepTime}M` : undefined,
            cookTime: recipe.cookTime ? `PT${recipe.cookTime}M` : undefined,
            totalTime:
              recipe.prepTime || recipe.cookTime
                ? `PT${(recipe.prepTime || 0) + (recipe.cookTime || 0)}M`
                : undefined,
            recipeIngredient: Array.isArray(recipe.ingredients)
  ? recipe.ingredients.map((ing: any) => {
      const name =
        ing?.item?.name ??
        ing?.ingredient?.name ??
        "Ingredient";
      const qtyUnit = [ing?.quantity, ing?.unit].filter(Boolean).join(" ");
      return [qtyUnit, name, ing?.note].filter(Boolean).join(" ");
    })
  : [],

            recipeInstructions: Array.isArray(recipe.instructions)
              ? recipe.instructions.map((s: any) => ({
                  "@type": "HowToStep",
                  text:
                    (Array.isArray(s?.children)
                      ? s.children.map((c: any) => c?.text).join("")
                      : String(s)) || "",
                }))
              : [],
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
              { "@type": "ListItem", position: 2, name: recipe.title, item: `/recipes/${params.slug}` },
            ],
          }),
        }}
      />
    </main>
  );
}
