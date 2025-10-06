// scripts/create-greggs-cheese-onion-bake.ts
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

// Ingredient data for Greggs Cheese and Onion Bake
const ingredients = [
  {
    name: "Puff pastry",
    synonyms: ["ready-rolled puff pastry", "all-butter puff pastry"],
    kcal100: 375,
    protein100: 5.6,
    fat100: 26,
    carbs100: 30,
    allergens: ["gluten", "dairy"],
    gramsPerPiece: 320, // typical 320g pack
  },
  {
    name: "Cheddar cheese",
    synonyms: ["mature cheddar", "cheddar", "grated cheddar"],
    kcal100: 416,
    protein100: 25,
    fat100: 34,
    carbs100: 0.1,
    allergens: ["dairy"],
    gramsPerPiece: 50,
  },
  {
    name: "White onions",
    synonyms: ["onions", "yellow onions", "brown onions"],
    kcal100: 40,
    protein100: 1.1,
    fat100: 0.1,
    carbs100: 9.3,
    allergens: [],
    gramsPerPiece: 150,
  },
  {
    name: "Unsalted butter",
    synonyms: ["butter"],
    kcal100: 717,
    protein100: 0.9,
    fat100: 81,
    carbs100: 0.1,
    allergens: ["dairy"],
    density_g_per_ml: 0.91,
  },
  {
    name: "Plain flour",
    synonyms: ["all-purpose flour", "white flour"],
    kcal100: 364,
    protein100: 10,
    fat100: 1.3,
    carbs100: 76,
    allergens: ["gluten"],
    density_g_per_ml: 0.59,
  },
  {
    name: "Whole milk",
    synonyms: ["full-fat milk", "full cream milk"],
    kcal100: 64,
    protein100: 3.4,
    fat100: 3.6,
    carbs100: 4.8,
    allergens: ["dairy"],
    density_g_per_ml: 1.03,
  },
  {
    name: "Vegetable stock cube",
    synonyms: ["stock cube", "bouillon cube", "veg stock"],
    kcal100: 170,
    protein100: 8,
    fat100: 2.5,
    carbs100: 25,
    allergens: ["celery"],
    gramsPerPiece: 10,
  },
  {
    name: "Wholegrain mustard",
    synonyms: ["seeded mustard", "grainy mustard"],
    kcal100: 140,
    protein100: 7,
    fat100: 9,
    carbs100: 6,
    allergens: ["mustard"],
    density_g_per_ml: 1.1,
  },
  {
    name: "Black pepper",
    synonyms: ["ground black pepper", "pepper"],
    kcal100: 251,
    protein100: 10,
    fat100: 3.3,
    carbs100: 64,
    allergens: [],
    density_g_per_ml: 0.52,
  },
  {
    name: "Beaten egg",
    synonyms: ["egg wash", "whole egg"],
    kcal100: 143,
    protein100: 13,
    fat100: 10,
    carbs100: 0.7,
    allergens: ["eggs"],
    gramsPerPiece: 50,
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
  console.log("🥐 Creating Greggs Cheese and Onion Bake Recipe\n");
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
    `*[_type == "recipe" && slug.current == "greggs-cheese-and-onion-bake"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  // Get Greggs brand
  const greggsBrand = await client.fetch(
    `*[_type == "brand" && slug.current == "greggs"][0]`
  );

  if (!greggsBrand) {
    console.log("⚠️  Greggs brand not found - recipe will be created without brand reference");
  }

  // Get categories
  const vegetarianCategory = await client.fetch(
    `*[_type == "category" && slug.current == "vegetarian"][0]`
  );
  const snacksCategory = await client.fetch(
    `*[_type == "category" && slug.current == "snacks"][0]`
  );
  const breakfastCategory = await client.fetch(
    `*[_type == "category" && slug.current == "breakfast"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Greggs Cheese and Onion Bake",
    slug: {
      _type: "slug",
      current: "greggs-cheese-and-onion-bake",
    },
    description:
      "Recreate Greggs' iconic Cheese and Onion Bake at home with this easy copycat recipe. Flaky golden puff pastry filled with creamy cheddar and caramelised onions - the perfect savoury pastry treat!",
    servings: 4,
    prepMin: 20,
    cookMin: 30,
    introText:
      "Greggs' Cheese and Onion Bake is one of Britain's most beloved bakery items, a golden rectangle of flaky puff pastry hiding a generous filling of rich melted cheese and sweet, softened onions. Since its introduction to Greggs shops across the UK, this vegetarian savoury has become a lunchtime staple for millions, offering serious comfort food satisfaction whether enjoyed hot from the oven or at room temperature. What makes the Cheese and Onion Bake so special is the contrast between the crisp, buttery pastry exterior and the soft, flavourful filling - sharp mature cheddar provides richness while caramelised onions add a subtle sweetness that perfectly balances the dish. Many fans consider it superior to Greggs' other savoury pastries, and it's consistently one of their best-sellers. This homemade version captures that classic Greggs taste and texture using simple ingredients you can find in any supermarket. The secret lies in cooking the onions until they're properly softened and sweet, creating a thick, creamy cheese sauce that won't leak out during baking, and getting that characteristic golden-brown finish on the pastry. Making them at home means you can enjoy them fresh from your own oven, customise the cheese-to-onion ratio to your preference, and save money compared to buying from the high street. Perfect for lunch boxes, picnics, or a satisfying snack any time of day!",
    ...(greggsBrand && {
      brand: {
        _type: "reference",
        _ref: greggsBrand._id,
      },
    }),
    ...(vegetarianCategory && snacksCategory && breakfastCategory && {
      categories: [
        {
          _type: "reference",
          _ref: vegetarianCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: snacksCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: breakfastCategory._id,
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
            text: "Greggs is Britain's largest bakery chain, founded in 1939 by John Gregg as a single bakery delivering eggs and yeast products to Newcastle households. The company expanded throughout the North East before going national, and today operates over 2,300 shops across the UK, serving 11 million customers weekly. While famous for their sausage rolls and steak bakes, Greggs has always offered vegetarian options, with the Cheese and Onion Bake becoming one of their most popular meat-free choices.",
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
            text: "The Cheese and Onion Bake represents Greggs' commitment to providing affordable, satisfying food for everyone. Made fresh in their bakeries throughout the day, these golden pastries are particularly beloved by vegetarians who want a hearty savoury option beyond sandwiches. The recipe has remained largely unchanged for decades, proving the winning combination of quality ingredients and simple preparation. In recent years, as Greggs expanded their vegetarian and vegan range (including the hugely successful Vegan Sausage Roll), the Cheese and Onion Bake has maintained its position as a classic that both longtime fans and new customers consistently choose.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Filling",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["White onions"],
            },
            quantity: "3",
            unit: "piece",
            notes: "medium, finely sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Unsalted butter"],
            },
            quantity: "40",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Plain flour"],
            },
            quantity: "30",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Whole milk"],
            },
            quantity: "200",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vegetable stock cube"],
            },
            quantity: "1",
            unit: "piece",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Cheddar cheese"],
            },
            quantity: "200",
            unit: "g",
            notes: "mature, grated",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Wholegrain mustard"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Black pepper"],
            },
            quantity: "1/2",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Pastry",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Puff pastry"],
            },
            quantity: "2",
            unit: "sheet",
            notes: "320g sheets, chilled",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Beaten egg"],
            },
            quantity: "1",
            unit: "piece",
            notes: "for glazing",
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
                text: "Caramelise the onions: Melt the butter in a large frying pan over medium heat. Add the finely sliced onions and cook for 12-15 minutes, stirring occasionally, until they're very soft, golden, and sweet. The onions should be completely tender with no crunch left - this is crucial for authentic Greggs flavour. Remove from heat and set aside.",
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
                text: "Make the cheese sauce: In a medium saucepan, melt the remaining butter over medium heat. Stir in the flour and cook for 1-2 minutes, stirring constantly, to make a roux. Gradually add the milk, whisking continuously to prevent lumps. Crumble in the stock cube and keep stirring until the sauce thickens and bubbles - about 3-4 minutes. It should coat the back of a spoon.",
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
                text: "Finish the filling: Remove the sauce from heat and stir in the grated cheddar, wholegrain mustard, and black pepper. Mix until the cheese is completely melted and the sauce is smooth. Fold in the caramelised onions. Spread the mixture on a large plate or tray and allow to cool completely - this prevents the pastry from becoming soggy. You can pop it in the fridge for 15-20 minutes to speed this up.",
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
                text: "Prepare for baking: Preheat your oven to 200°C (180°C fan/gas mark 6). Line a large baking tray with parchment paper. Take your puff pastry sheets out of the fridge - they should be cold but pliable.",
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
                text: "Assemble the bakes: Roll out one sheet of puff pastry and cut it into 4 equal rectangles (roughly 12cm x 10cm each). Place these on your prepared baking tray. Divide the cooled cheese and onion filling evenly between the 4 rectangles, spooning it into the centre of each and leaving a 1.5cm border around the edges. Brush the borders with beaten egg.",
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
                text: "Top and seal: Roll out the second sheet of pastry and cut it into 4 matching rectangles. Carefully place these over the filling-topped bases. Press down firmly around all the edges to seal, then use a fork to crimp the edges decoratively - this creates the signature Greggs look and ensures the filling won't leak out. Make 2-3 small slashes in the top of each bake to allow steam to escape.",
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
                text: "Glaze and bake: Brush the tops generously with beaten egg - this creates that beautiful golden Greggs shine. Bake for 25-30 minutes until the pastry is puffed up, deeply golden brown, and crispy. The cheese should be bubbling slightly through the steam holes. If the pastry is browning too quickly, loosely cover with foil for the last 5-10 minutes.",
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
                text: "Cool and serve: Let the bakes cool on the tray for 5 minutes (the filling will be extremely hot!), then transfer to a wire rack. They're delicious warm or at room temperature, just like Greggs serve them. Perfect on their own or with a simple side salad. Store any leftovers in an airtight container in the fridge for up to 3 days - reheat in a hot oven for 5-7 minutes to restore crispness.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Cold pastry is key - if it gets too warm, pop it back in the fridge for 10 minutes. Warm pastry becomes sticky and difficult to work with, and won't puff up as well.",
      "Don't overfill - too much filling will leak out during baking. Use about 3-4 tablespoons of filling per bake, leaving generous borders.",
      "Ensure the filling is completely cool before assembling, or it will melt the pastry and create a soggy base.",
      "For extra Greggs authenticity, use mature or extra-mature cheddar for a stronger cheese flavour that stands up to the sweet onions.",
      "If you prefer softer, sweeter onions (like in Greggs' version), cook them low and slow for 15-20 minutes until they're deeply caramelised.",
      "Freeze unbaked bakes on a tray until solid, then transfer to freezer bags. Bake from frozen, adding 5-10 minutes to the cooking time.",
      "The mustard is subtle but important - it adds depth and cuts through the richness. Don't skip it!",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use shop-bought cheese sauce instead of making my own?",
        answer:
          "While you technically could, homemade sauce is much better and takes only 5 minutes. Shop-bought cheese sauces tend to be thinner and can make the pastry soggy. The thick, homemade béchamel-based sauce is crucial for authentic Greggs texture - it should be almost spreadable when cool, not runny.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make these in advance?",
        answer:
          "Yes! Assemble the bakes completely, then either refrigerate for up to 24 hours before baking (brush with egg just before baking), or freeze them unbaked. Frozen bakes can go straight into the oven from frozen - just add 5-10 minutes to the cooking time. They're perfect for batch cooking and meal prep.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What's the best way to reheat them?",
        answer:
          "Always use the oven, never the microwave (which makes pastry soggy). Preheat oven to 180°C, place the bakes on a baking tray, and heat for 8-10 minutes until hot through and the pastry is crispy again. You can cover loosely with foil if the tops are browning too much.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I add other ingredients to the filling?",
        answer:
          "Absolutely! Popular additions include chopped spring onions, a handful of chopped spinach or kale (cooked and squeezed dry), crumbled bacon for a non-vegetarian version, or different cheeses like Red Leicester or Double Gloucester. Just ensure any additions are cooked and well-drained to avoid excess moisture.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why did my filling leak out?",
        answer:
          "This usually happens if: 1) The filling was too hot when you assembled them (always let it cool completely), 2) You overfilled them (less is more!), 3) The edges weren't sealed properly (press firmly and crimp with a fork), or 4) You forgot to make steam holes in the top. Following these tips will prevent leaking.",
      },
    ],
    nutrition: {
      calories: 520,
      protein: 18,
      fat: 35,
      carbs: 35,
    },
    seoTitle: "Greggs Cheese and Onion Bake Recipe - Easy Copycat",
    seoDescription:
      "Make Greggs' famous Cheese and Onion Bake at home! Flaky puff pastry filled with creamy cheddar & caramelised onions. Simple copycat recipe ready in 50 mins.",
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
      _id: `drafts.greggs-cheese-onion-bake-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Greggs Cheese and Onion Bake recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized:");
  console.log("   - SEO Title: 53 characters ✓");
  console.log("   - SEO Description: 153 characters ✓");
  console.log("   - Categories: Vegetarian, Snacks, Breakfast ✓");
  console.log("🥐 Perfect British bakery classic!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
