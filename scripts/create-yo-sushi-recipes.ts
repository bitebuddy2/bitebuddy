// scripts/create-yo-sushi-recipes.ts
import { createClient } from "@sanity/client";
import dotenv from "dotenv";
import { randomUUID } from "crypto";

dotenv.config({ path: ".env.local" });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  apiVersion: "2025-09-24",
  token: process.env.SANITY_WRITE_TOKEN!,
  useCdn: false,
});

// Ingredient definitions for all Yo! Sushi recipes
const allIngredients = [
  // Salmon Poke Bowl ingredients
  {
    name: "Sushi-grade salmon",
    synonyms: ["fresh salmon", "raw salmon", "salmon sashimi"],
    kcal100: 208,
    protein100: 20,
    fat100: 13,
    carbs100: 0,
    allergens: ["fish"],
  },
  {
    name: "Sushi rice",
    synonyms: ["Japanese rice", "short grain rice"],
    kcal100: 130,
    protein100: 2.4,
    fat100: 0.3,
    carbs100: 28.7,
    allergens: [],
    density_g_per_ml: 0.85,
  },
  {
    name: "Rice vinegar",
    synonyms: ["sushi vinegar", "Japanese rice vinegar"],
    kcal100: 18,
    protein100: 0.3,
    fat100: 0,
    carbs100: 0.8,
    allergens: [],
    density_g_per_ml: 1.0,
  },
  {
    name: "Edamame beans",
    synonyms: ["soy beans", "young soybeans"],
    kcal100: 122,
    protein100: 11,
    fat100: 5,
    carbs100: 10,
    allergens: ["soya"],
  },
  {
    name: "Cucumber",
    synonyms: ["fresh cucumber"],
    kcal100: 15,
    protein100: 0.7,
    fat100: 0.1,
    carbs100: 3.6,
    allergens: [],
    gramsPerPiece: 300,
  },
  {
    name: "Avocado",
    synonyms: ["fresh avocado"],
    kcal100: 160,
    protein100: 2,
    fat100: 15,
    carbs100: 9,
    allergens: [],
    gramsPerPiece: 200,
  },
  {
    name: "Soy sauce",
    synonyms: ["shoyu", "Japanese soy sauce"],
    kcal100: 53,
    protein100: 8,
    fat100: 0.1,
    carbs100: 4.9,
    allergens: ["soya", "gluten"],
    density_g_per_ml: 1.1,
  },
  {
    name: "Sesame oil",
    synonyms: ["toasted sesame oil"],
    kcal100: 884,
    protein100: 0,
    fat100: 100,
    carbs100: 0,
    allergens: ["sesame"],
    density_g_per_ml: 0.92,
  },
  {
    name: "Sesame seeds",
    synonyms: ["toasted sesame seeds"],
    kcal100: 573,
    protein100: 18,
    fat100: 50,
    carbs100: 23,
    allergens: ["sesame"],
  },
  {
    name: "Pickled ginger",
    synonyms: ["gari", "sushi ginger"],
    kcal100: 51,
    protein100: 0.2,
    fat100: 0.3,
    carbs100: 12,
    allergens: [],
  },
  {
    name: "Spring onion",
    synonyms: ["scallion", "green onion"],
    kcal100: 32,
    protein100: 1.8,
    fat100: 0.2,
    carbs100: 7.3,
    allergens: [],
    gramsPerPiece: 15,
  },
  {
    name: "Nori seaweed",
    synonyms: ["dried seaweed", "nori sheets"],
    kcal100: 35,
    protein100: 5.8,
    fat100: 0.3,
    carbs100: 5.1,
    allergens: [],
  },
  // King Prawn ingredients
  {
    name: "King prawns",
    synonyms: ["large prawns", "jumbo shrimp", "tiger prawns"],
    kcal100: 85,
    protein100: 18,
    fat100: 1.2,
    carbs100: 0.9,
    allergens: ["crustaceans"],
  },
  // Sweet Chilli Chicken ingredients
  {
    name: "Chicken breast",
    synonyms: ["chicken breast fillet", "skinless chicken breast"],
    kcal100: 165,
    protein100: 31,
    fat100: 3.6,
    carbs100: 0,
    allergens: [],
  },
  {
    name: "Sweet chilli sauce",
    synonyms: ["Thai sweet chili sauce"],
    kcal100: 180,
    protein100: 0.5,
    fat100: 0.3,
    carbs100: 44,
    allergens: [],
    density_g_per_ml: 1.2,
  },
  {
    name: "Cornflour",
    synonyms: ["cornstarch", "corn flour"],
    kcal100: 381,
    protein100: 0.3,
    fat100: 0.1,
    carbs100: 91,
    allergens: [],
  },
  // Shiitake Mushroom ingredients
  {
    name: "Shiitake mushrooms",
    synonyms: ["fresh shiitake", "shiitake"],
    kcal100: 34,
    protein100: 2.2,
    fat100: 0.5,
    carbs100: 6.8,
    allergens: [],
  },
  {
    name: "Teriyaki sauce",
    synonyms: ["Japanese teriyaki sauce"],
    kcal100: 89,
    protein100: 3,
    fat100: 0.1,
    carbs100: 20,
    allergens: ["soya", "gluten"],
    density_g_per_ml: 1.15,
  },
  {
    name: "Mirin",
    synonyms: ["Japanese sweet rice wine", "sweet cooking sake"],
    kcal100: 241,
    protein100: 0.2,
    fat100: 0,
    carbs100: 43,
    allergens: [],
    density_g_per_ml: 1.0,
  },
  // Dorayaki ingredients
  {
    name: "Plain flour",
    synonyms: ["all-purpose flour", "wheat flour"],
    kcal100: 364,
    protein100: 10,
    fat100: 1,
    carbs100: 76,
    allergens: ["gluten"],
  },
  {
    name: "Baking powder",
    synonyms: ["baking soda"],
    kcal100: 53,
    protein100: 0,
    fat100: 0,
    carbs100: 28,
    allergens: [],
  },
  {
    name: "Caster sugar",
    synonyms: ["superfine sugar", "fine sugar"],
    kcal100: 387,
    protein100: 0,
    fat100: 0,
    carbs100: 100,
    allergens: [],
  },
  {
    name: "Eggs",
    synonyms: ["hen eggs", "chicken eggs"],
    kcal100: 143,
    protein100: 13,
    fat100: 9.5,
    carbs100: 0.7,
    allergens: ["egg"],
    gramsPerPiece: 50,
  },
  {
    name: "Whole milk",
    synonyms: ["full fat milk", "cow's milk"],
    kcal100: 61,
    protein100: 3.2,
    fat100: 3.3,
    carbs100: 4.8,
    allergens: ["milk"],
    density_g_per_ml: 1.03,
  },
  {
    name: "Honey",
    synonyms: ["clear honey", "runny honey"],
    kcal100: 304,
    protein100: 0.3,
    fat100: 0,
    carbs100: 82,
    allergens: [],
    density_g_per_ml: 1.4,
  },
  {
    name: "Red bean paste",
    synonyms: ["anko", "sweet red bean paste", "azuki paste"],
    kcal100: 244,
    protein100: 6,
    fat100: 0.5,
    carbs100: 56,
    allergens: [],
  },
  {
    name: "Vegetable oil",
    synonyms: ["cooking oil", "sunflower oil"],
    kcal100: 884,
    protein100: 0,
    fat100: 100,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 0.92,
  },
  {
    name: "Garlic",
    synonyms: ["fresh garlic", "garlic cloves"],
    kcal100: 149,
    protein100: 6.4,
    fat100: 0.5,
    carbs100: 33,
    allergens: [],
    gramsPerPiece: 5,
  },
  {
    name: "Fresh ginger",
    synonyms: ["ginger root", "root ginger"],
    kcal100: 80,
    protein100: 1.8,
    fat100: 0.8,
    carbs100: 18,
    allergens: [],
  },
  {
    name: "Lime",
    synonyms: ["fresh lime"],
    kcal100: 30,
    protein100: 0.7,
    fat100: 0.2,
    carbs100: 11,
    allergens: [],
    gramsPerPiece: 67,
  },
  {
    name: "Red chilli",
    synonyms: ["fresh red chilli", "red chili pepper"],
    kcal100: 40,
    protein100: 2,
    fat100: 0.4,
    carbs100: 9,
    allergens: [],
    gramsPerPiece: 10,
  },
  {
    name: "Fine sea salt",
    synonyms: ["sea salt", "table salt"],
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
  },
  {
    name: "Carrot",
    synonyms: ["fresh carrot"],
    kcal100: 41,
    protein100: 0.9,
    fat100: 0.2,
    carbs100: 10,
    allergens: [],
    gramsPerPiece: 100,
  },
];

