"use client";

import { useState, useEffect } from "react";

export default function JumpToRecipeButton() {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Show button after scrolling 300px
      setIsVisible(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const scrollToRecipes = () => {
    const recipesSection = document.querySelector('[data-recipes-section]');
    if (recipesSection) {
      recipesSection.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  if (!isVisible) return null;

  return (
    <button
      onClick={scrollToRecipes}
      className="fixed bottom-20 md:bottom-6 right-4 z-50 flex items-center gap-2 rounded-full bg-emerald-600 px-6 py-3 text-white shadow-lg transition-all hover:bg-emerald-700 hover:shadow-xl active:scale-95 md:px-8 md:py-4 text-sm md:text-base font-semibold"
      aria-label="Jump to recipes"
    >
      <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-11a1 1 0 10-2 0v3.586L7.707 9.293a1 1 0 00-1.414 1.414l3 3a1 1 0 001.414 0l3-3a1 1 0 00-1.414-1.414L11 10.586V7z" clipRule="evenodd" />
      </svg>
      <span className="hidden sm:inline">Jump to Recipes</span>
      <span className="sm:hidden">Recipes</span>
    </button>
  );
}
