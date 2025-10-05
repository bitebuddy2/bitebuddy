"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Search, Sparkles, ChefHat } from "lucide-react";
import { useRouter } from "next/navigation";

type Recipe = {
  slug: string;
  title: string;
  description?: string;
  introText?: string;
  servings?: number;
  prepMin?: number;
  cookMin?: number;
  heroImage?: {
    asset?: { url: string; metadata?: { lqip?: string } };
    alt?: string;
  };
  brand?: {
    _id: string;
    title: string;
    slug: string;
    logo?: {
      asset?: { url: string; metadata?: { lqip?: string } };
      alt?: string;
    };
  };
};

interface ModernHomepageProps {
  recipes: Recipe[];
}

export default function ModernHomepage({ recipes }: ModernHomepageProps) {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: "smooth" });
    }
  };

  // Get latest 6 recipes for display
  const latestRecipes = recipes.slice(0, 6);

  return (
    <div className="min-h-screen bg-white">

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-emerald-400 via-emerald-500 to-green-600 py-20 sm:py-28 md:py-36">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-extrabold text-white mb-6 leading-tight">
            Search among{" "}
            <span className="bg-yellow-300 text-gray-900 px-3 py-1 rounded-lg inline-block">
              1,500+
            </span>{" "}
            recipes
          </h1>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="mx-auto max-w-2xl mb-8">
            <div className="relative">
              <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for recipes, ingredients, or brands..."
                className="w-full rounded-full border-0 py-4 pl-14 pr-6 text-gray-900 shadow-xl focus:outline-none focus:ring-4 focus:ring-emerald-300/50 text-base sm:text-lg"
              />
            </div>
          </form>

          {/* Quick Navigation Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => scrollToSection("ai-generator")}
              className="flex items-center gap-2 rounded-full bg-white text-emerald-600 px-8 py-3.5 text-base font-semibold hover:bg-emerald-50 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <Sparkles className="h-5 w-5" />
              AI Generator
            </button>
            <button
              onClick={() => scrollToSection("latest-recipes")}
              className="flex items-center gap-2 rounded-full bg-gray-900 text-white px-8 py-3.5 text-base font-semibold hover:bg-gray-800 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              <ChefHat className="h-5 w-5" />
              Latest Recipes
            </button>
          </div>
        </div>
      </section>

      {/* AI Generator Section */}
      <section id="ai-generator" className="bg-gradient-to-br from-emerald-50 to-green-50 py-16 sm:py-20 md:py-24">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8 text-center">
          <div className="text-6xl sm:text-7xl mb-6">✨</div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Create Custom Recipes with AI
          </h2>
          <p className="text-lg sm:text-xl text-gray-700 mb-8 max-w-2xl mx-auto leading-relaxed">
            Out of ideas? Let our AI Recipe Generator create personalized recipes based on your ingredients,
            dietary preferences, and cooking style. Get creative meal suggestions in seconds!
          </p>
          <Link
            href="/search"
            className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold text-white hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
          >
            <Sparkles className="h-5 w-5" />
            Create with AI
          </Link>
        </div>
      </section>

      {/* Latest Recipes Section */}
      <section id="latest-recipes" className="py-16 sm:py-20 md:py-24 bg-white">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-gray-900 mb-12 text-center">
            Latest Recipes
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {latestRecipes.map((recipe) => {
              const imgUrl = recipe.heroImage?.asset?.url;
              const lqip = recipe.heroImage?.asset?.metadata?.lqip;
              const alt = recipe.heroImage?.alt || recipe.title;
              const blurb = recipe.description || recipe.introText || "";
              const truncated = blurb.length > 150 ? blurb.slice(0, 147).trimEnd() + "…" : blurb;

              return (
                <Link
                  key={recipe.slug}
                  href={`/recipes/${recipe.slug}`}
                  className="group overflow-hidden rounded-2xl bg-white border border-gray-200 hover:shadow-2xl transition-all duration-300 hover:-translate-y-2"
                >
                  {/* Recipe Image */}
                  <div className="relative aspect-[16/9] bg-gray-100 overflow-hidden">
                    {imgUrl ? (
                      <Image
                        src={imgUrl}
                        alt={alt}
                        fill
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                        placeholder={lqip ? "blur" : "empty"}
                        blurDataURL={lqip}
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 grid place-items-center text-gray-400 text-sm">
                        No image
                      </div>
                    )}

                    {/* Brand Badge */}
                    {recipe.brand && (
                      <div className="absolute top-3 left-3">
                        <span className="inline-flex items-center gap-2 rounded-full bg-white/95 backdrop-blur-sm px-3 py-1.5 text-sm font-semibold text-gray-900 shadow-md">
                          {recipe.brand.logo?.asset?.url ? (
                            <Image
                              src={recipe.brand.logo.asset.url}
                              alt={recipe.brand.logo.alt || recipe.brand.title}
                              width={20}
                              height={20}
                              className="object-cover rounded-full"
                            />
                          ) : null}
                          {recipe.brand.title}
                        </span>
                      </div>
                    )}
                  </div>

                  {/* Recipe Info */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-emerald-600 transition-colors line-clamp-2">
                      {recipe.title}
                    </h3>
                    {blurb && (
                      <p className="text-gray-600 mb-4 line-clamp-2 text-sm leading-relaxed">
                        {truncated}
                      </p>
                    )}

                    {/* Meta Info */}
                    <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                      {typeof recipe.prepMin === "number" && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                          Prep {recipe.prepMin}m
                        </span>
                      )}
                      {typeof recipe.cookMin === "number" && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                          Cook {recipe.cookMin}m
                        </span>
                      )}
                      {typeof recipe.servings === "number" && (
                        <span className="inline-flex items-center rounded-full bg-emerald-50 px-3 py-1 font-medium text-emerald-700">
                          Serves {recipe.servings}
                        </span>
                      )}
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* View All Button */}
          <div className="text-center mt-12">
            <Link
              href="/recipes"
              className="inline-flex items-center gap-2 rounded-full bg-emerald-600 px-8 py-4 text-lg font-semibold text-white hover:bg-emerald-700 transition-all duration-200 shadow-lg hover:shadow-xl hover:scale-105"
            >
              View All Recipes
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
