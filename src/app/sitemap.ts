import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { SITE } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type=="recipe" && defined(slug.current)]{ "slug": slug }`
  );

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: new Date(), changeFrequency: 'daily', priority: 1.0 },
    { url: `${SITE.url}/ai-recipe-generator`, lastModified: new Date(), changeFrequency: 'weekly', priority: 0.95 },
    { url: `${SITE.url}/recipes`, lastModified: new Date(), changeFrequency: 'daily', priority: 0.9 },
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
      lastModified: new Date(),
      changeFrequency: 'weekly',
      priority: 0.8,
    })) || [];

  return [...staticUrls, ...recipeUrls];
}
