import { NextResponse } from "next/server";
import OpenAI from "openai";
import { z } from "zod";

// ---- OpenAI
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

// keep this in sync with your schema dropdown
const ALLOWED_UNITS = [
  "g","kg","oz","lb","ml","l","tsp","tbsp","cup",
  "piece","slice","clove","leaf","sprig","bunch","pinch","dash",
  "can","jar","packet","sheet","stick"
];

// zod validation for safe JSON
const IngredientSchema = z.object({
  name: z.string().min(1),
  amount: z.union([z.string().min(1), z.number()]).transform(val => String(val)), // accept string or number, convert to string
  unit: z.enum(ALLOWED_UNITS as [string, ...string[]]).optional().nullable(),
});

const RecipePreviewSchema = z.object({
  title: z.string().min(3),
  description: z.string().min(10),
  introText: z.string().min(20).optional().nullable(),
  servings: z.number().int().positive(),
  prepMin: z.number().int().nonnegative().optional().default(0),
  cookMin: z.number().int().nonnegative().optional().default(0),
  ingredients: z.array(IngredientSchema).min(1),
  steps: z.array(z.string().min(3)).min(1),
  tips: z.array(z.string().min(5)).optional().default([]),
  faqs: z.array(z.object({
    question: z.string().min(5),
    answer: z.string().min(10)
  })).optional().default([]),
  nutrition: z.object({
    calories: z.number().positive(),
    protein: z.number().nonnegative(),
    fat: z.number().nonnegative(),
    carbs: z.number().nonnegative()
  }).optional().nullable(),
  brandName: z.string().optional().nullable(), // e.g. "Greggs"
});

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();
    if (!prompt || typeof prompt !== "string") {
      return NextResponse.json({ error: "Missing 'prompt' string" }, { status: 400 });
    }

    // Guardrails to control cost
    if (prompt.length > 500) {
      return NextResponse.json({ error: "Prompt too long (max 500 chars)" }, { status: 400 });
    }

    const system = [
      "You are a UK recipe generator for Bite Buddy.",
      "Return ONLY valid JSON matching this schema:",
      "{ title, description, introText, servings, prepMin, cookMin, ingredients[{name,amount,unit}], steps[], tips[], faqs[{question,answer}], nutrition:{calories,protein,fat,carbs}, brandName? }",
      "Rules:",
      "- Use UK terms, spelling, and metrics (celsius, grams, ml, etc.)",
      "- Units must be from:", JSON.stringify(ALLOWED_UNITS),
      "- introText: 100-200 words explaining why the dish is great",
      "- tips: 3-5 helpful cooking tips or variations",
      "- faqs: 2-4 common questions with answers",
      "- nutrition: per serving values (calories, protein in g, fat in g, carbs in g)",
      "- Keep ingredient names generic unless a specific chain is requested.",
      "- This is a preview recipe that won't be saved, so make it engaging and complete"
    ].join(" ");

    const user = `Prompt: ${prompt}`;

    const completion = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      response_format: { type: "json_object" }, // force JSON output
      temperature: 0.3,
      max_tokens: 1500, // increased for more content (tips, faqs, nutrition, introText)
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
    });

    const raw = completion.choices?.[0]?.message?.content || "{}";
    let parsed = RecipePreviewSchema.parse(JSON.parse(raw));

    // Return the recipe data without saving to Sanity
    return NextResponse.json({
      ok: true,
      recipe: parsed,
      message: "Recipe generated successfully (preview only - not saved)"
    });
  } catch (err: any) {
    console.error(err);
    return NextResponse.json({ error: "Server error", details: err?.message }, { status: 500 });
  }
}