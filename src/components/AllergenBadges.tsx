"use client";

interface AllergenBadgesProps {
  allergens: string[];
}

/**
 * Displays allergen warnings as badges
 * Shows a warning header and list of allergen badges
 */
export default function AllergenBadges({ allergens }: AllergenBadgesProps) {
  if (!allergens || allergens.length === 0) {
    return null;
  }

  return (
    <div className="mt-3 rounded-lg bg-amber-50 border border-amber-200 p-4">
      <div className="flex items-start gap-2">
        <div className="flex-shrink-0 text-xl">⚠️</div>
        <div className="flex-1">
          <h3 className="text-sm font-semibold text-amber-900 mb-2">Contains Allergens</h3>
          <div className="flex flex-wrap gap-2">
            {allergens.map((allergen) => (
              <span
                key={allergen}
                className="inline-flex items-center gap-1.5 rounded-full bg-amber-100 border border-amber-300 px-3 py-1 text-xs font-medium text-amber-900"
              >
                {allergen}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
