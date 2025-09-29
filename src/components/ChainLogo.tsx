export default function ChainLogo({ className = "h-4 w-4" }: { className?: string }) {
  // Minimal chain link icon to match your theme
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true" fill="currentColor">
      <path d="M10.59 13.41a1 1 0 0 1 0-1.41l2.83-2.83a3 3 0 1 1 4.24 4.24l-1.41 1.41a1 1 0 0 1-1.41-1.41l1.41-1.41a1 1 0 1 0-1.41-1.41l-2.83 2.83a1 1 0 0 1-1.41 0Zm-7.07 7.07a3 3 0 0 1 0-4.24l2.83-2.83a1 1 0 0 1 1.41 1.41L4.93 17.65a1 1 0 1 0 1.41 1.41l2.83-2.83a1 1 0 0 1 1.41 1.41l-2.83 2.83a3 3 0 0 1-4.24 0Z"/>
    </svg>
  );
}
