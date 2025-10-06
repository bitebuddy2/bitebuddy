// scripts/create-mcdonalds-sausage-egg-mcmuffin.ts
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

// Ingredient data for McDonald's Sausage & Egg McMuffin
const ingredients = [
  // Main components
  {
    name: "English muffins",
    synonyms: ["English muffin", "breakfast muffin"],
    kcal100: 232,
    protein100: 7.6,
    fat100: 1.4,
    carbs100: 46,
    allergens: ["gluten"],
    gramsPerPiece: 60,
  },
  {
    name: "Pork sausage patties",
    synonyms: ["breakfast sausage patty", "sausage patty"],
    kcal100: 346,
    protein100: 13,
    fat100: 32,
    carbs100: 1.5,
    allergens: [],
    gramsPerPiece: 50,
  },
  {
    name: "Medium eggs",
    synonyms: ["eggs", "hen eggs"],
    kcal100: 143,
    protein100: 13,
    fat100: 9.5,
    carbs100: 0.7,
    allergens: ["eggs"],
    gramsPerPiece: 58,
  },
  {
    name: "American cheese slices",
    synonyms: ["American cheese", "processed cheese slices"],
    kcal100: 375,
    protein100: 18,
    fat100: 31,
    carbs100: 5,
    allergens: ["dairy"],
    gramsPerPiece: 20,
  },
  {
    name: "Butter",
    synonyms: ["salted butter", "unsalted butter"],
    kcal100: 717,
    protein100: 0.9,
    fat100: 81,
    carbs100: 0.1,
    allergens: ["dairy"],
    density_g_per_ml: 0.911,
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
    name: "Black pepper",
    synonyms: ["ground black pepper"],
    kcal100: 251,
    protein100: 10,
    fat100: 3.3,
    carbs100: 64,
    allergens: [],
  },
];

