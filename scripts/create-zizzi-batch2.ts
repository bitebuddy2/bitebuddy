// scripts/create-zizzi-batch2.ts - Recipes 5-8
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
  console.log("🍝 Creating Zizzi Batch 2 (Recipes 5-8)...\n");

  // Get brand
  const brandId = (await client.fetch(`*[_type == "brand" && name == "Zizzi"][0]`))._id;

  // Get/create ingredients
  const i: any = {};
  i.salmon = await getOrCreateIngredient("Salmon fillets", { kcal100: 208, protein100: 20, fat100: 13, carbs100: 0, allergens: ["fish"] });
  i.arborioRice = await getOrCreateIngredient("Arborio rice", { kcal100: 349, protein100: 6.5, fat100: 0.6, carbs100: 77, allergens: [] });
  i.basil = await getOrCreateIngredient("Fresh basil", { kcal100: 23, protein100: 3.2, fat100: 0.6, carbs100: 2.7, allergens: [] });
  i.pineNuts = await getOrCreateIngredient("Pine nuts", { kcal100: 673, protein100: 14, fat100: 68, carbs100: 13, allergens: ["nuts"] });
  i.chestnutMush = await getOrCreateIngredient("Chestnut mushrooms", { kcal100: 22, protein100: 3.1, fat100: 0.3, carbs100: 3.3, allergens: [] });
  i.porcini = await getOrCreateIngredient("Porcini mushrooms", { kcal100: 370, protein100: 30, fat100: 3, carbs100: 60, allergens: [] });
  i.truffleOil = await getOrCreateIngredient("Truffle oil", { kcal100: 884, protein100: 0, fat100: 100, carbs100: 0, allergens: [], density_g_per_ml: 0.92 });
  i.pizzaDough = await getOrCreateIngredient("Pizza dough", { kcal100: 266, protein100: 9, fat100: 3.5, carbs100: 49, allergens: ["gluten"] });
  i.mozzarella = await getOrCreateIngredient("Mozzarella", { kcal100: 280, protein100: 18, fat100: 22, carbs100: 3.1, allergens: ["milk"] });
  i.ricotta = await getOrCreateIngredient("Ricotta", { kcal100: 174, protein100: 11, fat100: 13, carbs100: 3.0, allergens: ["milk"] });
  i.pepperoni = await getOrCreateIngredient("Pepperoni", { kcal100: 504, protein100: 23, fat100: 45, carbs100: 1, allergens: [] });
  i.italianSausage = await getOrCreateIngredient("Italian sausage", { kcal100: 346, protein100: 13, fat100: 32, carbs100: 2, allergens: [] });
  i.chicken = await getOrCreateIngredient("Chicken breast", { kcal100: 165, protein100: 31, fat100: 3.6, carbs100: 0, allergens: [] });
  i.spinach = await getOrCreateIngredient("Baby spinach", { kcal100: 23, protein100: 2.9, fat100: 0.4, carbs100: 3.6, allergens: [] });
  i.nduja = await getOrCreateIngredient("Nduja", { kcal100: 450, protein100: 15, fat100: 42, carbs100: 2, allergens: [] });
  i.parmesan = await getOrCreateIngredient("Parmesan", { kcal100: 431, protein100: 38, fat100: 29, carbs100: 4.1, allergens: ["milk"] });
  i.butter = await getOrCreateIngredient("Unsalted butter", { kcal100: 717, protein100: 0.9, fat100: 81, carbs100: 0.1, allergens: ["milk"] });
  i.doubleCream = await getOrCreateIngredient("Double cream", { kcal100: 449, protein100: 1.7, fat100: 48, carbs100: 2.7, allergens: ["milk"], density_g_per_ml: 1.01 });
  i.onion = await getOrCreateIngredient("White onion", { kcal100: 40, protein100: 1.1, fat100: 0.1, carbs100: 9.3, allergens: [], gramsPerPiece: 150 });
  i.garlic = await getOrCreateIngredient("Garlic", { kcal100: 149, protein100: 6.4, fat100: 0.5, carbs100: 33, allergens: [], gramsPerPiece: 5 });
  i.oliveOil = await getOrCreateIngredient("Olive oil", { kcal100: 884, protein100: 0, fat100: 100, carbs100: 0, allergens: [], density_g_per_ml: 0.92 });
  i.whiteWine = await getOrCreateIngredient("White wine", { kcal100: 82, protein100: 0.1, fat100: 0, carbs100: 2.6, allergens: ["sulphites"], density_g_per_ml: 0.99 });
  i.chickenStock = await getOrCreateIngredient("Chicken stock", { kcal100: 4, protein100: 0.4, fat100: 0.2, carbs100: 0.4, allergens: ["celery"], density_g_per_ml: 1.0 });
  i.passata = await getOrCreateIngredient("Passata", { kcal100: 35, protein100: 1.4, fat100: 0.3, carbs100: 7.5, allergens: [], density_g_per_ml: 1.0 });
  i.oregano = await getOrCreateIngredient("Dried oregano", { kcal100: 265, protein100: 9, fat100: 4.3, carbs100: 69, allergens: [] });
  i.chilliFlakes = await getOrCreateIngredient("Red chilli flakes", { kcal100: 318, protein100: 12, fat100: 17, carbs100: 57, allergens: [] });
  i.salt = await getOrCreateIngredient("Fine sea salt", { kcal100: 0, protein100: 0, fat100: 0, carbs100: 0, allergens: [] });
  i.pepper = await getOrCreateIngredient("Black pepper", { kcal100: 251, protein100: 10, fat100: 3.3, carbs100: 64, allergens: [] });
  i.lemon = await getOrCreateIngredient("Lemon", { kcal100: 29, protein100: 1.1, fat100: 0.3, carbs100: 9, allergens: [], gramsPerPiece: 58 });

  console.log("✅ Ingredients ready\n");

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

  // RECIPE 5: Pan-Fried Salmon & Pesto Risotto
  await createDraft({
    _type: "recipe",
    title: "Zizzi Pan-Fried Salmon & Pesto Risotto",
    slug: { _type: "slug", current: "zizzi-pan-fried-salmon-pesto-risotto" },
    brand: ingRef(brandId),
    categories: [
      { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
      { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
    ],
    description: "Crispy salmon fillets over creamy basil pesto risotto. A luxurious Italian dish combining perfectly cooked fish with rich, herb-infused rice.",
    servings: 2,
    prepMin: 15,
    cookMin: 35,
    introText: "Zizzi's Pan-Fried Salmon & Pesto Risotto is Italian comfort food elevated to restaurant elegance. Creamy arborio rice is slowly cooked to perfection, then enriched with vibrant homemade basil pesto, creating a luxurious green risotto that's both decadent and fresh. Topped with beautifully pan-fried salmon fillets with crispy skin and tender, flaky flesh, every forkful delivers contrasting textures and complementary flavors. The herbaceous pesto brings brightness to the rich risotto, while the salmon adds protein and omega-3 goodness. It's the kind of sophisticated dish that feels special but is surprisingly achievable at home with patience and good ingredients.",
    brandContext: [
      textBlock("Zizzi's risottos are famous for their creamy texture and bold flavors. This Salmon & Pesto Risotto showcases their skill in combining classic Italian techniques with contemporary ingredients. Risotto requires attention and care - qualities that Zizzi brings to every dish on their menu."),
      textBlock("The addition of homemade pesto transforms a simple risotto into something extraordinary, while the pan-fried salmon adds elegance and nutrition. It's this kind of thoughtful recipe development that has made Zizzi a favorite for special occasions and date nights across the UK."),
    ],
    ingredients: [
      { _key: randomUUID(), _type: "ingredientGroup", groupName: "Pesto", items: [
        ingItem(ingRef(i.basil), "50", "g"),
        ingItem(ingRef(i.pineNuts), "30", "g"),
        ingItem(ingRef(i.parmesan), "40", "g", "grated"),
        ingItem(ingRef(i.garlic), "1", "clove"),
        ingItem(ingRef(i.oliveOil), "80", "ml"),
        ingItem(ingRef(i.lemon), "0.5", "piece", "juice only"),
      ]},
      { _key: randomUUID(), _type: "ingredientGroup", groupName: "Risotto & Salmon", items: [
        ingItem(ingRef(i.salmon), "2", "piece"),
        ingItem(ingRef(i.arborioRice), "200", "g"),
        ingItem(ingRef(i.onion), "1", "piece", "finely diced"),
        ingItem(ingRef(i.garlic), "2", "clove", "minced"),
        ingItem(ingRef(i.whiteWine), "100", "ml"),
        ingItem(ingRef(i.chickenStock), "800", "ml", "hot"),
        ingItem(ingRef(i.butter), "50", "g"),
        ingItem(ingRef(i.parmesan), "50", "g", "grated"),
        ingItem(ingRef(i.doubleCream), "50", "ml"),
        ingItem(ingRef(i.oliveOil), "3", "tbsp"),
        ingItem(ingRef(i.salt), "1", "tsp"),
        ingItem(ingRef(i.pepper), "0.5", "tsp"),
      ]},
    ],
    steps: [
      { _key: randomUUID(), _type: "object", step: [textBlock("Make pesto: blend basil, pine nuts, parmesan, garlic, and lemon juice.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Slowly drizzle in olive oil while blending until smooth. Season and set aside.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Heat 2 tbsp oil in large pan. Cook onion 5 minutes until soft.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add garlic, cook 1 minute. Add rice, toast for 2 minutes, stirring.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Pour in wine, stir until absorbed.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add hot stock one ladle at a time, stirring constantly. Wait until absorbed before adding more.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Continue for 20-25 minutes until rice is creamy and al dente.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Meanwhile, season salmon. Heat 1 tbsp oil in frying pan.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Cook salmon skin-side down 4 minutes. Flip, cook 3 minutes. Remove.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Stir butter, cream, parmesan, and 4 tbsp pesto into risotto.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Season to taste.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Serve risotto topped with salmon and extra pesto drizzle.")] },
    ],
    tips: [
      "Keep stock hot in a separate pan throughout cooking.",
      "Stir risotto constantly for the creamiest texture.",
      "Don't rush the risotto - slow and steady wins.",
      "Toast pine nuts lightly before blending for deeper flavor.",
      "Leftover pesto keeps in the fridge for a week.",
    ],
    faqs: [
      faq("Can I use shop-bought pesto?", "Yes, but homemade is fresher and brighter. Use 100g good quality fresh pesto."),
      faq("What if I don't have arborio rice?", "Carnaroli or other risotto rice works. Don't use long grain - it won't be creamy."),
      faq("Can I make risotto ahead?", "Best fresh, but you can partially cook it, spread on a tray to cool, then finish later."),
    ],
    nutrition: { calories: 815, protein: 48, fat: 42, carbs: 62 },
    seoTitle: "Zizzi Salmon & Pesto Risotto - Italian Recipe",
    seoDescription: "Make Zizzi's salmon & pesto risotto! Creamy basil risotto with crispy pan-fried salmon. Restaurant-quality Italian dish in 50 minutes.",
  });

  // RECIPE 6: Roasted Mushroom Risotto
  await createDraft({
    _type: "recipe",
    title: "Zizzi Roasted Mushroom Risotto",
    slug: { _type: "slug", current: "zizzi-roasted-mushroom-risotto" },
    brand: ingRef(brandId),
    categories: [
      { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
      { _type: "reference", _ref: CATEGORIES.vegetarian, _key: randomUUID() },
    ],
    description: "Creamy risotto with roasted mushrooms and truffle oil. A rich, earthy vegetarian dish that's pure umami comfort.",
    servings: 2,
    prepMin: 15,
    cookMin: 35,
    introText: "Zizzi's Roasted Mushroom Risotto is proof that vegetarian food can be deeply satisfying and luxurious. This dish celebrates mushrooms in all their glory - a mix of chestnut and porcini mushrooms roasted until caramelized and intensely flavored, then stirred through creamy arborio risotto. The finishing touch of truffle oil adds an earthy, aromatic quality that elevates the dish to restaurant standards. Each spoonful delivers layers of umami richness, creamy texture, and the distinctive aroma of truffles. It's comfort food that feels elegant, perfect for impressing vegetarian guests or treating yourself to something special.",
    brandContext: [
      textBlock("Zizzi has always championed vegetarian dishes that stand on their own merit, not as afterthoughts. This Roasted Mushroom Risotto showcases their commitment to creating meat-free meals that are every bit as indulgent and satisfying as their meat-based counterparts."),
      textBlock("The use of truffle oil demonstrates Zizzi's dedication to premium ingredients. Combined with perfectly roasted mushrooms and creamy risotto, this dish has become a favorite among vegetarians and meat-eaters alike - testament to how delicious plant-based Italian cooking can be."),
    ],
    ingredients: [
      { _key: randomUUID(), _type: "ingredientGroup", items: [
        ingItem(ingRef(i.chestnutMush), "300", "g", "sliced"),
        ingItem(ingRef(i.porcini), "20", "g", "dried"),
        ingItem(ingRef(i.arborioRice), "200", "g"),
        ingItem(ingRef(i.onion), "1", "piece", "finely diced"),
        ingItem(ingRef(i.garlic), "3", "clove", "minced"),
        ingItem(ingRef(i.whiteWine), "100", "ml"),
        ingItem(ingRef(i.chickenStock), "900", "ml", "hot"),
        ingItem(ingRef(i.butter), "50", "g"),
        ingItem(ingRef(i.parmesan), "60", "g", "grated"),
        ingItem(ingRef(i.doubleCream), "50", "ml"),
        ingItem(ingRef(i.truffleOil), "2", "tsp"),
        ingItem(ingRef(i.oliveOil), "3", "tbsp"),
        ingItem(ingRef(i.salt), "1", "tsp"),
        ingItem(ingRef(i.pepper), "0.5", "tsp"),
      ]},
    ],
    steps: [
      { _key: randomUUID(), _type: "object", step: [textBlock("Soak dried porcini in 100ml hot stock for 20 minutes. Drain, reserving liquid.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Preheat oven to 200°C. Toss mushrooms with 2 tbsp olive oil, salt, and pepper.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Roast mushrooms for 20 minutes until golden and caramelized.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Heat remaining oil in large pan. Cook onion 5 minutes.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add garlic, cook 1 minute. Add rice, toast 2 minutes.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Pour in wine, stir until absorbed.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Add porcini soaking liquid, then hot stock one ladle at a time, stirring constantly.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Continue for 20-25 minutes until rice is creamy and al dente.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Stir in roasted mushrooms (reserving some for topping), butter, cream, and half the parmesan.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Season to taste.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Serve topped with reserved mushrooms, remaining parmesan, and truffle oil drizzle.")] },
    ],
    tips: [
      "Don't skip roasting - it concentrates mushroom flavor dramatically.",
      "Porcini soaking liquid adds incredible depth.",
      "Use vegetable stock for a fully vegetarian version.",
      "A little truffle oil goes a long way - don't overdo it.",
      "Stir risotto patiently for the best creamy texture.",
    ],
    faqs: [
      faq("Can I use other mushrooms?", "Yes! Oyster, shiitake, or portobello all work beautifully. Mix varieties for complexity."),
      faq("Is truffle oil essential?", "It adds luxury, but the dish is still delicious without it. Try finishing with fresh herbs instead."),
      faq("Can I make this vegan?", "Yes! Use vegan butter, nutritional yeast instead of parmesan, and coconut cream."),
    ],
    nutrition: { calories: 695, protein: 22, fat: 32, carbs: 78 },
    seoTitle: "Zizzi Mushroom Risotto - Vegetarian Italian Recipe",
    seoDescription: "Make Zizzi's roasted mushroom risotto! Creamy vegetarian risotto with truffle oil. Rich, earthy Italian comfort food in 50 minutes.",
  });

  // RECIPE 7: Calzone Carne Piccante
  await createDraft({
    _type: "recipe",
    title: "Zizzi Calzone Carne Piccante",
    slug: { _type: "slug", current: "zizzi-calzone-carne-piccante" },
    brand: ingRef(brandId),
    categories: [
      { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
      { _type: "reference", _ref: CATEGORIES.spicy, _key: randomUUID() },
    ],
    description: "Spicy folded pizza stuffed with pepperoni, sausage, nduja, and mozzarella. A fiery Italian pocket of meaty, cheesy goodness.",
    servings: 2,
    prepMin: 20,
    cookMin: 25,
    introText: "Zizzi's Calzone Carne Piccante is a spicy meat-lover's dream wrapped in crispy, golden pizza dough. This folded pizza is generously stuffed with pepperoni, Italian sausage, and spicy nduja, all held together with melted mozzarella and tangy tomato sauce. The name means 'spicy meat calzone' in Italian, and it delivers on that promise with layers of heat and savory flavors. Baked until the crust is crisp and the cheese is bubbling, each slice reveals a molten, flavorful interior that's deeply satisfying. It's Italian comfort food with attitude - perfect for those who like their pizza with a kick.",
    brandContext: [
      textBlock("Zizzi's calzones offer a fun alternative to traditional pizza, transforming familiar ingredients into a portable, self-contained meal. The Calzone Carne Piccante represents their bold, flavor-forward approach to Italian classics, bringing together premium meats and authentic spicy ingredients."),
      textBlock("Calzones originated in Naples as a way to make pizza portable for workers. Zizzi's version honors this tradition while adding contemporary touches like nduja, creating a dish that's both authentic and exciting for modern tastes."),
    ],
    ingredients: [
      { _key: randomUUID(), _type: "ingredientGroup", items: [
        ingItem(ingRef(i.pizzaDough), "400", "g"),
        ingItem(ingRef(i.pepperoni), "100", "g", "sliced"),
        ingItem(ingRef(i.italianSausage), "150", "g", "cooked and crumbled"),
        ingItem(ingRef(i.nduja), "40", "g"),
        ingItem(ingRef(i.mozzarella), "200", "g", "torn"),
        ingItem(ingRef(i.passata), "150", "ml"),
        ingItem(ingRef(i.garlic), "2", "clove", "minced"),
        ingItem(ingRef(i.oregano), "1", "tsp"),
        ingItem(ingRef(i.chilliFlakes), "1", "tsp"),
        ingItem(ingRef(i.oliveOil), "2", "tbsp"),
        ingItem(ingRef(i.salt), "0.5", "tsp"),
      ]},
    ],
    steps: [
      { _key: randomUUID(), _type: "object", step: [textBlock("Preheat oven to 220°C (200°C fan). Line baking tray.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Mix passata with garlic, oregano, and half the chilli flakes. Season.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Divide dough in half. Roll each into 25cm circle.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Spread sauce on one half of each circle, leaving 2cm border.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Top sauce with mozzarella, pepperoni, sausage, and dollops of nduja.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Fold dough over filling to create half-moon shape.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Press edges firmly and crimp with fork to seal completely.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Brush with olive oil. Sprinkle with remaining chilli flakes.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Cut small slits in top for steam to escape.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Bake 20-25 minutes until golden brown and crispy.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Rest 5 minutes before serving with extra passata for dipping.")] },
    ],
    tips: [
      "Seal edges very well or filling will leak during baking.",
      "Let dough come to room temperature for easier rolling.",
      "Don't overfill or the calzone will burst.",
      "Steam vents are essential - don't skip them.",
      "Serve immediately while cheese is still melty.",
    ],
    faqs: [
      faq("Can I use shop-bought dough?", "Absolutely! Fresh pizza dough from supermarkets works perfectly."),
      faq("Can I make it less spicy?", "Yes - use less nduja and skip the chilli flakes. It'll still be delicious."),
      faq("Can I freeze unbaked calzones?", "Yes! Freeze on a tray, then bag. Bake from frozen, adding 5 minutes to cooking time."),
    ],
    nutrition: { calories: 865, protein: 42, fat: 48, carbs: 68 },
    seoTitle: "Zizzi Calzone Carne Piccante - Spicy Pizza Recipe",
    seoDescription: "Make Zizzi's spicy meat calzone! Folded pizza stuffed with pepperoni, sausage, nduja & mozzarella. Fiery Italian feast in 45 minutes.",
  });

  // RECIPE 8: Calzone Pollo Spinaci
  await createDraft({
    _type: "recipe",
    title: "Zizzi Calzone Pollo Spinaci",
    slug: { _type: "slug", current: "zizzi-calzone-pollo-spinaci" },
    brand: ingRef(brandId),
    categories: [
      { _type: "reference", _ref: CATEGORIES.mains, _key: randomUUID() },
      { _type: "reference", _ref: CATEGORIES.highProtein, _key: randomUUID() },
    ],
    description: "Folded pizza filled with chicken, spinach, ricotta, and mozzarella. A lighter calzone packed with protein and flavor.",
    servings: 2,
    prepMin: 20,
    cookMin: 25,
    introText: "Zizzi's Calzone Pollo Spinaci offers a lighter take on the classic folded pizza. This elegant calzone is filled with tender chicken, fresh spinach, creamy ricotta, and melted mozzarella - a combination that's both nutritious and incredibly satisfying. The ricotta adds a luxurious creaminess that contrasts beautifully with the lean chicken and vibrant spinach, while the mozzarella provides that essential stretchy cheese pull. Baked until the crust is golden and crispy, this calzone is comfort food that won't leave you feeling heavy. It's the perfect choice when you want the indulgence of pizza with a bit more balance.",
    brandContext: [
      textBlock("Zizzi understands that diners want options that feel lighter without sacrificing flavor or satisfaction. The Calzone Pollo Spinaci showcases how Italian cooking naturally incorporates vegetables and lean proteins, creating balanced meals that are still deeply comforting."),
      textBlock("This calzone reflects Zizzi's commitment to offering diverse menu options for different preferences and occasions. Whether you're after something lighter or simply prefer chicken to red meat, this calzone delivers all the satisfaction of traditional Italian cooking with a healthier profile."),
    ],
    ingredients: [
      { _key: randomUUID(), _type: "ingredientGroup", items: [
        ingItem(ingRef(i.pizzaDough), "400", "g"),
        ingItem(ingRef(i.chicken), "2", "piece", "cooked and sliced"),
        ingItem(ingRef(i.spinach), "150", "g"),
        ingItem(ingRef(i.ricotta), "150", "g"),
        ingItem(ingRef(i.mozzarella), "150", "g", "torn"),
        ingItem(ingRef(i.passata), "150", "ml"),
        ingItem(ingRef(i.garlic), "2", "clove", "minced"),
        ingItem(ingRef(i.oregano), "1", "tsp"),
        ingItem(ingRef(i.parmesan), "30", "g", "grated"),
        ingItem(ingRef(i.lemon), "0.5", "piece", "zest only"),
        ingItem(ingRef(i.oliveOil), "2", "tbsp"),
        ingItem(ingRef(i.salt), "0.5", "tsp"),
        ingItem(ingRef(i.pepper), "0.5", "tsp"),
      ]},
    ],
    steps: [
      { _key: randomUUID(), _type: "object", step: [textBlock("Preheat oven to 220°C (200°C fan). Line baking tray.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Wilt spinach in pan with splash of water. Squeeze out excess liquid.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Mix ricotta with parmesan, lemon zest, salt, and pepper.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Mix passata with garlic and oregano.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Divide dough in half. Roll each into 25cm circle.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Spread sauce on one half of each circle, leaving 2cm border.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Top with ricotta mixture, chicken, spinach, and mozzarella.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Fold dough over filling. Press edges and crimp with fork to seal.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Brush with olive oil. Cut small slits in top.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Bake 20-25 minutes until golden and crispy.")] },
      { _key: randomUUID(), _type: "object", step: [textBlock("Rest 5 minutes. Serve with side salad and extra passata.")] },
    ],
    tips: [
      "Squeeze spinach really well - excess water makes soggy calzone.",
      "Use leftover roast chicken for even quicker prep.",
      "Seal edges properly to prevent filling leaking out.",
      "The lemon zest in ricotta adds brightness - don't skip it.",
      "Let rest before cutting so filling doesn't spill out.",
    ],
    faqs: [
      faq("Can I use frozen spinach?", "Yes, but defrost and squeeze it very dry first. Fresh has better texture though."),
      faq("Can I add other vegetables?", "Absolutely! Roasted peppers, sun-dried tomatoes, or mushrooms all work beautifully."),
      faq("How do I prevent soggy bottom?", "Bake on a preheated pizza stone or very hot baking tray for crispiest base."),
    ],
    nutrition: { calories: 745, protein: 52, fat: 32, carbs: 66 },
    seoTitle: "Zizzi Chicken & Spinach Calzone - Italian Recipe",
    seoDescription: "Make Zizzi's chicken & spinach calzone! Folded pizza with chicken, ricotta, spinach & mozzarella. Lighter Italian classic in 45 minutes.",
  });

  console.log("\n🎉 Batch 2 complete! All 8 Zizzi recipes created.\n");
}

main().catch(console.error);
