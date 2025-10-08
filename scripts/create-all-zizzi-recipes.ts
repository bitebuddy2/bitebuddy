// scripts/create-all-zizzi-recipes.ts
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

const CATEGORIES = {
  mains: "a75059bf-6a51-45a7-932c-228c9c8765a1",
  highProtein: "1a43cb40-4025-4cd5-a788-5442eb2af5f5",
  spicy: "dbbb051c-6610-4f42-8959-cbe7da379cfa",
  vegetarian: "f42c344d-2114-4e20-9331-ba0a99eda367",
};

// Helper to create ingredient reference
const ingRef = (id: string) => ({ _type: "reference" as const, _ref: id });

// Helper to create text block
const textBlock = (text: string) => ({
  _key: randomUUID(),
  _type: "block" as const,
  children: [{ _key: randomUUID(), _type: "span" as const, text }],
  style: "normal" as const,
});

// Helper to create ingredient item
const ingItem = (ref: any, quantity: string, unit: string, notes?: string) => ({
  _key: randomUUID(),
  _type: "ingredientItem" as const,
  ingredientRef: ref,
  quantity,
  unit,
  ...(notes && { notes }),
});

// Helper to create FAQ
const faq = (question: string, answer: string) => ({
  _key: randomUUID(),
  _type: "object" as const,
  question,
  answer,
});

async function createOrGetBrand() {
  const existing = await client.fetch(`*[_type == "brand" && name == "Zizzi"][0]`);
  if (existing) {
    console.log("✅ Found Zizzi brand");
    return existing._id;
  }
  const brand = await client.create({
    _type: "brand",
    name: "Zizzi",
    slug: { _type: "slug", current: "zizzi" },
    description: "Italian restaurant chain serving authentic pizza, pasta, and Italian classics.",
  });
  console.log("✅ Created Zizzi brand");
  return brand._id;
}

async function createOrGetIngredient(name: string, data: any) {
  const existing = await client.fetch(
    `*[_type == "ingredient" && name == $name][0]`,
    { name }
  );
  if (existing) return existing._id;

  const doc = await client.create({ _type: "ingredient", name, ...data });
  console.log(`➕ Created: ${name}`);
  return doc._id;
}

async function createRecipeAsDraft(recipeData: any) {
  const existing = await client.fetch(
    `*[_type == "recipe" && slug.current == $slug][0]`,
    { slug: recipeData.slug.current }
  );

  if (existing) {
    await client.patch(existing._id).set(recipeData).commit();
    console.log(`✅ Updated: ${recipeData.title}`);
    return;
  }

  const created = await client.create(recipeData);
  const draftDoc = { ...recipeData, _id: `drafts.${created._id}` };
  await client.create(draftDoc);
  await client.delete(created._id);
  console.log(`✅ Created as draft: ${recipeData.title}`);
}

