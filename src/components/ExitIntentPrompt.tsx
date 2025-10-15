"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { supabase } from "@/lib/supabase";

interface ExitIntentPromptProps {
  recipeTitle: string;
}

export default function ExitIntentPrompt({ recipeTitle }: ExitIntentPromptProps) {
  const [showPrompt, setShowPrompt] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Check authentication
    supabase.auth.getUser().then(({ data }) => {
      setIsAuthenticated(!!data.user);
    });

    // Check if already dismissed in this session
    const sessionDismissed = sessionStorage.getItem("exit-intent-dismissed");
    if (sessionDismissed) {
      setDismissed(true);
      return;
    }

    // Detect exit intent (mouse leaving through top of viewport)
    const handleMouseLeave = (e: MouseEvent) => {
      if (e.clientY <= 0 && !isAuthenticated && !dismissed) {
        setShowPrompt(true);
      }
    };

    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      document.removeEventListener("mouseleave", handleMouseLeave);
    };
  }, [isAuthenticated, dismissed]);

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    sessionStorage.setItem("exit-intent-dismissed", "true");
  };

  // Don't show for authenticated users or if dismissed
  if (isAuthenticated || dismissed || !showPrompt) return null;

  return (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/50 z-50 animate-in fade-in duration-200"
        onClick={handleDismiss}
      />

      {/* Modal */}
      <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-50 w-full max-w-md mx-4 animate-in slide-in-from-bottom-8 duration-300">
        <div className="bg-white rounded-2xl shadow-2xl p-6 relative">
          {/* Close button */}
          <button
            onClick={handleDismiss}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
            aria-label="Close"
          >
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
            </svg>
          </button>

          {/* Icon */}
          <div className="flex justify-center mb-4">
            <div className="w-16 h-16 bg-emerald-100 rounded-full flex items-center justify-center">
              <svg className="w-8 h-8 text-emerald-600" fill="currentColor" viewBox="0 0 24 24">
                <path d="M17 3H7c-1.1 0-2 .9-2 2v16l7-3 7 3V5c0-1.1-.9-2-2-2z"/>
              </svg>
            </div>
          </div>

          {/* Content */}
          <div className="text-center mb-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Before you go...
            </h2>
            <p className="text-gray-700 mb-1">
              Save "{recipeTitle}" for later?
            </p>
            <p className="text-sm text-gray-600">
              Create a free account to save this recipe and access it from any device.
            </p>
          </div>

          {/* Benefits */}
          <div className="space-y-2 mb-6 text-sm">
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Save unlimited recipes</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Generate meal plans</span>
            </div>
            <div className="flex items-center gap-2 text-gray-700">
              <svg className="w-5 h-5 text-emerald-600 flex-shrink-0" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd"/>
              </svg>
              <span>Create AI recipes daily (free!)</span>
            </div>
          </div>

          {/* CTA Buttons */}
          <div className="space-y-3">
            <Link
              href="/account"
              className="block w-full bg-emerald-600 text-white text-center px-6 py-3 rounded-lg font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              Create Free Account
            </Link>
            <button
              onClick={handleDismiss}
              className="block w-full text-gray-600 text-center px-6 py-2 text-sm hover:text-gray-800 transition-colors"
            >
              No thanks, continue browsing
            </button>
          </div>

          {/* Trust indicators */}
          <p className="text-xs text-center text-gray-500 mt-4">
            Free forever · No credit card required · Takes 30 seconds
          </p>
        </div>
      </div>
    </>
  );
}
