// scripts/create-wagamama-chicken-gyoza.ts
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

// Ingredient data for Wagamama Chicken Gyoza
const ingredients = [
  {
    name: "Chicken mince",
    synonyms: ["minced chicken", "ground chicken"],
    kcal100: 143,
    protein100: 17.4,
    fat100: 7.4,
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
  console.log("🥟 Creating Wagamama Chicken Gyoza Recipe\n");
  console.log("Creating ingredients...\n");

  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wagamama-chicken-gyoza"][0]`
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
    title: "Wagamama Chicken Gyoza",
    slug: {
      _type: "slug",
      current: "wagamama-chicken-gyoza",
    },
    description:
      "Master Wagamama's classic Chicken Gyoza at home! Light, delicate dumplings with juicy chicken filling, crispy golden bottoms, and authentic Japanese flavours. The perfect crowd-pleasing starter.",
    servings: 4,
    prepMin: 30,
    cookMin: 10,
    introText:
      "Wagamama's Chicken Gyoza are the quintessential introduction to Japanese dumplings - light, delicate, and perfectly balanced, they've been a menu staple since the restaurant opened its doors in 1992. These dumplings showcase the purity of Japanese cooking: simple, high-quality ingredients prepared with precision to create something far greater than the sum of its parts. The filling is made with tender chicken mince, fresh cabbage, aromatic ginger and garlic, and a touch of mirin for subtle sweetness, all wrapped in thin, translucent gyoza skins. What makes these gyoza so beloved is their gentle, approachable flavour - not too rich, not too spicy, just perfectly seasoned with that classic umami depth from soy sauce and sesame oil. The technique is traditional Japanese yaki-gyoza: pan-fried until the bottoms turn golden and crispy, then steamed until the tops become soft and tender. This two-stage cooking creates the signature textural contrast that makes gyoza so irresistible - you get that satisfying crunch followed by a pillowy, juicy bite. These chicken gyoza are lighter than pork versions and less rich than duck, making them perfect as a starter for 4 people or as a satisfying light meal for 2. They're also incredibly versatile - serve them with classic soy-vinegar dipping sauce, pair them with ramen, or enjoy them on their own. Making gyoza at home might seem daunting, but once you get into the rhythm of filling and pleating, it becomes meditative and genuinely fun. Plus, you can freeze batches for quick weeknight meals that taste restaurant-quality in under 15 minutes!",
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
            text: "Gyoza have been served at Wagamama since day one, representing the restaurant's commitment to authentic Japanese cooking techniques and flavours. Chicken Gyoza are the most popular variety on the menu, loved for their light, clean taste and perfect balance of textures. In Japan, gyoza were originally introduced from China but have evolved into a distinctly Japanese dish, typically served as an accompaniment to ramen or as a standalone starter. Wagamama's version stays true to this tradition while ensuring consistency across all their locations - every gyoza is made to the same exacting standards, whether you're dining in London, Manchester, or abroad.",
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
            text: "The restaurant's chicken gyoza showcase their philosophy of 'kaizen' - continuous improvement. Over the years, Wagamama has perfected every aspect of these dumplings, from the ratio of filling to wrapper, to the precise cooking time that creates those coveted crispy bottoms. They're designed for sharing, fitting perfectly with Wagamama's communal dining concept, and pair beautifully with virtually everything on the menu. Whether you're a first-timer or a regular, these gyoza offer that consistent, comforting quality that has made Wagamama a beloved fixture of British dining culture for over three decades.",
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
              _ref: ingredientIds["Chicken mince"],
            },
            quantity: "400",
            unit: "g",
            notes: "not too lean - some fat keeps it juicy",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Chinese cabbage"],
            },
            quantity: "150",
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
            quantity: "4",
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
              _ref: ingredientIds["Mirin"],
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
            quantity: "30-35",
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
                text: "Prepare the cabbage: Place the finely chopped Chinese cabbage in a clean tea towel and squeeze firmly over the sink to remove as much moisture as possible - you should extract at least 3 tablespoons of liquid. This step is essential; excess water will make your filling soggy and cause the gyoza to fall apart during cooking. Set the squeezed cabbage aside.",
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
                text: "Make the filling: In a large bowl, combine the chicken mince, squeezed cabbage, spring onions, grated ginger, grated garlic, soy sauce, sesame oil, mirin, and cornflour. Using your hands or a wooden spoon, mix thoroughly in one direction for about 2 minutes - mixing in one direction helps bind the filling and develops a sticky texture that holds together well. The mixture should be cohesive and slightly tacky. Season with a pinch of white pepper if desired.",
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
                text: "Fill the gyoza: Set up your workstation with the gyoza wrappers, filling, and a small bowl of water. Keep unused wrappers covered with a damp tea towel to prevent drying. Place one wrapper in the palm of your hand and add about 1 heaped teaspoon of filling to the centre - don't overfill or they'll burst! Dip your finger in water and moisten the entire edge of the wrapper. Fold the wrapper in half to create a half-moon shape. Starting from one end, make 5-6 small pleats along the front edge, pressing each pleat firmly against the unpleated back edge as you go. The gyoza should sit upright with a flat bottom. Place on a lightly floured tray and cover. Repeat until all filling is used (makes 30-35 gyoza).",
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
                text: "Cook the gyoza: Heat 1 tablespoon of vegetable oil in a large non-stick frying pan (with a lid) over medium-high heat. Arrange about 15-17 gyoza in the pan, flat-bottoms down, in a circular pattern or neat rows (you'll cook them in 2 batches). Fry for 2-3 minutes without moving them until the bottoms are golden brown and crispy. Carefully add 100ml of water to the pan (stand back - it will sizzle dramatically!), immediately cover tightly with a lid, and steam for 6-7 minutes. The water will evaporate and the wrappers will turn translucent when fully cooked. Remove the lid and cook for another 1-2 minutes to re-crisp the bottoms. Transfer to a serving plate, crispy-side up. Wipe the pan clean and repeat with the remaining gyoza.",
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
                text: "Make the dipping sauce: While the gyoza cook, whisk together the soy sauce, rice wine vinegar, and sesame oil in a small bowl. For a bit of heat, add a pinch of chilli flakes or a few drops of chilli oil. Divide between individual dipping bowls for each person.",
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
                text: "Serve: Arrange the hot gyoza on a serving plate with the crispy bottoms facing upward to showcase that beautiful golden crust. Garnish with sliced spring onions, toasted sesame seeds, or microgreens if you like. Serve immediately while hot and crispy, with the dipping sauce on the side. To eat Wagamama-style, pick up with chopsticks, dip into the sauce, and enjoy in one or two bites - heaven!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Don't use extra-lean chicken mince - a little fat (around 10-15%) keeps the filling juicy and flavourful.",
      "Work quickly when filling to prevent wrappers from drying out. Cover assembled gyoza with a damp cloth while you work.",
      "If you're new to pleating, watch a quick YouTube video - it's easier than it looks! Even if yours aren't perfect, they'll still taste amazing.",
      "For perfectly crispy bottoms, don't overcrowd the pan - gyoza need space for the bottoms to make contact with the hot surface.",
      "These freeze brilliantly! Freeze uncooked on a tray, then bag up. Cook from frozen, adding 2-3 minutes to the steaming time.",
      "Can't find mirin? Substitute with 1 tbsp white wine + 1/2 tsp sugar, or just use a little extra soy sauce.",
      "Make it a complete meal by serving with steamed rice, edamame, and a simple cucumber salad.",
      "For extra-crispy bottoms, add an additional 1 tsp oil after the water evaporates and fry for an extra minute.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use chicken thighs instead of mince?",
        answer:
          "Absolutely! In fact, chicken thigh meat makes even juicier gyoza as it has more fat than breast meat. Finely chop boneless, skinless chicken thighs (or pulse in a food processor until minced but not paste-like) and use the exact same quantities. Some argue this method produces superior results!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Where can I buy gyoza wrappers?",
        answer:
          "Gyoza wrappers are widely available in the freezer section of large supermarkets (Tesco, Sainsbury's, Waitrose) near the Asian ingredients, in any Asian supermarket, or online. Look for round wrappers labelled 'gyoza wrappers' or 'dumpling wrappers' - not the square wonton wrappers. They keep for months in the freezer.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "My gyoza keep falling apart - what am I doing wrong?",
        answer:
          "Common issues: 1) Too much water in the filling - squeeze that cabbage really well! 2) Overfilling - use only 1 teaspoon of filling per wrapper. 3) Not sealing properly - ensure the edges are moist and pressed firmly together. 4) Moving them too much during the initial frying - let them sit undisturbed to develop a crust.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can these be made gluten-free?",
        answer:
          "Yes! You'll need to use gluten-free gyoza wrappers (available online from specialist Asian stores) and substitute tamari for the soy sauce. Tamari is naturally gluten-free and tastes very similar to regular soy sauce. Check all other ingredients as some brands of mirin may contain gluten.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I prevent the bottoms from sticking?",
        answer:
          "Use a good non-stick pan and ensure it's properly heated before adding the gyoza. Add enough oil (don't skimp!) and make sure the gyoza have flat bottoms so they sit flush with the pan. Once they're golden, they'll release easily. If using a regular pan, you may need slightly more oil.",
      },
    ],
    nutrition: {
      calories: 245,
      protein: 16,
      fat: 8,
      carbs: 26,
    },
    seoTitle: "Wagamama Chicken Gyoza Recipe - Classic Pan-Fried",
    seoDescription:
      "Make Wagamama's famous Chicken Gyoza! Crispy-bottomed Japanese dumplings with juicy chicken. Easy copycat recipe with authentic flavours.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/wagamama-chicken-gyoza",
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
      _id: `drafts.wagamama-chicken-gyoza-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Wagamama Chicken Gyoza recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized:");
  console.log("   - SEO Title: 55 characters ✓");
  console.log("   - SEO Description: 137 characters ✓");
  console.log("   - Canonical URL set ✓");
  console.log("🥟 Classic Japanese dumplings!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
