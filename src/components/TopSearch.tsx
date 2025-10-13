"use client";

import { useState, useTransition } from "react";
import Link from "next/link";
import Image from "next/image";
import { urlForImage } from "@/sanity/image";

type Item = { title: string; slug: string; heroImage?: any };

export default function TopSearch() {
  const [q, setQ] = useState("");
  const [results, setResults] = useState<Item[]>([]);
  const [open, setOpen] = useState(false);
  const [isPending, start] = useTransition();

  async function handleChange(v: string) {
    setQ(v);
    if (!v.trim()) {
      setResults([]);
      return;
    }
    start(async () => {
      const r = await fetch(`/api/search/title?q=${encodeURIComponent(v)}`);
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
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <input
            value={q}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search recipes by name..."
            className="w-full h-12 rounded-full border-2 border-white pl-12 pr-4 text-base focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 shadow-sm hover:shadow-md transition-all bg-white"
            onFocus={() => setOpen(results.length > 0)}
            onBlur={() => setTimeout(() => setOpen(false), 300)}
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
              {results.map((r) => (
                <li key={r.slug} className="border-b last:border-b-0">
                  <Link
                    href={`/recipes/${r.slug}`}
                    className="flex items-center gap-3 p-3 hover:bg-emerald-50 transition-colors"
                    onMouseDown={(e) => {
                      // Prevent blur from happening before navigation
                      e.preventDefault();
                      window.location.href = `/recipes/${r.slug}`;
                    }}
                  >
                    {r.heroImage ? (
                      <Image
                        src={urlForImage(r.heroImage).width(80).height(60).url()}
                        alt={r.title}
                        width={80}
                        height={60}
                        className="h-12 w-16 rounded object-cover shadow-sm"
                      />
                    ) : (
                      <div className="h-12 w-16 rounded bg-gray-200" />
                    )}
                    <span className="text-sm font-medium">{r.title}</span>
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
