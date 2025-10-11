import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { SITE } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  // Fetch all content types in parallel
  const [recipes, brands, categories, communityRecipes, guides] = await Promise.all([
    client.fetch<{ slug: { current: string }; _updatedAt: string }[]>(
      `*[_type=="recipe" && defined(slug.current)]{ "slug": slug, _updatedAt }`
    ),
    client.fetch<{ slug: { current: string }; _updatedAt: string }[]>(
      `*[_type=="brand" && defined(slug.current)]{ "slug": slug, _updatedAt }`
    ),
    client.fetch<{ slug: { current: string }; _updatedAt: string }[]>(
      `*[_type=="category" && defined(slug.current)]{ "slug": slug, _updatedAt }`
    ),
    client.fetch<{ slug: { current: string }; _updatedAt: string }[]>(
      `*[_type=="communityRecipe" && defined(slug.current)]{ "slug": slug, _updatedAt }`
    ),
    client.fetch<{ slug: { current: string }; _updatedAt: string }[]>(
      `*[_type=="guide" && defined(slug.current)]{ "slug": slug, _updatedAt }`
    ),
  ]);

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE.url}/ai-recipe-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE.url}/recipes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE.url}/recipes/brands`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.85 },
    { url: `${SITE.url}/community-recipes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.85 },
    { url: `${SITE.url}/guides`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.8 },
    { url: `${SITE.url}/search`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
    { url: `${SITE.url}/products`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.7 },
    { url: `${SITE.url}/about`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.6 },
    { url: `${SITE.url}/premium`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.7 },
    { url: `${SITE.url}/contact`, lastModified: new Date(), changeFrequency: 'monthly', priority: 0.5 },
    { url: `${SITE.url}/privacy`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
    { url: `${SITE.url}/terms`, lastModified: new Date(), changeFrequency: 'yearly', priority: 0.3 },
  ];

  const recipeUrls: MetadataRoute.Sitemap =
    recipes.map((r) => ({
      url: `${SITE.url}/recipes/${r.slug.current}`,
      lastModified: new Date(r._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.8,
    })) || [];

  const brandUrls: MetadataRoute.Sitemap =
    brands.map((b) => ({
      url: `${SITE.url}/recipes/brands/${b.slug.current}`,
      lastModified: new Date(b._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })) || [];

  const categoryUrls: MetadataRoute.Sitemap =
    categories.map((c) => ({
      url: `${SITE.url}/recipes/categories/${c.slug.current}`,
      lastModified: new Date(c._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.75,
    })) || [];

  const communityRecipeUrls: MetadataRoute.Sitemap =
    communityRecipes.map((cr) => ({
      url: `${SITE.url}/community-recipes/${cr.slug.current}`,
      lastModified: new Date(cr._updatedAt),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    })) || [];

  const guideUrls: MetadataRoute.Sitemap =
    guides.map((g) => ({
      url: `${SITE.url}/guides/${g.slug.current}`,
      lastModified: new Date(g._updatedAt),
      changeFrequency: 'monthly' as const,
      priority: 0.7,
    })) || [];

  return [...staticUrls, ...recipeUrls, ...brandUrls, ...categoryUrls, ...communityRecipeUrls, ...guideUrls];
}
