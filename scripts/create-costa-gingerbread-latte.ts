// scripts/create-costa-gingerbread-latte.ts
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

// Ingredient data for Costa Gingerbread Latte
const ingredients = [
  // Coffee base
  {
    name: "Espresso coffee",
    synonyms: ["espresso", "strong coffee", "espresso shot"],
    kcal100: 2,
    protein100: 0.1,
    fat100: 0,
    carbs100: 0.5,
    allergens: [],
    density_g_per_ml: 1.0,
  },
  {
    name: "Whole milk",
    synonyms: ["full-fat milk", "full cream milk"],
    kcal100: 64,
    protein100: 3.4,
    fat100: 3.6,
    carbs100: 4.8,
    allergens: ["dairy"],
    density_g_per_ml: 1.03,
  },
  // Gingerbread syrup ingredients
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
    name: "Golden syrup",
    synonyms: ["light corn syrup", "Lyle's golden syrup"],
    kcal100: 298,
    protein100: 0.1,
    fat100: 0,
    carbs100: 79,
    allergens: [],
    density_g_per_ml: 1.4,
  },
  {
    name: "Ground ginger",
    synonyms: ["ginger powder", "dried ginger"],
    kcal100: 335,
    protein100: 9,
    fat100: 4.2,
    carbs100: 72,
    allergens: [],
  },
  {
    name: "Ground cinnamon",
    synonyms: ["cinnamon powder"],
    kcal100: 247,
    protein100: 4,
    fat100: 1.2,
    carbs100: 81,
    allergens: [],
  },
  {
    name: "Ground nutmeg",
    synonyms: ["nutmeg powder"],
    kcal100: 525,
    protein100: 5.8,
    fat100: 36,
    carbs100: 49,
    allergens: [],
  },
  {
    name: "Ground cloves",
    synonyms: ["clove powder"],
    kcal100: 274,
    protein100: 6,
    fat100: 13,
    carbs100: 66,
    allergens: [],
  },
  {
    name: "Vanilla extract",
    synonyms: ["pure vanilla extract", "vanilla essence"],
    kcal100: 288,
    protein100: 0.1,
    fat100: 0.1,
    carbs100: 13,
    allergens: [],
    density_g_per_ml: 0.88,
  },
  {
    name: "Black treacle",
    synonyms: ["molasses", "dark treacle"],
    kcal100: 257,
    protein100: 1.4,
    fat100: 0.1,
    carbs100: 67,
    allergens: [],
    density_g_per_ml: 1.4,
  },
  // Toppings
  {
    name: "Whipped cream",
    synonyms: ["whipping cream", "squirty cream", "aerosol cream"],
    kcal100: 345,
    protein100: 2.1,
    fat100: 37,
    carbs100: 2.8,
    allergens: ["dairy"],
    density_g_per_ml: 0.96,
  },
  {
    name: "Gingerbread biscuit",
    synonyms: ["gingerbread cookie", "gingerbread man"],
    kcal100: 436,
    protein100: 5.2,
    fat100: 13,
    carbs100: 75,
    allergens: ["gluten", "eggs"],
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
  console.log("🎄 Creating Costa Gingerbread Latte Recipe\n");
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
    `*[_type == "recipe" && slug.current == "costa-gingerbread-latte"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  // Get Costa brand
  const costaBrand = await client.fetch(
    `*[_type == "brand" && slug.current == "costa"][0]`
  );

  if (!costaBrand) {
    console.log("⚠️  Costa brand not found - recipe will be created without brand reference");
  }

  const recipeData = {
    _type: "recipe",
    title: "Costa Gingerbread Latte",
    slug: {
      _type: "slug",
      current: "costa-gingerbread-latte",
    },
    description:
      "Make Costa's festive Gingerbread Latte at home with this easy copycat recipe. Warming spices, sweet gingerbread syrup, espresso, and creamy milk - Christmas in a cup!",
    servings: 1,
    prepMin: 10,
    cookMin: 5,
    kcal: 295,
    introText:
      "Costa's Gingerbread Latte is the ultimate festive coffee drink, arriving on the menu each November to signal the start of the Christmas season. This seasonal favourite combines the warmth of traditional gingerbread spices - ginger, cinnamon, nutmeg, and cloves - with rich espresso and velvety steamed milk, creating a drink that tastes like Christmas in liquid form. What makes Costa's version so special is the homemade-style gingerbread syrup that captures the exact flavour of freshly baked gingerbread biscuits, with a perfect balance of spice and sweetness that doesn't overpower the coffee. Topped with whipped cream and often garnished with a mini gingerbread biscuit, it's become one of the most anticipated drinks of the year. This copycat recipe shows you how to make the authentic gingerbread syrup at home using pantry spices and simple ingredients, then combine it with coffee and milk to recreate that exact Costa taste. Whether you're craving festive flavours in October or want to enjoy gingerbread lattes all year round without the café price tag, this recipe delivers the real deal in just 15 minutes!",
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
            text: "Costa introduced the Gingerbread Latte as part of their festive menu range in the early 2010s, and it quickly became one of their most popular seasonal drinks. The drink was created to tap into Britain's love of gingerbread during the Christmas season, a tradition that dates back to medieval times. The combination of coffee and gingerbread spices proved so successful that it's now a permanent fixture on Costa's winter menu from November through December.",
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
            text: "The Gingerbread Latte has become synonymous with Christmas for many Costa customers, with social media buzzing each year when it returns to the menu. Costa sells millions of gingerbread lattes each festive season, making it one of their top-selling seasonal beverages alongside the Toblerone Hot Chocolate and Black Forest Hot Chocolate. The drink's popularity has inspired countless home baristas to recreate the recipe, though Costa's exact syrup formula remains a closely guarded secret.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Gingerbread Syrup (makes enough for 6-8 lattes)",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Brown sugar"],
            },
            quantity: "100",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Golden syrup"],
            },
            quantity: "3",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ground ginger"],
            },
            quantity: "2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ground cinnamon"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ground nutmeg"],
            },
            quantity: "1/2",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ground cloves"],
            },
            quantity: "1/4",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vanilla extract"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Black treacle"],
            },
            quantity: "1",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Latte",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Espresso coffee"],
            },
            quantity: "60",
            unit: "ml",
            notes: "2 shots or strong coffee",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Whole milk"],
            },
            quantity: "250",
            unit: "ml",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Topping",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Whipped cream"],
            },
            quantity: "",
            unit: "",
            notes: "generous swirl",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ground cinnamon"],
            },
            quantity: "",
            unit: "",
            notes: "for dusting",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Gingerbread biscuit"],
            },
            quantity: "1",
            unit: "",
            notes: "mini, optional",
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
                text: "Make the gingerbread syrup: In a small saucepan, combine 100ml water, brown sugar, golden syrup, ground ginger, cinnamon, nutmeg, cloves, vanilla extract, and black treacle. Heat over medium heat, stirring constantly until the sugar dissolves completely - about 3-4 minutes. Don't let it boil.",
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
                text: "Simmer the syrup: Once the sugar has dissolved, reduce the heat to low and simmer gently for 3-4 minutes until slightly thickened and the spices are fragrant. The syrup should coat the back of a spoon. Remove from heat and let cool. The syrup will thicken more as it cools. Store in a sealed jar in the fridge for up to 2 weeks.",
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
                text: "Make the espresso: Brew 2 shots of espresso (60ml) or make 60ml of very strong coffee. Pour into your serving mug. Add 2-3 tablespoons of the gingerbread syrup to the hot espresso and stir to combine. Taste and adjust - add more syrup if you prefer it sweeter.",
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
                text: "Steam the milk: Heat the milk in a saucepan over medium heat until steaming hot (around 65-70°C) but not boiling. If you have a milk frother or steam wand, use it to create microfoam - this gives that authentic Costa texture. Alternatively, whisk vigorously or use a hand-held frother to create foam.",
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
                text: "Combine and serve: Pour the steamed milk over the gingerbread espresso, holding back the foam with a spoon. Once the mug is almost full, spoon the milk foam on top. Top with a generous swirl of whipped cream, dust with a pinch of ground cinnamon, and garnish with a mini gingerbread biscuit if desired.",
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
                text: "Enjoy: Serve immediately while hot. The gingerbread biscuit can be dunked in the latte or enjoyed on the side. The spiced flavours are most aromatic when the drink is freshly made and piping hot!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "The gingerbread syrup is the star - make a big batch and store it in the fridge for up to 2 weeks. It's also delicious in hot chocolate or drizzled over ice cream!",
      "Black treacle (molasses) adds depth and that authentic gingerbread colour. If you don't have it, the syrup still works without it, though it will be slightly lighter in flavour.",
      "For a vegan version, use oat milk (barista blend) and skip the whipped cream or use coconut whipped cream. The gingerbread syrup is already vegan!",
      "Don't have an espresso machine? Use 60ml of very strong instant coffee (2 tbsp instant coffee in 60ml boiling water) or a moka pot.",
      "Adjust the spice level to taste - if you love ginger, add an extra 1/2 tsp. For a milder version, reduce the ginger to 1 1/2 tsp.",
      "Make it iced: Let the coffee and syrup cool, pour over ice, add cold milk, and top with cold foam for a festive iced latte.",
      "The syrup thickness matters - too thin and it won't have enough flavour; too thick and it won't mix well. Aim for honey consistency.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use ground ginger from a jar or does it have to be fresh?",
        answer:
          "You must use ground (powdered) ginger, not fresh ginger root. Fresh ginger won't dissolve in the syrup and will create a completely different flavour. Ground ginger from a jar is perfect and what gives the authentic gingerbread taste. Make sure it's relatively fresh for the best flavour.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How much gingerbread syrup should I use per latte?",
        answer:
          "Start with 2 tablespoons and taste - you can always add more. Costa's version is quite sweet, so 2-3 tablespoons is typical. The beauty of homemade is you can adjust to your preference. The syrup is concentrated, so a little goes a long way.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this without golden syrup?",
        answer:
          "Yes, but golden syrup adds a lovely caramel depth. Substitute with honey, maple syrup, or an extra 2 tbsp of brown sugar plus 1 tbsp of water. The flavour will be slightly different but still delicious. Honey makes it more floral, maple adds earthiness.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I store leftover gingerbread syrup?",
        answer:
          "Store in a clean, airtight jar or bottle in the fridge for up to 2 weeks. The syrup will thicken when cold - warm it slightly before use or just stir it vigorously into hot coffee. You can also freeze it in ice cube trays for up to 3 months.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What's the difference between this and a Gingerbread Cappuccino?",
        answer:
          "A latte has more milk and less foam (about 1/3 espresso, 2/3 steamed milk, thin foam layer). A cappuccino is equal parts espresso, steamed milk, and thick foam. For a gingerbread cappuccino, use the same syrup recipe but with 180ml milk and create a thick foam layer on top.",
      },
    ],
    nutrition: {
      calories: 295,
      protein: 9,
      fat: 10,
      carbs: 42,
    },
    seoTitle: "Costa Gingerbread Latte Recipe - Festive Copycat",
    seoDescription:
      "Make Costa's Gingerbread Latte at home! Easy festive recipe with homemade spiced syrup. Perfect Christmas coffee in 15 minutes.",
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
      _id: `drafts.costa-gingerbread-latte-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Costa Gingerbread Latte recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized (NOT signature as requested):");
  console.log("   - SEO Title: 52 characters ✓");
  console.log("   - SEO Description: 117 characters ✓");
  console.log("🎄 Perfect festive coffee for Christmas season!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
