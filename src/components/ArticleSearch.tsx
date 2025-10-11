"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/image";

type Article = {
  title: string;
  slug: string;
  heroImage?: any;
  category?: string;
  excerpt?: string;
};

const CATEGORY_LABELS: Record<string, string> = {
  "cooking-techniques": "Cooking Techniques",
  "ingredient-guides": "Ingredient Guides",
  "food-trends": "Food Trends",
  "meal-prep-planning": "Meal Prep & Planning",
  "healthy-eating": "Healthy Eating",
  "copycat-secrets": "Restaurant Copycat Secrets",
  "kitchen-equipment": "Kitchen Equipment",
  "seasonal-cooking": "Seasonal Cooking",
};

export default function ArticleSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Article[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, start] = useTransition();

  async function handleChange(v: string) {
    setQ(v);
    if (!v.trim()) {
      setResults([]);
      return;
    }
    start(async () => {
      const r = await fetch(`/api/search/articles?q=${encodeURIComponent(v)}`);
      const data = await r.json();
      setResults(data.items || []);
      setOpen(true);
    });
  }

  return (
    <div className="border-b" style={{ backgroundColor: '#D0EDCC' }}>
      <div className="mx-auto w-full max-w-5xl px-4 py-3">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search articles…"
            className="w-full h-11 rounded-full border px-4 text-sm focus:outline-none"
            onFocus={() => setOpen(results.length > 0)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {isPending && (
            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-xs text-gray-500">
              …
            </span>
          )}

          {open && results.length > 0 && (
            <ul className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-2xl border bg-white shadow">
              {results.map((article) => (
                <li key={article.slug} className="border-b last:border-b-0">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50"
                  >
                    {article.heroImage ? (
                      <Image
                        src={urlForImage(article.heroImage).width(80).height(60).url()}
                        alt={article.title}
                        width={80}
                        height={60}
                        className="h-12 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-16 rounded bg-gray-200" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{article.title}</div>
                      {article.category && (
                        <div className="text-xs text-gray-500 mt-0.5">
                          {CATEGORY_LABELS[article.category] || article.category}
                        </div>
                      )}
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
