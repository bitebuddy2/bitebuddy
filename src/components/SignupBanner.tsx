"use client";

import { useState, useEffect } from "react";

export default function SignupBanner() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already dismissed the banner
    const dismissed = localStorage.getItem("signup-banner-dismissed");
    if (!dismissed) {
      setShowBanner(true);
    }
  }, []);

  function dismissBanner() {
    localStorage.setItem("signup-banner-dismissed", "true");
    setShowBanner(false);
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-emerald-600 border-t border-black shadow-lg">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-black font-medium">
              Join our newsletter for exclusive recipes, cooking tips, and updates delivered straight to your inbox!
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={dismissBanner}
              className="px-4 py-2 text-sm font-medium text-black border border-black rounded-lg hover:bg-emerald-700"
              aria-label="Dismiss banner"
            >
              Dismiss
            </button>
            <a
              href="https://bite-buddy.kit.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-emerald-600 bg-black rounded-lg hover:bg-gray-900"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
