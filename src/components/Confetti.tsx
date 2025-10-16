"use client";

import { useEffect, useState } from "react";

export default function Confetti({ trigger }: { trigger: boolean }) {
  const [confetti, setConfetti] = useState<{ id: number; left: string; delay: number; color: string }[]>([]);

  useEffect(() => {
    if (trigger) {
      // Generate 15 confetti pieces
      const pieces = Array.from({ length: 15 }, (_, i) => ({
        id: i,
        left: `${Math.random() * 100}%`,
        delay: Math.random() * 0.5,
        color: [
          "#10b981",
          "#f59e0b",
          "#ef4444",
          "#3b82f6",
          "#8b5cf6",
          "#ec4899",
        ][Math.floor(Math.random() * 6)],
      }));

      setConfetti(pieces);

      // Clear confetti after animation
      setTimeout(() => setConfetti([]), 3000);
    }
  }, [trigger]);

  if (confetti.length === 0) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {confetti.map((piece) => (
        <div
          key={piece.id}
          className="absolute w-3 h-3 animate-confetti"
          style={{
            left: piece.left,
            top: "-10%",
            backgroundColor: piece.color,
            animationDelay: `${piece.delay}s`,
          }}
        />
      ))}
    </div>
  );
}
