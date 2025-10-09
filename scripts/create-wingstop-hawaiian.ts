// scripts/create-wingstop-hawaiian.ts
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

const ingredients = [
  {
    name: "Pineapple juice",
    synonyms: ["100% pineapple juice", "fresh pineapple juice"],
    kcal100: 53,
    protein100: 0.4,
    fat100: 0.1,
    carbs100: 12.9,
    allergens: [],
    density_g_per_ml: 1.04,
  },
  {
    name: "Tomato ketchup",
    synonyms: ["ketchup", "tomato sauce"],
    kcal100: 112,
    protein100: 1.2,
    fat100: 0.1,
    carbs100: 27.4,
    allergens: [],
    density_g_per_ml: 1.14,
  },
  {
    name: "Apple cider vinegar",
    synonyms: ["ACV", "cider vinegar"],
    kcal100: 22,
    protein100: 0,
    fat100: 0,
    carbs100: 0.9,
    allergens: [],
    density_g_per_ml: 1.01,
  },
  {
    name: "Teriyaki sauce",
    synonyms: ["teriyaki glaze"],
    kcal100: 89,
    protein100: 5.9,
    fat100: 0,
    carbs100: 15.6,
    allergens: ["soya", "gluten"],
    density_g_per_ml: 1.15,
  },
  {
    name: "Onion powder",
    synonyms: ["dried onion powder", "granulated onion"],
    kcal100: 341,
    protein100: 10.4,
    fat100: 1.0,
    carbs100: 79.1,
    allergens: [],
  },
];

