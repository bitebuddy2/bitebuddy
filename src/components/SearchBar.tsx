"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect } from "react";

export default function SearchBar({ defaultQuery = "" }: { defaultQuery?: string }) {
  const router = useRouter();
  const params = useSearchParams();
  const [value, setValue] = useState(defaultQuery);

  // Keep input in sync with URL (e.g., back/forward)
  useEffect(() => {
    setValue(params.get("q") || "");
  }, [params]);

  function submit(e: React.FormEvent) {
    e.preventDefault();
    const q = normalizeIngredients(value.trim());
    router.push(q ? `/search?q=${encodeURIComponent(q)}` : "/search");
  }

  // Normalize ingredients to comma-separated format
  function normalizeIngredients(input: string): string {
    if (!input) return "";

    // Handle explicit separators first: commas, semicolons, pipes, or 2+ spaces
    if (/[,;|]|\s{2,}/.test(input)) {
      const ingredients = input
        .split(/[,;|]+|\s{2,}/)
        .map(s => s.trim())
        .filter(Boolean)
        .filter(ingredient => ingredient.length > 1);
      return ingredients.join(", ");
    }

    // For space-only input, try to intelligently split on single spaces
    // but keep common multi-word ingredients together
    const commonMultiWord = [
      'sausage meat', 'chicken breast', 'olive oil', 'sea salt', 'black pepper',
      'red wine', 'white wine', 'coconut milk', 'soy sauce', 'fish sauce',
      'tomato paste', 'beef stock', 'chicken stock', 'cream cheese', 'caster sugar',
      'plain flour', 'self raising flour', 'double cream', 'single cream'
    ];

    let result = input;

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

    const ingredients = restored.filter(ingredient => ingredient.length > 1);
    return ingredients.join(", ");
  }

  return (
    <form onSubmit={submit} className="flex w-full max-w-2xl gap-2">
      <div className="relative flex-1">
        <div className="absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>
        <input
          type="text"
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder="e.g. chicken orzo onion OR chicken, orzo, onion"
          className="w-full rounded-lg border-2 border-gray-300 pl-10 pr-4 py-3 text-base focus:border-emerald-500 focus:ring-2 focus:ring-emerald-200 focus:outline-none transition-all shadow-sm hover:shadow-md"
          aria-label="Enter ingredients separated by commas, spaces, or other separators"
        />
      </div>
      <button
        type="submit"
        className="rounded-lg bg-emerald-600 px-6 py-3 font-semibold text-white hover:bg-emerald-700 hover:scale-105 transition-all duration-200 shadow-md hover:shadow-lg flex items-center gap-2"
      >
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
        Search
      </button>
    </form>
  );
}