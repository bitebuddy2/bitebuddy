// scripts/create-pret-cookie.ts
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

// Ingredient data for chocolate chunk cookies
const ingredients = [
  {
    name: "Unsalted butter",
    kcal100: 717,
    protein100: 0.9,
    fat100: 81,
    carbs100: 0.1,
    allergens: ["dairy"],
    density_g_per_ml: 0.91,
  },
  {
    name: "Light brown sugar",
    kcal100: 380,
    protein100: 0,
    fat100: 0,
    carbs100: 98,
    allergens: [],
  },
  {
    name: "Granulated sugar",
    kcal100: 387,
    protein100: 0,
    fat100: 0,
    carbs100: 100,
    allergens: [],
  },
  {
    name: "Vanilla extract",
    kcal100: 288,
    protein100: 0.1,
    fat100: 0.1,
    carbs100: 12.7,
    allergens: [],
    density_g_per_ml: 0.88,
  },
  {
    name: "Plain flour",
    kcal100: 364,
    protein100: 10,
    fat100: 1.3,
    carbs100: 76,
    allergens: ["gluten"],
  },
  {
    name: "Baking soda",
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
  },
  {
    name: "Dark chocolate chunks",
    kcal100: 546,
    protein100: 5.5,
    fat100: 31,
    carbs100: 61,
    allergens: ["dairy", "soy"],
  },
  {
    name: "Sea salt flakes",
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
  },
];

async function createOrGetIngredient(ingredientData: typeof ingredients[0]) {
  // Check if ingredient already exists
  const existing = await client.fetch(
    `*[_type == "ingredient" && name == $name][0]`,
    { name: ingredientData.name }
  );

  if (existing) {
    console.log(`✅ Found existing ingredient: ${ingredientData.name}`);
    return existing._id;
  }

  console.log(`➕ Creating new ingredient: ${ingredientData.name}`);
  const doc = await client.create({
    _type: "ingredient",
    ...ingredientData,
  });

  // Publish the ingredient
  await client
    .patch(doc._id)
    .set({ _id: doc._id.replace("drafts.", "") })
    .commit();

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
    `*[_type == "recipe" && slug.current == "pret-a-manger-chocolate-chunk-cookie"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  const recipeData = {
    _type: "recipe",
    title: "Pret A Manger Chocolate Chunk Cookie",
    slug: {
      _type: "slug",
      current: "pret-a-manger-chocolate-chunk-cookie",
    },
    description:
      "Rich, chewy chocolate chunk cookies inspired by Pret A Manger's iconic bakery treat. Perfectly crispy edges with a soft, gooey center loaded with dark chocolate chunks.",
    servings: 12,
    prepMin: 15,
    cookMin: 12,
    introText:
      "These copycat Pret A Manger chocolate chunk cookies are the ultimate homemade treat. With their signature crispy edges, chewy centers, and generous dark chocolate chunks, they taste just like the beloved cookies from the popular UK coffee chain. The secret is using a mix of light brown and granulated sugar for the perfect texture, and high-quality dark chocolate chunks for that rich, indulgent flavor.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Pret A Manger, the beloved British sandwich and coffee chain, is famous for its freshly made food and delicious bakery items. Their chocolate chunk cookies have become a cult favorite, known for their perfect balance of crispy edges and gooey centers, packed with generous chunks of dark chocolate.",
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
            text: "This recipe recreates that iconic Pret cookie experience at home, using simple ingredients and straightforward techniques to achieve that signature texture and rich chocolate flavor that keeps customers coming back.",
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
              _ref: ingredientIds["Unsalted butter"],
            },
            quantity: "225",
            unit: "g",
            notes: "softened",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Light brown sugar"],
            },
            quantity: "200",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Granulated sugar"],
            },
            quantity: "100",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Egg"],
            },
            quantity: "2",
            unit: "piece",
            notes: "large",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vanilla extract"],
            },
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Plain flour"],
            },
            quantity: "350",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Baking soda"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sea salt flakes"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dark chocolate chunks"],
            },
            quantity: "300",
            unit: "g",
            notes: "or roughly chopped dark chocolate",
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
                text: "Preheat your oven to 180°C (160°C fan)/350°F/Gas 4. Line two large baking trays with parchment paper.",
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
                text: "In a large bowl, cream together the softened butter, light brown sugar, and granulated sugar until light and fluffy, about 3-4 minutes using an electric mixer.",
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
                text: "Beat in the eggs one at a time, followed by the vanilla extract, mixing well after each addition.",
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
                text: "In a separate bowl, whisk together the flour, baking soda, and salt. Gradually add this to the wet ingredients, mixing until just combined. Don't overmix.",
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
                text: "Fold in the chocolate chunks, reserving a few to press into the tops of the cookies before baking.",
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
                text: "Scoop out portions of dough (about 60g each) and roll into balls. Place them on the prepared baking trays, spacing them about 7cm apart as they will spread. Press a few extra chocolate chunks into the top of each cookie.",
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
                text: "Bake for 11-13 minutes until the edges are golden brown but the centers still look slightly underbaked. The cookies will continue to cook on the tray.",
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
                text: "Leave the cookies on the baking tray for 5 minutes to set, then transfer to a wire rack to cool completely. Sprinkle with a tiny pinch of sea salt flakes while still warm if desired.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "For extra gooey cookies, slightly underbake them and let them finish cooking on the hot baking tray.",
      "Chill the dough for 30 minutes before baking for thicker cookies with less spread.",
      "Use a mix of chocolate chunks and chips for varied texture.",
      "Store in an airtight container for up to 5 days, or freeze unbaked dough balls for up to 3 months.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use milk chocolate instead of dark chocolate?",
        answer:
          "Yes! Pret's original cookies use dark chocolate, but you can substitute with milk chocolate or even a mix of both. Just note that milk chocolate is sweeter, so you might want to reduce the sugar slightly.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why are my cookies too flat?",
        answer:
          "This usually happens if the butter is too warm or the dough is too warm when baking. Make sure your butter is softened but not melted, and chill the dough for 30 minutes before baking if needed.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I freeze the cookie dough?",
        answer:
          "Absolutely! Roll the dough into balls, freeze on a tray, then transfer to a freezer bag. Bake from frozen, adding 2-3 extra minutes to the baking time.",
      },
    ],
    nutrition: {
      calories: 385,
      protein: 5,
      fat: 20,
      carbs: 47,
    },
  };

  if (existingRecipe) {
    const updated = await client
      .patch(existingRecipe._id)
      .set(recipeData)
      .commit();
    console.log("✅ Recipe updated:", updated._id);
  } else {
    // Create as draft first so you can add details before publishing
    const draftData = {
      ...recipeData,
      _id: "drafts.recipe-pret-a-manger-chocolate-chunk-cookie",
    };
    const recipe = await client.createOrReplace(draftData);
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Pret A Manger Chocolate Chunk Cookie recipe is ready!");
  console.log("📝 The recipe has been created as a DRAFT.");
  console.log("\nNext steps:");
  console.log("1. Open Sanity Studio");
  console.log("2. Edit the draft to add hero image and any other details");
  console.log("3. Click 'Publish' when you're ready to make it live");
  console.log("\nNote: The recipe won't appear on your site until you publish it.");
}

createRecipe().catch(console.error);
