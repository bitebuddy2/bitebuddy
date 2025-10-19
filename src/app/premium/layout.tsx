import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Premium Membership - Unlimited AI Recipes & Meal Planning | Bite Buddy",
  description: "Upgrade to Bite Buddy Premium for unlimited AI-generated recipes, 14-day meal planning, PDF exports, and an ad-free experience. Plans from £4.99/month.",
  alternates: {
    canonical: "/premium",
  },
  openGraph: {
    title: "Premium Membership - Unlimited AI Recipes & Meal Planning | Bite Buddy",
    description: "Upgrade to Bite Buddy Premium for unlimited AI-generated recipes, 14-day meal planning, PDF exports, and an ad-free experience. Plans from £4.99/month.",
  },
  twitter: {
    title: "Premium Membership - Unlimited AI Recipes & Meal Planning | Bite Buddy",
    description: "Upgrade to Bite Buddy Premium for unlimited AI-generated recipes, 14-day meal planning, PDF exports, and an ad-free experience. Plans from £4.99/month.",
  },
};

export default function PremiumLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <>{children}</>;
}
