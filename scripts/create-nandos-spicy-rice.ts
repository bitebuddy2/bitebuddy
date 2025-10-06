// scripts/create-nandos-spicy-rice.ts
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

// Ingredient data for Nando's Spicy Rice
const ingredients = [
  {
    name: "Long grain rice",
    synonyms: ["white rice", "basmati rice alternative"],
    kcal100: 130,
    protein100: 2.7,
    fat100: 0.3,
    carbs100: 28,
    allergens: [],
    density_g_per_ml: 0.75,
  },
  {
    name: "Chicken stock",
    synonyms: ["chicken broth", "chicken bouillon"],
    kcal100: 4,
    protein100: 0.4,
    fat100: 0.2,
    carbs100: 0.4,
    allergens: ["celery"],
    density_g_per_ml: 1.0,
  },
  {
    name: "Red bell pepper",
    synonyms: ["red pepper", "red capsicum"],
    kcal100: 31,
    protein100: 1,
    fat100: 0.3,
    carbs100: 6,
    allergens: [],
    gramsPerPiece: 150,
  },
  {
    name: "Green bell pepper",
    synonyms: ["green pepper", "green capsicum"],
    kcal100: 20,
    protein100: 0.9,
    fat100: 0.2,
    carbs100: 4.6,
    allergens: [],
    gramsPerPiece: 150,
  },
  {
    name: "Red onion",
    synonyms: ["purple onion"],
    kcal100: 40,
    protein100: 1.1,
    fat100: 0.1,
    carbs100: 9.3,
    allergens: [],
    gramsPerPiece: 150,
  },
  {
    name: "Tomato paste",
    synonyms: ["tomato puree", "concentrated tomato"],
    kcal100: 82,
    protein100: 4.3,
    fat100: 0.5,
    carbs100: 18,
    allergens: [],
  },
  {
    name: "Paprika",
    synonyms: ["sweet paprika", "ground paprika"],
    kcal100: 282,
    protein100: 14,
    fat100: 13,
    carbs100: 54,
    allergens: [],
  },
  {
    name: "Cayenne pepper",
    synonyms: ["ground cayenne", "red pepper"],
    kcal100: 318,
    protein100: 12,
    fat100: 17,
    carbs100: 57,
    allergens: [],
  },
  {
    name: "Ground cumin",
    synonyms: ["cumin powder"],
    kcal100: 375,
    protein100: 18,
    fat100: 22,
    carbs100: 44,
    allergens: [],
  },
  {
    name: "Smoked paprika",
    synonyms: ["pimentón", "Spanish paprika"],
    kcal100: 282,
    protein100: 14,
    fat100: 13,
    carbs100: 54,
    allergens: [],
  },
  {
    name: "Fresh coriander",
    synonyms: ["cilantro", "fresh cilantro", "coriander leaves"],
    kcal100: 23,
    protein100: 2.1,
    fat100: 0.5,
    carbs100: 3.7,
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
    name: "Vegetable oil",
    synonyms: ["cooking oil", "sunflower oil"],
    kcal100: 884,
    protein100: 0,
    fat100: 100,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 0.92,
  },
];

