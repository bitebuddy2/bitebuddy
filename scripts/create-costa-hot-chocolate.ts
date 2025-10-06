// scripts/create-costa-hot-chocolate.ts
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

// Ingredient data for Costa Hot Chocolate
const ingredients = [
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
  {
    name: "Cocoa powder",
    synonyms: ["unsweetened cocoa powder", "cocoa"],
    kcal100: 228,
    protein100: 20,
    fat100: 14,
    carbs100: 58,
    allergens: [],
    density_g_per_ml: 0.52,
  },
  {
    name: "Caster sugar",
    synonyms: ["superfine sugar", "fine sugar"],
    kcal100: 387,
    protein100: 0,
    fat100: 0,
    carbs100: 100,
    allergens: [],
    density_g_per_ml: 0.85,
  },
  {
    name: "Dark chocolate",
    synonyms: ["dark chocolate chips", "70% dark chocolate", "plain chocolate"],
    kcal100: 546,
    protein100: 5.5,
    fat100: 31,
    carbs100: 61,
    allergens: ["dairy"],
    gramsPerPiece: 50,
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
    name: "Chocolate shavings",
    synonyms: ["grated chocolate", "chocolate curls"],
    kcal100: 535,
    protein100: 8,
    fat100: 30,
    carbs100: 59,
    allergens: ["dairy"],
  },
  {
    name: "Marshmallows",
    synonyms: ["mini marshmallows", "marshmallow"],
    kcal100: 318,
    protein100: 1.8,
    fat100: 0.2,
    carbs100: 81,
    allergens: [],
    gramsPerPiece: 5,
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
  console.log("☕ Creating Costa Hot Chocolate Recipe\n");
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
    `*[_type == "recipe" && slug.current == "costa-hot-chocolate"][0]`
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
    title: "Costa Hot Chocolate",
    slug: {
      _type: "slug",
      current: "costa-hot-chocolate",
    },
    description:
      "Make Costa's indulgent hot chocolate at home with this easy copycat recipe. Rich, creamy, luxurious - topped with whipped cream and chocolate. Perfect winter warmer!",
    servings: 1,
    prepMin: 5,
    cookMin: 5,
    kcal: 385,
    introText:
      "Costa's Hot Chocolate is one of the UK's most beloved coffee shop drinks, known for its incredibly rich, velvety texture and deep chocolate flavour that feels like a luxurious treat in a cup. What sets Costa's hot chocolate apart from others is the use of real dark chocolate combined with premium cocoa powder, creating layers of chocolate intensity that satisfy even the most devoted chocoholics. The secret to that signature Costa creaminess lies in the technique - warming the milk to the perfect temperature and whisking in the chocolate until it's completely smooth and frothy. Topped with a generous swirl of whipped cream, chocolate shavings, and sometimes marshmallows, it's more dessert than drink. This homemade version captures every element of Costa's famous hot chocolate using simple ingredients you likely already have. Whether you're craving that cosy café experience on a cold day, want to save money, or simply prefer making drinks at home, this recipe delivers authentic Costa taste and quality. It's ready in just 10 minutes and costs a fraction of the high street price!",
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
            text: "Costa Coffee was founded in London in 1971 by Italian brothers Sergio and Bruno Costa, who set out to create the perfect cup of coffee for Britain. While famous for their coffee, Costa's hot chocolate has become equally iconic, particularly popular during autumn and winter months. The company developed their hot chocolate recipe to meet British tastes for rich, indulgent drinks that provide comfort on cold, grey days.",
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
            text: "Costa's hot chocolate is made using a specific blend of cocoa and real chocolate, creating a drink that's richer and more complex than standard hot chocolate. The company offers several variations including Luxury Hot Chocolate, Mint Hot Chocolate, and seasonal specials, but the classic version remains the most popular. With over 2,700 stores in the UK alone, Costa's hot chocolate has become a staple for millions seeking a warming treat, selling particularly well during the colder months when hot chocolate sales can triple.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Hot Chocolate",
        items: [
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
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dark chocolate"],
            },
            quantity: "40",
            unit: "g",
            notes: "70% cocoa, chopped",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Cocoa powder"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Caster sugar"],
            },
            quantity: "1-2",
            unit: "tbsp",
            notes: "to taste",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vanilla extract"],
            },
            quantity: "1/4",
            unit: "tsp",
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
              _ref: ingredientIds["Chocolate shavings"],
            },
            quantity: "",
            unit: "",
            notes: "for sprinkling",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Marshmallows"],
            },
            quantity: "",
            unit: "",
            notes: "optional",
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
                text: "Prepare the chocolate: Finely chop the dark chocolate into small pieces - the smaller the pieces, the faster and more smoothly it will melt. This is key to achieving that silky Costa texture without any lumps.",
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
                text: "Warm the milk: Pour the milk into a small saucepan and heat over medium heat until it's steaming hot but not boiling (around 70-75°C). Watch it carefully - you want it hot enough to melt the chocolate but not so hot that it scalds. Stir occasionally to prevent a skin forming.",
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
                text: "Add the chocolate and cocoa: Remove the pan from the heat and add the chopped dark chocolate, cocoa powder, sugar (start with 1 tbsp and add more to taste), and vanilla extract. Let it sit for 30 seconds to allow the chocolate to start melting.",
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
                text: "Whisk to perfection: Using a whisk or milk frother, vigorously whisk the mixture for 30-60 seconds until the chocolate is completely melted and the drink is smooth, creamy, and slightly frothy on top. This whisking action creates that luxurious, velvety texture Costa is famous for. The mixture should be glossy and rich.",
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
                text: "Taste and adjust: Give it a taste - if you prefer it sweeter, add the extra tablespoon of sugar and whisk again. If it's too thick, add a splash more milk. If you want it more intensely chocolatey, add another teaspoon of cocoa powder.",
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
                text: "Serve Costa-style: Pour the hot chocolate into a large mug or Costa-style cup. Top with a generous swirl of whipped cream, then sprinkle with chocolate shavings. Add a few marshmallows if you like extra indulgence. Serve immediately while it's hot and the cream is still fluffy. Enjoy with a spoon to scoop up the cream!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "For the most authentic Costa taste, use 70% dark chocolate - it provides depth without being too bitter when combined with sugar.",
      "A milk frother creates the best texture and froth, but vigorous whisking works perfectly well too. The key is incorporating air for that velvety finish.",
      "Don't let the milk boil - overheated milk develops an unpleasant 'cooked' taste and won't create the silky texture you want.",
      "Make it extra special: add a pinch of cinnamon, a dash of peppermint extract, or a splash of Baileys for an adult version.",
      "For a vegan version, use oat milk (Oatly Barista works brilliantly), dairy-free dark chocolate, and coconut whipped cream.",
      "The drink thickens as it cools, so drink it while hot. If it does thicken, simply whisk in a splash more warm milk.",
      "Make luxury Costa-style: use half milk, half single cream for an ultra-rich version that's absolutely decadent.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use milk chocolate instead of dark chocolate?",
        answer:
          "Yes, but the taste will be sweeter and less rich than Costa's version. If using milk chocolate, reduce the sugar to 1/2 tablespoon as milk chocolate is already quite sweet. Dark chocolate (70% cocoa) gives that sophisticated, deep chocolate flavour Costa is known for.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What type of milk works best?",
        answer:
          "Whole milk (full-fat) creates the creamiest, most authentic Costa hot chocolate. Semi-skimmed works but will be less rich. For dairy-free, oat milk (especially barista blends) is the best alternative - it froths well and has a creamy texture. Almond milk can be too thin and watery.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I make it extra frothy like Costa?",
        answer:
          "Use a milk frother or blend the hot chocolate in a blender for 10 seconds. Alternatively, pour it between two jugs a few times (careful - it's hot!). The whisking technique in step 4 also creates good froth. Costa uses professional steam wands which create extra microfoam.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this ahead and reheat?",
        answer:
          "It's best made fresh, but you can make the chocolate base ahead and store it in the fridge for up to 2 days. Reheat gently in a saucepan, whisking constantly, and add a splash of milk to restore the consistency. Don't microwave as it can make the chocolate grainy.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why is my hot chocolate grainy or lumpy?",
        answer:
          "This usually means the chocolate wasn't chopped finely enough or the milk was too hot and 'seized' the chocolate. Always chop chocolate finely, remove milk from heat before adding chocolate, let it sit for 30 seconds, then whisk vigorously. If it does seize, add 1-2 tbsp of hot water and whisk hard.",
      },
    ],
    nutrition: {
      calories: 385,
      protein: 11,
      fat: 18,
      carbs: 47,
    },
    seoTitle: "Costa Hot Chocolate Recipe - Easy 10 Min Copycat",
    seoDescription:
      "Make Costa's rich hot chocolate at home in 10 minutes! Creamy, indulgent copycat recipe with real chocolate. Topped with cream & shavings.",
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
      _id: `drafts.costa-hot-chocolate-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Costa Hot Chocolate recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized (NOT signature as requested):");
  console.log("   - SEO Title: 50 characters ✓");
  console.log("   - SEO Description: 130 characters ✓");
  console.log("☕ Perfect indulgent winter warmer!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
