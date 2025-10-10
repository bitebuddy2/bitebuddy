import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Free AI Recipe Generator - Create Custom Recipes | Bite Buddy",
  description: "Turn any ingredients into delicious recipes instantly. Our free AI recipe generator creates personalized meal ideas tailored to your preferences in seconds.",
  openGraph: {
    title: "Free AI Recipe Generator - Create Custom Recipes | Bite Buddy",
    description: "Turn any ingredients into delicious recipes instantly. Our free AI recipe generator creates personalized meal ideas tailored to your preferences in seconds.",
  },
  twitter: {
    title: "Free AI Recipe Generator - Create Custom Recipes | Bite Buddy",
    description: "Turn any ingredients into delicious recipes instantly. Our free AI recipe generator creates personalized meal ideas tailored to your preferences in seconds.",
  },
};

export default function AIRecipeGeneratorLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
