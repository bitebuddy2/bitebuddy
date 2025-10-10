"use client";

import { useEffect } from "react";
import { trackViewCookingGuide } from "@/lib/analytics";

interface GuideViewTrackerProps {
  guideSlug: string;
  guideTitle: string;
}

export default function GuideViewTracker({
  guideSlug,
  guideTitle,
}: GuideViewTrackerProps) {
  useEffect(() => {
    // Track guide view on mount
    trackViewCookingGuide({
      guide_slug: guideSlug,
      guide_title: guideTitle,
    });
  }, [guideSlug, guideTitle]);

  return null; // This component doesn't render anything
}
