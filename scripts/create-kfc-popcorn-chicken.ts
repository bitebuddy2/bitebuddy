// scripts/create-kfc-popcorn-chicken.ts
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

// Ingredient data for KFC Popcorn Chicken
const ingredients = [
  // Chicken
  {
    name: "Chicken breast fillets",
    synonyms: ["chicken breast", "chicken fillet", "breast fillet"],
    kcal100: 165,
    protein100: 31,
    fat100: 3.6,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: 150,
  },
  // Marinade
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
    name: "Hot sauce",
    synonyms: ["tabasco", "Louisiana hot sauce", "cayenne hot sauce"],
    kcal100: 21,
    protein100: 0.9,
    fat100: 0.5,
    carbs100: 3.6,
    allergens: [],
    density_g_per_ml: 1.05,
  },
  // KFC-style coating
  {
    name: "Plain flour",
    synonyms: ["all-purpose flour", "white flour"],
    kcal100: 364,
    protein100: 10,
    fat100: 1.5,
    carbs100: 76,
    allergens: ["gluten"],
    density_g_per_ml: 0.53,
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
    name: "Paprika",
    synonyms: ["sweet paprika", "ground paprika"],
    kcal100: 282,
    protein100: 14,
    fat100: 13,
    carbs100: 54,
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
    name: "Dried oregano",
    synonyms: ["oregano", "dried oregano leaves"],
    kcal100: 265,
    protein100: 9,
    fat100: 4.3,
    carbs100: 69,
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
    name: "Dried basil",
    synonyms: ["basil", "dried basil leaves"],
    kcal100: 233,
    protein100: 23,
    fat100: 4,
    carbs100: 48,
    allergens: [],
  },
  {
    name: "Celery salt",
    synonyms: ["celery seasoning salt"],
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: ["celery"],
  },
  {
    name: "White pepper",
    synonyms: ["ground white pepper"],
    kcal100: 296,
    protein100: 10,
    fat100: 2.1,
    carbs100: 69,
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
    name: "Mustard powder",
    synonyms: ["dry mustard", "ground mustard"],
    kcal100: 508,
    protein100: 26,
    fat100: 36,
    carbs100: 28,
    allergens: ["mustard"],
  },
  {
    name: "Ground ginger",
    synonyms: ["ginger powder", "dried ginger"],
    kcal100: 335,
    protein100: 9,
    fat100: 4.2,
    carbs100: 72,
    allergens: [],
  },
  // For frying
  {
    name: "Vegetable oil for frying",
    synonyms: ["frying oil", "cooking oil", "sunflower oil"],
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
  console.log("🍗 Creating KFC Popcorn Chicken Recipe\n");
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
    `*[_type == "recipe" && slug.current == "kfc-popcorn-chicken"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  // Get KFC brand
  const kfcBrand = await client.fetch(
    `*[_type == "brand" && slug.current == "kfc"][0]`
  );

  if (!kfcBrand) {
    console.log("⚠️  KFC brand not found - recipe will be created without brand reference");
  }

  const recipeData = {
    _type: "recipe",
    title: "KFC Popcorn Chicken",
    slug: {
      _type: "slug",
      current: "kfc-popcorn-chicken",
    },
    description:
      "Make KFC's addictive Popcorn Chicken at home with this authentic copycat recipe. Bite-sized pieces of tender chicken in KFC's signature crispy coating with 11 herbs and spices - perfect for snacking or sharing!",
    servings: 4,
    prepMin: 20,
    cookMin: 15,
    kcal: 425,
    introText:
      "KFC Popcorn Chicken has been a menu favourite since its introduction in the 1990s, offering all the flavour of KFC's famous fried chicken in perfectly poppable, bite-sized pieces. What makes Popcorn Chicken so irresistible is the incredibly high ratio of crispy, seasoned coating to tender chicken - every piece is packed with that signature KFC crunch and the Colonel's secret blend of 11 herbs and spices. Unlike regular chicken pieces, these popcorn bites cook quickly and evenly, resulting in consistently crispy golden nuggets that are impossible to stop eating. This homemade version replicates the exact taste and texture of KFC's original, from the buttermilk marinade that ensures juicy chicken to the multi-spiced coating that delivers that addictive KFC flavour. Whether you're hosting a party, need a quick snack, or just craving that KFC taste, this recipe delivers restaurant-quality popcorn chicken that's even better fresh from your own kitchen!",
    ...(kfcBrand && {
      brand: {
        _type: "reference",
        _ref: kfcBrand._id,
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
            text: "KFC Popcorn Chicken was introduced in the early 1990s as a fun, shareable snack option that captured the essence of Colonel Sanders' Original Recipe in bite-sized form. The concept was simple but brilliant - take the world's most famous fried chicken recipe and make it perfect for snacking, sharing, and eating on the go. The name 'Popcorn Chicken' came from the bite-sized pieces being similar in size to popcorn, making them ideal for munching.",
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
            text: "The genius of KFC Popcorn Chicken lies in its coating-to-chicken ratio. Each small piece gets fully enveloped in KFC's signature 11 herbs and spices blend, creating maximum flavour in every bite. Over the years, Popcorn Chicken has become one of KFC's most popular items worldwide, spawning variations like spicy popcorn chicken and even popcorn chicken wraps. The recipe remains closely guarded, but enthusiasts have worked to recreate that perfect blend of herbs, spices, and crispy coating that makes KFC Popcorn Chicken so addictive.",
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
              _ref: ingredientIds["Chicken breast fillets"],
            },
            quantity: "600",
            unit: "g",
            notes: "cut into bite-sized pieces (2-3cm cubes)",
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
              _ref: ingredientIds["Medium eggs"],
            },
            quantity: "1",
            unit: "",
            notes: "beaten",
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
        heading: "For the KFC-Style Coating (11 Herbs & Spices)",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Plain flour"],
            },
            quantity: "200",
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
              _ref: ingredientIds["Paprika"],
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
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Onion powder"],
            },
            quantity: "1",
            unit: "tbsp",
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
              _ref: ingredientIds["Dried basil"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Celery salt"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["White pepper"],
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
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Mustard powder"],
            },
            quantity: "1/2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ground ginger"],
            },
            quantity: "1/2",
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
                text: "Cut the chicken: Trim the chicken breasts and cut into bite-sized pieces, roughly 2-3cm cubes. Try to keep them uniform in size so they cook evenly. You want them small enough to be 'poppable' but large enough to stay juicy - about the size of large popcorn kernels!",
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
                text: "Prepare the marinade: In a large bowl, whisk together the buttermilk, beaten egg, hot sauce, and 1 tsp salt until well combined. Add the chicken pieces, stirring to ensure every piece is coated. Cover and refrigerate for at least 2 hours, or ideally 4-6 hours. This tenderizes the chicken and infuses it with flavour.",
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
                text: "Make the KFC-style coating: In a large shallow dish or bowl, combine the plain flour, cornflour, paprika, garlic powder, onion powder, oregano, thyme, basil, celery salt, white pepper, black pepper, 2 tsp salt, mustard powder, and ground ginger. Mix thoroughly until all the herbs and spices are evenly distributed throughout the flour. This is your 11 herbs and spices blend!",
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
                text: "Coat the chicken: Remove the chicken from the marinade, shaking off excess liquid but keeping them slightly wet. Working in batches, toss about 10-12 pieces in the seasoned flour mixture, pressing and turning to coat thoroughly. For extra crispiness (KFC-style), dip a few pieces back in the buttermilk and coat again for a double layer. Place coated pieces on a wire rack.",
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
                text: "Heat the oil: Pour the vegetable oil into a large, deep saucepan or deep fryer (the oil should be at least 8cm deep). Heat to 175°C (350°F). Use a cooking thermometer to monitor the temperature - this is crucial for achieving that perfect KFC crispiness without greasiness.",
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
                text: "Fry the popcorn chicken: Carefully add 10-12 pieces of coated chicken to the hot oil (don't overcrowd - fry in batches). Fry for 4-5 minutes, turning occasionally with a slotted spoon, until deep golden brown and crispy. The internal temperature should reach 75°C (165°F). Remove with a slotted spoon and drain on kitchen paper.",
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
                text: "Keep warm and continue frying: Keep the cooked popcorn chicken warm in a low oven (100°C/200°F) while you fry the remaining batches. Make sure the oil returns to 175°C between batches for consistent results.",
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
                text: "Serve immediately: Transfer all the popcorn chicken to a serving bowl or bucket (for that authentic KFC experience!) and serve hot. Perfect with KFC-style dipping sauces like BBQ, sweet chilli, garlic mayo, or honey mustard. Best enjoyed fresh and hot!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "For maximum crispiness, let the coated chicken rest on a wire rack for 10 minutes before frying. This helps the coating adhere better and creates a crunchier texture.",
      "Don't skip the marinade time - the buttermilk and egg mixture tenderizes the chicken and helps the coating stick. Overnight marinating gives the best results.",
      "If you don't have celery salt, mix 1 tsp regular salt with 1/4 tsp celery seeds or use 1 tsp of regular salt instead.",
      "For healthier popcorn chicken, bake at 220°C (425°F) for 15-18 minutes, turning halfway through and spraying with oil for crispiness.",
      "Make a spicy version by adding 1-2 tsp cayenne pepper to the coating mixture for that Zinger-style heat!",
      "The coating mixture can be made in advance and stored in an airtight container for up to 1 month - perfect for quick KFC cravings!",
      "For a party, prepare the chicken pieces and coat them ahead of time, then fry just before serving for maximum freshness and crunch.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use chicken thighs instead of breast?",
        answer:
          "Yes! Chicken thighs work brilliantly for popcorn chicken as they're juicier and more flavourful than breast meat. Cut them into similar bite-sized pieces and follow the same method. They may take an extra 30-60 seconds to cook through, so check the internal temperature reaches 75°C (165°F).",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I know when the oil is the right temperature?",
        answer:
          "Use a cooking thermometer for accuracy - 175°C (350°F) is ideal. Without a thermometer, drop a small piece of bread into the oil; it should turn golden brown in about 30 seconds. If it browns too quickly, the oil is too hot; if it takes longer, increase the heat.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this in an air fryer?",
        answer:
          "Absolutely! Spray the coated chicken pieces generously with oil spray and air fry at 200°C (400°F) for 12-15 minutes, shaking the basket halfway through. They'll be crispy and delicious, though slightly less crunchy than deep-fried. This method is much healthier with similar great taste!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What's the best dipping sauce for KFC Popcorn Chicken?",
        answer:
          "KFC offers several sauces, but the most popular are BBQ sauce, sweet chilli, garlic mayo, and honey mustard. For an authentic KFC experience, mix mayo with a little sriracha and honey for a sweet-spicy combination that's incredibly addictive with popcorn chicken!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I store and reheat leftovers?",
        answer:
          "Store leftover popcorn chicken in an airtight container in the fridge for up to 3 days. Reheat in the oven at 180°C (350°F) for 10 minutes or in an air fryer at 180°C for 5-6 minutes until hot and crispy again. Avoid microwaving as it makes the coating soggy.",
      },
    ],
    nutrition: {
      calories: 425,
      protein: 38,
      fat: 18,
      carbs: 32,
    },
    seoTitle: "KFC Popcorn Chicken Recipe - Crispy Copycat with 11 Herbs & Spices",
    seoDescription:
      "Make KFC Popcorn Chicken at home with this authentic copycat recipe! Bite-sized crispy chicken pieces with KFC's secret 11 herbs & spices blend. Easy step-by-step guide for perfect results.",
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
      _id: `drafts.kfc-popcorn-chicken-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! KFC Popcorn Chicken recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized with signature recipe flag set to true!");
  console.log("🌟 Features the famous 11 herbs & spices blend!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
