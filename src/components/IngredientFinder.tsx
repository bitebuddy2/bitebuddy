"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/image";

type Item = { title: string; slug: string; heroImage?: any };

const METHODS = ["Any", "Bake", "Grill", "Air Fry", "BBQ"] as const;
const SPICE = ["None", "Mild", "Medium", "Hot"] as const;
const DIETS = ["None", "Vegetarian", "Vegan", "Halal", "Gluten-Free"] as const;

export default function IngredientFinder() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [isPending, start] = useTransition();

  // preferences (used later by AI; harmless to collect now)
  const [method, setMethod] = useState<(typeof METHODS)[number]>("Any");
  const [portions, setPortions] = useState(2);
  const [spice, setSpice] = useState<(typeof SPICE)[number]>("None");
  const [diet, setDiet] = useState<(typeof DIETS)[number]>("None");
  const [avoid, setAvoid] = useState("");

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

  function onGenerateAI() {
    // Placeholder for now – keeps your UI ready without adding costs.
    // Later, this will POST to /api/generate/recipe with { q, method, portions, spice, diet, avoid }
    alert(
      `AI recipe generator coming soon!\n\nWe will use:\n- Idea: ${q || "(empty)"}\n- Method: ${method}\n- Portions: ${portions}\n- Spice: ${spice}\n- Diet: ${diet}\n- Avoid: ${avoid}\n\n(Your own recipes will always appear first.)`
    );
  }

  const visible = results.slice(0, 9);

  return (
    <section className="mx-auto max-w-6xl px-4 py-6">
      <div className="rounded-2xl border p-4">
        {/* Primary idea/search input */}
        <form onSubmit={onSearch} className="flex gap-2">
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Enter a recipe idea or ingredients — e.g. chicken, thyme"
            className="h-11 w-full flex-1 rounded-lg border px-3 text-sm"
          />
          <button
            type="submit"
            className="h-11 rounded-lg bg-emerald-600 px-4 text-sm font-semibold text-white hover:bg-emerald-700"
            disabled={isPending}
            title="Search your recipes first"
          >
            {isPending ? "Searching…" : "Find"}
          </button>
          <button
            type="button"
            onClick={onGenerateAI}
            className="h-11 rounded-lg border px-4 text-sm font-semibold hover:bg-gray-50"
            title="Use AI to create a new recipe idea from your input"
          >
            Create with AI
          </button>
        </form>

        <p className="mt-2 text-xs text-gray-500">
          Tip: separate ingredients with commas — e.g. <em>chicken, thyme</em>. Your own recipes are shown
          first; AI-generated options will come later.
        </p>

        {/* Preferences row (for AI; captured now, used later) */}
        <div className="mt-4 grid gap-3 md:grid-cols-2">
          {/* Method + Portions */}
          <div className="rounded-xl border p-3">
            <div className="mb-2 text-xs font-semibold uppercase text-gray-500">Method</div>
            <div className="flex flex-wrap gap-2">
              {METHODS.map((m) => (
                <button
                  key={m}
                  type="button"
                  onClick={() => setMethod(m)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    method === m ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-gray-50"
                  }`}
                >
                  {m}
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs font-semibold uppercase text-gray-500">Portions</div>
            <div className="mt-1 flex items-center gap-2">
              <button
                type="button"
                className="rounded-full border px-3 py-1 text-xs hover:bg-gray-50"
                onClick={() => setPortions(Math.max(1, portions - 1))}
                aria-label="Decrease portions"
              >
                –
              </button>
              <span className="min-w-[2ch] text-center text-sm font-medium">{portions}</span>
              <button
                type="button"
                className="rounded-full border px-3 py-1 text-xs hover:bg-gray-50"
                onClick={() => setPortions(portions + 1)}
                aria-label="Increase portions"
              >
                +
              </button>
            </div>
          </div>

          {/* Spice + Diet + Avoid */}
          <div className="rounded-xl border p-3">
            <div className="mb-2 text-xs font-semibold uppercase text-gray-500">Spice</div>
            <div className="flex flex-wrap gap-2">
              {SPICE.map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={() => setSpice(s)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    spice === s ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-gray-50"
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>

            <div className="mt-3 text-xs font-semibold uppercase text-gray-500">Diet</div>
            <div className="mt-1 flex flex-wrap gap-2">
              {DIETS.map((d) => (
                <button
                  key={d}
                  type="button"
                  onClick={() => setDiet(d)}
                  className={`rounded-full border px-3 py-1 text-xs ${
                    diet === d ? "bg-emerald-600 text-white border-emerald-600" : "hover:bg-gray-50"
                  }`}
                >
                  {d}
                </button>
              ))}
            </div>

            <div className="mt-3">
              <label className="mb-1 block text-xs font-semibold uppercase text-gray-500">
                Ingredients to avoid (comma-separated)
              </label>
              <input
                value={avoid}
                onChange={(e) => setAvoid(e.target.value)}
                placeholder="e.g. nuts, shellfish"
                className="h-10 w-full rounded-lg border px-3 text-sm"
              />
            </div>
          </div>
        </div>

        {/* Loading shimmer */}
        {isPending && (
          <ul className="mt-4 grid gap-5 sm:grid-cols-2 lg:grid-cols-3" aria-hidden>
            {Array.from({ length: 6 }).map((_, i) => (
              <li key={i} className="overflow-hidden rounded-lg border transition animate-pulse">
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
                      <span className="mt-1 inline-block text-xs text-emerald-700">Open →</span>
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
