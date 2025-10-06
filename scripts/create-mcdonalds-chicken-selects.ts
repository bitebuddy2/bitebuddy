// scripts/create-mcdonalds-chicken-selects.ts
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

// Ingredient data for McDonald's Chicken Selects
const ingredients = [
  // For the chicken
  {
    name: "Chicken breast",
    synonyms: ["chicken breast fillet", "chicken fillet"],
    kcal100: 165,
    protein100: 31,
    fat100: 3.6,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: 150,
  },
  // For the marinade
  {
    name: "Buttermilk",
    synonyms: ["cultured buttermilk"],
    kcal100: 40,
    protein100: 3.3,
    fat100: 0.9,
    carbs100: 4.8,
    allergens: ["dairy"],
    density_g_per_ml: 1.03,
  },
  {
    name: "Hot sauce",
    synonyms: ["tabasco", "Louisiana hot sauce"],
    kcal100: 21,
    protein100: 0.9,
    fat100: 0.5,
    carbs100: 3.6,
    allergens: [],
    density_g_per_ml: 1.05,
  },
  // For the coating
  {
    name: "Panko breadcrumbs",
    synonyms: ["Japanese breadcrumbs", "panko"],
    kcal100: 360,
    protein100: 12,
    fat100: 2.5,
    carbs100: 72,
    allergens: ["gluten"],
  },
  {
    name: "Cornflour",
    synonyms: ["cornstarch", "corn starch"],
    kcal100: 381,
    protein100: 0.3,
    fat100: 0.1,
    carbs100: 91,
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
    name: "Onion powder",
    synonyms: ["dried onion powder"],
    kcal100: 341,
    protein100: 8.8,
    fat100: 1,
    carbs100: 79,
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
  // For frying
  {
    name: "Vegetable oil for frying",
    synonyms: ["frying oil", "cooking oil"],
    kcal100: 884,
    protein100: 0,
    fat100: 100,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 0.92,
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
    `*[_type == "recipe" && slug.current == "mcdonalds-chicken-selects"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  const recipeData = {
    _type: "recipe",
    title: "McDonald's Chicken Selects",
    slug: {
      _type: "slug",
      current: "mcdonalds-chicken-selects",
    },
    description:
      "Recreate McDonald's iconic Chicken Selects at home with this crispy, tender chicken strip recipe. Marinated in buttermilk and coated in seasoned panko breadcrumbs for that perfect golden crunch.",
    servings: 4,
    prepMin: 20,
    cookMin: 15,
    introText:
      "McDonald's Chicken Selects were a menu phenomenon that captured hearts worldwide before being discontinued in many markets. These premium chicken strips offered a step up from regular nuggets, featuring whole chicken breast meat in a crispy, golden coating. The secret to their incredible taste lies in a buttermilk marinade that keeps the chicken incredibly tender and juicy, combined with a perfectly seasoned panko breadcrumb coating that delivers that signature McDonald's crunch. This copycat recipe brings back the nostalgia and delivers restaurant-quality chicken strips that are even better than the original - because you can enjoy them fresh from your own kitchen.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "McDonald's introduced Chicken Selects in 2004 as a premium alternative to their classic Chicken McNuggets. Made from whole chicken breast strips rather than processed chicken, they quickly became a fan favorite. The strips were known for their tender, juicy interior and exceptionally crispy coating that maintained its crunch even after dipping in McDonald's signature sauces.",
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
            text: "Though Chicken Selects have been removed from the permanent menu in many countries, they occasionally return as a limited-time offer, proving their enduring popularity. This recipe captures everything that made them special - the quality chicken, the perfect seasoning blend, and that unmistakable McDonald's-style crispy coating that keeps you coming back for more.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Chicken",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Chicken breast"],
            },
            quantity: "600",
            unit: "g",
            notes: "cut into 12 strips",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Marinade",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Buttermilk"],
            },
            quantity: "250",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Hot sauce"],
            },
            quantity: "2",
            unit: "tbsp",
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
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Coating",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Panko breadcrumbs"],
            },
            quantity: "200",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Plain flour"],
            },
            quantity: "100",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Cornflour"],
            },
            quantity: "50",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Garlic powder"],
            },
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Onion powder"],
            },
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Paprika"],
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
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For Frying",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vegetable oil for frying"],
            },
            quantity: "1",
            unit: "l",
            notes: "for deep frying",
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
                text: "Cut the chicken breasts into 12 evenly-sized strips, about 2cm wide and 10cm long. Try to keep them uniform in size so they cook evenly.",
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
                text: "In a large bowl, mix together the buttermilk, hot sauce, and 1 tsp salt. Add the chicken strips, making sure they're fully submerged. Cover and refrigerate for at least 2 hours, or ideally overnight. This marinade is crucial for tender, flavorful chicken.",
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
                text: "In a large shallow dish, combine the panko breadcrumbs, plain flour, cornflour, garlic powder, onion powder, paprika, black pepper, and 1 tsp salt. Mix thoroughly to ensure even distribution of the seasonings.",
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
                text: "Remove the chicken strips from the marinade, letting excess buttermilk drip off. Working one at a time, coat each strip thoroughly in the breadcrumb mixture, pressing firmly to ensure the coating adheres well. Place the coated strips on a wire rack and let them rest for 10 minutes - this helps the coating stick during frying.",
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
                text: "Heat the vegetable oil in a large, deep saucepan or deep fryer to 180°C (350°F). Use a thermometer to maintain the correct temperature - this is essential for crispy, not greasy, chicken.",
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
                text: "Carefully lower 3-4 chicken strips into the hot oil (don't overcrowd the pan). Fry for 5-6 minutes, turning occasionally, until deep golden brown and the internal temperature reaches 75°C (165°F).",
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
                text: "Remove the cooked strips with a slotted spoon and drain on kitchen paper. Keep them warm in a low oven (around 100°C) while you fry the remaining batches.",
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
                text: "Serve hot with your favorite McDonald's-style dipping sauces - sweet curry, BBQ, or sweet and sour all work brilliantly!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "For extra crispiness, double-coat the chicken: dip coated strips back in buttermilk, then breadcrumbs again.",
      "Don't skip the marinade time - overnight is best for maximum tenderness and flavor.",
      "If you don't have buttermilk, make your own by adding 1 tbsp lemon juice to 250ml regular milk and letting it sit for 10 minutes.",
      "For healthier Chicken Selects, bake them at 220°C (425°F) for 20-25 minutes, turning halfway through.",
      "Freeze uncooked breaded strips on a tray, then transfer to a freezer bag. Fry from frozen, adding 2-3 minutes to cooking time.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use chicken thighs instead of breast?",
        answer:
          "While chicken breast is traditional for Chicken Selects and gives that authentic texture, you can use boneless, skinless thighs. They'll be juicier but slightly different in texture. Adjust cooking time as thighs may cook slightly faster.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What if I don't have panko breadcrumbs?",
        answer:
          "Regular dried breadcrumbs can work, but panko creates that signature light, crispy texture. If using regular breadcrumbs, the coating will be denser. For a closer match, pulse regular breadcrumbs in a food processor to make them slightly lighter.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I know when the oil is at the right temperature?",
        answer:
          "Use a cooking thermometer for accuracy - 180°C (350°F) is ideal. Without a thermometer, drop a small cube of bread in the oil; it should turn golden brown in about 30 seconds. If the oil is too hot, the coating will burn before the chicken cooks through.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make these in an air fryer?",
        answer:
          "Yes! Spray the coated chicken strips with oil spray and air fry at 200°C (400°F) for 12-15 minutes, turning halfway through. They'll be slightly less crispy than deep-fried but still delicious and much healthier.",
      },
    ],
    nutrition: {
      calories: 420,
      protein: 32,
      fat: 18,
      carbs: 36,
    },
    seoTitle: "McDonald's Chicken Selects Recipe - Crispy Copycat Strips",
    seoDescription:
      "Make McDonald's Chicken Selects at home! This crispy chicken strip recipe uses buttermilk marinade and panko coating for authentic restaurant taste. Easy copycat recipe.",
  };

  if (existingRecipe) {
    const updated = await client
      .patch(existingRecipe._id)
      .set(recipeData)
      .commit();
    console.log("✅ Recipe updated:", updated._id);
  } else {
    const recipe = await client.create(recipeData);
    console.log("✅ Recipe created:", recipe._id);
  }

  console.log("\n🎉 Done! McDonald's Chicken Selects recipe is ready!");
  console.log("📝 The recipe is SEO-optimized and ready to publish.");
  console.log("\nNote: You'll need to add a hero image in Sanity Studio.");
}

createRecipe().catch(console.error);