async function createOrGetIngredient(ingredientData: typeof ingredients[0]) {
  // Check if ingredient already exists by name
  const existing = await client.fetch(
    `*[_type == "ingredient" && name == $name][0]`,
    { name: ingredientData.name }
  );

  if (existing) {
    console.log(`✅ Found existing ingredient: ${ingredientData.name}`);
    return existing._id;
  }

  // Also check synonyms to avoid duplicates
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

async function createRecipe() {
  console.log("Creating ingredients...\n");

  // Create or get all ingredients and store their IDs
  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  // Check if recipe already exists
  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "nandos-spicy-rice"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  const recipeData = {
    _type: "recipe",
    title: "Nando's Spicy Rice Bowl",
    slug: {
      _type: "slug",
      current: "nandos-spicy-rice",
    },
    description:
      "Recreate Nando's famous spicy rice at home with this vibrant, flavor-packed side dish. Fluffy rice infused with peri-peri spices, peppers, and fresh herbs - the perfect accompaniment to any meal.",
    servings: 4,
    prepMin: 10,
    cookMin: 25,
    introText:
      "Nando's Spicy Rice is one of the most popular sides on their menu - and for good reason. This vibrant, flavorful rice dish combines perfectly cooked long grain rice with colorful peppers, aromatic spices, and fresh herbs to create a side that's anything but boring. With its signature peri-peri kick and restaurant-quality taste, this copycat recipe brings the authentic Nando's experience straight to your kitchen. It's the ideal side for grilled chicken, but works brilliantly as a standalone vegetarian dish too.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Nando's, the South African-Portuguese restaurant chain, has become a British institution since opening its first UK restaurant in 1992. Known for their flame-grilled peri-peri chicken, Nando's has built a cult following not just for their main dishes, but for their incredible sides - particularly their spicy rice.",
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
            text: "This spicy rice recipe captures the essence of Nando's flavors with its perfect balance of heat from cayenne and paprika, sweetness from peppers, and freshness from coriander and lime. It's become a staple side that complements their famous chicken perfectly, and now you can make it at home with this authentic copycat recipe.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Long grain rice"],
            },
            quantity: "300",
            unit: "g",
            notes: "uncooked",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Chicken stock"],
            },
            quantity: "600",
            unit: "ml",
            notes: "hot",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Red bell pepper"],
            },
            quantity: "1",
            unit: "piece",
            notes: "diced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Green bell pepper"],
            },
            quantity: "1",
            unit: "piece",
            notes: "diced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Red onion"],
            },
            quantity: "1",
            unit: "piece",
            notes: "finely chopped",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Garlic"],
            },
            quantity: "3",
            unit: "clove",
            notes: "minced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Tomato paste"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Paprika"],
            },
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Smoked paprika"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Cayenne pepper"],
            },
            quantity: "0.5",
            unit: "tsp",
            notes: "adjust to taste",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ground cumin"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fine sea salt"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vegetable oil"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fresh coriander"],
            },
            quantity: "3",
            unit: "tbsp",
            notes: "chopped, for garnish",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Lime"],
            },
            quantity: "1",
            unit: "piece",
            notes: "juice only",
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
              {
                _key: randomUUID(),
                _type: "span",
                text: "Rinse the rice under cold water until the water runs clear. This removes excess starch and ensures fluffy rice. Drain well and set aside.",
              },
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
              {
                _key: randomUUID(),
                _type: "span",
                text: "Heat the vegetable oil in a large, deep frying pan or saucepan over medium heat. Add the chopped onion and cook for 3-4 minutes until softened.",
              },
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
              {
                _key: randomUUID(),
                _type: "span",
                text: "Add the diced peppers and minced garlic. Cook for another 3-4 minutes, stirring frequently, until the peppers are starting to soften.",
              },
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
              {
                _key: randomUUID(),
                _type: "span",
                text: "Stir in the tomato paste, paprika, smoked paprika, cayenne pepper, cumin, and salt. Cook for 1 minute, stirring constantly, to toast the spices and release their flavors.",
              },
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
              {
                _key: randomUUID(),
                _type: "span",
                text: "Add the rinsed rice and stir well to coat every grain with the spice mixture. This ensures the rice is evenly flavored throughout.",
              },
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
              {
                _key: randomUUID(),
                _type: "span",
                text: "Pour in the hot chicken stock and give it a good stir. Bring to the boil, then reduce the heat to low, cover with a tight-fitting lid, and simmer for 15-18 minutes until the rice is tender and all the liquid has been absorbed.",
              },
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
              {
                _key: randomUUID(),
                _type: "span",
                text: "Remove from the heat and let it stand, covered, for 5 minutes. This resting time allows the rice to finish steaming and become perfectly fluffy.",
              },
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
              {
                _key: randomUUID(),
                _type: "span",
                text: "Fluff the rice with a fork, then squeeze over the fresh lime juice and stir through the chopped coriander. Taste and adjust seasoning if needed. Serve hot as a side dish or as part of a Nando's-style feast!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "For extra heat, increase the cayenne pepper or add a splash of peri-peri sauce when serving.",
      "Use vegetable stock instead of chicken stock for a vegetarian/vegan version.",
      "The rice can be made ahead and reheated - add a splash of water when reheating to prevent it drying out.",
      "For a complete Nando's experience, serve with grilled chicken, corn on the cob, and coleslaw.",
      "Leftover spicy rice makes an excellent base for fried rice the next day - just add an egg and more vegetables.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use brown rice instead of white rice?",
        answer:
          "Yes, but you'll need to adjust the cooking time and liquid. Brown rice typically needs 40-45 minutes and about 750ml of stock. The texture will be chewier than the original Nando's version.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How spicy is this rice?",
        answer:
          "This recipe gives a medium heat level similar to Nando's. You can adjust the cayenne pepper to make it milder (use 1/4 tsp) or hotter (use 1 tsp). The smoked paprika adds flavor without much heat.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I freeze Nando's spicy rice?",
        answer:
          "Yes! Let it cool completely, then portion into freezer bags or containers. It will keep for up to 3 months. Defrost in the fridge overnight and reheat thoroughly, adding a splash of water to restore moisture.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why is my rice mushy?",
        answer:
          "This usually happens from using too much liquid or overcooking. Make sure you measure the stock accurately (2:1 ratio) and don't lift the lid during cooking. Also ensure you rinse the rice first to remove excess starch.",
      },
    ],
    nutrition: {
      calories: 245,
      protein: 5,
      fat: 6,
      carbs: 44,
    },
    seoTitle: "Nando's Spicy Rice Recipe - Easy Copycat Side Dish",
    seoDescription:
      "Make Nando's famous spicy rice at home! This easy copycat recipe creates fluffy, flavorful peri-peri rice with peppers and spices. Perfect side dish in 35 minutes.",
  };

  if (existingRecipe) {
    const updated = await client
      .patch(existingRecipe._id)
      .set(recipeData)
      .commit();
    console.log("✅ Recipe updated:", updated._id);
  } else {
    const recipe = await client.create(recipeData);
    console.log("✅ Recipe created:", recipe._id);
  }

  console.log("\n🎉 Done! Nando's Spicy Rice Bowl recipe is ready!");
  console.log("📝 The recipe is SEO-optimized and ready to publish.");
  console.log("\nNote: You'll need to add a hero image in Sanity Studio.");
}

createRecipe().catch(console.error);
