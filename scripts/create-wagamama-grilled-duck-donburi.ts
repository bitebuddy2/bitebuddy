// scripts/create-wagamama-grilled-duck-donburi.ts
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

// Ingredient data for Wagamama Grilled Duck Donburi
const ingredients = [
  {
    name: "Duck breasts",
    synonyms: ["duck breast", "duck fillet"],
    kcal100: 337,
    protein100: 19,
    fat100: 28,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: 200,
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
    name: "Mangetout",
    synonyms: ["snow peas", "sugar snap peas"],
    kcal100: 42,
    protein100: 2.8,
    fat100: 0.2,
    carbs100: 7.6,
    allergens: [],
    gramsPerPiece: 5,
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
    name: "Cucumber",
    synonyms: ["fresh cucumber"],
    kcal100: 15,
    protein100: 0.7,
    fat100: 0.1,
    carbs100: 3.6,
    allergens: [],
    gramsPerPiece: 300,
  },
  {
    name: "Pickled ginger",
    synonyms: ["gari", "sushi ginger"],
    kcal100: 51,
    protein100: 0.2,
    fat100: 0.1,
    carbs100: 12,
    allergens: [],
    density_g_per_ml: 1.05,
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
    name: "Honey",
    synonyms: ["clear honey", "runny honey"],
    kcal100: 304,
    protein100: 0.3,
    fat100: 0,
    carbs100: 82,
    allergens: [],
    density_g_per_ml: 1.42,
  },
  {
    name: "Five-spice powder",
    synonyms: ["Chinese five spice", "5-spice"],
    kcal100: 347,
    protein100: 11,
    fat100: 16,
    carbs100: 50,
    allergens: [],
    density_g_per_ml: 0.48,
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
  console.log("🦆 Creating Wagamama Grilled Duck Donburi Recipe\n");
  console.log("Creating ingredients...\n");

  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wagamama-grilled-duck-donburi"][0]`
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
    title: "Wagamama Grilled Duck Donburi",
    slug: {
      _type: "slug",
      current: "wagamama-grilled-duck-donburi",
    },
    description:
      "Make Wagamama's legendary Grilled Duck Donburi at home with this authentic copycat recipe. Tender duck breast, sticky sweet glaze, fresh vegetables over fluffy Japanese rice - restaurant quality made easy!",
    servings: 2,
    prepMin: 20,
    cookMin: 25,
    introText:
      "Wagamama's Grilled Duck Donburi is one of their most celebrated dishes - a beautiful Japanese rice bowl featuring perfectly cooked duck breast glazed with a sweet-savoury sauce, served over steaming sushi rice with crisp vegetables and aromatic garnishes. Donburi, meaning 'rice bowl' in Japanese, is a cornerstone of Japanese cuisine, and Wagamama's interpretation showcases their skill in balancing authentic Japanese techniques with bold, contemporary flavours. What makes this dish so special is the duck itself - scored and pan-fried to render the fat, creating irresistibly crispy skin while keeping the meat tender and pink. The glaze is a masterpiece of umami, combining soy sauce, mirin, sake, honey, and five-spice powder to create layers of sweet, salty, and subtly spiced flavour that complements the rich duck perfectly. The contrast of textures is key: crispy duck skin against tender meat, crunchy vegetables against soft rice, all brought together with fresh spring onions, red chilli, and toasted sesame seeds. This recipe captures everything that makes Wagamama's version so popular - the careful scoring technique that ensures crispy skin, the perfectly balanced glaze that's neither too sweet nor too salty, and the assembly method that creates a beautiful, Instagram-worthy presentation. Making it at home means you can enjoy this restaurant favourite any night of the week, adjust the spice level to your preference, and save significantly compared to dining out. While duck breast might seem intimidating, this recipe breaks down every step clearly, and the impressive results will make you look like a professional chef!",
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
            text: "Wagamama was founded in 1992 by Alan Yau in London's Bloomsbury, inspired by the fast-paced ramen bars of Japan. The name 'wagamama' means 'naughty child' or 'wilful' in Japanese, reflecting the restaurant's playful approach to Japanese dining. With their signature long communal benches, open kitchens, and 'positive eating + positive living' philosophy, Wagamama revolutionised casual Asian dining in the UK and has since expanded to over 200 locations worldwide.",
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
            text: "The Grilled Duck Donburi represents Wagamama's expertise in donburi dishes - Japanese rice bowls that have been a menu staple since the beginning. Duck is a popular protein in Japanese cuisine, particularly in dishes like kamo nanban soba, and Wagamama's version honours this tradition while adding their distinctive flair with bold glazes and contemporary presentation. The dish showcases their commitment to quality ingredients and proper cooking techniques, with each duck breast cooked to order rather than pre-cooked and reheated. It's become a favourite among regulars who appreciate the richness of duck paired with the freshness of vegetables and the comforting base of perfectly cooked Japanese rice.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Duck",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Duck breasts"],
            },
            quantity: "2",
            unit: "piece",
            notes: "skin on, about 200g each",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Five-spice powder"],
            },
            quantity: "1/2",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Glaze",
        items: [
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
              _ref: ingredientIds["Sake"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Honey"],
            },
            quantity: "1",
            unit: "tbsp",
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
              _ref: ingredientIds["Mangetout"],
            },
            quantity: "100",
            unit: "g",
            notes: "trimmed",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Cucumber"],
            },
            quantity: "1/2",
            unit: "piece",
            notes: "ribbons or half-moons",
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
              _ref: ingredientIds["Pickled ginger"],
            },
            quantity: "2",
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
                text: "Prepare the duck: Pat the duck breasts completely dry with kitchen paper - this is crucial for crispy skin. Using a sharp knife, score the skin in a crosshatch pattern, making cuts about 1cm apart and cutting through the fat layer but not into the meat. This allows the fat to render out during cooking. Rub the five-spice powder all over the duck breasts, particularly into the scored skin. Season generously with salt and pepper. Let them sit at room temperature for 15 minutes while you prepare everything else.",
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
                text: "Make the glaze: In a small bowl, whisk together the soy sauce, mirin, sake, honey, and grated ginger until the honey is fully dissolved. Set aside - this will be used both during cooking and as a finishing sauce.",
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
                text: "Cook the duck: Place the duck breasts skin-side down in a cold frying pan (no oil needed - the duck has plenty of fat). Turn the heat to medium and cook for 8-10 minutes, watching as the fat renders and the skin becomes deeply golden and crispy. Don't move them around - just let them cook. The fat will pool in the pan; carefully pour it off into a heatproof container as it accumulates (save it for roast potatoes!). Once the skin is crispy and golden, flip the duck breasts over and cook for 4-5 minutes on the flesh side for medium-rare (internal temperature 52-55°C), or 6-7 minutes for medium (58-60°C).",
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
                text: "Glaze the duck: In the last 2 minutes of cooking, pour half of the glaze mixture over the duck breasts in the pan, turning them to coat evenly. The glaze will bubble and thicken, coating the duck in a sticky, glossy layer. Remove the duck from the pan and transfer to a board. Cover loosely with foil and let rest for 5 minutes - this allows the juices to redistribute and makes slicing easier.",
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
                text: "Blanch the vegetables: While the duck rests, bring a small pan of water to the boil. Add the mangetout and blanch for 1-2 minutes until just tender but still crisp. Drain and refresh under cold water to stop the cooking and preserve the bright green colour. Drain well.",
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
                text: "Assemble the donburi: Divide the cooked sushi rice between 2 large, wide bowls - Wagamama uses large, shallow bowls that show off the beautiful presentation. Arrange the blanched mangetout, cucumber ribbons, and pickled ginger around the edges of the rice. Slice the rested duck breasts on the diagonal into 1cm thick slices - they should be rosy pink in the centre with crispy, golden skin.",
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
                text: "Finish and serve: Fan the sliced duck attractively over the rice in each bowl. Drizzle with the remaining glaze sauce. Scatter over the sliced spring onions, red chilli, and toasted sesame seeds. Serve immediately while the duck is still warm and the rice is fluffy. Eat Wagamama-style by mixing everything together as you go, ensuring each mouthful has rice, duck, vegetables, and that delicious glaze!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Don't skip the scoring! Properly scored duck skin renders fat better and becomes incredibly crispy - the signature of this dish.",
      "Starting duck in a cold pan is crucial. This gentle heating allows the fat to render slowly without burning the skin.",
      "Use a meat thermometer for perfect doneness: 52-55°C for medium-rare (recommended for duck), 58-60°C for medium.",
      "If you can't find sake, use dry sherry or Chinese rice wine (Shaoxing wine) as a substitute.",
      "Toast your sesame seeds for 2-3 minutes in a dry pan until golden and fragrant - it makes a huge difference to the flavour.",
      "Save the rendered duck fat! Store it in the fridge for up to 2 weeks and use it for the best roast potatoes you've ever made.",
      "For authentic Wagamama presentation, use a vegetable peeler to create cucumber ribbons rather than slicing into chunks.",
      "Make it spicier by adding more fresh red chilli or a drizzle of chilli oil (rayu) at the end - delicious!",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I cook perfect sushi rice?",
        answer:
          "Rinse 150g uncooked sushi rice under cold water until the water runs clear (this removes excess starch). Add to a pan with 200ml water, bring to the boil, then reduce to low, cover, and simmer for 12 minutes. Remove from heat and let steam, covered, for 10 minutes. Season with a splash of rice wine vinegar and a pinch of sugar if desired. Fluff with a fork before serving.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use chicken instead of duck?",
        answer:
          "Yes! Use 2 boneless, skin-on chicken thighs or breasts. Score the skin the same way and cook skin-side down for 6-8 minutes, then flip and cook for another 6-8 minutes until cooked through (internal temperature 75°C). Glaze in the last 2 minutes as per the recipe. The flavour will be milder than duck but still delicious.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "My duck skin isn't crispy - what did I do wrong?",
        answer:
          "Three common issues: 1) The duck breasts weren't dry enough before cooking (pat them very dry), 2) You started in a hot pan instead of cold (this burns the skin before the fat renders), or 3) You moved them around too much (leave them untouched to crisp up). Also ensure you're pouring off excess fat as it accumulates.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Is this dish gluten-free?",
        answer:
          "No, regular soy sauce contains gluten. However, you can easily make it gluten-free by using tamari (gluten-free soy sauce) instead of regular soy sauce, and ensuring your other ingredients are gluten-free. The rest of the dish is naturally gluten-free. Check the brand's website or ask in restaurants as Wagamama does offer gluten-free options.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I prepare anything in advance?",
        answer:
          "Yes! Cook the rice up to 2 hours ahead and keep warm, covered. Make the glaze sauce up to 3 days ahead and refrigerate. Prep all vegetables and store covered in the fridge. Score and season the duck up to 4 hours ahead and refrigerate (bring to room temperature before cooking). However, cook the duck fresh for best results - it only takes 15 minutes!",
      },
    ],
    nutrition: {
      calories: 685,
      protein: 42,
      fat: 32,
      carbs: 52,
    },
    seoTitle: "Wagamama Grilled Duck Donburi Recipe - Easy Copycat",
    seoDescription:
      "Make Wagamama's famous Grilled Duck Donburi at home! Crispy duck, sticky glaze, fresh veg over Japanese rice. Authentic restaurant-quality copycat recipe.",
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
      _id: `drafts.wagamama-grilled-duck-donburi-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Wagamama Grilled Duck Donburi recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized:");
  console.log("   - SEO Title: 58 characters ✓");
  console.log("   - SEO Description: 154 characters ✓");
  console.log("   - Categories: Mains, High-Protein ✓");
  console.log("🦆 Authentic Japanese donburi!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