async function createOrGetIngredient(ingredientData: typeof allIngredients[0]) {
  const existing = await client.fetch(
    `*[_type == "ingredient" && name == $name][0]`,
    { name: ingredientData.name }
  );

  if (existing) {
    console.log(`✅ Found existing ingredient: ${ingredientData.name}`);
    return existing._id;
  }

  if (ingredientData.synonyms && ingredientData.synonyms.length > 0) {
    for (const synonym of ingredientData.synonyms) {
      const bySynonym = await client.fetch(
        `*[_type == "ingredient" && (name == $syn || $syn in synonyms)][0]`,
        { syn: synonym }
      );
      if (bySynonym) {
        console.log(
          `✅ Found existing ingredient by synonym: ${ingredientData.name} (matches: ${bySynonym.name})`
        );
        return bySynonym._id;
      }
    }
  }

  console.log(`➕ Creating new ingredient: ${ingredientData.name}`);
  const doc = await client.create({
    _type: "ingredient",
    ...ingredientData,
  });

  return doc._id;
}

async function createOrGetBrand() {
  console.log("Checking for Yo! Sushi brand...\n");

  const existing = await client.fetch(
    `*[_type == "brand" && name == "Yo! Sushi"][0]`
  );

  if (existing) {
    console.log(`✅ Found existing brand: Yo! Sushi`);
    return existing._id;
  }

  console.log("➕ Creating Yo! Sushi brand...");
  const brand = await client.create({
    _type: "brand",
    name: "Yo! Sushi",
    slug: {
      _type: "slug",
      current: "yo-sushi",
    },
    description: "Japanese-inspired fast food chain serving fresh sushi, bowls, and Asian dishes.",
  });

  console.log("✅ Brand created:", brand._id);
  return brand._id;
}

