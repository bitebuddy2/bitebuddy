import type { Metadata } from "next";
import RecipesContent from "@/components/RecipesContent";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

export const metadata: Metadata = {
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

export default function RecipesIndexPage() {
  return <RecipesContent />;
}
