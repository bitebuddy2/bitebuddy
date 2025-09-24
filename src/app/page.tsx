import Link from "next/link";
import Image from "next/image";
import { client } from "@/sanity/client";
import { urlForImage } from "@/sanity/image"; // uses your existing helper
import { allRecipesQuery } from "@/sanity/queries";

export default async function HomePage() {
  const recipes: { slug: string; title: string; heroImage?: any }[] =
    await client.fetch(allRecipesQuery);

  return (
    <main className="max-w-5xl mx-auto px-4 py-10">
      <h1 className="text-3xl font-bold mb-6">Latest Recipes</h1>

      <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {recipes.map((r) => (
          <li key={r.slug} className="border rounded-lg overflow-hidden hover:shadow">
            <Link href={`/recipes/${r.slug}`} className="block">
              {r.heroImage ? (
                <Image
                  src={urlForImage(r.heroImage).width(800).height(500).url()}
                  alt={r.title}
                  width={800}
                  height={500}
                  className="w-full h-40 object-cover"
                />
              ) : null}
              <div className="p-4">
                <h2 className="text-lg font-semibold">{r.title}</h2>
              </div>
            </Link>
          </li>
        ))}
      </ul>
    </main>
  );
}
