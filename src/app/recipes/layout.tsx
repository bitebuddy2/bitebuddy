import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All UK Copycat Recipes | Bite Buddy",
  description: "Browse our complete collection of UK restaurant copycat recipes from Greggs, Nando's, Wagamama, KFC, McDonald's, Costa, and more. Find your favourite dishes to recreate at home.",
  openGraph: {
    title: "All UK Copycat Recipes | Bite Buddy",
    description: "Browse our complete collection of UK restaurant copycat recipes from Greggs, Nando's, Wagamama, KFC, McDonald's, Costa, and more. Find your favourite dishes to recreate at home.",
  },
  twitter: {
    title: "All UK Copycat Recipes | Bite Buddy",
    description: "Browse our complete collection of UK restaurant copycat recipes from Greggs, Nando's, Wagamama, KFC, McDonald's, Costa, and more. Find your favourite dishes to recreate at home.",
  },
};

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
