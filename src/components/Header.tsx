"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useSubscription } from "@/hooks/useSubscription";

const nav = [
  { href: "/about", label: "About Us" },
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

  // Get user's display name
  const userName = user?.user_metadata?.full_name ||
                   user?.user_metadata?.name ||
                   user?.email?.split('@')[0];

  return (
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900 shadow-lg will-change-transform">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <Link href="/" className="flex items-center">
          <div className="h-12 w-12 rounded-full overflow-hidden bg-white ring-2 ring-emerald-400 flex items-center justify-center p-0.5">
            <Image
              src="/bigger-logo.svg"
              alt="Bite Buddy"
              width={44}
              height={44}
              priority
              unoptimized
              className="w-full h-full object-contain"
            />
          </div>
        </Link>

        <nav className="hidden md:flex items-center gap-4">
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`text-sm hover:text-emerald-400 transition-colors ${
                pathname === n.href ? "font-semibold text-white" : "text-gray-300"
              }`}
            >
              {n.label}
            </Link>
          ))}
          {!isPremium && (
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
              className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700 flex items-center gap-2"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="hidden lg:inline">Hi, {userName}</span>
              <span className="lg:hidden">Account</span>
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
          {!isPremium && (
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
              className="rounded-full border border-emerald-400 text-emerald-400 px-3 py-1.5 text-sm font-semibold hover:bg-gray-800 flex items-center gap-1.5"
            >
              <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
              </svg>
              <span className="hidden sm:inline">{userName}</span>
              <span className="sm:hidden">Account</span>
            </Link>
          ) : (
            <Link
              href="/account"
              className="rounded-full border border-emerald-400 text-emerald-400 px-3 py-1.5 text-sm font-semibold hover:bg-gray-800"
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
