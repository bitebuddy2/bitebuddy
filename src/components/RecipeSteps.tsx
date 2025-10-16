"use client";

import { useState } from "react";
import Image from "next/image";
import { PortableText } from "next-sanity";

type Step = {
  step: any;
  stepImage?: {
    asset?: {
      url: string;
      metadata?: {
        dimensions?: {
          width: number;
          height: number;
        };
      };
    };
    alt?: string;
  };
};

export default function RecipeSteps({ steps }: { steps: Step[] }) {
  const [completedSteps, setCompletedSteps] = useState<Set<number>>(new Set());

  const toggleStep = (index: number) => {
    const newCompleted = new Set(completedSteps);
    if (newCompleted.has(index)) {
      newCompleted.delete(index);
    } else {
      newCompleted.add(index);
    }
    setCompletedSteps(newCompleted);
  };

  const progress = (completedSteps.size / steps.length) * 100;

  return (
    <div>
      {/* Progress bar */}
      {steps.length > 0 && (
        <div className="mb-6">
          <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
            <span className="font-medium">Your Progress</span>
            <span className="font-semibold text-emerald-600">
              {completedSteps.size} of {steps.length} steps
            </span>
          </div>
          <div className="h-3 bg-gray-200 rounded-full overflow-hidden shadow-inner">
            <div
              className="h-full bg-gradient-to-r from-emerald-500 to-emerald-600 transition-all duration-500 ease-out rounded-full relative overflow-hidden"
              style={{ width: `${progress}%` }}
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white to-transparent opacity-20 animate-shimmer" />
            </div>
          </div>
        </div>
      )}

      {/* Steps list */}
      <div className="space-y-6">
        {steps.map((s, i) => {
          const isCompleted = completedSteps.has(i);

          return (
            <div
              key={i}
              className={`relative pl-12 pb-6 border-l-2 transition-all duration-300 ${
                isCompleted
                  ? "border-emerald-500 opacity-60"
                  : "border-gray-300"
              } ${i === steps.length - 1 ? "border-l-transparent pb-0" : ""}`}
            >
              {/* Step number circle with checkbox */}
              <button
                onClick={() => toggleStep(i)}
                className={`absolute -left-[21px] top-0 flex items-center justify-center w-10 h-10 rounded-full border-2 font-semibold text-sm transition-all duration-300 shadow-md hover:scale-110 active:scale-95 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-offset-2 ${
                  isCompleted
                    ? "bg-emerald-500 border-emerald-500 text-white"
                    : "bg-white border-gray-300 text-gray-700 hover:border-emerald-400"
                }`}
                aria-label={`Mark step ${i + 1} as ${isCompleted ? "incomplete" : "complete"}`}
              >
                {isCompleted ? (
                  <svg
                    className="w-5 h-5 animate-checkbox-check"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={3}
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                ) : (
                  <span>{i + 1}</span>
                )}
              </button>

              {/* Step content */}
              <div
                className={`transition-all duration-300 ${
                  isCompleted ? "line-through text-gray-500" : ""
                }`}
              >
                <div className="prose prose-neutral max-w-none text-base md:text-sm">
                  <PortableText value={s.step} />
                </div>
                {s.stepImage?.asset?.url && (
                  <div className="mt-3">
                    <Image
                      src={s.stepImage.asset.url}
                      alt={s.stepImage.alt || `Step ${i + 1}`}
                      width={s.stepImage.asset.metadata?.dimensions?.width || 1200}
                      height={s.stepImage.asset.metadata?.dimensions?.height || 800}
                      className="rounded-lg border shadow-sm"
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Completion celebration */}
      {completedSteps.size === steps.length && steps.length > 0 && (
        <div className="mt-6 p-4 bg-gradient-to-r from-emerald-50 to-teal-50 border-2 border-emerald-300 rounded-lg animate-pulse-glow">
          <div className="flex items-center gap-3">
            <span className="text-3xl">🎉</span>
            <div>
              <h3 className="font-semibold text-emerald-900 text-lg">Recipe Complete!</h3>
              <p className="text-sm text-emerald-700">
                Great job! Hope you enjoy your dish.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
