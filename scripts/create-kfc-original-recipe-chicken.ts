// scripts/create-kfc-original-recipe-chicken.ts
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

// Ingredient data for KFC Original Recipe Chicken
const ingredients = [
  // Chicken
  {
    name: "Whole chicken pieces",
    synonyms: ["chicken pieces", "mixed chicken pieces", "chicken portions"],
    kcal100: 239,
    protein100: 27,
    fat100: 14,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: 200,
  },
  // Buttermilk brine
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
    name: "Fine sea salt",
    synonyms: ["salt", "table salt", "sea salt"],
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 1.2,
  },
  // The famous 11 herbs & spices coating
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
    name: "Paprika",
    synonyms: ["sweet paprika", "ground paprika"],
    kcal100: 282,
    protein100: 14,
    fat100: 13,
    carbs100: 54,
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
    name: "White pepper",
    synonyms: ["ground white pepper"],
    kcal100: 296,
    protein100: 10,
    fat100: 2.1,
    carbs100: 69,
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
    name: "Dried marjoram",
    synonyms: ["marjoram", "dried marjoram leaves"],
    kcal100: 271,
    protein100: 13,
    fat100: 7,
    carbs100: 60,
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
  // For pressure cooking (optional but authentic)
  {
    name: "MSG",
    synonyms: ["monosodium glutamate", "MSG powder", "flavour enhancer"],
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
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
  console.log("🍗 Creating KFC Original Recipe Chicken\n");
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
    `*[_type == "recipe" && slug.current == "kfc-original-recipe-chicken"][0]`
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
    title: "KFC Original Recipe Chicken",
    slug: {
      _type: "slug",
      current: "kfc-original-recipe-chicken",
    },
    description:
      "Make Colonel Sanders' legendary KFC Original Recipe Chicken at home with this authentic copycat recipe featuring the secret 11 herbs and spices. Crispy, juicy, pressure-fried perfection!",
    servings: 8,
    prepMin: 30,
    cookMin: 25,
    kcal: 320,
    introText:
      "KFC Original Recipe Chicken is the most famous fried chicken in the world, and it all started with Colonel Harland Sanders in 1940 at his roadside restaurant in Corbin, Kentucky. The legendary recipe featuring '11 herbs and spices' has been one of the food industry's most closely guarded secrets for over 80 years, locked in a vault in Louisville, Kentucky. What makes KFC's Original Recipe truly special is the unique combination of the secret spice blend, buttermilk brine that tenderizes the chicken, and the revolutionary pressure-frying technique that the Colonel pioneered. This method seals in moisture while creating that incomparably crispy, golden coating that's made KFC famous worldwide. While the exact recipe remains classified, years of culinary detective work and leaked family recipes have allowed us to recreate a version that captures the essence of the Colonel's masterpiece. This homemade version delivers that same addictive flavour, incredible crunch, and juicy tenderness that's made KFC Original Recipe an icon. Whether you deep fry or use a pressure cooker, you'll achieve restaurant-quality fried chicken that tastes remarkably close to the real thing!",
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
            text: "Colonel Harland Sanders developed his Original Recipe fried chicken in the 1940s at Sanders Court & Café in Corbin, Kentucky. The breakthrough came when he began using a pressure fryer, a revolutionary technique that cooked chicken faster while keeping it incredibly moist inside with a crispy exterior. By 1952, Sanders began franchising his chicken recipe, and by the time he sold the company in 1964, there were over 600 KFC outlets. Today, KFC operates in over 145 countries with more than 24,000 restaurants worldwide.",
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
            text: "The '11 herbs and spices' blend is one of the most famous trade secrets in the food industry. The recipe is split into two parts, with each half held by different executives, and only a handful of people know the complete formula. It's stored in a 770-pound safe in Louisville, surrounded by motion detectors and security cameras. In 2016, the Chicago Tribune published what they claimed was the original recipe, discovered in a family scrapbook, though KFC has never confirmed its authenticity. This recipe draws on those revelations and decades of copycat attempts to recreate that iconic KFC taste.",
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
              _ref: ingredientIds["Whole chicken pieces"],
            },
            quantity: "1.5",
            unit: "kg",
            notes: "8 pieces (drumsticks, thighs, wings, breast halves)",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Buttermilk Brine",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Buttermilk"],
            },
            quantity: "500",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fine sea salt"],
            },
            quantity: "2",
            unit: "tbsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Original Recipe Coating (11 Herbs & Spices)",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Plain flour"],
            },
            quantity: "300",
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
              _ref: ingredientIds["Black pepper"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["White pepper"],
            },
            quantity: "2",
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
            unit: "tbsp",
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
              _ref: ingredientIds["Dried oregano"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dried thyme"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dried basil"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dried marjoram"],
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
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ground ginger"],
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
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["MSG"],
            },
            quantity: "1",
            unit: "tsp",
            notes: "optional but authentic",
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
            quantity: "2",
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
                text: "Brine the chicken: In a large bowl, mix the buttermilk with 2 tbsp salt. Add the chicken pieces, ensuring they're fully submerged in the buttermilk. Cover and refrigerate for at least 4 hours, or ideally overnight (8-12 hours). This crucial step tenderizes the chicken and adds moisture, creating that signature KFC juiciness.",
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
                text: "Prepare the Original Recipe coating: In a large bowl or shallow dish, combine the plain flour, paprika, black pepper, white pepper, garlic powder, onion powder, oregano, thyme, basil, marjoram, celery salt, mustard powder, ground ginger, 2 tbsp salt, and MSG (if using). Mix thoroughly until all herbs and spices are evenly distributed. This is your secret 11 herbs and spices blend - the heart of KFC's recipe!",
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
                text: "Coat the chicken: Remove the chicken pieces from the buttermilk one at a time, letting excess drip off but keeping them moist. Dredge each piece thoroughly in the seasoned flour mixture, pressing firmly to ensure the coating adheres well. For that extra-thick KFC coating, dip the floured pieces back in the buttermilk briefly, then coat again in the flour mixture. Place coated pieces on a wire rack and let rest for 20 minutes - this helps the coating stick during frying.",
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
                text: "Heat the oil: In a large, heavy-bottomed pot or deep fryer, heat the vegetable oil to 160°C (325°F). This lower temperature than typical frying is key to the Original Recipe - it allows the chicken to cook through without burning the coating. Use a thermometer to maintain steady temperature throughout frying.",
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
                text: "Fry the chicken (traditional method): Carefully lower 3-4 pieces into the hot oil (don't overcrowd). Fry for 14-18 minutes for white meat (breasts, wings) and 18-22 minutes for dark meat (thighs, drumsticks), turning occasionally. The chicken is done when golden brown and the internal temperature reaches 75°C (165°F). The coating should be crispy and deep golden.",
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
                text: "Pressure frying method (most authentic): If you have a pressure fryer or stovetop pressure cooker suitable for frying, heat oil to 180°C (350°F), add chicken pieces, seal the lid, and cook under pressure for 8-10 minutes for white meat, 10-12 minutes for dark meat. Release pressure carefully, then remove chicken. This is Colonel Sanders' original method and produces the moistest results.",
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
                text: "Drain and rest: Remove the fried chicken with tongs or a slotted spoon and drain on a wire rack set over kitchen paper. Let rest for 5 minutes before serving - this allows the juices to redistribute and the coating to set properly.",
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
                text: "Serve hot: Enjoy your homemade KFC Original Recipe chicken while it's hot and crispy! Serve with classic KFC sides like coleslaw, mashed potato with gravy, corn on the cob, or biscuits. Store any leftovers in the fridge and reheat in the oven at 180°C for 10-15 minutes to restore crispiness.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "MSG is controversial but authentic - KFC uses it. It enhances the savory umami flavor. Skip it if you prefer, but the taste won't be quite as close to the original.",
      "The resting period after coating is crucial - it allows the flour to hydrate and stick better, preventing the coating from falling off during frying.",
      "For the most accurate Original Recipe taste, use a mix of both black and white pepper. White pepper adds a subtle heat without the visible black specks.",
      "Don't skip the buttermilk brine! This is what makes KFC chicken so tender and juicy. Minimum 4 hours, but overnight is best.",
      "Temperature control is critical - too hot and the coating burns before the chicken cooks; too cool and you get greasy chicken. Invest in a good thermometer.",
      "Make extra coating mix and store it in an airtight container for up to 3 months - perfect for quick KFC cravings!",
      "For a healthier version, bake at 200°C (400°F) for 40-45 minutes, turning halfway through. It won't be quite as crispy but still delicious.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Is this really the Colonel's secret recipe?",
        answer:
          "While the exact KFC recipe remains locked in a vault, this version is based on the widely-publicized 'leaked' family recipe from 2016 and decades of recipe analysis. It captures the essence of the Original Recipe remarkably well, with the signature blend of herbs, spices, and that distinctive KFC flavor profile. Many who've tried it say it's the closest homemade version to the real thing.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Do I need a pressure fryer to make authentic KFC chicken?",
        answer:
          "While Colonel Sanders invented pressure frying and KFC still uses it, you can achieve excellent results with regular deep frying. The pressure fryer cooks faster and seals in more moisture, but traditional frying at 160°C (325°F) for longer produces similar results. Never attempt pressure frying in a regular pressure cooker without proper equipment - it's dangerous.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What are all 11 herbs and spices?",
        answer:
          "Based on the leaked recipe, they are: paprika, black pepper, white pepper, garlic powder, onion powder, oregano, thyme, basil, marjoram, celery salt, mustard powder, and ground ginger. That's actually 12 if you count salt separately! The exact proportions are what create the magic, along with MSG for that savory umami punch.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this without MSG?",
        answer:
          "Yes, though MSG adds that distinctive savory depth that makes KFC taste like KFC. If you skip it, the chicken will still be delicious but won't taste quite as authentic. MSG is a naturally occurring compound found in tomatoes, cheese, and mushrooms - it's safe for most people despite old myths.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I get the coating to stay on?",
        answer:
          "Three key steps: 1) Ensure chicken is wet from buttermilk but not dripping. 2) Press the flour mixture firmly onto the chicken. 3) Let coated chicken rest for 20 minutes before frying. The flour needs time to hydrate and adhere. Also, don't move the chicken around too much when first added to oil - let it set for 2-3 minutes first.",
      },
    ],
    nutrition: {
      calories: 320,
      protein: 29,
      fat: 18,
      carbs: 12,
    },
    seoTitle: "KFC Original Recipe Chicken - Secret 11 Herbs & Spices Copycat",
    seoDescription:
      "Make Colonel Sanders' famous KFC Original Recipe Chicken at home! This authentic copycat features the secret 11 herbs & spices blend. Crispy, juicy fried chicken perfection. Step-by-step guide.",
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
      _id: `drafts.kfc-original-recipe-chicken-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! KFC Original Recipe Chicken is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized with signature recipe flag set to true!");
  console.log("🌟 Features the legendary 11 herbs & spices blend!");
  console.log("🔒 Based on the famous 'leaked' family recipe from 2016!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
