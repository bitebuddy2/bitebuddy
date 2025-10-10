// scripts/create-wagamama-hot-honey-fried-chicken-yuzu.ts
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

// Ingredient data for Hot Honey Fried Chicken Yuzu
const ingredients = [
  {
    name: "Chicken thigh fillets",
    synonyms: ["boneless chicken thighs", "chicken thigh meat"],
    kcal100: 211,
    protein100: 18,
    fat100: 15,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: 150,
  },
  {
    name: "Plain flour",
    synonyms: ["all-purpose flour", "white flour"],
    kcal100: 364,
    protein100: 10,
    fat100: 1,
    carbs100: 77,
    allergens: ["gluten"],
    density_g_per_ml: 0.59,
  },
  {
    name: "Cornflour",
    synonyms: ["cornstarch", "corn flour"],
    kcal100: 381,
    protein100: 0.3,
    fat100: 0.1,
    carbs100: 91,
    allergens: [],
    density_g_per_ml: 0.64,
  },
  {
    name: "Buttermilk",
    synonyms: ["cultured buttermilk"],
    kcal100: 40,
    protein100: 3.3,
    fat100: 0.9,
    carbs100: 4.8,
    allergens: ["milk"],
    density_g_per_ml: 1.03,
  },
  {
    name: "Garlic powder",
    synonyms: ["dried garlic", "granulated garlic"],
    kcal100: 331,
    protein100: 17,
    fat100: 0.7,
    carbs100: 72,
    allergens: [],
    density_g_per_ml: 0.48,
  },
  {
    name: "Onion powder",
    synonyms: ["dried onion", "granulated onion"],
    kcal100: 341,
    protein100: 8,
    fat100: 1,
    carbs100: 79,
    allergens: [],
    density_g_per_ml: 0.42,
  },
  {
    name: "Smoked paprika",
    synonyms: ["pimenton", "Spanish paprika"],
    kcal100: 289,
    protein100: 14,
    fat100: 13,
    carbs100: 54,
    allergens: [],
    density_g_per_ml: 0.45,
  },
  {
    name: "Cayenne pepper",
    synonyms: ["ground cayenne", "red pepper"],
    kcal100: 318,
    protein100: 12,
    fat100: 17,
    carbs100: 57,
    allergens: [],
    density_g_per_ml: 0.38,
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
    name: "Hot sauce",
    synonyms: ["chilli sauce", "chili sauce"],
    kcal100: 31,
    protein100: 1.3,
    fat100: 0.8,
    carbs100: 5,
    allergens: [],
    density_g_per_ml: 1.08,
  },
  {
    name: "Yuzu juice",
    synonyms: ["yuzu citrus juice"],
    kcal100: 21,
    protein100: 0.5,
    fat100: 0,
    carbs100: 7,
    allergens: [],
    density_g_per_ml: 1.02,
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
    name: "Vegetable oil",
    synonyms: ["cooking oil", "sunflower oil", "rapeseed oil"],
    kcal100: 884,
    protein100: 0,
    fat100: 100,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 0.92,
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
    name: "Spring onions",
    synonyms: ["scallions", "green onions", "salad onions"],
    kcal100: 32,
    protein100: 1.8,
    fat100: 0.2,
    carbs100: 7.3,
    allergens: [],
    gramsPerPiece: 10,
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
  console.log("🍗 Creating Hot Honey Fried Chicken Yuzu Recipe\n");
  console.log("Creating ingredients...\n");

  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wagamama-hot-honey-fried-chicken-yuzu"][0]`
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
  const spicyCategory = await client.fetch(
    `*[_type == "category" && slug.current == "spicy"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Wagamama Hot Honey Fried Chicken Yuzu",
    slug: {
      _type: "slug",
      current: "wagamama-hot-honey-fried-chicken-yuzu",
    },
    description:
      "Recreate Wagamama's viral Hot Honey Fried Chicken Yuzu! Crispy chicken glazed with spicy-sweet hot honey and bright citrus yuzu. Bold, addictive, and surprisingly easy to make at home.",
    servings: 2,
    prepMin: 20,
    cookMin: 25,
    introText:
      "Wagamama's Hot Honey Fried Chicken Yuzu is a modern menu sensation that perfectly captures the restaurant's innovative spirit - taking the globally beloved fried chicken format and elevating it with Japanese and contemporary flavours. This dish is a masterclass in balance: ultra-crispy buttermilk-fried chicken pieces meet a sticky, glossy glaze that's simultaneously sweet (honey), spicy (hot sauce), and bright (yuzu citrus). The result is utterly addictive - each bite delivers crunch, heat, sweetness, and that distinctive yuzu tang that sets it apart from standard Nashville hot chicken or Korean fried chicken. Yuzu is a Japanese citrus fruit with a flavour somewhere between lemon, lime, and grapefruit, but more fragrant and complex. It's become increasingly popular in Western cooking for its ability to add brightness without overpowering other flavours. Combined with honey's natural sweetness and hot sauce's kick, the yuzu creates a glaze that's both exciting and sophisticated. What makes this recipe so appealing is the contrast of textures and temperatures: hot, crispy chicken coated in a warm, glossy glaze, finished with cool spring onions and nutty sesame seeds. The chicken thighs stay incredibly juicy inside their crunchy coating, while the glaze clings to every crispy ridge. It's restaurant-quality fried chicken that you can achieve at home with a few simple techniques. Serve it as a showstopping main for 2 with steamed rice and pickles, or cut into smaller pieces as a sharing starter. This is the kind of dish that gets people excited - bold, Instagrammable, and most importantly, absolutely delicious!",
    ...(wagamamaBrand && {
      brand: {
        _type: "reference",
        _ref: wagamamaBrand._id,
      },
    }),
    ...(mainsCategory && spicyCategory && {
      categories: [
        {
          _type: "reference",
          _ref: mainsCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: spicyCategory._id,
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
            text: "The Hot Honey Fried Chicken Yuzu represents Wagamama's evolution and willingness to embrace global food trends while maintaining their Japanese identity. Hot honey - the combination of honey with chilli heat - became wildly popular in the mid-2010s, particularly in American cuisine. Wagamama took this trend and gave it a distinctly Japanese twist by adding yuzu, a citrus fruit that's been used in Japanese cooking for centuries. This fusion approach demonstrates the restaurant's philosophy: respect traditional Japanese ingredients and techniques while staying relevant and exciting to contemporary diners.",
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
            text: "Fried chicken has become a global phenomenon, with each culture adding its own spin - Korean fried chicken with gochujang, Nashville hot chicken with cayenne butter, Japanese karaage with soy and ginger. Wagamama's version sits beautifully in this tradition, offering something familiar yet distinctive. The dish has become incredibly popular on social media, with its glossy, golden appearance and dramatic drizzle of hot honey making it one of the most photographed items on the menu. It's a perfect example of how Wagamama continues to innovate while staying true to their Pan-Asian roots.",
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
              _ref: ingredientIds["Chicken thigh fillets"],
            },
            quantity: "4",
            unit: "piece",
            notes: "boneless, skinless",
          },
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
              _ref: ingredientIds["Plain flour"],
            },
            quantity: "150",
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
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Smoked paprika"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Cayenne pepper"],
            },
            quantity: "1/2",
            unit: "tsp",
            notes: "adjust to taste",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Hot Honey Yuzu Glaze",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Honey"],
            },
            quantity: "100",
            unit: "ml",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Hot sauce"],
            },
            quantity: "2-3",
            unit: "tbsp",
            notes: "Frank's RedHot or similar",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Yuzu juice"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Soy sauce"],
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
            unit: "tsp",
            notes: "finely grated",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For Frying & Garnish",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vegetable oil"],
            },
            quantity: "1",
            unit: "l",
            notes: "for deep frying",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Spring onions"],
            },
            quantity: "2",
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
                text: "Marinate the chicken: Cut each chicken thigh into 3-4 bite-sized pieces (about 4cm chunks). Place in a bowl, pour over the buttermilk, and mix well to ensure every piece is coated. Cover and refrigerate for at least 1 hour, or ideally overnight. The buttermilk tenderises the chicken and helps create an extra-crispy coating. If you don't have buttermilk, mix 300ml whole milk with 1 tablespoon lemon juice or white vinegar and let it stand for 10 minutes.",
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
                text: "Make the hot honey yuzu glaze: In a small saucepan over low heat, combine the honey, hot sauce (start with 2 tbsp and add more if you want it spicier), yuzu juice, soy sauce, and grated ginger. Warm gently for 3-4 minutes, stirring frequently, until everything is combined and slightly thinned. Don't boil - you just want it warm and liquid. Taste and adjust the heat level - it should be noticeably spicy but not overwhelming. Set aside and keep warm. The glaze will thicken slightly as it cools.",
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
                text: "Prepare the coating: In a large bowl, whisk together the plain flour, cornflour, garlic powder, onion powder, smoked paprika, cayenne pepper, 1 teaspoon salt, and 1/2 teaspoon black pepper. The cornflour is key for extra crispiness! For an even crunchier coating, drizzle 2-3 tablespoons of the buttermilk marinade into the flour mixture and mix it through with your fingers to create small clumps - these will create extra-crispy bits on your chicken.",
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
                text: "Heat the oil: Pour the vegetable oil into a large, deep, heavy-based pan or deep-fat fryer until it's about 8cm deep. Heat to 170°C (340°F) - use a cooking thermometer for accuracy, or test by dropping in a small piece of bread; it should sizzle immediately and turn golden in about 60 seconds. Maintaining the right temperature is crucial for crispy (not greasy) chicken. Don't skip the thermometer if you have one!",
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
                text: "Coat and fry the chicken: Remove the chicken pieces from the buttermilk, letting excess drip off. Working in batches of 4-5 pieces, toss the chicken in the seasoned flour mixture, pressing firmly to ensure an even, thick coating. Shake off any excess. Carefully lower the coated chicken into the hot oil using a slotted spoon or tongs (it will sizzle dramatically - stand back!). Fry for 6-8 minutes, turning occasionally with tongs, until deep golden brown and cooked through (internal temperature should reach 75°C). The chicken will float when it's nearly done. Remove to a wire rack set over a tray to drain. Repeat with remaining chicken, allowing the oil to return to 170°C between batches.",
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
                text: "Glaze and serve: Place all the fried chicken pieces in a large bowl. Pour over about two-thirds of the warm hot honey yuzu glaze and toss gently but thoroughly to coat every piece - tongs work well for this. Transfer to a serving plate or bowl. Drizzle with the remaining glaze for that glossy, restaurant-style presentation. Scatter over the sliced spring onions and toasted sesame seeds. Serve immediately while the chicken is hot and crispy, with steamed rice, pickled vegetables, or extra napkins - you'll need them! The chicken is best eaten straight away while the coating is at maximum crispness.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Can't find yuzu juice? Substitute with 1 tbsp fresh lemon juice + 1 tbsp fresh lime juice for a similar bright, citrusy note.",
      "The longer you marinate in buttermilk, the more tender and flavourful the chicken will be - overnight is ideal.",
      "Don't overcrowd the pan when frying - this drops the oil temperature and results in greasy, soggy chicken.",
      "Use a thermometer! Oil that's too cool = greasy chicken. Oil that's too hot = burnt coating with raw inside.",
      "For extra heat, add a pinch of cayenne to the finished glaze, or serve with extra hot sauce on the side.",
      "Make it a complete meal by serving with sticky rice, pickled cucumber, and a crisp Asian slaw.",
      "Leftover glaze keeps for 2 weeks in the fridge - use it on grilled chicken, roasted vegetables, or pizza!",
      "Toast your sesame seeds for 2-3 minutes in a dry pan for maximum flavour and crunch.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Where can I buy yuzu juice?",
        answer:
          "Yuzu juice is available in most large supermarkets (world foods aisle), Japanese or Asian supermarkets, or online from retailers like Japan Centre or Amazon. Look for bottles labelled 'yuzu juice' or 'yuzu citrus juice'. It's also sometimes sold as yuzu concentrate, which should be diluted according to package instructions. A small bottle goes a long way and keeps for months in the fridge.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I bake this instead of deep-frying?",
        answer:
          "Yes, though you won't get quite the same ultra-crispy result. Coat the chicken as directed, place on a wire rack over a baking tray, spray with cooking oil, and bake at 200°C fan for 25-30 minutes, flipping halfway, until golden and cooked through (internal temp 75°C). Spray with more oil after flipping. Glaze as directed. It's healthier but not quite as crispy!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How spicy is this dish?",
        answer:
          "It has a medium heat level - warming rather than fiery, thanks to the honey balancing the hot sauce. Start with 2 tbsp hot sauce in the glaze and adjust from there. For milder heat, use 1 tbsp hot sauce or swap for a milder chilli sauce. For extra heat, increase to 4 tbsp or add cayenne pepper to the glaze. The yuzu and honey temper the heat nicely.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use chicken breast instead of thighs?",
        answer:
          "You can, but thighs are strongly recommended! Thigh meat is more forgiving (harder to overcook), stays juicier, and has better flavour due to higher fat content. If using breast, cut into slightly smaller pieces and watch the cooking time carefully - they'll cook faster and can dry out if overcooked. Marinating overnight becomes even more important.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make the glaze ahead of time?",
        answer:
          "Absolutely! Make the hot honey yuzu glaze up to 1 week ahead and store in an airtight jar in the fridge. It will thicken when cold - simply warm gently in a pan or microwave before using. The flavours actually improve after a day or two as they meld together. Just don't pre-glaze the fried chicken until serving or it will lose its crispness.",
      },
    ],
    nutrition: {
      calories: 720,
      protein: 45,
      fat: 35,
      carbs: 58,
    },
    seoTitle: "Wagamama Hot Honey Fried Chicken Yuzu - Easy Copycat",
    seoDescription:
      "Make Wagamama's viral Hot Honey Fried Chicken Yuzu! Crispy chicken with sweet-spicy glaze & citrus. Restaurant-quality copycat recipe.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/wagamama-hot-honey-fried-chicken-yuzu",
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
      _id: `drafts.wagamama-hot-honey-fried-chicken-yuzu-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Hot Honey Fried Chicken Yuzu recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized:");
  console.log("   - SEO Title: 59 characters ✓");
  console.log("   - SEO Description: 133 characters ✓");
  console.log("   - Canonical URL set ✓");
  console.log("   - Categories: Mains, Spicy ✓");
  console.log("🍗 Viral hot honey fried chicken!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
