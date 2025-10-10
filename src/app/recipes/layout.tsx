import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "All UK Copycat Recipes | Bite Buddy",
  description: "Browse UK restaurant copycat recipes from Greggs, Nando's, Wagamama, KFC, McDonald's, Costa & more. Recreate your favourite dishes at home.",
  openGraph: {
    title: "All UK Copycat Recipes | Bite Buddy",
    description: "Browse UK restaurant copycat recipes from Greggs, Nando's, Wagamama, KFC, McDonald's, Costa & more. Recreate your favourite dishes at home.",
  },
  twitter: {
    title: "All UK Copycat Recipes | Bite Buddy",
    description: "Browse UK restaurant copycat recipes from Greggs, Nando's, Wagamama, KFC, McDonald's, Costa & more. Recreate your favourite dishes at home.",
  },
};

export default function RecipesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
