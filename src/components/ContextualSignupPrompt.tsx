"use client";

import { useState } from "react";
import Link from "next/link";

interface ContextualSignupPromptProps {
  type: "recipe-views" | "search" | "ai-generation" | "shopping-list";
  count?: number;
  onDismiss?: () => void;
}

export default function ContextualSignupPrompt({ type, count, onDismiss }: ContextualSignupPromptProps) {
  const [dismissed, setDismissed] = useState(false);

  const handleDismiss = () => {
    setDismissed(true);
    if (onDismiss) onDismiss();
  };

  if (dismissed) return null;

  const content = {
    "recipe-views": {
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M5 4a2 2 0 012-2h6a2 2 0 012 2v14l-5-2.5L5 18V4z"/>
        </svg>
      ),
      title: `You've viewed ${count} ${count === 1 ? 'recipe' : 'recipes'} today!`,
      description: "Create a free account to save your favorites and access them anytime, anywhere.",
      cta: "Create Free Account"
    },
    "search": {
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd"/>
        </svg>
      ),
      title: "Finding what you need?",
      description: "Create a free account to save your ingredient preferences and get personalized recipe recommendations.",
      cta: "Sign Up Free"
    },
    "ai-generation": {
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M13 7H7v6h6V7z"/>
          <path fillRule="evenodd" d="M7 2a1 1 0 012 0v1h2V2a1 1 0 112 0v1h2a2 2 0 012 2v2h1a1 1 0 110 2h-1v2h1a1 1 0 110 2h-1v2a2 2 0 01-2 2h-2v1a1 1 0 11-2 0v-1H9v1a1 1 0 11-2 0v-1H5a2 2 0 01-2-2v-2H2a1 1 0 110-2h1V9H2a1 1 0 010-2h1V5a2 2 0 012-2h2V2zM5 5h10v10H5V5z" clipRule="evenodd"/>
        </svg>
      ),
      title: "Love your AI recipe?",
      description: "Sign up for unlimited AI recipe generations, save your creations, and share them with friends!",
      cta: "Get Unlimited Access"
    },
    "shopping-list": {
      icon: (
        <svg className="w-6 h-6 text-emerald-600" fill="currentColor" viewBox="0 0 20 20">
          <path d="M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z"/>
        </svg>
      ),
      title: "Take your list with you!",
      description: "Sign up to access your shopping list from any device - phone, tablet, or computer.",
      cta: "Create Free Account"
    }
  };

  const { icon, title, description, cta } = content[type];

  return (
    <div className="my-6 rounded-xl border-2 border-emerald-200 bg-gradient-to-r from-emerald-50 to-green-50 p-6 shadow-sm animate-in fade-in slide-in-from-bottom-4 duration-500">
      <button
        onClick={handleDismiss}
        className="float-right text-gray-400 hover:text-gray-600 transition-colors"
        aria-label="Dismiss"
      >
        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
          <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd"/>
        </svg>
      </button>

      <div className="flex items-start gap-4">
        <div className="flex-shrink-0 p-3 bg-white rounded-lg shadow-sm">
          {icon}
        </div>

        <div className="flex-1 pt-1">
          <h3 className="text-lg font-bold text-gray-900 mb-1">
            {title}
          </h3>
          <p className="text-sm text-gray-700 mb-4">
            {description}
          </p>

          <div className="flex flex-wrap items-center gap-3">
            <Link
              href="/account"
              className="inline-flex items-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg text-sm font-semibold hover:bg-emerald-700 transition-colors shadow-sm"
            >
              {cta}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6"/>
              </svg>
            </Link>

            <span className="text-xs text-gray-600">
              <span className="font-semibold">Free forever</span> · No credit card required · Takes 30 seconds
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
