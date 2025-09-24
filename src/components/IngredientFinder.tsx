"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/image";

type Item = { title: string; slug: string; heroImage?: any };

export default function IngredientFinder() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [isPending, start] = useTransition();

  async function onSearch(e: React.FormEvent) {
    e.preventDefault();
    const query = q.trim();
    if (!query) return;

    start(async () => {
      const r = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
      const data = await r.json();
      setResults(data.items || []);
    });
  }

  const visible = results.slice(0, 9);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-2xl border p-4">
        {/* Search form */}
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="What's in your fridge? e.g. chicken, thyme"
            className="h-11 w-full flex-1 rounded-lg border px-3 text-sm"
          />
          <button
            type="submit"
            className="h-11 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
            disabled={isPending}
          >
            {isPending ? "Searching…" : "Find"}
          </button>
        </form>

        {/* Input hint */}
        <p className="mt-2 text-xs text-gray-500">
          Tip: separate ingredients with commas — e.g.{" "}
          <em>chicken, thyme</em>.
        </p>

        {/* Loading shimmer */}
        {isPending && (
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <li
                key={i}
                className="overflow-hidden rounded-lg border transition animate-pulse"
              >
                <div className="aspect-[16/10] w-full bg-gray-200" />
                <div className="p-3">
                  <div className="h-4 w-2/3 rounded bg-gray-200" />
                </div>
              </li>
            ))}
          </ul>
        )}

        {/* Empty state */}
        {!isPending && results.length === 0 && q && (
          <p className="mt-4 text-sm text-gray-600">
            No matches found. Try fewer ingredients or different wording.
          </p>
        )}

        {/* Results */}
        {visible.length > 0 && (
          <>
            <h3 className="mt-6 text-lg font-semibold">Matches</h3>
            <ul className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
              {visible.map((r) => (
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
                    <div className="p-3">
                      <h4 className="font-medium">{r.title}</h4>
                      <span className="mt-1 inline-block text-xs text-emerald-700">
                        Open →
                      </span>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>

            {/* Limit note */}
            {results.length > 9 && (
              <p className="mt-3 text-sm">
                Showing 9 of {results.length}.{" "}
                <Link href="/recipes" className="text-emerald-700 underline">
                  See more
                </Link>
              </p>
            )}
          </>
        )}
      </div>
    </section>
  );
}
