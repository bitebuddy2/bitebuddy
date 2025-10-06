// scripts/create-mcdonalds-big-mac.ts
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

// Ingredient data for McDonald's Big Mac
const ingredients = [
  // Buns & Bread
  {
    name: "Sesame seed burger buns",
    synonyms: ["sesame burger bun", "seeded burger bun", "sesame bun"],
    kcal100: 272,
    protein100: 9.4,
    fat100: 4.8,
    carbs100: 47,
    allergens: ["gluten", "sesame"],
    gramsPerPiece: 50,
  },
  // Big Mac has a middle bun layer - usually called "club" layer
  {
    name: "Burger bun heel",
    synonyms: ["burger bun middle", "club bun", "plain burger bun bottom"],
    kcal100: 265,
    protein100: 8.5,
    fat100: 3.2,
    carbs100: 49,
    allergens: ["gluten"],
    gramsPerPiece: 35,
  },
  // Beef patties
  {
    name: "Beef burger patties",
    synonyms: ["beef patty", "hamburger patty", "100% beef patty"],
    kcal100: 250,
    protein100: 26,
    fat100: 17,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: 45,
  },
  // Big Mac Sauce ingredients
  {
    name: "Mayonnaise",
    synonyms: ["mayo", "real mayonnaise"],
    kcal100: 680,
    protein100: 1.1,
    fat100: 75,
    carbs100: 0.6,
    allergens: ["eggs"],
    density_g_per_ml: 0.91,
  },
  {
    name: "Sweet pickle relish",
    synonyms: ["pickle relish", "sweet relish", "gherkin relish"],
    kcal100: 107,
    protein100: 0.4,
    fat100: 0.3,
    carbs100: 25,
    allergens: [],
    density_g_per_ml: 1.1,
  },
  {
    name: "Yellow mustard",
    synonyms: ["American mustard", "French's mustard", "ballpark mustard"],
    kcal100: 67,
    protein100: 4.4,
    fat100: 3.3,
    carbs100: 7.1,
    allergens: [],
    density_g_per_ml: 1.05,
  },
  {
    name: "White wine vinegar",
    synonyms: ["white vinegar", "wine vinegar"],
    kcal100: 19,
    protein100: 0,
    fat100: 0,
    carbs100: 0.4,
    allergens: [],
    density_g_per_ml: 1.01,
  },
  {
    name: "Onion powder",
    synonyms: ["dried onion powder"],
    kcal100: 341,
    protein100: 8.8,
    fat100: 1,
    carbs100: 79,
    allergens: [],
  },
  {
    name: "Garlic powder",
    synonyms: ["dried garlic powder"],
    kcal100: 331,
    protein100: 17,
    fat100: 0.7,
    carbs100: 73,
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
  // Toppings
  {
    name: "Iceberg lettuce",
    synonyms: ["lettuce", "crisp lettuce"],
    kcal100: 14,
    protein100: 0.9,
    fat100: 0.1,
    carbs100: 3,
    allergens: [],
    gramsPerPiece: 150,
  },
  {
    name: "White onion",
    synonyms: ["onion", "white onions", "Spanish onion"],
    kcal100: 40,
    protein100: 1.1,
    fat100: 0.1,
    carbs100: 9.3,
    allergens: [],
    gramsPerPiece: 150,
  },
  {
    name: "Dill pickles",
    synonyms: ["pickles", "gherkins", "pickle slices", "dill pickle slices"],
    kcal100: 11,
    protein100: 0.3,
    fat100: 0.2,
    carbs100: 2.3,
    allergens: [],
    gramsPerPiece: 15,
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
  // Seasoning
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
  console.log("🍔 Creating McDonald's Big Mac Recipe\n");
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
    `*[_type == "recipe" && slug.current == "mcdonalds-big-mac"][0]`
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
    title: "McDonald's Big Mac",
    slug: {
      _type: "slug",
      current: "mcdonalds-big-mac",
    },
    description:
      "Make the iconic McDonald's Big Mac at home with this authentic copycat recipe. Two beef patties, special sauce, lettuce, cheese, pickles, and onions on a sesame seed bun - just like the original!",
    servings: 4,
    prepMin: 20,
    cookMin: 10,
    kcal: 563,
    introText:
      "The Big Mac is arguably the world's most famous burger, and for good reason. Since its creation in 1967 by Jim Delligatti, a McDonald's franchise owner in Pennsylvania, this iconic sandwich has become a cultural phenomenon. What makes it truly special isn't just the ingredients - it's the architecture. The genius three-layer construction with that middle 'club' bun creates the perfect bite every time. The legendary Big Mac sauce, a closely guarded secret for decades, combines tangy, sweet, and savory notes that make this burger absolutely unforgettable. This homemade version captures every detail of the original, from the perfectly seasoned beef patties to that distinctive sauce. You'll be amazed at how close you can get to the real thing in your own kitchen, and even better - you can customize it to your exact preferences!",
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
            text: "The Big Mac was created in 1967 by Jim Delligatti, a McDonald's franchisee in Uniontown, Pennsylvania. Originally called the 'Big Mac' because of its size compared to McDonald's other burgers at the time, it quickly became a sensation. By 1968, it had rolled out across the United States, and today, McDonald's sells hundreds of millions of Big Macs every year worldwide.",
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
            text: "The Big Mac's signature element is its special sauce, which McDonald's has kept relatively secret for decades. While they've revealed some ingredients, the exact recipe remains proprietary. The three-layered bun design was innovative for its time and has become so iconic that the Big Mac is used as an economic index (the 'Big Mac Index') by The Economist to measure purchasing power parity between countries. Its jingle - 'Two all-beef patties, special sauce, lettuce, cheese, pickles, onions on a sesame seed bun' - is one of the most recognizable advertising phrases in history.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Big Mac Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Mayonnaise"],
            },
            quantity: "120",
            unit: "ml",
            notes: "about 8 tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sweet pickle relish"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Yellow mustard"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["White wine vinegar"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Onion powder"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Garlic powder"],
            },
            quantity: "1/2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Smoked paprika"],
            },
            quantity: "1/2",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Burgers",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Beef burger patties"],
            },
            quantity: "8",
            unit: "",
            notes: "45g each, thin patties",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sesame seed burger buns"],
            },
            quantity: "4",
            unit: "",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Burger bun heel"],
            },
            quantity: "4",
            unit: "",
            notes: "for the middle layer (or use bun bottoms)",
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
              _ref: ingredientIds["Iceberg lettuce"],
            },
            quantity: "1/4",
            unit: "",
            notes: "shredded",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["White onion"],
            },
            quantity: "1",
            unit: "",
            notes: "finely diced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dill pickles"],
            },
            quantity: "12",
            unit: "slices",
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
                text: "Make the Big Mac sauce: In a bowl, combine mayonnaise, sweet pickle relish, yellow mustard, white wine vinegar, onion powder, garlic powder, and smoked paprika. Mix thoroughly until smooth and well combined. Cover and refrigerate for at least 30 minutes to let the flavours meld - this is crucial for that authentic taste!",
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
                text: "Prepare your ingredients: Shred the iceberg lettuce finely (use about 2 handfuls per burger). Finely dice the white onion. Have your pickle slices ready. If your beef isn't pre-portioned, form it into 8 thin patties about 45g each and 10cm in diameter - they should be quite thin, similar to smash burger patties.",
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
                text: "Prepare the buns: Cut each sesame seed bun into 3 layers - top crown, middle layer, and bottom. You can use the extra bun bottoms as the middle layer. Lightly toast all bun pieces on a dry griddle or under the grill for about 30 seconds until just golden. This prevents sogginess from the sauce.",
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
                text: "Cook the beef patties: Heat a large griddle or frying pan over medium-high heat. Season the patties lightly with salt and pepper on both sides. Cook for 2-3 minutes on the first side, then flip and immediately place a slice of American cheese on 4 of the patties (these will be your bottom patties). Cook for another 1-2 minutes until the cheese melts and the beef is cooked through.",
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
                text: "Assemble the bottom layer: Spread 1 tbsp of Big Mac sauce on each bun bottom. Add a generous handful of shredded lettuce, then place a beef patty with cheese on top. Sprinkle with diced onions and add 2 pickle slices.",
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
                text: "Add the middle bun layer: Place the middle bun layer (club layer) on top. Spread another generous tablespoon of Big Mac sauce on this middle layer.",
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
                text: "Assemble the top layer: Add more shredded lettuce on the sauce, place the second beef patty (without cheese) on top. Add more diced onions and 1 more pickle slice.",
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
                text: "Crown your Big Mac: Place the sesame seed bun crown on top and press down gently but firmly. For the authentic McDonald's experience, wrap each burger in parchment paper or greaseproof paper and let it sit for 2-3 minutes. This allows the flavours to meld and the burger to compress slightly - just like at McDonald's! Serve immediately.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "The Big Mac sauce can be made up to 3 days ahead and stored in an airtight container in the fridge. The flavour actually improves over time!",
      "For the most authentic experience, use 80/20 beef mince (20% fat). The fat content is crucial for juicy, flavourful patties.",
      "Don't skip toasting the buns - it's essential for preventing the burger from getting soggy from the sauce.",
      "To make perfect thin patties, place a ball of mince between two sheets of parchment paper and press firmly with a flat-bottomed pan.",
      "If you can't find burger bun heels for the middle layer, simply buy extra buns and use the bottom halves.",
      "For a healthier version, use turkey mince instead of beef and light mayonnaise in the sauce. You can also add extra lettuce for more crunch.",
      "Freeze extra Big Mac sauce in ice cube trays - each cube is about 1 tbsp, perfect for portioning!",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "What makes Big Mac sauce different from Thousand Island dressing?",
        answer:
          "While similar, Big Mac sauce is tangier and less sweet than Thousand Island. It has more mustard and uses sweet pickle relish instead of ketchup, giving it that distinctive McDonald's taste. The addition of paprika and specific ratios of ingredients create the unique flavour profile.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make Big Macs ahead of time?",
        answer:
          "It's best to assemble Big Macs fresh, but you can prepare components ahead. Make the sauce up to 3 days early, cook and store patties for up to 2 days (reheat before assembling), and prep vegetables the night before. Assemble just before serving for the best texture.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I get the beef patties as thin as McDonald's?",
        answer:
          "McDonald's uses special presses, but at home you can achieve similar results by pressing balls of mince (about 50g each) on a hot griddle with a spatula or flat-bottomed pan. Press firmly for 10-15 seconds. They should be about 3-4mm thick when cooked.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What can I substitute for American cheese?",
        answer:
          "American cheese is ideal because it melts perfectly, but you can use mild cheddar, Monterey Jack, or even cheese slices. Just note that the melting properties and flavour will differ slightly from the authentic Big Mac experience.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make a vegetarian Big Mac?",
        answer:
          "Absolutely! Use plant-based burger patties (like Beyond or Impossible meat), vegan cheese slices, and vegan mayonnaise in the sauce. The assembly and all other ingredients remain the same. Many people find the vegetarian version just as satisfying!",
      },
    ],
    nutrition: {
      calories: 563,
      protein: 27,
      fat: 33,
      carbs: 43,
    },
    seoTitle: "McDonald's Big Mac Recipe - Authentic Copycat with Special Sauce",
    seoDescription:
      "Make McDonald's iconic Big Mac at home! This authentic copycat recipe includes the famous Big Mac sauce, two beef patties, cheese, lettuce, pickles & onions. Easy step-by-step guide.",
    isSignature: true,
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
      _id: `drafts.mcdonalds-big-mac-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! McDonald's Big Mac recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized with signature recipe flag set to true!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
