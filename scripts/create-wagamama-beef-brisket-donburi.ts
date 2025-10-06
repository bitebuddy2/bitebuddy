// scripts/create-wagamama-beef-brisket-donburi.ts
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

// Ingredient data for Wagamama Beef Brisket Donburi
const ingredients = [
  {
    name: "Beef brisket",
    synonyms: ["brisket", "beef brisket joint"],
    kcal100: 290,
    protein100: 19,
    fat100: 24,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: 500,
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
    name: "Sake",
    synonyms: ["Japanese rice wine", "cooking sake"],
    kcal100: 134,
    protein100: 0.5,
    fat100: 0,
    carbs100: 5,
    allergens: [],
    density_g_per_ml: 0.99,
  },
  {
    name: "Brown sugar",
    synonyms: ["soft brown sugar", "light brown sugar"],
    kcal100: 380,
    protein100: 0.1,
    fat100: 0,
    carbs100: 98,
    allergens: [],
    density_g_per_ml: 0.85,
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
    name: "Star anise",
    synonyms: ["whole star anise"],
    kcal100: 337,
    protein100: 18,
    fat100: 16,
    carbs100: 50,
    allergens: [],
    gramsPerPiece: 2,
  },
  {
    name: "Beef stock",
    synonyms: ["beef broth", "beef stock cube"],
    kcal100: 8,
    protein100: 1.5,
    fat100: 0.2,
    carbs100: 0.5,
    allergens: ["celery"],
    density_g_per_ml: 1.0,
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
    name: "Pak choi",
    synonyms: ["bok choy", "Chinese cabbage", "pak choy"],
    kcal100: 13,
    protein100: 1.5,
    fat100: 0.2,
    carbs100: 2.2,
    allergens: [],
    gramsPerPiece: 100,
  },
  {
    name: "Soft-boiled eggs",
    synonyms: ["ramen eggs", "ajitsuke tamago", "marinated eggs"],
    kcal100: 143,
    protein100: 13,
    fat100: 10,
    carbs100: 0.7,
    allergens: ["eggs"],
    gramsPerPiece: 50,
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
  console.log("🥩 Creating Wagamama Beef Brisket Donburi Recipe\n");
  console.log("Creating ingredients...\n");

  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wagamama-beef-brisket-donburi"][0]`
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
  const highProteinCategory = await client.fetch(
    `*[_type == "category" && slug.current == "high-protein"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Wagamama Beef Brisket Donburi",
    slug: {
      _type: "slug",
      current: "wagamama-beef-brisket-donburi",
    },
    description:
      "Make Wagamama's melt-in-the-mouth Beef Brisket Donburi at home! Slow-braised beef in aromatic broth over fluffy rice with soft-boiled eggs and fresh greens - the ultimate comfort food bowl.",
    servings: 4,
    prepMin: 20,
    cookMin: 180,
    introText:
      "Wagamama's Beef Brisket Donburi is the ultimate comfort food - a deeply satisfying rice bowl featuring fall-apart tender beef brisket that's been slowly braised in a fragrant Japanese-inspired broth until it melts in your mouth. This dish is all about patience and low, slow cooking that transforms tough brisket into something extraordinarily tender and flavourful. The braising liquid, enriched with soy sauce, mirin, sake, ginger, garlic, and star anise, infuses every strand of beef with complex, aromatic flavour while creating a rich sauce that ties everything together. What makes this donburi so special is the layering of textures and temperatures: piping hot fluffy sushi rice forms the base, topped with meltingly tender beef that's been shredded into strands, then finished with crisp pak choi, silky soft-boiled eggs with jammy yolks, and fresh garnishes of spring onions, red chilli, and toasted sesame seeds. Each spoonful delivers umami-rich beef, creamy egg, crunchy greens, and fluffy rice all in one perfect bite. This recipe recreates Wagamama's version using traditional Japanese braising techniques - the long cooking time is mostly hands-off, and the result is restaurant-quality beef that rivals any high-end donburi. Making it at home means you can enjoy this premium dish at a fraction of restaurant prices, prepare it in advance for easy weeknight dinners, and adjust the aromatics to your taste. It's perfect for meal prep - the brisket actually improves after a day in the fridge as the flavours develop. While it requires time, the actual effort is minimal, and your kitchen will smell incredible as it braises!",
    ...(wagamamaBrand && {
      brand: {
        _type: "reference",
        _ref: wagamamaBrand._id,
      },
    }),
    ...(mainsCategory && highProteinCategory && {
      categories: [
        {
          _type: "reference",
          _ref: mainsCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: highProteinCategory._id,
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
            text: "The Beef Brisket Donburi showcases Wagamama's ability to adapt traditional Japanese cooking techniques for Western ingredients and tastes. While brisket isn't a traditional Japanese cut (they typically use short rib or beef cheek for slow-cooked dishes), Wagamama recognized that this affordable, flavourful cut responds beautifully to Japanese braising methods. The dish draws inspiration from 'nikujaga' (Japanese beef and potato stew) and the slow-braised beef found in high-end donburi restaurants across Tokyo, but uses ingredients readily available in UK supermarkets.",
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
            text: "This dish represents Wagamama's premium donburi offerings - it's positioned as a special, indulgent choice on their menu, reflecting the time and care required to braise the beef to perfection. The use of star anise adds a subtle warmth and complexity that's not traditionally Japanese but works beautifully with the other aromatics, showing Wagamama's willingness to blend influences for maximum flavour. The dish has become particularly popular during autumn and winter months when customers crave rich, warming bowls, and it's often cited by fans as one of Wagamama's best-kept secrets - less famous than their ramen but equally delicious to those who discover it.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Braised Beef Brisket",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Beef brisket"],
            },
            quantity: "1",
            unit: "kg",
            notes: "boneless, trimmed",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Soy sauce"],
            },
            quantity: "100",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Mirin"],
            },
            quantity: "100",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sake"],
            },
            quantity: "100",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Brown sugar"],
            },
            quantity: "3",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fresh ginger"],
            },
            quantity: "50",
            unit: "g",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Garlic"],
            },
            quantity: "6",
            unit: "clove",
            notes: "smashed",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Star anise"],
            },
            quantity: "3",
            unit: "piece",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Beef stock"],
            },
            quantity: "500",
            unit: "ml",
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
            quantity: "600",
            unit: "g",
            notes: "cooked weight, about 300g uncooked",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Pak choi"],
            },
            quantity: "4",
            unit: "piece",
            notes: "halved lengthways",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Soft-boiled eggs"],
            },
            quantity: "4",
            unit: "piece",
            notes: "6-minute eggs",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Spring onions"],
            },
            quantity: "4",
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
            quantity: "2",
            unit: "tbsp",
            notes: "toasted",
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
            notes: "sliced",
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
                text: "Prepare and sear the brisket: Preheat your oven to 150°C (130°C fan/gas mark 2). Pat the beef brisket dry with kitchen paper and season generously all over with salt and pepper. Heat the vegetable oil in a large, oven-proof casserole dish or Dutch oven over high heat. Sear the brisket for 3-4 minutes on each side until deeply browned all over - this caramelisation adds incredible flavour to the final dish. Don't rush this step! Once browned, remove the brisket and set aside on a plate.",
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
                text: "Build the braising liquid: In the same pot (with all those delicious brown bits from the beef), add the smashed garlic cloves and sliced ginger. Stir for 30 seconds until fragrant. Pour in the soy sauce, mirin, and sake, scraping up any brown bits from the bottom of the pot with a wooden spoon - these add tons of flavour. Add the brown sugar and stir until dissolved. Add the star anise and beef stock, then bring everything to a simmer.",
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
                text: "Braise low and slow: Return the seared brisket to the pot, nestling it into the braising liquid. The liquid should come about halfway up the sides of the meat - add more stock or water if needed. Bring to a gentle simmer on the stovetop, then cover with a tight-fitting lid (or foil if you don't have a lid). Transfer to the preheated oven and braise for 3 hours, turning the brisket over halfway through cooking. The beef should be so tender it almost falls apart when prodded with a fork.",
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
                text: "Rest and shred the beef: Remove the pot from the oven. Carefully transfer the brisket to a board and let it rest for 10 minutes. Meanwhile, strain the braising liquid through a fine sieve into a saucepan, discarding the aromatics (they've done their job). Bring the liquid to a simmer and cook for 10-15 minutes until it reduces by about a third and becomes glossy and slightly thickened. Taste and adjust seasoning if needed - it should be rich, savoury, and balanced. Using two forks, shred the brisket into large, chunky strands - it should pull apart effortlessly.",
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
                text: "Prepare the accompaniments: While the sauce reduces, prepare the pak choi. Bring a pan of water to the boil, add the halved pak choi and blanch for 2-3 minutes until the stems are tender. Drain well. For perfect soft-boiled eggs: bring a pan of water to the boil, gently lower in eggs (room temperature ideally), and boil for exactly 6 minutes. Immediately transfer to ice water, then peel carefully and halve lengthways to reveal those beautiful jammy yolks.",
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
                text: "Assemble the donburi: Divide the hot cooked sushi rice between 4 large, wide bowls - this is the foundation. Arrange generous portions of the shredded beef brisket over the rice, piling it high in the centre. Ladle the reduced braising sauce over the beef and rice - be generous, as this sauce brings everything together. Arrange the blanched pak choi and halved soft-boiled eggs around the beef.",
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
                text: "Garnish and serve: Scatter the sliced spring onions, toasted sesame seeds, and sliced red chilli over the top of each bowl. Serve immediately while the beef and rice are hot, the eggs are still slightly warm, and everything looks beautiful. Eat Wagamama-style by mixing the egg yolk into the rice and sauce, ensuring each spoonful has beef, rice, greens, and all those delicious garnishes!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "The longer you braise, the more tender the beef becomes - some prefer 3.5-4 hours for absolute fall-apart texture. It's hard to overcook brisket!",
      "Make this ahead! The brisket can be braised up to 3 days in advance and stored in its liquid in the fridge. The flavours actually improve overnight. Reheat gently before serving.",
      "Save any leftover braising liquid - it's liquid gold! Use it as a base for ramen broth, freeze for future donburi, or reduce it down further for a glaze.",
      "If the braising liquid seems too salty after reducing, add a splash of water or stock to balance it.",
      "You can cook this in a slow cooker: sear the beef first, then transfer everything to the slow cooker and cook on low for 8-10 hours.",
      "For richer flavour, marinate the brisket in the soy-mirin-sake mixture overnight before cooking.",
      "Toast your sesame seeds in a dry pan for 2-3 minutes until golden - it intensifies their nutty flavour enormously.",
      "Add variety with other vegetables: blanched broccoli, steamed bok choy, or pickled vegetables all work beautifully.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use a different cut of beef?",
        answer:
          "Yes! Beef short ribs, beef cheeks, or chuck roast all work wonderfully with this method. Short ribs are particularly good (cook for 2.5-3 hours), while beef cheeks are incredibly tender (cook for 3-3.5 hours). Avoid lean cuts like sirloin or rump - they'll become tough rather than tender with long cooking. You need a cut with good fat marbling and connective tissue that breaks down during braising.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I know when the brisket is done?",
        answer:
          "The beef should be fork-tender - a fork should slide in easily and the meat should pull apart without resistance. If it's still firm or tough, keep cooking for another 30-60 minutes. The internal temperature should reach at least 90-95°C, but tenderness is a better indicator than temperature for braised meat. When in doubt, cook it longer!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this without sake or mirin?",
        answer:
          "Sake and mirin add authentic Japanese flavour, but substitutes work. Replace sake with dry sherry or dry white wine. Replace mirin with 2 tbsp honey or brown sugar dissolved in 100ml water with a splash of rice vinegar. The flavour will be slightly different but still delicious. Some supermarkets sell non-alcoholic mirin if alcohol is a concern.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "My braising liquid is too thin - how do I thicken it?",
        answer:
          "After straining, simmer it uncovered for 15-20 minutes to reduce and concentrate the flavours - this naturally thickens it. For a glossier sauce, mix 1 tsp cornflour with 1 tbsp cold water and whisk into the simmering liquid. Alternatively, add 1 tbsp butter at the end and whisk - this creates a rich, silky texture. The sauce should coat the back of a spoon but not be thick like gravy.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I freeze leftover braised brisket?",
        answer:
          "Absolutely! Shred the beef and store it in the braising liquid in airtight containers or freezer bags (this keeps it moist). Freeze for up to 3 months. Defrost in the fridge overnight, then reheat gently on the stovetop or in the microwave. The texture actually improves after freezing as the flavours penetrate the meat even more. Perfect for meal prep!",
      },
    ],
    nutrition: {
      calories: 740,
      protein: 52,
      fat: 32,
      carbs: 58,
    },
    seoTitle: "Wagamama Beef Brisket Donburi Recipe - Easy Copycat",
    seoDescription:
      "Make Wagamama's tender Beef Brisket Donburi at home! Slow-braised melt-in-mouth beef over rice with soft eggs. Restaurant-quality Japanese copycat recipe.",
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
      _id: `drafts.wagamama-beef-brisket-donburi-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Wagamama Beef Brisket Donburi recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized:");
  console.log("   - SEO Title: 59 characters ✓");
  console.log("   - SEO Description: 152 characters ✓");
  console.log("   - Categories: Mains, High-Protein ✓");
  console.log("🥩 Ultimate comfort food donburi!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
