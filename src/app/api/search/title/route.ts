import { NextResponse } from "next/server";
import { client } from "@/sanity/client";

const query = /* groq */ `
  *[_type=="recipe" && title match $term]{
    title,
    "slug": slug.current,
    heroImage
  } | order(_createdAt desc)[0...10]
`;

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const q = (searchParams.get("q") || "").trim();
  if (!q) return NextResponse.json({ items: [] });

  // GROQ "match" supports wildcards. "chick*" finds "chicken".
  const term = `${q}*`;
  const items = await client.fetch(query, { term });
  return NextResponse.json({ items });
}
