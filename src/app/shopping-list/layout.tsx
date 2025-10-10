import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Shopping List - Recipe Ingredients | Bite Buddy",
  description: "Your personalized shopping list from BiteBuddy recipes. Combine ingredients from multiple recipes and print for easy shopping.",
  robots: { index: false }, // Don't index personal shopping lists
};

export default function ShoppingListLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
