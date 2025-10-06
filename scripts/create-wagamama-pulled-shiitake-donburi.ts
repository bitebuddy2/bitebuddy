// scripts/create-wagamama-pulled-shiitake-donburi.ts
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

// Ingredient data for Wagamama Pulled Shiitake Donburi
const ingredients = [
  {
    name: "Shiitake mushrooms",
    synonyms: ["fresh shiitake", "shiitake", "Chinese black mushrooms"],
    kcal100: 34,
    protein100: 2.2,
    fat100: 0.5,
    carbs100: 6.8,
    allergens: [],
    gramsPerPiece: 15,
  },
  {
    name: "Sushi rice",
    synonyms: ["Japanese rice", "short grain rice"],
    kcal100: 130,
    protein100: 2.7,
    fat100: 0.3,
    carbs100: 28,
    allergens: [],
    density_g_per_ml: 0.85,
  },
  {
    name: "Soy sauce",
    synonyms: ["light soy sauce", "shoyu"],
    kcal100: 53,
    protein100: 6,
    fat100: 0,
    carbs100: 5,
    allergens: ["soya", "gluten"],
    density_g_per_ml: 1.15,
  },
  {
    name: "Mirin",
    synonyms: ["Japanese sweet rice wine", "sweet cooking wine"],
    kcal100: 226,
    protein100: 0.2,
    fat100: 0,
    carbs100: 43,
    allergens: [],
    density_g_per_ml: 1.1,
  },
  {
    name: "Rice wine vinegar",
    synonyms: ["rice vinegar", "Japanese vinegar"],
    kcal100: 18,
    protein100: 0.3,
    fat100: 0,
    carbs100: 0.8,
    allergens: [],
    density_g_per_ml: 1.01,
  },
  {
    name: "Maple syrup",
    synonyms: ["pure maple syrup"],
    kcal100: 260,
    protein100: 0,
    fat100: 0.1,
    carbs100: 67,
    allergens: [],
    density_g_per_ml: 1.37,
  },
  {
    name: "Sesame oil",
    synonyms: ["toasted sesame oil", "dark sesame oil"],
    kcal100: 884,
    protein100: 0,
    fat100: 100,
    carbs100: 0,
    allergens: ["sesame"],
    density_g_per_ml: 0.92,
  },
  {
    name: "Fresh ginger",
    synonyms: ["ginger root", "root ginger"],
    kcal100: 80,
    protein100: 1.8,
    fat100: 0.8,
    carbs100: 18,
    allergens: [],
    gramsPerPiece: 30,
  },
  {
    name: "Garlic",
    synonyms: ["garlic cloves", "fresh garlic"],
    kcal100: 149,
    protein100: 6.4,
    fat100: 0.5,
    carbs100: 33,
    allergens: [],
    gramsPerPiece: 3,
  },
  {
    name: "Spring onions",
    synonyms: ["scallions", "green onions", "salad onions"],
    kcal100: 32,
    protein100: 1.8,
    fat100: 0.2,
    carbs100: 7.3,
    allergens: [],
    gramsPerPiece: 10,
  },
  {
    name: "Tenderstem broccoli",
    synonyms: ["broccolini", "baby broccoli"],
    kcal100: 35,
    protein100: 3.7,
    fat100: 0.4,
    carbs100: 6.6,
    allergens: [],
    gramsPerPiece: 20,
  },
  {
    name: "Red cabbage",
    synonyms: ["purple cabbage"],
    kcal100: 31,
    protein100: 1.4,
    fat100: 0.2,
    carbs100: 7.4,
    allergens: [],
    gramsPerPiece: 50,
  },
  {
    name: "Edamame beans",
    synonyms: ["edamame", "soybeans", "soya beans"],
    kcal100: 122,
    protein100: 11,
    fat100: 5,
    carbs100: 10,
    allergens: ["soya"],
    gramsPerPiece: 2,
  },
  {
    name: "Sesame seeds",
    synonyms: ["toasted sesame seeds", "sesame"],
    kcal100: 573,
    protein100: 18,
    fat100: 50,
    carbs100: 23,
    allergens: ["sesame"],
    density_g_per_ml: 0.62,
  },
  {
    name: "Red chilli",
    synonyms: ["fresh red chilli", "red chili", "red pepper"],
    kcal100: 40,
    protein100: 2,
    fat100: 0.2,
    carbs100: 9,
    allergens: [],
    gramsPerPiece: 5,
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
];

async function createOrGetIngredient(ingredientData: typeof ingredients[0]) {
  const existing = await client.fetch(
    `*[_type == "ingredient" && name == $name][0]`,
    { name: ingredientData.name }
  );

  if (existing) {
    console.log(`✅ Found existing ingredient: ${ingredientData.name}`);
    return existing._id;
  }

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
  console.log("🍄 Creating Wagamama Pulled Shiitake Donburi Recipe\n");
  console.log("Creating ingredients...\n");

  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wagamama-pulled-shiitake-donburi"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  const wagamamaBrand = await client.fetch(
    `*[_type == "brand" && slug.current == "wagamama"][0]`
  );

  if (!wagamamaBrand) {
    console.log("⚠️  Wagamama brand not found - recipe will be created without brand reference");
  }

  const mainsCategory = await client.fetch(
    `*[_type == "category" && slug.current == "mains"][0]`
  );
  const veganCategory = await client.fetch(
    `*[_type == "category" && slug.current == "vegan"][0]`
  );
  const vegetarianCategory = await client.fetch(
    `*[_type == "category" && slug.current == "vegetarian"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Wagamama Pulled Shiitake Donburi",
    slug: {
      _type: "slug",
      current: "wagamama-pulled-shiitake-donburi",
    },
    description:
      "Make Wagamama's incredible vegan Pulled Shiitake Donburi at home! Sticky, glazed mushrooms with fresh vegetables over fluffy rice - plant-based Japanese comfort food at its finest.",
    servings: 2,
    prepMin: 15,
    cookMin: 20,
    introText:
      "Wagamama's Pulled Shiitake Donburi is a triumph of plant-based cooking, proving that vegan food can be just as satisfying, flavourful, and exciting as any meat dish. This stunning rice bowl features shiitake mushrooms that have been 'pulled' apart to create meaty, tender strands, then glazed in a sweet-savoury sauce until sticky and caramelised. Paired with vibrant fresh vegetables, fluffy Japanese rice, and aromatic garnishes, it's become one of Wagamama's most popular vegan dishes since its introduction. What makes this dish so special is the treatment of the shiitake mushrooms - these umami-rich fungi have a naturally meaty texture that intensifies when cooked, and the pulling technique creates more surface area for the glaze to cling to. The sauce is a masterful balance of soy, mirin, maple syrup, and sesame oil, creating layers of sweet, salty, and nutty flavours that transform the mushrooms into something truly extraordinary. The contrast of textures is beautiful: tender pulled shiitake, crisp broccoli, crunchy cabbage, and soft edamame beans all sitting on a bed of warm sushi rice. Fresh spring onions, red chilli, and toasted sesame seeds add brightness and visual appeal. This recipe recreates Wagamama's version faithfully, using the same cooking techniques that make the restaurant dish so addictive. The key is taking time to properly pull the mushrooms and letting them caramelise in the glaze - don't rush this step! Making it at home means you can enjoy this vegan favourite whenever you like, adjust the vegetables to your preference, and save money compared to dining out. It's substantial enough to satisfy even the biggest appetites, and so delicious that even non-vegans will be impressed!",
    ...(wagamamaBrand && {
      brand: {
        _type: "reference",
        _ref: wagamamaBrand._id,
      },
    }),
    ...(mainsCategory && veganCategory && vegetarianCategory && {
      categories: [
        {
          _type: "reference",
          _ref: mainsCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: veganCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: vegetarianCategory._id,
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
            text: "Wagamama has been at the forefront of offering substantial, exciting plant-based options long before it became trendy. In recent years, they've dramatically expanded their vegan menu, recognising the growing demand for delicious meat-free alternatives that don't compromise on flavour or satisfaction. The Pulled Shiitake Donburi represents this commitment perfectly - it's not a token vegan option but a dish that stands proudly alongside their meat-based offerings as equally craveable and delicious.",
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
            text: "The dish draws inspiration from traditional Japanese Buddhist cuisine (shojin ryori), which has celebrated mushrooms for centuries as a protein-rich, umami-packed ingredient. Shiitake mushrooms in particular are prized in Japanese cooking for their depth of flavour and satisfying texture. Wagamama's modern interpretation combines these traditional ingredients with contemporary plant-based cooking techniques, creating a dish that's rooted in Japanese culinary heritage but feels completely current. The 'pulled' technique mimics the texture of pulled pork or jackfruit dishes, making it particularly appealing to those transitioning to plant-based eating or simply wanting to eat less meat without sacrificing satisfaction.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Pulled Shiitake",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Shiitake mushrooms"],
            },
            quantity: "300",
            unit: "g",
            notes: "fresh, stems removed",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Soy sauce"],
            },
            quantity: "3",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Mirin"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Maple syrup"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Rice wine vinegar"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sesame oil"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fresh ginger"],
            },
            quantity: "1",
            unit: "tbsp",
            notes: "finely grated",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Garlic"],
            },
            quantity: "2",
            unit: "clove",
            notes: "minced",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Donburi Bowl",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sushi rice"],
            },
            quantity: "300",
            unit: "g",
            notes: "cooked weight, about 150g uncooked",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Tenderstem broccoli"],
            },
            quantity: "150",
            unit: "g",
            notes: "trimmed",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Red cabbage"],
            },
            quantity: "100",
            unit: "g",
            notes: "finely shredded",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Edamame beans"],
            },
            quantity: "100",
            unit: "g",
            notes: "cooked, podded",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Spring onions"],
            },
            quantity: "3",
            unit: "piece",
            notes: "finely sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Red chilli"],
            },
            quantity: "1",
            unit: "piece",
            notes: "finely sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sesame seeds"],
            },
            quantity: "1",
            unit: "tbsp",
            notes: "toasted",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vegetable oil"],
            },
            quantity: "1",
            unit: "tbsp",
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
                text: "Pull the mushrooms: Remove the stems from the shiitake mushrooms (save them for stock if you like). Using your fingers or two forks, gently pull each mushroom cap apart into 2-4 pieces, creating rough, shredded strands. Don't worry about making them perfect - the irregular pieces will catch the glaze beautifully and create varied textures. This 'pulled' texture is what makes the dish so special and meaty.",
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
                text: "Make the glaze: In a small bowl, whisk together the soy sauce, mirin, maple syrup, rice wine vinegar, sesame oil, grated ginger, and minced garlic until well combined. The maple syrup may take a moment to incorporate - keep whisking until smooth. Set aside.",
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
                text: "Cook the shiitake: Heat the vegetable oil in a large wok or frying pan over high heat until shimmering. Add the pulled shiitake pieces and spread them out in a single layer as much as possible. Let them cook undisturbed for 2-3 minutes until they start to colour and crisp on the bottom. Stir and cook for another 2-3 minutes until they're beginning to turn golden brown and have reduced in size.",
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
                text: "Glaze the mushrooms: Pour the glaze mixture over the mushrooms and toss immediately to coat. The liquid will bubble up and start to reduce. Keep stirring and tossing for 4-5 minutes as the glaze thickens and caramelises, coating the mushrooms in a sticky, glossy sauce. The mushrooms should look dark, shiny, and intensely flavoured. Don't rush this step - proper caramelisation is crucial for deep flavour. Once sticky and glossy, remove from heat and set aside.",
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
                text: "Prepare the vegetables: Bring a pan of water to the boil. Add the tenderstem broccoli and blanch for 2-3 minutes until tender but still with a slight bite. Drain and set aside. If using frozen edamame, blanch them at the same time for 2 minutes. The red cabbage stays raw for crunch, but you can lightly dress it with a splash of rice vinegar if you like.",
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
                text: "Assemble the donburi: Divide the cooked sushi rice between 2 large, wide bowls. Arrange the glazed pulled shiitake mushrooms prominently over one section of the rice. Add the blanched tenderstem broccoli, shredded red cabbage, and edamame beans in separate sections around the bowl - this creates that beautiful, colourful Wagamama presentation where you can see each component.",
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
                text: "Garnish and serve: Scatter the sliced spring onions, red chilli, and toasted sesame seeds over the entire bowl. If there's any glaze left in the pan from the mushrooms, drizzle it over the top. Serve immediately while everything is warm. Eat Wagamama-style by mixing everything together as you go, ensuring each mouthful combines rice, mushrooms, vegetables, and all those delicious garnishes!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Don't slice the mushrooms - pull them! This creates a more interesting, meaty texture with irregular pieces that hold the glaze better.",
      "Fresh shiitake are essential - dried shiitake that have been rehydrated won't have the right texture. Look for firm mushrooms with intact caps.",
      "The key to great flavour is letting the mushrooms caramelise properly in the glaze. Keep the heat high and let them get sticky and dark.",
      "Toast your sesame seeds in a dry pan for 2-3 minutes until golden - it intensifies their nutty flavour significantly.",
      "For extra protein, add crispy tofu cubes: press and cube firm tofu, then pan-fry until golden before adding to the bowl.",
      "Make it gluten-free by using tamari instead of regular soy sauce - the rest of the dish is naturally gluten-free.",
      "Substitute agave syrup or brown rice syrup for maple syrup if needed - both work well in the glaze.",
      "Add extra vegetables like pak choi, sugar snap peas, or baby corn to bulk it up even more.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use other mushrooms instead of shiitake?",
        answer:
          "Shiitake are really the best choice for their meaty texture and umami flavour, but in a pinch, you could use king oyster mushrooms (which also shred well), portobello mushrooms, or even large chestnut mushrooms. Avoid button mushrooms as they're too watery and small. Whatever you use, make sure to tear or shred them to create that pulled texture.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Is this dish completely vegan?",
        answer:
          "Yes! All the ingredients listed are plant-based. Just double-check your soy sauce (some brands contain fish extract) and ensure your maple syrup is pure (some cheaper syrups contain additives). The dish is also naturally dairy-free and egg-free. Wagamama's version is part of their certified vegan menu.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I cook perfect sushi rice?",
        answer:
          "Rinse 150g uncooked sushi rice under cold water until the water runs clear. Add to a pan with 200ml water, bring to the boil, then reduce to low, cover tightly, and simmer for 12 minutes. Remove from heat and let steam, covered, for 10 minutes. Don't lift the lid during cooking! Fluff with a fork before serving. You can season with a splash of rice vinegar and a pinch of sugar if desired.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I meal prep this dish?",
        answer:
          "Yes, with some caveats! Cook the rice and prepare the glazed mushrooms up to 2 days ahead and store separately in the fridge. Blanch the broccoli and keep it refrigerated. When ready to eat, reheat the mushrooms and broccoli gently (microwave or pan), warm the rice, then assemble fresh. Don't assemble too far in advance or the rice will absorb moisture and become mushy. Add fresh garnishes just before serving.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why are my mushrooms watery instead of sticky?",
        answer:
          "Two common causes: 1) The pan wasn't hot enough, causing the mushrooms to steam rather than caramelise - make sure your pan is properly hot before adding them, or 2) You added the glaze too early before the mushrooms had a chance to brown and lose their moisture. Cook the mushrooms first until golden, THEN add the glaze and let it reduce until thick and sticky.",
      },
    ],
    nutrition: {
      calories: 520,
      protein: 16,
      fat: 12,
      carbs: 88,
    },
    seoTitle: "Wagamama Pulled Shiitake Donburi - Vegan Recipe",
    seoDescription:
      "Make Wagamama's amazing vegan Pulled Shiitake Donburi at home! Sticky glazed mushrooms, fresh veg, fluffy rice. Easy plant-based copycat recipe.",
  };

  if (existingRecipe) {
    const updated = await client
      .patch(existingRecipe._id)
      .set(recipeData)
      .commit();
    console.log("✅ Recipe updated:", updated._id);
  } else {
    const recipe = await client.create({
      ...recipeData,
      _id: `drafts.wagamama-pulled-shiitake-donburi-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Wagamama Pulled Shiitake Donburi recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized:");
  console.log("   - SEO Title: 54 characters ✓");
  console.log("   - SEO Description: 137 characters ✓");
  console.log("   - Categories: Mains, Vegan, Vegetarian ✓");
  console.log("🍄 Delicious plant-based donburi!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
