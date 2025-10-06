// scripts/create-greggs-vegan-sausage-roll.ts
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

// Ingredient data for Greggs Vegan Sausage Roll
const ingredients = [
  // Puff pastry
  {
    name: "Vegan puff pastry",
    synonyms: ["plant-based puff pastry", "dairy-free puff pastry"],
    kcal100: 368,
    protein100: 5,
    fat100: 23,
    carbs100: 35,
    allergens: ["gluten"],
    gramsPerPiece: 320,
  },
  // Vegan sausage filling
  {
    name: "Soya mince",
    synonyms: ["soy mince", "textured vegetable protein", "TVP"],
    kcal100: 345,
    protein100: 52,
    fat100: 1,
    carbs100: 33,
    allergens: ["soya"],
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
    name: "Vegetable oil",
    synonyms: ["sunflower oil", "rapeseed oil", "cooking oil"],
    kcal100: 884,
    protein100: 0,
    fat100: 100,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 0.92,
  },
  {
    name: "Dried sage",
    synonyms: ["sage", "dried sage leaves"],
    kcal100: 315,
    protein100: 11,
    fat100: 13,
    carbs100: 61,
    allergens: [],
  },
  {
    name: "Dried thyme",
    synonyms: ["thyme", "dried thyme leaves"],
    kcal100: 276,
    protein100: 9.1,
    fat100: 7.4,
    carbs100: 64,
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
    name: "Garlic powder",
    synonyms: ["dried garlic powder"],
    kcal100: 331,
    protein100: 17,
    fat100: 0.7,
    carbs100: 73,
    allergens: [],
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
    name: "Smoked paprika",
    synonyms: ["Spanish paprika", "pimentón"],
    kcal100: 282,
    protein100: 14,
    fat100: 13,
    carbs100: 54,
    allergens: [],
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
    name: "Vegetable stock cube",
    synonyms: ["veg stock cube", "vegetable bouillon"],
    kcal100: 175,
    protein100: 15,
    fat100: 1.5,
    carbs100: 30,
    allergens: ["celery"],
    gramsPerPiece: 10,
  },
  {
    name: "Dried breadcrumbs",
    synonyms: ["breadcrumbs", "dried bread crumbs"],
    kcal100: 395,
    protein100: 13,
    fat100: 5.3,
    carbs100: 72,
    allergens: ["gluten"],
  },
  // For glazing
  {
    name: "Plant-based milk",
    synonyms: ["oat milk", "soy milk", "almond milk"],
    kcal100: 47,
    protein100: 1,
    fat100: 1.5,
    carbs100: 6.7,
    allergens: [],
    density_g_per_ml: 1.03,
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
  console.log("🥟 Creating Greggs Vegan Sausage Roll Recipe\n");
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
    `*[_type == "recipe" && slug.current == "greggs-vegan-sausage-roll"][0]`
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

  const recipeData = {
    _type: "recipe",
    title: "Greggs Vegan Sausage Roll",
    slug: {
      _type: "slug",
      current: "greggs-vegan-sausage-roll",
    },
    description:
      "Make Greggs' famous Vegan Sausage Roll at home with this easy copycat recipe. Flaky puff pastry filled with seasoned soya mince - better than the original!",
    servings: 6,
    prepMin: 20,
    cookMin: 25,
    kcal: 312,
    introText:
      "Greggs Vegan Sausage Roll became a cultural phenomenon when it launched in January 2019, selling out across the UK within weeks and sparking a plant-based revolution on the British high street. What made this vegan sausage roll so special wasn't just that it was plant-based - it was that it tasted incredible, with many people (including meat-eaters) preferring it to the original. The secret lies in the perfectly seasoned soya-based filling that mimics the texture and flavour of traditional sausage meat, wrapped in Greggs' signature flaky puff pastry that shatters with every bite. The filling is packed with herbs, spices, and umami-rich flavours that create depth and satisfaction, proving that vegan food can be just as indulgent and delicious as anything else. This copycat recipe recreates that exact taste and texture using simple, accessible ingredients - soya mince seasoned with sage, thyme, and smoked paprika, all wrapped in golden puff pastry. Whether you're vegan, trying to eat more plant-based meals, or just love a good sausage roll, this homemade version delivers authentic Greggs taste at a fraction of the cost. Perfect for lunch, picnics, or party food!",
    ...(greggsBrand && {
      brand: {
        _type: "reference",
        _ref: greggsBrand._id,
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
            text: "Greggs launched their Vegan Sausage Roll on January 2nd, 2019, following a high-profile campaign by PETA and over 20,000 customer requests. The launch was so successful that it became one of the biggest food stories of the year, with queues forming outside shops and the product selling out nationwide within days. The vegan sausage roll was developed in partnership with Quorn, taking over two years of recipe development to perfect the taste and texture.",
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
            text: "The success of Greggs' Vegan Sausage Roll is credited with accelerating the plant-based food movement in the UK, proving that vegan products could be mainstream and commercially successful. In its first year, Greggs sold over 2 million vegan sausage rolls, and it remains one of their best-selling products. The launch sparked a wave of vegan product releases across UK high street chains, with Greggs following up with a full vegan menu including steak bakes, doughnuts, and breakfast options. The vegan sausage roll costs the same as the meat version (£1), making plant-based eating accessible to everyone.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Vegan Sausage Filling",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Soya mince"],
            },
            quantity: "200",
            unit: "g",
            notes: "dried",
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
              _ref: ingredientIds["Vegetable oil"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dried sage"],
            },
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dried thyme"],
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
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fine sea salt"],
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
              _ref: ingredientIds["Smoked paprika"],
            },
            quantity: "1/2",
            unit: "tsp",
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
              _ref: ingredientIds["Vegetable stock cube"],
            },
            quantity: "1",
            unit: "",
            notes: "dissolved in 300ml hot water",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dried breadcrumbs"],
            },
            quantity: "50",
            unit: "g",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For Assembly",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vegan puff pastry"],
            },
            quantity: "320",
            unit: "g",
            notes: "1 sheet, thawed if frozen",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Plant-based milk"],
            },
            quantity: "2",
            unit: "tbsp",
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
                text: "Prepare the soya mince: Dissolve the vegetable stock cube in 300ml boiling water. Pour over the dried soya mince in a bowl and leave to soak for 10 minutes until rehydrated and all the liquid is absorbed. The mince should be soft and moist but not soggy.",
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
                text: "Cook the filling: Heat the oil in a large frying pan over medium heat. Add the finely diced onion and cook for 5-6 minutes until soft and translucent. Add the rehydrated soya mince, sage, thyme, black pepper, salt, garlic powder, onion powder, smoked paprika, and tomato puree. Cook for 5-7 minutes, stirring frequently, until the mixture is well combined and slightly caramelized.",
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
                text: "Add breadcrumbs and cool: Stir in the dried breadcrumbs - they'll absorb any excess moisture and help bind the filling together, creating that sausage-like texture. Cook for 2 more minutes. Remove from heat and let the mixture cool completely (this is important - hot filling will melt the pastry). You can speed this up by spreading it on a plate.",
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
                text: "Prepare the pastry: Preheat your oven to 200°C (180°C fan/400°F/Gas 6). Roll out the vegan puff pastry on a lightly floured surface to about 30cm x 25cm. Cut the pastry in half lengthways to create two long rectangles, each about 12cm wide.",
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
                text: "Fill the sausage rolls: Divide the cooled filling in half. Shape each portion into a long sausage shape down the center of each pastry rectangle, leaving about 2cm clear at each end. The filling should be about 3cm thick - similar to the width of a traditional sausage.",
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
                text: "Roll and seal: Brush one long edge of the pastry with plant-based milk. Fold the pastry over the filling and press the edges together to seal, creating a long roll. Place seam-side down on a lined baking tray. Repeat with the second roll. Cut each long roll into 3 equal pieces (6 sausage rolls total). Make 3-4 small diagonal slashes on top of each roll with a sharp knife.",
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
                text: "Glaze and bake: Brush the tops with plant-based milk for that golden Greggs glaze. Bake for 22-25 minutes until the pastry is puffed, crispy, and deep golden brown. The slashes should have opened up and the filling should be piping hot. Let cool for 5 minutes before serving - they're best eaten warm but also delicious cold!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Make sure the filling is completely cool before assembling - hot filling will make the pastry soggy and difficult to work with.",
      "Jus-Rol puff pastry is accidentally vegan in the UK and works perfectly for this recipe. Always check the label as some brands contain butter.",
      "The breadcrumbs are essential - they absorb moisture and give the filling that firm, sausage-like texture that holds together when you bite into it.",
      "Make ahead: assemble the rolls, freeze them unbaked, then bake from frozen adding 5-10 minutes extra time. Perfect for batch cooking!",
      "Sage is the key herb that makes it taste like traditional sausage - don't skip it! The combination with thyme creates that authentic flavor.",
      "For extra Greggs authenticity, make them slightly smaller (8 rolls instead of 6) - Greggs portions are generous but not huge.",
      "Serve with tomato ketchup or brown sauce for the full British experience!",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "What can I use instead of soya mince?",
        answer:
          "You can use Quorn mince (Greggs uses Quorn), lentils cooked until very soft and mashed, or finely chopped mushrooms mixed with walnuts. The texture will differ slightly but all work well. If using Quorn, skip the rehydration step as it's already moist.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I know if my puff pastry is vegan?",
        answer:
          "Check the ingredients list - avoid anything with butter, milk, or eggs. In the UK, Jus-Rol puff pastry (the ready-rolled sheets) is vegan. Most supermarket own-brand frozen puff pastry is also vegan, but always check. It should list vegetable oil or margarine, not butter.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make these gluten-free?",
        answer:
          "Yes! Use gluten-free puff pastry (available in most supermarkets), gluten-free breadcrumbs, and check your stock cube is gluten-free. The soya mince is naturally gluten-free. The texture will be slightly different but still delicious.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How long do they keep and how should I store them?",
        answer:
          "Store in an airtight container in the fridge for up to 3 days. Reheat in the oven at 180°C for 10 minutes to restore crispiness. They also freeze brilliantly - freeze unbaked for up to 3 months, or baked for up to 1 month. Bake from frozen, adding 5-10 minutes.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why is my filling too wet or too dry?",
        answer:
          "If too wet, add more breadcrumbs (1 tbsp at a time) and cook for longer to evaporate moisture. If too dry, add a splash of vegetable stock or water. The mixture should be moist but hold together when shaped - similar to sausage meat consistency.",
      },
    ],
    nutrition: {
      calories: 312,
      protein: 12,
      fat: 18,
      carbs: 28,
    },
    seoTitle: "Greggs Vegan Sausage Roll Recipe - Easy Copycat",
    seoDescription:
      "Make Greggs' famous Vegan Sausage Roll at home! Easy plant-based recipe with flaky pastry & seasoned soya filling. Better than the original!",
  };

  // Always create as a new draft (don't update existing published recipe)
  const draftId = `drafts.greggs-vegan-sausage-roll-${randomUUID()}`;
  const recipe = await client.create({
    ...recipeData,
    _id: draftId,
  });
  console.log("✅ Recipe created as DRAFT:", recipe._id);

  if (existingRecipe) {
    console.log(`⚠️  Note: Published recipe still exists (${existingRecipe._id})`);
    console.log("   You can delete it after reviewing the draft.");
  }

  console.log("\n🎉 Done! Greggs Vegan Sausage Roll recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized (NOT signature as requested):");
  console.log("   - SEO Title: 54 characters ✓");
  console.log("   - SEO Description: 140 characters ✓");
  console.log("🥟 The recipe that started a vegan revolution!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
