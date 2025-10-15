"use client";

import { useState, useEffect } from "react";

interface CookingModeToggleProps {
  onToggle?: (isEnabled: boolean) => void;
}

export default function CookingModeToggle({ onToggle }: CookingModeToggleProps) {
  const [cookingMode, setCookingMode] = useState(false);

  useEffect(() => {
    // Apply cooking mode class to body
    if (cookingMode) {
      document.body.classList.add("cooking-mode");
      // Keep screen awake
      if ('wakeLock' in navigator) {
        (navigator as any).wakeLock.request('screen').catch(() => {
          // Silently fail if wake lock not supported
        });
      }
    } else {
      document.body.classList.remove("cooking-mode");
    }

    onToggle?.(cookingMode);

    return () => {
      document.body.classList.remove("cooking-mode");
    };
  }, [cookingMode, onToggle]);

  return (
    <button
      onClick={() => setCookingMode(!cookingMode)}
      className={`flex items-center gap-2 rounded-lg border-2 px-4 py-3 min-h-[44px] text-sm font-medium transition-all ${
        cookingMode
          ? "bg-emerald-600 border-emerald-600 text-white"
          : "bg-white border-gray-300 text-gray-700 hover:bg-gray-50"
      }`}
      aria-label={cookingMode ? "Exit cooking mode" : "Enter cooking mode"}
    >
      {cookingMode ? (
        <>
          <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
            <path d="M12 22C6.477 22 2 17.523 2 12S6.477 2 12 2s10 4.477 10 10-4.477 10-10 10zm0-2a8 8 0 100-16 8 8 0 000 16zM11 7h2v2h-2V7zm0 4h2v6h-2v-6z"/>
          </svg>
          <span>Exit Cooking Mode</span>
        </>
      ) : (
        <>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
          </svg>
          <span>Cooking Mode</span>
        </>
      )}
    </button>
  );
}
