import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

const query = /* groq */ `
  *[_type=="article" && title match $term]{
    title,
    "slug": slug.current,
    heroImage,
    category,
    excerpt
  } | order(publishedAt desc)[0...10]
`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ items: [] });

  // GROQ "match" supports wildcards. "cook*" finds "cooking".
  const term = `${q}*`;
  const items = await client.fetch(query, { term });
  return NextResponse.json({ items });
}
