// scripts/create-pizza-express-dough-balls.ts
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

// Ingredient data for Pizza Express Dough Balls
const ingredients = [
  // For the dough balls
  {
    name: "Strong white bread flour",
    kcal100: 341,
    protein100: 12,
    fat100: 1.5,
    carbs100: 70,
    allergens: ["gluten"],
  },
  {
    name: "Fast-action dried yeast",
    kcal100: 325,
    protein100: 40,
    fat100: 7,
    carbs100: 41,
    allergens: [],
  },
  {
    name: "Caster sugar",
    kcal100: 387,
    protein100: 0,
    fat100: 0,
    carbs100: 100,
    allergens: [],
  },
  {
    name: "Warm water",
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 1.0,
  },
  {
    name: "Olive oil",
    kcal100: 884,
    protein100: 0,
    fat100: 100,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 0.92,
  },
  {
    name: "Fine sea salt",
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
  },
  // For the garlic butter
  {
    name: "Salted butter",
    kcal100: 717,
    protein100: 0.9,
    fat100: 81,
    carbs100: 0.1,
    allergens: ["dairy"],
    density_g_per_ml: 0.91,
  },
  {
    name: "Fresh parsley",
    kcal100: 36,
    protein100: 3,
    fat100: 0.8,
    carbs100: 6.3,
    allergens: [],
  },
  {
    name: "Fresh garlic cloves",
    kcal100: 149,
    protein100: 6.4,
    fat100: 0.5,
    carbs100: 33,
    allergens: [],
    gramsPerPiece: 5,
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
    `*[_type == "recipe" && slug.current == "pizza-express-dough-balls-with-garlic-butter"][0]`
  );

  // Also check for draft
  const existingDraft = await client.fetch(
    `*[_id == "drafts.recipe-pizza-express-dough-balls-with-garlic-butter"][0]`
  );

  if (existingRecipe || existingDraft) {
    console.log("⚠️  Recipe already exists! Updating draft instead...");
  }

  const recipeData = {
    _type: "recipe",
    title: "Pizza Express Dough Balls with Garlic Butter",
    slug: {
      _type: "slug",
      current: "pizza-express-dough-balls-with-garlic-butter",
    },
    description:
      "Recreate Pizza Express's legendary dough balls at home with this easy recipe. Soft, pillowy, freshly baked dough balls served with rich, herby garlic butter for dipping.",
    servings: 4,
    prepMin: 90,
    cookMin: 12,
    introText:
      "Pizza Express dough balls are one of the most beloved restaurant starters in the UK. These soft, fluffy, freshly baked bread balls served with melted garlic butter have become an iconic appetizer. Now you can recreate this restaurant favorite at home with simple ingredients and easy techniques. The secret is in the dough's rise time and the generous garlic butter that makes these irresistible.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Pizza Express, founded in 1965 in London's Soho, has become one of the UK's most popular Italian restaurant chains. Their dough balls, introduced as a simple starter, have achieved cult status among diners of all ages. Served warm and fresh from the oven with a generous pot of rich garlic butter, they're the perfect way to start any Pizza Express meal.",
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
            text: "This copycat recipe captures the exact texture and flavor of the original - pillowy soft inside with a slight chew on the outside, and that unmistakable garlic butter that makes them so addictive. Perfect as a starter, party food, or alongside pasta and pizza dishes.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Dough Balls",
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
              _ref: ingredientIds["Fast-action dried yeast"],
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
              _ref: ingredientIds["Warm water"],
            },
            quantity: "300",
            unit: "ml",
            notes: "lukewarm, not hot",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Olive oil"],
            },
            quantity: "2",
            unit: "tbsp",
            notes: "plus extra for brushing",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Garlic Butter",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Salted butter"],
            },
            quantity: "100",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fresh garlic cloves"],
            },
            quantity: "4",
            unit: "clove",
            notes: "finely minced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fresh parsley"],
            },
            quantity: "2",
            unit: "tbsp",
            notes: "finely chopped",
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
                text: "In a large mixing bowl, combine the flour, yeast, sugar, and salt. Make a well in the center and pour in the warm water and olive oil. Mix together with a wooden spoon until it forms a shaggy dough.",
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
                text: "Turn the dough out onto a lightly floured surface and knead for 8-10 minutes until smooth, elastic, and springy. The dough should be soft but not sticky. Add a little more flour if needed, but keep it minimal for the softest dough balls.",
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
                text: "Place the dough in a lightly oiled bowl, cover with a clean tea towel or cling film, and leave in a warm place for 1 hour or until doubled in size.",
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
                text: "Once risen, knock back the dough and divide into 16-20 equal pieces (about 40g each). Roll each piece into a smooth ball by cupping it in your hand and rolling it in a circular motion on the work surface.",
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
                text: "Place the dough balls on a lined baking tray, spacing them about 2-3cm apart. Cover loosely and let them prove for another 20-30 minutes until puffy. Meanwhile, preheat your oven to 200°C (180°C fan)/400°F/Gas 6.",
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
                text: "Brush the dough balls lightly with olive oil and bake for 10-12 minutes until golden brown and cooked through. They should sound hollow when tapped on the bottom.",
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
                text: "While the dough balls are baking, make the garlic butter. Melt the butter in a small saucepan over low heat. Add the minced garlic and cook gently for 1-2 minutes until fragrant but not browned. Stir in the chopped parsley and remove from heat.",
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
                text: "Serve the dough balls warm from the oven with the garlic butter in a small bowl for dipping. These are best enjoyed fresh and hot!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "For extra soft dough balls, use milk instead of water in the dough.",
      "Don't overbake - they should be golden but still soft and pillowy inside.",
      "You can make the dough ahead and refrigerate overnight for a slower, more flavorful rise. Let it come to room temperature before shaping.",
      "Add a pinch of chili flakes to the garlic butter for a spicy kick.",
      "Freeze unbaked dough balls on a tray, then transfer to a freezer bag. Bake from frozen, adding 3-4 minutes to the cooking time.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make the dough in a stand mixer?",
        answer:
          "Yes! Use the dough hook attachment and knead on medium speed for 5-6 minutes until the dough is smooth and elastic. This saves time and effort compared to hand kneading.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I know when the dough has risen enough?",
        answer:
          "The dough should roughly double in size. To test, gently press your finger into the dough - if the indentation slowly springs back, it's ready. If it springs back immediately, it needs more time.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use dried parsley instead of fresh?",
        answer:
          "Fresh parsley gives the best flavor and authentic Pizza Express taste, but you can use 1 tablespoon of dried parsley if needed. The flavor will be slightly less vibrant.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why are my dough balls dense and not fluffy?",
        answer:
          "This usually happens if the dough didn't rise enough, the yeast was old/inactive, or the water was too hot and killed the yeast. Make sure your water is lukewarm (not hot) and give the dough plenty of time to rise in a warm spot.",
      },
    ],
    nutrition: {
      calories: 285,
      protein: 7,
      fat: 12,
      carbs: 38,
    },
    seoTitle: "Pizza Express Dough Balls Recipe (with Garlic Butter)",
    seoDescription:
      "Make Pizza Express dough balls at home! Soft, fluffy bread balls with rich garlic butter. Easy recipe with step-by-step instructions. Perfect starter or party food.",
  };

  // Create as draft
  const draftData = {
    ...recipeData,
    _id: "drafts.recipe-pizza-express-dough-balls-with-garlic-butter",
  };

  try {
    const recipe = await client.createOrReplace(draftData);
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  } catch (error) {
    console.error("❌ Error creating recipe:");
    console.error(error);
    throw error;
  }

  console.log("\n🎉 Done! Pizza Express Dough Balls recipe is ready!");
  console.log("📝 The recipe has been created as a DRAFT.");
  console.log("\nNext steps:");
  console.log("1. Open Sanity Studio");
  console.log("2. Edit the draft to add hero image and any other details");
  console.log("3. Click 'Publish' when you're ready to make it live");
  console.log("\nNote: The recipe is SEO-optimized with meta title and description.");
}

createRecipe().catch(console.error);
