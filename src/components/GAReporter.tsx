"use client";

import { useEffect, Suspense } from "react";
import { usePathname, useSearchParams } from "next/navigation";

function GAReporterContent() {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    const id = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
    if (!id) return;

    // Build the full path (include query string if present)
    const page_path = searchParams?.toString()
      ? `${pathname}?${searchParams.toString()}`
      : pathname || "/";

    // Send a page_view for SPA navigation
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("config", id, { page_path });
    }
  }, [pathname, searchParams]);

  return null;
}

export default function GAReporter() {
  return (
    <Suspense fallback={null}>
      <GAReporterContent />
    </Suspense>
  );
}
