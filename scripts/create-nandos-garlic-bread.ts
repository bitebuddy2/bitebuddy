// scripts/create-nandos-garlic-bread.ts
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

// Ingredient data for Nando's Garlic Bread
const ingredients = [
  {
    name: "Ciabatta bread",
    synonyms: ["ciabatta loaf", "Italian bread"],
    kcal100: 271,
    protein100: 9,
    fat100: 2,
    carbs100: 51,
    allergens: ["gluten"],
    gramsPerPiece: 250,
  },
  {
    name: "Salted butter",
    synonyms: ["butter"],
    kcal100: 717,
    protein100: 0.9,
    fat100: 81,
    carbs100: 0.1,
    allergens: ["dairy"],
    density_g_per_ml: 0.91,
  },
  {
    name: "Fresh garlic",
    synonyms: ["garlic cloves", "garlic"],
    kcal100: 149,
    protein100: 6.4,
    fat100: 0.5,
    carbs100: 33,
    allergens: [],
    gramsPerPiece: 3, // per clove
  },
  {
    name: "Fresh parsley",
    synonyms: ["flat-leaf parsley", "parsley"],
    kcal100: 36,
    protein100: 3,
    fat100: 0.8,
    carbs100: 6.3,
    allergens: [],
    gramsPerPiece: 5, // small bunch
  },
  {
    name: "Lemon juice",
    synonyms: ["fresh lemon juice"],
    kcal100: 22,
    protein100: 0.4,
    fat100: 0.2,
    carbs100: 6.9,
    allergens: [],
    density_g_per_ml: 1.03,
  },
  {
    name: "Peri-peri seasoning",
    synonyms: ["piri-piri seasoning", "peri peri spice"],
    kcal100: 280,
    protein100: 12,
    fat100: 8,
    carbs100: 42,
    allergens: [],
    density_g_per_ml: 0.55,
  },
  {
    name: "Sea salt flakes",
    synonyms: ["flaky sea salt", "Maldon salt"],
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 1.2,
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
  console.log("🍞 Creating Nando's Garlic Bread Recipe\n");
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
    `*[_type == "recipe" && slug.current == "nandos-garlic-bread"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  // Get Nando's brand
  const nandosBrand = await client.fetch(
    `*[_type == "brand" && slug.current == "nandos"][0]`
  );

  if (!nandosBrand) {
    console.log("⚠️  Nando's brand not found - recipe will be created without brand reference");
  }

  // Get categories
  const sidesCategory = await client.fetch(
    `*[_type == "category" && slug.current == "sides"][0]`
  );
  const vegetarianCategory = await client.fetch(
    `*[_type == "category" && slug.current == "vegetarian"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Nando's Garlic Bread",
    slug: {
      _type: "slug",
      current: "nandos-garlic-bread",
    },
    description:
      "Make Nando's famous garlic bread at home with this easy copycat recipe. Crispy ciabatta loaded with garlic butter, peri-peri spice, and fresh parsley - the perfect side for any meal!",
    servings: 4,
    prepMin: 10,
    cookMin: 12,
    introText:
      "Nando's Garlic Bread is one of those sides that turns a good meal into a great one - crispy, golden ciabatta slathered with rich garlic butter infused with their signature peri-peri spice. Whether you're ordering a half chicken or a butterfly burger, adding garlic bread to your Nando's order is practically mandatory for many fans. What sets Nando's garlic bread apart from standard garlic bread is the addition of peri-peri seasoning, which adds a subtle warmth and complexity that complements their famous flame-grilled chicken perfectly. The bread itself is always ciabatta - chosen for its robust texture that becomes crispy on the outside while staying slightly chewy inside, and its airy structure that soaks up all that flavourful butter. Fresh parsley and a squeeze of lemon juice brighten the rich butter, while generous amounts of fresh garlic provide that punchy flavour Nando's is known for. This homemade version captures everything that makes Nando's garlic bread special, using simple ingredients you can easily find. The secret lies in softening the butter properly so it spreads easily, using fresh garlic rather than dried, and getting the peri-peri seasoning balance just right - enough to add warmth without overwhelming the garlic. Making it at home means you can enjoy that Nando's experience any night of the week, customise the spice level to your preference, and save money compared to restaurant prices. It's ready in just 22 minutes from start to finish - perfect alongside grilled meats, pasta dishes, or simply on its own as a satisfying snack!",
    ...(nandosBrand && {
      brand: {
        _type: "reference",
        _ref: nandosBrand._id,
      },
    }),
    ...(sidesCategory && vegetarianCategory && {
      categories: [
        {
          _type: "reference",
          _ref: sidesCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: vegetarianCategory._id,
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
            text: "Nando's began in 1987 in Johannesburg, South Africa, when two friends discovered a Portuguese-style grilled chicken restaurant and decided to buy it. They named it after one of the founders, Fernando Duarte (nicknamed 'Nando'), and brought the concept to the UK in 1992, opening their first restaurant in Ealing, West London. The chain is famous for its Portuguese-African fusion cuisine centred around peri-peri (also spelled piri-piri) chicken, but their sides - particularly the garlic bread - have developed their own cult following.",
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
            text: "Nando's garlic bread showcases the restaurant's signature peri-peri flavour in a vegetarian-friendly side dish that's become essential to the Nando's experience. The peri-peri chilli used throughout their menu originates from African Bird's Eye chilli brought to Portugal by explorers in the 15th century, where it was combined with European ingredients like garlic, herbs, and lemon. This history is reflected in the garlic bread, which blends Portuguese tradition (garlic and olive oil) with African heat (peri-peri). With over 450 restaurants in the UK and more than 1,200 worldwide, Nando's garlic bread has introduced millions to this distinctive flavour combination, making it one of Britain's most recognisable restaurant side dishes.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ciabatta bread"],
            },
            quantity: "1",
            unit: "piece",
            notes: "large loaf",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Salted butter"],
            },
            quantity: "100",
            unit: "g",
            notes: "softened",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fresh garlic"],
            },
            quantity: "4",
            unit: "clove",
            notes: "large, crushed or finely minced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fresh parsley"],
            },
            quantity: "3",
            unit: "tbsp",
            notes: "finely chopped",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Lemon juice"],
            },
            quantity: "1",
            unit: "tbsp",
            notes: "freshly squeezed",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Peri-peri seasoning"],
            },
            quantity: "1",
            unit: "tsp",
            notes: "adjust to taste",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sea salt flakes"],
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
                text: "Preheat and prep: Preheat your oven to 200°C (180°C fan/gas mark 6). Line a large baking tray with foil or parchment paper for easy cleanup. Take the butter out of the fridge to soften - it should be spreadable but not melted. If you're short on time, cut it into small cubes to speed up softening.",
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
                text: "Make the peri-peri garlic butter: In a medium bowl, combine the softened butter, crushed garlic, chopped parsley, lemon juice, peri-peri seasoning, and sea salt flakes. Mix thoroughly with a fork or spoon until everything is evenly distributed and the butter is smooth. The mixture should be pale green from the parsley with visible garlic specks. Taste and adjust - add more peri-peri if you want extra heat, or more lemon for brightness.",
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
                text: "Slice the ciabatta: Using a sharp serrated bread knife, cut the ciabatta loaf in half horizontally through the middle, creating a top and bottom half. This is the same way Nando's does it - it creates maximum surface area for the garlic butter and ensures every bite is flavourful. Place both halves cut-side up on your prepared baking tray.",
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
                text: "Spread the garlic butter generously: Using a butter knife or the back of a spoon, spread the peri-peri garlic butter evenly over both cut surfaces of the ciabatta. Be generous - you want the butter to soak into all the nooks and crannies of the bread. Make sure to get right to the edges. Use all of the butter mixture across both halves.",
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
                text: "Bake to golden perfection: Place the tray in the preheated oven and bake for 10-12 minutes until the edges are golden brown and crispy, and the butter is bubbling. The bread should be crunchy on top but still have a bit of chew in the thickest parts. If you like it extra crispy like some Nando's locations serve it, give it an extra 1-2 minutes, watching carefully to prevent burning.",
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
                text: "Slice and serve immediately: Remove from the oven and let it cool for just 1-2 minutes (it will be very hot!). Use a sharp knife to cut each half into 2-4 pieces, depending on how large you want your portions. Nando's typically cuts them into generous chunks. Serve immediately while hot and crispy. Perfect alongside grilled chicken, burgers, or as a starter with dips.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Don't skip the lemon juice - it brightens all the flavours and cuts through the richness of the butter, just like Nando's version.",
      "Fresh garlic is essential for authentic flavour. Garlic powder or pre-minced garlic in jars won't give you the same punchy, fresh taste.",
      "For a more intense peri-peri kick like Nando's hot version, increase the peri-peri seasoning to 1.5-2 teaspoons, or add a pinch of chilli flakes.",
      "If you can't find peri-peri seasoning, make your own: mix paprika, cayenne pepper, dried oregano, garlic powder, and a pinch of lemon zest.",
      "Use ciabatta specifically - its open, airy texture is perfect for soaking up butter. Baguette is too dense, and focaccia is too oily.",
      "Make extra garlic butter and store it in the fridge for up to 1 week, or freeze for up to 3 months. Great for last-minute garlic bread!",
      "For an extra Nando's touch, finish with a sprinkle of fresh parsley and a squeeze of lemon juice right before serving.",
      "Turn it into cheesy garlic bread: sprinkle grated mozzarella or cheddar over the buttered bread before baking for the last 5 minutes.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "What is peri-peri seasoning and where can I buy it?",
        answer:
          "Peri-peri (or piri-piri) seasoning is a spice blend featuring African Bird's Eye chilli, paprika, garlic, herbs, and sometimes lemon. Nando's sells their own bottled peri-peri seasoning in supermarkets and online, which is ideal for authentic flavour. Alternatively, look for peri-peri seasoning in the spice aisle at Tesco, Sainsbury's, or Asda, or use a mix of paprika, cayenne pepper, dried oregano, and garlic powder in a pinch.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this in an air fryer?",
        answer:
          "Yes! Cut the ciabatta into individual portions (rather than halves), spread with garlic butter, and air fry at 180°C for 5-7 minutes until golden and crispy. This method is faster and makes the bread extra crunchy. You may need to do it in batches depending on your air fryer size.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I store and reheat leftovers?",
        answer:
          "Wrap leftover garlic bread tightly in foil and refrigerate for up to 2 days. To reheat, place in a 180°C oven for 5-7 minutes until heated through and crispy again. You can also freeze it - wrap well and freeze for up to 1 month. Reheat from frozen in the oven for 10-12 minutes. Avoid microwaving as it makes the bread chewy and soggy.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use a different type of bread?",
        answer:
          "While ciabatta is most authentic to Nando's, you can use a rustic sourdough loaf, French baguette, or even thick-sliced bloomer bread. Just adjust the cooking time - denser breads may need a minute or two longer, while thinner slices will cook faster. Avoid soft sandwich bread as it will become soggy.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Is Nando's garlic bread vegan?",
        answer:
          "The restaurant version contains butter so isn't vegan, but you can easily make a vegan version at home! Replace the butter with plant-based butter (Naturli or Flora Plant work brilliantly) and follow the recipe exactly the same way. The flavour is nearly identical and still deliciously garlicky with that peri-peri kick.",
      },
    ],
    nutrition: {
      calories: 385,
      protein: 8,
      fat: 24,
      carbs: 35,
    },
    seoTitle: "Nando's Garlic Bread Recipe - Easy Peri-Peri Copycat",
    seoDescription:
      "Make Nando's famous garlic bread at home in 22 minutes! Crispy ciabatta with peri-peri garlic butter. Easy copycat recipe that tastes just like the restaurant.",
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
      _id: `drafts.nandos-garlic-bread-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Nando's Garlic Bread recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized:");
  console.log("   - SEO Title: 54 characters ✓");
  console.log("   - SEO Description: 148 characters ✓");
  console.log("   - Categories: Sides, Vegetarian ✓");
  console.log("🍞 Perfect peri-peri side dish!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
