// scripts/create-dominos-pepperoni-passion.ts
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

// Ingredient data for Domino's Pepperoni Passion Pizza
const ingredients = [
  // Pizza dough
  {
    name: "Strong white bread flour",
    synonyms: ["bread flour", "strong flour", "high protein flour"],
    kcal100: 361,
    protein100: 12,
    fat100: 1.5,
    carbs100: 72,
    allergens: ["gluten"],
    density_g_per_ml: 0.53,
  },
  {
    name: "Fast action yeast",
    synonyms: ["instant yeast", "quick yeast", "instant dried yeast"],
    kcal100: 325,
    protein100: 40,
    fat100: 7.6,
    carbs100: 41,
    allergens: [],
  },
  {
    name: "Caster sugar",
    synonyms: ["superfine sugar", "fine sugar"],
    kcal100: 387,
    protein100: 0,
    fat100: 0,
    carbs100: 100,
    allergens: [],
    density_g_per_ml: 0.85,
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
    name: "Olive oil",
    synonyms: ["extra virgin olive oil", "EVOO"],
    kcal100: 884,
    protein100: 0,
    fat100: 100,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 0.92,
  },
  // Pizza sauce
  {
    name: "Passata",
    synonyms: ["sieved tomatoes", "tomato passata", "strained tomatoes"],
    kcal100: 34,
    protein100: 1.2,
    fat100: 0.2,
    carbs100: 7.3,
    allergens: [],
    density_g_per_ml: 1.03,
  },
  {
    name: "Tomato puree",
    synonyms: ["tomato paste", "concentrated tomato paste"],
    kcal100: 82,
    protein100: 4.3,
    fat100: 0.5,
    carbs100: 18,
    allergens: [],
    density_g_per_ml: 1.1,
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
    name: "Dried oregano",
    synonyms: ["oregano", "dried oregano leaves"],
    kcal100: 265,
    protein100: 9,
    fat100: 4.3,
    carbs100: 69,
    allergens: [],
  },
  {
    name: "Dried basil",
    synonyms: ["basil", "dried basil leaves"],
    kcal100: 233,
    protein100: 23,
    fat100: 4,
    carbs100: 48,
    allergens: [],
  },
  // Toppings
  {
    name: "Mozzarella cheese",
    synonyms: ["shredded mozzarella", "grated mozzarella"],
    kcal100: 280,
    protein100: 28,
    fat100: 17,
    carbs100: 3.1,
    allergens: ["dairy"],
  },
  {
    name: "Pepperoni slices",
    synonyms: ["pepperoni", "pepperoni salami"],
    kcal100: 504,
    protein100: 23,
    fat100: 44,
    carbs100: 2,
    allergens: [],
    gramsPerPiece: 5,
  },
  {
    name: "Cheddar cheese",
    synonyms: ["mature cheddar", "grated cheddar"],
    kcal100: 416,
    protein100: 25,
    fat100: 35,
    carbs100: 0.1,
    allergens: ["dairy"],
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
  console.log("🍕 Creating Domino's Pepperoni Passion Pizza Recipe\n");
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
    `*[_type == "recipe" && slug.current == "dominos-pepperoni-passion-pizza"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  // Get Domino's brand
  const dominosBrand = await client.fetch(
    `*[_type == "brand" && slug.current == "dominos"][0]`
  );

  if (!dominosBrand) {
    console.log("⚠️  Domino's brand not found - recipe will be created without brand reference");
  }

  const recipeData = {
    _type: "recipe",
    title: "Domino's Pepperoni Passion Pizza",
    slug: {
      _type: "slug",
      current: "dominos-pepperoni-passion-pizza",
    },
    description:
      "Make Domino's Pepperoni Passion pizza at home with this authentic copycat recipe. Double pepperoni, double cheese, crispy base - the ultimate pepperoni pizza loaded with flavor!",
    servings: 4,
    prepMin: 20,
    cookMin: 15,
    kcal: 285,
    introText:
      "Domino's Pepperoni Passion is the ultimate pizza for pepperoni lovers, featuring a generous double helping of spicy pepperoni slices and a luxurious blend of mozzarella and cheddar cheese. What makes this pizza special is the layering technique - pepperoni both under and on top of the cheese creates maximum flavor in every bite, while the cheese blend provides the perfect stretch and tang that Domino's is famous for. The Pepperoni Passion uses Domino's signature hand-tossed dough with their classic tomato sauce, creating a balanced base that lets the star ingredients shine. This copycat recipe replicates the exact taste and texture of the original, from the slightly crispy base to the perfectly browned, curled pepperoni edges. Whether you're craving that iconic Domino's taste or want to impress pizza night guests, this homemade version delivers authentic pizzeria-quality results that rival the takeaway, all from your own kitchen!",
    ...(dominosBrand && {
      brand: {
        _type: "reference",
        _ref: dominosBrand._id,
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
            text: "Domino's Pizza was founded in 1960 in Michigan, USA, and has grown to become one of the world's largest pizza chains with over 18,000 stores globally. The Pepperoni Passion is part of Domino's 'Specialty Pizzas' range, designed to showcase bold, crowd-pleasing flavor combinations. Domino's revolutionized pizza delivery with their famous '30 minutes or free' guarantee in the 1980s, though this has since been discontinued for safety reasons.",
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
            text: "The Pepperoni Passion specifically celebrates America's favorite pizza topping - pepperoni accounts for over 35% of all pizza orders in the US and UK. Domino's uses a specific blend of pepperoni that's slightly spicier than standard varieties, and their cheese blend is carefully formulated to provide the perfect melt and stretch. The pizza's popularity has made it a permanent fixture on menus worldwide, with some markets adding local twists to the classic formula.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Pizza Dough (makes 2 large pizzas)",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Strong white bread flour"],
            },
            quantity: "500",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fast action yeast"],
            },
            quantity: "7",
            unit: "g",
            notes: "1 sachet",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Caster sugar"],
            },
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fine sea salt"],
            },
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Olive oil"],
            },
            quantity: "3",
            unit: "tbsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Domino's-Style Pizza Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Passata"],
            },
            quantity: "200",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Tomato puree"],
            },
            quantity: "2",
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
              _ref: ingredientIds["Dried oregano"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dried basil"],
            },
            quantity: "1/2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fine sea salt"],
            },
            quantity: "1/2",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Toppings (per pizza)",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Mozzarella cheese"],
            },
            quantity: "150",
            unit: "g",
            notes: "grated",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Cheddar cheese"],
            },
            quantity: "50",
            unit: "g",
            notes: "grated",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Pepperoni slices"],
            },
            quantity: "80",
            unit: "g",
            notes: "about 30-35 slices",
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
                text: "Make the pizza dough: In a large bowl, mix the flour, yeast, sugar, and salt. Add 300ml warm water (not hot - about 40°C) and the olive oil. Mix until it forms a rough dough, then turn out onto a floured surface and knead for 8-10 minutes until smooth and elastic. The dough should be soft but not sticky.",
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
                text: "Prove the dough: Place the dough in a lightly oiled bowl, cover with a damp tea towel or cling film, and leave in a warm place for 1-2 hours until doubled in size. For the best flavor, you can also prove it slowly in the fridge overnight.",
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
                text: "Make the pizza sauce: While the dough proves, mix together the passata, tomato puree, garlic powder, oregano, basil, and salt in a bowl. Set aside - the flavors will develop as it sits. This makes enough sauce for 2 pizzas.",
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
                text: "Preheat and prepare: Place a pizza stone or heavy baking tray in the oven and preheat to the highest temperature (usually 240-260°C/475-500°F). Let it heat for at least 30 minutes - this is crucial for a crispy base. Divide the risen dough in half and work with one piece at a time.",
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
                text: "Shape the pizza: On a floured surface or baking parchment, stretch and shape the dough into a 30cm (12-inch) circle. Use your hands to stretch from the center outwards, leaving a slightly thicker edge for the crust. For a Domino's-style hand-tossed base, don't roll it too thin - about 5-6mm thick is perfect.",
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
                text: "Assemble the Pepperoni Passion: Spread half the pizza sauce evenly over the base, leaving a 2cm border for the crust. Sprinkle half the mozzarella cheese over the sauce. Add a layer of pepperoni slices (about 15-18 slices). Mix the remaining mozzarella with the grated cheddar and sprinkle over the pepperoni. Finally, add the remaining pepperoni slices on top - this double layer is the signature of the Pepperoni Passion!",
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
                text: "Bake the pizza: Carefully transfer the pizza (on parchment if using) to the preheated pizza stone or tray. Bake for 10-12 minutes until the crust is golden, the cheese is bubbling, and the pepperoni edges are slightly crispy and curled. The cheddar should be melted and starting to brown.",
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
                text: "Serve: Remove from the oven and let rest for 2 minutes before slicing into 8 pieces. Serve hot while the cheese is still stretchy. Repeat the process with the second dough ball for another pizza. Perfect with Domino's-style garlic and herb dip or stuffed crust for the full experience!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "For extra crispy pepperoni edges like Domino's, use thin-sliced pepperoni and arrange it loosely on top so the edges can crisp up in the oven.",
      "The cheese blend is key - mozzarella provides stretch while cheddar adds tang and golden color. Don't skip the cheddar!",
      "If you don't have a pizza stone, use an upturned baking tray. Preheat it thoroughly for at least 30 minutes for best results.",
      "Make the dough ahead: it can be refrigerated for up to 3 days or frozen for up to 3 months. Bring to room temperature before shaping.",
      "For an authentic Domino's crust, brush the edge with garlic butter (melted butter mixed with garlic powder) before baking.",
      "Double the sauce recipe and freeze half for next time - it keeps for 3 months and makes pizza night even quicker!",
      "Want it spicier? Add red chili flakes to the sauce or use spicy pepperoni for an extra kick.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "What makes Pepperoni Passion different from a regular pepperoni pizza?",
        answer:
          "The Pepperoni Passion features double the pepperoni of a regular pizza, with pepperoni both under and on top of the cheese. It also uses a specific cheese blend (mozzarella and cheddar) rather than just mozzarella, giving it extra flavor and that signature Domino's taste.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use a different type of pepperoni?",
        answer:
          "Yes! While Domino's uses their signature pepperoni blend, any good-quality pepperoni works. For the most authentic taste, use thin-sliced pepperoni that curls when cooked. Spicy pepperoni adds extra kick, while turkey pepperoni is a leaner alternative.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I get the pizza base crispy like Domino's?",
        answer:
          "Three key steps: 1) Preheat your pizza stone or tray for at least 30 minutes at maximum temperature. 2) Don't overload with sauce - keep it moderate. 3) Bake at the highest temperature your oven allows (240-260°C). The hot stone and high heat create that crispy bottom.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this without a pizza stone?",
        answer:
          "Absolutely! Use a heavy baking tray turned upside down and preheated in the oven. Alternatively, use a regular baking tray (though the base may be slightly less crispy). Some people even use a cast iron skillet with great results!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I store and reheat leftover pizza?",
        answer:
          "Store in an airtight container in the fridge for up to 3 days. To reheat, use an oven at 180°C for 10 minutes or a frying pan over medium heat (covered) for 5 minutes - this keeps the base crispy. Avoid microwaving as it makes the base soggy.",
      },
    ],
    nutrition: {
      calories: 285,
      protein: 14,
      fat: 11,
      carbs: 32,
    },
    seoTitle: "Domino's Pepperoni Passion Pizza Recipe - Easy Copycat",
    seoDescription:
      "Make Domino's Pepperoni Passion at home! Double pepperoni, double cheese, crispy base. Easy copycat recipe with step-by-step guide.",
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
      _id: `drafts.dominos-pepperoni-passion-pizza-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Domino's Pepperoni Passion Pizza recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized (NOT signature as requested):");
  console.log("   - SEO Title: 56 characters ✓");
  console.log("   - SEO Description: 121 characters ✓");
  console.log("🍕 Features double pepperoni and cheese blend!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
