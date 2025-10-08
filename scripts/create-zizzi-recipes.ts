// scripts/create-zizzi-recipes.ts
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

// Category IDs from existing categories
const CATEGORIES = {
  mains: "a75059bf-6a51-45a7-932c-228c9c8765a1",
  highProtein: "1a43cb40-4025-4cd5-a788-5442eb2af5f5",
  spicy: "dbbb051c-6610-4f42-8959-cbe7da379cfa",
  vegetarian: "f42c344d-2114-4e20-9331-ba0a99eda367",
};

// All ingredients for Zizzi recipes
const allIngredients = [
  // Beef & Venison Stufato ingredients
  {
    name: "Beef brisket",
    synonyms: ["brisket", "beef brisket joint"],
    kcal100: 215,
    protein100: 18,
    fat100: 16,
    carbs100: 0,
    allergens: [],
  },
  {
    name: "Venison",
    synonyms: ["venison meat", "deer meat"],
    kcal100: 120,
    protein100: 22,
    fat100: 3,
    carbs100: 0,
    allergens: [],
  },
  {
    name: "Red wine",
    synonyms: ["cooking red wine"],
    kcal100: 85,
    protein100: 0.1,
    fat100: 0,
    carbs100: 2.6,
    allergens: ["sulphites"],
    density_g_per_ml: 0.99,
  },
  {
    name: "Beef stock",
    synonyms: ["beef broth"],
    kcal100: 5,
    protein100: 0.5,
    fat100: 0.2,
    carbs100: 0.5,
    allergens: ["celery"],
    density_g_per_ml: 1.0,
  },
  {
    name: "Tinned chopped tomatoes",
    synonyms: ["canned tomatoes", "chopped tomatoes"],
    kcal100: 32,
    protein100: 1.6,
    fat100: 0.3,
    carbs100: 7,
    allergens: [],
    density_g_per_ml: 1.0,
  },
  {
    name: "Carrot",
    synonyms: ["carrots"],
    kcal100: 41,
    protein100: 0.9,
    fat100: 0.2,
    carbs100: 10,
    allergens: [],
    gramsPerPiece: 60,
  },
  {
    name: "Celery",
    synonyms: ["celery stalks"],
    kcal100: 16,
    protein100: 0.7,
    fat100: 0.2,
    carbs100: 3,
    allergens: ["celery"],
    gramsPerPiece: 40,
  },
  {
    name: "Bay leaves",
    synonyms: ["dried bay leaves"],
    kcal100: 313,
    protein100: 7.6,
    fat100: 8.4,
    carbs100: 75,
    allergens: [],
  },
  {
    name: "Fresh thyme",
    synonyms: ["thyme sprigs"],
    kcal100: 101,
    protein100: 5.6,
    fat100: 1.7,
    carbs100: 24,
    allergens: [],
  },
  {
    name: "Fresh rosemary",
    synonyms: ["rosemary sprigs"],
    kcal100: 131,
    protein100: 3.3,
    fat100: 5.9,
    carbs100: 20,
    allergens: [],
  },
  {
    name: "Polenta",
    synonyms: ["cornmeal", "fine polenta"],
    kcal100: 362,
    protein100: 7.6,
    fat100: 2.4,
    carbs100: 79,
    allergens: [],
  },
  {
    name: "Whole milk",
    synonyms: ["full fat milk", "full-fat milk"],
    kcal100: 61,
    protein100: 3.2,
    fat100: 3.3,
    carbs100: 4.8,
    allergens: ["milk"],
    density_g_per_ml: 1.03,
  },
  {
    name: "Parmesan",
    synonyms: ["Parmigiano-Reggiano", "parmesan cheese"],
    kcal100: 431,
    protein100: 38,
    fat100: 29,
    carbs100: 4.1,
    allergens: ["milk"],
  },
  // Chicken Milanese ingredients
  {
    name: "Chicken breast",
    synonyms: ["chicken breast fillets", "skinless chicken breast"],
    kcal100: 165,
    protein100: 31,
    fat100: 3.6,
    carbs100: 0,
    allergens: [],
  },
  {
    name: "Plain flour",
    synonyms: ["all-purpose flour", "wheat flour"],
    kcal100: 364,
    protein100: 10,
    fat100: 1.2,
    carbs100: 76,
    allergens: ["gluten"],
  },
  {
    name: "Eggs",
    synonyms: ["large eggs", "hen eggs"],
    kcal100: 155,
    protein100: 13,
    fat100: 11,
    carbs100: 1.1,
    allergens: ["eggs"],
    gramsPerPiece: 50,
  },
  {
    name: "Panko breadcrumbs",
    synonyms: ["Japanese breadcrumbs", "panko"],
    kcal100: 360,
    protein100: 12,
    fat100: 2.5,
    carbs100: 72,
    allergens: ["gluten"],
  },
  {
    name: "Rocket",
    synonyms: ["arugula", "rocket leaves"],
    kcal100: 25,
    protein100: 2.6,
    fat100: 0.7,
    carbs100: 3.7,
    allergens: [],
  },
  {
    name: "Cherry tomatoes",
    synonyms: ["cherry tomatoes on the vine"],
    kcal100: 18,
    protein100: 0.9,
    fat100: 0.2,
    carbs100: 3.9,
    allergens: [],
    gramsPerPiece: 15,
  },
  {
    name: "Lemon",
    synonyms: ["fresh lemon"],
    kcal100: 29,
    protein100: 1.1,
    fat100: 0.3,
    carbs100: 9,
    allergens: [],
    gramsPerPiece: 58,
  },
  // Chicken Calabrese ingredients
  {
    name: "Nduja",
    synonyms: ["nduja paste", "spicy Italian sausage paste"],
    kcal100: 450,
    protein100: 15,
    fat100: 42,
    carbs100: 2,
    allergens: [],
  },
  {
    name: "Mascarpone",
    synonyms: ["mascarpone cheese"],
    kcal100: 429,
    protein100: 4.8,
    fat100: 44,
    carbs100: 4.8,
    allergens: ["milk"],
  },
  {
    name: "Baby spinach",
    synonyms: ["spinach leaves", "fresh spinach"],
    kcal100: 23,
    protein100: 2.9,
    fat100: 0.4,
    carbs100: 3.6,
    allergens: [],
  },
  {
    name: "Penne pasta",
    synonyms: ["penne", "dried penne"],
    kcal100: 352,
    protein100: 12,
    fat100: 1.5,
    carbs100: 71,
    allergens: ["gluten"],
  },
  // Sea Bass ingredients
  {
    name: "Sea bass fillets",
    synonyms: ["sea bass", "fresh sea bass"],
    kcal100: 97,
    protein100: 18,
    fat100: 2.5,
    carbs100: 0,
    allergens: ["fish"],
  },
  {
    name: "Capers",
    synonyms: ["capers in brine"],
    kcal100: 23,
    protein100: 2.4,
    fat100: 0.9,
    carbs100: 4.9,
    allergens: [],
  },
  {
    name: "Black olives",
    synonyms: ["pitted black olives"],
    kcal100: 115,
    protein100: 0.8,
    fat100: 11,
    carbs100: 6,
    allergens: [],
  },
  {
    name: "White wine",
    synonyms: ["dry white wine", "cooking white wine"],
    kcal100: 82,
    protein100: 0.1,
    fat100: 0,
    carbs100: 2.6,
    allergens: ["sulphites"],
    density_g_per_ml: 0.99,
  },
  {
    name: "Fresh parsley",
    synonyms: ["parsley", "flat-leaf parsley"],
    kcal100: 36,
    protein100: 3,
    fat100: 0.8,
    carbs100: 6.3,
    allergens: [],
  },
  // Salmon & Pesto Risotto ingredients
  {
    name: "Salmon fillets",
    synonyms: ["fresh salmon", "salmon fillet"],
    kcal100: 208,
    protein100: 20,
    fat100: 13,
    carbs100: 0,
    allergens: ["fish"],
  },
  {
    name: "Arborio rice",
    synonyms: ["risotto rice"],
    kcal100: 349,
    protein100: 6.5,
    fat100: 0.6,
    carbs100: 77,
    allergens: [],
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
    name: "Fresh basil",
    synonyms: ["basil leaves"],
    kcal100: 23,
    protein100: 3.2,
    fat100: 0.6,
    carbs100: 2.7,
    allergens: [],
  },
  {
    name: "Pine nuts",
    synonyms: ["pine kernels"],
    kcal100: 673,
    protein100: 14,
    fat100: 68,
    carbs100: 13,
    allergens: ["nuts"],
  },
  {
    name: "White onion",
    synonyms: ["onion", "white cooking onion"],
    kcal100: 40,
    protein100: 1.1,
    fat100: 0.1,
    carbs100: 9.3,
    allergens: [],
    gramsPerPiece: 150,
  },
  {
    name: "Double cream",
    synonyms: ["heavy cream", "whipping cream"],
    kcal100: 449,
    protein100: 1.7,
    fat100: 48,
    carbs100: 2.7,
    allergens: ["milk"],
    density_g_per_ml: 1.01,
  },
  // Mushroom Risotto ingredients
  {
    name: "Chestnut mushrooms",
    synonyms: ["cremini mushrooms", "baby bella mushrooms"],
    kcal100: 22,
    protein100: 3.1,
    fat100: 0.3,
    carbs100: 3.3,
    allergens: [],
  },
  {
    name: "Porcini mushrooms",
    synonyms: ["dried porcini", "dried porcini mushrooms"],
    kcal100: 370,
    protein100: 30,
    fat100: 3,
    carbs100: 60,
    allergens: [],
  },
  {
    name: "Truffle oil",
    synonyms: ["white truffle oil"],
    kcal100: 884,
    protein100: 0,
    fat100: 100,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 0.92,
  },
  // Calzone ingredients
  {
    name: "Pizza dough",
    synonyms: ["fresh pizza dough", "pizza base dough"],
    kcal100: 266,
    protein100: 9,
    fat100: 3.5,
    carbs100: 49,
    allergens: ["gluten"],
  },
  {
    name: "Mozzarella",
    synonyms: ["mozzarella cheese", "fresh mozzarella"],
    kcal100: 280,
    protein100: 18,
    fat100: 22,
    carbs100: 3.1,
    allergens: ["milk"],
  },
  {
    name: "Passata",
    synonyms: ["tomato passata", "sieved tomatoes"],
    kcal100: 35,
    protein100: 1.4,
    fat100: 0.3,
    carbs100: 7.5,
    allergens: [],
    density_g_per_ml: 1.0,
  },
  {
    name: "Pepperoni",
    synonyms: ["pepperoni slices"],
    kcal100: 504,
    protein100: 23,
    fat100: 45,
    carbs100: 1,
    allergens: [],
  },
  {
    name: "Italian sausage",
    synonyms: ["Italian pork sausage", "Italian sausage meat"],
    kcal100: 346,
    protein100: 13,
    fat100: 32,
    carbs100: 2,
    allergens: [],
  },
  {
    name: "Dried oregano",
    synonyms: ["oregano"],
    kcal100: 265,
    protein100: 9,
    fat100: 4.3,
    carbs100: 69,
    allergens: [],
  },
  {
    name: "Red chilli flakes",
    synonyms: ["crushed red pepper", "chilli flakes"],
    kcal100: 318,
    protein100: 12,
    fat100: 17,
    carbs100: 57,
    allergens: [],
  },
  {
    name: "Ricotta",
    synonyms: ["ricotta cheese"],
    kcal100: 174,
    protein100: 11,
    fat100: 13,
    carbs100: 3.0,
    allergens: ["milk"],
  },
  // Common ingredients
  {
    name: "Olive oil",
    synonyms: ["extra virgin olive oil"],
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
    name: "Fine sea salt",
    synonyms: ["sea salt", "table salt"],
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
  },
  {
    name: "Black pepper",
    synonyms: ["ground black pepper"],
    kcal100: 251,
    protein100: 10,
    fat100: 3.3,
    carbs100: 64,
    allergens: [],
  },
  {
    name: "Unsalted butter",
    synonyms: ["butter"],
    kcal100: 717,
    protein100: 0.9,
    fat100: 81,
    carbs100: 0.1,
    allergens: ["milk"],
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
  console.log("Checking for Zizzi brand...\n");

  const existing = await client.fetch(
    `*[_type == "brand" && name == "Zizzi"][0]`
  );

  if (existing) {
    console.log(`✅ Found existing brand: Zizzi`);
    return existing._id;
  }

  console.log("➕ Creating Zizzi brand...");
  const brand = await client.create({
    _type: "brand",
    name: "Zizzi",
    slug: {
      _type: "slug",
      current: "zizzi",
    },
    description: "Italian restaurant chain serving authentic pizza, pasta, and Italian classics with a modern twist.",
  });

  console.log("✅ Brand created:", brand._id);
  return brand._id;
}

async function createDraftRecipe(recipeData: any, slug: string, title: string) {
  const existing = await client.fetch(
    `*[_type == "recipe" && slug.current == $slug][0]`,
    { slug }
  );

  if (existing) {
    await client.patch(existing._id).set(recipeData).commit();
    console.log(`✅ ${title} updated`);
  } else {
    const created = await client.create(recipeData);
    console.log(`✅ ${title} created as draft`);
    // Convert to draft
    await client.create({ ...recipeData, _id: `drafts.${created._id}` });
    await client.delete(created._id);
  }
}

async function createRecipes() {
  console.log("🍝 Creating Zizzi recipes...\n");

  const brandId = await createOrGetBrand();

  console.log("\nCreating ingredients...\n");
  const ingredientIds: { [key: string]: string } = {};

  for (const ing of allIngredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");

  // Recipe 1: Beef Brisket & Venison Stufato
  console.log("Creating Recipe 1/8: Beef Brisket & Venison Stufato...\n");
  await createDraftRecipe(
    {
      _type: "recipe",
      title: "Zizzi Beef Brisket & Venison Stufato",
      slug: {
        _type: "slug",
        current: "zizzi-beef-brisket-venison-stufato",
      },
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      categories: [
        { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
        { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
      ],
      description:
        "Rich, slow-cooked Italian stew with tender beef brisket and venison in red wine sauce. Served over creamy polenta for ultimate comfort.",
      servings: 6,
      prepMin: 30,
      cookMin: 180,
      introText:
        "Zizzi's Beef Brisket & Venison Stufato is the ultimate Italian comfort food - a rich, hearty stew that's been slow-cooked to perfection. This luxurious dish combines tender beef brisket with lean venison in a deep red wine sauce infused with aromatic herbs and vegetables. The meat becomes melt-in-your-mouth tender after hours of gentle simmering, creating a sauce so flavourful it's worth every minute of patience. Served over creamy, cheesy polenta that soaks up all those incredible juices, this is the kind of meal that warms you from the inside out. Perfect for Sunday dinners or special occasions when you want restaurant-quality Italian cooking at home.",
      brandContext: [
        {
          _key: randomUUID(),
          _type: "block",
          children: [
            {
              _key: randomUUID(),
              _type: "span",
              text: "Founded in 1999, Zizzi has grown from a single restaurant in Chiswick to become one of the UK's most loved Italian restaurant chains. With over 130 locations, Zizzi is known for bringing authentic Italian flavours to British high streets, using quality ingredients and traditional cooking methods.",
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
              text: "Their menu celebrates regional Italian cooking, from Roman-style pizzas to hearty northern Italian stews. The Beef Brisket & Venison Stufato showcases their commitment to premium ingredients and time-honoured techniques - a slow-cooked masterpiece that takes inspiration from traditional Italian hunting stews.",
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
              text: "This recipe recreates Zizzi's signature stufato at home, capturing that restaurant-quality depth of flavour through patient slow cooking and the right balance of herbs, wine, and tender meat.",
            },
          ],
          style: "normal",
        },
      ],
      ingredients: [
        {
          _key: randomUUID(),
          _type: "ingredientGroup",
          groupName: "Stufato",
          items: [
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Beef brisket"] },
              quantity: "600",
              unit: "g",
              notes: "cut into chunks",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Venison"] },
              quantity: "400",
              unit: "g",
              notes: "cut into chunks",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Olive oil"] },
              quantity: "3",
              unit: "tbsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["White onion"] },
              quantity: "2",
              unit: "piece",
              notes: "diced",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Carrot"] },
              quantity: "2",
              unit: "piece",
              notes: "diced",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Celery"] },
              quantity: "2",
              unit: "piece",
              notes: "diced",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic"] },
              quantity: "4",
              unit: "clove",
              notes: "crushed",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Red wine"] },
              quantity: "500",
              unit: "ml",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Beef stock"] },
              quantity: "500",
              unit: "ml",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Tinned chopped tomatoes"] },
              quantity: "400",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fresh thyme"] },
              quantity: "4",
              unit: "sprig",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fresh rosemary"] },
              quantity: "2",
              unit: "sprig",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Bay leaves"] },
              quantity: "2",
              unit: "piece",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
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
          ],
        },
        {
          _key: randomUUID(),
          _type: "ingredientGroup",
          groupName: "Polenta",
          items: [
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Polenta"] },
              quantity: "300",
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
              ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken stock"] },
              quantity: "500",
              unit: "ml",
            },
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
              ingredientRef: { _type: "reference", _ref: ingredientIds["Parmesan"] },
              quantity: "50",
              unit: "g",
              notes: "grated",
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
                { _key: randomUUID(), _type: "span", text: "Pat the meat dry with kitchen paper and season generously with salt and pepper." },
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
                { _key: randomUUID(), _type: "span", text: "Heat 2 tbsp olive oil in a large casserole dish over high heat." },
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
                { _key: randomUUID(), _type: "span", text: "Brown the meat in batches until caramelized all over, about 8-10 minutes total. Remove and set aside." },
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
                { _key: randomUUID(), _type: "span", text: "Add remaining oil to the pot. Cook onions, carrots, and celery for 8 minutes until softened." },
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
                { _key: randomUUID(), _type: "span", text: "Add garlic and cook for 1 minute until fragrant." },
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
                { _key: randomUUID(), _type: "span", text: "Pour in red wine and bring to a boil, scraping up any browned bits from the bottom." },
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
                { _key: randomUUID(), _type: "span", text: "Add stock, tomatoes, herbs, and browned meat. Bring to a simmer." },
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
                { _key: randomUUID(), _type: "span", text: "Cover and transfer to oven at 150°C (130°C fan) for 3 hours until meat is tender." },
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
                { _key: randomUUID(), _type: "span", text: "30 minutes before serving, make polenta. Bring milk and stock to a boil." },
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
                { _key: randomUUID(), _type: "span", text: "Gradually whisk in polenta. Cook, stirring constantly, for 20 minutes until thick." },
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
                { _key: randomUUID(), _type: "span", text: "Stir butter and parmesan into polenta. Season to taste." },
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
                { _key: randomUUID(), _type: "span", text: "Serve stufato over creamy polenta with extra parmesan on top." },
              ],
              style: "normal",
            },
          ],
        },
      ],
      tips: [
        "The key to tender meat is low, slow cooking - don't rush this step.",
        "Use a good quality red wine you'd drink - it makes a huge difference to the flavor.",
        "Make this a day ahead - the flavors develop beautifully overnight.",
        "Stir polenta constantly to prevent lumps and sticking.",
        "If the stew looks dry during cooking, add a splash more stock.",
      ],
      faqs: [
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I use just beef or just venison?",
          answer:
            "Yes! Use 1kg of either meat. The combination adds complexity, but using one type still creates a delicious stew.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I make this in a slow cooker?",
          answer:
            "Absolutely! Brown the meat and sauté vegetables first, then transfer everything to a slow cooker for 6-8 hours on low.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "What can I serve instead of polenta?",
          answer:
            "Creamy mashed potatoes, soft polenta, or even pappardelle pasta all work brilliantly with this rich stew.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I freeze the stufato?",
          answer:
            "Yes! It freezes beautifully for up to 3 months. Defrost overnight in the fridge and reheat gently on the stove.",
        },
      ],
      nutrition: {
        calories: 685,
        protein: 52,
        fat: 28,
        carbs: 48,
      },
      seoTitle: "Zizzi Beef & Venison Stufato - Italian Stew Recipe",
      seoDescription:
        "Make Zizzi's beef brisket & venison stufato! Rich Italian stew slow-cooked in red wine, served over creamy polenta. Restaurant-quality comfort food.",
    },
    "zizzi-beef-brisket-venison-stufato",
    "Beef Brisket & Venison Stufato"
  );

  // Recipe 2: Chicken Milanese
  console.log("Creating Recipe 2/8: Chicken Milanese...\n");
  await createDraftRecipe(
    {
      _type: "recipe",
      title: "Zizzi Chicken Milanese",
      slug: {
        _type: "slug",
        current: "zizzi-chicken-milanese",
      },
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      categories: [
        { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
        { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
      ],
      description:
        "Crispy breaded chicken breast topped with fresh rocket, cherry tomatoes, and parmesan. A classic Italian favorite with perfect golden crunch.",
      servings: 4,
      prepMin: 20,
      cookMin: 15,
      introText:
        "Zizzi's Chicken Milanese brings the flavors of Milan straight to your table. This iconic Italian dish features tender chicken breast coated in crispy golden panko breadcrumbs, then topped with a vibrant salad of peppery rocket, sweet cherry tomatoes, and shaved parmesan. The contrast between the hot, crunchy chicken and the cool, fresh salad is absolutely divine. A squeeze of lemon brings everything together with bright acidity. It's the kind of dish that feels light yet satisfying, elegant yet comforting. Perfect for weeknight dinners or when you want to impress guests without spending hours in the kitchen.",
      brandContext: [
        {
          _key: randomUUID(),
          _type: "block",
          children: [
            {
              _key: randomUUID(),
              _type: "span",
              text: "Zizzi has been serving authentic Italian cuisine across the UK since 1999, bringing the flavors of Italy's regional dishes to British diners. Their menu features classic Italian favorites alongside creative modern interpretations.",
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
              text: "The Chicken Milanese is one of Zizzi's most popular dishes, showcasing their commitment to quality ingredients and traditional Italian cooking techniques. This recipe recreates the restaurant's perfectly crispy chicken with its signature fresh topping.",
            },
          ],
          style: "normal",
        },
      ],
      ingredients: [
        {
          _key: randomUUID(),
          _type: "ingredientGroup",
          groupName: "Chicken",
          items: [
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken breast"] },
              quantity: "4",
              unit: "piece",
              notes: "butterflied",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Plain flour"] },
              quantity: "100",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Eggs"] },
              quantity: "2",
              unit: "piece",
              notes: "beaten",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Panko breadcrumbs"] },
              quantity: "200",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
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
              ingredientRef: { _type: "reference", _ref: ingredientIds["Olive oil"] },
              quantity: "4",
              unit: "tbsp",
            },
          ],
        },
        {
          _key: randomUUID(),
          _type: "ingredientGroup",
          groupName: "Salad Topping",
          items: [
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Rocket"] },
              quantity: "100",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Cherry tomatoes"] },
              quantity: "200",
              unit: "g",
              notes: "halved",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Parmesan"] },
              quantity: "50",
              unit: "g",
              notes: "shaved",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Lemon"] },
              quantity: "1",
              unit: "piece",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Olive oil"] },
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
                { _key: randomUUID(), _type: "span", text: "Place chicken breasts between cling film and pound to about 1cm thickness." },
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
                { _key: randomUUID(), _type: "span", text: "Set up three shallow bowls: flour in first, beaten eggs in second, panko in third." },
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
                { _key: randomUUID(), _type: "span", text: "Season chicken with salt and pepper. Dredge in flour, dip in egg, then coat in panko." },
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
                { _key: randomUUID(), _type: "span", text: "Heat olive oil in a large frying pan over medium-high heat." },
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
                { _key: randomUUID(), _type: "span", text: "Fry chicken for 4-5 minutes per side until golden and cooked through." },
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
                { _key: randomUUID(), _type: "span", text: "While chicken cooks, toss rocket and tomatoes with olive oil and lemon juice." },
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
                { _key: randomUUID(), _type: "span", text: "Transfer chicken to plates and immediately top with dressed salad." },
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
                { _key: randomUUID(), _type: "span", text: "Scatter parmesan shavings over the top and serve with lemon wedges." },
              ],
              style: "normal",
            },
          ],
        },
      ],
      tips: [
        "Pound chicken evenly for consistent cooking throughout.",
        "Don't skip the flour-egg-breadcrumb sequence - it creates the best coating.",
        "Keep oil at medium-high heat for crispy, not greasy, chicken.",
        "Add the salad just before serving so it doesn't wilt.",
        "Use fresh lemon juice - bottled just won't taste the same.",
      ],
      faqs: [
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I bake instead of fry?",
          answer:
            "Yes! Bake at 200°C for 20-25 minutes, flipping halfway. Spray with oil for extra crispiness.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "How do I know when chicken is cooked?",
          answer:
            "Internal temperature should reach 75°C. Juices should run clear when pierced.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I prep the chicken ahead?",
          answer:
            "Yes! Bread the chicken up to 4 hours ahead and refrigerate. Cook just before serving.",
        },
      ],
      nutrition: {
        calories: 520,
        protein: 48,
        fat: 22,
        carbs: 32,
      },
      seoTitle: "Zizzi Chicken Milanese - Crispy Breaded Chicken Recipe",
      seoDescription:
        "Recreate Zizzi's famous Chicken Milanese at home! Crispy breaded chicken with rocket, tomatoes & parmesan. Ready in 35 minutes.",
    },
    "zizzi-chicken-milanese",
    "Chicken Milanese"
  );

  // Recipe 3: Chicken Calabrese
  console.log("Creating Recipe 3/8: Chicken Calabrese...\n");
  await createDraftRecipe(
    {
      _type: "recipe",
      title: "Zizzi Chicken Calabrese",
      slug: {
        _type: "slug",
        current: "zizzi-chicken-calabrese",
      },
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      categories: [
        { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
        { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
        { _type: "reference", _ref: CATEGORIES.spicy, _key: randomUUID() },
      ],
      description:
        "Spicy penne pasta with chicken, fiery nduja, and creamy mascarpone. A rich, indulgent dish with the perfect kick of Calabrian heat.",
      servings: 4,
      prepMin: 15,
      cookMin: 25,
      introText:
        "Zizzi's Chicken Calabrese is a celebration of bold Calabrian flavors - the kind of pasta dish that makes you close your eyes after the first bite. Succulent chicken pieces mingle with spicy nduja sausage paste, creating a rich, fiery sauce that's beautifully balanced by silky mascarpone cheese. Fresh spinach wilts into the mix, adding color and freshness to this indulgent pasta. The heat from the nduja builds gradually, warming you from the inside without overwhelming your palate. It's comfort food with a serious kick, perfect for spice lovers who appreciate a creamy, well-rounded pasta dish. This is the kind of meal that turns a regular Tuesday into something special.",
      brandContext: [
        {
          _key: randomUUID(),
          _type: "block",
          children: [
            {
              _key: randomUUID(),
              _type: "span",
              text: "Zizzi's menu takes inspiration from Italy's diverse regional cuisines, bringing authentic flavors from all corners of the country to British tables. The Chicken Calabrese pays homage to Calabria, the toe of Italy's boot, famous for its spicy, robust cuisine.",
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
              text: "Nduja, the star ingredient, is a spreadable Calabrian salami with a fiery kick that's become incredibly popular in Italian restaurants worldwide. This recipe recreates Zizzi's perfect balance of heat, creaminess, and comfort.",
            },
          ],
          style: "normal",
        },
      ],
      ingredients: [
        {
          _key: randomUUID(),
          _type: "ingredientGroup",
          groupName: "Main",
          items: [
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Penne pasta"] },
              quantity: "400",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken breast"] },
              quantity: "500",
              unit: "g",
              notes: "diced",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Nduja"] },
              quantity: "100",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Mascarpone"] },
              quantity: "200",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Baby spinach"] },
              quantity: "150",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic"] },
              quantity: "3",
              unit: "clove",
              notes: "minced",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Olive oil"] },
              quantity: "2",
              unit: "tbsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Parmesan"] },
              quantity: "50",
              unit: "g",
              notes: "grated, to serve",
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
          _type: "object",
          step: [
            {
              _key: randomUUID(),
              _type: "block",
              children: [
                { _key: randomUUID(), _type: "span", text: "Cook penne in salted boiling water according to package directions. Reserve 1 cup pasta water." },
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
                { _key: randomUUID(), _type: "span", text: "Heat olive oil in a large frying pan over medium-high heat." },
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
                { _key: randomUUID(), _type: "span", text: "Season chicken with salt. Cook for 6-7 minutes until golden and cooked through. Remove and set aside." },
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
                { _key: randomUUID(), _type: "span", text: "In the same pan, add nduja and garlic. Cook for 2 minutes, breaking up the nduja." },
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
                { _key: randomUUID(), _type: "span", text: "Add mascarpone and 1/2 cup pasta water. Stir until smooth and creamy." },
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
                { _key: randomUUID(), _type: "span", text: "Return chicken to pan. Add spinach and cook until wilted, about 2 minutes." },
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
                { _key: randomUUID(), _type: "span", text: "Drain pasta and add to sauce. Toss well, adding more pasta water if needed for consistency." },
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
                { _key: randomUUID(), _type: "span", text: "Serve immediately with grated parmesan on top." },
              ],
              style: "normal",
            },
          ],
        },
      ],
      tips: [
        "Don't skip reserving pasta water - it helps create a silky sauce.",
        "Adjust nduja amount based on your spice tolerance.",
        "Cook chicken in a single layer for best browning.",
        "Add spinach at the end so it stays bright green.",
        "Use fresh parmesan for the best flavor.",
      ],
      faqs: [
        {
          _key: randomUUID(),
          _type: "object",
          question: "What if I can't find nduja?",
          answer:
            "Use spicy Italian sausage with chili flakes. It won't be exactly the same but will still be delicious and spicy.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I make this less spicy?",
          answer:
            "Reduce nduja to 50g and add more mascarpone to balance the heat.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "What pasta shapes work best?",
          answer:
            "Penne, rigatoni, or fusilli all work great - anything that holds the creamy sauce well.",
        },
      ],
      nutrition: {
        calories: 780,
        protein: 45,
        fat: 38,
        carbs: 68,
      },
      seoTitle: "Zizzi Chicken Calabrese - Spicy Nduja Pasta Recipe",
      seoDescription:
        "Make Zizzi's Chicken Calabrese at home! Spicy nduja pasta with chicken, mascarpone & spinach. Bold Calabrian flavors in 40 minutes.",
    },
    "zizzi-chicken-calabrese",
    "Chicken Calabrese"
  );

  // Recipe 4: Mediterranean Sea Bass
  console.log("Creating Recipe 4/8: Mediterranean Sea Bass...\n");
  await createDraftRecipe(
    {
      _type: "recipe",
      title: "Zizzi Mediterranean Sea Bass",
      slug: {
        _type: "slug",
        current: "zizzi-mediterranean-sea-bass",
      },
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      categories: [
        { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
        { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
      ],
      description:
        "Pan-fried sea bass with Mediterranean sauce of capers, olives, tomatoes, and white wine. Light, fresh, and full of coastal Italian flavors.",
      servings: 4,
      prepMin: 15,
      cookMin: 20,
      introText:
        "Zizzi's Mediterranean Sea Bass transports you straight to the Italian coast with every forkful. This elegant dish features perfectly pan-fried sea bass fillets with crispy skin, swimming in a vibrant Mediterranean sauce bursting with briny capers, rich black olives, sweet cherry tomatoes, and aromatic white wine. The sauce is light yet intensely flavorful, letting the delicate fish shine while adding layers of complexity. Fresh parsley and a squeeze of lemon brighten everything up, creating a dish that feels both sophisticated and refreshing. It's the kind of meal that's perfect for a special dinner yet surprisingly quick to prepare - restaurant-quality seafood that proves healthy eating never has to be boring.",
      brandContext: [
        {
          _key: randomUUID(),
          _type: "block",
          children: [
            {
              _key: randomUUID(),
              _type: "span",
              text: "Zizzi's seafood dishes reflect the coastal traditions of southern Italy, where fresh fish is paired with simple, bold Mediterranean flavors. The Mediterranean Sea Bass showcases their commitment to quality ingredients prepared with classic Italian techniques.",
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
              text: "This recipe brings the essence of Italian coastal cooking to your kitchen - fresh, vibrant, and surprisingly simple to execute.",
            },
          ],
          style: "normal",
        },
      ],
      ingredients: [
        {
          _key: randomUUID(),
          _type: "ingredientGroup",
          groupName: "Main",
          items: [
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Sea bass fillets"] },
              quantity: "4",
              unit: "piece",
              notes: "skin on",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Cherry tomatoes"] },
              quantity: "300",
              unit: "g",
              notes: "halved",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Black olives"] },
              quantity: "80",
              unit: "g",
              notes: "halved",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Capers"] },
              quantity: "3",
              unit: "tbsp",
              notes: "drained",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["White wine"] },
              quantity: "150",
              unit: "ml",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic"] },
              quantity: "3",
              unit: "clove",
              notes: "sliced",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fresh parsley"] },
              quantity: "20",
              unit: "g",
              notes: "chopped",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Olive oil"] },
              quantity: "4",
              unit: "tbsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Lemon"] },
              quantity: "1",
              unit: "piece",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
              quantity: "1",
              unit: "tsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Black pepper"] },
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
                { _key: randomUUID(), _type: "span", text: "Pat sea bass dry and score the skin. Season both sides with salt and pepper." },
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
                { _key: randomUUID(), _type: "span", text: "Heat 2 tbsp olive oil in a large pan over medium-high heat." },
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
                { _key: randomUUID(), _type: "span", text: "Place fish skin-side down. Cook for 4 minutes without moving until skin is crispy." },
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
                { _key: randomUUID(), _type: "span", text: "Flip carefully and cook for 2-3 minutes until just cooked through. Remove and keep warm." },
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
                { _key: randomUUID(), _type: "span", text: "In the same pan, add remaining oil and garlic. Cook for 30 seconds until fragrant." },
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
                { _key: randomUUID(), _type: "span", text: "Add tomatoes, olives, and capers. Cook for 3-4 minutes until tomatoes start to soften." },
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
                { _key: randomUUID(), _type: "span", text: "Pour in white wine and simmer for 3 minutes to reduce slightly." },
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
                { _key: randomUUID(), _type: "span", text: "Stir in parsley and lemon juice. Taste and adjust seasoning." },
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
                { _key: randomUUID(), _type: "span", text: "Serve fish over sauce, skin-side up, with extra lemon wedges." },
              ],
              style: "normal",
            },
          ],
        },
      ],
      tips: [
        "Dry fish thoroughly for the crispiest skin.",
        "Don't move the fish while cooking skin-side down.",
        "Use a fish spatula for easier flipping.",
        "Rinse capers if they're very salty.",
        "Serve with crusty bread to soak up the delicious sauce.",
      ],
      faqs: [
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I use other fish?",
          answer:
            "Yes! Bream, snapper, or even salmon work well. Adjust cooking time based on thickness.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "How do I know when fish is done?",
          answer:
            "Fish should flake easily and be opaque throughout. Internal temp should be 60°C.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I make the sauce ahead?",
          answer:
            "Yes! Make the sauce up to a day ahead and reheat gently. Cook the fish fresh for best results.",
        },
      ],
      nutrition: {
        calories: 310,
        protein: 32,
        fat: 16,
        carbs: 6,
      },
      seoTitle: "Zizzi Mediterranean Sea Bass - Italian Fish Recipe",
      seoDescription:
        "Make Zizzi's Mediterranean Sea Bass! Pan-fried fish with capers, olives, tomatoes & white wine. Light, healthy Italian seafood in 35 min.",
    },
    "zizzi-mediterranean-sea-bass",
    "Mediterranean Sea Bass"
  );

  // Recipe 5: Pan-Fried Salmon & Pesto Risotto
  console.log("Creating Recipe 5/8: Pan-Fried Salmon & Pesto Risotto...\n");
  await createDraftRecipe(
    {
      _type: "recipe",
      title: "Zizzi Pan-Fried Salmon & Pesto Risotto",
      slug: {
        _type: "slug",
        current: "zizzi-pan-fried-salmon-pesto-risotto",
      },
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      categories: [
        { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
        { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
      ],
      description:
        "Perfectly cooked salmon fillet over creamy basil pesto risotto. Rich, indulgent, and packed with fresh Italian flavors.",
      servings: 4,
      prepMin: 15,
      cookMin: 40,
      introText:
        "Zizzi's Pan-Fried Salmon & Pesto Risotto is pure Italian indulgence on a plate. Imagine creamy, al dente arborio rice infused with vibrant basil pesto, finished with butter and parmesan until it's impossibly silky. Now top that with a perfectly pan-fried salmon fillet - crispy skin, tender pink flesh - and you've got a dish that's both comforting and sophisticated. The earthy pesto risotto provides the perfect base for the rich salmon, while pine nuts add occasional bursts of texture. This is the kind of meal that impresses dinner guests yet feels wonderfully comforting on a quiet evening. It takes a bit of attention (risotto always does), but the results are absolutely worth it.",
      brandContext: [
        {
          _key: randomUUID(),
          _type: "block",
          children: [
            {
              _key: randomUUID(),
              _type: "span",
              text: "Zizzi has built its reputation on serving restaurant-quality Italian dishes that combine traditional techniques with quality ingredients. Their risottos are particularly celebrated, cooked to order with patience and care.",
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
              text: "The Salmon & Pesto Risotto showcases their ability to pair classic Italian staples with premium proteins. This recipe brings that restaurant experience home, teaching you the art of perfect risotto along the way.",
            },
          ],
          style: "normal",
        },
      ],
      ingredients: [
        {
          _key: randomUUID(),
          _type: "ingredientGroup",
          groupName: "Salmon",
          items: [
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Salmon fillets"] },
              quantity: "4",
              unit: "piece",
              notes: "skin on, 150g each",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Olive oil"] },
              quantity: "2",
              unit: "tbsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
              quantity: "1",
              unit: "tsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Black pepper"] },
              quantity: "1/2",
              unit: "tsp",
            },
          ],
        },
        {
          _key: randomUUID(),
          _type: "ingredientGroup",
          groupName: "Pesto Risotto",
          items: [
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Arborio rice"] },
              quantity: "350",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken stock"] },
              quantity: "1200",
              unit: "ml",
              notes: "hot",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["White onion"] },
              quantity: "1",
              unit: "piece",
              notes: "finely diced",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["White wine"] },
              quantity: "150",
              unit: "ml",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fresh basil"] },
              quantity: "60",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Pine nuts"] },
              quantity: "40",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Parmesan"] },
              quantity: "80",
              unit: "g",
              notes: "grated, plus extra to serve",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic"] },
              quantity: "2",
              unit: "clove",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Olive oil"] },
              quantity: "100",
              unit: "ml",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Unsalted butter"] },
              quantity: "40",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Double cream"] },
              quantity: "100",
              unit: "ml",
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
                { _key: randomUUID(), _type: "span", text: "Make pesto: blend basil, pine nuts, garlic, parmesan, and 100ml olive oil until smooth. Set aside." },
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
                { _key: randomUUID(), _type: "span", text: "Heat 2 tbsp olive oil in a large pan. Cook onion for 5 minutes until soft." },
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
                { _key: randomUUID(), _type: "span", text: "Add rice and stir for 2 minutes until edges turn translucent." },
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
                { _key: randomUUID(), _type: "span", text: "Pour in wine and stir until absorbed." },
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
                { _key: randomUUID(), _type: "span", text: "Add hot stock one ladle at a time, stirring constantly. Wait until absorbed before adding more." },
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
                { _key: randomUUID(), _type: "span", text: "Continue for 20-25 minutes until rice is creamy but al dente." },
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
                { _key: randomUUID(), _type: "span", text: "While risotto cooks, season salmon. Heat 2 tbsp oil in a pan over medium-high heat." },
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
                { _key: randomUUID(), _type: "span", text: "Cook salmon skin-side down for 4 minutes, then flip and cook 2-3 minutes more. Rest." },
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
                { _key: randomUUID(), _type: "span", text: "Stir pesto, butter, cream, and parmesan into risotto. Season to taste." },
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
                { _key: randomUUID(), _type: "span", text: "Divide risotto between bowls and top each with a salmon fillet. Serve with extra parmesan." },
              ],
              style: "normal",
            },
          ],
        },
      ],
      tips: [
        "Keep stock hot throughout - cold stock slows down cooking.",
        "Stir risotto constantly for the creamiest texture.",
        "Rice should be al dente - slightly firm to the bite.",
        "Don't overcook salmon - it should be just pink in the center.",
        "Make pesto fresh for the brightest flavor.",
      ],
      faqs: [
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I use store-bought pesto?",
          answer:
            "Yes! Use about 150g of quality pesto. Fresh is better, but jarred works in a pinch.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "How do I know when risotto is done?",
          answer:
            "Rice should be creamy and flow slowly when you tilt the pan. Each grain should have a tiny bite in the center.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I make risotto ahead?",
          answer:
            "Risotto is best fresh, but you can cook rice 75% through, spread on a tray to cool, then finish just before serving.",
        },
      ],
      nutrition: {
        calories: 820,
        protein: 42,
        fat: 48,
        carbs: 58,
      },
      seoTitle: "Zizzi Salmon & Pesto Risotto - Creamy Italian Recipe",
      seoDescription:
        "Make Zizzi's Salmon & Pesto Risotto at home! Creamy basil risotto topped with pan-fried salmon. Restaurant-quality Italian in 55 minutes.",
    },
    "zizzi-pan-fried-salmon-pesto-risotto",
    "Pan-Fried Salmon & Pesto Risotto"
  );

  // Recipe 6: Roasted Mushroom Risotto
  console.log("Creating Recipe 6/8: Roasted Mushroom Risotto...\n");
  await createDraftRecipe(
    {
      _type: "recipe",
      title: "Zizzi Roasted Mushroom Risotto",
      slug: {
        _type: "slug",
        current: "zizzi-roasted-mushroom-risotto",
      },
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      categories: [
        { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
        { _type: "reference", _ref: CATEGORIES.vegetarian, _key: randomUUID() },
      ],
      description:
        "Creamy vegetarian risotto with roasted mushrooms and truffle oil. Earthy, luxurious, and deeply satisfying comfort food.",
      servings: 4,
      prepMin: 20,
      cookMin: 35,
      introText:
        "Zizzi's Roasted Mushroom Risotto is proof that vegetarian food can be absolutely luxurious. This dish celebrates the humble mushroom in all its earthy glory - a mix of roasted chestnut mushrooms and rehydrated porcini creates incredible depth of flavor. The risotto is cooked slowly in mushroom-infused stock until each grain is perfectly tender and surrounded by a creamy, velvety sauce. A drizzle of truffle oil at the end adds that final touch of decadence, making this simple vegetarian dish taste like something from a high-end restaurant. It's comfort food that feels special, the kind of meal that makes you forget you're not eating meat. Perfect for vegetarians and meat-eaters alike.",
      brandContext: [
        {
          _key: randomUUID(),
          _type: "block",
          children: [
            {
              _key: randomUUID(),
              _type: "span",
              text: "Zizzi has always been committed to creating vegetarian dishes that stand on their own merits, not as afterthoughts. Their Roasted Mushroom Risotto has become a vegetarian favorite, showcasing how Italian cooking can transform simple vegetables into something extraordinary.",
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
              text: "This recipe brings the restaurant's signature mushroom risotto to your home kitchen, teaching you the technique while delivering that incredible umami-rich flavor Zizzi is known for.",
            },
          ],
          style: "normal",
        },
      ],
      ingredients: [
        {
          _key: randomUUID(),
          _type: "ingredientGroup",
          groupName: "Main",
          items: [
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Arborio rice"] },
              quantity: "350",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Chestnut mushrooms"] },
              quantity: "400",
              unit: "g",
              notes: "quartered",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Porcini mushrooms"] },
              quantity: "30",
              unit: "g",
              notes: "dried",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken stock"] },
              quantity: "1200",
              unit: "ml",
              notes: "hot",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["White onion"] },
              quantity: "1",
              unit: "piece",
              notes: "finely diced",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["White wine"] },
              quantity: "150",
              unit: "ml",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Parmesan"] },
              quantity: "80",
              unit: "g",
              notes: "grated",
            },
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
              ingredientRef: { _type: "reference", _ref: ingredientIds["Garlic"] },
              quantity: "3",
              unit: "clove",
              notes: "minced",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Truffle oil"] },
              quantity: "2",
              unit: "tbsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Olive oil"] },
              quantity: "4",
              unit: "tbsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fresh thyme"] },
              quantity: "4",
              unit: "sprig",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
              quantity: "1",
              unit: "tsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Black pepper"] },
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
                { _key: randomUUID(), _type: "span", text: "Soak porcini in 200ml hot stock for 20 minutes. Drain, reserving liquid. Chop porcini." },
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
                { _key: randomUUID(), _type: "span", text: "Preheat oven to 200°C. Toss chestnut mushrooms with 2 tbsp olive oil, thyme, salt, and pepper." },
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
                { _key: randomUUID(), _type: "span", text: "Roast mushrooms for 20 minutes until golden and caramelized." },
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
                { _key: randomUUID(), _type: "span", text: "Add porcini soaking liquid to remaining stock. Keep hot." },
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
                { _key: randomUUID(), _type: "span", text: "Heat 2 tbsp olive oil in a large pan. Cook onion for 5 minutes until soft." },
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
                { _key: randomUUID(), _type: "span", text: "Add garlic and rice. Stir for 2 minutes until rice edges turn translucent." },
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
                { _key: randomUUID(), _type: "span", text: "Add wine and stir until absorbed. Add chopped porcini." },
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
                { _key: randomUUID(), _type: "span", text: "Add hot stock one ladle at a time, stirring constantly. Continue for 20-25 minutes until creamy and al dente." },
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
                { _key: randomUUID(), _type: "span", text: "Stir in butter, parmesan, and most of the roasted mushrooms. Season to taste." },
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
                { _key: randomUUID(), _type: "span", text: "Serve in bowls topped with remaining roasted mushrooms. Drizzle with truffle oil." },
              ],
              style: "normal",
            },
          ],
        },
      ],
      tips: [
        "Don't throw away porcini soaking liquid - it's pure umami gold!",
        "Roast mushrooms until deeply caramelized for maximum flavor.",
        "Use good quality truffle oil - a little goes a long way.",
        "Stir risotto patiently - this isn't a dish to rush.",
        "For vegetarian stock, use vegetable instead of chicken stock.",
      ],
      faqs: [
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I skip the truffle oil?",
          answer:
            "Yes, but it adds incredible depth. If omitting, add extra porcini or a knob of butter for richness.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "What if I can't find porcini?",
          answer:
            "Use all chestnut mushrooms, but add soy sauce for extra umami. Dried shiitake also work well.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "Is this dish vegan-friendly?",
          answer:
            "With a few swaps, yes! Use vegan butter, nutritional yeast instead of parmesan, and vegetable stock.",
        },
      ],
      nutrition: {
        calories: 580,
        protein: 18,
        fat: 24,
        carbs: 72,
      },
      seoTitle: "Zizzi Mushroom Risotto - Vegetarian Italian Recipe",
      seoDescription:
        "Make Zizzi's famous Mushroom Risotto! Creamy vegetarian risotto with roasted mushrooms & truffle oil. Luxurious Italian comfort food.",
    },
    "zizzi-roasted-mushroom-risotto",
    "Roasted Mushroom Risotto"
  );

  // Recipe 7: Calzone Carne Piccante
  console.log("Creating Recipe 7/8: Calzone Carne Piccante...\n");
  await createDraftRecipe(
    {
      _type: "recipe",
      title: "Zizzi Calzone Carne Piccante",
      slug: {
        _type: "slug",
        current: "zizzi-calzone-carne-piccante",
      },
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      categories: [
        { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
        { _type: "reference", _ref: CATEGORIES.spicy, _key: randomUUID() },
      ],
      description:
        "Folded pizza stuffed with spicy pepperoni, Italian sausage, and fiery nduja. Crispy outside, molten cheese inside - pure indulgence.",
      servings: 4,
      prepMin: 25,
      cookMin: 20,
      introText:
        "Zizzi's Calzone Carne Piccante is a meat lover's dream wrapped in crispy, golden pizza dough. This folded pizza pocket is loaded with a trio of Italian meats - spicy pepperoni, savory Italian sausage, and fiery nduja paste that melts into the mozzarella creating pockets of spicy goodness. Break through that crispy, bubbled crust and you're rewarded with a rush of molten cheese and perfectly seasoned meats. Each bite delivers that perfect combination of textures - crunchy crust giving way to a soft, pillowy interior bursting with flavor. It's messy, it's indulgent, and it's absolutely worth it. Perfect for when you want pizza but need something even more substantial and exciting.",
      brandContext: [
        {
          _key: randomUUID(),
          _type: "block",
          children: [
            {
              _key: randomUUID(),
              _type: "span",
              text: "Zizzi's pizza and calzone offerings showcase their commitment to authentic Italian techniques and quality ingredients. Their calzones are made to order, hand-folded, and baked until perfectly golden and crispy.",
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
              text: "The Calzone Carne Piccante is a customer favorite, combining traditional Southern Italian calzone-making with bold, spicy meats. This recipe brings that authentic Italian pizzeria experience to your home kitchen.",
            },
          ],
          style: "normal",
        },
      ],
      ingredients: [
        {
          _key: randomUUID(),
          _type: "ingredientGroup",
          groupName: "Main",
          items: [
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Pizza dough"] },
              quantity: "600",
              unit: "g",
              notes: "room temperature",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Mozzarella"] },
              quantity: "300",
              unit: "g",
              notes: "torn",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Pepperoni"] },
              quantity: "150",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Italian sausage"] },
              quantity: "200",
              unit: "g",
              notes: "cooked and crumbled",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Nduja"] },
              quantity: "80",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Passata"] },
              quantity: "150",
              unit: "ml",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Dried oregano"] },
              quantity: "2",
              unit: "tsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Red chilli flakes"] },
              quantity: "1",
              unit: "tsp",
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
              ingredientRef: { _type: "reference", _ref: ingredientIds["Olive oil"] },
              quantity: "3",
              unit: "tbsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
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
                { _key: randomUUID(), _type: "span", text: "Preheat oven to 220°C (200°C fan). Place a pizza stone or baking sheet inside to heat." },
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
                { _key: randomUUID(), _type: "span", text: "Mix passata with garlic, oregano, salt, and chilli flakes. Set aside." },
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
                { _key: randomUUID(), _type: "span", text: "Divide dough into 4 equal pieces. Roll each into a 20cm circle on a floured surface." },
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
                { _key: randomUUID(), _type: "span", text: "Spread 2 tbsp sauce on half of each circle, leaving a 2cm border." },
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
                { _key: randomUUID(), _type: "span", text: "Top sauce with mozzarella, pepperoni, sausage, and small dollops of nduja." },
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
                { _key: randomUUID(), _type: "span", text: "Fold dough over filling to create a half-moon. Press edges firmly to seal, then crimp with a fork." },
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
                { _key: randomUUID(), _type: "span", text: "Brush tops with olive oil. Cut 2-3 small slits in each calzone to release steam." },
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
                { _key: randomUUID(), _type: "span", text: "Transfer to hot baking sheet or stone. Bake for 18-20 minutes until golden and puffed." },
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
                { _key: randomUUID(), _type: "span", text: "Rest for 5 minutes before serving with extra sauce for dipping." },
              ],
              style: "normal",
            },
          ],
        },
      ],
      tips: [
        "Seal edges well to prevent filling from leaking during baking.",
        "Don't overfill - it makes sealing difficult and can cause splitting.",
        "Steam vents are essential to prevent soggy calzones.",
        "Cook sausage ahead and drain excess fat for best results.",
        "Let rest before cutting - the filling is molten hot!",
      ],
      faqs: [
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I make these ahead?",
          answer:
            "Yes! Assemble calzones, freeze unbaked on a tray, then transfer to freezer bags. Bake from frozen, adding 5-7 minutes to cooking time.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "How do I know when they're done?",
          answer:
            "Calzones should be deeply golden brown with crispy, puffed edges. Internal temp should reach 90°C.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I use different meats?",
          answer:
            "Absolutely! Try ham, bacon, or chorizo. Just ensure meats are pre-cooked before assembling.",
        },
      ],
      nutrition: {
        calories: 920,
        protein: 42,
        fat: 48,
        carbs: 82,
      },
      seoTitle: "Zizzi Calzone Carne Piccante - Spicy Meat Calzone",
      seoDescription:
        "Make Zizzi's spicy Calzone Carne Piccante! Folded pizza with pepperoni, sausage & nduja. Crispy outside, molten cheese inside. Perfect indulgence.",
    },
    "zizzi-calzone-carne-piccante",
    "Calzone Carne Piccante"
  );

  // Recipe 8: Calzone Pollo Spinaci
  console.log("Creating Recipe 8/8: Calzone Pollo Spinaci...\n");
  await createDraftRecipe(
    {
      _type: "recipe",
      title: "Zizzi Calzone Pollo Spinaci",
      slug: {
        _type: "slug",
        current: "zizzi-calzone-pollo-spinaci",
      },
      brand: {
        _type: "reference",
        _ref: brandId,
      },
      categories: [
        { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
        { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
      ],
      description:
        "Folded pizza filled with chicken, spinach, ricotta, and mozzarella. A lighter, fresher take on the classic Italian calzone.",
      servings: 4,
      prepMin: 25,
      cookMin: 20,
      introText:
        "Zizzi's Calzone Pollo Spinaci offers a lighter, fresher alternative to traditional meat-heavy calzones without sacrificing any of the satisfaction. Tender pieces of seasoned chicken mingle with fresh spinach, creamy ricotta, and melted mozzarella, all wrapped in golden, crispy pizza dough. The ricotta adds a wonderful lightness and subtle tang that balances the richness of the mozzarella perfectly. Spinach provides color, nutrients, and a pleasant earthy flavor that complements the chicken beautifully. Break through that golden crust and you'll find a filling that's indulgent yet balanced, rich yet refreshing. It's the kind of calzone you can feel good about eating, proving that comfort food can be both delicious and somewhat virtuous.",
      brandContext: [
        {
          _key: randomUUID(),
          _type: "block",
          children: [
            {
              _key: randomUUID(),
              _type: "span",
              text: "Zizzi understands that not everyone wants a super-heavy meal, which is why their Calzone Pollo Spinaci has become such a popular choice. It delivers all the satisfaction of a calzone with a fresher, lighter flavor profile.",
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
              text: "This recipe recreates Zizzi's balanced approach to calzone-making, showing how fresh ingredients and thoughtful combinations can create something both indulgent and refreshing.",
            },
          ],
          style: "normal",
        },
      ],
      ingredients: [
        {
          _key: randomUUID(),
          _type: "ingredientGroup",
          groupName: "Main",
          items: [
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Pizza dough"] },
              quantity: "600",
              unit: "g",
              notes: "room temperature",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Chicken breast"] },
              quantity: "400",
              unit: "g",
              notes: "cooked and diced",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Mozzarella"] },
              quantity: "250",
              unit: "g",
              notes: "torn",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Ricotta"] },
              quantity: "200",
              unit: "g",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Baby spinach"] },
              quantity: "200",
              unit: "g",
              notes: "wilted and squeezed dry",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Parmesan"] },
              quantity: "40",
              unit: "g",
              notes: "grated",
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
              ingredientRef: { _type: "reference", _ref: ingredientIds["Dried oregano"] },
              quantity: "2",
              unit: "tsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Olive oil"] },
              quantity: "3",
              unit: "tbsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Fine sea salt"] },
              quantity: "1",
              unit: "tsp",
            },
            {
              _key: randomUUID(),
              _type: "ingredientItem",
              ingredientRef: { _type: "reference", _ref: ingredientIds["Black pepper"] },
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
                { _key: randomUUID(), _type: "span", text: "Preheat oven to 220°C (200°C fan). Place a pizza stone or baking sheet inside to heat." },
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
                { _key: randomUUID(), _type: "span", text: "Mix ricotta with garlic, parmesan, oregano, salt, and pepper. Set aside." },
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
                { _key: randomUUID(), _type: "span", text: "Squeeze excess water from spinach. Roughly chop." },
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
                { _key: randomUUID(), _type: "span", text: "Divide dough into 4 equal pieces. Roll each into a 20cm circle on a floured surface." },
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
                { _key: randomUUID(), _type: "span", text: "Spread ricotta mixture on half of each circle, leaving a 2cm border." },
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
                { _key: randomUUID(), _type: "span", text: "Top with chicken, spinach, and mozzarella, dividing evenly." },
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
                { _key: randomUUID(), _type: "span", text: "Fold dough over filling to create a half-moon. Press edges firmly to seal, then crimp with a fork." },
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
                { _key: randomUUID(), _type: "span", text: "Brush tops with olive oil. Cut 2-3 small slits in each calzone to release steam." },
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
                { _key: randomUUID(), _type: "span", text: "Transfer to hot baking sheet or stone. Bake for 18-20 minutes until golden and puffed." },
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
                { _key: randomUUID(), _type: "span", text: "Rest for 5 minutes before serving." },
              ],
              style: "normal",
            },
          ],
        },
      ],
      tips: [
        "Squeeze spinach very well - excess water makes soggy calzones.",
        "Season chicken well before adding to filling.",
        "Seal edges thoroughly to keep filling inside during baking.",
        "Steam vents prevent the calzone from bursting.",
        "Let rest before cutting to avoid burning yourself on hot filling.",
      ],
      faqs: [
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I use frozen spinach?",
          answer:
            "Yes! Thaw completely and squeeze very dry. You'll need about 150g frozen spinach for this recipe.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "How do I cook the chicken?",
          answer:
            "Season breasts and pan-fry for 6-7 minutes per side until cooked through. Cool before dicing.",
        },
        {
          _key: randomUUID(),
          _type: "object",
          question: "Can I freeze these?",
          answer:
            "Absolutely! Assemble and freeze unbaked. Bake from frozen, adding 5-7 minutes to cooking time.",
        },
      ],
      nutrition: {
        calories: 780,
        protein: 48,
        fat: 32,
        carbs: 76,
      },
      seoTitle: "Zizzi Calzone Pollo Spinaci - Chicken & Spinach Recipe",
      seoDescription:
        "Make Zizzi's Calzone Pollo Spinaci! Folded pizza with chicken, spinach, ricotta & mozzarella. Lighter, fresher calzone in 45 minutes.",
    },
    "zizzi-calzone-pollo-spinaci",
    "Calzone Pollo Spinaci"
  );

  console.log("\n🎉 All 8 Zizzi recipes created successfully as drafts!\n");
  console.log("Summary:");
  console.log("1. ✅ Beef Brisket & Venison Stufato");
  console.log("2. ✅ Chicken Milanese");
  console.log("3. ✅ Chicken Calabrese");
  console.log("4. ✅ Mediterranean Sea Bass");
  console.log("5. ✅ Pan-Fried Salmon & Pesto Risotto");
  console.log("6. ✅ Roasted Mushroom Risotto");
  console.log("7. ✅ Calzone Carne Piccante");
  console.log("8. ✅ Calzone Pollo Spinaci");
}

createRecipes().catch(console.error);
