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
    <div className="border-b" style={{ backgroundColor: '#D0EDCC' }}>
      <div className="mx-auto w-full max-w-5xl px-4 py-3">
        <div className="relative">
          <input
            value={q}
            onChange={(e) => handleChange(e.target.value)}
            placeholder="Search recipes…"
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
              {results.map((r) => (
                <li key={r.slug} className="border-b last:border-b-0">
                  <Link
                    href={`/recipes/${r.slug}`}
                    className="flex items-center gap-3 p-3 hover:bg-gray-50"
                  >
                    {r.heroImage ? (
                      <Image
                        src={urlForImage(r.heroImage).width(80).height(60).url()}
                        alt={r.title}
                        width={80}
                        height={60}
                        className="h-12 w-16 rounded object-cover"
                      />
                    ) : (
                      <div className="h-12 w-16 rounded bg-gray-200" />
                    )}
                    <span className="text-sm">{r.title}</span>
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
