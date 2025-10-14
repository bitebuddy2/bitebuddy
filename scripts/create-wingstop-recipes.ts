// scripts/create-wingstop-recipes.ts
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

// Ingredient definitions for all Wingstop recipes
const allIngredients = [
  // Common wing ingredients
  {
    name: "Chicken wings",
    synonyms: ["wings", "chicken wing", "wing pieces"],
    kcal100: 203,
    protein100: 30.5,
    fat100: 8.1,
    carbs100: 0,
    allergens: [],
  },
  {
    name: "All-purpose flour",
    synonyms: ["plain flour", "wheat flour", "AP flour"],
    kcal100: 364,
    protein100: 10,
    fat100: 1,
    carbs100: 76,
    allergens: ["gluten"],
  },
  {
    name: "Cornstarch",
    synonyms: ["cornflour", "corn flour", "corn starch"],
    kcal100: 381,
    protein100: 0.3,
    fat100: 0.1,
    carbs100: 91,
    allergens: [],
  },
  {
    name: "Baking powder",
    synonyms: ["baking soda mixture"],
    kcal100: 53,
    protein100: 0,
    fat100: 0,
    carbs100: 28,
    allergens: [],
  },
  {
    name: "Unsalted butter",
    synonyms: ["butter", "sweet butter"],
    kcal100: 717,
    protein100: 0.9,
    fat100: 81.1,
    carbs100: 0.1,
    allergens: ["milk"],
  },
  {
    name: "Garlic powder",
    synonyms: ["dried garlic", "granulated garlic"],
    kcal100: 331,
    protein100: 17,
    fat100: 0.7,
    carbs100: 73,
    allergens: [],
  },
  {
    name: "Onion powder",
    synonyms: ["dried onion", "granulated onion"],
    kcal100: 341,
    protein100: 10,
    fat100: 1,
    carbs100: 79,
    allergens: [],
  },
  {
    name: "Black pepper",
    synonyms: ["ground black pepper", "pepper"],
    kcal100: 251,
    protein100: 10,
    fat100: 3.3,
    carbs100: 64,
    allergens: [],
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
    name: "Cayenne pepper",
    synonyms: ["ground cayenne", "cayenne"],
    kcal100: 318,
    protein100: 12,
    fat100: 17,
    carbs100: 57,
    allergens: [],
  },
  {
    name: "Paprika",
    synonyms: ["sweet paprika", "Hungarian paprika"],
    kcal100: 282,
    protein100: 14,
    fat100: 13,
    carbs100: 54,
    allergens: [],
  },
  {
    name: "Smoked paprika",
    synonyms: ["Spanish paprika", "pimentón"],
    kcal100: 282,
    protein100: 14,
    fat100: 13,
    carbs100: 54,
    allergens: [],
  },
  {
    name: "Parmesan cheese",
    synonyms: ["Parmigiano-Reggiano", "grated parmesan"],
    kcal100: 431,
    protein100: 38,
    fat100: 29,
    carbs100: 4.1,
    allergens: ["milk"],
  },
  {
    name: "Fresh parsley",
    synonyms: ["parsley", "flat-leaf parsley", "Italian parsley"],
    kcal100: 36,
    protein100: 3,
    fat100: 0.8,
    carbs100: 6.3,
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
  // Lemon Pepper ingredients
  {
    name: "Lemon pepper seasoning",
    synonyms: ["lemon pepper", "lemon pepper blend"],
    kcal100: 251,
    protein100: 10,
    fat100: 3.3,
    carbs100: 64,
    allergens: [],
  },
  {
    name: "Lemon zest",
    synonyms: ["grated lemon peel", "lemon rind"],
    kcal100: 47,
    protein100: 1.5,
    fat100: 0.3,
    carbs100: 16,
    allergens: [],
  },
  {
    name: "Lemon juice",
    synonyms: ["fresh lemon juice"],
    kcal100: 22,
    protein100: 0.4,
    fat100: 0.2,
    carbs100: 6.9,
    allergens: [],
    density_g_per_ml: 1.0,
  },
  // Louisiana Rub ingredients
  {
    name: "Dried oregano",
    synonyms: ["oregano", "dried oregano leaves"],
    kcal100: 265,
    protein100: 9,
    fat100: 4.3,
    carbs100: 69,
    allergens: [],
  },
  {
    name: "Ground cumin",
    synonyms: ["cumin powder", "cumin"],
    kcal100: 375,
    protein100: 18,
    fat100: 22,
    carbs100: 44,
    allergens: [],
  },
  {
    name: "Light brown sugar",
    synonyms: ["brown sugar", "soft brown sugar"],
    kcal100: 380,
    protein100: 0.1,
    fat100: 0,
    carbs100: 98,
    allergens: [],
  },
  {
    name: "Chilli powder",
    synonyms: ["chili powder", "red chilli powder"],
    kcal100: 282,
    protein100: 14,
    fat100: 13,
    carbs100: 54,
    allergens: [],
  },
  // Brazilian Citrus Pepper ingredients
  {
    name: "Peri peri seasoning",
    synonyms: ["piri piri seasoning", "peri peri spice"],
    kcal100: 282,
    protein100: 14,
    fat100: 13,
    carbs100: 54,
    allergens: [],
  },
  {
    name: "Lime",
    synonyms: ["fresh lime", "limes"],
    kcal100: 30,
    protein100: 0.7,
    fat100: 0.2,
    carbs100: 11,
    allergens: [],
    gramsPerPiece: 67,
  },
  {
    name: "Lime juice",
    synonyms: ["fresh lime juice"],
    kcal100: 25,
    protein100: 0.4,
    fat100: 0.1,
    carbs100: 8.4,
    allergens: [],
    density_g_per_ml: 1.0,
  },
  {
    name: "Dried parsley",
    synonyms: ["parsley flakes", "dried parsley flakes"],
    kcal100: 292,
    protein100: 27,
    fat100: 6,
    carbs100: 51,
    allergens: [],
  },
  // Atomic Wings ingredients
  {
    name: "Hot sauce",
    synonyms: ["pepper sauce", "chili sauce"],
    kcal100: 21,
    protein100: 0.9,
    fat100: 0.5,
    carbs100: 4,
    allergens: [],
    density_g_per_ml: 1.05,
  },
  {
    name: "White vinegar",
    synonyms: ["distilled vinegar", "white wine vinegar"],
    kcal100: 18,
    protein100: 0,
    fat100: 0,
    carbs100: 0.04,
    allergens: [],
    density_g_per_ml: 1.01,
  },
  {
    name: "Honey",
    synonyms: ["clear honey", "runny honey"],
    kcal100: 304,
    protein100: 0.3,
    fat100: 0,
    carbs100: 82,
    allergens: [],
    density_g_per_ml: 1.42,
  },
  {
    name: "Ghost pepper powder",
    synonyms: ["bhut jolokia powder", "ghost chilli powder"],
    kcal100: 318,
    protein100: 12,
    fat100: 17,
    carbs100: 57,
    allergens: [],
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
  console.log("Checking for Wingstop brand...\n");

  const existing = await client.fetch(
    `*[_type == "brand" && name == "Wingstop"][0]`
  );

  if (existing) {
    console.log(`✅ Found existing brand: Wingstop`);
    return existing._id;
  }

  console.log("➕ Creating Wingstop brand...");
  const brand = await client.create({
    _type: "brand",
    name: "Wingstop",
    slug: {
      _type: "slug",
      current: "wingstop",
    },
    description: "American chicken wing restaurant chain specialising in crispy fried wings with bold, flavourful sauces and dry rubs.",
  });

  console.log("✅ Brand created:", brand._id);
  return brand._id;
}

async function getCategories() {
  const mains = await client.fetch(`*[_type == "category" && title == "Mains"][0]`);
  const spicy = await client.fetch(`*[_type == "category" && title == "Spicy"][0]`);
  const snacks = await client.fetch(`*[_type == "category" && title == "Snacks"][0]`);
  const highProtein = await client.fetch(`*[_type == "category" && title == "High-Protein"][0]`);

  return {
    mains: mains?._id,
    spicy: spicy?._id,
    snacks: snacks?._id,
    highProtein: highProtein?._id,
  };
}

async function createRecipes() {
  console.log("🔥 Creating Wingstop recipes...\n");

  // Create brand first
  const brandId = await createOrGetBrand();

  // Get categories
  console.log("\nFetching categories...\n");
  const categories = await getCategories();

  // Create all ingredients
  console.log("\nCreating ingredients...\n");
  const ingredientIds: { [key: string]: string } = {};

  for (const ing of allIngredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");

  // Recipe 1: Garlic Parmesan Wings
  console.log("Creating Garlic Parmesan Wings...\n");
  const garlicParmData = {
    _type: "recipe",
    title: "Wingstop Garlic Parmesan Wings",
    slug: {
      _type: "slug",
      current: "wingstop-garlic-parmesan-wings",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Crispy fried chicken wings tossed in rich garlic butter sauce and coated with freshly grated Parmesan cheese. The ultimate savoury wing experience.",
    servings: 4,
    prepMin: 10,
    cookMin: 25,
    introText:
      "Wingstop's Garlic Parmesan Wings are a flavour sensation - crispy fried wings enveloped in a buttery garlic sauce and generously coated with Parmesan cheese. Unlike spicy wings, these deliver pure savoury indulgence with every bite. The combination of rich butter, aromatic garlic, and sharp Parmesan creates an addictive flavour that keeps you reaching for more. These wings are perfect for those who prefer bold flavour without the heat, making them a crowd-pleasing choice for any gathering. The secret to restaurant-quality wings at home lies in the double coating technique and the generous butter-garlic-Parmesan sauce that clings to every crispy ridge.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Founded in 1994 in Garland, Texas, Wingstop has grown from a single location to over 1,500 restaurants worldwide, becoming one of America's fastest-growing chicken wing chains. Their success is built on a simple philosophy: cooked-to-order wings in bold, distinctive flavours that go far beyond traditional buffalo sauce.",
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
            text: "Garlic Parmesan is one of Wingstop's signature non-spicy flavours, proving that wings don't need heat to be exciting. The rich, buttery sauce combined with freshly grated Parmesan creates a flavour profile that's become a fan favourite across their global locations. It's comfort food elevated to an art form.",
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
            text: "This recipe brings Wingstop's iconic Garlic Parmesan wings to your home kitchen, with crispy fried wings and that signature buttery, cheesy coating that makes them irresistible.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Wings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken wings"] },
            quantity: "1000",
            unit: "g",
            notes: "cut into drumettes and flats",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Vegetable oil"] },
            quantity: "1000",
            unit: "ml",
            notes: "for deep frying",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Coating",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["All-purpose flour"] },
            quantity: "150",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cornstarch"] },
            quantity: "50",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic powder"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Black pepper"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "1",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Garlic Parmesan Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Unsalted butter"] },
            quantity: "80",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic powder"] },
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Black pepper"] },
            quantity: "0.5",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "0.25",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Parmesan cheese"] },
            quantity: "100",
            unit: "g",
            notes: "freshly grated, divided",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fresh parsley"] },
            quantity: "2",
            unit: "tbsp",
            notes: "finely chopped, for garnish",
          },
        ],
      },
    ],
    steps: [
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Pat the chicken wings dry with kitchen paper. This is crucial for achieving crispy skin." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "In a large bowl, mix together the flour, cornstarch, garlic powder, black pepper, and salt. This is your coating mixture." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Toss the wings in the coating mixture, ensuring each piece is evenly covered. Shake off any excess flour." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Heat vegetable oil in a large, deep pot or deep fryer to 175°C (350°F). Use a cooking thermometer to maintain the correct temperature." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Carefully lower the wings into the hot oil in batches, being careful not to overcrowd. Fry for 10-12 minutes, turning occasionally, until golden brown and cooked through (internal temperature should reach 75°C)." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Remove wings with a slotted spoon and drain on kitchen paper. Repeat with remaining wings." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "While the wings are frying, make the sauce. Melt butter in a small saucepan over medium-low heat. Add garlic powder, black pepper, salt, and 1 tablespoon of Parmesan cheese. Stir until well combined and the cheese is melted." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Place the hot fried wings in a large bowl. Pour the garlic butter sauce over the wings and toss to coat thoroughly." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Add the remaining grated Parmesan cheese to the bowl and toss again until the wings are well coated with cheese." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Transfer to a serving plate and garnish with freshly chopped parsley. Serve immediately while hot and crispy." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Pat wings completely dry before coating - moisture prevents crispiness and can cause dangerous oil splatter.",
      "Don't overcrowd the fryer - cook wings in batches to maintain oil temperature and ensure even crisping.",
      "Use freshly grated Parmesan rather than pre-grated for the best flavour and texture - it melts better and tastes superior.",
      "For extra crispy wings, double-fry them: fry once for 8 minutes, rest for 5 minutes, then fry again for 3-4 minutes.",
      "Toss wings in the sauce while they're still hot so the butter and cheese adhere properly.",
      "Serve immediately - these wings are best enjoyed fresh and hot, as the coating softens over time.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        question: "Can I bake these wings instead of frying?",
        answer:
          "Yes! Place coated wings on a wire rack over a baking tray and bake at 220°C (200°C fan) for 45-50 minutes, flipping halfway through, until golden and crispy. They won't be quite as crispy as fried, but they're still delicious.",
      },
      {
        _key: randomUUID(),
        question: "Why is my coating falling off the wings?",
        answer:
          "This usually happens when wings aren't dried properly before coating, or if the oil temperature is too low. Always pat wings completely dry and maintain oil at 175°C throughout frying.",
      },
      {
        _key: randomUUID(),
        question: "Can I use pre-grated Parmesan?",
        answer:
          "You can, but freshly grated Parmesan tastes significantly better and melts more smoothly. Pre-grated cheese contains anti-caking agents that affect texture and flavour.",
      },
      {
        _key: randomUUID(),
        question: "How do I store leftovers?",
        answer:
          "Store in an airtight container in the fridge for up to 3 days. Reheat in the oven at 180°C for 10-12 minutes to crisp them up again. Microwaving will make them soggy.",
      },
    ],
    nutrition: {
      calories: 456,
      protein: 28,
      fat: 32,
      carbs: 15,
    },
    seoTitle: "Wingstop Garlic Parmesan Wings - Copycat Recipe",
    seoDescription:
      "Make Wingstop's famous Garlic Parmesan Wings at home! Crispy fried wings in buttery garlic sauce with Parmesan cheese. Better than takeaway.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/wingstop-garlic-parmesan-wings",
    categories: [
      ...(categories.mains ? [{ _type: "reference", _ref: categories.mains, _key: randomUUID() }] : []),
      ...(categories.highProtein ? [{ _type: "reference", _ref: categories.highProtein, _key: randomUUID() }] : []),
      ...(categories.snacks ? [{ _type: "reference", _ref: categories.snacks, _key: randomUUID() }] : []),
    ],
  };

  const existingGarlicParm = await client.fetch(
    `*[_type == "recipe" && slug.current == "wingstop-garlic-parmesan-wings"][0]`
  );

  if (existingGarlicParm) {
    await client.patch(existingGarlicParm._id).set(garlicParmData).commit();
    console.log("✅ Garlic Parmesan Wings updated");
  } else {
    await client.create(garlicParmData);
    console.log("✅ Garlic Parmesan Wings created");
  }

  // Recipe 2: Lemon Pepper Wings
  console.log("\nCreating Lemon Pepper Wings...\n");
  const lemonPepperData = {
    _type: "recipe",
    title: "Wingstop Lemon Pepper Wings",
    slug: {
      _type: "slug",
      current: "wingstop-lemon-pepper-wings",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Crispy fried chicken wings tossed in lemon pepper butter sauce. Tangy, zesty, and utterly addictive - one of Wingstop's most popular flavours.",
    servings: 4,
    prepMin: 10,
    cookMin: 25,
    introText:
      "Wingstop's Lemon Pepper Wings are a citrusy sensation that proves sometimes the simplest flavours are the best. These crispy fried wings are generously coated in a buttery lemon pepper seasoning that delivers bright, zesty flavour with a peppery kick. The combination of tangy lemon and aromatic black pepper creates a perfectly balanced wing that's refreshing yet satisfying. Unlike heavy, saucy wings, these have a lighter, more sophisticated flavour profile that lets the quality of the chicken shine through. The butter helps the seasoning cling to every crispy ridge while adding richness. This is one of Wingstop's most requested flavours, beloved for its clean, vibrant taste that never gets boring.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Lemon Pepper is one of Wingstop's signature dry rub flavours, though it's actually tossed in seasoned butter rather than being completely dry. This technique gives you the best of both worlds - the crispy texture of a dry wing with the flavour-carrying power of butter. It's become one of their most iconic offerings since the chain's founding in 1994.",
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
            text: "The secret to Wingstop's Lemon Pepper wings is the quality of their seasoning blend and the timing - the wings are tossed while piping hot so the butter melts perfectly and the lemon pepper adheres to create that signature coating. Fresh lemon zest takes it to the next level, adding natural oils and brightness that pre-made seasonings alone can't match.",
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
            text: "This recipe recreates Wingstop's legendary Lemon Pepper wings at home, delivering that perfect balance of crispy, tangy, and peppery in every bite.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Wings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken wings"] },
            quantity: "1000",
            unit: "g",
            notes: "cut into drumettes and flats",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Vegetable oil"] },
            quantity: "1000",
            unit: "ml",
            notes: "for deep frying",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Coating",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["All-purpose flour"] },
            quantity: "150",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cornstarch"] },
            quantity: "50",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Lemon pepper seasoning"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "1",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Lemon Pepper Butter",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Unsalted butter"] },
            quantity: "80",
            unit: "g",
            notes: "melted",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Lemon pepper seasoning"] },
            quantity: "3",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Lemon zest"] },
            quantity: "1",
            unit: "tbsp",
            notes: "from 2 lemons",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Lemon juice"] },
            quantity: "2",
            unit: "tbsp",
            notes: "freshly squeezed",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Black pepper"] },
            quantity: "1",
            unit: "tsp",
            notes: "freshly ground",
          },
        ],
      },
    ],
    steps: [
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Pat the chicken wings completely dry with kitchen paper. Remove any excess moisture for maximum crispiness." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "In a large bowl, combine flour, cornstarch, 1 tablespoon lemon pepper seasoning, and salt. Mix well to create your coating mixture." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Toss the wings in the coating mixture until evenly covered, then shake off excess flour." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Heat vegetable oil in a large, deep pot or deep fryer to 175°C (350°F). Maintain this temperature throughout cooking." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Fry the wings in batches for 10-12 minutes, turning occasionally, until golden brown and cooked through. Internal temperature should reach 75°C." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Remove wings with a slotted spoon and drain on kitchen paper. Continue with remaining batches." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "While wings are frying, prepare the lemon pepper butter. In a small bowl, mix melted butter with 3 tablespoons lemon pepper seasoning, lemon zest, lemon juice, and freshly ground black pepper." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Place hot fried wings in a large bowl. Pour the lemon pepper butter over the wings immediately." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Toss the wings thoroughly to coat them completely in the lemon pepper butter mixture. The heat from the wings will help the butter and seasoning adhere perfectly." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Transfer to a serving plate and serve immediately while hot and crispy. These wings are best enjoyed fresh." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Use fresh lemons for zesting and juice - bottled lemon juice lacks the vibrant flavour needed for this recipe.",
      "Zest the lemons before juicing them - it's much easier when the lemon is whole.",
      "Toss wings in the lemon pepper butter immediately after frying while they're still piping hot for the best coating.",
      "Don't skip the cornstarch in the coating - it creates extra crispiness that plain flour alone can't achieve.",
      "For an extra citrus punch, add a bit more fresh lemon juice just before serving.",
      "Freshly ground black pepper makes a noticeable difference compared to pre-ground - use a pepper mill if you have one.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        question: "Can I make these in an air fryer?",
        answer:
          "Yes! Air fry coated wings at 200°C for 25-30 minutes, shaking the basket every 10 minutes. They'll be slightly less crispy than deep-fried but still delicious and much healthier.",
      },
      {
        _key: randomUUID(),
        question: "Is lemon pepper seasoning the same as lemon zest and black pepper?",
        answer:
          "Not quite - lemon pepper seasoning is a specific blend that includes dried lemon peel, black pepper, salt, and often other spices. For best results, buy proper lemon pepper seasoning and supplement it with fresh zest.",
      },
      {
        _key: randomUUID(),
        question: "Why are my wings not crispy?",
        answer:
          "Wings must be completely dry before coating, the oil must be at the correct temperature (175°C), and you must not overcrowd the fryer. Also, serve immediately - wings lose crispness as they sit.",
      },
      {
        _key: randomUUID(),
        question: "Can I use chicken drumsticks instead of wings?",
        answer:
          "Yes, but increase cooking time to 15-18 minutes to ensure they're cooked through. Drumsticks are meatier so they take longer, but the flavour will be excellent.",
      },
    ],
    nutrition: {
      calories: 445,
      protein: 27,
      fat: 31,
      carbs: 14,
    },
    seoTitle: "Wingstop Lemon Pepper Wings - Easy Copycat Recipe",
    seoDescription:
      "Make Wingstop's iconic Lemon Pepper Wings at home! Crispy fried wings in zesty lemon pepper butter. Better than takeaway in just 35 minutes.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/wingstop-lemon-pepper-wings",
    categories: [
      ...(categories.mains ? [{ _type: "reference", _ref: categories.mains, _key: randomUUID() }] : []),
      ...(categories.highProtein ? [{ _type: "reference", _ref: categories.highProtein, _key: randomUUID() }] : []),
      ...(categories.snacks ? [{ _type: "reference", _ref: categories.snacks, _key: randomUUID() }] : []),
    ],
  };

  const existingLemonPepper = await client.fetch(
    `*[_type == "recipe" && slug.current == "wingstop-lemon-pepper-wings"][0]`
  );

  if (existingLemonPepper) {
    await client.patch(existingLemonPepper._id).set(lemonPepperData).commit();
    console.log("✅ Lemon Pepper Wings updated");
  } else {
    await client.create(lemonPepperData);
    console.log("✅ Lemon Pepper Wings created");
  }

  // Recipe 3: Louisiana Rub Wings
  console.log("\nCreating Louisiana Rub Wings...\n");
  const louisianaRubData = {
    _type: "recipe",
    title: "Wingstop Louisiana Rub Wings",
    slug: {
      _type: "slug",
      current: "wingstop-louisiana-rub-wings",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Crispy fried chicken wings coated in a spiced Cajun dry rub with a distinctly Louisiana flavour. Smoky, spicy, and full of Southern charm.",
    servings: 4,
    prepMin: 10,
    cookMin: 25,
    introText:
      "Wingstop's Louisiana Rub Wings bring the bold, spicy flavours of New Orleans straight to your plate. These crispy fried wings are generously coated in a Cajun-inspired dry rub featuring smoked paprika, cayenne, oregano, and a touch of brown sugar for balance. The result is a wing that's smoky, spicy, slightly sweet, and absolutely packed with flavour. Unlike wet sauces, this dry rub creates a crispy, flavourful crust that won't make your fingers messy - though you'll still lick them clean! The Louisiana Rub has become a Wingstop favourite for those who want serious flavour and heat without drowning their wings in sauce. It's Cajun cooking at its finest, simplified into a wing that delivers big taste with every bite.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "The Louisiana Rub is Wingstop's tribute to Cajun and Creole cuisine, drawing inspiration from the bold, layered spice blends that define New Orleans cooking. While Wingstop is a Texas-born chain, this flavour celebrates Louisiana's rich culinary heritage with its distinctive combination of smoked paprika, cayenne heat, and aromatic herbs.",
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
            text: "Described by Wingstop as having 'a crispy, spiced dry rub with a distinctly Cajun drawl,' the Louisiana Rub delivers medium heat with complex flavour. The touch of brown sugar balances the spices while helping create a beautiful caramelised crust. It's proof that you don't need a wet sauce to create memorable wings.",
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
            text: "This recipe brings Wingstop's Louisiana magic to your home kitchen, with crispy wings and a flavour-packed Cajun rub that'll transport you straight to the French Quarter.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Wings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken wings"] },
            quantity: "1000",
            unit: "g",
            notes: "cut into drumettes and flats",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Vegetable oil"] },
            quantity: "1000",
            unit: "ml",
            notes: "for deep frying",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Coating",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["All-purpose flour"] },
            quantity: "150",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cornstarch"] },
            quantity: "50",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "1",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Louisiana Dry Rub",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Smoked paprika"] },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic powder"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Onion powder"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cayenne pepper"] },
            quantity: "1.5",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Dried oregano"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Ground cumin"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Light brown sugar"] },
            quantity: "1.5",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Black pepper"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "1",
            unit: "tsp",
          },
        ],
      },
    ],
    steps: [
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Make the Louisiana dry rub first. In a bowl, combine smoked paprika, garlic powder, onion powder, cayenne pepper, oregano, cumin, brown sugar, black pepper, and salt. Mix thoroughly and set aside." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Pat the chicken wings completely dry with kitchen paper. This is essential for crispy wings." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "In a large bowl, mix together the flour, cornstarch, and 1 teaspoon salt to create your coating mixture." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Toss the dry wings in the flour coating until evenly covered, shaking off any excess." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Heat vegetable oil in a large, deep pot or deep fryer to 175°C (350°F). Use a thermometer to monitor temperature." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Fry wings in batches for 10-12 minutes, turning occasionally, until golden brown and cooked through to 75°C internal temperature. Don't overcrowd the pot." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Remove wings with a slotted spoon and drain briefly on kitchen paper. While still hot, place them in a large bowl." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Immediately sprinkle the Louisiana dry rub generously over the hot wings. Start with about 3-4 tablespoons of the rub mixture." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Toss the wings vigorously to coat them evenly in the spice mixture. The heat from the wings will help the spices adhere and release their aromatic oils." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Taste and add more rub if desired. Transfer to a serving plate and serve immediately while hot and crispy. Store any leftover rub in an airtight container." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Make extra dry rub - it stores well in an airtight container for up to 3 months and works brilliantly on chicken, pork, or even roasted vegetables.",
      "Toss wings in the rub while they're still piping hot from the fryer - the heat helps the spices bloom and stick.",
      "Adjust cayenne pepper to taste - use 1 teaspoon for mild heat, 1.5 teaspoons for medium, or 2 teaspoons for extra spice.",
      "The brown sugar helps create a slightly caramelised crust and balances the heat - don't skip it.",
      "For even more flavour, let wings rest for 2-3 minutes after coating so the spices can set before serving.",
      "Smoked paprika is key to authentic Louisiana flavour - regular paprika won't give the same depth.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        question: "Can I bake these wings instead of frying?",
        answer:
          "Yes! Bake coated wings on a wire rack at 220°C (200°C fan) for 45-50 minutes, flipping halfway. Apply the dry rub immediately after baking while wings are still hot.",
      },
      {
        _key: randomUUID(),
        question: "How spicy are these wings?",
        answer:
          "They're medium spicy - noticeably hot but not overwhelming. The cayenne provides heat while the other spices add complexity. You can reduce cayenne to 1 teaspoon for milder wings.",
      },
      {
        _key: randomUUID(),
        question: "Why use a dry rub instead of sauce?",
        answer:
          "Dry rubs keep wings crispy and create intense, concentrated flavour without the mess of wet sauce. They're perfect for those who want big flavour but prefer a less messy eating experience.",
      },
      {
        _key: randomUUID(),
        question: "Can I use this rub on other meats?",
        answer:
          "Absolutely! This Louisiana rub is fantastic on grilled chicken, pork chops, fish, or even sprinkled on chips. It's a versatile Cajun seasoning blend.",
      },
    ],
    nutrition: {
      calories: 438,
      protein: 27,
      fat: 30,
      carbs: 16,
    },
    seoTitle: "Wingstop Louisiana Rub Wings - Cajun Copycat Recipe",
    seoDescription:
      "Make Wingstop's famous Louisiana Rub Wings at home! Crispy fried wings with smoky Cajun dry rub. Bold Southern flavours in 35 minutes.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/wingstop-louisiana-rub-wings",
    categories: [
      ...(categories.mains ? [{ _type: "reference", _ref: categories.mains, _key: randomUUID() }] : []),
      ...(categories.spicy ? [{ _type: "reference", _ref: categories.spicy, _key: randomUUID() }] : []),
      ...(categories.highProtein ? [{ _type: "reference", _ref: categories.highProtein, _key: randomUUID() }] : []),
      ...(categories.snacks ? [{ _type: "reference", _ref: categories.snacks, _key: randomUUID() }] : []),
    ],
  };

  const existingLouisiana = await client.fetch(
    `*[_type == "recipe" && slug.current == "wingstop-louisiana-rub-wings"][0]`
  );

  if (existingLouisiana) {
    await client.patch(existingLouisiana._id).set(louisianaRubData).commit();
    console.log("✅ Louisiana Rub Wings updated");
  } else {
    await client.create(louisianaRubData);
    console.log("✅ Louisiana Rub Wings created");
  }

  // Recipe 4: Brazilian Citrus Pepper Wings
  console.log("\nCreating Brazilian Citrus Pepper Wings...\n");
  const brazilianCitrusData = {
    _type: "recipe",
    title: "Wingstop Brazilian Citrus Pepper Wings",
    slug: {
      _type: "slug",
      current: "wingstop-brazilian-citrus-pepper-wings",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Crispy fried chicken wings in a tangy citrus butter sauce with peri peri spice. Zingy, zesty, and packed with Brazilian-inspired flavours.",
    servings: 4,
    prepMin: 10,
    cookMin: 25,
    introText:
      "Wingstop's Brazilian Citrus Pepper Wings deliver an exotic flavour journey combining the bright tang of lime with the fiery kick of peri peri spice. These crispy fried wings are tossed in a buttery citrus sauce that's sweet, spicy, and refreshingly zesty all at once. The inspiration comes from Brazilian cuisine's love of bold citrus flavours and Portuguese peri peri influence, creating a wing that's unlike anything else on the menu. Fresh lime juice and zest provide natural brightness while peri peri seasoning brings heat and depth. A touch of brown sugar balances the acidity and helps create a glossy, flavourful coating. These wings are perfect for adventurous eaters who want something different - they're tangy, spicy, and absolutely addictive.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Brazilian Citrus Pepper is one of Wingstop's more exotic flavour offerings, inspired by the vibrant food culture of Brazil where citrus fruits play a starring role in countless dishes. The addition of peri peri seasoning nods to Portuguese influence in Brazilian cuisine, creating a unique fusion that's become a fan favourite.",
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
            text: "This flavour showcases Wingstop's commitment to global flavours and bold experimentation. The combination of tangy lime and spicy peri peri creates a wing that's refreshing yet fiery, perfect for those who want heat with brightness. It's summer in a wing - vibrant, exciting, and full of life.",
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
            text: "This recipe brings Wingstop's Brazilian adventure to your kitchen, with crispy wings and a citrus-peri peri butter that'll transport your taste buds straight to Rio.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Wings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken wings"] },
            quantity: "1000",
            unit: "g",
            notes: "cut into drumettes and flats",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Vegetable oil"] },
            quantity: "1000",
            unit: "ml",
            notes: "for deep frying",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Coating",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["All-purpose flour"] },
            quantity: "150",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cornstarch"] },
            quantity: "50",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic powder"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Black pepper"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "1",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Brazilian Citrus Butter Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Unsalted butter"] },
            quantity: "80",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Peri peri seasoning"] },
            quantity: "2",
            unit: "tbsp",
            notes: "low salt if possible",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cayenne pepper"] },
            quantity: "0.5",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Dried parsley"] },
            quantity: "0.5",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Lime"] },
            quantity: "2",
            unit: "piece",
            notes: "zested and juiced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Lime juice"] },
            quantity: "1",
            unit: "tbsp",
            notes: "additional",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic powder"] },
            quantity: "0.5",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Light brown sugar"] },
            quantity: "2",
            unit: "tbsp",
          },
        ],
      },
    ],
    steps: [
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Pat the chicken wings completely dry with kitchen paper to ensure maximum crispiness when fried." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "In a large bowl, combine flour, cornstarch, garlic powder, black pepper, and salt. Mix well to create your coating." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Toss the wings in the coating mixture until evenly covered, then shake off excess flour." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Heat vegetable oil in a large, deep pot or deep fryer to 175°C (350°F). Maintain this temperature throughout frying." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Fry wings in batches for 10-12 minutes, turning occasionally, until golden brown and cooked through to 75°C internal temperature." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Remove wings with a slotted spoon and drain on kitchen paper. Continue with remaining batches." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "While wings are frying, make the sauce. In a small saucepan over low heat, melt butter. Add peri peri seasoning, cayenne pepper, dried parsley, lime zest, lime juice, garlic powder, and brown sugar." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Stir the sauce constantly over low heat for about 30-60 seconds until everything is combined and the sugar is dissolved. Do NOT cook longer than 1 minute or it will caramelise into a spicy toffee!" },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Place hot fried wings in a large bowl. Pour the Brazilian citrus butter sauce over the wings immediately." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Toss wings thoroughly to coat them completely in the citrus-peri peri butter. The sauce should create a glossy, flavourful coating. Serve immediately while hot." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Don't cook the butter sauce for more than 1 minute - the sugar will caramelise quickly and turn into sticky toffee rather than a glossy sauce.",
      "Use fresh limes for the best flavour - bottled lime juice doesn't have the same brightness or aromatic oils from the zest.",
      "Zest limes before juicing them - it's much easier when the fruit is whole.",
      "If you can't find peri peri seasoning, substitute with 1 tablespoon paprika, 1/2 tablespoon cayenne, and 1/2 tablespoon garlic powder.",
      "For less heat, reduce cayenne to 1/4 teaspoon or omit entirely - the peri peri seasoning provides plenty of spice.",
      "These wings are fantastic served with extra lime wedges for squeezing over the top.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        question: "What is peri peri seasoning?",
        answer:
          "Peri peri (also called piri piri) is a spicy seasoning blend featuring African bird's eye chili, garlic, paprika, and herbs. It's Portuguese-African in origin and brings heat with complex flavour. Look for it in the spice aisle or make your own blend.",
      },
      {
        _key: randomUUID(),
        question: "Can I use lemon instead of lime?",
        answer:
          "Yes, but lime is more authentic to Brazilian cuisine and has a slightly different, more aromatic flavour. If using lemon, the wings will still be delicious but taste slightly different from Wingstop's version.",
      },
      {
        _key: randomUUID(),
        question: "Why did my sauce turn into caramel?",
        answer:
          "The brown sugar caramelises quickly when heated. Keep the heat very low and stir constantly. Only cook for 30-60 seconds, just until the sugar dissolves - then remove from heat immediately.",
      },
      {
        _key: randomUUID(),
        question: "How spicy are these wings?",
        answer:
          "They're medium-hot with a citrus brightness that balances the heat. The spice level comes from both peri peri seasoning and cayenne. Reduce cayenne to 1/4 teaspoon for milder wings.",
      },
    ],
    nutrition: {
      calories: 452,
      protein: 27,
      fat: 31,
      carbs: 17,
    },
    seoTitle: "Wingstop Brazilian Citrus Pepper Wings - Copycat Recipe",
    seoDescription:
      "Make Wingstop's Brazilian Citrus Pepper Wings at home! Crispy fried wings in tangy lime-peri peri butter. Exotic flavours in 35 minutes.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/wingstop-brazilian-citrus-pepper-wings",
    categories: [
      ...(categories.mains ? [{ _type: "reference", _ref: categories.mains, _key: randomUUID() }] : []),
      ...(categories.spicy ? [{ _type: "reference", _ref: categories.spicy, _key: randomUUID() }] : []),
      ...(categories.highProtein ? [{ _type: "reference", _ref: categories.highProtein, _key: randomUUID() }] : []),
      ...(categories.snacks ? [{ _type: "reference", _ref: categories.snacks, _key: randomUUID() }] : []),
    ],
  };

  const existingBrazilian = await client.fetch(
    `*[_type == "recipe" && slug.current == "wingstop-brazilian-citrus-pepper-wings"][0]`
  );

  if (existingBrazilian) {
    await client.patch(existingBrazilian._id).set(brazilianCitrusData).commit();
    console.log("✅ Brazilian Citrus Pepper Wings updated");
  } else {
    await client.create(brazilianCitrusData);
    console.log("✅ Brazilian Citrus Pepper Wings created");
  }

  // Recipe 5: Atomic Wings
  console.log("\nCreating Atomic Wings...\n");
  const atomicData = {
    _type: "recipe",
    title: "Wingstop Atomic Wings",
    slug: {
      _type: "slug",
      current: "wingstop-atomic-wings",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "The hottest wings on Wingstop's menu. Crispy fried chicken wings in a fiery atomic sauce with ghost pepper. Not for the faint of heart.",
    servings: 4,
    prepMin: 10,
    cookMin: 25,
    introText:
      "Wingstop's Atomic Wings are legendary - the spiciest, hottest, most intense wings on their entire menu. These aren't just hot; they're face-meltingly, sweat-inducingly, tears-streaming-down-your-face ATOMIC. The sauce combines cayenne pepper, hot sauce, and optional ghost pepper powder for those who truly dare, creating a slow-building burn that lingers and intensifies with each bite. But it's not just about heat - the sauce features garlic, butter, vinegar, and a touch of honey that add complexity and balance (though the heat definitely dominates). These wings are a challenge, a badge of honour, and an unforgettable experience. If you think you can handle the heat, grab plenty of milk and napkins - you'll need both. This is Wingstop's ultimate test for spice lovers.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Atomic is Wingstop's signature super-spicy flavour, positioned at the very top of their heat scale. It's become a rite of passage for spice enthusiasts and competitive eaters, with countless social media videos documenting brave (or foolish) souls attempting the Atomic challenge. The name says it all - these wings pack an explosive punch.",
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
            text: "What makes Atomic special is the layered heat - it starts with a bold, tangy flavour from the hot sauce and vinegar, then the cayenne kicks in, building to a crescendo of heat that keeps intensifying. Adding ghost pepper powder (optional but authentic) takes it to truly atomic levels. The butter and honey provide just enough richness to balance the burn - barely.",
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
            text: "This recipe recreates Wingstop's notorious Atomic wings at home. Fair warning: these are seriously hot. Have milk, bread, or ice cream nearby - you'll probably need them!",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Wings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken wings"] },
            quantity: "1000",
            unit: "g",
            notes: "cut into drumettes and flats",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Vegetable oil"] },
            quantity: "1000",
            unit: "ml",
            notes: "for deep frying",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Coating",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["All-purpose flour"] },
            quantity: "150",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cornstarch"] },
            quantity: "50",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic powder"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cayenne pepper"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "1",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Atomic Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Unsalted butter"] },
            quantity: "60",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Hot sauce"] },
            quantity: "60",
            unit: "ml",
            notes: "such as Frank's RedHot",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cayenne pepper"] },
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic powder"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Paprika"] },
            quantity: "1",
            unit: "tsp",
            notes: "smoked or regular",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["White vinegar"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Honey"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Ghost pepper powder"] },
            quantity: "0.5",
            unit: "tsp",
            notes: "optional, for extreme heat",
          },
        ],
      },
    ],
    steps: [
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Pat the chicken wings completely dry with kitchen paper. Dry wings are essential for achieving maximum crispiness." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "In a large bowl, combine flour, cornstarch, garlic powder, cayenne pepper, and salt. Mix thoroughly to create your coating." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Toss the wings in the coating mixture until evenly covered, shaking off any excess flour." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Heat vegetable oil in a large, deep pot or deep fryer to 175°C (350°F). Monitor temperature with a thermometer throughout cooking." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Fry wings in batches for 10-12 minutes, turning occasionally, until deep golden brown and cooked through to 75°C internal temperature. Don't overcrowd the fryer." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Remove wings with a slotted spoon and drain briefly on kitchen paper. Continue frying remaining batches." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "While wings are frying, make the atomic sauce. In a small saucepan over medium-low heat, melt the butter. Add hot sauce, cayenne pepper, garlic powder, paprika, vinegar, and honey. Stir well to combine." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "If using ghost pepper powder (for extreme heat), add it now and stir thoroughly. Cook sauce for 2-3 minutes, stirring constantly, until well combined and slightly thickened." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Place hot fried wings in a large bowl. Pour the atomic sauce over the wings while both are still hot." },
            ],
            style: "normal",
          },
        ],
      },
      {
        _key: randomUUID(),
        step: [
          {
            _key: randomUUID(),
            _type: "block",
            children: [
              { _key: randomUUID(), _type: "span", text: "Toss wings thoroughly to coat them completely in the fiery sauce. Serve immediately with plenty of napkins, cold milk, and possibly ice cream! Warn anyone eating these - they're seriously spicy." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Start without ghost pepper powder if you're unsure about heat tolerance - these wings are already very spicy without it.",
      "Have dairy products nearby - milk, yoghurt, or ice cream are the best remedies for capsaicin burn. Water makes it worse!",
      "Wear gloves when handling the sauce and avoid touching your face or eyes - the capsaicin oils are potent.",
      "The heat builds with each wing - what seems manageable at first will intensify quickly.",
      "For slightly less heat, reduce cayenne to 1 teaspoon and skip the ghost pepper entirely - they'll still be spicy!",
      "Blue cheese or ranch dressing provides cooling relief between bites if you need it.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        question: "How hot are these wings really?",
        answer:
          "Very hot! With the cayenne alone, they're significantly spicier than buffalo wings. With ghost pepper added, they're in the 'challenge wing' territory. Only attempt if you regularly eat very spicy food.",
      },
      {
        _key: randomUUID(),
        question: "What should I do if they're too spicy?",
        answer:
          "Drink cold milk or eat ice cream - dairy proteins bind with capsaicin and wash it away. Bread, rice, or sugar also help. Never drink water or beer - they spread the heat around without neutralising it.",
      },
      {
        _key: randomUUID(),
        question: "Can I make these milder?",
        answer:
          "Yes - reduce cayenne pepper in the sauce to 1 teaspoon (or omit entirely), skip the ghost pepper powder, and use a milder hot sauce. They'll still have a kick but won't be atomic.",
      },
      {
        _key: randomUUID(),
        question: "Why do the wings keep getting hotter?",
        answer:
          "Capsaicin (the compound that makes peppers hot) builds up in your mouth with each bite, and the burning sensation intensifies over time. This is normal for very spicy foods - the heat is cumulative.",
      },
    ],
    nutrition: {
      calories: 448,
      protein: 27,
      fat: 31,
      carbs: 16,
    },
    seoTitle: "Wingstop Atomic Wings - Copycat Recipe (Extra Hot!)",
    seoDescription:
      "Make Wingstop's legendary Atomic Wings at home! The hottest wings on the menu with ghost pepper. Only for true spice lovers. Ready in 35 minutes.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/wingstop-atomic-wings",
    categories: [
      ...(categories.mains ? [{ _type: "reference", _ref: categories.mains, _key: randomUUID() }] : []),
      ...(categories.spicy ? [{ _type: "reference", _ref: categories.spicy, _key: randomUUID() }] : []),
      ...(categories.highProtein ? [{ _type: "reference", _ref: categories.highProtein, _key: randomUUID() }] : []),
      ...(categories.snacks ? [{ _type: "reference", _ref: categories.snacks, _key: randomUUID() }] : []),
    ],
  };

  const existingAtomic = await client.fetch(
    `*[_type == "recipe" && slug.current == "wingstop-atomic-wings"][0]`
  );

  if (existingAtomic) {
    await client.patch(existingAtomic._id).set(atomicData).commit();
    console.log("✅ Atomic Wings updated");
  } else {
    await client.create(atomicData);
    console.log("✅ Atomic Wings created");
  }

  console.log("\n🔥 All Wingstop recipes created successfully!");
  console.log("📝 All recipes include:");
  console.log("  - Complete ingredient references with nutrition & allergens");
  console.log("  - Detailed step-by-step instructions");
  console.log("  - 6 tips & variations per recipe");
  console.log("  - 4 FAQs per recipe");
  console.log("  - Full nutrition info per serving");
  console.log("  - SEO-optimized titles & descriptions");
  console.log("  - Canonical URLs");
  console.log("  - Proper category assignments");
  console.log("\nRecipes created:");
  console.log("  1. Garlic Parmesan Wings");
  console.log("  2. Lemon Pepper Wings");
  console.log("  3. Louisiana Rub Wings");
  console.log("  4. Brazilian Citrus Pepper Wings");
  console.log("  5. Atomic Wings");
  console.log("\nNote: You'll need to add hero images in Sanity Studio for each recipe.");
}

createRecipes().catch(console.error);
