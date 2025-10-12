import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Food & Cooking Articles | Bite Buddy",
  description: "Expert tips, trending topics, and techniques to elevate your cooking.",
  alternates: {
    canonical: "https://bitebuddy.co.uk/articles",
  },
};

export default function ArticlesLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
