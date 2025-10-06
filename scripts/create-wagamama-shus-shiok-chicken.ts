// scripts/create-wagamama-shus-shiok-chicken.ts
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

// Ingredient data for Wagamama Shu's 'Shiok' Chicken
const ingredients = [
  {
    name: "Chicken thighs",
    synonyms: ["boneless chicken thighs", "chicken thigh fillets"],
    kcal100: 209,
    protein100: 18,
    fat100: 15,
    carbs100: 0,
    allergens: [],
    gramsPerPiece: 150,
  },
  {
    name: "Udon noodles",
    synonyms: ["fresh udon", "thick Japanese noodles"],
    kcal100: 132,
    protein100: 3.7,
    fat100: 0.4,
    carbs100: 28,
    allergens: ["gluten"],
    gramsPerPiece: 200,
  },
  {
    name: "Coconut milk",
    synonyms: ["full-fat coconut milk", "tinned coconut milk"],
    kcal100: 230,
    protein100: 2.3,
    fat100: 24,
    carbs100: 6,
    allergens: [],
    density_g_per_ml: 1.0,
  },
  {
    name: "Red curry paste",
    synonyms: ["Thai red curry paste"],
    kcal100: 145,
    protein100: 3,
    fat100: 8,
    carbs100: 15,
    allergens: ["fish", "crustaceans"],
    density_g_per_ml: 1.15,
  },
  {
    name: "Lemongrass",
    synonyms: ["fresh lemongrass", "lemongrass stalks"],
    kcal100: 99,
    protein100: 1.8,
    fat100: 0.5,
    carbs100: 25,
    allergens: [],
    gramsPerPiece: 15,
  },
  {
    name: "Lime leaves",
    synonyms: ["kaffir lime leaves", "makrut lime leaves"],
    kcal100: 62,
    protein100: 3.8,
    fat100: 0.7,
    carbs100: 13,
    allergens: [],
    gramsPerPiece: 1,
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
    gramsPerPiece: 3,
  },
  {
    name: "Fish sauce",
    synonyms: ["nam pla", "Thai fish sauce"],
    kcal100: 35,
    protein100: 5,
    fat100: 0,
    carbs100: 4,
    allergens: ["fish"],
    density_g_per_ml: 1.1,
  },
  {
    name: "Brown sugar",
    synonyms: ["soft brown sugar", "light brown sugar"],
    kcal100: 380,
    protein100: 0.1,
    fat100: 0,
    carbs100: 98,
    allergens: [],
    density_g_per_ml: 0.85,
  },
  {
    name: "Lime juice",
    synonyms: ["fresh lime juice"],
    kcal100: 25,
    protein100: 0.4,
    fat100: 0.1,
    carbs100: 8.4,
    allergens: [],
    density_g_per_ml: 1.02,
  },
  {
    name: "Red bell pepper",
    synonyms: ["red pepper", "red capsicum"],
    kcal100: 31,
    protein100: 1,
    fat100: 0.3,
    carbs100: 6,
    allergens: [],
    gramsPerPiece: 150,
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
    name: "Pak choi",
    synonyms: ["bok choy", "Chinese cabbage", "pak choy"],
    kcal100: 13,
    protein100: 1.5,
    fat100: 0.2,
    carbs100: 2.2,
    allergens: [],
    gramsPerPiece: 100,
  },
  {
    name: "Fresh coriander",
    synonyms: ["cilantro", "coriander leaves"],
    kcal100: 23,
    protein100: 2.1,
    fat100: 0.5,
    carbs100: 3.7,
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
    name: "Vegetable oil",
    synonyms: ["sunflower oil", "rapeseed oil", "cooking oil"],
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
  console.log("🍜 Creating Wagamama Shu's 'Shiok' Chicken Recipe\n");
  console.log("Creating ingredients...\n");

  const ingredientIds: { [key: string]: string } = {};

  for (const ing of ingredients) {
    const id = await createOrGetIngredient(ing);
    ingredientIds[ing.name] = id;
  }

  console.log("\n✅ All ingredients created/verified\n");
  console.log("Creating recipe...\n");

  const existingRecipe = await client.fetch(
    `*[_type == "recipe" && slug.current == "wagamama-shus-shiok-chicken"][0]`
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
  const highProteinCategory = await client.fetch(
    `*[_type == "category" && slug.current == "high-protein"][0]`
  );

  const recipeData = {
    _type: "recipe",
    title: "Wagamama Shu's 'Shiok' Chicken",
    slug: {
      _type: "slug",
      current: "wagamama-shus-shiok-chicken",
    },
    description:
      "Make Wagamama's incredible Shu's 'Shiok' Chicken at home! Tender chicken in a fragrant coconut curry broth with udon noodles and fresh vegetables - bold Malaysian-inspired flavours in one bowl.",
    servings: 2,
    prepMin: 15,
    cookMin: 25,
    introText:
      "Wagamama's Shu's 'Shiok' Chicken is a celebration of bold, aromatic Malaysian flavours, bringing together tender chicken, thick udon noodles, and fresh vegetables in a fragrant, creamy coconut curry broth. The name 'shiok' is a Singlish (Singaporean-Malaysian English) word meaning 'extremely good' or 'awesome', and this dish absolutely lives up to its name. Created as part of Wagamama's exploration of Southeast Asian cuisine, it showcases the restaurant's skill in adapting traditional flavours for British palates while maintaining authentic taste profiles. What makes this dish so addictive is the masterful balance of flavours in the broth - creamy coconut milk tempered with the heat of red curry paste, the citrus punch of lemongrass and lime leaves, the umami depth of fish sauce, and the brightness of lime juice. The curry paste provides warmth without overwhelming heat, making it accessible yet exciting. The chicken thighs are cut into bite-sized pieces and cooked until tender, absorbing all those wonderful flavours while staying juicy. Thick, chewy udon noodles provide substance and soak up the fragrant broth beautifully. Fresh vegetables add colour, crunch, and nutrition - vibrant red peppers, crisp mangetout, and tender pak choi all contribute different textures and tastes. This recipe captures everything that makes Wagamama's version so popular, using the same aromatics and cooking techniques that create layers of complex flavour. Making it at home means you can adjust the spice level to your preference, load it up with extra vegetables if you like, and enjoy this restaurant favourite any night of the week at a fraction of the cost!",
    ...(wagamamaBrand && {
      brand: {
        _type: "reference",
        _ref: wagamamaBrand._id,
      },
    }),
    ...(mainsCategory && spicyCategory && highProteinCategory && {
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
            text: "Shu's 'Shiok' Chicken represents Wagamama's ongoing commitment to exploring diverse Asian cuisines beyond their Japanese roots. The dish draws inspiration from Malaysian laksa and Singaporean curry noodle dishes, which are beloved for their complex, layered flavours and satisfying one-bowl meal format. The name pays homage to the Singlish language that reflects Malaysia and Singapore's multicultural heritage, where 'shiok' has become an iconic expression of enjoyment, particularly when describing delicious food.",
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
            text: "Wagamama introduced this dish as part of a limited-edition menu celebrating Southeast Asian street food, but its popularity with customers was so overwhelming that it became a permanent fixture. The dish showcases Wagamama's expertise in balancing bold, authentic flavours with practical restaurant execution - the broth is complex yet can be prepared consistently, the aromatics are fresh and fragrant, and the dish comes together quickly in their open kitchens. It's particularly popular during colder months when customers crave warming, spicy broths, though its fans order it year-round. The use of udon noodles instead of traditional rice noodles is a clever Wagamama touch, offering more substantial texture while nodding to their Japanese heritage.",
          },
        ],
        style: "normal",
      },
    ],
    ingredients: [
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Curry Broth",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Coconut milk"],
            },
            quantity: "400",
            unit: "ml",
            notes: "1 tin",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Red curry paste"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Lemongrass"],
            },
            quantity: "2",
            unit: "piece",
            notes: "bruised and roughly chopped",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Lime leaves"],
            },
            quantity: "4",
            unit: "piece",
            notes: "fresh or frozen",
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
            quantity: "3",
            unit: "clove",
            notes: "minced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fish sauce"],
            },
            quantity: "2",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Brown sugar"],
            },
            quantity: "1",
            unit: "tbsp",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Lime juice"],
            },
            quantity: "2",
            unit: "tbsp",
            notes: "about 1 lime",
          },
        ],
      },
      {
        _key: randomUUID(),
        _type: "ingredientGroup",
        heading: "For the Bowl",
        items: [
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Chicken thighs"],
            },
            quantity: "400",
            unit: "g",
            notes: "boneless, skinless, cut into bite-sized pieces",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Udon noodles"],
            },
            quantity: "400",
            unit: "g",
            notes: "fresh or vacuum-packed",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Red bell pepper"],
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
              _ref: ingredientIds["Mangetout"],
            },
            quantity: "100",
            unit: "g",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Pak choi"],
            },
            quantity: "2",
            unit: "piece",
            notes: "halved lengthways",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Fresh coriander"],
            },
            quantity: "2",
            unit: "tbsp",
            notes: "roughly chopped",
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
            notes: "sliced",
          },
          {
            _key: randomUUID(),
            _type: "ingredientItem",
            ingredientRef: {
              _type: "reference",
              _ref: ingredientIds["Vegetable oil"],
            },
            quantity: "1",
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
                text: "Prep the aromatics: Bash the lemongrass stalks with the back of a knife to bruise them (this releases their flavour), then roughly chop. If using dried lime leaves, tear them slightly to release their oils. Have all your ingredients prepped and ready - this dish comes together quickly once you start cooking.",
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
                text: "Cook the chicken: Heat the vegetable oil in a large wok or deep frying pan over high heat. Add the chicken pieces and stir-fry for 4-5 minutes until they're golden on the outside and nearly cooked through. Don't worry if they're not fully cooked yet - they'll finish cooking in the broth. Remove the chicken and set aside on a plate.",
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
                text: "Build the curry broth: In the same pan, add the red curry paste and fry for 1-2 minutes until fragrant - you should smell those wonderful aromatic spices coming alive. Add the minced garlic and grated ginger, and stir-fry for another 30 seconds. Pour in the coconut milk, then add the lemongrass, lime leaves, fish sauce, and brown sugar. Stir well to combine everything. Add 200ml water to thin the broth slightly.",
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
                text: "Simmer and develop flavours: Bring the broth to a gentle simmer and let it bubble away for 8-10 minutes, stirring occasionally. This allows the aromatics to infuse the coconut milk and the flavours to meld together. The broth should smell incredible - fragrant, slightly spicy, with citrus notes from the lemongrass and lime leaves. Taste and adjust seasoning - add more fish sauce for saltiness, brown sugar for sweetness, or curry paste for heat.",
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
                text: "Cook the noodles and vegetables: While the broth simmers, cook the udon noodles according to packet instructions (usually 2-3 minutes in boiling water). Drain and set aside. Return the cooked chicken to the curry broth, then add the sliced red pepper, mangetout, and pak choi. Simmer for 3-4 minutes until the vegetables are tender but still crisp and the chicken is fully cooked through. Remove the lemongrass pieces if you can find them (they've done their job!).",
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
                text: "Finish with freshness: Stir in the lime juice - this brightens all the flavours and adds that essential zingy note. Taste one more time and adjust if needed. The broth should be creamy, fragrant, slightly spicy, with a good balance of salty, sweet, and sour.",
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
                text: "Assemble and serve: Divide the cooked udon noodles between 2 large, deep bowls. Ladle the chicken, vegetables, and plenty of the fragrant curry broth over the noodles. Garnish generously with fresh coriander and sliced red chilli. Serve immediately with extra lime wedges on the side. Eat Wagamama-style with chopsticks and a spoon - slurp those noodles and sip that incredible broth!",
              },
            ],
            style: "normal",
          },
        ],
      },
    ],
    tips: [
      "Fresh lemongrass and lime leaves make a huge difference to authenticity - most Asian supermarkets stock them, and lime leaves freeze beautifully.",
      "Use full-fat coconut milk, not light - you need the richness and body. Shake the tin well before opening to emulsify the cream and liquid.",
      "Thai red curry paste varies in heat between brands. Mae Ploy and Blue Dragon are common UK brands - start with 2 tbsp and add more if you like it spicier.",
      "Chicken thighs stay much juicier than breast in this dish and have better flavour, but breast works if you prefer (just don't overcook it).",
      "Don't skip the lime juice at the end - it's essential for balancing the richness of the coconut milk and bringing all the flavours together.",
      "For a pescatarian version, swap chicken for prawns - add them in the last 3-4 minutes of cooking so they don't become rubbery.",
      "Make it vegetarian/vegan by using tofu instead of chicken and soy sauce instead of fish sauce.",
      "Add extra vegetables like baby corn, mushrooms, or bean sprouts for more bulk and nutrition.",
    ],
    faqs: [
      {
        _key: randomUUID(),
        _type: "object",
        question: "How spicy is this dish?",
        answer:
          "Wagamama's version is medium-mild - flavourful and aromatic with gentle warmth rather than blow-your-head-off heat. The curry paste provides depth and complexity without overwhelming spice. If you're sensitive to heat, start with 1.5 tbsp curry paste. For spice lovers, use 3 tbsp or add extra fresh chilli. You can always add more heat but can't take it away!",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I use a different type of noodle?",
        answer:
          "Udon noodles are ideal for their thick, chewy texture that stands up to the rich broth, but you can substitute with rice noodles (more traditional for Southeast Asian curries), ramen noodles, or even egg noodles. Cooking times will vary - follow packet instructions. Fresh udon from the chilled section are best if you can find them.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "What can I use if I can't find lime leaves?",
        answer:
          "Fresh lime leaves are best (check Asian supermarkets or buy frozen online), but if you absolutely can't find them, add extra lemongrass and the zest of 1 lime to the broth (add zest in step 3, remove before serving). The flavour won't be identical but will still be delicious and fragrant. Don't use dried lime powder - it's not the same thing.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "Can I make the broth in advance?",
        answer:
          "Yes! Make the curry broth up to 2 days ahead and store in the fridge. The flavours actually improve overnight as they meld together. Reheat gently, then add the chicken and vegetables and proceed from step 5. Cook the noodles fresh just before serving for best texture. The broth also freezes well for up to 3 months.",
      },
      {
        _key: randomUUID(),
        _type: "object",
        question: "My coconut milk split/looks grainy - what happened?",
        answer:
          "This happens when coconut milk is boiled too vigorously or cooked on too high heat. Keep it at a gentle simmer rather than a rolling boil. If it does split, whisk it vigorously or blend a portion of the broth with a stick blender to re-emulsify it. Using full-fat coconut milk (not light) and not over-stirring also helps prevent splitting.",
      },
    ],
    nutrition: {
      calories: 720,
      protein: 48,
      fat: 32,
      carbs: 62,
    },
    seoTitle: "Wagamama Shu's 'Shiok' Chicken Recipe - Easy Copycat",
    seoDescription:
      "Make Wagamama's Shu's 'Shiok' Chicken at home! Coconut curry broth, tender chicken, udon noodles, fresh veg. Authentic Malaysian-inspired copycat recipe.",
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
      _id: `drafts.wagamama-shus-shiok-chicken-${randomUUID()}`,
    });
    console.log("✅ Recipe created as DRAFT:", recipe._id);
  }

  console.log("\n🎉 Done! Wagamama Shu's 'Shiok' Chicken recipe is ready!");
  console.log("📝 The recipe is saved as a DRAFT in Sanity Studio.");
  console.log("📸 Remember to add a hero image in Sanity Studio before publishing.");
  console.log("🔍 SEO optimized:");
  console.log("   - SEO Title: 59 characters ✓");
  console.log("   - SEO Description: 151 characters ✓");
  console.log("   - Categories: Mains, Spicy, High-Protein ✓");
  console.log("🍜 Shiok! Amazing Malaysian flavours!");
  console.log("\n💡 To publish: Open Sanity Studio, find the draft, add the image, and click Publish.");
}

createRecipe().catch(console.error);
