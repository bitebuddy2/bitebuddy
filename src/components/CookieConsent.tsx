"use client";

import { useState, useEffect } from "react";

export default function CookieConsent() {
  const [showBanner, setShowBanner] = useState(false);
  const [showDetails, setShowDetails] = useState(false);

  useEffect(() => {
    // Check if user has already made a choice
    const consent = localStorage.getItem("cookie-consent");
    if (!consent) {
      setShowBanner(true);
    } else if (consent === "all") {
      // If previously accepted all, grant full consent immediately
      grantFullConsent();
    } else if (consent === "essential") {
      // If only essential cookies accepted, keep consent denied
      denyConsent();
    }
  }, []);

  function grantFullConsent() {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "granted",
        ad_user_data: "granted",
        ad_personalization: "granted",
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

  function denyConsent() {
    if (typeof window !== "undefined" && (window as any).gtag) {
      (window as any).gtag("consent", "update", {
        ad_storage: "denied",
        ad_user_data: "denied",
        ad_personalization: "denied",
        analytics_storage: "denied",
      });
    }
  }

  function acceptAll() {
    localStorage.setItem("cookie-consent", "all");
    grantFullConsent();
    setShowBanner(false);
  }

  function acceptEssentialOnly() {
    localStorage.setItem("cookie-consent", "essential");
    denyConsent();
    setShowBanner(false);
  }

  useEffect(() => {
    // Notify other components that cookie banner is showing
    if (showBanner) {
      document.body.classList.add('cookie-banner-visible');
    } else {
      document.body.classList.remove('cookie-banner-visible');
    }
    return () => {
      document.body.classList.remove('cookie-banner-visible');
    };
  }, [showBanner]);

  if (!showBanner) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-[60] bg-white border-t shadow-lg">
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col gap-4">
          <div className="flex-1">
            <h3 className="text-sm font-semibold text-gray-900 mb-2">
              🍪 Cookie Consent
            </h3>
            <p className="text-sm text-gray-700 mb-2">
              We use cookies and similar technologies to provide, improve, and promote our services.
              This includes analytics to understand how you use our site and personalized ads.
            </p>

            {showDetails && (
              <div className="mt-3 p-3 bg-gray-50 rounded-lg text-xs text-gray-600 space-y-2">
                <div>
                  <strong>Essential Cookies:</strong> Required for the website to function (e.g., authentication, security). Always active.
                </div>
                <div>
                  <strong>Analytics Cookies:</strong> Help us understand how visitors interact with our website (Google Analytics).
                </div>
                <div>
                  <strong>Advertising Cookies:</strong> Used to show you relevant ads and measure ad performance (Google AdSense).
                </div>
                <div>
                  For more information, see our{" "}
                  <a href="/privacy" className="text-emerald-600 hover:underline">
                    Privacy Policy
                  </a>
                  .
                </div>
              </div>
            )}

            <button
              onClick={() => setShowDetails(!showDetails)}
              className="mt-2 text-xs text-emerald-600 hover:underline"
            >
              {showDetails ? "Hide details" : "Show details"}
            </button>
          </div>

          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={acceptEssentialOnly}
              className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Essential Only
            </button>
            <button
              onClick={acceptAll}
              className="flex-1 px-4 py-2 text-sm font-medium text-white bg-emerald-600 rounded-lg hover:bg-emerald-700"
            >
              Accept All
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
