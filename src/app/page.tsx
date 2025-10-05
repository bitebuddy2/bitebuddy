import ModernHomepage from "@/components/ModernHomepage";
import { client } from "@/sanity/client";
import { allRecipesForCardsQuery } from "@/sanity/queries";

export default async function HomePage() {
  const recipes = await client.fetch(allRecipesForCardsQuery);

  return (
    <main>
      <ModernHomepage recipes={recipes} />
    </main>
  );
}