async function createOrGetIngredient(ingredientData: typeof ingredients[0]) {
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

async function createRecipe() {
  console.log("🌺 Creating Wingstop Hawaiian Wings Recipe\n");
  console.log("Creating ingredients...\n");

  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  // Get existing ingredients
  const chickenWings = await client.fetch(
    `*[_type == "ingredient" && name == "Chicken wings"][0]`
  );
  const cornflour = await client.fetch(
    `*[_type == "ingredient" && name == "Cornflour"][0]`
  );
  const bakingPowder = await client.fetch(
    `*[_type == "ingredient" && name == "Baking powder"][0]`
  );
  const salt = await client.fetch(
    `*[_type == "ingredient" && name == "Fine sea salt"][0]`
  );
  const vegetableOil = await client.fetch(
    `*[_type == "ingredient" && name == "Vegetable oil"][0]`
  );
  const brownSugar = await client.fetch(
    `*[_type == "ingredient" && name == "Brown sugar"][0]`
  );

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wingstop-hawaiian-wings"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  const wingstopBrand = await client.fetch(
    `*[_type == "brand" && slug.current == "wingstop"][0]`
  );

  const mainsCategory = await client.fetch(
    `*[_type == "category" && slug.current == "mains"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Wingstop Hawaiian Wings",
    slug: {
      _type: "slug",
      current: "wingstop-hawaiian-wings",
    },
    description:
      "Make Wingstop's tropical Hawaiian Wings at home - crispy fried wings glazed in a sweet and tangy pineapple-teriyaki sauce that's irresistibly sticky.",
    servings: 4,
    prepMin: 10,
    cookMin: 45,
    kcal: 468,
    introText:
      "Wingstop's Hawaiian wings offer a tropical escape with their sweet-tangy pineapple glaze that perfectly balances savoury teriyaki flavours. These wings are double-fried to achieve that signature Wingstop crispiness, then tossed in a luscious sauce made from pineapple juice, teriyaki, and a hint of ketchup for depth. The result is glossy, sticky wings with a flavour profile that's reminiscent of Hawaiian pizza but way better - sweet pineapple brightness cut with umami richness and just a touch of vinegar tang. Unlike spicy wing options, these are family-friendly and crowd-pleasing, making them perfect for gatherings. This copycat recipe delivers the exact sweet, island-inspired taste that makes Wingstop's Hawaiian wings a permanent menu favourite!",
    ...(wingstopBrand && {
      brand: {
        _type: "reference",
        _ref: wingstopBrand._id,
      },
    }),
    ...(mainsCategory && {
      categories: [
        {
          _type: "reference",
          _ref: mainsCategory._id,
          _key: randomUUID(),
        },
      ],
    }),
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Wingstop has been serving their signature cooked-to-order wings since 1994, becoming a go-to destination for wing lovers across the globe. With over 1,800 locations worldwide, they've mastered the art of the perfect wing - crispy on the outside, juicy on the inside, and tossed in bold, crave-worthy sauces.",
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
            text: "The Hawaiian flavour brings a taste of the tropics to the Wingstop menu, combining sweet pineapple with savoury Asian-inspired teriyaki. It's one of their milder options, making it perfect for those who want big flavour without the heat. Each batch is hand-tossed to order, ensuring every wing is evenly coated in that glossy, tropical glaze that keeps customers coming back for more.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Wings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: chickenWings._id,
            },
            quantity: "1",
            unit: "kg",
            notes: "split into drumettes and flats",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: cornflour._id,
            },
            quantity: "100",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: bakingPowder._id,
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: salt._id,
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: vegetableOil._id,
            },
            quantity: "1",
            unit: "litre",
            notes: "for deep frying",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Hawaiian Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Pineapple juice"],
            },
            quantity: "120",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Tomato ketchup"],
            },
            quantity: "3",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Teriyaki sauce"],
            },
            quantity: "3",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: brownSugar._id,
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Apple cider vinegar"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Onion powder"],
            },
            quantity: "1/2",
            unit: "tsp",
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
                text: "Pat wings dry thoroughly with kitchen paper. This step is essential for crispy skin.",
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
                text: "Combine cornflour, baking powder, and salt. Toss wings in mixture until evenly coated, shaking off excess.",
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
                text: "Heat oil to 180°C (350°F). Fry wings in batches for 10-12 minutes until golden. Remove and drain.",
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
                text: "Let wings rest 5 minutes. Increase oil temperature to 190°C (375°F).",
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
                text: "Double fry wings for 3-4 minutes until extra crispy. Drain on kitchen paper.",
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
                text: "Make the sauce: whisk pineapple juice, ketchup, teriyaki sauce, brown sugar, vinegar, and onion powder in a small pan.",
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
                text: "Simmer sauce over medium heat for 5-7 minutes until slightly thickened and glossy. Stir frequently.",
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
                text: "Toss hot wings in warm Hawaiian sauce until completely coated. Serve immediately while hot and sticky.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Use 100% pineapple juice, not pineapple drink - pure juice gives authentic flavour.",
      "The sauce thickens as it cools, so toss wings while sauce is still warm.",
      "For extra tropical flavour, add small diced pineapple chunks to the sauce.",
      "These wings are great with a sprinkle of toasted sesame seeds on top.",
      "Oven method: bake at 220°C for 45-50 minutes, turning halfway through.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use canned pineapple juice?",
        answer:
          "Yes! Canned 100% pineapple juice works perfectly. Just make sure it's pure juice without added sugar. You can also use the juice from canned pineapple chunks.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Are these wings spicy?",
        answer:
          "No, Hawaiian wings are one of Wingstop's mildest options. They're sweet and tangy with no heat, making them perfect for kids and those who don't like spicy food.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make the sauce thicker?",
        answer:
          "Yes! Simmer the sauce a bit longer to reduce and thicken, or add a teaspoon of cornflour mixed with water and simmer for 2 minutes until glossy.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What can I serve with Hawaiian wings?",
        answer:
          "These pair brilliantly with coleslaw, sweet potato fries, or coconut rice. A cucumber salad also provides nice contrast to the sweet glaze.",
      },
    ],
    nutrition: {
      calories: 468,
      protein: 31,
      fat: 26,
      carbs: 28,
    },
    seoTitle: "Wingstop Hawaiian Wings Recipe - Sweet Pineapple Copycat",
    seoDescription:
      "Make Wingstop's tropical Hawaiian Wings at home - crispy fried wings glazed in a sweet and tangy pineapple-teriyaki sauce that's irresistibly sticky.",
    canonicalUrl: "https://bitebuddy.blog/recipes/wingstop-hawaiian-wings",
    isSignature: true,
  };

  if (existingRecipe) {
    const updated = await client
      .patch(existingRecipe._id)
      .set(recipeData)
      .commit();
    console.log("✅ Recipe updated:", updated._id);
  } else {
    const recipe = await client.create({
      ...recipeData,
      _id: `drafts.wingstop-hawaiian-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Wingstop Hawaiian Wings recipe complete!");
}

createRecipe().catch(console.error);
