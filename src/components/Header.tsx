"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useEffect, useState, useRef } from "react";
import { createPortal } from "react-dom";
import { User } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useSubscription } from "@/hooks/useSubscription";
import { getUserAvatar } from "@/lib/getUserAvatar";
import { useShoppingList } from "@/hooks/useShoppingList";

const nav = [
  { href: "/", label: "Home" },
  { href: "/about", label: "About Us" },
  { href: "/recipes", label: "Recipes" },
  { href: "/community-recipes", label: "Community Recipes" },
  { href: "/search", label: "Ingredient Search" },
  { href: "/ai-recipe-generator", label: "AI Recipe Generator" },
  { href: "/products", label: "Products" },
];

function RecipesDropdown({ pathname }: { pathname: string }) {
  const [isOpen, setIsOpen] = useState(false);
  const [dropdownPosition, setDropdownPosition] = useState({ top: 0, left: 0 });
  const buttonRef = useRef<HTMLButtonElement>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();

  // Calculate dropdown position
  useEffect(() => {
    if (isOpen && buttonRef.current) {
      const rect = buttonRef.current.getBoundingClientRect();
      setDropdownPosition({
        top: rect.bottom + window.scrollY + 8,
        left: rect.left + window.scrollX,
      });
    }
  }, [isOpen]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);

  const handleMouseEnter = () => {
    clearTimeout(timeoutRef.current);
    setIsOpen(true);
  };

  const handleMouseLeave = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => setIsOpen(false), 150);
  };

  return (
    <div
      className="relative"
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <button
        ref={buttonRef}
        className={`text-sm hover:text-emerald-400 transition-colors flex items-center gap-1 ${
          pathname === "/recipes" || pathname === "/community-recipes"
            ? "font-semibold text-white"
            : "text-gray-300"
        }`}
      >
        Recipes
        <svg
          className={`w-3 h-3 transition-transform ${isOpen ? "rotate-180" : ""}`}
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {isOpen &&
        typeof window !== "undefined" &&
        createPortal(
          <div
            className="fixed w-48 bg-gray-800 rounded-lg shadow-xl border border-gray-700 overflow-hidden"
            style={{
              top: `${dropdownPosition.top}px`,
              left: `${dropdownPosition.left}px`,
              zIndex: 9999,
            }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <Link
              href="/recipes"
              className={`block px-4 py-3 text-sm hover:bg-gray-700 transition-colors ${
                pathname === "/recipes" ? "font-semibold text-white bg-gray-700" : "text-gray-300"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Regular Recipes
            </Link>
            <div className="h-px bg-gray-700" />
            <Link
              href="/community-recipes"
              className={`block px-4 py-3 text-sm hover:bg-gray-700 transition-colors ${
                pathname === "/community-recipes"
                  ? "font-semibold text-white bg-gray-700"
                  : "text-gray-300"
              }`}
              onClick={() => setIsOpen(false)}
            >
              Community Recipes
            </Link>
          </div>,
          document.body
        )}
    </div>
  );
}

export default function Header() {
  const pathname = usePathname();
  const [user, setUser] = useState<any>(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { isPremium } = useSubscription();
  const { items: shoppingListItems } = useShoppingList();

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => setUser(data.user));
    const { data: authListener } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
    });
    return () => {
      authListener.subscription.unsubscribe();
    };
  }, []);

  // Close mobile menu when route changes
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [pathname]);

  // Prevent body scroll when mobile menu is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [mobileMenuOpen]);

  // Get user's display name and avatar
  const userName = user?.user_metadata?.first_name ||
                   user?.user_metadata?.full_name ||
                   user?.user_metadata?.name ||
                   user?.email?.split('@')[0];
  const avatarUrl = getUserAvatar(user);

  return (
    <>
    <header className="sticky top-0 z-50 border-b border-gray-800 bg-gray-900 shadow-lg">
      <div className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between px-4">
        <div className="flex items-center gap-4">
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

          {/* Shopping List Icon */}
          <Link href="/shopping-list" className="relative group">
            <div className="p-2 rounded-lg hover:bg-gray-800 transition-colors">
              <svg className="w-6 h-6 text-gray-300 group-hover:text-emerald-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
              </svg>
              {shoppingListItems.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                  {shoppingListItems.length}
                </span>
              )}
            </div>
          </Link>
        </div>

        {/* Mobile greeting - shown only on mobile when user is logged in */}
        {user && (
          <Link
            href="/account"
            className="md:hidden flex items-center gap-2 text-sm text-white font-medium hover:text-emerald-400 transition-colors"
          >
            <span className="truncate max-w-[120px]">Hi, {userName}</span>
            {avatarUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={avatarUrl}
                src={avatarUrl}
                alt={userName || 'User'}
                className="w-7 h-7 rounded-full object-cover border-2 border-emerald-400"
              />
            ) : (
              <div className="w-7 h-7 rounded-full bg-emerald-600 flex items-center justify-center border-2 border-emerald-400">
                <User className="w-4 h-4 text-white" />
              </div>
            )}
          </Link>
        )}

        <nav className="hidden md:flex items-center gap-4">
          {nav
            .filter((n) => n.href !== "/recipes" && n.href !== "/community-recipes")
            .map((n) => (
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

          {/* Recipes Dropdown */}
          <RecipesDropdown pathname={pathname} />
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
              <span className="hidden lg:inline">Hi, {userName}</span>
              <span className="lg:hidden">Account</span>
              {avatarUrl ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={avatarUrl}
                  src={avatarUrl}
                  alt={userName || 'User'}
                  className="w-5 h-5 rounded-full object-cover border border-white"
                />
              ) : (
                <User className="w-5 h-5" />
              )}
            </Link>
          ) : (
            <Link
              href="/account"
              className="rounded-full bg-emerald-600 px-3 py-1.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              Sign In/Up
            </Link>
          )}
        </nav>

        {/* Mobile hamburger button */}
        <button
          onClick={() => {
            console.log('Hamburger clicked, current state:', mobileMenuOpen);
            setMobileMenuOpen(!mobileMenuOpen);
          }}
          className="md:hidden relative z-[60] p-2 text-gray-300 hover:text-white focus:outline-none"
          aria-label="Toggle menu"
        >
          <div className="w-6 h-5 flex flex-col justify-between">
            <span
              className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                mobileMenuOpen ? 'rotate-45 translate-y-2' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                mobileMenuOpen ? 'opacity-0' : ''
              }`}
            />
            <span
              className={`block h-0.5 w-full bg-current transition-all duration-300 ${
                mobileMenuOpen ? '-rotate-45 -translate-y-2' : ''
              }`}
            />
          </div>
        </button>
      </div>
    </header>

      {/* Mobile menu overlay */}
      {mobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black bg-opacity-50 transition-opacity duration-300 z-40"
          onClick={() => setMobileMenuOpen(false)}
        />
      )}

      {/* Mobile menu drawer */}
      <div
        className={`md:hidden fixed top-16 right-0 bottom-0 w-64 bg-gray-900 shadow-2xl transform transition-transform duration-300 ease-in-out overflow-y-auto z-50 ${
          mobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <nav className="flex flex-col p-4 space-y-2">
          {/* User section */}
          {user && (
            <div className="pb-4 mb-4 border-b border-gray-700">
              <div className="flex items-center gap-3 px-3 py-2">
                <div className="flex-1">
                  <p className="text-white font-semibold text-sm">{userName}</p>
                  <p className="text-gray-400 text-xs truncate">{user.email}</p>
                </div>
                <div className="w-10 h-10 rounded-full bg-emerald-600 flex items-center justify-center border-2 border-emerald-400 overflow-hidden flex-shrink-0">
                  {avatarUrl ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      key={avatarUrl}
                      src={avatarUrl}
                      alt={userName || 'User'}
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <User className="w-6 h-6 text-white" />
                  )}
                </div>
              </div>
              {isPremium && (
                <div className="mt-2 mx-3">
                  <span className="inline-flex items-center gap-1 rounded-full bg-gradient-to-r from-emerald-500 to-emerald-600 px-3 py-1 text-xs font-semibold text-white">
                    ⭐ Premium Member
                  </span>
                </div>
              )}
            </div>
          )}

          {/* Navigation links */}
          {nav.map((n) => (
            <Link
              key={n.href}
              href={n.href}
              className={`px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                pathname === n.href
                  ? 'bg-emerald-600 text-white'
                  : 'text-gray-300 hover:bg-gray-800 hover:text-white'
              }`}
            >
              {n.label}
            </Link>
          ))}

          {/* Divider */}
          <div className="border-t border-gray-700 my-2" />

          {/* Premium button */}
          {!isPremium && (
            <Link
              href="/premium"
              className="px-3 py-2.5 rounded-lg bg-gradient-to-r from-amber-500 to-orange-500 text-white text-sm font-semibold hover:from-amber-600 hover:to-orange-600 flex items-center justify-center gap-2"
            >
              <span>⭐</span> Upgrade to Premium
            </Link>
          )}

          {/* Account/Sign in button */}
          {user ? (
            <Link
              href="/account"
              className="px-3 py-2.5 rounded-lg border border-emerald-400 text-emerald-400 text-sm font-semibold hover:bg-gray-800 text-center"
            >
              My Account
            </Link>
          ) : (
            <Link
              href="/account"
              className="px-3 py-2.5 rounded-lg bg-emerald-600 text-white text-sm font-semibold hover:bg-emerald-700 text-center"
            >
              Sign In/Up
            </Link>
          )}

          {/* Sign out button */}
          {user && (
            <button
              onClick={() => {
                supabase.auth.signOut().then(() => {
                  setMobileMenuOpen(false);
                  window.location.reload();
                });
              }}
              className="px-3 py-2.5 rounded-lg border border-gray-600 text-gray-300 text-sm font-medium hover:bg-gray-800 hover:text-white text-center"
            >
              Sign Out
            </button>
          )}
        </nav>
      </div>
    </>
  );
}
