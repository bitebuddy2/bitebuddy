"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSubscription } from "@/hooks/useSubscription";

const nav = [
  { href: "/", label: "Home" },
  { href: "/recipes", label: "Recipes" },
  { href: "/products", label: "Products" },
  { href: "/search", label: "Ingredient Search" },
];

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const { isPremium } = useSubscription();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

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
          {!isPremium && user && (
            <Link
              href="/premium"
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-3 py-1.5 text-sm font-semibold text-white hover:from-amber-600 hover:to-orange-600 flex items-center gap-1"
            >
              <span>⭐</span> Go Premium
            </Link>
          )}
          {user ? (
            <Link
              href="/account"
              className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              My Account
            </Link>
          ) : (
            <Link
              href="/account"
              className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Sign In
            </Link>
          )}
        </nav>

        {/* Mobile nav */}
        <div className="md:hidden flex items-center gap-2">
          {!isPremium && user && (
            <Link
              href="/premium"
              className="rounded-full bg-gradient-to-r from-amber-500 to-orange-500 px-2 py-1.5 text-xs font-semibold text-white"
            >
              ⭐ Premium
            </Link>
          )}
          {user ? (
            <Link
              href="/account"
              className="rounded-full border border-emerald-600 text-emerald-600 px-3 py-1.5 text-sm font-semibold hover:bg-emerald-50"
            >
              Account
            </Link>
          ) : (
            <Link
              href="/account"
              className="rounded-full border border-emerald-600 text-emerald-600 px-3 py-1.5 text-sm font-semibold hover:bg-emerald-50"
            >
              Sign In
            </Link>
          )}
          <Link
            href="/recipes"
            className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
          >
            Recipes
          </Link>
        </div>
      </div>
    </header>
  );
}
