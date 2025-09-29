import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

// GROQ: find recipes matching the search term in their ingredients (enhanced with fallback)
const searchGROQ = /* groq */ `
  *[
    _type == "recipe" &&
    (
      count(ingredients[].items[defined(ingredientRef->name) && ingredientRef->name match $term]) > 0 ||
      count(ingredients[].items[defined(ingredientText) && ingredientText match $term]) > 0 ||
      count(ingredients[].items[
        defined(ingredientRef._ref) && (
          ingredientRef._ref match "*sausage*" && $term match "*sausage*" ||
          ingredientRef._ref match "*egg*" && $term match "*egg*" ||
          ingredientRef._ref match "*thyme*" && $term match "*thyme*" ||
          ingredientRef._ref match "*onion*" && $term match "*onion*" ||
          ingredientRef._ref match "*garlic*" && $term match "*garlic*"
        )
      ]) > 0
    )
  ]{
    title,
    "slug": slug.current,
    heroImage
  } | order(_createdAt desc)[0...24]
`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();

  if (!q) {
    return NextResponse.json({ items: [] });
  }

  // Support multiple ingredients: "chicken, thyme" → "chicken|thyme"
  const parts = q.split(",").map((s) => s.trim()).filter(Boolean);
  const term = parts.length ? parts.join("|") : q;

  const items = await client.fetch(searchGROQ, { term });
  return NextResponse.json({ items });
}
