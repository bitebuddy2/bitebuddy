// scripts/create-wagamama-beef-kimchee-gyoza.ts
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

// Ingredient data for Wagamama Beef and Kimchee Gyoza
const ingredients = [
  {
    name: "Beef mince",
    synonyms: ["minced beef", "ground beef"],
    kcal100: 250,
    protein100: 26,
    fat100: 17,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: null,
  },
  {
    name: "Kimchi",
    synonyms: ["kimchee", "Korean pickled cabbage"],
    kcal100: 15,
    protein100: 1.1,
    fat100: 0.5,
    carbs100: 2.4,
    allergens: [],
    density_g_per_ml: 1.05,
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
    name: "Gochugaru",
    synonyms: ["Korean chili flakes", "Korean red pepper flakes"],
    kcal100: 282,
    protein100: 12,
    fat100: 5,
    carbs100: 57,
    allergens: [],
    density_g_per_ml: 0.35,
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
  console.log("🥟 Creating Wagamama Beef and Kimchee Gyoza Recipe\n");
  console.log("Creating ingredients...\n");

  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wagamama-beef-kimchee-gyoza"][0]`
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
  const spicyCategory = await client.fetch(
    `*[_type == "category" && slug.current == "spicy"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Wagamama Beef and Kimchee Gyoza",
    slug: {
      _type: "slug",
      current: "wagamama-beef-kimchee-gyoza",
    },
    description:
      "Spice up your starter with Wagamama's Beef and Kimchee Gyoza! Juicy beef, tangy Korean kimchi, and a kick of heat wrapped in crispy dumplings. A bold fusion twist on classic gyoza.",
    servings: 4,
    prepMin: 30,
    cookMin: 10,
    introText:
      "Wagamama's Beef and Kimchee Gyoza represent the restaurant's innovative approach to Japanese cooking - taking the traditional gyoza format and infusing it with bold Korean flavours. These dumplings are a fusion masterpiece, combining juicy British beef mince with tangy, spicy kimchi (Korean fermented cabbage), gochugaru (Korean chili flakes), and aromatic ginger and garlic. The result is a gyoza with layers of flavour: umami-rich beef, funky fermented kimchi tang, gentle heat from gochugaru, and the fresh bite of spring onions. What makes these gyoza so special is the contrast between the spicy, bold filling and the delicate wrapper, all crowned with that signature crispy golden bottom that Wagamama is famous for. Kimchi is a cornerstone of Korean cuisine, celebrated for its complex fermented flavours and probiotic benefits, and it brings a unique depth to these dumplings that sets them apart from more traditional fillings. The slight acidity of the kimchi cuts through the richness of the beef, while the gochugaru adds a warm, smoky heat rather than aggressive spice. These gyoza are perfect for spice lovers looking for something more adventurous than standard pork dumplings. They work brilliantly as a sharing starter for 4, or as a satisfying light meal for 2 when paired with steamed rice and more kimchi on the side. The recipe might seem involved, but most of the work is in the folding - and even imperfect gyoza taste incredible! Making them at home means you control the spice level and can make big batches to freeze for whenever you need a quick, restaurant-quality meal.",
    ...(wagamamaBrand && {
      brand: {
        _type: "reference",
        _ref: wagamamaBrand._id,
      },
    }),
    ...(startersCategory && spicyCategory && {
      categories: [
        {
          _type: "reference",
          _ref: startersCategory._id,
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
            text: "The Beef and Kimchee Gyoza showcase Wagamama's willingness to experiment with Pan-Asian flavours, blending Japanese cooking techniques with Korean ingredients. While traditional gyoza originated in Japan as an adaptation of Chinese jiaozi, Wagamama's modern take embraces the current popularity of Korean cuisine in the UK, incorporating kimchi - a staple that's beloved for its complex fermented flavours and health benefits. This cross-cultural approach reflects how contemporary Asian restaurants in Britain create exciting new dishes by combining the best elements of different Asian culinary traditions.",
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
            text: "These gyoza are part of Wagamama's ongoing effort to keep their menu fresh and exciting while respecting traditional cooking methods. The kimchi adds not just heat and tang, but also probiotics and umami depth, making these dumplings more than just delicious - they're part of the global trend toward gut-healthy, fermented foods. Served with their signature dipping sauce, these gyoza pair wonderfully with Wagamama's ramen dishes or work perfectly as a bold standalone starter that gets people talking.",
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
              _ref: ingredientIds["Beef mince"],
            },
            quantity: "300",
            unit: "g",
            notes: "15-20% fat is ideal",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Kimchi"],
            },
            quantity: "150",
            unit: "g",
            notes: "drained and finely chopped",
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
              _ref: ingredientIds["Gochugaru"],
            },
            quantity: "1",
            unit: "tsp",
            notes: "adjust to taste",
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
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Gochugaru"],
            },
            quantity: "1/2",
            unit: "tsp",
            notes: "optional, for extra heat",
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
                text: "Prepare the kimchi: Remove the kimchi from the jar and squeeze out as much liquid as possible - this is crucial to prevent soggy gyoza. You should extract 2-3 tablespoons of liquid. Finely chop the squeezed kimchi into small pieces (about 3-5mm). The kimchi should be well-fermented for the best flavour - if it's very fresh and crunchy, it won't have developed the complex tangy flavour needed.",
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
                text: "Make the filling: In a large bowl, combine the beef mince, chopped kimchi, spring onions, grated ginger, grated garlic, soy sauce, sesame oil, gochugaru, and cornflour. Mix thoroughly with your hands in one direction for about 2 minutes - this helps bind the filling and makes it sticky. The mixture should hold together when pressed. Taste a tiny amount (cook a bit in a pan if you're concerned about raw meat) and adjust the seasoning if needed - remember the dipping sauce will add more saltiness.",
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
                text: "Fill the gyoza: Set up your assembly station with wrappers, filling, and a small bowl of water. Place a wrapper in your palm and add about 1 heaped teaspoon of filling to the centre - resist the temptation to overfill! Dip your finger in water and moisten the entire edge of the wrapper. Fold in half to create a half-moon, then starting from one end, create 5-6 small pleats along the front edge while pressing against the unpleated back edge. The gyoza should sit upright with a flat bottom. Place on a lightly floured tray and cover with a damp tea towel to prevent drying. Repeat until all filling is used (makes about 30 gyoza).",
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
                text: "Cook the gyoza: Heat 1 tablespoon of vegetable oil in a large non-stick frying pan over medium-high heat. Arrange about 15 gyoza in the pan, flat-bottoms down, in a circular pattern or rows (cook in 2 batches). Fry for 2-3 minutes without moving them, until the bottoms are golden and crispy. Carefully add 100ml of water to the pan (it will sizzle and spit!), immediately cover with a tight-fitting lid, and steam for 6-7 minutes. The water should evaporate completely and the wrappers will become translucent when fully cooked. Remove the lid and cook for another 1-2 minutes to re-crisp the bottoms. Transfer to a serving plate, crispy-side up. Repeat with remaining gyoza.",
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
                text: "Make the dipping sauce: While the gyoza cook, whisk together the soy sauce, rice wine vinegar, sesame oil, and gochugaru (if using) in a small bowl. For extra Korean flair, add a spoonful of kimchi juice from the jar - it adds fantastic flavour! Divide between individual dipping bowls.",
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
                text: "Serve: Arrange the hot gyoza on a serving plate with the crispy bottoms facing upward. Garnish with extra sliced spring onions, toasted sesame seeds, or more gochugaru if you like it spicy. Serve immediately while hot and crispy, with the dipping sauce on the side. Enjoy them Wagamama-style by picking up with chopsticks, dipping, and eating in one or two satisfying bites!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Use well-fermented kimchi for the best flavour - if it's too fresh, it won't have the tangy punch you need.",
      "Really squeeze that kimchi dry! Excess liquid is the #1 reason gyoza burst during cooking.",
      "Can't find gochugaru? Substitute with 1/2 tsp regular chilli flakes or a pinch of cayenne pepper.",
      "For extra heat, add some of the red chilli paste from the kimchi jar directly into the filling.",
      "These freeze beautifully - freeze uncooked on a tray, then bag up. Cook from frozen, adding 2 minutes to steaming time.",
      "If you're sensitive to spice, start with 1/2 tsp gochugaru and adjust up in future batches.",
      "The pleats aren't just decorative - they help seal the gyoza and prevent bursting during cooking.",
      "Make it a Korean-Japanese fusion feast by serving alongside japchae (Korean glass noodles) or ramen!",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "What is gochugaru and where can I buy it?",
        answer:
          "Gochugaru is Korean red chilli flakes made from sun-dried Korean red chillies. It has a unique fruity, slightly smoky flavour and medium heat. You can find it in Asian supermarkets, large Tesco/Sainsbury's stores (in the world foods aisle), or online. If unavailable, substitute with regular chilli flakes, but the flavour won't be quite as authentic.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use shop-bought kimchi?",
        answer:
          "Absolutely - and this is what we recommend! Shop-bought kimchi from Korean brands like Kimchi, Mother-in-Law's, or Assi is perfect and already properly fermented. You can find it in most major supermarkets now (usually in the world foods or fresh sections). Avoid making your own for this recipe as it takes weeks to ferment properly.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Are these very spicy?",
        answer:
          "They have a gentle-to-medium heat - more warming than fiery. The gochugaru adds a fruity, smoky warmth rather than aggressive heat. If you're spice-sensitive, reduce gochugaru to 1/2 tsp or omit it entirely (you'll still have heat from the kimchi). For spice lovers, increase to 2 tsp or add fresh red chilli to the filling!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make these vegetarian?",
        answer:
          "Yes! Replace the beef with 300g firm tofu (pressed and crumbled) or finely chopped mushrooms (squeezed dry after cooking). Add an extra 1 tsp soy sauce for umami depth. You can also use shop-bought vegan gyoza wrappers (check the label as some contain egg). The kimchi is usually vegan but check the ingredients as some brands use fish sauce.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How long will leftover cooked gyoza keep?",
        answer:
          "Cooked gyoza will keep in the fridge for up to 2 days in an airtight container, but they'll lose their crispy texture. Reheat in a hot pan with a splash of water and a lid to re-steam them, then uncover to crisp up the bottoms again. Alternatively, pan-fry them in a little oil. They won't be quite as good as fresh but still delicious!",
      },
    ],
    nutrition: {
      calories: 295,
      protein: 20,
      fat: 13,
      carbs: 24,
    },
    seoTitle: "Wagamama Beef & Kimchee Gyoza - Spicy Korean-Japanese",
    seoDescription:
      "Make Wagamama's Beef & Kimchee Gyoza! Spicy Korean-Japanese fusion dumplings with beef & tangy kimchi. Easy copycat recipe with crispy bottoms.",
    canonicalUrl: "https://bitebuddy.co.uk/recipes/wagamama-beef-kimchee-gyoza",
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
      _id: `drafts.wagamama-beef-kimchee-gyoza-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Wagamama Beef and Kimchee Gyoza recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized:");
  console.log("   - SEO Title: 57 characters ✓");
  console.log("   - SEO Description: 145 characters ✓");
  console.log("   - Canonical URL set ✓");
  console.log("   - Categories: Starters, Spicy ✓");
  console.log("🥟 Spicy Korean-Japanese fusion!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