async function createRecipes() {
  console.log("🍱 Creating Yo! Sushi recipes...\n");

  // Create brand first
  const brandId = await createOrGetBrand();

  // Create all ingredients
  console.log("\nCreating ingredients...\n");
  const ingredientIds: { [key: string]: string } = {};

  for (const ing of allIngredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");

  // Recipe 1: Salmon Poke Bowl
  console.log("Creating Salmon Poke Bowl...\n");
  const salmonPokeData = {
    _type: "recipe",
    title: "Yo! Sushi Salmon Poke Bowl",
    slug: {
      _type: "slug",
      current: "yo-sushi-salmon-poke-bowl",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Fresh, vibrant salmon poke bowl with sushi rice, avocado, edamame, and sesame dressing. A delicious, healthy Japanese-inspired meal.",
    servings: 2,
    prepMin: 20,
    cookMin: 15,
    introText:
      "Yo! Sushi's Salmon Poke Bowl is a fresh, colorful celebration of Japanese flavors. Featuring tender cubes of sushi-grade salmon marinated in a savory soy-sesame dressing, served over perfectly seasoned sushi rice with creamy avocado, crunchy edamame, and fresh vegetables. This bowl delivers restaurant-quality taste with wholesome ingredients that are as nutritious as they are delicious. Whether you're craving a light lunch or a satisfying dinner, this poke bowl brings the excitement of Yo! Sushi's conveyor belt straight to your home kitchen. It's fresh, filling, and ready in just 35 minutes.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Yo! Sushi opened its first restaurant in London's Soho in 1997, revolutionizing British dining with its iconic kaiten conveyor belt concept. Founded by Simon Woodroffe, the brand made fresh Japanese cuisine accessible and fun, transforming sushi from an intimidating delicacy into an everyday treat.",
          },
        ],
        style: "normal",
      },
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "While Yo! Sushi started with traditional sushi, they've expanded their menu to include contemporary Japanese-fusion dishes like poke bowls. These colorful bowls reflect modern healthy eating trends while honoring traditional Japanese ingredients and flavors.",
          },
        ],
        style: "normal",
      },
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "This Salmon Poke Bowl captures Yo! Sushi's signature style - fresh, vibrant, and perfectly balanced. Now you can recreate this restaurant favorite at home with simple ingredients and easy techniques.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Rice",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sushi rice"] },
            quantity: "200",
            unit: "g",
            notes: "uncooked",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Rice vinegar"] },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Caster sugar"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "0.5",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Salmon & Marinade",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sushi-grade salmon"] },
            quantity: "300",
            unit: "g",
            notes: "cut into 2cm cubes",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Soy sauce"] },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sesame oil"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Lime"] },
            quantity: "1",
            unit: "piece",
            notes: "juice only",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Toppings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Avocado"] },
            quantity: "1",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Edamame beans"] },
            quantity: "100",
            unit: "g",
            notes: "cooked and shelled",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cucumber"] },
            quantity: "0.5",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Carrot"] },
            quantity: "1",
            unit: "piece",
            notes: "julienned",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sesame seeds"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Spring onion"] },
            quantity: "2",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Nori seaweed"] },
            quantity: "1",
            unit: "sheet",
            notes: "cut into strips",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Pickled ginger"] },
            quantity: "2",
            unit: "tbsp",
          },
        ],
      },
    ],
    steps: [
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Rinse the sushi rice under cold water until the water runs clear." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Cook the rice according to package instructions, then let it steam covered for 10 minutes." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Mix rice vinegar, sugar, and salt in a small bowl until dissolved." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Pour the vinegar mixture over the hot rice and gently fold it in. Let cool to room temperature." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Cut the salmon into 2cm cubes and place in a bowl." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Mix soy sauce, sesame oil, and lime juice together." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Pour the marinade over the salmon and gently toss. Let marinate for 10 minutes." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Divide the sushi rice between two bowls." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Arrange the marinated salmon, avocado, edamame, cucumber, and carrot on top of the rice." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Sprinkle with sesame seeds, spring onions, and nori strips." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Serve with pickled ginger on the side and enjoy immediately." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Always use sushi-grade salmon from a reputable fishmonger for safe raw consumption.",
      "Let the rice cool to room temperature before assembling - hot rice will warm the salmon.",
      "Prep all your toppings before starting for quick, easy assembly.",
      "Add a drizzle of sriracha mayo for extra creaminess and heat.",
      "Use frozen edamame beans - just defrost and shell them for convenience.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use cooked salmon instead of raw?",
        answer:
          "Yes! Grill or pan-fry salmon fillets with teriyaki glaze instead. It's just as delicious and perfect if you prefer cooked fish.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How long does leftover poke bowl keep?",
        answer:
          "The rice and vegetables keep for 1-2 days in the fridge. However, raw salmon should be eaten fresh on the same day. Store components separately for best results.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Where do I buy sushi-grade salmon?",
        answer:
          "Look for 'sushi-grade' or 'sashimi-grade' salmon at quality fishmongers, Japanese supermarkets, or the fresh fish counter at upscale supermarkets. Ask your fishmonger if it's safe for raw consumption.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this bowl vegetarian?",
        answer:
          "Absolutely! Replace salmon with marinated tofu, more edamame, or tempura vegetables. The bowl works brilliantly as a veggie option.",
      },
    ],
    nutrition: {
      calories: 520,
      protein: 35,
      fat: 18,
      carbs: 55,
    },
    seoTitle: "Yo! Sushi Salmon Poke Bowl - Easy Japanese Recipe",
    seoDescription:
      "Make Yo! Sushi's fresh salmon poke bowl at home! Sushi rice, marinated salmon, avocado & edamame in 35 minutes. Restaurant-quality Japanese bowl.",
  };

  const existingSalmon = await client.fetch(
    `*[_type == "recipe" && slug.current == "yo-sushi-salmon-poke-bowl"][0]`
  );

  if (existingSalmon) {
    await client.patch(existingSalmon._id).set(salmonPokeData).commit();
    console.log("✅ Salmon Poke Bowl updated");
  } else {
    await client.create(salmonPokeData);
    console.log("✅ Salmon Poke Bowl created");
  }

  // Recipe 2: King Prawn Poke Bowl
  console.log("\nCreating King Prawn Poke Bowl...\n");
  const prawnPokeData = {
    _type: "recipe",
    title: "Yo! Sushi King Prawn Poke Bowl",
    slug: {
      _type: "slug",
      current: "yo-sushi-king-prawn-poke-bowl",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Succulent king prawns with sushi rice, fresh vegetables, and zesty sesame-lime dressing. A light, protein-packed Japanese-inspired bowl.",
    servings: 2,
    prepMin: 20,
    cookMin: 10,
    introText:
      "Yo! Sushi's King Prawn Poke Bowl offers a lighter alternative to salmon, featuring plump, perfectly cooked prawns with a delicate sweetness that pairs beautifully with fresh vegetables and tangy dressing. This seafood sensation combines tender king prawns with crisp cucumber, creamy avocado, and vibrant edamame over fluffy sushi rice. The sesame-lime marinade adds brightness and depth, while the toppings provide satisfying crunch and color. It's a restaurant-quality meal that's surprisingly quick to prepare at home - perfect for busy weeknights when you want something healthy, delicious, and impressive. Ready in just 30 minutes, this bowl brings Japanese-inspired freshness to your table.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Since 1997, Yo! Sushi has been at the forefront of making Japanese cuisine accessible to British diners. What started as a single restaurant with a conveyor belt has grown into a beloved chain known for fresh, quality ingredients and innovative menu items.",
          },
        ],
        style: "normal",
      },
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "The King Prawn Poke Bowl represents Yo! Sushi's evolution from traditional sushi to contemporary Japanese-fusion cuisine. Poke bowls have become incredibly popular for their customizable nature and health benefits, and Yo! Sushi's version showcases premium seafood with fresh, colorful ingredients.",
          },
        ],
        style: "normal",
      },
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "This recipe recreates that signature Yo! Sushi experience - bold flavors, beautiful presentation, and ingredients that make you feel good. Perfect for seafood lovers looking for a lighter poke option.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Rice",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sushi rice"] },
            quantity: "200",
            unit: "g",
            notes: "uncooked",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Rice vinegar"] },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Caster sugar"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "0.5",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Prawns & Marinade",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["King prawns"] },
            quantity: "300",
            unit: "g",
            notes: "raw, peeled",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Soy sauce"] },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sesame oil"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Lime"] },
            quantity: "1",
            unit: "piece",
            notes: "juice only",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic"] },
            quantity: "2",
            unit: "clove",
            notes: "minced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fresh ginger"] },
            quantity: "1",
            unit: "tsp",
            notes: "grated",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Toppings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Avocado"] },
            quantity: "1",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Edamame beans"] },
            quantity: "100",
            unit: "g",
            notes: "cooked and shelled",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cucumber"] },
            quantity: "0.5",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Carrot"] },
            quantity: "1",
            unit: "piece",
            notes: "julienned",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Red chilli"] },
            quantity: "1",
            unit: "piece",
            notes: "sliced, optional",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sesame seeds"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Spring onion"] },
            quantity: "2",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Nori seaweed"] },
            quantity: "1",
            unit: "sheet",
            notes: "cut into strips",
          },
        ],
      },
    ],
    steps: [
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Rinse sushi rice under cold water until water runs clear." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Cook rice according to package instructions. Steam covered for 10 minutes after cooking." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Mix rice vinegar, sugar, and salt until dissolved." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Fold the vinegar mixture into the hot rice. Let cool to room temperature." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Pat the prawns dry with kitchen paper." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Mix soy sauce, sesame oil, lime juice, garlic, and ginger in a bowl." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Heat a frying pan over high heat with a little oil." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Cook prawns for 2-3 minutes each side until pink and cooked through." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Toss the hot prawns in the marinade. Let cool slightly." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Divide rice between two bowls." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Arrange prawns, avocado, edamame, cucumber, carrot, and chilli on top." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Garnish with sesame seeds, spring onions, and nori. Serve immediately." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Don't overcook the prawns - they should be just pink and tender, not rubbery.",
      "Use frozen raw prawns if fresh aren't available - just defrost thoroughly first.",
      "Save some marinade before adding prawns to drizzle over the finished bowl.",
      "Add a squeeze of sriracha for extra heat and flavor.",
      "Prep vegetables while the rice is cooking to save time.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use pre-cooked prawns?",
        answer:
          "Yes, but they won't absorb the marinade as well. Warm them gently and toss in the marinade just before serving to add flavor.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What can I substitute for prawns?",
        answer:
          "Try cooked chicken, crispy tofu, or even flaked hot-smoked salmon. All work beautifully with the sesame-lime marinade.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I meal prep this bowl?",
        answer:
          "Yes! Store rice, cooked prawns, and vegetables separately in the fridge for up to 2 days. Assemble just before eating for best texture and freshness.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Is this bowl gluten-free?",
        answer:
          "Use tamari instead of regular soy sauce to make it gluten-free. Check all other ingredients for gluten as well.",
      },
    ],
    nutrition: {
      calories: 485,
      protein: 32,
      fat: 15,
      carbs: 54,
    },
    seoTitle: "Yo! Sushi King Prawn Poke Bowl Recipe - 30 Minutes",
    seoDescription:
      "Recreate Yo! Sushi's king prawn poke bowl! Juicy prawns with sushi rice, avocado & fresh veggies. Healthy Japanese-inspired dinner in 30 minutes.",
  };

  const existingPrawn = await client.fetch(
    `*[_type == "recipe" && slug.current == "yo-sushi-king-prawn-poke-bowl"][0]`
  );

  if (existingPrawn) {
    await client.patch(existingPrawn._id).set(prawnPokeData).commit();
    console.log("✅ King Prawn Poke Bowl updated");
  } else {
    await client.create(prawnPokeData);
    console.log("✅ King Prawn Poke Bowl created");
  }

  // Recipe 3: Sweet Chilli Chicken Rice Bowl
  console.log("\nCreating Sweet Chilli Chicken Rice Bowl...\n");
  const chickenBowlData = {
    _type: "recipe",
    title: "Yo! Sushi Sweet Chilli Chicken Rice Bowl",
    slug: {
      _type: "slug",
      current: "yo-sushi-sweet-chilli-chicken-rice-bowl",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Crispy chicken glazed in sweet chilli sauce over fluffy rice with fresh vegetables. A crowd-pleasing Japanese-fusion bowl with perfect sweet-heat balance.",
    servings: 2,
    prepMin: 15,
    cookMin: 20,
    introText:
      "Yo! Sushi's Sweet Chilli Chicken Rice Bowl is a crowd-pleaser that perfectly balances sweet and spicy flavors with crispy, tender chicken. This Japanese-fusion dish features golden-fried chicken pieces coated in a sticky, glossy sweet chilli glaze, served over fluffy rice with colorful fresh vegetables. It's the kind of meal that appeals to everyone - from adventurous eaters to those new to Japanese cuisine. The crispy coating on the chicken provides satisfying texture, while the sweet chilli sauce delivers just the right amount of heat. Quick enough for a weeknight dinner yet impressive enough for guests, this bowl brings the excitement of Yo! Sushi's menu to your home kitchen in just 35 minutes.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Yo! Sushi has always been about making Japanese food accessible and exciting for everyone. While they're famous for sushi, their menu has expanded to include Asian-fusion dishes that appeal to a broader audience, including those who prefer cooked options to raw fish.",
          },
        ],
        style: "normal",
      },
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "The Sweet Chilli Chicken Rice Bowl represents this evolution perfectly - it takes familiar flavors like crispy chicken and sweet chilli sauce and presents them in a fresh, contemporary bowl format. It's comfort food with a Japanese twist, and it's become one of their most popular non-sushi items.",
          },
        ],
        style: "normal",
      },
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "This copycat recipe captures all the flavors and textures that make Yo! Sushi's version so addictive - crispy chicken, sticky-sweet sauce, and fresh vegetables all in one satisfying bowl.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Rice",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sushi rice"] },
            quantity: "200",
            unit: "g",
            notes: "uncooked",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Rice vinegar"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Caster sugar"] },
            quantity: "0.5",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Chicken",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken breast"] },
            quantity: "300",
            unit: "g",
            notes: "cut into bite-sized pieces",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cornflour"] },
            quantity: "50",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "0.5",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Vegetable oil"] },
            quantity: "3",
            unit: "tbsp",
            notes: "for frying",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Sweet Chilli Glaze",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sweet chilli sauce"] },
            quantity: "100",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Soy sauce"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic"] },
            quantity: "2",
            unit: "clove",
            notes: "minced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fresh ginger"] },
            quantity: "1",
            unit: "tsp",
            notes: "grated",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Toppings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Edamame beans"] },
            quantity: "100",
            unit: "g",
            notes: "cooked",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cucumber"] },
            quantity: "0.5",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Carrot"] },
            quantity: "1",
            unit: "piece",
            notes: "julienned",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Spring onion"] },
            quantity: "2",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sesame seeds"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Red chilli"] },
            quantity: "1",
            unit: "piece",
            notes: "sliced, optional",
          },
        ],
      },
    ],
    steps: [
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Cook sushi rice according to package instructions." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Mix rice vinegar and sugar, then fold into hot cooked rice. Set aside." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Cut chicken into bite-sized pieces and pat dry with kitchen paper." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Mix cornflour and salt in a bowl. Toss chicken pieces until evenly coated." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Heat vegetable oil in a large frying pan over medium-high heat." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Fry chicken pieces for 6-8 minutes, turning regularly, until golden and cooked through." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Remove chicken and drain on kitchen paper. Pour off excess oil from pan." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "In the same pan, add sweet chilli sauce, soy sauce, garlic, and ginger." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Simmer the sauce for 2 minutes until slightly thickened." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Return chicken to the pan and toss until completely coated in the sticky glaze." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Divide rice between two bowls and top with glazed chicken." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Arrange edamame, cucumber, and carrot around the chicken." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Garnish with spring onions, sesame seeds, and fresh chilli. Serve immediately." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Make sure chicken pieces are dry before coating - this ensures a crispier coating.",
      "Don't overcrowd the pan when frying - cook in batches if needed for best results.",
      "Add the chicken back to the sauce just before serving to keep it crispy.",
      "Use chicken thighs instead of breast for juicier, more flavorful meat.",
      "Double the sauce recipe and serve extra on the side for drizzling.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I bake the chicken instead of frying?",
        answer:
          "Yes! Coat chicken in cornflour, spray with oil, and bake at 200°C for 20-25 minutes, turning halfway. Then toss in the sauce.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How spicy is this dish?",
        answer:
          "It's mild to medium - sweet chilli sauce has gentle heat. Add fresh chilli or sriracha if you prefer more kick.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use shop-bought sweet chilli sauce?",
        answer:
          "Absolutely! Good quality bottled sweet chilli sauce works perfectly. Brands like Blue Dragon or Thai Taste are excellent choices.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this gluten-free?",
        answer:
          "Yes - use cornflour (which is naturally gluten-free), tamari instead of soy sauce, and check your sweet chilli sauce label to ensure it's gluten-free.",
      },
    ],
    nutrition: {
      calories: 565,
      protein: 38,
      fat: 14,
      carbs: 72,
    },
    seoTitle: "Yo! Sushi Sweet Chilli Chicken Bowl - Easy Recipe",
    seoDescription:
      "Make Yo! Sushi's sweet chilli chicken rice bowl! Crispy chicken in sticky glaze with rice and fresh veggies. Restaurant-quality meal in 35 minutes.",
  };

  const existingChicken = await client.fetch(
    `*[_type == "recipe" && slug.current == "yo-sushi-sweet-chilli-chicken-rice-bowl"][0]`
  );

  if (existingChicken) {
    await client.patch(existingChicken._id).set(chickenBowlData).commit();
    console.log("✅ Sweet Chilli Chicken Rice Bowl updated");
  } else {
    await client.create(chickenBowlData);
    console.log("✅ Sweet Chilli Chicken Rice Bowl created");
  }

  // Recipe 4: Shiitake Mushroom Teriyaki Poke
  console.log("\nCreating Shiitake Mushroom Teriyaki Poke...\n");
  const mushroomPokeData = {
    _type: "recipe",
    title: "Yo! Sushi Shiitake Mushroom Teriyaki Poke",
    slug: {
      _type: "slug",
      current: "yo-sushi-shiitake-mushroom-teriyaki-poke",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Savory teriyaki-glazed shiitake mushrooms over sushi rice with fresh vegetables. A delicious vegetarian poke bowl bursting with umami flavor.",
    servings: 2,
    prepMin: 15,
    cookMin: 15,
    introText:
      "Yo! Sushi's Shiitake Mushroom Teriyaki Poke is proof that vegetarian bowls can be just as satisfying and flavorful as their seafood counterparts. This meat-free masterpiece features meaty shiitake mushrooms caramelized in a glossy teriyaki glaze, delivering deep umami flavor that rivals any protein. Paired with perfectly seasoned sushi rice, creamy avocado, crunchy vegetables, and nutty sesame seeds, every bite offers a symphony of textures and tastes. It's a bowl that appeals to vegetarians and meat-eaters alike, showcasing how Japanese cuisine celebrates vegetables as the star ingredient. Quick to prepare and incredibly satisfying, this poke bowl proves that plant-based eating can be absolutely delicious.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Yo! Sushi has always been committed to offering diverse menu options for all dietary preferences. As plant-based eating has grown in popularity, they've expanded their vegetarian and vegan offerings beyond simple vegetable sushi to include creative, satisfying bowls and hot dishes.",
          },
        ],
        style: "normal",
      },
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "The Shiitake Mushroom Teriyaki Poke showcases Japanese cuisine's traditional respect for vegetables as main ingredients, not afterthoughts. Shiitake mushrooms have been prized in Asian cooking for centuries for their rich, meaty texture and complex flavor - making them perfect for a hearty, satisfying bowl.",
          },
        ],
        style: "normal",
      },
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "This recipe brings Yo! Sushi's vegetarian excellence home, proving that meatless meals can be packed with flavor, texture, and satisfaction.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Rice",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sushi rice"] },
            quantity: "200",
            unit: "g",
            notes: "uncooked",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Rice vinegar"] },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Caster sugar"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "0.5",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Teriyaki Mushrooms",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Shiitake mushrooms"] },
            quantity: "250",
            unit: "g",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Teriyaki sauce"] },
            quantity: "60",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Mirin"] },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Soy sauce"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic"] },
            quantity: "2",
            unit: "clove",
            notes: "minced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fresh ginger"] },
            quantity: "1",
            unit: "tsp",
            notes: "grated",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sesame oil"] },
            quantity: "1",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Toppings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Avocado"] },
            quantity: "1",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Edamame beans"] },
            quantity: "100",
            unit: "g",
            notes: "cooked and shelled",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cucumber"] },
            quantity: "0.5",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Carrot"] },
            quantity: "1",
            unit: "piece",
            notes: "julienned",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Spring onion"] },
            quantity: "2",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Sesame seeds"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Nori seaweed"] },
            quantity: "1",
            unit: "sheet",
            notes: "cut into strips",
          },
        ],
      },
    ],
    steps: [
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Cook sushi rice according to package instructions." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Mix rice vinegar, sugar, and salt until dissolved." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Fold the vinegar mixture into hot rice. Let cool to room temperature." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Wipe shiitake mushrooms clean and remove stems. Slice into thick pieces." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Mix teriyaki sauce, mirin, soy sauce, garlic, and ginger in a bowl." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Heat sesame oil in a large frying pan over medium-high heat." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Add mushrooms and cook for 5-6 minutes until they release moisture and start browning." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Pour in the teriyaki mixture and cook for 3-4 minutes, stirring frequently." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Continue cooking until sauce is thick and glossy, coating the mushrooms completely." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Divide rice between two bowls." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Top with teriyaki mushrooms, avocado, edamame, cucumber, and carrot." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Garnish with spring onions, sesame seeds, and nori strips. Serve immediately." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Don't wash shiitake mushrooms - wipe them with damp kitchen paper to preserve flavor.",
      "Let mushrooms cook undisturbed at first to develop a golden crust.",
      "Fresh shiitakes work best, but rehydrated dried shiitakes add even deeper flavor.",
      "Add a splash of water if the sauce gets too thick before the mushrooms are cooked.",
      "Try adding other mushrooms like oyster or chestnut for variety.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use other mushrooms?",
        answer:
          "Yes! Portobello, oyster, or chestnut mushrooms all work well. Shiitakes have the best texture and umami flavor, but feel free to mix varieties.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Is this bowl vegan?",
        answer:
          "It can be! Check your teriyaki sauce label - some contain fish or honey. Use vegan-certified teriyaki sauce to make it fully plant-based.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make the teriyaki mushrooms ahead?",
        answer:
          "Yes, cook the mushrooms up to 2 days ahead and store in the fridge. Reheat gently before serving to maintain their texture.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What can I use instead of mirin?",
        answer:
          "Mix 1 tablespoon white wine or rice vinegar with 1 tablespoon sugar as a substitute. It won't be identical but will work in a pinch.",
      },
    ],
    nutrition: {
      calories: 445,
      protein: 12,
      fat: 16,
      carbs: 65,
    },
    seoTitle: "Yo! Sushi Shiitake Teriyaki Poke - Vegetarian Recipe",
    seoDescription:
      "Make Yo! Sushi's shiitake mushroom teriyaki poke! Umami-rich vegetarian bowl with glazed mushrooms, rice & fresh veggies. Ready in 30 minutes.",
  };

  const existingMushroom = await client.fetch(
    `*[_type == "recipe" && slug.current == "yo-sushi-shiitake-mushroom-teriyaki-poke"][0]`
  );

  if (existingMushroom) {
    await client.patch(existingMushroom._id).set(mushroomPokeData).commit();
    console.log("✅ Shiitake Mushroom Teriyaki Poke updated");
  } else {
    await client.create(mushroomPokeData);
    console.log("✅ Shiitake Mushroom Teriyaki Poke created");
  }

  // Recipe 5: Dorayaki Pancakes
  console.log("\nCreating Dorayaki Pancakes...\n");
  const dorayakiData = {
    _type: "recipe",
    title: "Yo! Sushi Dorayaki Pancakes",
    slug: {
      _type: "slug",
      current: "yo-sushi-dorayaki-pancakes",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Fluffy Japanese pancakes filled with sweet red bean paste. A delightful, authentic dessert that's Doraemon's favorite treat.",
    servings: 6,
    prepMin: 10,
    cookMin: 20,
    introText:
      "Yo! Sushi's Dorayaki Pancakes are a delightful introduction to traditional Japanese sweets. These soft, fluffy pancakes sandwiched with sweet red bean paste might seem unusual to Western palates, but they're absolutely addictive once you try them. Light and slightly sweet with a honey-kissed flavor, the pancakes have a texture somewhere between American pancakes and cake. The red bean paste filling provides earthy sweetness and smooth texture that perfectly complements the fluffy pancakes. Popular across Japan and beloved by manga character Doraemon, dorayaki are comfort food at its finest. Easy to make at home and fun to eat, these pancakes make a unique dessert or afternoon snack that'll transport you straight to Tokyo.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "While Yo! Sushi is best known for savory dishes, their dessert menu features authentic Japanese sweets that give diners a complete taste of Japanese food culture. Dorayaki represents Japan's rich tradition of wagashi (traditional sweets), adapted for modern tastes and international audiences.",
          },
        ],
        style: "normal",
      },
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Dorayaki became globally famous as the favorite food of Doraemon, the beloved manga and anime character. The sweet red bean filling might be unfamiliar to some, but it's been enjoyed in Japan for centuries - naturally sweet, nutritious, and absolutely delicious when you give it a try.",
          },
        ],
        style: "normal",
      },
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "This recipe recreates Yo! Sushi's version with simple ingredients and easy techniques, bringing authentic Japanese dessert culture to your home kitchen.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Pancakes",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Eggs"] },
            quantity: "2",
            unit: "piece",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Caster sugar"] },
            quantity: "80",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Honey"] },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Whole milk"] },
            quantity: "80",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Plain flour"] },
            quantity: "150",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Baking powder"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Vegetable oil"] },
            quantity: "1",
            unit: "tbsp",
            notes: "for cooking",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Filling",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Red bean paste"] },
            quantity: "200",
            unit: "g",
          },
        ],
      },
    ],
    steps: [
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Whisk eggs and sugar together in a bowl until light and frothy." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Add honey and milk, whisking until well combined." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Sift in flour and baking powder." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Gently fold until just combined - don't overmix. Let batter rest for 10 minutes." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Heat a non-stick frying pan over low-medium heat. Lightly oil the surface." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Pour 2-3 tablespoons of batter into the pan to form a circle about 8cm diameter." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Cook for 2-3 minutes until bubbles form on the surface." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Flip carefully and cook for another 1-2 minutes until golden." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Transfer to a plate and cover with a damp tea towel to keep soft. Repeat with remaining batter." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Let all pancakes cool to room temperature." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Spread 1-2 tablespoons of red bean paste on one pancake." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "object",
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Sandwich with another pancake, pressing gently. Repeat with remaining pancakes and paste." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Low heat is key - dorayaki should be golden, not dark brown.",
      "The damp tea towel keeps pancakes soft and prevents them drying out.",
      "Let batter rest for 10 minutes for fluffier, more tender pancakes.",
      "Red bean paste is available at Asian supermarkets - look for 'anko' or 'sweet red bean paste'.",
      "Dorayaki taste best on the day they're made, but will keep for 2 days wrapped in cling film.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "What does red bean paste taste like?",
        answer:
          "It's smooth, naturally sweet, and slightly earthy with a texture like thick jam. Much less sweet than Western desserts - give it a try with an open mind!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use a different filling?",
        answer:
          "Absolutely! Try Nutella, peanut butter, custard, or even ice cream. Traditional is red bean, but feel free to experiment with flavors you enjoy.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why are my pancakes tough?",
        answer:
          "Overmixing develops gluten and makes them tough. Mix gently until just combined - a few lumps are fine. Also ensure you're using low-medium heat.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make these gluten-free?",
        answer:
          "Yes! Use a gluten-free flour blend with xanthan gum. The texture will be slightly different but still delicious.",
      },
    ],
    nutrition: {
      calories: 285,
      protein: 6,
      fat: 4,
      carbs: 58,
    },
    seoTitle: "Yo! Sushi Dorayaki Pancakes - Authentic Japanese Recipe",
    seoDescription:
      "Make Yo! Sushi's dorayaki pancakes at home! Fluffy Japanese pancakes with sweet red bean paste. Doraemon's favorite treat ready in 30 minutes.",
  };

  const existingDorayaki = await client.fetch(
    `*[_type == "recipe" && slug.current == "yo-sushi-dorayaki-pancakes"][0]`
  );

  if (existingDorayaki) {
    await client.patch(existingDorayaki._id).set(dorayakiData).commit();
    console.log("✅ Dorayaki Pancakes updated");
  } else {
    await client.create(dorayakiData);
    console.log("✅ Dorayaki Pancakes created");
  }

  console.log("\n🎉 All Yo! Sushi recipes created successfully!");
  console.log("📝 All recipes are SEO-optimized and ready to publish.");
  console.log("\nNote: You'll need to add hero images in Sanity Studio for each recipe.");
}

createRecipes().catch(console.error);
