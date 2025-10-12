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
    <div className="border-b shadow-md" style={{ backgroundColor: '#D0EDCC' }}>
      <div className="mx-auto w-full max-w-5xl px-4 py-4">
        <div className="relative">
          <div className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none z-10">
            <svg className="w-5 h-5 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <input
            value={q}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search articles by title or topic..."
            className="w-full h-12 rounded-full border-2 border-white pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm hover:shadow-md transition-all bg-white"
            onFocus={() => setOpen(results.length > 0)}
            onBlur={() => setTimeout(() => setOpen(false), 150)}
          />
          {isPending && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2">
              <svg className="animate-spin h-5 w-5 text-emerald-600" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
            </div>
          )}

          {open && results.length > 0 && (
            <ul className="absolute z-20 mt-2 max-h-80 w-full overflow-auto rounded-2xl border-2 border-emerald-200 bg-white shadow-xl">
              {results.map((article) => (
                <li key={article.slug} className="border-b last:border-b-0">
                  <Link
                    href={`/articles/${article.slug}`}
                    className="flex items-center gap-3 p-3 hover:bg-emerald-50 transition-colors"
                  >
                    {article.heroImage ? (
                      <Image
                        src={urlForImage(article.heroImage).width(80).height(60).url()}
                        alt={article.title}
                        width={80}
                        height={60}
                        className="h-12 w-16 rounded object-cover shadow-sm"
                      />
                    ) : (
                      <div className="h-12 w-16 rounded bg-gray-200" />
                    )}
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-semibold truncate">{article.title}</div>
                      {article.category && (
                        <div className="text-xs text-emerald-600 mt-0.5 font-medium">
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
