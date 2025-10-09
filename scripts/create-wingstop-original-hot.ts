// scripts/create-wingstop-original-hot.ts
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
    name: "Hot sauce",
    synonyms: ["Louisiana hot sauce", "cayenne hot sauce", "Frank's RedHot"],
    kcal100: 11,
    protein100: 0.9,
    fat100: 0.6,
    carbs100: 0.8,
    allergens: [],
    density_g_per_ml: 1.05,
  },
  {
    name: "Unsalted butter",
    synonyms: ["butter", "salted butter"],
    kcal100: 717,
    protein100: 0.9,
    fat100: 81.1,
    carbs100: 0.1,
    allergens: ["milk"],
    density_g_per_ml: 0.91,
  },
  {
    name: "White wine vinegar",
    synonyms: ["white vinegar", "distilled white vinegar"],
    kcal100: 18,
    protein100: 0,
    fat100: 0,
    carbs100: 0.04,
    allergens: [],
    density_g_per_ml: 1.01,
  },
  {
    name: "Worcestershire sauce",
    synonyms: ["Worcester sauce", "Lea & Perrins"],
    kcal100: 78,
    protein100: 0,
    fat100: 0,
    carbs100: 19.5,
    allergens: ["fish"],
    density_g_per_ml: 1.12,
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
  console.log("🔥 Creating Wingstop Original Hot Wings Recipe\n");
  console.log("Creating ingredients...\n");

  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

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
  const garlicPowder = await client.fetch(
    `*[_type == "ingredient" && name == "Garlic powder"][0]`
  );
  const cayennePepper = await client.fetch(
    `*[_type == "ingredient" && name == "Cayenne pepper"][0]`
  );

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wingstop-original-hot-wings"][0]`
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

  const spicyCategory = await client.fetch(
    `*[_type == "category" && slug.current == "spicy"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Wingstop Original Hot Wings",
    slug: {
      _type: "slug",
      current: "wingstop-original-hot-wings",
    },
    description:
      "The ultimate Wingstop copycat recipe - crispy buffalo-style wings tossed in a buttery, tangy hot sauce that's perfectly balanced with heat and flavour.",
    servings: 4,
    prepMin: 10,
    cookMin: 45,
    kcal: 512,
    introText:
      "Wingstop's Original Hot wings are the classic buffalo-style wings done right - crispy, juicy chicken tossed in a tangy, buttery cayenne pepper sauce that delivers the perfect level of heat. This is the flavour that started it all, the timeless combination that made buffalo wings a global phenomenon. What makes Wingstop's version special is the precision: double-fried wings for maximum crispiness, then coated in a sauce that's the ideal balance of hot sauce tang, rich butter, and a subtle garlic-vinegar kick. The heat is noticeable but not overwhelming - it builds gradually and leaves you reaching for more. This copycat recipe recreates that exact Wingstop experience at home, using the classic buffalo sauce technique with a few secret additions that give these wings their signature addictive quality!",
    ...(wingstopBrand && {
      brand: {
        _type: "reference",
        _ref: wingstopBrand._id,
      },
    }),
    ...(mainsCategory && spicyCategory && {
      categories: [
        {
          _type: "reference",
          _ref: mainsCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: spicyCategory._id,
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
            text: "Founded in 1994 in Garland, Texas, Wingstop built their empire on one simple principle: do wings, and do them better than anyone else. With over 1,800 locations worldwide, they've become synonymous with quality chicken wings cooked fresh to order and tossed in bold, made-to-order sauces.",
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
            text: "Original Hot is Wingstop's classic buffalo-style flavour and remains their most popular option. It's the perfect gateway wing - hot enough to satisfy spice lovers but balanced enough that anyone can enjoy it. Made with real butter and cayenne pepper sauce, then hand-tossed to order, these wings embody everything that makes Wingstop a wing destination.",
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
        heading: "For the Original Hot Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Hot sauce"],
            },
            quantity: "180",
            unit: "ml",
            notes: "Frank's RedHot preferred",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Unsalted butter"],
            },
            quantity: "100",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["White wine vinegar"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Worcestershire sauce"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: cayennePepper._id,
            },
            quantity: "1/2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: garlicPowder._id,
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
                text: "Pat wings completely dry with kitchen paper. Moisture is the enemy of crispy wings.",
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
                text: "Mix cornflour, baking powder, and salt in a bowl. Toss wings until evenly coated.",
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
                text: "Heat oil to 180°C (350°F). Fry wings in batches for 10-12 minutes until golden. Don't overcrowd.",
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
                text: "Remove wings, drain on kitchen paper, and rest for 5 minutes. Increase oil to 190°C (375°F).",
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
                text: "Double fry wings for 3-4 minutes until deep golden and extra crispy. Drain well.",
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
                text: "Make the sauce: melt butter in a pan over low heat. Add hot sauce, vinegar, Worcestershire, cayenne, and garlic powder.",
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
                text: "Whisk sauce until emulsified and smooth. Keep warm but don't let it boil.",
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
                text: "Toss hot wings in the buffalo sauce until completely coated. Serve immediately with ranch or blue cheese dip.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Frank's RedHot is the classic choice for authentic buffalo flavour.",
      "Don't skip the double fry - it makes wings incredibly crispy.",
      "Use unsalted butter so you can control the saltiness.",
      "Toss wings in sauce right before serving to maintain crispiness.",
      "For extra heat, add more cayenne pepper to the sauce.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "What makes buffalo sauce different from regular hot sauce?",
        answer:
          "Buffalo sauce is hot sauce (usually cayenne-based) mixed with butter, creating a rich, tangy, slightly creamy coating. The butter mellows the heat and helps the sauce cling to wings.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I bake these instead of frying?",
        answer:
          "Yes! Bake at 220°C (425°F) for 45-50 minutes on a wire rack, flipping halfway. They won't be quite as crispy but still delicious.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How spicy are Original Hot wings?",
        answer:
          "They have a medium heat level - noticeable kick but not overwhelming. The heat builds gradually. If you're sensitive to spice, try reducing the cayenne pepper.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What's the best dipping sauce?",
        answer:
          "Classic choices are ranch dressing or blue cheese dip. Both cool down the heat and complement the tangy buffalo flavour perfectly.",
      },
    ],
    nutrition: {
      calories: 512,
      protein: 32,
      fat: 38,
      carbs: 12,
    },
    seoTitle: "Wingstop Original Hot Wings Recipe - Classic Buffalo Copycat",
    seoDescription:
      "The ultimate Wingstop copycat recipe - crispy buffalo-style wings tossed in a buttery, tangy hot sauce that's perfectly balanced with heat and flavour.",
    canonicalUrl: "https://bitebuddy.blog/recipes/wingstop-original-hot-wings",
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
      _id: `drafts.wingstop-original-hot-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Wingstop Original Hot Wings recipe complete!");
}

createRecipe().catch(console.error);
