"use client";

import Image from "next/image";
import Link from "next/link";

type Brand = {
  _id: string;
  title: string;
  slug: string;
  logo?: {
    asset?: { url: string; metadata?: { lqip?: string } };
    alt?: string;
  };
};

export default function BrandBar({ brands }: { brands: Brand[] }) {
  if (!brands || brands.length === 0) return null;

  return (
    <section className="border-b bg-white">
      <div className="mx-auto max-w-6xl px-4 py-6">
        <div className="flex items-center gap-6 overflow-x-auto pb-2 scrollbar-hide">
          {brands.map((brand) => (
            <Link
              key={brand._id}
              href={`/recipes?brand=${brand._id}`}
              className="flex items-center gap-3 flex-shrink-0 group hover:opacity-80 transition-opacity"
            >
              {brand.logo?.asset?.url ? (
                <div className="relative w-12 h-12 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
                  <Image
                    src={brand.logo.asset.url}
                    alt={brand.logo.alt || brand.title}
                    fill
                    className="object-cover"
                    sizes="48px"
                  />
                </div>
              ) : (
                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center flex-shrink-0">
                  <span className="text-lg font-semibold text-gray-500">
                    {brand.title.charAt(0)}
                  </span>
                </div>
              )}
              <span className="text-sm font-medium text-gray-900 group-hover:text-emerald-600 transition-colors whitespace-nowrap">
                {brand.title}
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
