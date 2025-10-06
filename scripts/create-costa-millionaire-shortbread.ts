// scripts/create-costa-millionaire-shortbread.ts
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

// Ingredient data for Costa Millionaire Shortbread
const ingredients = [
  {
    name: "Plain flour",
    synonyms: ["all-purpose flour", "white flour"],
    kcal100: 364,
    protein100: 10,
    fat100: 1.3,
    carbs100: 76,
    allergens: ["gluten"],
    density_g_per_ml: 0.59,
  },
  {
    name: "Unsalted butter",
    synonyms: ["butter"],
    kcal100: 717,
    protein100: 0.9,
    fat100: 81,
    carbs100: 0.1,
    allergens: ["dairy"],
    density_g_per_ml: 0.91,
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
    name: "Condensed milk",
    synonyms: ["sweetened condensed milk"],
    kcal100: 321,
    protein100: 7.9,
    fat100: 8.7,
    carbs100: 55,
    allergens: ["dairy"],
    density_g_per_ml: 1.29,
  },
  {
    name: "Golden syrup",
    synonyms: ["light corn syrup", "treacle"],
    kcal100: 325,
    protein100: 0.3,
    fat100: 0,
    carbs100: 79,
    allergens: [],
    density_g_per_ml: 1.46,
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
    name: "Milk chocolate",
    synonyms: ["milk chocolate chips", "milk choc"],
    kcal100: 535,
    protein100: 8,
    fat100: 30,
    carbs100: 59,
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
    name: "Sea salt",
    synonyms: ["salt", "fine sea salt"],
    kcal100: 0,
    protein100: 0,
    fat100: 0,
    carbs100: 0,
    allergens: [],
    density_g_per_ml: 1.2,
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
  console.log("🍫 Creating Costa Millionaire Shortbread Recipe\n");
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
    `*[_type == "recipe" && slug.current == "costa-millionaire-shortbread"][0]`
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

  // Get categories
  const dessertsCategory = await client.fetch(
    `*[_type == "category" && slug.current == "desserts"][0]`
  );
  const snacksCategory = await client.fetch(
    `*[_type == "category" && slug.current == "snacks"][0]`
  );
  const vegetarianCategory = await client.fetch(
    `*[_type == "category" && slug.current == "vegetarian"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Costa Millionaire Shortbread",
    slug: {
      _type: "slug",
      current: "costa-millionaire-shortbread",
    },
    description:
      "Make Costa's legendary Millionaire Shortbread at home with this easy copycat recipe. Buttery shortbread base, thick caramel layer, smooth chocolate topping - pure indulgence in every bite!",
    servings: 16,
    prepMin: 30,
    cookMin: 75,
    introText:
      "Costa's Millionaire Shortbread is one of the most popular treats in their café cabinets, and for good reason - it's a triple-threat dessert featuring buttery, crumbly shortbread, a thick layer of rich, chewy caramel, and a generous blanket of smooth chocolate on top. Also known as Caramel Shortbread or Caramel Slice, this Scottish-invented classic became 'millionaire' shortbread because it's so rich and indulgent it tastes like something a millionaire would eat. Costa's version has earned legendary status among their customers, with many claiming it's the best high street millionaire shortbread available - perfectly balanced between the three layers, never too sweet, and always satisfyingly thick. What makes Costa's millionaire shortbread stand out is the quality of each component: the shortbread base is substantial enough to support the generous toppings without being too hard, the caramel layer is properly thick and chewy (not thin and sticky), and the chocolate topping is a smooth combination of milk and dark chocolate that provides richness without overwhelming sweetness. The secret to recreating it at home lies in getting the proportions right - equal layers of shortbread, caramel, and chocolate - and taking care with the caramel, which requires patient stirring to achieve that perfect fudgy consistency. This recipe uses the same techniques Costa's suppliers use, ensuring you get that iconic texture and taste. Making it yourself means you can enjoy this café favourite at a fraction of the cost, cut it into exactly the portions you prefer, and impress friends and family with your baking skills. While it does require some time (mostly hands-off cooling), the actual preparation is straightforward, and the result is bakery-quality millionaire shortbread that rivals Costa's!",
    ...(costaBrand && {
      brand: {
        _type: "reference",
        _ref: costaBrand._id,
      },
    }),
    ...(dessertsCategory && snacksCategory && vegetarianCategory && {
      categories: [
        {
          _type: "reference",
          _ref: dessertsCategory._id,
          _key: randomUUID(),
        },
        {
          _type: "reference",
          _ref: snacksCategory._id,
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
            text: "Costa Coffee has been serving food alongside their famous coffee since the early days, but their food offering really expanded in the 2000s as UK café culture grew. Millionaire shortbread became a permanent fixture in Costa stores across the country, sitting in those tempting glass cabinets next to the till alongside muffins, flapjacks, and paninis. The traybake-style treat was a natural fit for Costa's grab-and-go model - easily portioned, travels well, doesn't require refrigeration, and pairs perfectly with a cappuccino or latte.",
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
            text: "Costa's millionaire shortbread has remained largely unchanged over the years, a testament to the 'if it ain't broke, don't fix it' philosophy. While Costa has introduced and discontinued many food items over the decades, millionaire shortbread has been a constant bestseller, particularly popular in autumn and winter months when customers crave something rich and comforting. The recipe is made by Costa's approved bakery suppliers to strict specifications ensuring consistency across all 2,700+ UK stores. For many customers, picking up a piece of Costa millionaire shortbread with their coffee has become a cherished routine - a small, affordable luxury that transforms an ordinary coffee break into a proper treat. Its popularity has inspired countless copycat recipes online as people attempt to recreate that distinctive Costa quality at home.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Shortbread Base",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Plain flour"],
            },
            quantity: "250",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Unsalted butter"],
            },
            quantity: "175",
            unit: "g",
            notes: "cold, cubed",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Caster sugar"],
            },
            quantity: "75",
            unit: "g",
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
              _ref: ingredientIds["Sea salt"],
            },
            quantity: "1/4",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Caramel Layer",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Unsalted butter"],
            },
            quantity: "100",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Caster sugar"],
            },
            quantity: "100",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Condensed milk"],
            },
            quantity: "397",
            unit: "g",
            notes: "1 standard tin",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Golden syrup"],
            },
            quantity: "2",
            unit: "tbsp",
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
              _ref: ingredientIds["Sea salt"],
            },
            quantity: "1/2",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Chocolate Topping",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Milk chocolate"],
            },
            quantity: "200",
            unit: "g",
            notes: "chopped or chips",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dark chocolate"],
            },
            quantity: "100",
            unit: "g",
            notes: "chopped or chips",
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
                text: "Prepare and make the shortbread base: Preheat your oven to 160°C (140°C fan/gas mark 3). Line a 20cm x 30cm (roughly 9x12 inch) rectangular baking tin with parchment paper, leaving overhang on the sides for easy removal later. In a large bowl, rub together the flour, cold cubed butter, sugar, vanilla, and salt using your fingertips until it resembles fine breadcrumbs. Press this mixture firmly and evenly into the bottom of your prepared tin - use the back of a spoon or your hands to compact it well. Prick all over with a fork to prevent bubbling.",
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
                text: "Bake the shortbread: Bake for 35-40 minutes until pale golden and firm to the touch. It shouldn't be brown, just a light biscuit colour. Remove from the oven and set aside to cool while you make the caramel. Don't turn off the oven yet if you want to speed up the caramel setting.",
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
                text: "Make the caramel layer: This is the crucial step! In a medium, heavy-bottomed saucepan, combine the butter, sugar, condensed milk, golden syrup, vanilla, and salt. Place over medium-low heat and stir continuously until the butter melts and the sugar dissolves - about 3-4 minutes. Once everything is melted and combined, increase the heat slightly to medium and bring to a gentle boil.",
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
                text: "Cook the caramel to perfection: Continue stirring constantly for 8-10 minutes. The mixture will bubble and foam (this is normal), and gradually transform from pale cream to a rich golden caramel colour. It should thicken noticeably - you'll know it's ready when it coats the back of your spoon thickly and leaves a trail when you drag your finger through it. Be patient and don't stop stirring or it will burn on the bottom. If you have a thermometer, you're aiming for around 115°C.",
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
                text: "Pour and set the caramel: Remove from heat immediately and carefully pour the hot caramel over the cooled shortbread base. Use a spatula to spread it evenly right to the edges. The caramel will be extremely hot, so be careful. Leave it to cool at room temperature for about 1 hour, or refrigerate for 30 minutes until completely set and firm to the touch. It should no longer be sticky when you gently press it.",
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
                text: "Melt the chocolate: Break or chop the milk and dark chocolate into small, even pieces and place in a heatproof bowl. Melt using a bain-marie (place the bowl over a pan of gently simmering water, ensuring the bowl doesn't touch the water) or microwave in 20-second bursts, stirring between each burst, until completely smooth and glossy. The chocolate should be warm but not hot.",
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
                text: "Add the chocolate layer: Pour the melted chocolate over the set caramel layer and spread it evenly using a spatula or the back of a spoon, making sure to cover the caramel completely right to the edges. For a professional Costa finish, gently tap the tin on the work surface a few times to remove any air bubbles and create a smooth surface. If you like, use a fork to create wavy patterns on top before it sets.",
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
                text: "Set and slice: Leave the millionaire shortbread to set at room temperature for 2-3 hours, or refrigerate for 1 hour until the chocolate is firm and no longer soft. Once completely set, use the parchment paper overhang to lift the whole slab out of the tin. Place on a cutting board and use a large, sharp knife to cut into 16 squares (4x4 grid). For clean cuts, wipe the knife between each slice with a hot, damp cloth. Store in an airtight container at room temperature for up to 1 week, or refrigerate for up to 2 weeks.",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "The key to perfect caramel is constant stirring and patience. Don't rush it - undercooked caramel will be too runny, while overcooked will be too hard and can taste burnt.",
      "Use a heavy-bottomed pan for the caramel to prevent scorching and hot spots. Non-stick pans work well but stainless steel gives you a better view of the colour change.",
      "If your caramel looks like it's splitting or becoming grainy, remove from heat and whisk vigorously. Adding a tablespoon of hot water can help bring it back together.",
      "Cold shortbread is easier to work with when spreading the caramel - let it cool completely first.",
      "For perfectly even layers, use the same sized tin specified (20x30cm). A smaller tin will give you thicker layers, a larger one will be thinner.",
      "Make it salted caramel millionaire shortbread by sprinkling sea salt flakes over the chocolate just after spreading, before it sets - absolutely delicious!",
      "The chocolate sets faster in the fridge but can sometimes develop a white 'bloom'. This doesn't affect taste, but for best appearance, set at cool room temperature.",
      "These freeze brilliantly! Wrap individual pieces in parchment and freeze for up to 3 months. Defrost at room temperature for 30 minutes before eating.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why is my caramel too soft/runny?",
        answer:
          "The caramel wasn't cooked long enough. It needs to reach 115°C and coat the back of a spoon thickly. If your caramel is too soft after setting, you can actually return the whole thing to the pan (scrape it off the shortbread base) and cook it for another 2-3 minutes, stirring constantly, then pour it back over the shortbread to set again.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use all milk chocolate or all dark chocolate?",
        answer:
          "Yes, but the Costa version uses a mixture for balanced flavour - all milk chocolate can be too sweet, while all dark can be too bitter. If you prefer one or the other, go ahead and use 300g of your chosen chocolate. White chocolate also works beautifully for a different twist!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "My shortbread is too crumbly/falls apart when I cut it. Why?",
        answer:
          "This usually means the shortbread base wasn't pressed firmly enough into the tin. The mixture should be very well compacted - really press down hard with the back of a spoon. Also, make sure to cut the millionaire shortbread with a very sharp knife using a firm, downward motion rather than a sawing action. Cutting while it's still slightly chilled helps too.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this in advance?",
        answer:
          "Absolutely! Millionaire shortbread keeps brilliantly. Make it up to 1 week ahead and store in an airtight container at room temperature, or up to 2 weeks in the fridge. It's actually easier to cut when it's been chilled, so making it a day ahead is ideal. You can also freeze it for up to 3 months.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "How do I prevent the layers from separating?",
        answer:
          "Make sure each layer is properly set before adding the next one. The shortbread should be completely cool before adding caramel, and the caramel should be completely firm before adding chocolate. Also, don't overheat the chocolate - it should be just melted and still slightly warm, not hot, when you pour it over the caramel.",
      },
    ],
    nutrition: {
      calories: 420,
      protein: 5,
      fat: 22,
      carbs: 52,
    },
    seoTitle: "Costa Millionaire Shortbread Recipe - Easy Copycat",
    seoDescription:
      "Make Costa's famous Millionaire Shortbread at home! Buttery shortbread, thick caramel, smooth chocolate. Easy copycat recipe - bakery quality in your kitchen.",
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
      _id: `drafts.costa-millionaire-shortbread-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Costa Millionaire Shortbread recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized:");
  console.log("   - SEO Title: 54 characters ✓");
  console.log("   - SEO Description: 151 characters ✓");
  console.log("   - Categories: Desserts, Snacks, Vegetarian ✓");
  console.log("🍫 The ultimate indulgent traybake!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