async function createOrGetIngredient(ingredientData: typeof ingredients[0]) {
  // Check if ingredient already exists by name
  const existing = await client.fetch(
    `*[_type == "ingredient" && name == $name][0]`,
    { name: ingredientData.name }
  );

  if (existing) {
    console.log(`✅ Found existing ingredient: ${ingredientData.name}`);
    return existing._id;
  }

  // Also check synonyms to avoid duplicates
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
  console.log("Creating ingredients...\n");

  // Create or get all ingredients and store their IDs
  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  // Check if recipe already exists
  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "mcdonalds-sausage-egg-mcmuffin"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  // Get McDonald's brand
  const mcdonaldsBrand = await client.fetch(
    `*[_type == "brand" && slug.current == "mcdonalds"][0]`
  );

  if (!mcdonaldsBrand) {
    console.log("⚠️  McDonald's brand not found - recipe will be created without brand reference");
  }

  const recipeData = {
    _type: "recipe",
    title: "McDonald's Sausage & Egg McMuffin",
    slug: {
      _type: "slug",
      current: "mcdonalds-sausage-egg-mcmuffin",
    },
    description:
      "Recreate the iconic McDonald's Sausage & Egg McMuffin at home with this easy breakfast recipe. Perfectly toasted English muffin, savory sausage patty, fluffy egg, and melted cheese - ready in just 15 minutes.",
    servings: 4,
    prepMin: 10,
    cookMin: 15,
    kcal: 470,
    introText:
      "The McDonald's Sausage & Egg McMuffin is a breakfast legend that has been fueling mornings since 1971. This iconic sandwich features a perfectly seasoned pork sausage patty, a fluffy folded egg, melted American cheese, all sandwiched between a toasted English muffin. What makes it special is the simple yet perfect combination of flavors and textures - the crispy muffin, juicy sausage, soft egg, and creamy cheese create breakfast harmony. This homemade version lets you enjoy that same McDonald's breakfast magic anytime, with the bonus of using quality ingredients and customizing it to your taste. Whether you're craving a weekend breakfast treat or need a quick weekday morning fuel-up, this copycat recipe delivers authentic McDonald's taste without leaving your kitchen.",
    ...(mcdonaldsBrand && {
      brand: {
        _type: "reference",
        _ref: mcdonaldsBrand._id,
      },
    }),
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "McDonald's breakfast menu revolutionized fast food when it launched in the 1970s, and the Sausage & Egg McMuffin quickly became one of its most beloved offerings. Created as a variation of the original Egg McMuffin (which featured Canadian bacon), this sausage version appealed to those who preferred a heartier, more flavorful breakfast meat.",
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
            text: "The genius of the McMuffin lies in its portability and perfectly balanced proportions. Each component is carefully sized to create the ideal bite - the egg is cooked in special round molds to fit the muffin, the sausage patty is precisely seasoned, and the cheese melts at just the right temperature. This recipe replicates that winning formula, giving you restaurant-quality breakfast sandwiches at a fraction of the cost.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "Main Ingredients",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["English muffins"],
            },
            quantity: "4",
            unit: "",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Pork sausage patties"],
            },
            quantity: "4",
            unit: "",
            notes: "about 50g each",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Medium eggs"],
            },
            quantity: "4",
            unit: "",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["American cheese slices"],
            },
            quantity: "4",
            unit: "slices",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Butter"],
            },
            quantity: "2",
            unit: "tbsp",
            notes: "for toasting muffins",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fine sea salt"],
            },
            quantity: "",
            unit: "",
            notes: "to taste",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Black pepper"],
            },
            quantity: "",
            unit: "",
            notes: "to taste",
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
                text: "Heat a large frying pan or griddle over medium heat. Cook the sausage patties for 3-4 minutes per side until golden brown and cooked through (internal temperature should reach 70°C/160°F). Remove and keep warm.",
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
                text: "While the sausages cook, prepare the egg rings. You can use 4 metal egg rings or mason jar lids (about 10cm diameter). Spray them lightly with oil and place in the same pan.",
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
                text: "Crack one egg into each ring. Use a fork to gently break the yolk and swirl it slightly (McDonald's style uses folded eggs). Season with a pinch of salt and pepper. Cover the pan with a lid and cook for 2-3 minutes until the eggs are just set.",
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
                text: "While the eggs cook, split the English muffins in half and butter the cut sides. Toast them in a separate pan or under the grill until golden and crispy, about 2-3 minutes.",
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
                text: "Remove the egg rings carefully (use a knife to loosen the edges if needed). Place a slice of American cheese on each sausage patty and let it melt slightly from the residual heat.",
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
                text: "Assemble your McMuffins: place a sausage patty with cheese on the bottom half of each toasted muffin, top with a folded egg, then place the muffin top on. Press down gently to compact slightly.",
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
                text: "Serve immediately while hot. For an authentic McDonald's experience, wrap each McMuffin in parchment paper or foil and let sit for 1 minute - this allows the cheese to melt perfectly and the flavors to meld together.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "For the best results, use good quality pork sausage patties or make your own by mixing minced pork with sage, salt, and pepper, then forming into thin patties.",
      "If you don't have egg rings, you can fold the eggs: beat them in a bowl, pour into a greased pan in a thin layer, cook until just set, then fold into quarters.",
      "To save time in the morning, cook the sausage patties and eggs the night before. Store in the fridge and reheat in the microwave for 30 seconds when assembling.",
      "For a healthier version, use turkey sausage patties and reduced-fat cheese. You can also use wholemeal English muffins.",
      "Make these ahead and freeze: wrap assembled (but untoasted) McMuffins individually in foil, freeze for up to 1 month. Reheat from frozen in the oven at 180°C for 20-25 minutes.",
      "For extra flavor, add a dash of hot sauce or ketchup inside the muffin - many McDonald's fans swear by this addition!",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use a different type of cheese?",
        answer:
          "While American cheese gives that authentic McDonald's taste and melts perfectly, you can use cheddar, Swiss, or even a cheese slice alternative. Just note that the melting properties and flavor will be slightly different.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I make the egg look like McDonald's folded egg?",
        answer:
          "McDonald's uses a special egg mixture that's poured into rectangular molds and folded. At home, you can achieve a similar effect by cooking the egg in a round ring, then gently folding the sides under once cooked. Alternatively, scramble the eggs lightly and cook flat.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What if I can't find English muffins?",
        answer:
          "English muffins are essential for the authentic taste and texture, but in a pinch, you can use regular bread rolls or bagels. Toast them well for the best texture. The muffin's nooks and crannies do help hold everything together though!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this vegetarian?",
        answer:
          "Absolutely! Replace the pork sausage with vegetarian sausage patties (many supermarkets sell breakfast-style veggie patties) or make your own using beans and spices formed into patties. The rest of the recipe stays the same.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I reheat a frozen McMuffin?",
        answer:
          "Wrap the frozen McMuffin in a paper towel and microwave for 1-2 minutes until heated through. For a crispier result, unwrap and bake at 180°C for 20 minutes. The microwave is quicker but the oven gives better texture.",
      },
    ],
    nutrition: {
      calories: 470,
      protein: 21,
      fat: 28,
      carbs: 32,
    },
    seoTitle: "McDonald's Sausage & Egg McMuffin Recipe - Easy Copycat Breakfast",
    seoDescription:
      "Make McDonald's Sausage & Egg McMuffin at home! This easy breakfast sandwich recipe features sausage patty, fluffy egg, melted cheese on toasted English muffin. Ready in 15 minutes.",
  };

  if (existingRecipe) {
    const updated = await client
      .patch(existingRecipe._id)
      .set(recipeData)
      .commit();
    console.log("✅ Recipe updated:", updated._id);
  } else {
    // Create as draft
    const recipe = await client.create({
      ...recipeData,
      _id: `drafts.mcdonalds-sausage-egg-mcmuffin-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! McDonald's Sausage & Egg McMuffin recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
