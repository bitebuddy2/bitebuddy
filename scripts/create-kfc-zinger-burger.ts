// scripts/create-kfc-zinger-burger.ts
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

// Ingredient data for KFC Zinger Burger
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
    name: "Hot sauce",
    synonyms: ["tabasco", "Louisiana hot sauce", "cayenne hot sauce"],
    kcal100: 21,
    protein100: 0.9,
    fat100: 0.5,
    carbs100: 3.6,
    allergens: [],
    density_g_per_ml: 1.05,
  },
  // Spicy coating
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
    name: "Cayenne pepper",
    synonyms: ["ground cayenne", "cayenne powder"],
    kcal100: 318,
    protein100: 12,
    fat100: 17,
    carbs100: 57,
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
  // Burger assembly
  {
    name: "Long burger buns",
    synonyms: ["sub buns", "long bread rolls", "brioche hot dog buns"],
    kcal100: 275,
    protein100: 9,
    fat100: 5,
    carbs100: 49,
    allergens: ["gluten"],
    gramsPerPiece: 70,
  },
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
    name: "Mayonnaise",
    synonyms: ["mayo", "real mayonnaise"],
    kcal100: 680,
    protein100: 1.1,
    fat100: 75,
    carbs100: 0.6,
    allergens: ["eggs"],
    density_g_per_ml: 0.91,
  },
  // For the spicy mayo (optional but authentic)
  {
    name: "Sriracha sauce",
    synonyms: ["sriracha", "sriracha hot sauce", "rooster sauce"],
    kcal100: 93,
    protein100: 2,
    fat100: 0.5,
    carbs100: 19,
    allergens: [],
    density_g_per_ml: 1.1,
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
  console.log("🍗 Creating KFC Zinger Burger Recipe\n");
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
    `*[_type == "recipe" && slug.current == "kfc-zinger-burger"][0]`
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
    title: "KFC Zinger Burger",
    slug: {
      _type: "slug",
      current: "kfc-zinger-burger",
    },
    description:
      "Make the legendary KFC Zinger Burger at home with this spicy copycat recipe. Crispy buttermilk fried chicken with a fiery coating, creamy mayo, and fresh lettuce in a soft bun - better than the original!",
    servings: 4,
    prepMin: 25,
    cookMin: 20,
    kcal: 685,
    introText:
      "The KFC Zinger Burger is a global phenomenon that's become one of the most requested items on KFC's menu worldwide. First introduced in Trinidad and Tobago in 1984, this spicy sensation quickly spread across the world, earning a cult following for its perfectly balanced heat and incredible crunch. What sets the Zinger apart is its double-coated, extra-crispy chicken fillet that's been marinated in buttermilk and packed with a secret blend of herbs and spices - including a serious kick of cayenne pepper. The combination of the fiery, crunchy chicken with cool, creamy mayo and crisp lettuce creates an addictive flavour experience that keeps fans coming back. This homemade version captures every element of the original, from the tongue-tingling spice level to that signature KFC crunch. Whether you're a spice lover or just want to recreate this iconic fast-food favourite, this recipe delivers authentic Zinger taste without the queue!",
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
            text: "The KFC Zinger Burger was created in 1984 in Trinidad and Tobago by a local KFC franchisee looking to cater to Caribbean tastes for spicy food. The burger was such a hit that it was rolled out globally, becoming one of KFC's most successful international products. Unlike Colonel Sanders' Original Recipe chicken, the Zinger has its own distinct spice blend that emphasizes heat alongside the signature 11 herbs and spices.",
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
            text: "The Zinger has become so popular that KFC has created numerous variations including the Zinger Tower, Double Zinger, and even a Zinger pizza in some markets. In the UK, the Zinger consistently ranks as one of the top-selling items, with fans praising its perfect balance of spice, crunch, and flavour. The burger's success lies in its ability to deliver consistent heat and quality - something this homemade recipe faithfully recreates.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
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
            quantity: "300",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Hot sauce"],
            },
            quantity: "3",
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
        heading: "For the Spicy Coating",
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
              _ref: ingredientIds["Cayenne pepper"],
            },
            quantity: "2",
            unit: "tbsp",
            notes: "adjust to taste",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Smoked paprika"],
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
        ],
      },
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
            quantity: "4",
            unit: "",
            notes: "about 150g each, butterflied",
          },
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
              _ref: ingredientIds["Long burger buns"],
            },
            quantity: "4",
            unit: "",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Mayonnaise"],
            },
            quantity: "4",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sriracha sauce"],
            },
            quantity: "1-2",
            unit: "tsp",
            notes: "optional, for spicy mayo",
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
                text: "Prepare the chicken: Butterfly each chicken breast by slicing horizontally through the middle (don't cut all the way through) and opening it like a book. Place between two sheets of cling film and bash with a rolling pin until about 1cm thick and evenly flat. This ensures even cooking and that signature Zinger shape.",
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
                text: "Make the marinade: In a large bowl, whisk together buttermilk, hot sauce, and 1 tsp salt. Add the chicken fillets, ensuring they're fully submerged. Cover and refrigerate for at least 4 hours, or ideally overnight. This step is crucial for tender, flavourful chicken.",
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
                text: "Prepare the spicy coating: In a large shallow dish, mix together the plain flour, cornflour, cayenne pepper, smoked paprika, garlic powder, onion powder, black pepper, 2 tsp salt, oregano, and thyme. Mix thoroughly until the spices are evenly distributed throughout the flour.",
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
                text: "Double coat the chicken: Remove one chicken fillet from the buttermilk marinade, letting excess drip off. Dredge it in the spiced flour mixture, pressing firmly to coat well. Dip it back into the buttermilk briefly, then coat again in the flour mixture. This double coating creates that extra-crispy KFC texture. Place on a wire rack and repeat with remaining fillets. Let them rest for 10 minutes.",
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
                text: "Heat the oil: In a large, deep saucepan or deep fryer, heat the vegetable oil to 170°C (340°F). Use a thermometer to maintain the temperature - this is crucial for crispy, not greasy chicken. The temperature should stay between 165-175°C while frying.",
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
                text: "Fry the chicken: Carefully lower 2 chicken fillets into the hot oil (don't overcrowd). Fry for 7-9 minutes, turning occasionally, until deep golden brown and the internal temperature reaches 75°C (165°F). The coating should be crispy and the chicken cooked through. Remove and drain on kitchen paper. Keep warm while frying the remaining fillets.",
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
                text: "Prepare the spicy mayo (optional but recommended): Mix the mayonnaise with sriracha sauce to taste. Start with 1 tsp and add more if you want extra heat. This adds another layer of flavour and authentic KFC-style tang.",
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
                text: "Toast the buns and assemble: Slice the burger buns in half and lightly toast them (cut-side down) in a dry pan or under the grill for 30 seconds. Spread the spicy mayo on both halves of each bun. Place a generous handful of shredded iceberg lettuce on the bottom half, top with a hot crispy chicken fillet, then add the top bun. Press down gently and serve immediately while the chicken is still hot and crispy!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "For extra heat that matches the spiciest Zinger versions, increase the cayenne pepper to 3 tbsp and add 1/2 tsp of chilli powder to the coating.",
      "The marinade is key - don't skip it! Overnight marinating gives the most tender, flavourful results. In a pinch, marinate for at least 2 hours minimum.",
      "If you don't have buttermilk, make your own by adding 1 tbsp lemon juice or white vinegar to 300ml whole milk. Let it sit for 10 minutes until it curdles slightly.",
      "For a healthier version, bake the coated chicken at 220°C (425°F) for 25-30 minutes, turning halfway through and spraying with oil for crispiness.",
      "Keep the oil temperature consistent - too hot and the coating burns before the chicken cooks; too cool and you'll get greasy chicken.",
      "Make it a Zinger Tower by adding a hash brown and cheese slice between the chicken and top bun!",
      "Freeze leftover spiced flour mixture for up to 3 months - perfect for making quick Zingers or coating other proteins.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "How spicy is the KFC Zinger Burger?",
        answer:
          "The Zinger has a medium-hot spice level with a nice kick from the cayenne pepper. It's definitely spicier than a regular fried chicken burger but not overwhelming. You can adjust the cayenne in the coating to make it milder (1 tbsp) or hotter (3 tbsp) to suit your taste.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this in an air fryer?",
        answer:
          "Yes! Spray the coated chicken fillets generously with oil spray and air fry at 200°C (400°F) for 15-18 minutes, turning halfway through. The texture won't be quite as crispy as deep-fried but it's still delicious and much healthier.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What type of bun should I use?",
        answer:
          "KFC uses long, soft white buns similar to sub rolls or brioche hot dog buns. Look for buns that are about 15-18cm long and soft but sturdy enough to hold the chicken and toppings. Brioche buns work particularly well as they're soft and slightly sweet.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I prepare the chicken ahead of time?",
        answer:
          "You can marinate the chicken up to 24 hours ahead and store it in the fridge. The coated (but unfried) chicken can be prepared up to 2 hours ahead and kept in the fridge. For best results, fry just before serving. Leftover fried chicken can be reheated in the oven at 180°C for 10 minutes.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What's the secret to getting it extra crispy like KFC?",
        answer:
          "The secret is the double coating technique (buttermilk, flour, buttermilk, flour), letting the coated chicken rest for 10 minutes before frying, and maintaining the correct oil temperature (170°C). Also, adding cornflour to the flour mixture creates extra crispiness.",
      },
    ],
    nutrition: {
      calories: 685,
      protein: 42,
      fat: 35,
      carbs: 52,
    },
    seoTitle: "KFC Zinger Burger Recipe - Spicy Copycat Fried Chicken Burger",
    seoDescription:
      "Make KFC's famous Zinger Burger at home! This spicy fried chicken burger recipe features crispy buttermilk chicken, creamy mayo & lettuce. Easy copycat recipe with step-by-step guide.",
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
      _id: `drafts.kfc-zinger-burger-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! KFC Zinger Burger recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized with signature recipe flag set to true!");
  console.log("🌶️  Spice level: Medium-hot (adjust cayenne to preference)");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
