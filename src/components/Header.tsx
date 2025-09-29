"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/search", label: "Search" },
  { href: "/studio", label: "Studio" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white/90 backdrop-blur">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="text-xl font-extrabold tracking-tight">
          Bite Buddy
        </Link>

        <nav className="flex items-center gap-4">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm hover:underline ${
                pathname === n.href ? "font-semibold" : "text-gray-700"
              }`}
            >
              {n.label}
            </Link>
          ))}
          <Link
            href="/recipes"
            className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Explore
          </Link>
        </nav>
      </div>
    </header>
  );
}
