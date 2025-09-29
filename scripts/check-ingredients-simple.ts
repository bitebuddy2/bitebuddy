#!/usr/bin/env npx tsx

import { client } from "../src/sanity/client";
import { groq } from "next-sanity";

async function checkIngredients() {
  const ingredients = await client.fetch(groq`*[_type == "ingredient"] { _id, name }`);
  console.log("Total ingredients:", ingredients.length);
  ingredients.forEach((ing: any) => console.log(`  ${ing._id}: ${ing.name}`));
}

checkIngredients().catch(console.error);