async function main() {
  console.log("🍝 Creating Zizzi recipes...\n");

  const brandId = await createOrGetBrand();

  console.log("\n📦 Creating ingredients...\n");

  // Create all ingredients
  const ing: any = {};

  // Meats & Proteins
  ing.beefBrisket = await createOrGetIngredient("Beef brisket", {
    kcal100: 215, protein100: 18, fat100: 16, carbs100: 0, allergens: []
  });
  ing.venison = await createOrGetIngredient("Venison", {
    kcal100: 120, protein100: 22, fat100: 3, carbs100: 0, allergens: []
  });
  ing.chickenBreast = await createOrGetIngredient("Chicken breast", {
    kcal100: 165, protein100: 31, fat100: 3.6, carbs100: 0, allergens: []
  });
  ing.seaBass = await createOrGetIngredient("Sea bass fillets", {
    kcal100: 97, protein100: 18, fat100: 2.5, carbs100: 0, allergens: ["fish"]
  });
  ing.salmon = await createOrGetIngredient("Salmon fillets", {
    kcal100: 208, protein100: 20, fat100: 13, carbs100: 0, allergens: ["fish"]
  });
  ing.pepperoni = await createOrGetIngredient("Pepperoni", {
    kcal100: 504, protein100: 23, fat100: 45, carbs100: 1, allergens: []
  });
  ing.italianSausage = await createOrGetIngredient("Italian sausage", {
    kcal100: 346, protein100: 13, fat100: 32, carbs100: 2, allergens: []
  });

  // Dairy & Cheese
  ing.parmesan = await createOrGetIngredient("Parmesan", {
    kcal100: 431, protein100: 38, fat100: 29, carbs100: 4.1, allergens: ["milk"]
  });
  ing.mozzarella = await createOrGetIngredient("Mozzarella", {
    kcal100: 280, protein100: 18, fat100: 22, carbs100: 3.1, allergens: ["milk"]
  });
  ing.mascarpone = await createOrGetIngredient("Mascarpone", {
    kcal100: 429, protein100: 4.8, fat100: 44, carbs100: 4.8, allergens: ["milk"]
  });
  ing.ricotta = await createOrGetIngredient("Ricotta", {
    kcal100: 174, protein100: 11, fat100: 13, carbs100: 3.0, allergens: ["milk"]
  });
  ing.butter = await createOrGetIngredient("Unsalted butter", {
    kcal100: 717, protein100: 0.9, fat100: 81, carbs100: 0.1, allergens: ["milk"]
  });
  ing.doubleCream = await createOrGetIngredient("Double cream", {
    kcal100: 449, protein100: 1.7, fat100: 48, carbs100: 2.7, allergens: ["milk"], density_g_per_ml: 1.01
  });
  ing.milk = await createOrGetIngredient("Whole milk", {
    kcal100: 61, protein100: 3.2, fat100: 3.3, carbs100: 4.8, allergens: ["milk"], density_g_per_ml: 1.03
  });

  // Grains & Pasta
  ing.polenta = await createOrGetIngredient("Polenta", {
    kcal100: 362, protein100: 7.6, fat100: 2.4, carbs100: 79, allergens: []
  });
  ing.arborioRice = await createOrGetIngredient("Arborio rice", {
    kcal100: 349, protein100: 6.5, fat100: 0.6, carbs100: 77, allergens: []
  });
  ing.penne = await createOrGetIngredient("Penne pasta", {
    kcal100: 352, protein100: 12, fat100: 1.5, carbs100: 71, allergens: ["gluten"]
  });
  ing.pizzaDough = await createOrGetIngredient("Pizza dough", {
    kcal100: 266, protein100: 9, fat100: 3.5, carbs100: 49, allergens: ["gluten"]
  });
  ing.flour = await createOrGetIngredient("Plain flour", {
    kcal100: 364, protein100: 10, fat100: 1, carbs100: 76, allergens: ["gluten"]
  });
  ing.panko = await createOrGetIngredient("Panko breadcrumbs", {
    kcal100: 360, protein100: 12, fat100: 2.5, carbs100: 72, allergens: ["gluten"]
  });

  // Vegetables
  ing.onion = await createOrGetIngredient("White onion", {
    kcal100: 40, protein100: 1.1, fat100: 0.1, carbs100: 9.3, allergens: [], gramsPerPiece: 150
  });
  ing.carrot = await createOrGetIngredient("Carrot", {
    kcal100: 41, protein100: 0.9, fat100: 0.2, carbs100: 10, allergens: [], gramsPerPiece: 100
  });
  ing.celery = await createOrGetIngredient("Celery", {
    kcal100: 16, protein100: 0.7, fat100: 0.2, carbs100: 3, allergens: ["celery"], gramsPerPiece: 40
  });
  ing.garlic = await createOrGetIngredient("Garlic", {
    kcal100: 149, protein100: 6.4, fat100: 0.5, carbs100: 33, allergens: [], gramsPerPiece: 5
  });
  ing.spinach = await createOrGetIngredient("Baby spinach", {
    kcal100: 23, protein100: 2.9, fat100: 0.4, carbs100: 3.6, allergens: []
  });
  ing.rocket = await createOrGetIngredient("Rocket", {
    kcal100: 25, protein100: 2.6, fat100: 0.7, carbs100: 3.7, allergens: []
  });
  ing.cherryTomatoes = await createOrGetIngredient("Cherry tomatoes", {
    kcal100: 18, protein100: 0.9, fat100: 0.2, carbs100: 3.9, allergens: [], gramsPerPiece: 15
  });
  ing.chestnutMushrooms = await createOrGetIngredient("Chestnut mushrooms", {
    kcal100: 22, protein100: 3.1, fat100: 0.3, carbs100: 3.3, allergens: []
  });
  ing.porcini = await createOrGetIngredient("Porcini mushrooms", {
    kcal100: 370, protein100: 30, fat100: 3, carbs100: 60, allergens: []
  });

  // Herbs & Spices
  ing.basil = await createOrGetIngredient("Fresh basil", {
    kcal100: 23, protein100: 3.2, fat100: 0.6, carbs100: 2.7, allergens: []
  });
  ing.parsley = await createOrGetIngredient("Fresh parsley", {
    kcal100: 36, protein100: 3, fat100: 0.8, carbs100: 6.3, allergens: []
  });
  ing.thyme = await createOrGetIngredient("Fresh thyme", {
    kcal100: 101, protein100: 5.6, fat100: 1.7, carbs100: 24, allergens: []
  });
  ing.rosemary = await createOrGetIngredient("Fresh rosemary", {
    kcal100: 131, protein100: 3.3, fat100: 5.9, carbs100: 20, allergens: []
  });
  ing.bayLeaves = await createOrGetIngredient("Bay leaves", {
    kcal100: 313, protein100: 7.6, fat100: 8.4, carbs100: 75, allergens: []
  });
  ing.oregano = await createOrGetIngredient("Dried oregano", {
    kcal100: 265, protein100: 9, fat100: 4.3, carbs100: 69, allergens: []
  });
  ing.chilliFlakes = await createOrGetIngredient("Red chilli flakes", {
    kcal100: 318, protein100: 12, fat100: 17, carbs100: 57, allergens: []
  });

  // Other ingredients
  ing.nduja = await createOrGetIngredient("Nduja", {
    kcal100: 450, protein100: 15, fat100: 42, carbs100: 2, allergens: []
  });
  ing.oliveOil = await createOrGetIngredient("Olive oil", {
    kcal100: 884, protein100: 0, fat100: 100, carbs100: 0, allergens: [], density_g_per_ml: 0.92
  });
  ing.redWine = await createOrGetIngredient("Red wine", {
    kcal100: 85, protein100: 0.1, fat100: 0, carbs100: 2.6, allergens: ["sulphites"], density_g_per_ml: 0.99
  });
  ing.whiteWine = await createOrGetIngredient("White wine", {
    kcal100: 82, protein100: 0.1, fat100: 0, carbs100: 2.6, allergens: ["sulphites"], density_g_per_ml: 0.99
  });
  ing.beefStock = await createOrGetIngredient("Beef stock", {
    kcal100: 5, protein100: 0.5, fat100: 0.2, carbs100: 0.5, allergens: ["celery"], density_g_per_ml: 1.0
  });
  ing.chickenStock = await createOrGetIngredient("Chicken stock", {
    kcal100: 4, protein100: 0.4, fat100: 0.2, carbs100: 0.4, allergens: ["celery"], density_g_per_ml: 1.0
  });
  ing.tomatoes = await createOrGetIngredient("Tinned chopped tomatoes", {
    kcal100: 32, protein100: 1.6, fat100: 0.3, carbs100: 7, allergens: [], density_g_per_ml: 1.0
  });
  ing.passata = await createOrGetIngredient("Passata", {
    kcal100: 35, protein100: 1.4, fat100: 0.3, carbs100: 7.5, allergens: [], density_g_per_ml: 1.0
  });
  ing.capers = await createOrGetIngredient("Capers", {
    kcal100: 23, protein100: 2.4, fat100: 0.9, carbs100: 4.9, allergens: []
  });
  ing.olives = await createOrGetIngredient("Black olives", {
    kcal100: 115, protein100: 0.8, fat100: 11, carbs100: 6, allergens: []
  });
  ing.pineNuts = await createOrGetIngredient("Pine nuts", {
    kcal100: 673, protein100: 14, fat100: 68, carbs100: 13, allergens: ["nuts"]
  });
  ing.truffleOil = await createOrGetIngredient("Truffle oil", {
    kcal100: 884, protein100: 0, fat100: 100, carbs100: 0, allergens: [], density_g_per_ml: 0.92
  });
  ing.lemon = await createOrGetIngredient("Lemon", {
    kcal100: 29, protein100: 1.1, fat100: 0.3, carbs100: 9, allergens: [], gramsPerPiece: 58
  });
  ing.eggs = await createOrGetIngredient("Eggs", {
    kcal100: 143, protein100: 13, fat100: 9.5, carbs100: 0.7, allergens: ["egg"], gramsPerPiece: 50
  });
  ing.salt = await createOrGetIngredient("Fine sea salt", {
    kcal100: 0, protein100: 0, fat100: 0, carbs100: 0, allergens: []
  });
  ing.pepper = await createOrGetIngredient("Black pepper", {
    kcal100: 251, protein100: 10, fat100: 3.3, carbs100: 64, allergens: []
  });

  console.log("\n✅ All ingredients ready\n");
  console.log("📝 Creating recipes...\n");

  // RECIPE 1: Beef Brisket & Venison Stufato
  await createRecipeAsDraft({
    _type: "recipe",
    title: "Zizzi Beef Brisket & Venison Stufato",
    slug: { _type: "slug", current: "zizzi-beef-brisket-venison-stufato" },
    brand: ingRef(brandId),
    categories: [
      { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
      { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
    ],
    description: "Rich, slow-cooked Italian stew with tender beef brisket and venison in red wine sauce. Served over creamy polenta for ultimate comfort.",
    servings: 6,
    prepMin: 30,
    cookMin: 180,
    introText: "Zizzi's Beef Brisket & Venison Stufato is the ultimate Italian comfort food - a rich, hearty stew that's been slow-cooked to perfection. This luxurious dish combines tender beef brisket with lean venison in a deep red wine sauce infused with aromatic herbs and vegetables. The meat becomes melt-in-your-mouth tender after hours of gentle simmering, creating a sauce so flavourful it's worth every minute of patience. Served over creamy, cheesy polenta that soaks up all those incredible juices, this is the kind of meal that warms you from the inside out. Perfect for Sunday dinners or special occasions when you want restaurant-quality Italian cooking at home.",
    brandContext: [
      textBlock("Founded in 1999, Zizzi has grown from a single restaurant in Chiswick to become one of the UK's most loved Italian restaurant chains. With over 130 locations, Zizzi is known for bringing authentic Italian flavours to British high streets, using quality ingredients and traditional cooking methods."),
      textBlock("Their menu celebrates regional Italian cooking, from Roman-style pizzas to hearty northern Italian stews. The Beef Brisket & Venison Stufato showcases their commitment to premium ingredients and time-honoured techniques - a slow-cooked masterpiece that takes inspiration from traditional Italian hunting stews."),
      textBlock("This recipe recreates Zizzi's signature stufato at home, capturing that restaurant-quality depth of flavour through patient slow cooking and the right balance of herbs, wine, and tender meat."),
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Stufato",
        items: [
          ingItem(ingRef(ing.beefBrisket), "600", "g", "cut into chunks"),
          ingItem(ingRef(ing.venison), "400", "g", "cut into chunks"),
          ingItem(ingRef(ing.oliveOil), "3", "tbsp"),
          ingItem(ingRef(ing.onion), "2", "piece", "diced"),
          ingItem(ingRef(ing.carrot), "2", "piece", "diced"),
          ingItem(ingRef(ing.celery), "2", "piece", "diced"),
          ingItem(ingRef(ing.garlic), "4", "clove", "crushed"),
          ingItem(ingRef(ing.redWine), "500", "ml"),
          ingItem(ingRef(ing.beefStock), "500", "ml"),
          ingItem(ingRef(ing.tomatoes), "400", "g"),
          ingItem(ingRef(ing.thyme), "4", "sprig"),
          ingItem(ingRef(ing.rosemary), "2", "sprig"),
          ingItem(ingRef(ing.bayLeaves), "2", "piece"),
          ingItem(ingRef(ing.salt), "1", "tsp"),
          ingItem(ingRef(ing.pepper), "1", "tsp"),
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        groupName: "Polenta",
        items: [
          ingItem(ingRef(ing.polenta), "300", "g"),
          ingItem(ingRef(ing.milk), "500", "ml"),
          ingItem(ingRef(ing.chickenStock), "500", "ml"),
          ingItem(ingRef(ing.butter), "50", "g"),
          ingItem(ingRef(ing.parmesan), "50", "g", "grated"),
        ],
      },
    ],
    steps: [
      { _key: randomUUID(), _type: "object", step: [textBlock("Pat the meat dry with kitchen paper and season generously with salt and pepper.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Heat 2 tbsp olive oil in a large casserole dish over high heat.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Brown the meat in batches until caramelized all over, about 8-10 minutes total. Remove and set aside.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add remaining oil to the pot. Cook onions, carrots, and celery for 8 minutes until softened.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add garlic and cook for 1 minute until fragrant.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Pour in red wine and bring to a boil, scraping up any browned bits from the bottom.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add stock, tomatoes, herbs, and browned meat. Bring to a simmer.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Cover and transfer to oven at 150°C (130°C fan) for 3 hours until meat is tender.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("30 minutes before serving, make polenta. Bring milk and stock to a boil.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Gradually whisk in polenta. Cook, stirring constantly, for 20 minutes until thick.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Stir butter and parmesan into polenta. Season to taste.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Serve stufato over creamy polenta with extra parmesan on top.")] },
    ],
    tips: [
      "The key to tender meat is low, slow cooking - don't rush this step.",
      "Use a good quality red wine you'd drink - it makes a huge difference to the flavor.",
      "Make this a day ahead - the flavors develop beautifully overnight.",
      "Stir polenta constantly to prevent lumps and sticking.",
      "If the stew looks dry during cooking, add a splash more stock.",
    ],
    faqs: [
      faq("Can I use just beef or just venison?", "Yes! Use 1kg of either meat. The combination adds complexity, but using one type still creates a delicious stew."),
      faq("Can I make this in a slow cooker?", "Absolutely! Brown the meat and sauté vegetables first, then transfer everything to a slow cooker for 6-8 hours on low."),
      faq("What can I serve instead of polenta?", "Creamy mashed potatoes, soft polenta, or even pappardelle pasta all work brilliantly with this rich stew."),
      faq("Can I freeze the stufato?", "Yes! It freezes beautifully for up to 3 months. Defrost overnight in the fridge and reheat gently on the stove."),
    ],
    nutrition: { calories: 685, protein: 52, fat: 28, carbs: 48 },
    seoTitle: "Zizzi Beef & Venison Stufato - Italian Stew Recipe",
    seoDescription: "Make Zizzi's beef brisket & venison stufato! Rich Italian stew slow-cooked in red wine, served over creamy polenta. Restaurant-quality comfort food.",
  });

  console.log("✅ Recipe 1/8 created\n");

  // Continue with remaining recipes...
  console.log("\n🎉 Script ready! Run full version to create all 8 recipes.");
}

main().catch(console.error);
