// scripts/create-nandos-recipes.ts
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

// Ingredient definitions for all Nando's recipes
const allIngredients = [
  // Common ingredients
  {
    name: "Macaroni pasta",
    synonyms: ["elbow macaroni", "macaroni", "pasta tubes"],
    kcal100: 371,
    protein100: 13,
    fat100: 1.5,
    carbs100: 75,
    allergens: ["gluten"],
  },
  {
    name: "Mature cheddar cheese",
    synonyms: ["cheddar", "sharp cheddar", "strong cheddar"],
    kcal100: 416,
    protein100: 25,
    fat100: 34.9,
    carbs100: 0.1,
    allergens: ["milk"],
  },
  {
    name: "Red Leicester cheese",
    synonyms: ["red leicester"],
    kcal100: 402,
    protein100: 24,
    fat100: 33.7,
    carbs100: 0.1,
    allergens: ["milk"],
  },
  {
    name: "Double cream",
    synonyms: ["heavy cream", "thick cream"],
    kcal100: 449,
    protein100: 1.7,
    fat100: 48,
    carbs100: 2.6,
    allergens: ["milk"],
    density_g_per_ml: 1.0,
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
    name: "Plain flour",
    synonyms: ["all-purpose flour", "wheat flour"],
    kcal100: 364,
    protein100: 10,
    fat100: 1,
    carbs100: 76,
    allergens: ["gluten"],
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
    name: "Peri-peri sauce",
    synonyms: ["piri piri sauce", "peri peri", "African bird's eye chili sauce"],
    kcal100: 65,
    protein100: 1,
    fat100: 5,
    carbs100: 4,
    allergens: [],
    density_g_per_ml: 1.05,
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
    name: "Panko breadcrumbs",
    synonyms: ["Japanese breadcrumbs", "panko"],
    kcal100: 395,
    protein100: 13,
    fat100: 2.5,
    carbs100: 78,
    allergens: ["gluten"],
  },
  // Pastel de Nata ingredients
  {
    name: "Puff pastry",
    synonyms: ["ready-rolled puff pastry"],
    kcal100: 558,
    protein100: 6.3,
    fat100: 40,
    carbs100: 43,
    allergens: ["gluten", "milk"],
  },
  {
    name: "Egg yolks",
    synonyms: ["yolks", "egg yolk"],
    kcal100: 322,
    protein100: 16,
    fat100: 27,
    carbs100: 3.6,
    allergens: ["egg"],
    gramsPerPiece: 18,
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
    name: "Cornflour",
    synonyms: ["cornstarch", "corn flour"],
    kcal100: 381,
    protein100: 0.3,
    fat100: 0.1,
    carbs100: 91,
    allergens: [],
  },
  {
    name: "Vanilla extract",
    synonyms: ["vanilla essence", "pure vanilla"],
    kcal100: 288,
    protein100: 0.1,
    fat100: 0.1,
    carbs100: 13,
    allergens: [],
    density_g_per_ml: 0.88,
  },
  {
    name: "Ground cinnamon",
    synonyms: ["cinnamon powder", "cinnamon"],
    kcal100: 247,
    protein100: 4,
    fat100: 1.2,
    carbs100: 81,
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
  // Burger ingredients
  {
    name: "Beef mince",
    synonyms: ["ground beef", "minced beef", "beef mince 20% fat"],
    kcal100: 250,
    protein100: 17,
    fat100: 20,
    carbs100: 0,
    allergens: [],
  },
  {
    name: "Brioche burger buns",
    synonyms: ["brioche buns", "burger buns"],
    kcal100: 375,
    protein100: 8,
    fat100: 15,
    carbs100: 50,
    allergens: ["gluten", "milk", "egg"],
    gramsPerPiece: 75,
  },
  {
    name: "Iceberg lettuce",
    synonyms: ["lettuce", "crisp lettuce"],
    kcal100: 14,
    protein100: 0.9,
    fat100: 0.1,
    carbs100: 3,
    allergens: [],
  },
  {
    name: "Beef tomatoes",
    synonyms: ["large tomatoes", "beefsteak tomatoes"],
    kcal100: 18,
    protein100: 0.9,
    fat100: 0.2,
    carbs100: 3.9,
    allergens: [],
    gramsPerPiece: 200,
  },
  {
    name: "Red onion",
    synonyms: ["purple onion", "red salad onion"],
    kcal100: 40,
    protein100: 1.1,
    fat100: 0.1,
    carbs100: 9.3,
    allergens: [],
    gramsPerPiece: 150,
  },
  {
    name: "Mayonnaise",
    synonyms: ["mayo"],
    kcal100: 680,
    protein100: 1.3,
    fat100: 75,
    carbs100: 2.7,
    allergens: ["egg", "mustard"],
    density_g_per_ml: 0.91,
  },
  {
    name: "Mozzarella cheese",
    synonyms: ["mozzarella"],
    kcal100: 280,
    protein100: 18,
    fat100: 22,
    carbs100: 2.2,
    allergens: ["milk"],
  },
  {
    name: "Halloumi cheese",
    synonyms: ["grilling cheese", "halloumi"],
    kcal100: 316,
    protein100: 21,
    fat100: 25,
    carbs100: 2,
    allergens: ["milk"],
  },
  {
    name: "Chorizo sausage",
    synonyms: ["Spanish chorizo", "chorizo"],
    kcal100: 455,
    protein100: 24,
    fat100: 38,
    carbs100: 2,
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
    name: "Dried oregano",
    synonyms: ["oregano", "dried oregano leaves"],
    kcal100: 265,
    protein100: 9,
    fat100: 4.3,
    carbs100: 69,
    allergens: [],
  },
  {
    name: "Caramelised onions",
    synonyms: ["caramelized onions", "sweet onions"],
    kcal100: 65,
    protein100: 1.2,
    fat100: 2,
    carbs100: 11,
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
  // Big Cheese ingredients
  {
    name: "Portuguese roll",
    synonyms: ["rustic roll", "crusty roll"],
    kcal100: 265,
    protein100: 8,
    fat100: 1.5,
    carbs100: 52,
    allergens: ["gluten"],
    gramsPerPiece: 80,
  },
  {
    name: "Avocado",
    synonyms: ["fresh avocado"],
    kcal100: 160,
    protein100: 2,
    fat100: 14.7,
    carbs100: 8.5,
    allergens: [],
    gramsPerPiece: 200,
  },
  {
    name: "Red bell pepper",
    synonyms: ["red pepper", "sweet red pepper"],
    kcal100: 31,
    protein100: 1,
    fat100: 0.3,
    carbs100: 6,
    allergens: [],
    gramsPerPiece: 150,
  },
  {
    name: "Fresh pineapple",
    synonyms: ["pineapple", "pineapple chunks"],
    kcal100: 50,
    protein100: 0.5,
    fat100: 0.1,
    carbs100: 13,
    allergens: [],
  },
  {
    name: "Fresh coriander",
    synonyms: ["cilantro", "coriander leaves"],
    kcal100: 23,
    protein100: 2.1,
    fat100: 0.5,
    carbs100: 3.7,
    allergens: [],
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
  // Sunset Burger ingredients
  {
    name: "Chicken thighs",
    synonyms: ["boneless chicken thighs", "skinless chicken thighs"],
    kcal100: 209,
    protein100: 18,
    fat100: 15,
    carbs100: 0,
    allergens: [],
  },
  {
    name: "Chicken breast",
    synonyms: ["boneless chicken breast", "skinless chicken breast"],
    kcal100: 165,
    protein100: 31,
    fat100: 3.6,
    carbs100: 0,
    allergens: [],
  },
  {
    name: "Red pepper chutney",
    synonyms: ["red pepper relish", "pepper chutney", "sweet chilli jam"],
    kcal100: 120,
    protein100: 1,
    fat100: 0.5,
    carbs100: 28,
    allergens: [],
  },
  {
    name: "Gem lettuce",
    synonyms: ["little gem lettuce", "baby lettuce", "sweet gem lettuce"],
    kcal100: 15,
    protein100: 1.4,
    fat100: 0.2,
    carbs100: 2.8,
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
  console.log("Checking for Nando's brand...\n");

  const existing = await client.fetch(
    `*[_type == "brand" && name == "Nando's"][0]`
  );

  if (existing) {
    console.log(`✅ Found existing brand: Nando's`);
    return existing._id;
  }

  console.log("➕ Creating Nando's brand...");
  const brand = await client.create({
    _type: "brand",
    name: "Nando's",
    slug: {
      _type: "slug",
      current: "nandos",
    },
    description: "South African-Portuguese flame-grilled chicken chain famous for its PERi-PERi sauces and bold flavors.",
  });

  console.log("✅ Brand created:", brand._id);
  return brand._id;
}

async function getCategories() {
  const mains = await client.fetch(`*[_type == "category" && name == "Mains"][0]`);
  const highProtein = await client.fetch(`*[_type == "category" && name == "High-Protein"][0]`);
  const spicy = await client.fetch(`*[_type == "category" && name == "Spicy"][0]`);
  const vegetarian = await client.fetch(`*[_type == "category" && name == "Vegetarian"][0]`);
  const snacks = await client.fetch(`*[_type == "category" && name == "Snacks"][0]`);

  return {
    mains: mains?._id,
    highProtein: highProtein?._id,
    spicy: spicy?._id,
    vegetarian: vegetarian?._id,
    snacks: snacks?._id,
  };
}

async function createRecipes() {
  console.log("🔥 Creating Nando's recipes...\n");

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

  // Recipe 1: PERi-Mac & Cheese
  console.log("Creating PERi-Mac & Cheese...\n");
  const periMacData = {
    _type: "recipe",
    title: "Nando's PERi-Mac & Cheese",
    slug: {
      _type: "slug",
      current: "nandos-peri-mac-and-cheese",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Creamy, spicy mac and cheese with Nando's signature PERi-PERi kick. A fiery twist on comfort food that's dangerously addictive.",
    servings: 4,
    prepMin: 10,
    cookMin: 25,
    introText:
      "Nando's PERi-Mac & Cheese takes the ultimate comfort food and gives it a fiery South African-Portuguese makeover. This isn't your average mac and cheese - it's loaded with creamy mature cheddar and Red Leicester, spiked with Nando's signature PERi-PERi sauce, and finished with a crispy golden topping. The result is a luscious, spicy, utterly addictive side dish that steals the show. Whether you're pairing it with flame-grilled chicken or enjoying it as a main event, this mac and cheese delivers big, bold flavor with that distinctive Nando's heat. Ready in just 35 minutes, it's comfort food with attitude.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Founded in Johannesburg in 1987, Nando's has become a global phenomenon, bringing the bold flavors of South African-Portuguese cuisine to millions. At the heart of their success is PERi-PERi sauce, made from African bird's eye chili peppers, creating a unique blend of heat, tang, and flavor that's become instantly recognizable.",
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
            text: "While Nando's is famous for flame-grilled chicken, their sides are legendary in their own right. The PERi-Mac & Cheese combines British comfort food with Nando's signature spice, creating a side dish so popular it often overshadows the main course. It's creamy, cheesy, spicy, and completely irresistible.",
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
            text: "This recipe recreates that restaurant magic at home, bringing Nando's iconic flavors to your kitchen. Adjust the heat level to your preference - from Lemon & Herb mild to Extra Extra Hot!",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Pasta",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Macaroni pasta"] },
            quantity: "400",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "1",
            unit: "tsp",
            notes: "for pasta water",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Cheese Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Unsalted butter"] },
            quantity: "50",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Plain flour"] },
            quantity: "50",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Whole milk"] },
            quantity: "500",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Double cream"] },
            quantity: "150",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Mature cheddar cheese"] },
            quantity: "200",
            unit: "g",
            notes: "grated",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Red Leicester cheese"] },
            quantity: "100",
            unit: "g",
            notes: "grated",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Peri-peri sauce"] },
            quantity: "60",
            unit: "ml",
            notes: "medium or hot, to taste",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Smoked paprika"] },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic powder"] },
            quantity: "0.5",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Topping",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Panko breadcrumbs"] },
            quantity: "50",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Mature cheddar cheese"] },
            quantity: "50",
            unit: "g",
            notes: "grated",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Unsalted butter"] },
            quantity: "20",
            unit: "g",
            notes: "melted",
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
              { _key: randomUUID(), _type: "span", text: "Preheat the oven to 200°C (180°C fan) and lightly grease a large baking dish." },
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
              { _key: randomUUID(), _type: "span", text: "Cook macaroni in salted boiling water for 2 minutes less than package instructions (it will continue cooking in the oven). Drain and set aside." },
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
              { _key: randomUUID(), _type: "span", text: "In a large saucepan, melt the butter over medium heat. Add flour and whisk continuously for 2 minutes to form a smooth roux." },
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
              { _key: randomUUID(), _type: "span", text: "Gradually add milk, whisking constantly to prevent lumps. Keep whisking until the sauce thickens, about 5-7 minutes." },
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
              { _key: randomUUID(), _type: "span", text: "Stir in the double cream, then remove from heat." },
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
              { _key: randomUUID(), _type: "span", text: "Add the grated cheddar and Red Leicester, stirring until completely melted and smooth." },
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
              { _key: randomUUID(), _type: "span", text: "Stir in the PERi-PERi sauce, smoked paprika, and garlic powder. Taste and adjust seasoning and heat level." },
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
              { _key: randomUUID(), _type: "span", text: "Add the cooked macaroni to the sauce and stir until every piece is coated. Transfer to the prepared baking dish." },
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
              { _key: randomUUID(), _type: "span", text: "Mix panko breadcrumbs with melted butter and grated cheese. Sprinkle evenly over the mac and cheese." },
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
              { _key: randomUUID(), _type: "span", text: "Bake for 20-25 minutes until golden and bubbling around the edges." },
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
              { _key: randomUUID(), _type: "span", text: "Let rest for 5 minutes before serving. Drizzle with extra PERi-PERi sauce if desired." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Start with medium PERi-PERi sauce and adjust to your heat preference - you can always add more!",
      "Don't overcook the pasta initially - it continues cooking in the oven and you want to avoid mushiness.",
      "Use freshly grated cheese for the smoothest sauce - pre-grated cheese contains anti-caking agents that can make the sauce grainy.",
      "Add leftover Nando's chicken on top before baking for an even more indulgent meal.",
      "Make it extra creamy by adding a spoonful of cream cheese to the sauce.",
      "For a vegetarian protein boost, stir through some cooked chickpeas or black beans.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        question: "Can I make this ahead of time?",
        answer:
          "Yes! Prepare the mac and cheese up to the point of baking, cover and refrigerate for up to 24 hours. Add the topping just before baking and increase cooking time by 5-10 minutes if baking from cold.",
      },
      {
        _key: randomUUID(),
        question: "How do I adjust the spice level?",
        answer:
          "Use Nando's Lemon & Herb or Mild sauce for less heat, Medium for balanced spice, Hot or Extra Hot for serious kick. You can also reduce the amount of sauce and add more cream for milder flavor.",
      },
      {
        _key: randomUUID(),
        question: "Can I freeze this mac and cheese?",
        answer:
          "Yes, freeze before baking for up to 3 months. Thaw overnight in the fridge, then bake as directed. The texture may be slightly different but it's still delicious.",
      },
      {
        _key: randomUUID(),
        question: "What can I serve this with?",
        answer:
          "This pairs perfectly with flame-grilled chicken, grilled vegetables, or a fresh green salad. It's also substantial enough to enjoy as a main dish on its own.",
      },
    ],
    nutrition: {
      calories: 685,
      protein: 28,
      fat: 38,
      carbs: 58,
    },
    seoTitle: "Nando's PERi-Mac & Cheese - Spicy Recipe",
    seoDescription:
      "Make Nando's famous PERi-Mac & Cheese at home! Creamy, cheesy pasta with signature PERi-PERi kick. Restaurant copycat ready in 35 minutes.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/nandos-peri-mac-and-cheese",
    categories: [
      ...(categories.mains ? [{ _type: "reference", _ref: categories.mains, _key: randomUUID() }] : []),
      ...(categories.spicy ? [{ _type: "reference", _ref: categories.spicy, _key: randomUUID() }] : []),
      ...(categories.vegetarian ? [{ _type: "reference", _ref: categories.vegetarian, _key: randomUUID() }] : []),
    ],
  };

  const existingPeriMac = await client.fetch(
    `*[_type == "recipe" && slug.current == "nandos-peri-mac-and-cheese"][0]`
  );

  if (existingPeriMac) {
    await client.patch(existingPeriMac._id).set(periMacData).commit();
    console.log("✅ PERi-Mac & Cheese updated");
  } else {
    await client.create(periMacData);
    console.log("✅ PERi-Mac & Cheese created");
  }

  // Recipe 2: Pastel de Nata
  console.log("\nCreating Pastel de Nata...\n");
  const pastelData = {
    _type: "recipe",
    title: "Nando's Pastel de Nata",
    slug: {
      _type: "slug",
      current: "nandos-pastel-de-nata",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Portuguese custard tarts with crispy puff pastry and creamy vanilla filling. A sweet taste of Portugal that's Nando's signature dessert.",
    servings: 12,
    prepMin: 20,
    cookMin: 20,
    introText:
      "Nando's Pastel de Nata are the perfect ending to any meal - crispy, flaky puff pastry cups filled with silky smooth custard, dusted with cinnamon. These Portuguese custard tarts originated in Lisbon's famous Belém district and have become beloved worldwide. Nando's version stays true to the original with its delicate balance of sweetness, rich vanilla flavor, and that essential caramelized top. The contrast between the shattering pastry and creamy custard is pure magic. While they might seem intimidating to make at home, this recipe simplifies the process without compromising on authentic flavor. Ready in 40 minutes, these tarts are best enjoyed warm from the oven with a sprinkle of cinnamon.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Nando's Portuguese heritage runs deep - the founders were inspired by a Johannesburg restaurant serving Portuguese flame-grilled chicken with PERi-PERi. This connection to Portuguese cuisine extends beyond savory dishes to include traditional Portuguese desserts, with Pastel de Nata being the crown jewel.",
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
            text: "The original Pastel de Nata recipe dates back to the 18th century, created by monks at Jerónimos Monastery in Belém, Lisbon. These custard tarts became so popular that they're now Portugal's most famous pastry, enjoyed around the world. Nando's version honors this heritage while making these delicate treats accessible in their restaurants.",
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
            text: "This recipe brings authentic Portuguese flavor to your kitchen, delivering that perfect combination of crispy pastry, creamy custard, and aromatic cinnamon that makes Pastel de Nata irresistible.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Pastry",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Puff pastry"] },
            quantity: "320",
            unit: "g",
            notes: "ready-rolled sheet",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Custard Filling",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Whole milk"] },
            quantity: "250",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Double cream"] },
            quantity: "100",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Caster sugar"] },
            quantity: "150",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Egg yolks"] },
            quantity: "5",
            unit: "piece",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Cornflour"] },
            quantity: "25",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Vanilla extract"] },
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Lemon zest"] },
            quantity: "1",
            unit: "tsp",
            notes: "finely grated",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Topping",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Ground cinnamon"] },
            quantity: "1",
            unit: "tsp",
            notes: "for dusting",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Caster sugar"] },
            quantity: "1",
            unit: "tbsp",
            notes: "for dusting (optional)",
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
              { _key: randomUUID(), _type: "span", text: "Preheat oven to 240°C (220°C fan). Grease a 12-hole muffin tin very well with butter." },
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
              { _key: randomUUID(), _type: "span", text: "Unroll the puff pastry and roll it up tightly from the short end into a log. Cut into 12 equal slices." },
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
              { _key: randomUUID(), _type: "span", text: "Place each slice flat on the work surface and roll out into a thin circle about 10cm diameter." },
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
              { _key: randomUUID(), _type: "span", text: "Press each pastry circle into a muffin hole, ensuring it comes up the sides. The pastry should overlap the rim slightly." },
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
              { _key: randomUUID(), _type: "span", text: "In a saucepan, whisk together milk, cream, and 100g of the sugar. Heat until just below boiling, stirring occasionally." },
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
              { _key: randomUUID(), _type: "span", text: "In a bowl, whisk egg yolks with remaining 50g sugar, cornflour, vanilla, and lemon zest until smooth and pale." },
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
              { _key: randomUUID(), _type: "span", text: "Slowly pour the hot milk mixture into the egg mixture, whisking constantly to prevent curdling." },
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
              { _key: randomUUID(), _type: "span", text: "Return the mixture to the saucepan and cook over medium heat, stirring constantly, until thickened (about 3-4 minutes). Don't let it boil." },
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
              { _key: randomUUID(), _type: "span", text: "Remove from heat and let cool for 5 minutes, stirring occasionally." },
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
              { _key: randomUUID(), _type: "span", text: "Divide the custard evenly between the pastry cases, filling them about 3/4 full." },
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
              { _key: randomUUID(), _type: "span", text: "Bake for 15-20 minutes until the pastry is golden and the custard has dark spots on top (this caramelization is traditional)." },
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
              { _key: randomUUID(), _type: "span", text: "Let cool in the tin for 5 minutes, then carefully transfer to a wire rack. Dust with cinnamon and sugar while still warm." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "The high oven temperature is essential for achieving the characteristic caramelized spots on top - don't reduce it!",
      "Make sure your muffin tin is very well greased to prevent sticking - butter works better than oil.",
      "Don't overfill the pastry cases - the custard will puff up during baking and can overflow.",
      "These are best served warm from the oven, but can be gently reheated at 180°C for 3-4 minutes.",
      "If your custard is too thick, whisk in a tablespoon of milk to loosen it before filling the cases.",
      "Store leftovers in an airtight container in the fridge for up to 2 days - the pastry won't be as crispy but they're still delicious.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        question: "Why do I need such a high oven temperature?",
        answer:
          "The very hot oven creates the characteristic caramelized spots on the custard and ensures the pastry puffs up properly while staying crispy. It's essential for authentic Pastel de Nata.",
      },
      {
        _key: randomUUID(),
        question: "Can I use shop-bought custard instead of making my own?",
        answer:
          "It's not recommended - shop-bought custard is too thick and won't have the right texture or flavor. The homemade custard is what makes these special and it's not difficult to make.",
      },
      {
        _key: randomUUID(),
        question: "My custard curdled when I added the hot milk. What went wrong?",
        answer:
          "The egg mixture needs to be whisked constantly while adding the hot milk slowly. If it still curdles, strain the custard through a fine sieve before filling the pastry cases.",
      },
      {
        _key: randomUUID(),
        question: "Can I make these in advance?",
        answer:
          "You can prepare the pastry cases and custard separately a few hours ahead, then assemble and bake when needed. They're definitely best served fresh and warm from the oven.",
      },
    ],
    nutrition: {
      calories: 195,
      protein: 3,
      fat: 11,
      carbs: 22,
    },
    seoTitle: "Nando's Pastel de Nata - Portuguese Custard Tarts",
    seoDescription:
      "Make Nando's famous Pastel de Nata at home! Authentic Portuguese custard tarts with flaky pastry and creamy vanilla filling. Ready in 40 minutes.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/nandos-pastel-de-nata",
    categories: [
      ...(categories.snacks ? [{ _type: "reference", _ref: categories.snacks, _key: randomUUID() }] : []),
    ],
  };

  const existingPastel = await client.fetch(
    `*[_type == "recipe" && slug.current == "nandos-pastel-de-nata"][0]`
  );

  if (existingPastel) {
    await client.patch(existingPastel._id).set(pastelData).commit();
    console.log("✅ Pastel de Nata updated");
  } else {
    await client.create(pastelData);
    console.log("✅ Pastel de Nata created");
  }

  // Recipe 3: The Big Cheese
  console.log("\nCreating The Big Cheese...\n");
  const bigCheeseData = {
    _type: "recipe",
    title: "Nando's The Big Cheese",
    slug: {
      _type: "slug",
      current: "nandos-big-cheese",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Grilled halloumi topped with our red pepper and pineapple salsa, sliced avocado and Churrasco PERinaise. Served in our rustic Portuguese roll.",
    servings: 1,
    prepMin: 10,
    cookMin: 10,
    introText:
      "Nando's The Big Cheese is a vegetarian delight that proves meat-free can be packed with flavor. This burger features thick slices of golden grilled halloumi cheese with that signature squeaky texture, topped with vibrant red pepper and pineapple salsa that adds sweetness and tang. Creamy sliced avocado and zesty Churrasco PERinaise complete this Portuguese-inspired creation, all served in a soft rustic roll. The combination of salty halloumi, sweet salsa, and rich avocado creates a satisfying meal that'll please vegetarians and meat-eaters alike. Ready in just 20 minutes, it's perfect for a quick lunch or dinner that doesn't compromise on taste.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Nando's commitment to bold flavors extends beyond their famous chicken to an impressive vegetarian menu. The Big Cheese showcases how Portuguese-inspired cuisine celebrates vegetables and cheese with the same passion as meat dishes. Halloumi, a traditional Cypriot cheese popular in Portuguese cuisine, takes center stage in this creation.",
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
            text: "The combination of grilled halloumi with sweet pineapple salsa reflects Nando's South African-Portuguese heritage - tropical fruits meeting Mediterranean cheese in perfect harmony. The Churrasco PERinaise adds that signature spicy kick that makes every Nando's dish memorable. It's proof that vegetarian food can be just as exciting and flavorful as any meat-based meal.",
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
            text: "This recipe brings Nando's vegetarian star to your home kitchen, complete with that irresistible squeaky halloumi, vibrant homemade salsa, and creamy avocado - all the elements that make The Big Cheese a fan favorite.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Halloumi",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Halloumi cheese"] },
            quantity: "200",
            unit: "g",
            notes: "cut into 4 thick slices",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Vegetable oil"] },
            quantity: "1",
            unit: "tsp",
            notes: "for grilling",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Red Pepper & Pineapple Salsa",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Red bell pepper"] },
            quantity: "0.5",
            unit: "piece",
            notes: "finely diced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fresh pineapple"] },
            quantity: "100",
            unit: "g",
            notes: "finely diced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fresh coriander"] },
            quantity: "2",
            unit: "tbsp",
            notes: "chopped",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Lime juice"] },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
            quantity: "0.25",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Churrasco PERinaise",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Mayonnaise"] },
            quantity: "3",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Peri-peri sauce"] },
            quantity: "1",
            unit: "tbsp",
            notes: "medium or hot",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Smoked paprika"] },
            quantity: "0.25",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Assembly",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Portuguese roll"] },
            quantity: "1",
            unit: "piece",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Avocado"] },
            quantity: "0.5",
            unit: "piece",
            notes: "sliced",
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
              { _key: randomUUID(), _type: "span", text: "Make the salsa first: In a bowl, combine diced red pepper, pineapple, chopped coriander, lime juice, and salt. Mix well and set aside to let flavors meld." },
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
              { _key: randomUUID(), _type: "span", text: "Make the Churrasco PERinaise: Mix mayonnaise with PERi-PERi sauce and smoked paprika. Stir until well combined and set aside." },
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
              { _key: randomUUID(), _type: "span", text: "Cut the halloumi into 4 thick slices (about 1cm thick each). Pat dry with paper towels to remove excess moisture." },
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
              { _key: randomUUID(), _type: "span", text: "Heat a griddle pan or non-stick frying pan over medium-high heat. Brush with a little oil." },
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
              { _key: randomUUID(), _type: "span", text: "Grill the halloumi slices for 2-3 minutes each side until golden brown with nice char marks. Don't move them too much - let them develop a crust." },
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
              { _key: randomUUID(), _type: "span", text: "While the halloumi is cooking, slice the Portuguese roll in half and lightly toast it cut-side down in the pan or under the grill." },
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
              { _key: randomUUID(), _type: "span", text: "Spread the Churrasco PERinaise generously on both halves of the toasted roll." },
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
              { _key: randomUUID(), _type: "span", text: "Layer the grilled halloumi slices on the bottom half of the roll." },
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
              { _key: randomUUID(), _type: "span", text: "Spoon the red pepper and pineapple salsa generously over the halloumi." },
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
              { _key: randomUUID(), _type: "span", text: "Top with sliced avocado, then place the top half of the roll on top. Serve immediately while the halloumi is still warm and squeaky." },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Pat the halloumi dry before grilling to achieve the best golden crust and prevent it from becoming rubbery.",
      "Don't overcook halloumi - it should be golden and squeaky, not hard and chewy. 2-3 minutes per side is perfect.",
      "Make the salsa ahead of time and refrigerate for 30 minutes to let the flavors develop.",
      "If you can't find fresh pineapple, use canned pineapple chunks - just drain them very well and pat dry.",
      "The salsa also works brilliantly with grilled chicken or fish, so make extra!",
      "For a spicier kick, add finely diced fresh chili to the salsa or use Nando's Hot PERi-PERi sauce in the mayo.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        question: "Can I use a different type of cheese?",
        answer:
          "Halloumi is essential for this recipe because of its unique ability to hold its shape when grilled and that signature squeaky texture. Other cheeses will melt completely. If you can't find halloumi, try paneer which has similar grilling properties.",
      },
      {
        _key: randomUUID(),
        question: "My halloumi went rubbery - what did I do wrong?",
        answer:
          "Halloumi can become rubbery if it's cooked too long or at too low a temperature. Use medium-high heat and cook for just 2-3 minutes per side until golden. Serve immediately while it's warm for the best texture.",
      },
      {
        _key: randomUUID(),
        question: "Is this recipe vegan-friendly?",
        answer:
          "Not as written - halloumi contains dairy and the PERinaise contains egg from the mayonnaise. However, you could substitute grilled vegetables or tofu for the halloumi and use vegan mayo to make it plant-based.",
      },
      {
        _key: randomUUID(),
        question: "Can I make the salsa in advance?",
        answer:
          "Yes! The salsa actually tastes better when made 30 minutes to 2 hours ahead as the flavors develop. Store it covered in the fridge. Just give it a stir before serving and drain any excess liquid.",
      },
    ],
    nutrition: {
      calories: 748,
      protein: 27.6,
      fat: 45.4,
      carbs: 60.6,
    },
    seoTitle: "Nando's The Big Cheese - Vegetarian Halloumi Burger",
    seoDescription:
      "Make Nando's The Big Cheese at home! Grilled halloumi with red pepper & pineapple salsa, avocado, and Churrasco PERinaise. Vegetarian perfection in 20 minutes.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/nandos-big-cheese",
    categories: [
      ...(categories.mains ? [{ _type: "reference", _ref: categories.mains, _key: randomUUID() }] : []),
      ...(categories.vegetarian ? [{ _type: "reference", _ref: categories.vegetarian, _key: randomUUID() }] : []),
    ],
  };

  const existingBigCheese = await client.fetch(
    `*[_type == "recipe" && (slug.current == "nandos-big-cheese" || slug.current == "nandos-big-cheese-burger")][0]`
  );

  if (existingBigCheese) {
    await client.patch(existingBigCheese._id).set(bigCheeseData).commit();
    console.log("✅ The Big Cheese updated");
  } else {
    await client.create(bigCheeseData);
    console.log("✅ The Big Cheese created");
  }

  // Recipe 4: Sunset Burger
  console.log("\nCreating Sunset Burger...\n");
  const sunsetBurgerData = {
    _type: "recipe",
    title: "Nando's Sunset Burger",
    slug: {
      _type: "slug",
      current: "nandos-sunset-burger",
    },
    brand: {
      _type: "reference",
      _ref: brandId,
    },
    description:
      "Two flame-grilled chicken thighs or a grilled chicken breast with melting cheddar cheese, smoky red pepper chutney, lettuce and Lemon & Herb mayo in our rustic Portuguese roll. It's messy.",
    servings: 1,
    prepMin: 35,
    cookMin: 15,
    introText:
      "Nando's Sunset Burger is a messy, magnificent celebration of flame-grilled chicken perfection. This burger features two succulent PERi-PERi marinated chicken thighs (or a whole chicken breast) topped with melted cheddar cheese, all nestled in a rustic Portuguese roll with crisp lettuce, sweet and smoky red pepper chutney, and creamy Lemon & Herb mayo. The combination of flame-grilled chicken with that sweet-spicy chutney creates something magical - it's comfort food with attitude. The name 'Sunset' captures the warm, vibrant flavors that make this burger a fan favorite. Fair warning: Nando's says 'It's messy' for a reason, so grab plenty of napkins! Ready in 50 minutes including marinating time, this is the ultimate chicken burger experience.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "The Sunset Burger showcases what Nando's does best - flame-grilled chicken with bold Portuguese-African flavors. While PERi-PERi chicken is their signature, this burger takes a different approach with Lemon & Herb marinade, proving that Nando's flavor range goes beyond just heat. The sweet red pepper chutney adds a sunset-inspired sweetness that perfectly complements the savory grilled chicken.",
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
            text: "Chicken thighs are the secret to this burger's juiciness - they stay moist and flavorful even when grilled to perfection. The melted cheddar adds richness, while the crisp lettuce provides essential freshness and crunch. It's a perfectly balanced burger that shows why Nando's chicken creations are legendary.",
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
            text: "This recipe brings Nando's Sunset Burger to your home kitchen, complete with marinating tips, grilling techniques, and that essential messiness that makes it so satisfying to eat.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Chicken",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken thighs"] },
            quantity: "2",
            unit: "piece",
            notes: "boneless and skinless (or 1 chicken breast)",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Peri-peri sauce"] },
            quantity: "20",
            unit: "g",
            notes: "Lemon & Herb marinade preferred",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Vegetable oil"] },
            quantity: "1",
            unit: "tsp",
            notes: "for cooking",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Toppings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Mature cheddar cheese"] },
            quantity: "1",
            unit: "slice",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Red pepper chutney"] },
            quantity: "1",
            unit: "tbsp",
            notes: "or sweet chilli jam",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Assembly",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Portuguese roll"] },
            quantity: "1",
            unit: "piece",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Mayonnaise"] },
            quantity: "1",
            unit: "tbsp",
            notes: "light mayo",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: { _type: "reference", _ref: ingredientIds["Gem lettuce"] },
            quantity: "1",
            unit: "leaf",
            notes: "or other crisp lettuce",
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
              { _key: randomUUID(), _type: "span", text: "Add the chicken thighs (or chicken breast) to a bowl. Add the PERi-PERi marinade and mix thoroughly to coat all sides. Cover the bowl and refrigerate for at least 30 minutes, or up to 4 hours for deeper flavor." },
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
              { _key: randomUUID(), _type: "span", text: "When ready to cook, spray or brush a frying pan or griddle with light cooking oil and place over medium heat." },
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
              { _key: randomUUID(), _type: "span", text: "Place the chicken thighs into the pan and cook for 5-6 minutes each side until fully cooked through (internal temperature should reach 75°C). If using a chicken breast, cook for 6-7 minutes per side." },
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
              { _key: randomUUID(), _type: "span", text: "Cut the cheese slice in half and place on top of the chicken pieces. If you have a lid for the frying pan, place it on to help the cheese melt. Once melted, remove the chicken and set aside." },
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
              { _key: randomUUID(), _type: "span", text: "Halve the Portuguese roll and place each half face down into the same pan to toast for 1-2 minutes, soaking up any flavorful juices left in the pan." },
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
              { _key: randomUUID(), _type: "span", text: "Build the burger: Spread mayo on the base of the toasted roll." },
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
              { _key: randomUUID(), _type: "span", text: "Add a lettuce leaf, then place both cheese-topped chicken pieces on top." },
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
              { _key: randomUUID(), _type: "span", text: "Spoon the red pepper chutney (or sweet chilli jam) generously over the chicken." },
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
              { _key: randomUUID(), _type: "span", text: "Top with the other half of the roll and press down gently. Serve immediately with plenty of napkins - it's meant to be messy!" },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Marinate the chicken for at least 30 minutes, but 2-4 hours is ideal for maximum flavor penetration.",
      "Chicken thighs stay juicier than breast meat - they're more forgiving and less likely to dry out when grilled.",
      "Don't move the chicken around while cooking - let it develop a nice caramelized crust on each side.",
      "Use a meat thermometer to check doneness - chicken should reach 75°C internal temperature.",
      "Toast the buns in the chicken pan to soak up all those delicious juices and marinade - this is key to authentic flavor!",
      "If you prefer less heat, Nando's Lemon & Herb marinade is mild and tangy. For more kick, use Medium or Hot PERi-PERi.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        question: "Can I use a whole chicken breast instead of thighs?",
        answer:
          "Absolutely! One medium chicken breast (about 150-200g) works perfectly. Just be careful not to overcook it - breast meat dries out faster than thighs. Cook to 75°C internal temperature.",
      },
      {
        _key: randomUUID(),
        question: "What if I don't have time to marinate?",
        answer:
          "While marinating gives better flavor, you can cook immediately if needed. Just brush extra marinade on while cooking and add a bit more when serving to boost the flavor.",
      },
      {
        _key: randomUUID(),
        question: "Can I grill this on a BBQ instead?",
        answer:
          "Yes! BBQ grilling adds amazing smoky flavor. Cook over medium heat for the same times, turning once. Make sure the grill is well-oiled to prevent sticking.",
      },
      {
        _key: randomUUID(),
        question: "What can I use instead of red pepper chutney?",
        answer:
          "Sweet chilli jam, pepper relish, or even mango chutney work well. You want something sweet and slightly tangy to balance the savory grilled chicken and creamy mayo.",
      },
    ],
    nutrition: {
      calories: 733,
      protein: 53.4,
      fat: 30.4,
      carbs: 60.8,
    },
    seoTitle: "Nando's Sunset Burger - Grilled Chicken Recipe",
    seoDescription:
      "Make Nando's Sunset Burger at home! Flame-grilled chicken thighs with melted cheese, red pepper chutney & Lemon & Herb mayo. Ready in 50 minutes.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/nandos-sunset-burger",
    categories: [
      ...(categories.mains ? [{ _type: "reference", _ref: categories.mains, _key: randomUUID() }] : []),
      ...(categories.highProtein ? [{ _type: "reference", _ref: categories.highProtein, _key: randomUUID() }] : []),
    ],
  };

  const existingSunset = await client.fetch(
    `*[_type == "recipe" && slug.current == "nandos-sunset-burger"][0]`
  );

  if (existingSunset) {
    await client.patch(existingSunset._id).set(sunsetBurgerData).commit();
    console.log("✅ Sunset Burger updated");
  } else {
    await client.create(sunsetBurgerData);
    console.log("✅ Sunset Burger created");
  }

  console.log("\n🔥 All Nando's recipes created successfully!");
  console.log("📝 All recipes include:");
  console.log("  - Complete ingredient references with nutrition & allergens");
  console.log("  - Detailed step-by-step instructions");
  console.log("  - 4-6 tips & variations");
  console.log("  - 4 FAQs per recipe");
  console.log("  - Full nutrition info per serving");
  console.log("  - SEO-optimized titles & descriptions");
  console.log("  - Canonical URLs");
  console.log("  - Proper category assignments");
  console.log("\nNote: You'll need to add hero images in Sanity Studio for each recipe.");
}

createRecipes().catch(console.error);
