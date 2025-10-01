"use client";

import { useRouter } from "next/navigation";
import { trackAffiliateClick } from "@/lib/analytics";

function AffiliateButton({
  url,
  retailer,
  ingredient,
  label = "Buy now",
}: {
  url: string;
  retailer: string;
  ingredient: string;
  label?: string;
}) {
  const router = useRouter();

  const handleClick = () => {
    // Fire GA event
    trackAffiliateClick(ingredient, retailer);

    // Navigate to redirect
    router.push(`/go?u=${encodeURIComponent(url)}`);
  };

  return (
    <button
      onClick={handleClick}
      className="rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
    >
      {label}
    </button>
  );
}

export default AffiliateButton;
