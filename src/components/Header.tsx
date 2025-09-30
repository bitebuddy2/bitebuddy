"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

const nav = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/search", label: "Ingredient Search" },
  { href: "/studio", label: "Studio" },
];

export default function Header() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b bg-white shadow-sm">
      <div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <Image
            src="/Word Logo.svg"
            alt="Bite Buddy"
            width={120}
            height={32}
            priority
          />
        </Link>

        <nav className="hidden md:flex items-center gap-4">
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

        {/* Mobile nav */}
        <Link
          href="/recipes"
          className="md:hidden rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
        >
          Recipes
        </Link>
      </div>
    </header>
  );
}
