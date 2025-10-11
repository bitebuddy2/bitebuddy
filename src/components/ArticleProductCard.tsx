import Link from "next/link";
import Image from "next/image";

type Product = {
  _id: string;
  title: string;
  slug: string;
  description?: string;
  image?: {
    asset?: {
      url: string;
      metadata?: { lqip?: string; dimensions?: { width: number; height: number } };
    };
    alt?: string;
  };
  category?: string;
  price?: number;
  affiliateLink?: string;
  retailer?: string;
  rating?: number;
};

const RETAILER_LABELS: Record<string, string> = {
  amazon: "Amazon",
  tesco: "Tesco",
  ocado: "Ocado",
  waitrose: "Waitrose",
  souschef: "Sous Chef",
  other: "Retailer",
};

export default function ArticleProductCard({ product }: { product: Product }) {
  const imgUrl = product.image?.asset?.url;
  const lqip = product.image?.asset?.metadata?.lqip;
  const alt = product.image?.alt || product.title;
  const retailerLabel = product.retailer ? RETAILER_LABELS[product.retailer] || product.retailer : "Shop";

  return (
    <article className="group bg-white rounded-xl border border-gray-200 overflow-hidden hover:shadow-lg transition-all duration-300">
      {/* Image */}
      {imgUrl && (
        <div className="relative aspect-square bg-gray-50 overflow-hidden">
          <Image
            src={imgUrl}
            alt={alt}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            placeholder={lqip ? "blur" : "empty"}
            blurDataURL={lqip}
            className="object-contain p-4 transition-transform duration-500 group-hover:scale-105"
          />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        {/* Title */}
        <h3 className="text-lg font-bold text-gray-900 mb-2 line-clamp-2">
          {product.title}
        </h3>

        {/* Description */}
        {product.description && (
          <p className="text-gray-600 text-sm leading-relaxed line-clamp-3 mb-3">
            {product.description}
          </p>
        )}

        {/* Meta info */}
        <div className="flex items-center justify-between mb-4">
          {/* Price */}
          {product.price && (
            <span className="text-2xl font-bold text-emerald-600">
              £{product.price.toFixed(2)}
            </span>
          )}

          {/* Rating */}
          {product.rating && (
            <div className="flex items-center gap-1">
              <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
              <span className="text-sm font-semibold text-gray-700">{product.rating.toFixed(1)}</span>
            </div>
          )}
        </div>

        {/* CTA Buttons */}
        <div className="flex gap-2">
          {/* Affiliate Link */}
          {product.affiliateLink && (
            <a
              href={product.affiliateLink}
              target="_blank"
              rel="nofollow noopener noreferrer sponsored"
              className="flex-1 inline-flex items-center justify-center gap-2 bg-emerald-600 text-white font-semibold px-4 py-2.5 rounded-lg hover:bg-emerald-700 transition-colors"
            >
              Buy on {retailerLabel}
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          )}

          {/* More Details Link */}
          <Link
            href={`/products/${product.slug}`}
            className="inline-flex items-center justify-center gap-1 text-emerald-600 font-medium px-3 py-2.5 rounded-lg hover:bg-emerald-50 transition-colors"
          >
            Details
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
            </svg>
          </Link>
        </div>

        {/* Affiliate Disclosure */}
        {product.affiliateLink && (
          <p className="text-xs text-gray-500 mt-3 leading-relaxed">
            As an affiliate, we may earn from qualifying purchases.
          </p>
        )}
      </div>
    </article>
  );
}
