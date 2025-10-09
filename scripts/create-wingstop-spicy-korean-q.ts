// scripts/create-wingstop-spicy-korean-q.ts
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
    name: "Chicken wings",
    synonyms: ["chicken wing", "wings"],
    kcal100: 203,
    protein100: 30.5,
    fat100: 8.1,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: 90,
  },
  {
    name: "Cornflour",
    synonyms: ["corn starch", "cornstarch"],
    kcal100: 381,
    protein100: 0.3,
    fat100: 0.1,
    carbs100: 91.3,
    allergens: [],
    density_g_per_ml: 0.56,
  },
  {
    name: "Baking powder",
    synonyms: ["baking soda"],
    kcal100: 53,
    protein100: 0,
    fat100: 0,
    carbs100: 27.7,
    allergens: [],
    density_g_per_ml: 0.72,
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
    name: "Fine sea salt",
    synonyms: ["salt", "table salt", "sea salt"],
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 1.2,
  },
  {
    name: "Gochujang paste",
    synonyms: ["Korean chilli paste", "Korean red pepper paste"],
    kcal100: 166,
    protein100: 4.8,
    fat100: 2.7,
    carbs100: 30,
    allergens: ["soya"],
    density_g_per_ml: 1.1,
  },
  {
    name: "Soy sauce",
    synonyms: ["soya sauce", "shoyu"],
    kcal100: 53,
    protein100: 10.5,
    fat100: 0.1,
    carbs100: 4.9,
    allergens: ["soya", "gluten"],
    density_g_per_ml: 1.18,
  },
  {
    name: "Rice vinegar",
    synonyms: ["rice wine vinegar"],
    kcal100: 18,
    protein100: 0.3,
    fat100: 0,
    carbs100: 0.8,
    allergens: [],
    density_g_per_ml: 1.01,
  },
  {
    name: "Honey",
    synonyms: ["clear honey", "runny honey"],
    kcal100: 304,
    protein100: 0.3,
    fat100: 0,
    carbs100: 82.4,
    allergens: [],
    density_g_per_ml: 1.42,
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
    name: "Garlic powder",
    synonyms: ["dried garlic", "granulated garlic"],
    kcal100: 331,
    protein100: 16.5,
    fat100: 0.7,
    carbs100: 72.7,
    allergens: [],
  },
  {
    name: "Ginger paste",
    synonyms: ["fresh ginger paste", "grated ginger"],
    kcal100: 80,
    protein100: 1.8,
    fat100: 0.8,
    carbs100: 17.8,
    allergens: [],
    density_g_per_ml: 1.05,
  },
  {
    name: "Sesame seeds",
    synonyms: ["toasted sesame seeds", "white sesame"],
    kcal100: 573,
    protein100: 17.7,
    fat100: 49.7,
    carbs100: 23.4,
    allergens: ["sesame"],
  },
  {
    name: "Spring onions",
    synonyms: ["scallions", "green onions"],
    kcal100: 32,
    protein100: 1.8,
    fat100: 0.2,
    carbs100: 7.3,
    allergens: [],
    gramsPerPiece: 15,
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
  console.log("🔥 Creating Wingstop Spicy Korean Q Wings Recipe\n");
  console.log("Creating ingredients...\n");

  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wingstop-spicy-korean-q-wings"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  const wingstopBrand = await client.fetch(
    `*[_type == "brand" && slug.current == "wingstop"][0]`
  );

  if (!wingstopBrand) {
    console.log("⚠️  Wingstop brand not found - recipe will be created without brand reference");
  }

  const mainsCategory = await client.fetch(
    `*[_type == "category" && slug.current == "mains"][0]`
  );

  const spicyCategory = await client.fetch(
    `*[_type == "category" && slug.current == "spicy"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Wingstop Spicy Korean Q Wings",
    slug: {
      _type: "slug",
      current: "wingstop-spicy-korean-q-wings",
    },
    description:
      "Recreate Wingstop's addictive Spicy Korean Q Wings at home with this copycat recipe. Crispy fried wings tossed in a sweet, spicy gochujang glaze with sesame and garlic.",
    servings: 4,
    prepMin: 15,
    cookMin: 45,
    kcal: 485,
    introText:
      "Wingstop's Spicy Korean Q Wings bring the bold flavours of Korean street food to the American wing game. These wings feature ultra-crispy skin achieved through a cornstarch coating technique, then get tossed in an addictive sweet-spicy-savoury sauce made with gochujang (Korean red pepper paste), honey, soy, and sesame. The result is sticky, glossy wings with layers of umami flavour and just the right amount of heat. Unlike traditional buffalo wings, these have an Asian-inspired profile that's both fiery and sweet, with nutty sesame notes and aromatic garlic-ginger undertones. This homemade version captures that exact balance of crispy texture and flavour-packed glaze that makes Wingstop's Korean Q wings so crave-worthy!",
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
            text: "Wingstop was founded in 1994 in Garland, Texas, and has grown into one of the world's largest wing-focused restaurant chains with over 1,800 locations globally. What sets Wingstop apart is their dedication to wings and wings only - they don't do burgers or tacos, just perfectly cooked chicken wings with 11 bold flavour options.",
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
            text: "The Spicy Korean Q flavour was introduced as part of Wingstop's global expansion efforts, bringing trendy Korean street food flavours to their menu. It quickly became a fan favourite for its unique sweet-spicy profile that balances gochujang heat with honey sweetness. Each order is hand-tossed in the signature sauce and finished with sesame seeds, creating that Instagram-worthy glossy finish Wingstop is known for.",
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
              _ref: ingredientIds["Chicken wings"],
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
              _ref: ingredientIds["Cornflour"],
            },
            quantity: "100",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Baking powder"],
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
            quantity: "1",
            unit: "litre",
            notes: "for deep frying",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Spicy Korean Q Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Gochujang paste"],
            },
            quantity: "4",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Honey"],
            },
            quantity: "3",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Soy sauce"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Rice vinegar"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sesame oil"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Garlic powder"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ginger paste"],
            },
            quantity: "1",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For Garnish",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sesame seeds"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Spring onions"],
            },
            quantity: "2",
            unit: "",
            notes: "thinly sliced",
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
                text: "Pat the wings completely dry with kitchen paper - this is crucial for crispy skin. Place in a large bowl.",
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
                text: "Mix cornflour, baking powder, and salt. Toss wings in the mixture until evenly coated. Shake off excess.",
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
                text: "Heat oil to 180°C (350°F) in a deep pan or fryer. Fry wings in batches for 10-12 minutes until golden and cooked through.",
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
                text: "Remove wings and drain on kitchen paper. Let rest for 5 minutes, then increase oil temperature to 190°C (375°F).",
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
                text: "Double fry the wings for 3-4 minutes until extra crispy and deep golden brown. Drain well.",
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
                text: "While wings fry, make the sauce: whisk together gochujang, honey, soy sauce, rice vinegar, sesame oil, garlic powder, and ginger paste until smooth.",
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
                text: "Toss hot wings in a large bowl with the sauce until completely coated and glossy.",
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
                text: "Transfer to serving plate and sprinkle with sesame seeds and sliced spring onions. Serve immediately.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Double frying is the secret to extra crispy wings - don't skip this step!",
      "Make sure wings are completely dry before coating for maximum crispiness.",
      "Gochujang varies in spice level - taste your sauce and adjust honey if needed.",
      "Toss wings in sauce just before serving to keep them crispy.",
      "For oven method: bake at 220°C for 45-50 minutes, flipping halfway.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "What is gochujang and where can I buy it?",
        answer:
          "Gochujang is a fermented Korean red pepper paste with a sweet, spicy, and umami flavour. Find it in Asian supermarkets or online. Look for brands like Chung Jung One or CJ. It's essential for authentic Korean Q flavour.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make these in an air fryer?",
        answer:
          "Yes! Spray wings with oil, air fry at 200°C for 25-30 minutes, shaking halfway. They won't be quite as crispy as double-fried but still delicious.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How spicy are these wings?",
        answer:
          "Medium spicy - gochujang has a moderate heat balanced by honey sweetness. For milder wings, reduce gochujang to 3 tbsp and add extra honey.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make the sauce ahead?",
        answer:
          "Absolutely! The sauce keeps in an airtight container in the fridge for up to 2 weeks. Just toss with freshly cooked wings.",
      },
    ],
    nutrition: {
      calories: 485,
      protein: 32,
      fat: 28,
      carbs: 26,
    },
    seoTitle: "Wingstop Spicy Korean Q Wings Recipe - Easy Copycat",
    seoDescription:
      "Recreate Wingstop's addictive Spicy Korean Q Wings at home with this copycat recipe. Crispy fried wings tossed in a sweet, spicy gochujang glaze with sesame and garlic.",
    canonicalUrl: "https://bitebuddy.blog/recipes/wingstop-spicy-korean-q-wings",
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
      _id: `drafts.wingstop-spicy-korean-q-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Wingstop Spicy Korean Q Wings recipe complete!");
}

createRecipe().catch(console.error);
