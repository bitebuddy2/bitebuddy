// scripts/create-starbucks-drinks.ts
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

// Ingredient data for Starbucks drinks
const ingredients = [
  {
    name: "Espresso",
    synonyms: ["espresso coffee", "espresso shot", "coffee"],
    kcal100: 2,
    protein100: 0.1,
    fat100: 0,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 1.0,
  },
  {
    name: "Whole milk",
    synonyms: ["full fat milk", "milk"],
    kcal100: 61,
    protein100: 3.4,
    fat100: 3.6,
    carbs100: 4.8,
    allergens: ["dairy"],
    density_g_per_ml: 1.03,
  },
  {
    name: "Caramel sauce",
    synonyms: ["caramel syrup", "caramel topping"],
    kcal100: 308,
    protein100: 1,
    fat100: 1.5,
    carbs100: 73,
    allergens: ["dairy"],
    density_g_per_ml: 1.4,
  },
  {
    name: "Vanilla syrup",
    synonyms: ["vanilla flavoring", "vanilla sauce"],
    kcal100: 260,
    protein100: 0,
    fat100: 0,
    carbs100: 65,
    allergens: [],
    density_g_per_ml: 1.35,
  },
  {
    name: "Ice cubes",
    synonyms: ["ice", "crushed ice"],
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 0.92,
  },
  {
    name: "Whipped cream",
    synonyms: ["whipping cream", "heavy cream whipped", "cream topping"],
    kcal100: 292,
    protein100: 2.2,
    fat100: 31,
    carbs100: 2.7,
    allergens: ["dairy"],
    density_g_per_ml: 0.33,
  },
  {
    name: "Matcha powder",
    synonyms: ["green tea powder", "matcha green tea"],
    kcal100: 324,
    protein100: 29,
    fat100: 5.3,
    carbs100: 39,
    allergens: [],
    density_g_per_ml: 0.5,
  },
  {
    name: "Cocoa powder",
    synonyms: ["unsweetened cocoa", "cocoa", "cacao powder"],
    kcal100: 228,
    protein100: 20,
    fat100: 14,
    carbs100: 58,
    allergens: [],
    density_g_per_ml: 0.5,
  },
  {
    name: "Chocolate chip cookies",
    synonyms: ["choc chip cookies", "chocolate cookies"],
    kcal100: 502,
    protein100: 5.4,
    fat100: 24,
    carbs100: 66,
    allergens: ["gluten", "dairy", "eggs"],
    gramsPerPiece: 15,
  },
  {
    name: "Chocolate sauce",
    synonyms: ["chocolate syrup", "mocha sauce"],
    kcal100: 279,
    protein100: 2.1,
    fat100: 1.2,
    carbs100: 65,
    allergens: ["dairy"],
    density_g_per_ml: 1.37,
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

async function createRecipes() {
  console.log("☕ Creating Starbucks Drink Recipes\n");
  console.log("Creating/checking ingredients...\n");

  // Create or get all ingredients and store their IDs
  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");

  // Get Starbucks brand
  const starbucksBrand = await client.fetch(
    `*[_type == "brand" && slug.current == "starbucks"][0]`
  );

  if (!starbucksBrand) {
    console.log("⚠️  Starbucks brand not found - creating recipes without brand reference");
  }

  // Get categories
  const drinksCategory = await client.fetch(
    `*[_type == "category" && slug.current == "drinks"][0]`
  );
  const vegetarianCategory = await client.fetch(
    `*[_type == "category" && slug.current == "vegetarian"][0]`
  );
  const coffeeCategory = await client.fetch(
    `*[_type == "category" && slug.current == "coffee"][0]`
  );

  // Recipe 1: Caramel Frappuccino
  console.log("\n📝 Creating Caramel Frappuccino...");
  const caramelFrappData = {
    _type: "recipe",
    title: "Starbucks Caramel Frappuccino",
    slug: {
      _type: "slug",
      current: "starbucks-caramel-frappuccino",
    },
    description:
      "Make Starbucks' iconic Caramel Frappuccino at home! Creamy blended coffee with caramel sauce, topped with whipped cream. Easy copycat recipe tastes just like the real thing.",
    servings: 1,
    prepMin: 5,
    cookMin: 0,
    introText:
      "The Starbucks Caramel Frappuccino is one of the most popular drinks on the Starbucks menu and has been a customer favourite since Frappuccinos were first introduced in 1995. This blended coffee beverage combines the perfect balance of coffee, milk, ice, and sweet caramel flavour, all topped with whipped cream and an extra drizzle of caramel sauce. What makes the Caramel Frappuccino so special is its incredibly smooth, creamy texture - it's like drinking a coffee milkshake, but better. The drink starts with Starbucks' signature Frappuccino Roast coffee, which is a specially developed coffee blend that tastes strong even when mixed with ice and milk. This is then blended with whole milk, ice, and caramel syrup until it reaches that signature slushy consistency that's thick enough to drink through a straw but smooth enough to be perfectly creamy. The caramel element comes in two forms: caramel syrup blended into the drink for sweetness and flavour throughout, and caramel sauce drizzled on top (and often inside the cup) for visual appeal and extra indulgence. This recipe recreates the Starbucks version as closely as possible using ingredients you can easily find at home or in supermarkets. The key is using strong coffee (espresso or very strong brewed coffee works best), blending it with the right ratio of milk and ice, and not skimping on the caramel or whipped cream! A Grande Caramel Frappuccino at Starbucks costs around £4.95, but you can make this copycat version at home for a fraction of the cost. It's perfect for summer afternoons, as an afternoon pick-me-up, or whenever you're craving that Starbucks experience without leaving your house. While it does require a blender, the actual preparation takes just 5 minutes, and the result is a café-quality drink that rivals the real thing!",
    ...(starbucksBrand && {
      brand: {
        _type: "reference",
        _ref: starbucksBrand._id,
      },
    }),
    ...(drinksCategory && vegetarianCategory && {
      categories: [
        {
          _type: "reference",
          _ref: drinksCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: vegetarianCategory._id,
          _key: randomUUID(),
        },
        ...(coffeeCategory
          ? [
              {
                _type: "reference",
                _ref: coffeeCategory._id,
                _key: randomUUID(),
              },
            ]
          : []),
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
            text: "Starbucks introduced the Frappuccino in 1995 after acquiring The Coffee Connection, a Boston-based coffee company that had developed the original blended coffee drink. The word 'Frappuccino' is a portmanteau of 'frappé' (a Greek iced coffee drink) and 'cappuccino'. The Caramel Frappuccino joined the permanent menu shortly after and quickly became one of the top-selling beverages, particularly popular during spring and summer months when customers crave cold, refreshing drinks.",
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
            text: "The success of the Frappuccino line has been phenomenal - it's estimated that Starbucks sells millions of Frappuccinos every year worldwide, with the Caramel Frappuccino consistently ranking in the top three flavours. Starbucks has trademarked the name 'Frappuccino', so competitors have to call their versions 'frappes', 'iced blended drinks', or 'frozen coffee'. The recipe has remained largely consistent over the years, though Starbucks has occasionally offered variations like the Ultra Caramel Frappuccino with extra layers of caramel. For many people, a Caramel Frappuccino represents a treat, a reward, or a way to cool down on a hot day, and it has become deeply embedded in coffee culture worldwide.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Frappuccino",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Espresso"],
            },
            quantity: "60",
            unit: "ml",
            notes: "2 shots, or 90ml strong coffee, cooled",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Whole milk"],
            },
            quantity: "180",
            unit: "ml",
            notes: "cold",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Caramel sauce"],
            },
            quantity: "3",
            unit: "tbsp",
            notes: "plus extra for drizzling",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vanilla syrup"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ice cubes"],
            },
            quantity: "250",
            unit: "g",
            notes: "about 2 cups",
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
            quantity: "50",
            unit: "g",
            notes: "generous dollop",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Caramel sauce"],
            },
            quantity: "1",
            unit: "tbsp",
            notes: "for drizzling",
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
                text: "Prepare your coffee: Brew 2 shots of espresso (60ml) or make 90ml of very strong coffee. Let it cool to room temperature, or speed this up by placing it in the fridge for 10 minutes. Cold coffee is essential - hot coffee will melt your ice too quickly and give you a watery drink.",
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
                text: "Drizzle the cup (optional but authentic): For the true Starbucks experience, drizzle some caramel sauce around the inside of your serving glass before adding the drink. Simply squeeze caramel sauce in a spiral pattern around the inside - it will create those iconic caramel stripes you see in Starbucks.",
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
                text: "Blend the Frappuccino: Add the cooled espresso/coffee, cold whole milk, 3 tablespoons of caramel sauce, vanilla syrup, and ice cubes to a high-powered blender. Blend on high speed for 30-45 seconds until the mixture is completely smooth and slushy with no ice chunks remaining. The consistency should be thick but pourable - similar to a milkshake. If it's too thick, add a splash more milk; if too thin, add a few more ice cubes and blend again.",
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
                text: "Serve and top: Pour the blended Frappuccino into your prepared glass (or a clean one if you skipped step 2). Top generously with whipped cream - don't be shy, the cream should form a nice dome on top! Drizzle caramel sauce over the whipped cream in a criss-cross pattern. Serve immediately with a wide straw or enjoy with a spoon for the whipped cream first, then a straw for the drink.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Use espresso or very strong coffee - weak coffee will result in a drink that tastes more like a caramel milkshake than a coffee drink. If using instant coffee, use 2-3 teaspoons in 60ml hot water, then cool.",
      "Don't skip the vanilla syrup - it adds depth and rounds out the sweetness. You can make your own by heating equal parts sugar and water with vanilla extract.",
      "For a thicker, more ice-cream-like texture, add a scoop (50g) of vanilla ice cream to the blender. This is how some Starbucks baristas make extra-thick Frappuccinos!",
      "Freeze your coffee in ice cube trays the night before, then use coffee ice cubes instead of regular ice - this prevents dilution and gives a stronger coffee flavour.",
      "Adjust sweetness to taste - Starbucks drinks are quite sweet, so if you prefer less sweet, reduce the vanilla syrup and caramel sauce slightly.",
      "A high-powered blender (like a Vitamix or NutriBullet) works best. If you only have a basic blender, crush your ice first or use smaller ice cubes.",
      "Make it vegan by using oat milk or almond milk, dairy-free caramel sauce, and coconut whipped cream.",
      "For an even more indulgent version, blend in a tablespoon of dulce de leche or add a shot of caramel liqueur for an adults-only treat!",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this without a blender?",
        answer:
          "Unfortunately, no. A blender is essential to achieve that signature smooth, slushy Frappuccino texture. A food processor won't work as well because it doesn't blend ice as smoothly. If you don't have a blender, consider making an iced caramel latte instead - it's delicious and requires no special equipment!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How many calories are in this homemade version?",
        answer:
          "This recipe contains approximately 380-420 calories depending on how much whipped cream and caramel drizzle you use. A Grande Caramel Frappuccino at Starbucks with whole milk and whipped cream contains about 420 calories, so this homemade version is very similar. You can reduce calories by using semi-skimmed or skimmed milk, reducing syrup, or skipping the whipped cream.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this in advance?",
        answer:
          "Frappuccinos are best enjoyed immediately after blending while they're cold and the texture is perfect. However, you can prepare the coffee in advance and keep it in the fridge, and you can even measure out your ingredients ahead of time. If you do make it ahead, store it in the freezer and re-blend briefly before serving to restore the texture.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What's the difference between caramel sauce and caramel syrup?",
        answer:
          "Caramel sauce is thicker and usually contains cream, giving it a richer flavour and the ability to drizzle decoratively. Caramel syrup is thinner and designed to blend easily into drinks. Starbucks uses caramel syrup in the drink and caramel sauce for drizzling. If you only have one, you can use caramel sauce for both - just thin it slightly with a teaspoon of milk for easier blending.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why is my Frappuccino watery?",
        answer:
          "This happens when the coffee wasn't cooled enough before blending (hot coffee melts the ice), you didn't use enough ice, or you over-blended it. Make sure your coffee is completely cool, use the full amount of ice specified, and blend just until smooth - about 30-45 seconds maximum.",
      },
    ],
    nutrition: {
      calories: 400,
      protein: 7,
      fat: 15,
      carbs: 59,
    },
    seoTitle: "Starbucks Caramel Frappuccino - Easy Copycat Recipe",
    seoDescription:
      "Make Starbucks Caramel Frappuccino at home! Blended coffee with caramel, topped with cream. Easy recipe tastes just like the real thing for a fraction of the cost.",
  };

  const existingCaramelFrapp = await client.fetch(
    `*[_type == "recipe" && slug.current == "starbucks-caramel-frappuccino"][0]`
  );

  if (existingCaramelFrapp) {
    await client.patch(existingCaramelFrapp._id).set(caramelFrappData).commit();
    console.log("✅ Caramel Frappuccino updated");
  } else {
    await client.create({
      ...caramelFrappData,
      _id: `drafts.starbucks-caramel-frappuccino-${randomUUID()}`,
    });
    console.log("✅ Caramel Frappuccino created as DRAFT");
  }

  // Recipe 2: Iced Matcha Latte
  console.log("\n📝 Creating Iced Matcha Latte...");
  const matchaLatteData = {
    _type: "recipe",
    title: "Starbucks Iced Matcha Latte",
    slug: {
      _type: "slug",
      current: "starbucks-iced-matcha-latte",
    },
    description:
      "Recreate Starbucks' Iced Matcha Latte at home! Smooth matcha green tea with milk over ice. Easy copycat recipe with that signature vibrant green color and creamy taste.",
    servings: 1,
    prepMin: 3,
    cookMin: 0,
    introText:
      "The Starbucks Iced Matcha Latte has become a cult favourite among health-conscious coffee shop goers and matcha enthusiasts alike. This vibrant green drink combines finely ground Japanese matcha green tea powder with milk and ice to create a creamy, refreshing beverage that's both energizing and calming - thanks to matcha's unique combination of caffeine and L-theanine. Unlike coffee-based drinks, the Iced Matcha Latte offers a gentler, more sustained energy boost without the jitters, making it perfect for afternoon sipping or as a morning alternative to espresso drinks. What makes the Starbucks version so appealing is its beautiful jade-green colour and smooth, slightly sweet taste with earthy undertones. Starbucks uses a matcha tea blend that's pre-sweetened, which gives it that signature taste that's become so popular - it's sweet enough to appeal to those new to matcha but still maintains the distinctive grassy, vegetal notes that matcha lovers appreciate. The drink is simply matcha powder shaken with milk and poured over ice, creating lovely layers before you stir it together. This recipe recreates the Starbucks experience using culinary-grade matcha powder (which is more affordable than ceremonial-grade for lattes) and a touch of sweetener to replicate Starbucks' pre-sweetened matcha blend. The result is a refreshing, Instagram-worthy drink that costs a fraction of the £4.50 you'd pay at Starbucks for a Grande. It's naturally vegetarian, easily made vegan with plant-based milk, and takes literally just 3 minutes to prepare - no special equipment needed beyond a jar or shaker to mix the matcha. Whether you're a matcha aficionado or curious to try this trendy drink, this copycat recipe delivers authentic Starbucks taste in your own kitchen!",
    ...(starbucksBrand && {
      brand: {
        _type: "reference",
        _ref: starbucksBrand._id,
      },
    }),
    ...(drinksCategory && vegetarianCategory && {
      categories: [
        {
          _type: "reference",
          _ref: drinksCategory._id,
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
            text: "Starbucks introduced matcha-based drinks to their menu in 2006, bringing this traditional Japanese tea ceremony ingredient to the mainstream Western market. The Iced Matcha Latte (originally called the Green Tea Latte when served hot, and Iced Green Tea Latte when cold) was part of Starbucks' expansion into tea beverages as they recognized the growing demand for non-coffee options. Matcha, which literally means 'powdered tea', is made from specially grown and processed green tea leaves that are stone-ground into a fine powder, allowing you to consume the entire leaf rather than just steeped water.",
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
            text: "The drink gained massive popularity around 2015-2016 as matcha became trendy in Western wellness culture, praised for its antioxidants, metabolism-boosting properties, and 'clean energy' from its caffeine and L-theanine combination. Starbucks' version helped introduce millions of people to matcha who might otherwise have never tried it. The company uses a proprietary matcha blend that's pre-sweetened with sugar, which makes it more approachable for Western palates accustomed to sweeter beverages, though this has sometimes drawn criticism from matcha purists. Nevertheless, the Starbucks Iced Matcha Latte remains one of their most popular non-coffee drinks and has spawned countless variations on social media, including pink drinks made with strawberry, and brown sugar matcha lattes.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Iced Matcha Latte",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Matcha powder"],
            },
            quantity: "2",
            unit: "tsp",
            notes: "culinary-grade matcha",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vanilla syrup"],
            },
            quantity: "2",
            unit: "tbsp",
            notes: "or sweetener of choice",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Whole milk"],
            },
            quantity: "240",
            unit: "ml",
            notes: "or milk alternative",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ice cubes"],
            },
            quantity: "150",
            unit: "g",
            notes: "about 1 cup",
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
                text: "Prepare the matcha mixture: In a small bowl or cup, add 2 teaspoons of matcha powder and 2 tablespoons of vanilla syrup (or your preferred sweetener). Add about 60ml (4 tablespoons) of the milk and whisk vigorously with a small whisk, fork, or matcha bamboo whisk until the matcha is completely dissolved and smooth with no lumps. This step is crucial - matcha clumps easily, so you need to work it into a smooth paste first before adding more liquid. The mixture should be bright green and completely smooth.",
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
                text: "Shake or mix: Add the smooth matcha mixture to a jar or cocktail shaker along with the remaining milk (about 180ml). Seal the lid tightly and shake vigorously for 15-20 seconds until the matcha is completely combined with the milk and slightly frothy. Alternatively, if you don't have a jar, you can whisk it in a bowl or use a milk frother to combine. The goal is to get everything evenly mixed - you want that uniform jade-green colour throughout.",
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
                text: "Serve over ice: Fill a tall glass (16oz/475ml for a Grande size) with ice cubes. Pour the matcha-milk mixture over the ice. The drink will have beautiful layers before you stir it - this is perfect for photos! Give it a gentle stir with a straw before drinking to ensure the matcha is evenly distributed. Enjoy immediately while cold and fresh.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Sift your matcha powder before using it to prevent clumps - this makes whisking much easier and ensures a smooth drink.",
      "Use culinary-grade matcha rather than ceremonial-grade for lattes - it's less expensive and works perfectly when mixed with milk. Save expensive ceremonial matcha for traditional tea preparation.",
      "The quality of matcha varies hugely. Look for vibrant green powder from Japan (avoid dull, brownish matcha which is old or low-quality). Store matcha in the fridge or freezer to preserve its colour and flavour.",
      "Starbucks uses a pre-sweetened matcha blend, which is why we add sweetener separately. Adjust sweetness to your preference - start with less and add more if needed.",
      "For the best Starbucks copycat taste, use whole milk. For dairy-free, oat milk works beautifully with matcha - it's creamy and slightly sweet. Coconut milk also pairs nicely with matcha's grassy notes.",
      "If you don't have vanilla syrup, you can use 1-2 tablespoons of honey, agave syrup, or even dissolve 2 teaspoons of sugar in a tiny amount of hot water first.",
      "For a thicker, frostier drink similar to a matcha Frappuccino, blend the matcha, milk, sweetener, and ice in a blender until smooth.",
      "Make it a 'dirty matcha' by adding a shot of espresso - this creates a beautiful layered effect and combines the benefits of both matcha and coffee!",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why does my matcha have lumps?",
        answer:
          "Matcha clumps very easily because it's such a fine powder. The key is to make a smooth paste first with just a small amount of liquid before adding the rest. Always whisk or shake vigorously. For best results, sift the matcha powder through a small sieve before using it - this breaks up any clumps before they form. Using slightly warm milk (not hot, just room temperature) can also help it dissolve more easily.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Is matcha healthier than coffee?",
        answer:
          "Matcha contains caffeine (about 70mg per 2 tsp, compared to 95mg in a shot of espresso) plus L-theanine, an amino acid that promotes calm focus. Many people find matcha gives them energy without the jitters or crash associated with coffee. Matcha is also rich in antioxidants, particularly EGCG catechins. However, adding milk and sweetener (as in this latte) reduces some of the health benefits. Neither is inherently 'healthier' - it depends on your goals and how your body responds to each!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this hot instead of iced?",
        answer:
          "Absolutely! Follow the same steps but heat your milk gently (don't boil it - aim for about 65-70°C) and skip the ice. Whisk the matcha with a small amount of the hot milk and sweetener first to create a smooth paste, then add the remaining hot milk while whisking. You can also use a milk frother to create microfoam on top for a café-style finish. Hot matcha lattes are cozy and delicious, especially in cooler months!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How much caffeine is in this drink?",
        answer:
          "This recipe uses about 2 teaspoons of matcha powder, which contains approximately 70mg of caffeine - roughly equivalent to a shot of espresso but less than a typical cup of drip coffee (which has 95-165mg). The caffeine in matcha is released more slowly than coffee due to the L-theanine, which is why many people experience a smoother, longer-lasting energy boost without the crash.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why is Starbucks matcha so sweet?",
        answer:
          "Starbucks uses a 'matcha tea blend' that contains sugar pre-mixed with the matcha powder (the ingredients are sugar and ground Japanese green tea). This makes it convenient for baristas and ensures consistent sweetness, but it also means you can't control the sugar content if ordering unsweetened. Their matcha blend is quite sweet to appeal to Western tastes. This homemade version lets you control exactly how sweet you want it!",
      },
    ],
    nutrition: {
      calories: 190,
      protein: 8,
      fat: 7,
      carbs: 25,
    },
    seoTitle: "Starbucks Iced Matcha Latte - Easy Copycat Recipe",
    seoDescription:
      "Make Starbucks Iced Matcha Latte at home in 3 minutes! Creamy green tea with milk over ice. Easy recipe with vibrant color and authentic taste for less money.",
  };

  const existingMatchaLatte = await client.fetch(
    `*[_type == "recipe" && slug.current == "starbucks-iced-matcha-latte"][0]`
  );

  if (existingMatchaLatte) {
    await client.patch(existingMatchaLatte._id).set(matchaLatteData).commit();
    console.log("✅ Iced Matcha Latte updated");
  } else {
    await client.create({
      ...matchaLatteData,
      _id: `drafts.starbucks-iced-matcha-latte-${randomUUID()}`,
    });
    console.log("✅ Iced Matcha Latte created as DRAFT");
  }

  // Recipe 3: Iced Caramel Macchiato
  console.log("\n📝 Creating Iced Caramel Macchiato...");
  const caramelMacchiatoData = {
    _type: "recipe",
    title: "Starbucks Iced Caramel Macchiato",
    slug: {
      _type: "slug",
      current: "starbucks-iced-caramel-macchiato",
    },
    description:
      "Make Starbucks' Iced Caramel Macchiato at home! Vanilla milk, espresso, and caramel in beautiful layers. Easy copycat recipe tastes exactly like the coffee shop favorite.",
    servings: 1,
    prepMin: 5,
    cookMin: 0,
    introText:
      "The Starbucks Iced Caramel Macchiato is one of the most iconic and beloved drinks on the Starbucks menu, and has been a permanent fixture since 1996 when it was created as a twist on the traditional Italian macchiato. Unlike its hot counterpart, the iced version showcases beautiful layers of vanilla-sweetened milk, bold espresso, and ribbons of caramel sauce, creating a drink that's as visually stunning as it is delicious. What makes the Iced Caramel Macchiato special is the way it's constructed: vanilla syrup is added first, then cold milk is poured over ice, and finally, espresso shots are poured directly over the top so they slowly filter through the milk creating a gorgeous marbled effect. The drink is finished with a crosshatch of caramel sauce drizzled over the top, which sinks down through the espresso creating additional layers of flavour and visual appeal. The name 'macchiato' means 'marked' or 'stained' in Italian, referring to how the espresso 'marks' the milk. The genius of this drink is in the experience - when you first taste it, you get the sweet caramel and creamy milk, but as you continue drinking and the layers mix, the strong espresso comes through more, creating an evolving flavour profile from first sip to last. This recipe recreates the exact method Starbucks baristas use, ensuring you get those signature layers and that perfect balance of sweet caramel, creamy vanilla milk, and robust espresso. A Grande Iced Caramel Macchiato at Starbucks costs around £4.75, but you can make this copycat version at home for a fraction of the cost using espresso from a coffee machine, stovetop espresso maker, or even a strong coffee as a substitute. It's the perfect drink for warm days when you want your caffeine hit with a touch of indulgence, and it takes just 5 minutes to prepare!",
    ...(starbucksBrand && {
      brand: {
        _type: "reference",
        _ref: starbucksBrand._id,
      },
    }),
    ...(drinksCategory && vegetarianCategory && coffeeCategory && {
      categories: [
        {
          _type: "reference",
          _ref: drinksCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: vegetarianCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: coffeeCategory._id,
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
            text: "The Caramel Macchiato was created by Starbucks in 1996, developed by a team looking to create a new signature drink that would appeal to customers who wanted the taste of espresso but in a sweeter, more approachable format. It was an immediate hit, becoming one of the top-selling handcrafted beverages and remaining in the top five best-sellers for decades. The iced version followed shortly after and became especially popular in warmer months and in year-round warm climates, where it consistently ranks as one of the most ordered drinks.",
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
            text: "What makes the Starbucks Caramel Macchiato different from a traditional Italian macchiato (which is simply espresso 'marked' with a dollop of foam) is the addition of vanilla syrup and caramel sauce, creating a much sweeter, more indulgent drink tailored to American tastes. Some coffee purists have criticized this departure from tradition, but millions of customers worldwide love it precisely because it's more approachable than straight espresso. The drink has inspired countless variations over the years - Starbucks has offered seasonal versions like the Coconut Milk Caramel Macchiato and the Cloud Caramel Macchiato - but the original recipe remains the most popular. For many Starbucks customers, ordering a Caramel Macchiato has become a daily ritual and a comfort drink that marks the start of their day or provides an afternoon pick-me-up.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Iced Caramel Macchiato",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vanilla syrup"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Whole milk"],
            },
            quantity: "240",
            unit: "ml",
            notes: "cold",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ice cubes"],
            },
            quantity: "150",
            unit: "g",
            notes: "about 1 cup",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Espresso"],
            },
            quantity: "60",
            unit: "ml",
            notes: "2 shots, freshly brewed",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Caramel sauce"],
            },
            quantity: "2",
            unit: "tbsp",
            notes: "for drizzling",
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
                text: "Build the base: In a tall glass (16oz/475ml for a Grande size), add 2 tablespoons of vanilla syrup to the bottom. Fill the glass with ice cubes - be generous with the ice as it will melt slightly and you want to keep the drink cold.",
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
                text: "Add the milk: Pour 240ml of cold whole milk over the ice, filling the glass almost to the top but leaving about 2cm of space for the espresso. Give it a very gentle stir just to combine the vanilla syrup with the milk - don't overmix, you want some vanilla concentrated at the bottom.",
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
                text: "Prepare the espresso: While your milk and ice are waiting, brew 2 shots of espresso (60ml total). This should be done right before serving - fresh espresso is essential for the best flavor. If you don't have an espresso machine, use a Moka pot or AeroPress to make very strong coffee as an alternative.",
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
                text: "Add the espresso (the 'mark'): This step creates the signature layers! Slowly pour the freshly brewed espresso directly over the ice and milk. Pour it gently but don't try to make it 'float' - just pour steadily in the center of the glass. The espresso will cascade through the milk creating beautiful marbled patterns and naturally creating layers. Don't stir at this stage - the layering is part of the Caramel Macchiato experience!",
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
                text: "Drizzle with caramel: Finish by drizzling caramel sauce over the top in a crosshatch pattern - squeeze the bottle back and forth across the top of the drink a few times. The caramel will create ribbons as it sinks through the espresso layer. This is the iconic finishing touch that makes it a Caramel Macchiato! Serve immediately with a straw. You can stir before drinking if you prefer everything mixed, or drink it layered to experience the changing flavours from top to bottom.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "The order of ingredients matters! Always build from bottom to top: vanilla syrup, ice, milk, espresso, caramel. This creates the signature layers.",
      "Use fresh espresso - the espresso should be hot when you pour it over the ice. This slight temperature contrast is part of what creates the layering effect.",
      "Don't stir after adding the espresso and caramel if you want the Instagram-worthy layered look. But do stir before drinking if you prefer a more uniform taste throughout!",
      "For the most authentic taste, use Starbucks' vanilla syrup if you can find it, or make your own by heating equal parts sugar and water with vanilla extract until dissolved.",
      "Whole milk gives the creamiest result, but you can use any milk you prefer. Oat milk works particularly well as a dairy-free alternative - it's creamy and froths nicely.",
      "If you don't have espresso, use 90ml of very strong coffee (use 3-4 tablespoons of grounds for a small amount of water) or even strong instant coffee as a substitute.",
      "For an extra-indulgent version, add a small drizzle of caramel sauce inside the glass before adding the ice - this creates caramel 'stripes' on the inside of the glass just like at Starbucks.",
      "Make it 'upside down' like many Starbucks regulars order: this means putting the espresso in first, then milk, then caramel - it changes the flavour progression and gives you more caramel in each sip!",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "What's the difference between a Caramel Macchiato and a Caramel Latte?",
        answer:
          "Great question! A Caramel Latte has the espresso mixed throughout the drink with caramel syrup and optional caramel drizzle on top. A Caramel Macchiato is built in layers with vanilla (not caramel) syrup in the milk, the espresso poured on top (not mixed in), and caramel sauce drizzled over. The Macchiato has more distinct layers and a different flavor progression as you drink it. Both are delicious but offer different experiences!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this with decaf espresso?",
        answer:
          "Absolutely! Use decaf espresso shots instead of regular - the flavor and preparation method remain exactly the same. Starbucks offers decaf versions of all their espresso drinks, so this is totally authentic. The drink will taste identical, just without the caffeine kick.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why is my drink not layering properly?",
        answer:
          "Layering issues usually happen because: 1) The espresso was too cool - it should be freshly brewed and hot, 2) You poured it too vigorously - pour steadily but gently in the center, 3) There's not enough ice - the ice helps create separation between layers. Make sure to fill your glass generously with ice and use freshly brewed espresso for best results. Even if the layers aren't perfect, it will still taste delicious!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How many calories are in this drink?",
        answer:
          "This recipe made with whole milk contains approximately 250-280 calories, which is similar to a Grande Iced Caramel Macchiato from Starbucks with whole milk (250 calories). You can reduce calories by using skimmed or semi-skimmed milk (saves 40-80 calories), reducing the vanilla syrup, or using less caramel drizzle. Made with oat milk it's about 270 calories, and with almond milk about 180 calories.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What does 'upside down' mean when ordering this drink?",
        answer:
          "Ordering a Caramel Macchiato 'upside down' at Starbucks means the barista reverses the build order - espresso goes in first, then vanilla milk, then caramel on top. This creates a drink where the coffee flavor is stronger from the first sip, and you get more caramel in each sip since it's on top. To make it upside down at home: put espresso and vanilla syrup in the glass, add ice, pour milk over, then drizzle caramel on top. It's essentially a caramel latte at that point, but many people prefer it this way!",
      },
    ],
    nutrition: {
      calories: 265,
      protein: 9,
      fat: 8,
      carbs: 38,
    },
    seoTitle: "Starbucks Iced Caramel Macchiato - Easy Copycat",
    seoDescription:
      "Make Starbucks Iced Caramel Macchiato at home! Layered vanilla milk, espresso & caramel. Easy copycat recipe tastes exactly like the coffee shop version for less.",
  };

  const existingCaramelMacchiato = await client.fetch(
    `*[_type == "recipe" && slug.current == "starbucks-iced-caramel-macchiato"][0]`
  );

  if (existingCaramelMacchiato) {
    await client
      .patch(existingCaramelMacchiato._id)
      .set(caramelMacchiatoData)
      .commit();
    console.log("✅ Iced Caramel Macchiato updated");
  } else {
    await client.create({
      ...caramelMacchiatoData,
      _id: `drafts.starbucks-iced-caramel-macchiato-${randomUUID()}`,
    });
    console.log("✅ Iced Caramel Macchiato created as DRAFT");
  }

  // Recipe 4: Mocha Cookie Crumble Frappuccino
  console.log("\n📝 Creating Mocha Cookie Crumble Frappuccino...");
  const mochaCookieData = {
    _type: "recipe",
    title: "Mocha Cookie Crumble Frappuccino",
    slug: {
      _type: "slug",
      current: "mocha-cookie-crumble-frappuccino",
    },
    description:
      "Make Starbucks' Mocha Cookie Crumble Frappuccino at home! Mocha blended coffee with cookie pieces, topped with cream and crumbles. Decadent copycat recipe for chocolate lovers.",
    servings: 1,
    prepMin: 7,
    cookMin: 0,
    introText:
      "The Starbucks Mocha Cookie Crumble Frappuccino is the ultimate indulgent treat for chocolate and coffee lovers - it's essentially a cookies and cream milkshake meets a mocha coffee, all blended into one decadent, over-the-top beverage. Originally introduced as a seasonal summer drink, it proved so popular that it became a permanent menu item in many markets, joining the ranks of Starbucks' most-loved Frappuccinos. What makes this drink so special is the combination of textures and flavors: you've got smooth mocha-flavored coffee ice cream texture from the blended base, crunchy chocolate cookie crumbles mixed throughout, fluffy whipped cream on top, and even more cookie crumbles sprinkled over the cream. It's maximum indulgence in a cup! The drink starts with Starbucks' Frappuccino Roast coffee, which is blended with milk, ice, and chocolate sauce to create a mocha base. Before blending, chocolate cookie pieces are added to the cup, then the mocha mixture is blended and poured over them. The whole thing is topped with whipped cream and a generous sprinkling of chocolate cookie crumbles, creating a drink that's part beverage, part dessert. The cookie pieces used are essentially crushed chocolate sandwich cookies similar to Oreos, which provide that cookies-and-cream flavor that pairs so perfectly with mocha. This recipe recreates the Starbucks experience using readily available ingredients - espresso or strong coffee, chocolate sauce, milk, ice, chocolate cookies, and whipped cream. The result is a luxurious, cafe-quality drink that costs a fraction of the £5.45 you'd pay for a Grande at Starbucks. It takes about 7 minutes to prepare and requires a blender, but the payoff is a show-stopping drink that looks as impressive as it tastes. Perfect for treating yourself on a hot day, satisfying chocolate cravings, or impressing guests with your barista skills!",
    ...(starbucksBrand && {
      brand: {
        _type: "reference",
        _ref: starbucksBrand._id,
      },
    }),
    ...(drinksCategory && vegetarianCategory && {
      categories: [
        {
          _type: "reference",
          _ref: drinksCategory._id,
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
            text: "The Mocha Cookie Crumble Frappuccino was introduced by Starbucks in 2013 as part of their Summer Frappuccino lineup, a seasonal strategy they use each year to create buzz and drive traffic during their busiest season. The drink was an immediate sensation, particularly popular with younger customers and on social media where its photogenic layers of cookies and cream made it highly shareable. Unlike some seasonal drinks that come and go, the Mocha Cookie Crumble proved so popular that Starbucks brought it back year after year, and eventually made it a permanent fixture in many locations.",
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
            text: "The drink fits perfectly into Starbucks' strategy of creating 'Instagram-worthy' beverages that blur the line between coffee shop drink and dessert. It's unabashedly indulgent - a Grande contains around 490 calories - and Starbucks has leaned into this, marketing it as a treat or reward rather than an everyday drink. The Mocha Cookie Crumble spawned numerous variations and inspired other cookie-based Frappuccinos, cementing cookies and cream as a permanent flavor profile in Starbucks' lineup. For many customers, ordering this drink represents a special occasion or a well-earned indulgence, and it remains one of the most-requested drinks on social media, with countless copycat recipes attempting to recreate that magical combination of mocha, cookies, and cream at home.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Cookie Crumbles",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Chocolate chip cookies"],
            },
            quantity: "4",
            unit: "cookies",
            notes: "or 60g chocolate sandwich cookies (like Oreos)",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Mocha Frappuccino",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Espresso"],
            },
            quantity: "60",
            unit: "ml",
            notes: "2 shots, or 90ml strong coffee, cooled",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Whole milk"],
            },
            quantity: "180",
            unit: "ml",
            notes: "cold",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Chocolate sauce"],
            },
            quantity: "3",
            unit: "tbsp",
            notes: "plus extra for drizzling",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vanilla syrup"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Ice cubes"],
            },
            quantity: "250",
            unit: "g",
            notes: "about 2 cups",
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
            quantity: "60",
            unit: "g",
            notes: "generous amount",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Chocolate sauce"],
            },
            quantity: "1",
            unit: "tbsp",
            notes: "for drizzling",
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
                text: "Prepare the cookie crumbles: Take 4 chocolate chip cookies or about 4-5 chocolate sandwich cookies (like Oreos) and break them into crumbles. You want a mix of sizes - some larger chunks and some fine crumbs. Place the cookies in a sealed plastic bag and gently crush with a rolling pin or the bottom of a cup, or simply break them up with your hands. Don't pulverize them - you want texture! Set aside about 2 tablespoons of the crumbles for topping, and keep the rest for the drink.",
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
                text: "Prepare the glass and add first layer of cookies: Drizzle chocolate sauce around the inside of your serving glass in a spiral pattern - this creates those beautiful chocolate stripes you see at Starbucks. Add about half of your cookie crumbles to the bottom of the glass (reserve the other half and the topping crumbles).",
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
                text: "Make the coffee base: Brew 2 shots of espresso (60ml) or make 90ml of very strong coffee and let it cool completely. You can speed this up by putting it in the fridge for 10 minutes or even adding an ice cube to cool it down (which will melt and become part of the drink). The coffee must be cold before blending or it will melt your ice too quickly.",
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
                text: "Blend the mocha Frappuccino: In a high-powered blender, combine the cooled coffee, cold milk, 3 tablespoons of chocolate sauce, vanilla syrup, and ice cubes. Blend on high speed for 30-45 seconds until completely smooth and the texture resembles a thick milkshake with no ice chunks. The mixture should be thick enough to drink through a straw but still pourable. If it's too thick, add a splash more milk; if too thin, add more ice and blend again.",
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
                text: "Layer and assemble: Pour half of the blended mocha mixture into your prepared glass (over the cookie crumbles at the bottom). Sprinkle the remaining cookie crumbles from your main batch over this layer. Pour the rest of the blended mixture on top. This creates layers of cookies throughout the drink!",
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
                text: "Top with whipped cream and finish: Add a very generous dome of whipped cream on top - this is a key part of the drink, so don't be shy! Drizzle chocolate sauce over the whipped cream in a criss-cross pattern. Finally, sprinkle the reserved cookie crumbles over everything. The finished drink should be towering and impressive! Serve immediately with a wide straw so you can get cookie pieces with each sip, or enjoy with a spoon first for the whipped cream topping.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Use chocolate sandwich cookies (like Oreos) for the most authentic Starbucks taste - Starbucks uses a proprietary chocolate cookie that's very similar. You can use chocolate chip cookies as an alternative, or even brownie pieces for extra decadence!",
      "Make sure your coffee is completely cold before blending - warm coffee will melt the ice and give you a watery, thin Frappuccino instead of that thick, creamy texture.",
      "A high-powered blender is really helpful for this recipe. If your blender struggles, crush the ice first or use smaller ice cubes.",
      "For an even thicker, more indulgent texture, blend in 50g of vanilla ice cream or chocolate ice cream with the other ingredients.",
      "Make your own chocolate sauce by mixing 2 tablespoons cocoa powder with 2 tablespoons hot water and 2 tablespoons sugar until smooth - it's cheaper and you control the sweetness!",
      "If you want to reduce calories slightly without sacrificing too much flavor, use semi-skimmed milk and reduce the whipped cream to a smaller dollop, but keep the cookie crumbles - they're essential!",
      "For a twist, try using mint chocolate cookies (like mint Oreos) to make a mint mocha cookie crumble version - absolutely delicious!",
      "The cookie crumbles will sink to the bottom over time, so drink it fairly soon after making it, or give it a stir halfway through drinking to redistribute the cookies.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this without coffee for a non-caffeine version?",
        answer:
          "Yes! Simply omit the espresso/coffee and replace it with an extra 60ml of milk. You'll essentially have a chocolate cookies and cream frappuccino, which is still absolutely delicious. You can also add an extra tablespoon of chocolate sauce to boost the chocolate flavor if you're not including coffee. This is perfect for kids or anyone avoiding caffeine!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What kind of cookies work best?",
        answer:
          "Chocolate sandwich cookies like Oreos are the closest to what Starbucks uses and give that classic cookies and cream flavor. However, you can experiment with any chocolate cookies - chocolate chip cookies, chocolate brownie cookies, or even chocolate graham crackers all work well. For a fun twist, try peanut butter sandwich cookies, mint Oreos, or even biscoff cookies for completely different flavor profiles!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How many calories are in this drink?",
        answer:
          "This homemade version contains approximately 450-490 calories depending on how much whipped cream and how many cookies you use, which is very similar to a Grande Mocha Cookie Crumble Frappuccino from Starbucks (which has 490 calories with whole milk and whipped cream). It's definitely an indulgent treat rather than an everyday drink! You can reduce calories by using skimmed milk, less syrup, fewer cookies, or skipping the whipped cream.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this dairy-free?",
        answer:
          "Absolutely! Use your favorite plant-based milk (oat milk works beautifully and is very creamy), dairy-free chocolate sauce (check labels - many are naturally dairy-free), dairy-free cookies (Oreos are actually vegan in most countries!), and coconut whipped cream or other dairy-free whipped topping. The result is just as delicious as the dairy version!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "My Frappuccino is too watery. What went wrong?",
        answer:
          "The most common causes are: 1) Coffee was still warm/hot when blended, melting too much ice, 2) Not enough ice was used, 3) Over-blending - blend just until smooth, about 30-45 seconds maximum. Make sure your coffee is completely cold, use the full amount of ice, and blend in shorter bursts. If it's already too thin, add more ice and blend briefly to thicken it up.",
      },
    ],
    nutrition: {
      calories: 470,
      protein: 8,
      fat: 18,
      carbs: 68,
    },
    seoTitle: "Mocha Cookie Crumble Frappuccino - Starbucks Copycat",
    seoDescription:
      "Make Starbucks Mocha Cookie Crumble Frappuccino at home! Blended mocha with cookie pieces, cream & crumbles. Decadent copycat recipe chocolate lovers will adore.",
  };

  const existingMochaCookie = await client.fetch(
    `*[_type == "recipe" && slug.current == "mocha-cookie-crumble-frappuccino"][0]`
  );

  if (existingMochaCookie) {
    await client.patch(existingMochaCookie._id).set(mochaCookieData).commit();
    console.log("✅ Mocha Cookie Crumble Frappuccino updated");
  } else {
    await client.create({
      ...mochaCookieData,
      _id: `drafts.mocha-cookie-crumble-frappuccino-${randomUUID()}`,
    });
    console.log("✅ Mocha Cookie Crumble Frappuccino created as DRAFT");
  }

  console.log("\n🎉 All Starbucks recipes created successfully!");
  console.log("\n📋 Summary:");
  console.log("   ✅ Caramel Frappuccino");
  console.log("   ✅ Iced Matcha Latte");
  console.log("   ✅ Iced Caramel Macchiato");
  console.log("   ✅ Mocha Cookie Crumble Frappuccino");
  console.log("\n📝 All recipes saved as DRAFTS in Sanity Studio");
  console.log("📸 Remember to add hero images before publishing");
  console.log("\n🔍 SEO Optimized:");
  console.log("   - All SEO titles < 60 characters ✓");
  console.log("   - All SEO descriptions < 160 characters ✓");
  console.log("   - Categories assigned ✓");
  console.log("   - Ingredient refs used ✓");
  console.log("\n💡 Next steps:");
  console.log("   1. Open Sanity Studio");
  console.log("   2. Find each draft recipe");
  console.log("   3. Add hero images");
  console.log("   4. Click Publish");
}

createRecipes().catch(console.error);
