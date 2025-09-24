import Link from "next/link";
import Image from "next/image";
import TopSearch from "@/components/TopSearch";
import IngredientFinder from "@/components/IngredientFinder";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image";
import { allRecipesQuery } from "@/sanity/queries";

export default async function HomePage() {
  const recipes: { slug: string; title: string; heroImage?: any }[] =
    await client.fetch(allRecipesQuery);

  return (
    <main>
      {/* TOP SEARCH (title) */}
      <TopSearch />

      {/* HERO */}
      <section className="border-b bg-[radial-gradient(ellipse_at_top,rgba(16,185,129,0.09),transparent_60%)]">
        <div className="mx-auto max-w-6xl px-4 py-10 text-center">
          <h1 className="text-4xl font-extrabold tracking-tight md:text-5xl">
            UK Copycat Recipes, Made Easy
          </h1>
          <p className="mx-auto mt-3 max-w-2xl text-gray-700">
            Simple, fast, and tasty—recreate Greggs, Nando’s, Wagamama and more.
          </p>
          <div className="mt-5 flex justify-center">
            <Link
              href="/recipes"
              className="rounded-full bg-emerald-600 px-5 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Browse Recipes
            </Link>
          </div>
        </div>
      </section>

      {/* INGREDIENT FINDER */}
      <IngredientFinder />

      {/* LATEST RECIPES */}
      <section className="mx-auto max-w-6xl px-4 py-8">
        <div className="mb-4 flex items-center justify-between">
          <h2 className="text-2xl font-semibold">Latest Recipes</h2>
          <Link href="/recipes" className="text-sm text-emerald-700 hover:underline">
            View all
          </Link>
        </div>

        {recipes.length === 0 ? (
          <p className="text-gray-500">No recipes yet — add one in the Studio.</p>
        ) : (
          <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r) => (
              <li
                key={r.slug}
                className="overflow-hidden rounded-lg border transition hover:shadow-md focus-within:shadow-md"
              >
                <Link href={`/recipes/${r.slug}`} className="block">
                  {r.heroImage ? (
                    <Image
                      src={urlForImage(r.heroImage).width(800).height(500).url()}
                      alt={r.title}
                      width={800}
                      height={500}
                      className="aspect-[16/10] w-full object-cover"
                    />
                  ) : (
                    <div className="aspect-[16/10] w-full bg-gray-200 flex items-center justify-center text-sm text-gray-500">
                      No image
                    </div>
                  )}
                  <div className="p-4">
                    <h2 className="text-lg font-semibold">{r.title}</h2>
                    <span className="mt-1 inline-block text-xs text-emerald-700">
                      Open →
                    </span>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
