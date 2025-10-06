"use client";

import { trackAffiliateClick } from "@/lib/analytics";

function AffiliateButton({
  url,
  retailer,
  ingredient,
  recipe,
  brand,
  label = "Buy now",
}: {
  url: string;
  retailer: string;
  ingredient: string;
  recipe: string;
  brand?: string;
  label?: string;
}) {

  const handleClick = () => {
    // Extract domain from URL
    let dest_domain = "";
    try {
      const urlObj = new URL(url);
      dest_domain = urlObj.hostname.replace(/^www\./, "");
    } catch {
      dest_domain = "unknown";
    }

    // Fire GA event with all parameters
    trackAffiliateClick({
      recipe,
      ingredient,
      retailer,
      dest_domain,
      brand,
    });

    // Open in new window
    window.open(`/go?u=${encodeURIComponent(url)}`, "_blank", "noopener");
  };

  return (
    <a
      href={`/go?u=${encodeURIComponent(url)}`}
      onClick={(e) => {
        e.preventDefault();
        handleClick();
      }}
      target="_blank"
      rel="sponsored noopener"
      className="inline-block rounded-xl bg-black px-4 py-2 text-sm font-medium text-white hover:opacity-90 transition"
    >
      {label}
    </a>
  );
}

export default AffiliateButton;
