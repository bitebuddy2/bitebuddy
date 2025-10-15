import type { Metadata } from "next";
import RecipesContent from "@/components/RecipesContent";
import { client } from "@/sanity/client";
import { brandByIdQuery } from "@/sanity/queries";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

export async function generateMetadata({
  searchParams,
}: {
  searchParams: Promise<{ brand?: string }>;
}): Promise<Metadata> {
  const params = await searchParams;
  const brandId = params.brand;

  // If there's a brand query parameter, fetch the brand and redirect/canonicalize to the proper brand page
  if (brandId && brandId !== "all") {
    try {
      const brand = await client.fetch<{ _id: string; title: string; slug: string } | null>(
        brandByIdQuery,
        { id: brandId }
      );

      if (brand?.slug) {
        // Set canonical to the proper brand page
        return {
          title: `${brand.title} Recipes`,
          description: `Browse ${brand.title} copycat recipes. Simple, fast, and tasty—recreate ${brand.title} favourites at home.`,
          alternates: { canonical: `/recipes/brands/${brand.slug}` },
          openGraph: {
            title: `${brand.title} Recipes | Bite Buddy`,
            description: `Browse ${brand.title} copycat recipes. Simple, fast, and tasty—recreate ${brand.title} favourites at home.`,
            url: `${SITE_URL}/recipes/brands/${brand.slug}`,
            siteName: "Bite Buddy",
            type: "website",
          },
          twitter: {
            card: "summary_large_image",
            title: `${brand.title} Recipes | Bite Buddy`,
            description: `Browse ${brand.title} copycat recipes.`,
          },
        };
      }
    } catch (error) {
      console.error("Error fetching brand for metadata:", error);
    }
  }

  // Default metadata for unfiltered recipes page
  return {
    title: "All Recipes",
    description: "Browse hundreds of copycat recipes from your favourite UK restaurants and brands. Simple, fast, and tasty—recreate UK favourites at home.",
    alternates: { canonical: "/recipes" },
    openGraph: {
      title: "All Recipes | Bite Buddy",
      description: "Browse hundreds of copycat recipes from your favourite UK restaurants and brands. Simple, fast, and tasty—recreate UK favourites at home.",
      url: `${SITE_URL}/recipes`,
      siteName: "Bite Buddy",
      type: "website",
    },
    twitter: {
      card: "summary_large_image",
      title: "All Recipes | Bite Buddy",
      description: "Browse hundreds of copycat recipes from your favourite UK restaurants and brands.",
    },
  };
}

export default function RecipesIndexPage() {
  return <RecipesContent />;
}
