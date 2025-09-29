import Link from "next/link";
import RecipeCard from "@/components/RecipeCard";
import { client } from "../../sanity/client";
import { recipesByIngredientNamesQuery } from "../../sanity/queries";
import SearchBar from "@/components/SearchBar";

// Parse ingredients from various formats into clean list
function parseNames(q?: string): string[] {
  if (!q) return [];

  // Handle explicit separators first: commas, semicolons, pipes, or 2+ spaces
  if (/[,;|]|\s{2,}/.test(q)) {
    return q
      .split(/[,;|]+|\s{2,}/)
      .map(s => s.trim())
      .filter(Boolean)
      .filter(ingredient => ingredient.length > 1);
  }

  // For space-only input, try to intelligently split on single spaces
  // but keep common multi-word ingredients together
  const commonMultiWord = [
    'sausage meat', 'chicken breast', 'olive oil', 'sea salt', 'black pepper',
    'red wine', 'white wine', 'coconut milk', 'soy sauce', 'fish sauce',
    'tomato paste', 'beef stock', 'chicken stock', 'cream cheese', 'caster sugar',
    'plain flour', 'self raising flour', 'double cream', 'single cream'
  ];

  let result = q;

  // Replace known multi-word ingredients with temporary placeholders
  const placeholders: { [key: string]: string } = {};
  commonMultiWord.forEach((phrase, index) => {
    if (result.toLowerCase().includes(phrase.toLowerCase())) {
      const placeholder = `__MULTIWORD_${index}__`;
      placeholders[placeholder] = phrase;
      result = result.replace(new RegExp(phrase, 'gi'), placeholder);
    }
  });

  // Split on single spaces
  const parts = result
    .split(/\s+/)
    .map(s => s.trim())
    .filter(Boolean);

  // Restore multi-word ingredients
  const restored = parts.map(part => {
    if (part.startsWith('__MULTIWORD_')) {
      return placeholders[part] || part;
    }
    return part;
  });

  return restored.filter(ingredient => ingredient.length > 1);
}

export const revalidate = 30;
type PageProps = { searchParams?: { q?: string } };

export default async function SearchPage({ searchParams }: PageProps) {
  const names = parseNames(searchParams?.q);
  const hasQuery = names.length > 0;

  const recipes = hasQuery
    ? await client.fetch(recipesByIngredientNamesQuery, {
        names,
        namesLower: names.map(name => name.toLowerCase()),
        searchPattern: `*(${names.map(name => name.toLowerCase()).join("|")})*`
      })
    : [];

  return (
    <main className="mx-auto max-w-6xl p-4">
      <header className="mb-6">
        <h1 className="text-3xl font-bold tracking-tight">What's in my fridge?</h1>
        <p className="text-gray-600">Type ingredients separated by commas (e.g. <em>chicken, orzo, onion</em>).</p>
      </header>

      <SearchBar defaultQuery={searchParams?.q ?? ""} />

      {hasQuery && (
        <p className="mt-4 text-sm text-gray-600">
          Showing results for:{" "}
          {names.map((n, i) => (
            <span key={i} className="mr-2 inline-flex rounded-full border border-gray-200 bg-gray-50 px-2 py-0.5">
              {n}
            </span>
          ))}
        </p>
      )}

      <section className="mt-6">
        {recipes.length === 0 ? (
          <p className="text-gray-500">
            {hasQuery ? "No recipes matched those ingredients yet." : "Enter ingredients to search."}
          </p>
        ) : (
          <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {recipes.map((r: any) => (
              <li key={r.slug}>
                <RecipeCard r={r} />
                {/* Optional: show matched ingredients below the card */}
                {r.matched?.length > 0 && (
                  <p className="mt-1 text-xs text-gray-500">
                    Matches: {r.matched.map((m: any) => m.name || m).filter(Boolean).join(", ")}
                  </p>
                )}
              </li>
            ))}
          </ul>
        )}
      </section>

      {/* Quick link back */}
      <div className="mt-8">
        <Link href="/recipes" className="text-emerald-700 hover:underline">Browse all recipes →</Link>
      </div>
    </main>
  );
}