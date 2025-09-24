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

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
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

      {results.length > 0 && (
        <>
          <h3 className="mt-6 text-lg font-semibold">Matches</h3>
          <ul className="mt-3 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {results.map((r) => (
              <li key={r.slug} className="overflow-hidden rounded-lg border">
                <Link href={`/recipes/${r.slug}`} className="block">
                  {r.heroImage ? (
                    <Image
                      src={urlForImage(r.heroImage).width(800).height(500).url()}
                      alt={r.title}
                      width={800}
                      height={500}
                      className="h-40 w-full object-cover"
                    />
                  ) : (
                    <div className="flex h-40 w-full items-center justify-center bg-gray-200 text-sm text-gray-500">
                      No image
                    </div>
                  )}
                  <div className="p-3">
                    <h4 className="font-medium">{r.title}</h4>
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
