// scripts/create-pizza-express-american-hot.ts
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

// Ingredient data for Pizza Express American Hot
const ingredients = [
  // For the pizza dough
  {
    name: "Pizza dough",
    synonyms: ["pizza base", "bread dough"],
    kcal100: 266,
    protein100: 9,
    fat100: 3.5,
    carbs100: 49,
    allergens: ["gluten"],
  },
  // For the sauce
  {
    name: "Passata",
    synonyms: ["tomato passata", "sieved tomatoes"],
    kcal100: 33,
    protein100: 1.4,
    fat100: 0.3,
    carbs100: 6.5,
    allergens: [],
    density_g_per_ml: 1.05,
  },
  {
    name: "Dried oregano",
    synonyms: ["oregano"],
    kcal100: 265,
    protein100: 9,
    fat100: 4.3,
    carbs100: 69,
    allergens: [],
  },
  // For the toppings
  {
    name: "Mozzarella cheese",
    synonyms: ["fresh mozzarella", "pizza mozzarella"],
    kcal100: 280,
    protein100: 18,
    fat100: 22,
    carbs100: 3.1,
    allergens: ["dairy"],
  },
  {
    name: "Pepperoni",
    synonyms: ["pepperoni slices", "spicy salami"],
    kcal100: 504,
    protein100: 22,
    fat100: 44,
    carbs100: 1.2,
    allergens: [],
  },
  {
    name: "Jalapeños",
    synonyms: ["jalapeño peppers", "pickled jalapeños", "green chillies"],
    kcal100: 29,
    protein100: 0.9,
    fat100: 0.4,
    carbs100: 6.5,
    allergens: [],
  },
  {
    name: "Tomato",
    synonyms: ["fresh tomato", "tomatoes"],
    kcal100: 18,
    protein100: 0.9,
    fat100: 0.2,
    carbs100: 3.9,
    allergens: [],
    gramsPerPiece: 100,
  },
  {
    name: "Red chilli flakes",
    synonyms: ["crushed red pepper", "chilli flakes", "red pepper flakes"],
    kcal100: 318,
    protein100: 12,
    fat100: 17,
    carbs100: 57,
    allergens: [],
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
    `*[_type == "recipe" && slug.current == "pizza-express-american-hot"][0]`
  );

  if (existingRecipe) {
    console.log("⚠️  Recipe already exists! Updating instead...");
  }

  const recipeData = {
    _type: "recipe",
    title: "Pizza Express American Hot",
    slug: {
      _type: "slug",
      current: "pizza-express-american-hot",
    },
    description:
      "Recreate Pizza Express's legendary American Hot pizza at home. A fiery combination of pepperoni, jalapeños, and mozzarella on a crispy base with that signature spicy kick.",
    servings: 2,
    prepMin: 20,
    cookMin: 12,
    introText:
      "The Pizza Express American Hot is a classic favorite that's been on their menu for decades. This spicy pizza combines the rich flavor of pepperoni with the heat of jalapeños and a generous helping of melted mozzarella cheese, all on Pizza Express's signature thin and crispy base. With a simple tomato sauce base and a finishing touch of red chilli flakes, this pizza delivers authentic restaurant flavor that's surprisingly easy to recreate at home. Whether you're a longtime fan or discovering it for the first time, this copycat recipe captures the essence of what makes the American Hot so popular.",
    brandContext: [
      {
        _key: randomUUID(),
        _type: "block",
        children: [
          {
            _key: randomUUID(),
            _type: "span",
            text: "Pizza Express has been a cornerstone of British casual dining since 1965, bringing authentic Italian pizza to the UK high street. The American Hot has been a menu staple for years, representing the perfect fusion of Italian pizza-making tradition with bold American flavors.",
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
            text: "What sets Pizza Express pizzas apart is their thin, crispy base - achieved through traditional stone-baking at high temperatures. The American Hot showcases this perfectly, with its simple but flavorful toppings that complement rather than overwhelm the excellent base. This recipe recreates that authentic Pizza Express experience, from the slightly charred crust to the perfectly balanced heat level.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Base",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Pizza dough"],
            },
            quantity: "400",
            unit: "g",
            notes: "room temperature, or 2 x 200g pizza bases",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Sauce",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Passata"],
            },
            quantity: "150",
            unit: "ml",
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
            notes: "crushed",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Dried oregano"],
            },
            quantity: "1",
            unit: "tsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fine sea salt"],
            },
            quantity: "0.5",
            unit: "tsp",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Toppings",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Mozzarella cheese"],
            },
            quantity: "250",
            unit: "g",
            notes: "torn or grated",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Pepperoni"],
            },
            quantity: "100",
            unit: "g",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Jalapeños"],
            },
            quantity: "50",
            unit: "g",
            notes: "sliced, from a jar",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Tomato"],
            },
            quantity: "1",
            unit: "piece",
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Red chilli flakes"],
            },
            quantity: "1",
            unit: "tsp",
            notes: "to finish",
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
                text: "Preheat your oven to its maximum temperature (usually 240-260°C/475-500°F/Gas 9) with a pizza stone or baking tray inside. The hotter the oven, the better the crispy base - this is key to achieving that Pizza Express texture.",
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
                text: "Make the sauce by mixing the passata with crushed garlic, dried oregano, and salt in a small bowl. Stir well and set aside.",
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
                text: "Divide the dough into 2 equal portions (if using fresh dough). On a lightly floured surface, roll each portion out as thinly as possible into a 25-30cm circle. Pizza Express pizzas are known for their thin, crispy base, so don't be afraid to roll it very thin.",
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
                text: "Place the rolled dough on a piece of baking parchment. Spread half the tomato sauce evenly over the base, leaving a 1cm border around the edge for the crust.",
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
                text: "Scatter over half the mozzarella, then distribute half the pepperoni slices evenly across the pizza. Add the sliced tomatoes and jalapeños, spreading them out to ensure every slice gets some heat.",
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
                text: "Carefully transfer the pizza (on its parchment) to the preheated pizza stone or baking tray. Bake for 10-12 minutes until the crust is golden brown and slightly charred in spots, and the cheese is bubbling.",
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
                text: "Remove from the oven and immediately sprinkle with red chilli flakes for that extra kick. Let it rest for 1-2 minutes before slicing.",
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
                text: "Repeat with the second pizza. Serve hot and enjoy your homemade Pizza Express American Hot!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "For an even crispier base, brush the edge of the crust with a little olive oil before baking.",
      "If you don't have a pizza stone, flip a baking tray upside down and preheat that instead - it works almost as well.",
      "Make the dough from scratch using the Pizza Express Dough Balls recipe for ultimate authenticity.",
      "Adjust the jalapeño quantity to your heat preference - Pizza Express uses a moderate amount, but you can add more or less.",
      "For a smoky flavor boost, add a pinch of smoked paprika to your tomato sauce.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use a different type of cheese?",
        answer:
          "Mozzarella is essential for that authentic Pizza Express taste, but you can add a small amount of cheddar or parmesan for extra flavor. Avoid using only cheddar as it doesn't melt the same way.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What if I can't find pepperoni?",
        answer:
          "You can substitute with chorizo or spicy Italian salami. Both will give you a similar spicy, cured meat flavor, though the taste will be slightly different from the original.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make this pizza in advance?",
        answer:
          "You can prepare the dough and sauce ahead of time and store them in the fridge (dough up to 24 hours, sauce up to 3 days). However, assemble and bake the pizza fresh for the best results. Leftover pizza reheats well in a hot oven or frying pan.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Why is my pizza base soggy?",
        answer:
          "This usually happens if the oven isn't hot enough or if you've added too much sauce/toppings. Make sure your oven is fully preheated to maximum temperature, use a thin layer of sauce, and don't overload with toppings.",
      },
    ],
    nutrition: {
      calories: 580,
      protein: 28,
      fat: 26,
      carbs: 58,
    },
    seoTitle: "Pizza Express American Hot Recipe - Copycat Pizza at Home",
    seoDescription:
      "Make Pizza Express American Hot pizza at home! This spicy copycat recipe features pepperoni, jalapeños, and mozzarella on a crispy thin base. Restaurant-quality results.",
  };

  if (existingRecipe) {
    const updated = await client
      .patch(existingRecipe._id)
      .set(recipeData)
      .commit();
    console.log("✅ Recipe updated:", updated._id);
  } else {
    const recipe = await client.create(recipeData);
    console.log("✅ Recipe created:", recipe._id);
  }

  console.log("\n🎉 Done! Pizza Express American Hot recipe is ready!");
  console.log("📝 The recipe is SEO-optimized and ready to publish.");
  console.log("\nNote: You'll need to add a hero image in Sanity Studio.");
}

createRecipe().catch(console.error);
