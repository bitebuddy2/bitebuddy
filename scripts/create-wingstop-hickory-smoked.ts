// scripts/create-wingstop-hickory-smoked.ts
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
    name: "Liquid smoke",
    synonyms: ["hickory liquid smoke", "smoked water flavouring"],
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 1.0,
  },
  {
    name: "BBQ sauce",
    synonyms: ["barbecue sauce", "smoky BBQ sauce"],
    kcal100: 172,
    protein100: 0.9,
    fat100: 0.4,
    carbs100: 41.0,
    allergens: [],
    density_g_per_ml: 1.15,
  },
  {
    name: "Molasses",
    synonyms: ["black treacle", "blackstrap molasses"],
    kcal100: 290,
    protein100: 0,
    fat100: 0.1,
    carbs100: 74.7,
    allergens: [],
    density_g_per_ml: 1.4,
  },
  {
    name: "Smoked salt",
    synonyms: ["hickory smoked salt", "smoke-infused salt"],
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 1.2,
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
  console.log("🔥 Creating Wingstop Hickory Smoked BBQ Wings Recipe\n");
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
  const onionPowder = await client.fetch(
    `*[_type == "ingredient" && name == "Onion powder"][0]`
  );
  const smokedPaprika = await client.fetch(
    `*[_type == "ingredient" && name == "Smoked paprika"][0]`
  );
  const brownSugar = await client.fetch(
    `*[_type == "ingredient" && name == "Brown sugar"][0]`
  );
  const blackPepper = await client.fetch(
    `*[_type == "ingredient" && name == "Black pepper"][0]`
  );
  const butter = await client.fetch(
    `*[_type == "ingredient" && name == "Unsalted butter"][0]`
  );

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wingstop-hickory-smoked-bbq-wings"][0]`
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
    title: "Wingstop Hickory Smoked BBQ Wings",
    slug: {
      _type: "slug",
      current: "wingstop-hickory-smoked-bbq-wings",
    },
    description:
      "Wingstop's Hickory Smoked BBQ Wings copycat recipe - crispy wings with deep smoky-sweet BBQ sauce that tastes like they've been smoked for hours.",
    servings: 4,
    prepMin: 10,
    cookMin: 45,
    kcal: 495,
    introText:
      "Wingstop's Hickory Smoked BBQ Wings deliver that authentic smokehouse flavour without needing an actual smoker. These wings combine the classic crispy Wingstop texture with a rich, smoky-sweet barbecue sauce that has layers of hickory smoke, molasses sweetness, and tangy depth. The secret is liquid smoke combined with a perfectly balanced BBQ sauce that's not too sweet, not too tangy - just right. Unlike typical BBQ wings that can taste one-dimensional, these have complexity: you get the deep smokiness, a touch of caramel from molasses, aromatic spices, and a subtle butter finish that makes them irresistibly sticky. This copycat recipe captures that exact Wingstop hickory flavour profile, creating wings that taste like they've been slow-smoked over hickory wood for hours!",
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
            text: "Since 1994, Wingstop has been perfecting the art of chicken wings with their signature cooked-to-order approach. With over 1,800 locations worldwide, they've become the go-to destination for crave-worthy wings in bold, distinctive flavours.",
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
            text: "Hickory Smoked BBQ is Wingstop's answer to traditional smokehouse wings, offering deep smoky flavour without the need for hours of smoking. It's a customer favourite for those who want rich, sweet, and smoky notes without any heat. Each order is hand-tossed in the signature hickory BBQ sauce, creating that glossy, stick-to-your-fingers finish that defines great BBQ wings.",
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
        heading: "For the Hickory Smoked BBQ Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["BBQ sauce"],
            },
            quantity: "150",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Liquid smoke"],
            },
            quantity: "1",
            unit: "tsp",
            notes: "hickory flavour",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Molasses"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: butter._id,
            },
            quantity: "30",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: brownSugar._id,
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: smokedPaprika._id,
            },
            quantity: "1",
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
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: onionPowder._id,
            },
            quantity: "1/2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: blackPepper._id,
            },
            quantity: "1/4",
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
                text: "Thoroughly pat wings dry with kitchen paper. Dry wings = crispy wings.",
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
                text: "Combine cornflour, baking powder, and salt. Toss wings in the mixture until evenly coated.",
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
                text: "Heat oil to 180°C (350°F). Fry wings in batches for 10-12 minutes until golden brown.",
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
                text: "Remove wings, drain on kitchen paper, rest 5 minutes. Increase oil temperature to 190°C (375°F).",
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
                text: "Double fry for 3-4 minutes until extra crispy and deep golden. Drain thoroughly.",
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
                text: "Make the sauce: combine BBQ sauce, liquid smoke, molasses, butter, brown sugar, smoked paprika, garlic powder, onion powder, and black pepper in a pan.",
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
                text: "Heat sauce over medium-low, stirring until butter melts and sauce is smooth and glossy. Don't boil.",
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
                text: "Toss hot wings in the warm hickory BBQ sauce until completely coated. Serve immediately.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Liquid smoke is key - it gives authentic smokehouse flavour without a smoker.",
      "Don't overdo the liquid smoke - a little goes a long way.",
      "Use a quality BBQ sauce as your base - it makes a difference.",
      "The sauce thickens as it cools, so toss wings while it's warm.",
      "For oven method: bake at 220°C for 45-50 minutes, turning halfway.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "What is liquid smoke and where do I buy it?",
        answer:
          "Liquid smoke is concentrated smoke flavour made by condensing actual smoke. Find it in the condiments aisle of most supermarkets or online. Brands like Wright's or Colgin are widely available.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make these without liquid smoke?",
        answer:
          "Yes, but they'll lack that authentic smokehouse flavour. You could use extra smoked paprika or chipotle powder for a different type of smokiness.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What BBQ sauce should I use?",
        answer:
          "A classic smoky or hickory BBQ sauce works best. Brands like Sweet Baby Ray's Hickory & Brown Sugar or Bull's-Eye Original are good choices.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use molasses substitutes?",
        answer:
          "In a pinch, use golden syrup or maple syrup, but molasses gives the authentic deep, slightly bitter sweetness that defines this sauce.",
      },
    ],
    nutrition: {
      calories: 495,
      protein: 32,
      fat: 28,
      carbs: 32,
    },
    seoTitle: "Wingstop Hickory Smoked BBQ Wings - Authentic Copycat Recipe",
    seoDescription:
      "Wingstop's Hickory Smoked BBQ Wings copycat recipe - crispy wings with deep smoky-sweet BBQ sauce that tastes like they've been smoked for hours.",
    canonicalUrl: "https://bitebuddy.blog/recipes/wingstop-hickory-smoked-bbq-wings",
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
      _id: `drafts.wingstop-hickory-smoked-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Wingstop Hickory Smoked BBQ Wings recipe complete!");
}

createRecipe().catch(console.error);
