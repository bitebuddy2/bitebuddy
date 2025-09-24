import type { MetadataRoute } from "next";
import { client } from "@/sanity/client";
import { SITE } from "@/lib/seo";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const recipes = await client.fetch<{ slug: { current: string } }[]>(
    `*[_type=="recipe" && defined(slug.current)]{ "slug": slug }`
  );

  const staticUrls: MetadataRoute.Sitemap = [
    { url: `${SITE.url}/`, lastModified: new Date() },
    { url: `${SITE.url}/recipes`, lastModified: new Date() },
  ];

  const recipeUrls: MetadataRoute.Sitemap =
    recipes.map((r) => ({
      url: `${SITE.url}/recipes/${r.slug.current}`,
      lastModified: new Date(),
    })) || [];

  return [...staticUrls, ...recipeUrls];
}
