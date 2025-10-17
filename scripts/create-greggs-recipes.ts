import { createClient } from '@sanity/client';

const client = createClient({
  projectId: '6yu50an1',
  dataset: 'production',
  apiVersion: '2025-09-24',
  token: process.env.SANITY_WRITE_TOKEN,
  useCdn: false,
});

async function createIngredientIfNotExists(name: string, allergens: string[] = []) {
  // Check if ingredient exists
  const existing = await client.fetch(`*[_type == "ingredient" && name == $name][0]`, { name });

  if (existing) {
    console.log(`✓ Ingredient "${name}" already exists (${existing._id})`);
    return existing._id;
  }

  // Create new ingredient
  const newIngredient = await client.create({
    _type: 'ingredient',
    name,
    allergens,
  });

  console.log(`✓ Created ingredient "${name}" (${newIngredient._id})`);
  return newIngredient._id;
}

async function createRecipe(recipeData: any) {
  const result = await client.create(recipeData);
  console.log(`✓ Created recipe "${recipeData.title}" (${result._id})`);
  return result;
}

async function main() {
  try {
    console.log('Creating ingredients...\n');

    // Create all required ingredients
    const puffPastryId = await createIngredientIfNotExists('Puff Pastry', ['Gluten', 'Milk']);
    const chickenStockId = await createIngredientIfNotExists('Chicken Stock');
    const cornflourId = await createIngredientIfNotExists('Cornflour');
    const creamCheeseId = await createIngredientIfNotExists('Cream Cheese', ['Milk']);
    const doubleCreamId = await createIngredientIfNotExists('Double Cream', ['Milk']);
    const oreganoId = await createIngredientIfNotExists('Oregano');
    const bakedBeansId = await createIngredientIfNotExists('Baked Beans');
    const sausagesId = await createIngredientIfNotExists('Pork Sausages', ['Gluten']);
    const cheddarCheeseId = await createIngredientIfNotExists('Cheddar Cheese', ['Milk']);
    const quornPiecesId = await createIngredientIfNotExists('Quorn Pieces', ['Egg']);
    const chestnutMushroomsId = await createIngredientIfNotExists('Chestnut Mushrooms');
    const redWineId = await createIngredientIfNotExists('Red Wine');
    const marmiteId = await createIngredientIfNotExists('Marmite', ['Gluten']);
    const vegStockId = await createIngredientIfNotExists('Vegetable Stock');
    const plainFlourId = await createIngredientIfNotExists('Plain Flour', ['Gluten']);
    const yeastId = await createIngredientIfNotExists('Dried Yeast');
    const tomatoPureeId = await createIngredientIfNotExists('Tomato Puree');
    const mozzarellaId = await createIngredientIfNotExists('Mozzarella Cheese', ['Milk']);
    const pepperoniId = await createIngredientIfNotExists('Pepperoni', ['Gluten']);
    const jalapenosId = await createIngredientIfNotExists('Jalapeños');
    const chickenBreastId = await createIngredientIfNotExists('Chicken Breast');
    const onionId = await createIngredientIfNotExists('Onion');
    const garlicId = await createIngredientIfNotExists('Garlic');
    const saltId = await createIngredientIfNotExists('Salt');
    const blackPepperId = await createIngredientIfNotExists('Black Pepper');
    const oliveOilId = await createIngredientIfNotExists('Olive oil');
    const celeryId = await createIngredientIfNotExists('Celery');
    const redOnionId = await createIngredientIfNotExists('Red Onion');
    const choppedTomatoesId = await createIngredientIfNotExists('Chopped Tomatoes (tinned)');
    const eggId = await createIngredientIfNotExists('Egg');
    const sugarId = await createIngredientIfNotExists('Sugar');
    const soySauceId = await createIngredientIfNotExists('Soy Sauce');
    const lemonJuiceId = await createIngredientIfNotExists('Lemon Juice');

    // Get brand and categories
    const greggsBrand = await client.fetch(`*[_type == "brand" && slug.current == "greggs"][0]`);
    const categories = await client.fetch(`*[_type == "category" && slug.current in ["mains", "snacks", "breakfast", "vegan", "vegetarian", "spicy"]]`);
    const mainsCategory = categories.find((c: any) => c.slug.current === 'mains');
    const snacksCategory = categories.find((c: any) => c.slug.current === 'snacks');
    const breakfastCategory = categories.find((c: any) => c.slug.current === 'breakfast');
    const veganCategory = categories.find((c: any) => c.slug.current === 'vegan');
    const vegetarianCategory = categories.find((c: any) => c.slug.current === 'vegetarian');
    const spicyCategory = categories.find((c: any) => c.slug.current === 'spicy');

    console.log('\n\nCreating recipes...\n');

    // 1. Chicken Bake
    await createRecipe({
      _type: 'recipe',
      title: 'Greggs Chicken Bake',
      slug: { _type: 'slug', current: 'greggs-chicken-bake' },
      description: 'Tender chicken pieces in a creamy sauce with soft cheese, wrapped in golden flaky puff pastry.',
      servings: 8,
      prepMin: 15,
      cookMin: 25,
      introText: 'Recreate Greggs\' iconic Chicken Bake at home with this simple recipe. Featuring succulent chicken in a rich, creamy filling encased in golden puff pastry, these bakes are perfect for lunch or a satisfying snack.',
      brandContext: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'The Greggs Chicken Bake is one of the bakery chain\'s most beloved savoury items. Launched decades ago, it has become a staple for millions of Brits seeking a hearty, warming meal on the go. The combination of tender chicken, creamy sauce, and flaky pastry makes it an irresistible comfort food classic.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      ingredients: [
        {
          _type: 'ingredientGroup',
          heading: 'Main Ingredients',
          items: [
            { ingredientRef: { _type: 'reference', _ref: chickenBreastId }, quantity: '400', unit: 'g', notes: 'diced' },
            { ingredientRef: { _type: 'reference', _ref: garlicId }, quantity: '2', unit: 'cloves', notes: 'minced' },
            { ingredientRef: { _type: 'reference', _ref: oliveOilId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: saltId }, quantity: '1/4', unit: 'tsp', notes: 'or to taste' },
            { ingredientRef: { _type: 'reference', _ref: blackPepperId }, quantity: '1', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: oreganoId }, quantity: '1', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: chickenStockId }, quantity: '250', unit: 'ml', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: cornflourId }, quantity: '2', unit: 'tbsp', notes: 'mixed with 150ml water' },
            { ingredientRef: { _type: 'reference', _ref: doubleCreamId }, quantity: '100', unit: 'ml', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: puffPastryId }, quantity: '2', unit: 'sheets', notes: 'ready-rolled' },
            { ingredientRef: { _type: 'reference', _ref: eggId }, quantity: '1', unit: 'piece', notes: 'beaten, for egg wash' },
          ],
        },
      ],
      steps: [
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Sauté minced garlic in olive oil for 1-2 minutes. Add diced chicken breast with salt, black pepper, and oregano. Cook on medium-high heat for 6-7 minutes until chicken changes colour from pink to white.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Add chicken stock and bring to a simmer. Mix cornflour with cold water to make a slurry, then add to the pan. Stir and cook for 3-4 minutes on medium heat until mixture thickens.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Add double cream (at room temperature), stir well, and remove from heat. Check seasoning and adjust if necessary. Transfer to a bowl and allow to cool completely.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Preheat oven to 190°C (170°C fan). Cut each puff pastry sheet into 4 rectangles (8 total). Place a few tablespoons of chicken filling in the centre of 4 rectangles, leaving a border around the edges.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Top with remaining pastry rectangles and seal edges with a fork. Make diagonal slits on top with a knife to allow steam to escape. Brush with beaten egg.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Bake in preheated oven for 20-25 minutes until golden brown and puffed. Allow to cool for 5 minutes before serving.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      tipsAndTricks: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Cool the filling completely before assembling - this prevents the pastry from becoming soggy and makes it much easier to handle.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Use a fork to firmly seal the edges of the pastry - this creates a tight seal that prevents the filling from leaking during baking.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Make a double batch of the filling and freeze half - it keeps well for up to 3 months and makes assembly much quicker next time.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Don\'t skip the egg wash - it gives that beautiful golden colour and professional bakery finish.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      faqs: [
        {
          question: 'Can I freeze Chicken Bakes?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Yes! You can freeze them either before or after baking. For unbaked: assemble completely, freeze on a tray, then transfer to a freezer bag. Bake from frozen, adding 5-10 minutes to the cooking time. For baked: cool completely, freeze, then reheat in the oven at 180°C for 15-20 minutes.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'Can I use rotisserie chicken instead?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Absolutely! Using pre-cooked rotisserie chicken is a great time-saver. Just dice it up and add it when making the sauce. Since it\'s already cooked, you only need to heat it through (about 2-3 minutes) before adding the cream.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'What if my pastry leaks during baking?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Leaking usually happens if the filling is too hot when assembled or if edges aren\'t sealed properly. Make sure the filling is completely cool, don\'t overfill, and press edges firmly with a fork. If it still leaks, it\'s perfectly fine to eat - just enjoy the extra crispy bits!' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'How should I store leftover Chicken Bakes?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Store in an airtight container in the fridge for up to 3 days. Reheat in the oven at 180°C for 10-15 minutes to crisp up the pastry - avoid the microwave as it makes the pastry soggy.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      nutrition: {
        calories: 380,
        protein: 16,
        fat: 22,
        carbs: 28,
      },
      seoTitle: 'Greggs Chicken Bake Recipe - Easy Copycat',
      seoDescription: 'Make Greggs\' famous Chicken Bake at home! Creamy chicken in flaky puff pastry. Simple ingredients, ready in 40 minutes. Perfect lunch!',
      canonicalUrl: 'https://bitebuddy.co.uk/recipes/greggs-chicken-bake',
      brand: { _type: 'reference', _ref: greggsBrand._id },
      categories: [
        { _type: 'reference', _ref: mainsCategory._id },
        { _type: 'reference', _ref: snacksCategory._id },
      ],
    });

    // 2. Sausage Bean & Cheese Melt
    await createRecipe({
      _type: 'recipe',
      title: 'Greggs Sausage Bean & Cheese Melt',
      slug: { _type: 'slug', current: 'greggs-sausage-bean-cheese-melt' },
      description: 'Pork sausages and baked beans with melted cheddar cheese, all wrapped in golden puff pastry.',
      servings: 4,
      prepMin: 10,
      cookMin: 20,
      introText: 'Bring back Greggs\' legendary Sausage, Bean & Cheese Melt with this easy home recipe. Combining hearty sausages, savoury baked beans, and gooey cheddar in crisp puff pastry, it\'s the ultimate comfort food.',
      brandContext: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'The Greggs Sausage, Bean & Cheese Melt is a fan favourite that has made several comebacks over the years. This British bakery classic brings together breakfast flavours in a convenient handheld package, making it perfect for breakfast on the go or a filling snack any time of day.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      ingredients: [
        {
          _type: 'ingredientGroup',
          heading: 'Main Ingredients',
          items: [
            { ingredientRef: { _type: 'reference', _ref: sausagesId }, quantity: '3', unit: 'pieces', notes: 'deskinned and torn into pieces' },
            { ingredientRef: { _type: 'reference', _ref: bakedBeansId }, quantity: '400', unit: 'g', notes: '1 tin' },
            { ingredientRef: { _type: 'reference', _ref: onionId }, quantity: '1', unit: 'piece', notes: 'finely diced (optional)' },
            { ingredientRef: { _type: 'reference', _ref: cheddarCheeseId }, quantity: '100', unit: 'g', notes: 'grated' },
            { ingredientRef: { _type: 'reference', _ref: puffPastryId }, quantity: '1', unit: 'sheet', notes: 'ready-rolled' },
            { ingredientRef: { _type: 'reference', _ref: eggId }, quantity: '1', unit: 'piece', notes: 'beaten, for egg wash' },
          ],
        },
      ],
      steps: [
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Preheat oven to 180°C (160°C fan, Gas Mark 4). If using onion, fry it in a pan with a little oil until softened, about 3-4 minutes.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Add baked beans to the pan and cook for 5 minutes to reduce the sauce slightly. Add torn sausage pieces and mix well. Remove from heat and allow to cool.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Cut puff pastry sheet into 4 rectangles. On each rectangle, spoon sausage and bean mixture onto one half, leaving a border. Drain excess liquid before adding to avoid soggy pastry.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Top filling with grated cheddar cheese. Fold the empty pastry half over the filling and use a fork to firmly crimp the edges, sealing the melt.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Brush each melt with beaten egg wash. Place on a lined baking tray and bake for 20 minutes until golden brown and piping hot.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      tipsAndTricks: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Drain the beans well before adding to the pastry - excess liquid will make the pastry soggy. You can even simmer them for a few extra minutes to reduce the sauce.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Use good quality sausages with high meat content (at least 80%) for the best flavour and texture.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Don\'t overfill the pastry - leave about 1-2cm border around the edges to allow for proper sealing.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Try using different cheeses like Red Leicester or a mature Cheddar for extra flavour depth.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      faqs: [
        {
          question: 'Can I make a vegetarian version?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Yes! Simply substitute the pork sausages with your favourite vegetarian or vegan sausages. Brands like Linda McCartney or Richmond work brilliantly. Follow the same method - just remove the skins and tear into pieces.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'How do I prevent soggy pastry?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'The key is reducing the liquid in the filling. Cook the beans longer to evaporate excess moisture, drain them well, and let the filling cool completely before assembling. Also, make sure to seal the edges tightly with a fork to prevent any leaks.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'Can I freeze these melts?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Absolutely! Freeze unbaked for best results - assemble completely, place on a tray to freeze individually, then transfer to a freezer bag. Bake from frozen at 180°C for 25-30 minutes. You can also freeze baked ones and reheat at 180°C for 12-15 minutes.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'What other cheese can I use?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Cheddar is traditional, but feel free to experiment! Red Leicester adds colour and mild flavour, mature Cheddar gives more punch, or try a mix of Cheddar and mozzarella for extra gooeyness. Even a bit of crumbled blue cheese works for adventurous taste buds!' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      nutrition: {
        calories: 420,
        protein: 14,
        fat: 24,
        carbs: 38,
      },
      seoTitle: 'Greggs Sausage Bean Cheese Melt - Easy Recipe',
      seoDescription: 'Make Greggs\' Sausage Bean & Cheese Melt at home! Just 4 ingredients: sausages, beans, cheese & pastry. Ready in 30 mins!',
      canonicalUrl: 'https://bitebuddy.co.uk/recipes/greggs-sausage-bean-cheese-melt',
      brand: { _type: 'reference', _ref: greggsBrand._id },
      categories: [
        { _type: 'reference', _ref: breakfastCategory._id },
        { _type: 'reference', _ref: snacksCategory._id },
      ],
    });

    // 3. Vegan Steak Bake (Vegan Lattice)
    await createRecipe({
      _type: 'recipe',
      title: 'Greggs Vegan Steak Bake',
      slug: { _type: 'slug', current: 'greggs-vegan-steak-bake' },
      description: 'Quorn pieces with diced onions and mushrooms in a rich vegan gravy, encased in golden puff pastry lattice.',
      servings: 4,
      prepMin: 20,
      cookMin: 25,
      introText: 'Recreate Greggs\' plant-based Vegan Steak Bake at home! Featuring meaty Quorn pieces, mushrooms, and a rich umami gravy wrapped in flaky vegan puff pastry. Perfect for vegans and meat-eaters alike.',
      brandContext: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Greggs\' Vegan Steak Bake launched in 2020 following the huge success of their vegan sausage roll. Made with Quorn pieces and wrapped in 96 layers of vegan-friendly puff pastry, it quickly became one of the bakery\'s most popular plant-based items, proving that vegan food can be just as indulgent and satisfying.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      ingredients: [
        {
          _type: 'ingredientGroup',
          heading: 'Main Ingredients',
          items: [
            { ingredientRef: { _type: 'reference', _ref: quornPiecesId }, quantity: '300', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: redOnionId }, quantity: '1', unit: 'piece', notes: 'diced' },
            { ingredientRef: { _type: 'reference', _ref: celeryId }, quantity: '1', unit: 'stalk', notes: 'finely diced' },
            { ingredientRef: { _type: 'reference', _ref: chestnutMushroomsId }, quantity: '100', unit: 'g', notes: 'sliced' },
            { ingredientRef: { _type: 'reference', _ref: vegStockId }, quantity: '150', unit: 'ml', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: redWineId }, quantity: '75', unit: 'ml', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: marmiteId }, quantity: '1', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: soySauceId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: oliveOilId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: blackPepperId }, quantity: '1/2', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: puffPastryId }, quantity: '2', unit: 'sheets', notes: 'vegan, ready-rolled' },
          ],
        },
      ],
      steps: [
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Heat olive oil in a large pan and fry Quorn pieces until golden and slightly crispy, about 5-7 minutes. Remove and set aside.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'In the same pan, fry diced onion and celery until onion softens, about 5 minutes. Add sliced mushrooms and cook for another 3 minutes.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Add red wine, vegetable stock, marmite, soy sauce, and black pepper. Bring to a boil, then return Quorn pieces to the pan. Simmer on high heat for 8-10 minutes until liquid reduces and thickens into a rich gravy. Remove from heat and cool.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Preheat oven to 180°C (160°C fan). Cut each pastry sheet in half. Place filling on the lower half of each piece, leaving a border. Fold top half over and crimp edges with a fork.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Make diagonal cuts across the top for decoration. Optional: brush with plant milk for golden finish. Bake for 25 minutes until golden and crisp.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      tipsAndTricks: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Brown the Quorn pieces well to get a meaty texture and deep flavour - don\'t rush this step!' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Reduce the gravy properly until it\'s thick and rich - watery gravy will make soggy pastry. It should coat the back of a spoon.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Check your puff pastry is vegan - not all brands are! Jus-Rol is a popular vegan-friendly option in the UK.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Don\'t skip the Marmite - it adds incredible umami depth to the gravy. If you don\'t have it, try a vegan gravy granule or mushroom ketchup.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      faqs: [
        {
          question: 'Is this recipe really vegan?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Yes, as long as you use vegan puff pastry! Quorn pieces are suitable for vegans (check the packaging), and all other ingredients are plant-based. Some Marmite contains B12 from bacterial fermentation and is vegan, but always double-check labels if you\'re strictly vegan.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'What if I don\'t have Quorn pieces?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'You can use other meat alternatives like diced seitan, tempeh, or even chunky mushrooms (portobello or king oyster work great). For mushrooms, you may need to cook them a bit longer to get that meaty texture.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'Can I skip the red wine?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Yes, but it does add depth of flavour. You can replace it with additional vegetable stock mixed with 1 tablespoon of balsamic vinegar for acidity and richness. The result will be slightly different but still delicious.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'How should I store and reheat these?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Store baked bakes in the fridge for up to 3 days in an airtight container. Reheat in the oven at 180°C for 12-15 minutes to crisp up the pastry. You can also freeze them (baked or unbaked) for up to 3 months - bake from frozen, adding 10-15 minutes to cooking time.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      nutrition: {
        calories: 390,
        protein: 12,
        fat: 22,
        carbs: 35,
      },
      seoTitle: 'Greggs Vegan Steak Bake Recipe - Plant-Based',
      seoDescription: 'Make Greggs\' Vegan Steak Bake at home! Quorn pieces in rich gravy with flaky pastry. Delicious plant-based comfort food in 45 mins.',
      canonicalUrl: 'https://bitebuddy.co.uk/recipes/greggs-vegan-steak-bake',
      brand: { _type: 'reference', _ref: greggsBrand._id },
      categories: [
        { _type: 'reference', _ref: mainsCategory._id },
        { _type: 'reference', _ref: veganCategory._id },
      ],
    });

    // 4. Margherita Pizza
    await createRecipe({
      _type: 'recipe',
      title: 'Greggs Margherita Pizza',
      slug: { _type: 'slug', current: 'greggs-margherita-pizza' },
      description: 'Classic Margherita pizza on a soft focaccia-style base with rich tomato sauce and melted mozzarella cheese.',
      servings: 2,
      prepMin: 90,
      cookMin: 15,
      introText: 'Recreate Greggs\' popular Margherita Pizza at home! With a soft, fluffy focaccia-style base, tangy tomato sauce, and plenty of melted mozzarella, this pizza brings the bakery experience to your kitchen.',
      brandContext: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Greggs launched their pizza range to expand beyond traditional bakery items, offering a quick and affordable pizza option for lunch. The Margherita Pizza showcases their commitment to simple, quality ingredients with a unique focaccia-style base that sets it apart from traditional pizzerias.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      ingredients: [
        {
          _type: 'ingredientGroup',
          heading: 'Pizza Base',
          items: [
            { ingredientRef: { _type: 'reference', _ref: plainFlourId }, quantity: '500', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: yeastId }, quantity: '14', unit: 'g', notes: '2 tsp' },
            { ingredientRef: { _type: 'reference', _ref: oliveOilId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: sugarId }, quantity: '1', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: saltId }, quantity: '1', unit: 'tsp', notes: '' },
          ],
        },
        {
          _type: 'ingredientGroup',
          heading: 'Pizza Sauce & Toppings',
          items: [
            { ingredientRef: { _type: 'reference', _ref: choppedTomatoesId }, quantity: '400', unit: 'g', notes: '1 tin' },
            { ingredientRef: { _type: 'reference', _ref: tomatoPureeId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: onionId }, quantity: '1', unit: 'piece', notes: 'finely diced' },
            { ingredientRef: { _type: 'reference', _ref: garlicId }, quantity: '2', unit: 'cloves', notes: 'minced' },
            { ingredientRef: { _type: 'reference', _ref: oreganoId }, quantity: '1', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: sugarId }, quantity: '2', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: blackPepperId }, quantity: '1', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: mozzarellaId }, quantity: '200', unit: 'g', notes: 'grated' },
          ],
        },
      ],
      steps: [
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Make the pizza base: Mix warm water (300ml) with yeast and sugar, let stand for 5 minutes until frothy. In a large bowl, combine flour and salt. Add yeast mixture and olive oil, knead for 8-10 minutes until smooth. Cover and let rise for 1 hour until doubled.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Make the sauce: Heat 3 tbsp olive oil in a pan, fry onion and garlic until softened, about 5 minutes. Add chopped tomatoes, tomato puree, oregano, sugar, salt and pepper. Simmer for 15 minutes until thickened.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Preheat oven to 220°C (200°C fan). Divide dough into 2 portions. Roll each into a rectangle about 1cm thick on a floured surface.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Place dough on lined baking trays. Spread tomato sauce evenly over each base, leaving a small border. Top generously with grated mozzarella.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Bake for 12-15 minutes until cheese is melted and bubbling, and crust is golden. Slice and serve hot.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      tipsAndTricks: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Let the dough rise properly for a light, fluffy base - the full hour makes a big difference to the texture.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Don\'t overload with sauce - too much will make the base soggy. Aim for a thin, even layer that just covers the dough.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Use fresh mozzarella for the best melting quality and flavour. Pre-grated works too, but fresh gives that authentic pizza experience.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Preheat your oven fully before baking - a hot oven is key to getting that crispy bottom and perfectly melted cheese.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      faqs: [
        {
          question: 'Can I use store-bought pizza dough?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Absolutely! Store-bought dough is a great time-saver. Look for fresh pizza dough in the refrigerated section of your supermarket, or even pre-made pizza bases. Just add your sauce and toppings, and bake as directed.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'How do I get a crispy base?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'For extra crispiness, preheat your baking tray in the oven, place the pizza directly on it, and bake on the lowest oven rack. You can also brush the edges with a little olive oil before baking. Avoid overloading with toppings, as this steams the base.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'Can I freeze the dough or pizza?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Yes! After the first rise, divide the dough, wrap tightly in cling film, and freeze for up to 3 months. Thaw in the fridge overnight before using. You can also freeze assembled uncooked pizzas - freeze on a tray, then wrap well. Bake from frozen, adding 5 minutes to the cooking time.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'I don\'t have time to make dough - any shortcuts?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Try using naan bread, pitta bread, or tortillas as a quick base! Spread with sauce and cheese, then bake at 200°C for 8-10 minutes. It won\'t be exactly like Greggs, but it\'s a tasty quick fix when you\'re short on time.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      nutrition: {
        calories: 546,
        protein: 20,
        fat: 27,
        carbs: 57,
      },
      seoTitle: 'Greggs Margherita Pizza Recipe - Easy Copycat',
      seoDescription: 'Make Greggs-style Margherita Pizza at home! Soft focaccia base with tomato sauce & mozzarella. Classic flavours, ready in under 2 hours.',
      canonicalUrl: 'https://bitebuddy.co.uk/recipes/greggs-margherita-pizza',
      brand: { _type: 'reference', _ref: greggsBrand._id },
      categories: [
        { _type: 'reference', _ref: mainsCategory._id },
        { _type: 'reference', _ref: vegetarianCategory._id },
      ],
    });

    // 5. Pepperoni Pizza
    await createRecipe({
      _type: 'recipe',
      title: 'Greggs Pepperoni Pizza',
      slug: { _type: 'slug', current: 'greggs-pepperoni-pizza' },
      description: 'Classic pepperoni pizza on a soft focaccia-style base with rich tomato sauce, mozzarella, and plenty of pepperoni slices.',
      servings: 2,
      prepMin: 90,
      cookMin: 15,
      introText: 'Bring Greggs\' Pepperoni Pizza home with this easy recipe. Loaded with pepperoni slices and melted cheese on a soft, pillowy base, it\'s the perfect pizza for meat lovers.',
      brandContext: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Greggs\' Pepperoni Pizza is a crowd-pleaser that delivers on both value and flavour. The generous topping of pepperoni combined with their signature focaccia-style base makes it a popular choice for a quick, satisfying lunch that won\'t break the bank.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      ingredients: [
        {
          _type: 'ingredientGroup',
          heading: 'Pizza Base',
          items: [
            { ingredientRef: { _type: 'reference', _ref: plainFlourId }, quantity: '500', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: yeastId }, quantity: '14', unit: 'g', notes: '2 tsp' },
            { ingredientRef: { _type: 'reference', _ref: oliveOilId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: sugarId }, quantity: '1', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: saltId }, quantity: '1', unit: 'tsp', notes: '' },
          ],
        },
        {
          _type: 'ingredientGroup',
          heading: 'Pizza Sauce & Toppings',
          items: [
            { ingredientRef: { _type: 'reference', _ref: choppedTomatoesId }, quantity: '400', unit: 'g', notes: '1 tin' },
            { ingredientRef: { _type: 'reference', _ref: tomatoPureeId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: onionId }, quantity: '1', unit: 'piece', notes: 'finely diced' },
            { ingredientRef: { _type: 'reference', _ref: garlicId }, quantity: '2', unit: 'cloves', notes: 'minced' },
            { ingredientRef: { _type: 'reference', _ref: oreganoId }, quantity: '1', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: sugarId }, quantity: '2', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: blackPepperId }, quantity: '1', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: mozzarellaId }, quantity: '200', unit: 'g', notes: 'grated' },
            { ingredientRef: { _type: 'reference', _ref: pepperoniId }, quantity: '100', unit: 'g', notes: 'sliced' },
          ],
        },
      ],
      steps: [
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Make the pizza base: Mix warm water (300ml) with yeast and sugar, let stand for 5 minutes until frothy. In a large bowl, combine flour and salt. Add yeast mixture and olive oil, knead for 8-10 minutes until smooth. Cover and let rise for 1 hour until doubled.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Make the sauce: Heat 3 tbsp olive oil in a pan, fry onion and garlic until softened, about 5 minutes. Add chopped tomatoes, tomato puree, oregano, sugar, salt and pepper. Simmer for 15 minutes until thickened.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Preheat oven to 220°C (200°C fan). Divide dough into 2 portions. Roll each into a rectangle about 1cm thick on a floured surface.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Place dough on lined baking trays. Spread tomato sauce evenly over each base, leaving a small border. Top with grated mozzarella, then arrange pepperoni slices evenly across the surface.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Bake for 12-15 minutes until cheese is melted and bubbling, pepperoni is slightly crispy, and crust is golden. Slice and serve hot.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      tipsAndTricks: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Quality pepperoni matters - look for Italian-style pepperoni with good spicing. Cheap pepperoni can release too much oil and lack flavour.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'For extra crispy pepperoni, pre-bake the base with just sauce and cheese for 5 minutes, then add pepperoni and finish baking.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'If pepperoni releases excess oil during baking, dab with kitchen paper before serving - or embrace it for authentic pizza experience!' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Add a sprinkle of dried chilli flakes or Italian herbs before baking for extra flavour dimension.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      faqs: [
        {
          question: 'Can I use turkey pepperoni instead?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Yes! Turkey pepperoni is a great lower-fat alternative and works perfectly in this recipe. It has a slightly different flavour and texture but still makes a delicious pizza. Some people actually prefer it!' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'How much pepperoni should I use?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'The recipe calls for 100g which gives good coverage. For "Greggs-style" coverage, arrange slices so they\'re close but not overlapping too much - about 15-20 slices per pizza depending on slice size. Add more if you\'re a pepperoni lover!' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'Can I add other toppings?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Absolutely! While this is a classic pepperoni pizza, feel free to add mushrooms, peppers, onions, or olives. Just remember not to overload the pizza or the base may become soggy and won\'t cook evenly.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'What\'s the best way to reheat leftover pizza?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'For best results, reheat in the oven at 180°C for 8-10 minutes until hot and crispy. You can also use a frying pan on medium heat with a lid - this crisps the bottom while melting the cheese perfectly. Avoid the microwave if you want to maintain the texture!' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      nutrition: {
        calories: 611,
        protein: 21,
        fat: 32,
        carbs: 57,
      },
      seoTitle: 'Greggs Pepperoni Pizza Recipe - Easy At Home',
      seoDescription: 'Make Greggs-style Pepperoni Pizza at home! Soft focaccia base loaded with pepperoni & cheese. Better than takeaway, under 2 hours.',
      canonicalUrl: 'https://bitebuddy.co.uk/recipes/greggs-pepperoni-pizza',
      brand: { _type: 'reference', _ref: greggsBrand._id },
      categories: [
        { _type: 'reference', _ref: mainsCategory._id },
      ],
    });

    // 6. Spicy Chicken Pizza
    await createRecipe({
      _type: 'recipe',
      title: 'Greggs Spicy Mexican Chicken Pizza',
      slug: { _type: 'slug', current: 'greggs-spicy-mexican-chicken-pizza' },
      description: 'Spicy seasoned chicken with jalapeños, red onions, and melted mozzarella on a soft focaccia-style pizza base.',
      servings: 2,
      prepMin: 100,
      cookMin: 15,
      introText: 'Spice up your pizza night with Greggs\' Spicy Mexican Chicken Pizza! Featuring tender seasoned chicken, fiery jalapeños, and sweet red onions on a fluffy base, this recipe brings Mexican-inspired flavours to your home kitchen.',
      brandContext: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Greggs\' Spicy Mexican Chicken Pizza combines British bakery tradition with bold Mexican flavours. The combination of spicy chicken, jalapeños, and red onion creates a pizza that\'s both comforting and exciting, perfect for those who like their lunch with a kick.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      ingredients: [
        {
          _type: 'ingredientGroup',
          heading: 'Pizza Base',
          items: [
            { ingredientRef: { _type: 'reference', _ref: plainFlourId }, quantity: '500', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: yeastId }, quantity: '14', unit: 'g', notes: '2 tsp' },
            { ingredientRef: { _type: 'reference', _ref: oliveOilId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: sugarId }, quantity: '1', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: saltId }, quantity: '1', unit: 'tsp', notes: '' },
          ],
        },
        {
          _type: 'ingredientGroup',
          heading: 'Spicy Chicken',
          items: [
            { ingredientRef: { _type: 'reference', _ref: chickenBreastId }, quantity: '200', unit: 'g', notes: 'diced' },
            { ingredientRef: { _type: 'reference', _ref: oliveOilId }, quantity: '1', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: blackPepperId }, quantity: '1/2', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: saltId }, quantity: '1/4', unit: 'tsp', notes: '' },
          ],
        },
        {
          _type: 'ingredientGroup',
          heading: 'Pizza Sauce & Toppings',
          items: [
            { ingredientRef: { _type: 'reference', _ref: choppedTomatoesId }, quantity: '400', unit: 'g', notes: '1 tin' },
            { ingredientRef: { _type: 'reference', _ref: tomatoPureeId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: onionId }, quantity: '1', unit: 'piece', notes: 'finely diced (for sauce)' },
            { ingredientRef: { _type: 'reference', _ref: garlicId }, quantity: '2', unit: 'cloves', notes: 'minced' },
            { ingredientRef: { _type: 'reference', _ref: oreganoId }, quantity: '1', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: sugarId }, quantity: '2', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: blackPepperId }, quantity: '1', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: mozzarellaId }, quantity: '200', unit: 'g', notes: 'grated' },
            { ingredientRef: { _type: 'reference', _ref: redOnionId }, quantity: '1', unit: 'piece', notes: 'thinly sliced' },
            { ingredientRef: { _type: 'reference', _ref: jalapenosId }, quantity: '50', unit: 'g', notes: 'sliced' },
          ],
        },
      ],
      steps: [
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Make the pizza base: Mix warm water (300ml) with yeast and sugar, let stand for 5 minutes until frothy. In a large bowl, combine flour and salt. Add yeast mixture and olive oil, knead for 8-10 minutes until smooth. Cover and let rise for 1 hour until doubled.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Prepare spicy chicken: Heat 1 tbsp olive oil in a pan. Season diced chicken with salt, black pepper, and chilli powder. Cook for 6-8 minutes until golden and cooked through. Set aside.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Make the sauce: Heat 3 tbsp olive oil in a pan, fry diced onion and garlic until softened, about 5 minutes. Add chopped tomatoes, tomato puree, oregano, sugar, salt and pepper. Simmer for 15 minutes until thickened.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Preheat oven to 220°C (200°C fan). Divide dough into 2 portions. Roll each into a rectangle about 1cm thick on a floured surface.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Place dough on lined baking trays. Spread tomato sauce evenly over each base. Top with grated mozzarella, spicy chicken pieces, sliced red onion, and jalapeños.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Bake for 12-15 minutes until cheese is melted and bubbling, chicken is heated through, and crust is golden. Slice and serve hot.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      tipsAndTricks: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Adjust the spice level to your preference - add more chilli powder or cayenne pepper for extra heat, or reduce it for a milder version.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Marinate the chicken in the spices for 15-30 minutes before cooking for deeper flavour penetration.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Drain jarred jalapeños well before adding to prevent excess moisture on the pizza. Pat them dry with kitchen paper if needed.' }],
          markDefs: [],
          style: 'normal',
        },
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'A squeeze of fresh lime juice over the finished pizza adds authentic Mexican brightness and cuts through the richness.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      faqs: [
        {
          question: 'Is this pizza very spicy?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'It has a moderate kick but isn\'t overwhelmingly hot. The jalapeños provide most of the heat. If you\'re sensitive to spice, use fewer jalapeños or remove the seeds. For more heat, add extra chilli powder, cayenne, or fresh chillies to the chicken.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'What else can I add to this pizza?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Great additions include sweetcorn, black beans, diced bell peppers, spring onions, or a drizzle of sour cream after baking. Some people love adding avocado or guacamole on top after baking for extra creaminess.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'Can I use turkey instead of chicken?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Yes! Turkey breast works perfectly as a substitute. It\'s slightly leaner than chicken, so you may want to add a touch more oil when cooking to keep it moist. The cooking time remains the same.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          question: 'How can I make it spicier?',
          answer: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Add cayenne pepper or hot paprika to the chicken seasoning, use fresh jalapeños or habaneros instead of jarred, drizzle with hot sauce before serving, or add sliced fresh red chillies as a topping. You can also mix some sriracha into the tomato sauce!' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      nutrition: {
        calories: 597,
        protein: 24,
        fat: 28,
        carbs: 58,
      },
      seoTitle: 'Greggs Spicy Chicken Pizza - Mexican Style Recipe',
      seoDescription: 'Make Greggs\' Spicy Mexican Chicken Pizza! Seasoned chicken, jalapeños & red onions on soft base. Fiery flavours ready in under 2 hours.',
      canonicalUrl: 'https://bitebuddy.co.uk/recipes/greggs-spicy-mexican-chicken-pizza',
      brand: { _type: 'reference', _ref: greggsBrand._id },
      categories: [
        { _type: 'reference', _ref: mainsCategory._id },
        { _type: 'reference', _ref: spicyCategory._id },
      ],
    });

    console.log('\n\n✅ All Greggs recipes created successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
