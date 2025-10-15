import React, { Suspense } from "react";
import ArticlesClientContent from "@/components/ArticlesClientContent";
import type { Metadata } from "next";

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || "https://bitebuddy.co.uk";

export const metadata: Metadata = {
  title: "Food & Cooking Articles",
  description: "Expert tips, trending topics, and techniques to elevate your cooking.",
  alternates: { canonical: "/articles" },
  openGraph: {
    title: "Food & Cooking Articles | Bite Buddy",
    description: "Expert tips, trending topics, and techniques to elevate your cooking.",
    url: `${SITE_URL}/articles`,
    siteName: "Bite Buddy",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Food & Cooking Articles | Bite Buddy",
    description: "Expert tips, trending topics, and techniques to elevate your cooking.",
  },
};

export default function ArticlesPage() {
  return (
    <Suspense fallback={
      <main className="mx-auto max-w-6xl px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="flex items-center space-x-2">
            <div className="w-4 h-4 border-2 border-emerald-600 border-t-transparent rounded-full animate-spin"></div>
            <span className="text-gray-600">Loading articles...</span>
          </div>
        </div>
      </main>
    }>
      <ArticlesClientContent />
    </Suspense>
  );
}
