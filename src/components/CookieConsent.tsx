"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "accepted") {
      // If previously accepted, grant consent immediately
      grantConsent();
    }
  }, []);

  function grantConsent() {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        analytics_storage: "granted",
      });

      // Re-send page_view now that consent is granted
      const gaId = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
      if (gaId) {
        (window as any).gtag("config", gaId, {
          page_path: window.location.pathname + window.location.search,
        });
      }
    }
  }

  function acceptCookies() {
    localStorage.setItem("cookie-consent", "accepted");
    grantConsent();
    setShowBanner(false);
  }

  function declineCookies() {
    localStorage.setItem("cookie-consent", "declined");
    setShowBanner(false);
  }

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 bg-white border-t shadow-lg">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <p className="text-sm text-gray-700">
              We use cookies to improve your experience and analyze site traffic.
              By clicking "Accept", you consent to our use of cookies.{" "}
              <a href="/privacy" className="text-emerald-600 hover:underline">
                Learn more
              </a>
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={declineCookies}
              className="px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Decline
            </button>
            <button
              onClick={acceptCookies}
              className="px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
            >
              Accept
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
