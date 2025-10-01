"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";

function RedirectContent() {
  const searchParams = useSearchParams();
  const url = searchParams.get("u");

  useEffect(() => {
    if (url) {
      // Redirect after a brief moment to ensure GA tracking fires
      const timer = setTimeout(() => {
        window.location.href = url;
      }, 100);

      return () => clearTimeout(timer);
    }
  }, [url]);

  return (
    <main className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
        <p className="text-gray-600">Redirecting to retailer...</p>
        {!url && (
          <p className="mt-4 text-sm text-red-600">
            Error: No redirect URL provided
          </p>
        )}
      </div>
    </main>
  );
}

export default function RedirectPage() {
  return (
    <Suspense
      fallback={
        <main className="flex min-h-screen items-center justify-center">
          <div className="text-center">
            <div className="mb-4 inline-block h-8 w-8 animate-spin rounded-full border-4 border-emerald-600 border-t-transparent"></div>
            <p className="text-gray-600">Loading...</p>
          </div>
        </main>
      }
    >
      <RedirectContent />
    </Suspense>
  );
}
