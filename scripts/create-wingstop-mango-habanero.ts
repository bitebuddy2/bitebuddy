// scripts/create-wingstop-mango-habanero.ts
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
    name: "Mango puree",
    synonyms: ["fresh mango puree", "mango pulp"],
    kcal100: 60,
    protein100: 0.8,
    fat100: 0.4,
    carbs100: 15,
    allergens: [],
    density_g_per_ml: 1.05,
  },
  {
    name: "Habanero peppers",
    synonyms: ["habanero chilli", "fresh habanero"],
    kcal100: 40,
    protein100: 1.9,
    fat100: 0.5,
    carbs100: 8.8,
    allergens: [],
    gramsPerPiece: 15,
  },
  {
    name: "Lime juice",
    synonyms: ["fresh lime juice", "juice of lime"],
    kcal100: 25,
    protein100: 0.4,
    fat100: 0.1,
    carbs100: 8.4,
    allergens: [],
    density_g_per_ml: 1.02,
  },
  {
    name: "Agave nectar",
    synonyms: ["agave syrup", "agave sweetener"],
    kcal100: 310,
    protein100: 0.1,
    fat100: 0.5,
    carbs100: 76.4,
    allergens: [],
    density_g_per_ml: 1.37,
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
  console.log("🥭 Creating Wingstop Mango Habanero Wings Recipe\n");
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
  const butter = await client.fetch(
    `*[_type == "ingredient" && name == "Unsalted butter"][0]`
  );
  const riceVinegar = await client.fetch(
    `*[_type == "ingredient" && name == "Rice vinegar"][0]`
  );

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wingstop-mango-habanero-wings"][0]`
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
    title: "Wingstop Mango Habanero Wings",
    slug: {
      _type: "slug",
      current: "wingstop-mango-habanero-wings",
    },
    description:
      "Wingstop's Mango Habanero Wings copycat - crispy wings glazed in a sweet-heat mango sauce with fiery habanero kick. Tropical, fruity, and seriously spicy!",
    servings: 4,
    prepMin: 15,
    cookMin: 45,
    kcal: 478,
    introText:
      "Wingstop's Mango Habanero Wings are the ultimate sweet-heat experience - juicy tropical mango balanced with the fierce kick of habanero peppers. This flavour is for those who love their wings with serious heat but also crave fruity complexity. The mango provides a luscious, sweet base that cools you down momentarily before the habanero's slow-building fire takes over. What makes this sauce special is the balance: it's not just spicy for the sake of it, the mango adds genuine flavour and a silky texture that makes these wings addictively delicious. The habanero brings floral, fruity heat (it's significantly hotter than jalapeños) while lime adds brightness and agave nectar rounds out the sweetness. This copycat recipe nails that exact Wingstop profile - crispy wings with a glossy, vibrant orange sauce that's simultaneously tropical and incendiary!",
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
            text: "Wingstop has been the wing authority since 1994, serving cooked-to-order wings in bold, signature flavours. With over 1,800 locations across 30+ countries, they've perfected the art of creating wings that are crispy on the outside, juicy inside, and coated in sauces that pack serious flavour.",
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
            text: "Mango Habanero is one of Wingstop's hottest offerings and a fan favourite among heat seekers. The combination of sweet mango and fierce habanero creates a unique flavour profile that's both tropical and incendiary. Each order is hand-tossed in the vibrant orange sauce, creating wings that look as bold as they taste. It's perfect for those who want heat with a side of fruity complexity!",
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
        heading: "For the Mango Habanero Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Mango puree"],
            },
            quantity: "150",
            unit: "ml",
            notes: "or 1 large fresh mango, blended",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Habanero peppers"],
            },
            quantity: "2",
            unit: "",
            notes: "deseeded for less heat",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Lime juice"],
            },
            quantity: "3",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Agave nectar"],
            },
            quantity: "3",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: butter._id,
            },
            quantity: "40",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: riceVinegar._id,
            },
            quantity: "2",
            unit: "tbsp",
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
              _ref: salt._id,
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
                text: "Pat wings completely dry with kitchen paper. Dry wings are essential for crispy skin.",
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
                text: "Mix cornflour, baking powder, and salt. Toss wings until evenly coated, shaking off excess.",
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
                text: "Heat oil to 180°C (350°F). Fry wings in batches for 10-12 minutes until golden.",
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
                text: "Remove wings, drain, rest 5 minutes. Increase oil temperature to 190°C (375°F).",
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
                text: "Make the sauce: blend mango puree, habanero peppers, lime juice, agave nectar, rice vinegar, garlic powder, and salt until smooth.",
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
                text: "Pour sauce into a pan, add butter, and simmer over medium heat for 5-7 minutes until thickened slightly. Stir frequently.",
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
                text: "Toss hot wings in the warm mango habanero sauce until fully coated. Serve immediately while hot and sticky.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Habaneros are VERY hot - wear gloves when handling and adjust quantity to taste.",
      "For milder wings, use only 1 habanero or substitute with scotch bonnets.",
      "Fresh mango works best, but frozen mango puree is a great shortcut.",
      "The sauce thickens as it cools, so toss wings while it's still warm.",
      "Agave nectar can be replaced with honey, but agave gives authentic flavour.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "How spicy are these wings?",
        answer:
          "Very spicy! Habaneros are 100-350x hotter than jalapeños. The mango sweetness balances the heat, but these are definitely for spice lovers. Reduce habaneros or deseed them for less heat.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use frozen mango?",
        answer:
          "Yes! Frozen mango chunks work perfectly. Thaw them, then blend until smooth. You can also use store-bought mango puree or nectar (reduce the agave if using nectar).",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What can I substitute for habanero peppers?",
        answer:
          "For similar heat, use scotch bonnet peppers. For milder wings, use 4-5 jalapeños or 2-3 serrano peppers. The flavour will be different but still delicious.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I make the sauce thicker?",
        answer:
          "Simmer the sauce longer to reduce and thicken, or add 1 tsp cornflour mixed with water and cook for 2 minutes until glossy.",
      },
    ],
    nutrition: {
      calories: 478,
      protein: 31,
      fat: 27,
      carbs: 30,
    },
    seoTitle: "Wingstop Mango Habanero Wings Recipe - Sweet & Spicy Copycat",
    seoDescription:
      "Wingstop's Mango Habanero Wings copycat - crispy wings glazed in a sweet-heat mango sauce with fiery habanero kick. Tropical, fruity, and seriously spicy!",
    canonicalUrl: "https://bitebuddy.blog/recipes/wingstop-mango-habanero-wings",
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
      _id: `drafts.wingstop-mango-habanero-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Wingstop Mango Habanero Wings recipe complete!");
}

createRecipe().catch(console.error);
