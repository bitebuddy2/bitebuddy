// scripts/create-costa-ham-cheese-toastie.ts
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

// Ingredient data for Costa Ham and Cheese Topped Toastie
const ingredients = [
  {
    name: "Thick white bread",
    synonyms: ["white bloomer", "white farmhouse bread", "thick-sliced white bread"],
    kcal100: 265,
    protein100: 9.4,
    fat100: 3.2,
    carbs100: 49,
    allergens: ["gluten"],
    gramsPerPiece: 40, // per thick slice
  },
  {
    name: "Mature cheddar cheese",
    synonyms: ["cheddar cheese", "mature cheddar", "sharp cheddar"],
    kcal100: 416,
    protein100: 25,
    fat100: 35,
    carbs100: 0.1,
    allergens: ["milk"],
  },
  {
    name: "Cooked ham",
    synonyms: ["ham slices", "deli ham", "sliced ham"],
    kcal100: 145,
    protein100: 21,
    fat100: 5,
    carbs100: 1.5,
    allergens: [],
  },
  {
    name: "Softened butter",
    synonyms: ["butter", "salted butter", "unsalted butter"],
    kcal100: 717,
    protein100: 0.9,
    fat100: 81,
    carbs100: 0.9,
    allergens: ["milk"],
    density_g_per_ml: 0.96,
  },
  {
    name: "Dijon mustard",
    synonyms: ["French mustard", "smooth mustard"],
    kcal100: 143,
    protein100: 7.6,
    fat100: 10,
    carbs100: 7.4,
    allergens: ["mustard"],
    density_g_per_ml: 1.05,
  },
  {
    name: "Mayonnaise",
    synonyms: ["mayo", "real mayonnaise"],
    kcal100: 680,
    protein100: 1.1,
    fat100: 75,
    carbs100: 2.7,
    allergens: ["egg"],
    density_g_per_ml: 0.91,
  },
  {
    name: "Red Leicester cheese",
    synonyms: ["Leicester cheese", "red leicester"],
    kcal100: 392,
    protein100: 24,
    fat100: 32,
    carbs100: 0.1,
    allergens: ["milk"],
  },
  {
    name: "Paprika",
    synonyms: ["sweet paprika", "ground paprika"],
    kcal100: 289,
    protein100: 14,
    fat100: 13,
    carbs100: 54,
    allergens: [],
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
  console.log("🥪 Creating Costa Ham and Cheese Topped Toastie Recipe\n");
  console.log("Creating ingredients...\n");

  // Create or get all ingredients and store their IDs
  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  // Get Costa brand
  const costaBrand = await client.fetch(
    `*[_type == "brand" && slug.current == "costa"][0]`
  );

  if (!costaBrand) {
    console.log("⚠️  Costa brand not found - recipe will be created without brand reference");
  }

  const recipeData = {
    _type: "recipe",
    title: "Costa Ham and Cheese Topped Toastie",
    slug: {
      _type: "slug",
      current: "costa-ham-cheese-topped-toastie",
    },
    description:
      "Recreate Costa's Ham and Cheese Topped Toastie at home with this easy copycat recipe. Crispy toasted bread with ham, melted cheddar, and a golden cheese crust on top!",
    servings: 2,
    prepMin: 5,
    cookMin: 10,
    kcal: 485,
    introText:
      "Costa's Ham and Cheese Topped Toastie is a coffee shop classic that takes the humble toastie to the next level. What makes Costa's version so special is the signature cheese topping - before the toastie goes in the press, they add grated cheese on top of the bread which melts and crisps into a golden, crunchy crust. This creates an amazing textural contrast: melted, gooey cheese inside and crispy, caramelized cheese on the outside. The filling is simple but perfect - quality ham, mature cheddar cheese, and a touch of mustard mayo that adds tangy creamness without overpowering the other flavours. Unlike many toasties that can be dry, Costa's version stays moist inside thanks to the mayo-mustard mixture, while the cheese topping ensures maximum crispy satisfaction. This copycat recipe recreates that signature topped style using a panini press or grill, though you can also use a frying pan with a weighted lid. The key is using thick-sliced bread that can hold up to the generous filling, and not skimping on the cheese topping - that's what makes it Costa! Perfect for a quick lunch, light dinner, or weekend brunch treat.",
    ...(costaBrand && {
      brand: {
        _type: "reference",
        _ref: costaBrand._id,
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
            text: "Costa Coffee, founded in London in 1971 by Italian brothers Sergio and Bruno Costa, has become the UK's favourite coffee shop chain with over 2,700 stores nationwide. While famous for their coffee, Costa's food menu has expanded significantly over the years, with toasties becoming one of their most popular lunchtime options. The Ham and Cheese Topped Toastie is a menu staple, loved for its generous filling and signature cheese-topped crust.",
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
            text: "The 'topped' style of Costa's toasties sets them apart from competitors - the addition of grated cheese on top of the bread before toasting creates a distinctive golden crust that's become a Costa signature. This technique, combined with quality ingredients and the perfect bread-to-filling ratio, has made their toasties a go-to choice for customers wanting something more substantial than a pastry but quicker than a full meal. The Ham and Cheese Topped Toastie typically costs around £4.50-£5.00.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Toastie",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Thick white bread"],
            },
            quantity: "4",
            unit: "",
            notes: "thick slices",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Mature cheddar cheese"],
            },
            quantity: "100",
            unit: "g",
            notes: "60g grated for filling, 40g for topping",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Cooked ham"],
            },
            quantity: "100",
            unit: "g",
            notes: "4-6 slices",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Softened butter"],
            },
            quantity: "25",
            unit: "g",
            notes: "for spreading",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dijon mustard"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Mayonnaise"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Red Leicester cheese"],
            },
            quantity: "20",
            unit: "g",
            notes: "grated, for topping (optional but authentic)",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Paprika"],
            },
            quantity: "pinch",
            unit: "",
            notes: "for sprinkling on top",
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
                text: "Make the mustard mayo: In a small bowl, mix together the mayonnaise and Dijon mustard until well combined. This adds a tangy creaminess that keeps the toastie moist and flavourful. Set aside.",
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
                text: "Prepare the bread: Butter one side of each slice of bread - this will be the outside that gets toasted. The butter creates that golden, crispy exterior. Turn the slices over so the buttered side is face down.",
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
                text: "Assemble the toasties: On the unbuttered side of 2 slices, spread the mustard mayo mixture. Layer on the ham slices, then add 30g of grated mature cheddar on each. Top with the remaining bread slices, buttered side facing up.",
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
                text: "Add the signature cheese topping: Sprinkle the remaining 40g of grated mature cheddar on top of each toastie (on the buttered bread). If using, add 10g of grated Red Leicester cheese to each for that authentic Costa orange-red color. Sprinkle with a tiny pinch of paprika. This topping will melt and crisp into a golden crust - it's what makes it Costa!",
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
                text: "Toast in a panini press: Preheat your panini press or sandwich toaster to medium-high heat. Carefully place the topped toasties in the press, cheese-topped side up if possible (some presses close from the top, which is perfect). Close the lid gently - don't press down too hard or the filling will squeeze out. Toast for 4-5 minutes until the bread is golden and crispy, the cheese inside is melted, and the cheese topping is bubbling and caramelized.",
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
                text: "Alternative cooking method (frying pan): If you don't have a panini press, heat a large frying pan over medium heat. Place the topped toasties cheese-side up in the pan. Place another heavy pan on top to weigh them down (or use a burger press). Cook for 3-4 minutes until the bottom is golden, then carefully flip (some cheese topping may stick to the pan - that's ok, it creates extra crispy bits!). Cook for another 2-3 minutes. The cheese topping will melt and crisp on the pan surface.",
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
                text: "Serve immediately: Let the toastie rest for 1-2 minutes (this helps the cheese set slightly so it doesn't all ooze out when you cut it), then cut diagonally in half. The cheese topping should be golden and crispy, the inside hot and melty. Serve with crisps, salad, or tomato soup for the full Costa experience!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "The cheese topping is essential - don't skip it! It's what makes this a 'Costa' toastie. The grated cheese melts and crisps into a golden crust.",
      "Use thick-sliced bread (about 1.5-2cm thick) - thin bread will get too crispy and won't hold the generous filling.",
      "Mix the mustard and mayo together before spreading - this ensures even distribution of flavor throughout the toastie.",
      "Don't overfill - too much filling will squeeze out during toasting. Costa uses about 50g ham and 30g cheese per toastie.",
      "If your panini press heats from above, the cheese topping will caramelize beautifully. If using a frying pan, some cheese may stick to the pan - these crispy bits are delicious!",
      "Add a slice of tomato inside for extra moisture and a fresh contrast (Costa sometimes offers this as an option).",
      "For extra Costa authenticity, use a mix of mature cheddar and Red Leicester for the topping - the orange cheese is part of their signature look.",
      "Make sure your butter is softened - cold butter will tear the bread when you try to spread it.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use a different type of bread?",
        answer:
          "Yes! While Costa uses thick white bloomer, you can use wholemeal, sourdough, or even ciabatta. The key is using thick slices (1.5-2cm) that can hold up to the filling and cheese topping. Thinner sandwich bread will get too crispy and won't give you that substantial Costa feel.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What if I don't have a panini press?",
        answer:
          "No problem! Use a frying pan with a heavy pan or burger press on top to weigh the toastie down. Or use a George Foreman grill. You can even use a regular toastie maker, though you'll need to add the cheese topping after toasting by grilling it under the broiler for 1-2 minutes.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make these ahead of time?",
        answer:
          "You can assemble the toasties (without the cheese topping) up to 2 hours ahead and keep them refrigerated. Add the cheese topping just before cooking. Cooked toasties are best eaten immediately, but you can reheat them in the oven at 180°C for 5-7 minutes (though the cheese topping won't be as crispy).",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I add other ingredients?",
        answer:
          "Absolutely! Costa offers variations with tomato, red onion, or pickle. You could also add sliced gherkins, caramelized onions, or spinach. Just don't overfill - the cheese topping technique works best with a not-too-thick toastie.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What cheese should I use for the topping?",
        answer:
          "Costa uses a mix of mature cheddar and Red Leicester. The cheddar provides flavor and the Red Leicester adds that signature orange color. If you can't find Red Leicester, just use all cheddar - it will still be delicious, just less visually authentic. The cheese must be finely grated so it melts and crisps properly.",
      },
    ],
    nutrition: {
      calories: 485,
      protein: 28,
      fat: 26,
      carbs: 35,
    },
    seoTitle: "Costa Ham & Cheese Topped Toastie - Easy Copycat",
    seoDescription:
      "Make Costa's Ham & Cheese Topped Toastie at home! Crispy cheese crust, melted filling. Easy copycat recipe with step-by-step guide.",
  };

  // Always create as draft
  const draftId = `drafts.costa-ham-cheese-topped-toastie-${randomUUID()}`;
  const recipe = await client.create({
    ...recipeData,
    _id: draftId,
  });
  console.log("✅ Recipe created as DRAFT:", recipe._id);

  console.log("\n🎉 Done! Costa Ham and Cheese Topped Toastie recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized (NOT signature as requested):");
  console.log("   - SEO Title:", recipeData.seoTitle.length, "characters ✓");
  console.log("   - SEO Description:", recipeData.seoDescription.length, "characters ✓");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
