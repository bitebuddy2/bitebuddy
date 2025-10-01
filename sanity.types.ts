// sanity.types.ts
import type { PortableTextBlock } from "sanity";

/** ===== Shared image types ===== */
export type ImageAssetMeta = {
  _id: string;
  url: string;
  metadata?: {
    lqip?: string;
    dimensions?: { width: number; height: number; aspectRatio?: number };
  };
};

export type ImageWithAlt = {
  asset?: ImageAssetMeta;
  alt?: string;
};

/** ===== Collections ===== */
export type CollectionRef = {
  _id: string;
  title: string;
  slug: string; // slug.current
};

/** ===== Brand ===== */
export type BrandRef = {
  _id: string;
  title: string;
  name?: string;
  slug: string;
  logo?: ImageWithAlt;
};

/** ===== Retailer Link ===== */
export type RetailerLink = {
  retailer: string;
  url: string;
  label?: string;
};

/** ===== Ingredient (dereferenced) ===== */
export type IngredientRef = {
  _id: string;
  name: string;
  allergens?: string[];
  kcal100?: number;
  protein100?: number;
  fat100?: number;
  carbs100?: number;
  density_g_per_ml?: number;
  gramsPerPiece?: number;
  retailerLinks?: RetailerLink[];
};

/** ===== Recipe ingredients ===== */
export type IngredientItem = {
  quantity?: string; // "1.5", "1/2", "2"
  unit?: string;     // "g","kg","ml","tsp","tbsp","cup","piece", etc.
  notes?: string;
  ingredientText?: string;       // free text fallback
  ingredientRef?: IngredientRef; // preferred (for nutrition calc)
};

export type IngredientGroup = {
  heading?: string;        // e.g., "For the sauce"
  items: IngredientItem[]; // required array
};

/** ===== Steps ===== */
export type Step = {
  step: PortableTextBlock[]; // rich text step
  stepImage?: ImageWithAlt;
};

/** ===== Nutrition (per serving) ===== */
export type Nutrition = {
  calories?: number; // kcal
  protein?: number;  // g
  fat?: number;      // g
  carbs?: number;    // g
};

/** ===== Full Recipe (recipeBySlugQuery) ===== */
export type Recipe = {
  _id: string;
  title: string;
  slug: string;
  description: string;

  // timings & yield
  servings?: number;
  prepMin?: number;
  cookMin?: number;

  // media
  heroImage?: ImageWithAlt;

  // long-form content
  introText?: string;
  brandContext?: PortableTextBlock[];

  // core content
  ingredients: IngredientGroup[];
  steps: Step[];

  // extras
  tips?: string[];
  faqs?: { question: string; answer: string }[];
  nutrition?: Nutrition;

  // community
  ratingCount?: number; // accumulator
  ratingSum?: number;   // accumulator

  // SEO
  seoTitle?: string;
  seoDescription?: string;
  canonicalUrl?: string;

  // relations
  collections?: CollectionRef[];
  brand?: BrandRef;
};

/** ===== Lightweight cards (allRecipesQuery) ===== */
export type RecipeListItem = {
  slug: string;
  title: string;
  heroImage?: ImageWithAlt;
};

/** ===== Slug list (recipeSlugsQuery) ===== */
export type RecipeSlug = {
  slug: string;
};
