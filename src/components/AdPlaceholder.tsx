"use client";
import { useSubscription } from "@/hooks/useSubscription";

type AdPlaceholderProps = {
  size?: "banner" | "rectangle" | "leaderboard" | "sidebar";
  className?: string;
};

export default function AdPlaceholder({ size = "banner", className = "" }: AdPlaceholderProps) {
  const { isPremium } = useSubscription();

  // Don't show ads for premium users
  if (isPremium) {
    return null;
  }

  const sizeClasses = {
    banner: "h-24 sm:h-32", // 728x90 or responsive
    rectangle: "h-64", // 300x250
    leaderboard: "h-24", // 728x90
    sidebar: "h-96", // 300x600
  };

  return (
    <div className={`bg-gray-100 border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center ${sizeClasses[size]} ${className}`}>
      <div className="text-center text-gray-400">
        <p className="text-sm font-medium">Ad Space</p>
        <p className="text-xs mt-1">Google AdSense</p>
      </div>
    </div>
  );
}
