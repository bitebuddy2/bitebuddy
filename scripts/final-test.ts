import { client } from "../src/sanity/client";
import { recipesByIngredientNamesQuery } from "../src/sanity/queries";

async function test() {
  const names = ["sausage meat", "egg", "thyme"];
  const namesLower = names.map(name => name.toLowerCase());
  const searchPattern = `*(${names.map(name => name.toLowerCase()).join("|")})*`;

  console.log("Testing search with: sausage meat, egg, thyme");

  const results = await client.fetch(recipesByIngredientNamesQuery, {
    names, namesLower, searchPattern
  });

  console.log(`Results: ${results.length} recipes found`);

  if (results.length > 0) {
    const recipe = results[0];
    console.log(`Recipe: ${recipe.title}`);
    console.log(`Total matches: ${recipe.totalMatches}`);
    console.log(`Matched ingredients: ${recipe.matched.map((m: any) => m.name).join(", ")}`);
    console.log("SUCCESS: Search is working!");
  } else {
    console.log("ERROR: No results found");
  }
}

test().catch(console.error);