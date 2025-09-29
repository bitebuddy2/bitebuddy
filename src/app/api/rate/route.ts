import { NextResponse } from "next/server";
import { createClient } from "@sanity/client";

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2023-10-01",
  token: process.env.SANITY_WRITE_TOKEN!, // must be set
  useCdn: false,
});

export async function POST(req: Request) {
  try {
    const { recipeId, stars } = await req.json();

    // Basic validation
    if (!recipeId || typeof recipeId !== "string") {
      return NextResponse.json({ error: "recipeId required" }, { status: 400 });
    }
    const n = Number(stars);
    if (!Number.isInteger(n) || n < 1 || n > 5) {
      return NextResponse.json({ error: "stars must be 1–5" }, { status: 400 });
    }

    // Patch: ensure fields exist, then increment atomically
    const res = await client
      .patch(recipeId)
      .setIfMissing({ ratingSum: 0, ratingCount: 0 })
      .inc({ ratingSum: n, ratingCount: 1 })
      .commit({ autoGenerateArrayKeys: true, returnDocuments: true });

    const sum = res.ratingSum ?? 0;
    const count = res.ratingCount ?? 0;
    const avg = count > 0 ? sum / count : 0;

    return NextResponse.json({ ok: true, ratingSum: sum, ratingCount: count, average: avg });
  } catch (e: any) {
    console.error(e);
    return NextResponse.json({ error: "Server error" }, { status: 500 });
  }
}
