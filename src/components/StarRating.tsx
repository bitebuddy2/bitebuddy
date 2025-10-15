"use client";

import { useEffect, useState } from "react";
import { trackRateRecipe } from "@/lib/analytics";

type Props = {
  recipeId: string;
  ratingSum?: number;
  ratingCount?: number;
  slug?: string; // for localStorage key
  recipeTitle?: string; // for analytics tracking
};

export default function StarRating({ recipeId, ratingSum = 0, ratingCount = 0, slug, recipeTitle }: Props) {
  const storageKey = `bb-rated-${slug || recipeId}`;
  const [hasRated, setHasRated] = useState(false);
  const [hover, setHover] = useState<number | null>(null);
  const [sum, setSum] = useState(ratingSum);
  const [count, setCount] = useState(ratingCount);
  const [busy, setBusy] = useState(false);

  useEffect(() => {
    setHasRated(localStorage.getItem(storageKey) === "1");
  }, [storageKey]);

  async function vote(stars: number) {
    if (busy || hasRated) return;
    try {
      setBusy(true);
      const res = await fetch("/api/rate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ recipeId, stars }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data?.error || "Failed");
      setSum(data.ratingSum);
      setCount(data.ratingCount);
      localStorage.setItem(storageKey, "1");
      setHasRated(true);

      // Track rating event in analytics
      if (slug) {
        trackRateRecipe({
          recipe_slug: slug,
          recipe_title: recipeTitle,
          rating: stars,
        });
      }
    } catch (e) {
      console.error(e);
      // Optionally show a toast
    } finally {
      setBusy(false);
    }
  }

  const avg = count > 0 ? sum / count : 0;
  const label = count > 0 ? `${avg.toFixed(1)} (${count})` : "No ratings yet";

  return (
    <div className="flex items-center gap-2">
      <div className="inline-flex" aria-label={`Average rating ${avg.toFixed(1)} out of 5`}>
        {[1, 2, 3, 4, 5].map((i) => {
          const filled = (hover ?? avg) >= i - 0.25; // gives partial feel on hover
          return (
            <button
              key={i}
              type="button"
              className={`mx-0.5 ${hasRated ? "cursor-default" : "cursor-pointer"}`}
              onMouseEnter={() => !hasRated && setHover(i)}
              onMouseLeave={() => setHover(null)}
              onClick={() => vote(i)}
              disabled={busy || hasRated}
              aria-label={`Rate ${i} star${i > 1 ? "s" : ""}`}
              title={hasRated ? "Thanks for rating!" : `Rate ${i}`}
            >
              <Star filled={filled} />
            </button>
          );
        })}
      </div>
      <span className="text-sm text-gray-600">{busy ? "Saving…" : label}</span>
    </div>
  );
}

function Star({ filled }: { filled: boolean }) {
  return (
    <svg
      viewBox="0 0 24 24"
      className={`h-6 w-6 transition ${
        filled ? "fill-amber-400 stroke-amber-500" : "fill-none stroke-gray-400"
      }`}
      strokeWidth={1.5}
    >
      <path d="M12 17.3l-5.4 3 1-5.9L3 9.8l6-0.9L12 3l3 5.9 6 0.9-4.6 4.6 1 5.9z" />
    </svg>
  );
}
