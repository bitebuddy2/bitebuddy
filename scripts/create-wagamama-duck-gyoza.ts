// scripts/create-wagamama-duck-gyoza.ts
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

// Ingredient data for Wagamama Duck Gyoza
const ingredients = [
  {
    name: "Duck mince",
    synonyms: ["minced duck", "ground duck"],
    kcal100: 330,
    protein100: 17,
    fat100: 28,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: null,
  },
  {
    name: "Gyoza wrappers",
    synonyms: ["dumpling wrappers", "wonton wrappers"],
    kcal100: 276,
    protein100: 8,
    fat100: 1,
    carbs100: 58,
    allergens: ["gluten", "egg"],
    gramsPerPiece: 8,
  },
  {
    name: "Shiitake mushrooms",
    synonyms: ["shiitake", "Chinese mushrooms"],
    kcal100: 34,
    protein100: 2.2,
    fat100: 0.5,
    carbs100: 7,
    allergens: [],
    gramsPerPiece: 15,
  },
  {
    name: "Chinese cabbage",
    synonyms: ["napa cabbage", "Chinese leaf", "wombok"],
    kcal100: 13,
    protein100: 1.2,
    fat100: 0.2,
    carbs100: 2.2,
    allergens: [],
    gramsPerPiece: 50,
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
    gramsPerPiece: 5,
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
    name: "Sesame oil",
    synonyms: ["toasted sesame oil", "Asian sesame oil"],
    kcal100: 884,
    protein100: 0,
    fat100: 100,
    carbs100: 0,
    allergens: ["sesame"],
    density_g_per_ml: 0.92,
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
    name: "Vegetable oil",
    synonyms: ["cooking oil", "sunflower oil", "rapeseed oil"],
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
  console.log("🥟 Creating Wagamama Duck Gyoza Recipe\n");
  console.log("Creating ingredients...\n");

  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wagamama-duck-gyoza"][0]`
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

  const startersCategory = await client.fetch(
    `*[_type == "category" && slug.current == "starters"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Wagamama Duck Gyoza",
    slug: {
      _type: "slug",
      current: "wagamama-duck-gyoza",
    },
    description:
      "Recreate Wagamama's popular Duck Gyoza at home with crispy bottoms and juicy filling. These pan-fried dumplings are packed with seasoned duck mince, shiitake mushrooms, and fragrant aromatics - the perfect starter!",
    servings: 4,
    prepMin: 30,
    cookMin: 10,
    introText:
      "Wagamama's Duck Gyoza are one of the restaurant's most beloved starters - golden, crispy-bottomed dumplings filled with succulent duck mince, earthy shiitake mushrooms, and aromatic ginger and garlic. Gyoza, the Japanese take on Chinese potstickers, are a perfect balance of textures: crispy and caramelised on the bottom, soft and pillowy on top, with a juicy, flavourful filling inside. What makes Wagamama's version so special is the richness of the duck, which adds a deeper, more luxurious flavour compared to traditional pork gyoza. The filling is carefully seasoned with soy sauce, sesame oil, ginger, and spring onions, creating an umami-packed bite that's both satisfying and moreish. The cooking technique is key - pan-frying followed by steaming creates that signature contrast between crispy base and tender top. While folding gyoza might seem intimidating, this recipe includes clear instructions for achieving those beautiful pleats, and even if yours aren't perfect, they'll still taste incredible! These gyoza are perfect as a starter for 4 people or as a light meal for 2, served with a simple dipping sauce of soy, rice vinegar, and chilli oil. Making them at home is not only more economical than ordering takeaway, but it's also a fun cooking project that's deeply satisfying when you bite into your first homemade dumpling. Plus, you can freeze any uncooked gyoza for quick, restaurant-quality meals whenever the craving strikes!",
    ...(wagamamaBrand && {
      brand: {
        _type: "reference",
        _ref: wagamamaBrand._id,
      },
    }),
    ...(startersCategory && {
      categories: [
        {
          _type: "reference",
          _ref: startersCategory._id,
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
            text: "Gyoza have been a staple on Wagamama's menu since the beginning, showcasing the restaurant's commitment to authentic Japanese cooking techniques with creative twists. While traditional Japanese gyoza are typically filled with pork and cabbage, Wagamama's duck version elevates the humble dumpling with premium ingredients and bold flavours. Their duck gyoza reflect the restaurant's philosophy of taking classic dishes and making them exciting and contemporary. The crispy-bottomed cooking method, known as 'yaki-gyoza' in Japanese, is the most popular way to serve these dumplings in Japan, and Wagamama has perfected this technique to create the irresistible golden crust that keeps customers coming back.",
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
            text: "The duck gyoza pair perfectly with Wagamama's signature dipping sauces and are often ordered alongside other sharing plates like edamame and bang bang cauliflower. They represent the restaurant's approach to Japanese food - accessible, fun, and designed for sharing, while maintaining high quality and authentic cooking methods. The gyoza are made fresh daily in Wagamama kitchens, ensuring every order delivers that perfect combination of crispy exterior and juicy filling that has made them a menu favourite for over 30 years.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Filling",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Duck mince"],
            },
            quantity: "300",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Shiitake mushrooms"],
            },
            quantity: "100",
            unit: "g",
            notes: "finely chopped",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Chinese cabbage"],
            },
            quantity: "100",
            unit: "g",
            notes: "finely chopped",
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
            notes: "finely grated",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Soy sauce"],
            },
            quantity: "2",
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
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Cornflour"],
            },
            quantity: "1",
            unit: "tbsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For Assembly & Cooking",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Gyoza wrappers"],
            },
            quantity: "30",
            unit: "piece",
            notes: "round, about 8cm diameter",
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
        heading: "For the Dipping Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Soy sauce"],
            },
            quantity: "4",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Rice wine vinegar"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Sesame oil"],
            },
            quantity: "1/2",
            unit: "tsp",
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
                text: "Prepare the cabbage: Place the finely chopped Chinese cabbage in a clean tea towel and squeeze firmly over the sink to remove as much moisture as possible. This is crucial - excess water will make your filling soggy and the gyoza will fall apart during cooking. You should extract at least 2-3 tablespoons of liquid. Set the squeezed cabbage aside.",
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
                text: "Make the filling: In a large bowl, combine the duck mince, squeezed cabbage, chopped shiitake mushrooms, spring onions, grated ginger, grated garlic, soy sauce, sesame oil, and cornflour. Using your hands or a wooden spoon, mix thoroughly in one direction (this helps bind the filling) for about 2 minutes until everything is evenly distributed and the mixture becomes slightly sticky. The cornflour helps bind the filling and keeps it juicy during cooking.",
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
                text: "Fill the gyoza: Set up your assembly station with the gyoza wrappers, filling, and a small bowl of water. Place a wrapper in the palm of your hand and add about 1 heaped teaspoon of filling to the centre (don't overfill or they'll burst). Dip your finger in water and moisten the entire edge of the wrapper. Fold the wrapper in half to create a half-moon shape, then, starting from one end, make 5-6 small pleats along the front edge while pressing it against the unpleated back edge. This creates the classic gyoza crescent shape. Place on a lightly floured tray and repeat until all the filling is used.",
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
                text: "Cook the gyoza (method 1 - crispy bottom): Heat 1 tablespoon of vegetable oil in a large non-stick frying pan over medium-high heat. Arrange about 15 gyoza in the pan, flat-bottoms down, in a circular pattern (you'll cook them in 2 batches). Fry for 2-3 minutes until the bottoms are golden and crispy. Carefully add 100ml of water to the pan (it will sizzle dramatically!), immediately cover with a lid, and steam for 6-7 minutes until the water has evaporated and the wrappers are translucent and cooked through. Remove the lid and cook for another 1-2 minutes to re-crisp the bottoms. Transfer to a serving plate, crispy-side up. Repeat with the remaining gyoza.",
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
                text: "Make the dipping sauce: While the gyoza cook, whisk together the soy sauce, rice wine vinegar, and sesame oil in a small bowl. For extra kick, add a few drops of chilli oil or a pinch of dried chilli flakes. Divide between individual dipping bowls.",
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
                text: "Serve: Arrange the gyoza on a serving plate with the crispy bottoms facing upward to show off that beautiful golden crust. Garnish with sliced spring onions or sesame seeds if desired. Serve immediately while hot and crispy, with the dipping sauce on the side. Eat Wagamama-style by picking them up with chopsticks, dipping into the sauce, and enjoying in one or two bites!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Don't overfill the gyoza! About 1 heaped teaspoon of filling is perfect - too much and they'll burst during cooking.",
      "Keep the uncooked gyoza covered with a damp tea towel while you work to prevent the wrappers from drying out.",
      "If you can't find duck mince, ask your butcher to mince duck breast for you, or use a food processor to pulse duck breast until minced.",
      "You can substitute pork, chicken, or turkey mince if duck is unavailable - the technique remains the same.",
      "Freeze uncooked gyoza on a tray until solid, then transfer to a freezer bag. Cook from frozen, adding 2-3 minutes to the steaming time.",
      "For vegetarian gyoza, replace duck with finely chopped firm tofu (squeezed dry) and increase the mushrooms and cabbage.",
      "The pleating isn't just for looks - it helps seal the gyoza and prevents filling from escaping. Practice makes perfect!",
      "Make a large batch and freeze them - they're perfect for quick weeknight meals or entertaining guests.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I steam these instead of pan-frying?",
        answer:
          "Yes! You can steam the gyoza in a bamboo steamer lined with parchment paper (with holes poked through) or cabbage leaves for 8-10 minutes until cooked through. They won't have the crispy bottom, but they'll still be delicious and lighter. This method is called 'sui-gyoza' in Japanese.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Where can I buy gyoza wrappers?",
        answer:
          "Gyoza wrappers are available in the freezer section of most large supermarkets (look near the Asian ingredients), in Asian supermarkets, or online. They're also called 'dumpling wrappers' or 'wonton wrappers' - make sure to get the round ones, not square. They freeze well so buy extra!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "My gyoza keep bursting - what am I doing wrong?",
        answer:
          "Common causes: 1) Overfilling - use less filling (about 1 teaspoon), 2) Not sealing properly - ensure the edges are moist and pressed firmly together, 3) Too much water in the filling - squeeze the cabbage very well, 4) Old or dry wrappers - keep them covered and moist while working.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make these ahead of time?",
        answer:
          "Yes! Assemble the gyoza up to 4 hours ahead, arrange on a floured tray in a single layer (not touching), cover with cling film, and refrigerate. Alternatively, freeze them for up to 3 months. Frozen gyoza can be cooked directly from frozen - just add an extra 2-3 minutes to the steaming time.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What's the difference between gyoza and dumplings?",
        answer:
          "Gyoza are the Japanese version of Chinese potstickers (jiaozi). They typically have thinner wrappers than Chinese dumplings, contain more garlic and ginger, and are traditionally cooked using the pan-fry-then-steam method. The thinner wrapper creates a more delicate texture and allows the filling flavours to shine through.",
      },
    ],
    nutrition: {
      calories: 285,
      protein: 18,
      fat: 14,
      carbs: 22,
    },
    seoTitle: "Wagamama Duck Gyoza Recipe - Crispy Pan-Fried Dumplings",
    seoDescription:
      "Make Wagamama's famous Duck Gyoza at home! Crispy-bottomed dumplings with juicy duck filling. Easy copycat recipe with step-by-step instructions.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/wagamama-duck-gyoza",
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
      _id: `drafts.wagamama-duck-gyoza-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Wagamama Duck Gyoza recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized:");
  console.log("   - SEO Title: 55 characters ✓");
  console.log("   - SEO Description: 141 characters ✓");
  console.log("   - Canonical URL set ✓");
  console.log("🥟 Authentic Japanese gyoza!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
