export default function SkeletonLoader({ variant = "card" }: { variant?: "card" | "list" | "text" | "recipe" }) {
  if (variant === "card") {
    return (
      <div className="overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-md">
        <div className="relative aspect-[16/9] bg-gray-200 animate-shimmer" />
        <div className="px-5 sm:px-6 pb-5 sm:pb-6 pt-3">
          <div className="h-6 bg-gray-200 rounded animate-shimmer mb-3 w-3/4" />
          <div className="space-y-2 mb-4">
            <div className="h-4 bg-gray-200 rounded animate-shimmer w-full" />
            <div className="h-4 bg-gray-200 rounded animate-shimmer w-5/6" />
          </div>
          <div className="flex gap-2.5">
            <div className="h-8 w-24 bg-gray-200 rounded-full animate-shimmer" />
            <div className="h-8 w-24 bg-gray-200 rounded-full animate-shimmer" />
            <div className="h-8 w-24 bg-gray-200 rounded-full animate-shimmer" />
          </div>
        </div>
      </div>
    );
  }

  if (variant === "list") {
    return (
      <div className="space-y-3">
        {Array.from({ length: 5 }).map((_, i) => (
          <div key={i} className="flex items-center gap-3">
            <div className="h-4 w-4 bg-gray-200 rounded animate-shimmer" />
            <div className="h-4 flex-1 bg-gray-200 rounded animate-shimmer" />
          </div>
        ))}
      </div>
    );
  }

  if (variant === "text") {
    return (
      <div className="space-y-2">
        <div className="h-4 bg-gray-200 rounded animate-shimmer w-full" />
        <div className="h-4 bg-gray-200 rounded animate-shimmer w-5/6" />
        <div className="h-4 bg-gray-200 rounded animate-shimmer w-4/6" />
      </div>
    );
  }

  if (variant === "recipe") {
    return (
      <div className="space-y-6">
        {/* Title */}
        <div className="h-10 bg-gray-200 rounded animate-shimmer w-3/4" />

        {/* Meta info */}
        <div className="flex gap-4">
          <div className="h-6 w-24 bg-gray-200 rounded animate-shimmer" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-shimmer" />
          <div className="h-6 w-24 bg-gray-200 rounded animate-shimmer" />
        </div>

        {/* Image */}
        <div className="aspect-[16/9] bg-gray-200 rounded-2xl animate-shimmer" />

        {/* Content blocks */}
        <div className="grid md:grid-cols-2 gap-6">
          {/* Ingredients */}
          <div className="rounded-2xl border p-5">
            <div className="h-6 bg-gray-200 rounded animate-shimmer w-1/3 mb-4" />
            <div className="space-y-3">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="flex gap-2">
                  <div className="h-4 w-4 bg-gray-200 rounded animate-shimmer" />
                  <div className="h-4 flex-1 bg-gray-200 rounded animate-shimmer" />
                </div>
              ))}
            </div>
          </div>

          {/* Steps */}
          <div className="rounded-2xl border p-5">
            <div className="h-6 bg-gray-200 rounded animate-shimmer w-1/3 mb-4" />
            <div className="space-y-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="space-y-2">
                  <div className="h-4 bg-gray-200 rounded animate-shimmer w-full" />
                  <div className="h-4 bg-gray-200 rounded animate-shimmer w-5/6" />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
