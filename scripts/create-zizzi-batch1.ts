// scripts/create-zizzi-batch1.ts - Recipes 1-4
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
};

const ingRef = (id: string) => ({ _type: "reference" as const, _ref: id });
const textBlock = (text: string) => ({
  _key: randomUUID(), _type: "block" as const,
  children: [{ _key: randomUUID(), _type: "span" as const, text }],
  style: "normal" as const,
});
const ingItem = (ref: any, qty: string, unit: string, notes?: string) => ({
  _key: randomUUID(), _type: "ingredientItem" as const,
  ingredientRef: ref, quantity: qty, unit, ...(notes && { notes }),
});
const faq = (question: string, answer: string) => ({
  _key: randomUUID(), _type: "object" as const, question, answer,
});

async function getOrCreateIngredient(name: string, data: any) {
  const existing = await client.fetch(`*[_type == "ingredient" && name == $name][0]`, { name });
  if (existing) return existing._id;
  const doc = await client.create({ _type: "ingredient", name, ...data });
  return doc._id;
}

async function main() {
  console.log("🍝 Creating Zizzi Batch 1 (Recipes 1-4)...\n");

  // Get/create brand
  let brandId = (await client.fetch(`*[_type == "brand" && name == "Zizzi"][0]`))?._id;
  if (!brandId) {
    const brand = await client.create({
      _type: "brand", name: "Zizzi",
      slug: { _type: "slug", current: "zizzi" },
      description: "Italian restaurant chain serving authentic pizza, pasta, and Italian classics.",
    });
    brandId = brand._id;
  }

  // Create ingredients (compact version)
  const i: any = {};
  i.beefBrisket = await getOrCreateIngredient("Beef brisket", { kcal100: 215, protein100: 18, fat100: 16, carbs100: 0, allergens: [] });
  i.venison = await getOrCreateIngredient("Venison", { kcal100: 120, protein100: 22, fat100: 3, carbs100: 0, allergens: [] });
  i.chicken = await getOrCreateIngredient("Chicken breast", { kcal100: 165, protein100: 31, fat100: 3.6, carbs100: 0, allergens: [] });
  i.seaBass = await getOrCreateIngredient("Sea bass fillets", { kcal100: 97, protein100: 18, fat100: 2.5, carbs100: 0, allergens: ["fish"] });
  i.parmesan = await getOrCreateIngredient("Parmesan", { kcal100: 431, protein100: 38, fat100: 29, carbs100: 4.1, allergens: ["milk"] });
  i.mascarpone = await getOrCreateIngredient("Mascarpone", { kcal100: 429, protein100: 4.8, fat100: 44, carbs100: 4.8, allergens: ["milk"] });
  i.butter = await getOrCreateIngredient("Unsalted butter", { kcal100: 717, protein100: 0.9, fat100: 81, carbs100: 0.1, allergens: ["milk"] });
  i.milk = await getOrCreateIngredient("Whole milk", { kcal100: 61, protein100: 3.2, fat100: 3.3, carbs100: 4.8, allergens: ["milk"], density_g_per_ml: 1.03 });
  i.polenta = await getOrCreateIngredient("Polenta", { kcal100: 362, protein100: 7.6, fat100: 2.4, carbs100: 79, allergens: [] });
  i.penne = await getOrCreateIngredient("Penne pasta", { kcal100: 352, protein100: 12, fat100: 1.5, carbs100: 71, allergens: ["gluten"] });
  i.flour = await getOrCreateIngredient("Plain flour", { kcal100: 364, protein100: 10, fat100: 1, carbs100: 76, allergens: ["gluten"] });
  i.panko = await getOrCreateIngredient("Panko breadcrumbs", { kcal100: 360, protein100: 12, fat100: 2.5, carbs100: 72, allergens: ["gluten"] });
  i.onion = await getOrCreateIngredient("White onion", { kcal100: 40, protein100: 1.1, fat100: 0.1, carbs100: 9.3, allergens: [], gramsPerPiece: 150 });
  i.carrot = await getOrCreateIngredient("Carrot", { kcal100: 41, protein100: 0.9, fat100: 0.2, carbs100: 10, allergens: [], gramsPerPiece: 100 });
  i.celery = await getOrCreateIngredient("Celery", { kcal100: 16, protein100: 0.7, fat100: 0.2, carbs100: 3, allergens: ["celery"], gramsPerPiece: 40 });
  i.garlic = await getOrCreateIngredient("Garlic", { kcal100: 149, protein100: 6.4, fat100: 0.5, carbs100: 33, allergens: [], gramsPerPiece: 5 });
  i.spinach = await getOrCreateIngredient("Baby spinach", { kcal100: 23, protein100: 2.9, fat100: 0.4, carbs100: 3.6, allergens: [] });
  i.rocket = await getOrCreateIngredient("Rocket", { kcal100: 25, protein100: 2.6, fat100: 0.7, carbs100: 3.7, allergens: [] });
  i.cherryTom = await getOrCreateIngredient("Cherry tomatoes", { kcal100: 18, protein100: 0.9, fat100: 0.2, carbs100: 3.9, allergens: [], gramsPerPiece: 15 });
  i.nduja = await getOrCreateIngredient("Nduja", { kcal100: 450, protein100: 15, fat100: 42, carbs100: 2, allergens: [] });
  i.oliveOil = await getOrCreateIngredient("Olive oil", { kcal100: 884, protein100: 0, fat100: 100, carbs100: 0, allergens: [], density_g_per_ml: 0.92 });
  i.redWine = await getOrCreateIngredient("Red wine", { kcal100: 85, protein100: 0.1, fat100: 0, carbs100: 2.6, allergens: ["sulphites"], density_g_per_ml: 0.99 });
  i.whiteWine = await getOrCreateIngredient("White wine", { kcal100: 82, protein100: 0.1, fat100: 0, carbs100: 2.6, allergens: ["sulphites"], density_g_per_ml: 0.99 });
  i.beefStock = await getOrCreateIngredient("Beef stock", { kcal100: 5, protein100: 0.5, fat100: 0.2, carbs100: 0.5, allergens: ["celery"], density_g_per_ml: 1.0 });
  i.chickenStock = await getOrCreateIngredient("Chicken stock", { kcal100: 4, protein100: 0.4, fat100: 0.2, carbs100: 0.4, allergens: ["celery"], density_g_per_ml: 1.0 });
  i.tomatoes = await getOrCreateIngredient("Tinned chopped tomatoes", { kcal100: 32, protein100: 1.6, fat100: 0.3, carbs100: 7, allergens: [], density_g_per_ml: 1.0 });
  i.passata = await getOrCreateIngredient("Passata", { kcal100: 35, protein100: 1.4, fat100: 0.3, carbs100: 7.5, allergens: [], density_g_per_ml: 1.0 });
  i.capers = await getOrCreateIngredient("Capers", { kcal100: 23, protein100: 2.4, fat100: 0.9, carbs100: 4.9, allergens: [] });
  i.olives = await getOrCreateIngredient("Black olives", { kcal100: 115, protein100: 0.8, fat100: 11, carbs100: 6, allergens: [] });
  i.lemon = await getOrCreateIngredient("Lemon", { kcal100: 29, protein100: 1.1, fat100: 0.3, carbs100: 9, allergens: [], gramsPerPiece: 58 });
  i.parsley = await getOrCreateIngredient("Fresh parsley", { kcal100: 36, protein100: 3, fat100: 0.8, carbs100: 6.3, allergens: [] });
  i.thyme = await getOrCreateIngredient("Fresh thyme", { kcal100: 101, protein100: 5.6, fat100: 1.7, carbs100: 24, allergens: [] });
  i.rosemary = await getOrCreateIngredient("Fresh rosemary", { kcal100: 131, protein100: 3.3, fat100: 5.9, carbs100: 20, allergens: [] });
  i.bayLeaves = await getOrCreateIngredient("Bay leaves", { kcal100: 313, protein100: 7.6, fat100: 8.4, carbs100: 75, allergens: [] });
  i.oregano = await getOrCreateIngredient("Dried oregano", { kcal100: 265, protein100: 9, fat100: 4.3, carbs100: 69, allergens: [] });
  i.chilliFlakes = await getOrCreateIngredient("Red chilli flakes", { kcal100: 318, protein100: 12, fat100: 17, carbs100: 57, allergens: [] });
  i.eggs = await getOrCreateIngredient("Eggs", { kcal100: 143, protein100: 13, fat100: 9.5, carbs100: 0.7, allergens: ["egg"], gramsPerPiece: 50 });
  i.salt = await getOrCreateIngredient("Fine sea salt", { kcal100: 0, protein100: 0, fat100: 0, carbs100: 0, allergens: [] });
  i.pepper = await getOrCreateIngredient("Black pepper", { kcal100: 251, protein100: 10, fat100: 3.3, carbs100: 64, allergens: [] });

  console.log("✅ Ingredients ready\n");

  // Helper to create recipe as draft
  async function createDraft(data: any) {
    const exists = await client.fetch(`*[_type == "recipe" && slug.current == $slug][0]`, { slug: data.slug.current });
    if (exists) {
      await client.patch(exists._id).set(data).commit();
      console.log(`✅ Updated: ${data.title}`);
      return;
    }
    const created = await client.create(data);
    await client.create({ ...data, _id: `drafts.${created._id}` });
    await client.delete(created._id);
    console.log(`✅ Created draft: ${data.title}`);
  }

  // RECIPE 1: Beef Brisket & Venison Stufato
  await createDraft({
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
    introText: "Zizzi's Beef Brisket & Venison Stufato is the ultimate Italian comfort food - a rich, hearty stew that's been slow-cooked to perfection. This luxurious dish combines tender beef brisket with lean venison in a deep red wine sauce infused with aromatic herbs and vegetables. The meat becomes melt-in-your-mouth tender after hours of gentle simmering, creating a sauce so flavourful it's worth every minute of patience. Served over creamy, cheesy polenta that soaks up all those incredible juices, this is the kind of meal that warms you from the inside out.",
    brandContext: [
      textBlock("Founded in 1999, Zizzi has grown from a single restaurant in Chiswick to become one of the UK's most loved Italian restaurant chains. With over 130 locations, Zizzi is known for bringing authentic Italian flavours to British high streets, using quality ingredients and traditional cooking methods."),
      textBlock("Their menu celebrates regional Italian cooking, from Roman-style pizzas to hearty northern Italian stews. The Beef Brisket & Venison Stufato showcases their commitment to premium ingredients and time-honoured techniques."),
    ],
    ingredients: [
      { _key: randomUUID(), _type: "ingredientGroup", groupName: "Stufato", items: [
        ingItem(ingRef(i.beefBrisket), "600", "g", "cut into chunks"),
        ingItem(ingRef(i.venison), "400", "g", "cut into chunks"),
        ingItem(ingRef(i.oliveOil), "3", "tbsp"),
        ingItem(ingRef(i.onion), "2", "piece", "diced"),
        ingItem(ingRef(i.carrot), "2", "piece", "diced"),
        ingItem(ingRef(i.celery), "2", "piece", "diced"),
        ingItem(ingRef(i.garlic), "4", "clove", "crushed"),
        ingItem(ingRef(i.redWine), "500", "ml"),
        ingItem(ingRef(i.beefStock), "500", "ml"),
        ingItem(ingRef(i.tomatoes), "400", "g"),
        ingItem(ingRef(i.thyme), "4", "sprig"),
        ingItem(ingRef(i.rosemary), "2", "sprig"),
        ingItem(ingRef(i.bayLeaves), "2", "piece"),
        ingItem(ingRef(i.salt), "1", "tsp"),
        ingItem(ingRef(i.pepper), "1", "tsp"),
      ]},
      { _key: randomUUID(), _type: "ingredientGroup", groupName: "Polenta", items: [
        ingItem(ingRef(i.polenta), "300", "g"),
        ingItem(ingRef(i.milk), "500", "ml"),
        ingItem(ingRef(i.chickenStock), "500", "ml"),
        ingItem(ingRef(i.butter), "50", "g"),
        ingItem(ingRef(i.parmesan), "50", "g", "grated"),
      ]},
    ],
    steps: [
      { _key: randomUUID(), _type: "object", step: [textBlock("Pat meat dry and season with salt and pepper.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Heat 2 tbsp oil in casserole dish over high heat.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Brown meat in batches, 8-10 minutes. Remove and set aside.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add remaining oil. Cook onions, carrots, celery for 8 minutes.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add garlic, cook 1 minute.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Pour in wine, boil, scrape bottom.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add stock, tomatoes, herbs, meat. Simmer.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Cover, oven at 150°C (130°C fan) for 3 hours.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("30 mins before serving: boil milk and stock.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Whisk in polenta gradually. Cook 20 mins, stirring.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Stir butter and parmesan into polenta.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Serve stufato over polenta with extra parmesan.")] },
    ],
    tips: [
      "Low, slow cooking is key for tender meat - don't rush.",
      "Use good quality red wine - it affects the final flavor.",
      "Make a day ahead for even better flavor.",
      "Stir polenta constantly to prevent lumps.",
      "Add more stock if stew looks dry during cooking.",
    ],
    faqs: [
      faq("Can I use just beef or just venison?", "Yes! Use 1kg of either. The combo adds complexity but one meat works great."),
      faq("Can I make this in a slow cooker?", "Absolutely! Brown meat and veg first, then 6-8 hours on low in slow cooker."),
      faq("What else can I serve with it?", "Mashed potatoes or pappardelle pasta work brilliantly."),
    ],
    nutrition: { calories: 685, protein: 52, fat: 28, carbs: 48 },
    seoTitle: "Zizzi Beef & Venison Stufato - Italian Stew Recipe",
    seoDescription: "Make Zizzi's beef & venison stufato! Rich Italian stew slow-cooked in red wine with creamy polenta. Restaurant-quality comfort food at home.",
  });

  // RECIPE 2: Chicken Milanese
  await createDraft({
    _type: "recipe",
    title: "Zizzi Chicken Milanese",
    slug: { _type: "slug", current: "zizzi-chicken-milanese" },
    brand: ingRef(brandId),
    categories: [
      { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
      { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
    ],
    description: "Crispy breaded chicken breast topped with fresh rocket, cherry tomatoes, and parmesan. A light, elegant Italian classic.",
    servings: 2,
    prepMin: 20,
    cookMin: 15,
    introText: "Zizzi's Chicken Milanese is Italian comfort food at its finest - a golden, crispy breaded chicken breast topped with a fresh, peppery rocket salad, sweet cherry tomatoes, and shavings of parmesan. Originating from Milan, this dish perfectly balances the rich, crispy chicken with bright, fresh toppings that cut through the richness. The panko breadcrumb coating creates an extra-crunchy exterior while keeping the chicken incredibly juicy inside. Finished with a squeeze of lemon and drizzle of olive oil, it's the kind of restaurant dish that's surprisingly simple to recreate at home and never fails to impress.",
    brandContext: [
      textBlock("Zizzi takes pride in bringing authentic Italian regional dishes to the UK, and their Chicken Milanese is a perfect example. This Milanese specialty has been a staple of northern Italian cooking for generations, traditionally served in the elegant restaurants and trattorias of Milan."),
      textBlock("The dish showcases Zizzi's approach to Italian cooking - respecting tradition while using the freshest ingredients. The combination of crispy, golden chicken with a vibrant salad on top creates a dish that's both indulgent and refreshing, perfect for any season."),
    ],
    ingredients: [
      { _key: randomUUID(), _type: "ingredientGroup", items: [
        ingItem(ingRef(i.chicken), "2", "piece", "butterflied"),
        ingItem(ingRef(i.flour), "50", "g"),
        ingItem(ingRef(i.eggs), "2", "piece", "beaten"),
        ingItem(ingRef(i.panko), "100", "g"),
        ingItem(ingRef(i.parmesan), "30", "g", "grated"),
        ingItem(ingRef(i.oliveOil), "4", "tbsp"),
        ingItem(ingRef(i.rocket), "80", "g"),
        ingItem(ingRef(i.cherryTom), "150", "g", "halved"),
        ingItem(ingRef(i.lemon), "1", "piece"),
        ingItem(ingRef(i.salt), "1", "tsp"),
        ingItem(ingRef(i.pepper), "0.5", "tsp"),
      ]},
    ],
    steps: [
      { _key: randomUUID(), _type: "object", step: [textBlock("Place chicken between cling film. Bash with rolling pin until 1cm thick.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Season chicken with salt and pepper.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Set up 3 bowls: flour, beaten eggs, panko mixed with half the parmesan.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Coat chicken in flour, then egg, then breadcrumbs. Press firmly.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Heat 3 tbsp oil in large frying pan over medium-high heat.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Fry chicken 4-5 minutes each side until golden and cooked through.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Drain on kitchen paper.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Toss rocket and tomatoes with remaining olive oil and lemon juice.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Place chicken on plates. Top with salad.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Garnish with remaining parmesan and lemon wedges.")] },
    ],
    tips: [
      "Bash chicken evenly for consistent cooking.",
      "Press breadcrumbs firmly so they stick well.",
      "Don't overcrowd the pan - cook one at a time if needed.",
      "Oil should be hot enough that breadcrumbs sizzle immediately.",
      "Dress the salad just before serving to keep it crisp.",
    ],
    faqs: [
      faq("Can I use regular breadcrumbs?", "Yes, but panko creates a much crunchier coating. It's worth seeking out!"),
      faq("Can I bake instead of frying?", "Yes! Spray with oil and bake at 200°C for 20-25 minutes, flipping halfway."),
      faq("What else can I serve with it?", "Spaghetti with tomato sauce, chips, or a simple green salad all work well."),
    ],
    nutrition: { calories: 565, protein: 48, fat: 28, carbs: 32 },
    seoTitle: "Zizzi Chicken Milanese - Crispy Italian Recipe",
    seoDescription: "Make Zizzi's chicken Milanese! Crispy breaded chicken with rocket salad, tomatoes & parmesan. Authentic Italian classic ready in 35 minutes.",
  });

  // RECIPE 3: Chicken Calabrese
  await createDraft({
    _type: "recipe",
    title: "Zizzi Chicken Calabrese",
    slug: { _type: "slug", current: "zizzi-chicken-calabrese" },
    brand: ingRef(brandId),
    categories: [
      { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
      { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
      { _type: "reference", _ref: CATEGORIES.spicy, _key: randomUUID() },
    ],
    description: "Spicy penne pasta with chicken, nduja, and mascarpone. A fiery southern Italian dish with creamy richness and bold flavors.",
    servings: 2,
    prepMin: 10,
    cookMin: 20,
    introText: "Zizzi's Chicken Calabrese brings the fiery flavors of southern Italy to your plate. This bold pasta dish features tender chicken and spicy nduja - a spreadable Calabrian sausage that adds incredible depth and heat. The heat is beautifully balanced by creamy mascarpone and fresh spinach, creating a sauce that's both rich and vibrant. Every bite delivers a perfect combination of spice, creaminess, and savory chicken. It's comfort food with a kick, ideal for those who love their pasta with personality. Ready in just 30 minutes, this restaurant favorite is surprisingly easy to make at home.",
    brandContext: [
      textBlock("Zizzi celebrates regional Italian diversity on their menu, and Chicken Calabrese showcases the bold, spicy cooking style of Calabria in southern Italy. This region is famous for nduja, a spicy, spreadable pork sausage that's become increasingly popular in the UK."),
      textBlock("The dish perfectly represents Zizzi's modern approach to Italian cooking - taking traditional regional ingredients and creating accessible, crowd-pleasing dishes. The combination of nduja's heat with mascarpone's luxury creates a pasta sauce that's become a firm favorite among Zizzi regulars."),
    ],
    ingredients: [
      { _key: randomUUID(), _type: "ingredientGroup", items: [
        ingItem(ingRef(i.penne), "300", "g"),
        ingItem(ingRef(i.chicken), "2", "piece", "cut into strips"),
        ingItem(ingRef(i.nduja), "60", "g"),
        ingItem(ingRef(i.mascarpone), "150", "g"),
        ingItem(ingRef(i.spinach), "100", "g"),
        ingItem(ingRef(i.garlic), "3", "clove", "sliced"),
        ingItem(ingRef(i.tomatoes), "200", "g"),
        ingItem(ingRef(i.chickenStock), "100", "ml"),
        ingItem(ingRef(i.parmesan), "30", "g", "grated"),
        ingItem(ingRef(i.oliveOil), "2", "tbsp"),
        ingItem(ingRef(i.salt), "1", "tsp"),
        ingItem(ingRef(i.pepper), "0.5", "tsp"),
      ]},
    ],
    steps: [
      { _key: randomUUID(), _type: "object", step: [textBlock("Cook penne in salted boiling water until al dente. Reserve 100ml pasta water, then drain.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Season chicken with salt and pepper.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Heat olive oil in large frying pan. Cook chicken 6-8 minutes until golden. Remove.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add garlic to pan, cook 30 seconds.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add nduja, breaking it up with wooden spoon. Cook 2 minutes.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add tomatoes and stock. Simmer 5 minutes.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Stir in mascarpone until smooth and creamy.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add spinach, wilt for 1 minute.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Return chicken and add cooked pasta. Toss well.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add pasta water if needed to loosen sauce.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Serve with grated parmesan on top.")] },
    ],
    tips: [
      "Nduja is spicy - start with less if you're heat-sensitive.",
      "Reserve pasta water - it helps create a silky sauce.",
      "Don't boil the sauce once mascarpone is added or it may split.",
      "Fresh spinach works better than frozen for this dish.",
      "Add a squeeze of lemon to brighten the flavors.",
    ],
    faqs: [
      faq("Where can I buy nduja?", "Most supermarkets stock it now in the deli section. Try Sainsbury's, Tesco, or Italian delis."),
      faq("Can I make it less spicy?", "Use less nduja (30-40g) and add more chicken for a milder version."),
      faq("What can I use instead of nduja?", "Chorizo or Italian sausage with chilli flakes, though nduja is unique!"),
    ],
    nutrition: { calories: 785, protein: 52, fat: 38, carbs: 62 },
    seoTitle: "Zizzi Chicken Calabrese - Spicy Pasta Recipe",
    seoDescription: "Make Zizzi's chicken Calabrese! Spicy nduja pasta with chicken, mascarpone & spinach. Bold Italian flavors ready in 30 minutes.",
  });

  // RECIPE 4: Mediterranean Sea Bass
  await createDraft({
    _type: "recipe",
    title: "Zizzi Mediterranean Sea Bass",
    slug: { _type: "slug", current: "zizzi-mediterranean-sea-bass" },
    brand: ingRef(brandId),
    categories: [
      { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
      { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
    ],
    description: "Pan-fried sea bass with Mediterranean sauce of tomatoes, capers, olives, and white wine. Light, fresh, and full of flavor.",
    servings: 2,
    prepMin: 10,
    cookMin: 20,
    introText: "Zizzi's Mediterranean Sea Bass is a celebration of fresh, simple Italian cooking at its best. Delicate sea bass fillets are pan-fried until the skin is golden and crispy, then served with a vibrant Mediterranean sauce bursting with cherry tomatoes, briny capers, and black olives. The white wine and herbs bring everything together in a light, fragrant sauce that enhances rather than overwhelms the delicate fish. This dish captures the essence of Italian coastal cooking - minimal ingredients, maximum flavor. It's elegant enough for a dinner party yet quick enough for a weeknight meal when you want something special.",
    brandContext: [
      textBlock("Zizzi's seafood dishes showcase their commitment to fresh, quality ingredients and simple preparation methods. This Mediterranean Sea Bass draws inspiration from Italy's extensive coastline, where fresh fish is paired with the bold, bright flavors of the Mediterranean - tomatoes, olives, capers, and herbs."),
      textBlock("The dish represents the lighter side of Zizzi's menu, perfect for those seeking a healthier option without sacrificing flavor. It's this kind of thoughtful, well-executed dish that has made Zizzi a trusted name for Italian dining across the UK."),
    ],
    ingredients: [
      { _key: randomUUID(), _type: "ingredientGroup", items: [
        ingItem(ingRef(i.seaBass), "2", "piece"),
        ingItem(ingRef(i.cherryTom), "200", "g", "halved"),
        ingItem(ingRef(i.olives), "50", "g", "pitted, halved"),
        ingItem(ingRef(i.capers), "2", "tbsp"),
        ingItem(ingRef(i.garlic), "3", "clove", "sliced"),
        ingItem(ingRef(i.whiteWine), "150", "ml"),
        ingItem(ingRef(i.chickenStock), "100", "ml"),
        ingItem(ingRef(i.parsley), "4", "tbsp", "chopped"),
        ingItem(ingRef(i.lemon), "1", "piece"),
        ingItem(ingRef(i.oliveOil), "3", "tbsp"),
        ingItem(ingRef(i.salt), "1", "tsp"),
        ingItem(ingRef(i.pepper), "0.5", "tsp"),
      ]},
    ],
    steps: [
      { _key: randomUUID(), _type: "object", step: [textBlock("Pat sea bass dry. Season with salt and pepper.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Heat 2 tbsp oil in large frying pan over medium-high heat.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Place fish skin-side down. Cook 4 minutes without moving.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Flip carefully. Cook 2-3 minutes until cooked through. Remove and keep warm.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add remaining oil and garlic to pan. Cook 1 minute.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add cherry tomatoes. Cook 2 minutes until softening.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Pour in white wine. Simmer until reduced by half.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add stock, olives, and capers. Simmer 3 minutes.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Stir in parsley and squeeze of lemon juice.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Return fish to pan briefly to warm through.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Serve fish with sauce spooned over. Garnish with lemon wedges.")] },
    ],
    tips: [
      "Don't move the fish when skin-side down - let it crisp up.",
      "Room temperature fish cooks more evenly than fridge-cold.",
      "Use a fish slice to flip carefully - sea bass is delicate.",
      "Rinse capers if they're very salty.",
      "Serve with crusty bread to soak up the delicious sauce.",
    ],
    faqs: [
      faq("Can I use other fish?", "Yes! Cod, haddock, or salmon all work well with this Mediterranean sauce."),
      faq("How do I know when sea bass is cooked?", "The flesh should be opaque and flake easily when pressed with a fork."),
      faq("Can I make the sauce ahead?", "Yes, make the sauce earlier and reheat gently while you cook fresh fish."),
    ],
    nutrition: { calories: 385, protein: 42, fat: 18, carbs: 8 },
    seoTitle: "Zizzi Mediterranean Sea Bass - Italian Fish Recipe",
    seoDescription: "Make Zizzi's Mediterranean sea bass! Pan-fried fish with tomatoes, capers, olives & white wine. Fresh Italian seafood in 30 minutes.",
  });

  console.log("\n🎉 Batch 1 complete! 4 recipes created.\n");
}

main().catch(console.error);
