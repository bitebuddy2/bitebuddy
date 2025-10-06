// scripts/create-nandos-peri-peri-chicken.ts
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

// Ingredient data for Nando's Peri Peri Chicken
const ingredients = [
  // Chicken
  {
    name: "Whole chicken",
    synonyms: ["whole roasting chicken", "whole roaster"],
    kcal100: 239,
    protein100: 27,
    fat100: 14,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: 1500,
  },
  // Peri Peri Sauce ingredients
  {
    name: "Red bird's eye chillies",
    synonyms: ["bird's eye chilli", "Thai chilli", "piri piri chilli", "African bird's eye"],
    kcal100: 40,
    protein100: 2,
    fat100: 0.2,
    carbs100: 9,
    allergens: [],
    gramsPerPiece: 3,
  },
  {
    name: "Red bell peppers",
    synonyms: ["red pepper", "red capsicum", "sweet red pepper"],
    kcal100: 31,
    protein100: 1,
    fat100: 0.3,
    carbs100: 6,
    allergens: [],
    gramsPerPiece: 200,
  },
  {
    name: "Garlic cloves",
    synonyms: ["fresh garlic", "garlic"],
    kcal100: 149,
    protein100: 6.4,
    fat100: 0.5,
    carbs100: 33,
    allergens: [],
    gramsPerPiece: 3,
  },
  {
    name: "Lemon juice",
    synonyms: ["fresh lemon juice", "juice of lemon"],
    kcal100: 22,
    protein100: 0.4,
    fat100: 0.2,
    carbs100: 6.9,
    allergens: [],
    density_g_per_ml: 1.03,
  },
  {
    name: "Red wine vinegar",
    synonyms: ["red vinegar"],
    kcal100: 19,
    protein100: 0,
    fat100: 0,
    carbs100: 0.4,
    allergens: [],
    density_g_per_ml: 1.01,
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
    name: "Dried oregano",
    synonyms: ["oregano", "dried oregano leaves"],
    kcal100: 265,
    protein100: 9,
    fat100: 4.3,
    carbs100: 69,
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
    name: "Black pepper",
    synonyms: ["ground black pepper"],
    kcal100: 251,
    protein100: 10,
    fat100: 3.3,
    carbs100: 64,
    allergens: [],
  },
  {
    name: "Brown sugar",
    synonyms: ["soft brown sugar", "light brown sugar"],
    kcal100: 380,
    protein100: 0.1,
    fat100: 0,
    carbs100: 98,
    allergens: [],
    density_g_per_ml: 0.72,
  },
  {
    name: "Fresh bay leaves",
    synonyms: ["bay leaf", "bay leaves"],
    kcal100: 313,
    protein100: 7.6,
    fat100: 8.4,
    carbs100: 75,
    allergens: [],
    gramsPerPiece: 0.5,
  },
  // For serving
  {
    name: "Fresh coriander",
    synonyms: ["cilantro", "coriander leaves", "fresh cilantro"],
    kcal100: 23,
    protein100: 2.1,
    fat100: 0.5,
    carbs100: 3.7,
    allergens: [],
    gramsPerPiece: 5,
  },
  {
    name: "Lemon wedges",
    synonyms: ["lemon quarters", "fresh lemon"],
    kcal100: 29,
    protein100: 1.1,
    fat100: 0.3,
    carbs100: 9,
    allergens: [],
    gramsPerPiece: 15,
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
  console.log("🔥 Creating Nando's Peri Peri Chicken Recipe\n");
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
    `*[_type == "recipe" && slug.current == "nandos-peri-peri-chicken"][0]`
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

  const recipeData = {
    _type: "recipe",
    title: "Nando's Peri Peri Chicken",
    slug: {
      _type: "slug",
      current: "nandos-peri-peri-chicken",
    },
    description:
      "Make Nando's legendary Peri Peri Chicken at home with this authentic Portuguese-African copycat recipe. Flame-grilled spicy chicken marinated in homemade peri peri sauce - better than the restaurant!",
    servings: 4,
    prepMin: 20,
    cookMin: 45,
    kcal: 385,
    introText:
      "Nando's Peri Peri Chicken is a global phenomenon that started in South Africa in 1987 and has taken the world by storm with its addictive flame-grilled chicken and legendary peri peri sauce. The secret lies in the Portuguese-African fusion of flavours - the peri peri chilli (also known as African bird's eye chilli) combined with garlic, lemon, and herbs creates an irresistible marinade that's simultaneously spicy, tangy, and aromatic. What makes Nando's chicken truly special is the technique: butterfly-spatchcocked chicken that's marinated for hours, then flame-grilled to perfection with that signature char. The result is incredibly juicy chicken with crispy, caramelized skin and layers of complex flavour in every bite. This homemade version captures the exact taste of Nando's famous Medium or Hot peri peri chicken, using authentic ingredients and traditional Portuguese-African techniques. Whether you grill it outdoors or roast it in the oven, you'll achieve that same restaurant-quality chicken that keeps people queuing at Nando's worldwide!",
    ...(nandosBrand && {
      brand: {
        _type: "reference",
        _ref: nandosBrand._id,
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
            text: "Nando's was founded in 1987 in Johannesburg, South Africa, by Fernando Duarte and Robbie Brozin after they discovered a Portuguese restaurant called Chickenland that served peri peri chicken. They were so impressed that they bought the restaurant and renamed it Nando's, after Fernando's nickname. The peri peri tradition comes from Portuguese explorers who brought African bird's eye chillies from Mozambique to Portugal in the 15th century, creating this unique Portuguese-African fusion cuisine.",
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
            text: "Today, Nando's has over 1,200 restaurants across 30 countries, making it one of the world's most successful casual dining chains. The brand's success lies in its authentic flame-grilled chicken and customizable spice levels - from Lemon & Herb (no heat) to Extra Extra Hot (fierce). Each restaurant features a real flame grill, and the peri peri sauce is still made to traditional Portuguese-African recipes. The chicken is always marinated for 24 hours and flame-grilled fresh to order, ensuring consistent quality and that addictive Nando's taste that has created a cult following worldwide.",
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
              _ref: ingredientIds["Whole chicken"],
            },
            quantity: "1",
            unit: "",
            notes: "1.5kg, spatchcocked/butterflied",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Peri Peri Sauce/Marinade",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Red bird's eye chillies"],
            },
            quantity: "6-8",
            unit: "",
            notes: "adjust for heat level",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Red bell peppers"],
            },
            quantity: "1",
            unit: "",
            notes: "roughly chopped",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Garlic cloves"],
            },
            quantity: "6",
            unit: "",
            notes: "peeled",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Lemon juice"],
            },
            quantity: "100",
            unit: "ml",
            notes: "about 2 lemons",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Red wine vinegar"],
            },
            quantity: "3",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Olive oil"],
            },
            quantity: "120",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Smoked paprika"],
            },
            quantity: "2",
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
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Cayenne pepper"],
            },
            quantity: "1",
            unit: "tsp",
            notes: "optional, for extra heat",
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
              _ref: ingredientIds["Brown sugar"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fresh bay leaves"],
            },
            quantity: "2",
            unit: "",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For Serving",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fresh coriander"],
            },
            quantity: "",
            unit: "",
            notes: "to garnish",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Lemon wedges"],
            },
            quantity: "",
            unit: "",
            notes: "to serve",
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
                text: "Spatchcock the chicken: Place the chicken breast-side down on a chopping board. Using sharp kitchen scissors, cut along both sides of the backbone and remove it completely. Flip the chicken over and press down firmly on the breastbone to flatten it. This technique ensures even cooking and maximum surface area for the marinade.",
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
                text: "Make the peri peri sauce: In a blender or food processor, combine the bird's eye chillies (remove seeds for less heat), chopped red pepper, garlic cloves, lemon juice, red wine vinegar, olive oil, smoked paprika, oregano, cayenne pepper (if using), salt, pepper, brown sugar, and bay leaves. Blend until smooth and well combined. Taste and adjust seasoning - this should be tangy, spicy, and slightly sweet.",
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
                text: "Marinate the chicken: Place the spatchcocked chicken in a large dish or resealable bag. Pour about three-quarters of the peri peri sauce over the chicken, reserving the rest for basting and serving. Massage the marinade thoroughly into the chicken, making sure to get under the skin and into all the crevices. Cover and refrigerate for at least 4 hours, but ideally 12-24 hours for maximum flavour (Nando's marinates for 24 hours).",
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
                text: "Prepare for cooking: Remove the chicken from the fridge 30 minutes before cooking to bring it to room temperature. This ensures even cooking. Preheat your grill to medium-high heat (200°C/400°F) or preheat your oven to 200°C (400°F/Gas 6).",
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
                text: "Grill method (most authentic): Place the marinated chicken skin-side down on the preheated grill. Cook for 20-25 minutes, then flip and grill for another 20-25 minutes, basting regularly with the reserved peri peri sauce. The chicken is done when the internal temperature reaches 75°C (165°F) and the juices run clear. For extra char, increase the heat for the last 5 minutes.",
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
                text: "Oven method (easier): Place the chicken skin-side up on a baking tray lined with foil. Roast for 40-45 minutes, basting with reserved peri peri sauce every 15 minutes. For that charred Nando's finish, place under a hot grill (broiler) for 3-5 minutes at the end, watching carefully to prevent burning.",
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
                text: "Rest and serve: Once cooked, transfer the chicken to a serving board and let it rest for 10 minutes - this keeps it juicy. Cut into quarters or portions. Drizzle with any remaining peri peri sauce, garnish with fresh coriander, and serve with lemon wedges. Perfect with Nando's-style peri peri chips, corn on the cob, or coleslaw!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "For the heat levels: Use 4 chillies for Lemon & Herb (mild), 6 for Medium, 8 for Hot, and 10+ with extra cayenne for Extra Hot. Adjust to your preference!",
      "Can't find bird's eye chillies? Use 3-4 scotch bonnet chillies (very hot) or 8-10 red jalapeños (milder) as substitutes.",
      "Make extra peri peri sauce - it keeps in the fridge for up to 2 weeks and is amazing on everything from chips to vegetables to burgers.",
      "For authentic Nando's flavour, don't skip the marinating time. Overnight is best, but minimum 4 hours.",
      "If your grill has a lid, use it! This creates an oven effect and cooks the chicken more evenly while adding smoky flavour.",
      "Spatchcocking is key - it reduces cooking time by 30% and ensures the whole chicken cooks evenly. Ask your butcher to do it if you're not confident.",
      "Save the backbone for making stock - waste not, want not!",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "What are bird's eye chillies and where can I find them?",
        answer:
          "Bird's eye chillies (also called piri piri or African bird's eye) are small, fiery red chillies essential for authentic peri peri sauce. Find them in Asian supermarkets, African grocery stores, or online. They're about 2-3cm long and pack serious heat. If unavailable, substitute with Thai chillies or a mix of red jalapeños and cayenne pepper.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use chicken pieces instead of a whole chicken?",
        answer:
          "Absolutely! Chicken thighs, drumsticks, or breasts all work brilliantly. Marinate the same way but adjust cooking time: thighs and drumsticks need 30-35 minutes, breasts need 25-30 minutes. Bone-in pieces give the most authentic Nando's taste and stay juicier than boneless.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I make it less spicy for kids?",
        answer:
          "For a mild version (like Nando's Lemon & Herb), use only 2-3 bird's eye chillies (deseeded), skip the cayenne pepper, and add an extra tablespoon of lemon juice. You can also make a separate mild marinade for kids' portions. The sweetness from the red pepper and brown sugar balances the heat nicely.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I cook this in an air fryer?",
        answer:
          "Yes! Marinate as directed, then air fry at 180°C (350°F) for 35-40 minutes, flipping halfway through and basting with sauce. Increase to 200°C (400°F) for the last 5 minutes to crisp the skin. You may need to cook in batches depending on your air fryer size.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What makes Nando's peri peri sauce different from other hot sauces?",
        answer:
          "Nando's peri peri is unique because it's not just about heat - it's a balanced blend of chilli, citrus, garlic, and herbs with Portuguese-African origins. The bird's eye chilli provides the heat, lemon adds tang, garlic gives depth, and the paprika and herbs create complexity. It's both a marinade and a sauce, unlike most hot sauces which are just condiments.",
      },
    ],
    nutrition: {
      calories: 385,
      protein: 42,
      fat: 22,
      carbs: 4,
    },
    seoTitle: "Nando's Peri Peri Chicken Recipe - Authentic Portuguese Copycat",
    seoDescription:
      "Make Nando's famous Peri Peri Chicken at home! This authentic Portuguese-African copycat recipe features flame-grilled spicy chicken with homemade peri peri sauce. Easy step-by-step guide.",
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
      _id: `drafts.nandos-peri-peri-chicken-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Nando's Peri Peri Chicken recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized with signature recipe flag set to true!");
  console.log("🔥 Features authentic Portuguese-African peri peri flavours!");
  console.log("🌶️  Customizable heat levels from mild to extra hot!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
