"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export default function SignupBanner() {
  const [showBanner, setShowBanner] = useState(false);
  const [cookieBannerVisible, setCookieBannerVisible] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check authentication status
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data.user);

      // Only show banner if not authenticated
      if (!data.user) {
        const dismissed = localStorage.getItem("signup-banner-dismissed");
        if (!dismissed) {
          setShowBanner(true);
        }
      }
    });
  }, []);

  useEffect(() => {
    // Check if cookie banner is visible
    const checkCookieBanner = () => {
      setCookieBannerVisible(document.body.classList.contains('cookie-banner-visible'));
    };

    // Check initially
    checkCookieBanner();

    // Watch for changes
    const observer = new MutationObserver(checkCookieBanner);
    observer.observe(document.body, { attributes: true, attributeFilter: ['class'] });

    return () => observer.disconnect();
  }, []);

  function dismissBanner() {
    localStorage.setItem("signup-banner-dismissed", "true");
    setShowBanner(false);
  }

  // Don't show banner for authenticated users
  if (!showBanner || isAuthenticated) return null;

  return (
    <div
      className="fixed left-0 right-0 z-50 bg-emerald-600 border-t border-black shadow-lg transition-all duration-300"
      style={{ bottom: cookieBannerVisible ? '180px' : '0' }}
    >
      <div className="mx-auto max-w-6xl px-4 py-4">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="inline-flex items-center gap-1 bg-black/20 text-black rounded-full px-2 py-0.5 text-xs font-bold">
                <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                  <path d="M9 6a3 3 0 11-6 0 3 3 0 016 0zM17 6a3 3 0 11-6 0 3 3 0 016 0zM12.93 17c.046-.327.07-.66.07-1a6.97 6.97 0 00-1.5-4.33A5 5 0 0119 16v1h-6.07zM6 11a5 5 0 015 5v1H1v-1a5 5 0 015-5z"/>
                </svg>
                Join 10,000+ home cooks
              </span>
            </div>
            <p className="text-sm text-black font-medium">
              Get exclusive recipes, cooking tips, and updates delivered to your inbox. Sign up takes 30 seconds!
            </p>
          </div>
          <div className="flex gap-3 flex-shrink-0">
            <button
              onClick={dismissBanner}
              className="px-4 py-2 text-sm font-medium text-black border border-black rounded-lg hover:bg-emerald-700 transition-colors"
              aria-label="Dismiss banner"
            >
              Dismiss
            </button>
            <a
              href="https://bite-buddy.kit.com/signup"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-2 text-sm font-medium text-emerald-600 bg-black rounded-lg hover:bg-gray-900 transition-colors"
            >
              Sign Up
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
