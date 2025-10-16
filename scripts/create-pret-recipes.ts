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
    const kaleId = await createIngredientIfNotExists('Kale');
    const blackBeansId = await createIngredientIfNotExists('Black Beans');
    const fetaId = await createIngredientIfNotExists('Feta Cheese', ['Milk']);
    const blackRiceId = await createIngredientIfNotExists('Black Rice');
    const orangeJuiceId = await createIngredientIfNotExists('Orange Juice');
    const togarashiId = await createIngredientIfNotExists('Togarashi Spice');
    const pistachioId = await createIngredientIfNotExists('Pistachio Nuts', ['Nuts']);
    const yogurtId = await createIngredientIfNotExists('Natural Yogurt', ['Milk']);
    const shawarmaSpiceId = await createIngredientIfNotExists('Shawarma Spice Mix');
    const frenchDressingId = await createIngredientIfNotExists('French Dressing');
    const chipotleKetchupId = await createIngredientIfNotExists('Chipotle Ketchup');
    const blackBeanMoleId = await createIngredientIfNotExists('Black Bean Mole');
    const oliveoilId = await createIngredientIfNotExists('Olive Oil');
    const sesameSeedsId = await createIngredientIfNotExists('Sesame Seeds');

    // Get existing ingredient IDs
    const ingredients = await client.fetch(`*[_type == "ingredient"]{_id, name}`);
    const getIngredientId = (name: string) => {
      const ing = ingredients.find((i: any) => i.name === name);
      if (!ing) throw new Error(`Ingredient not found: ${name}`);
      return ing._id;
    };

    const butternutSquashId = getIngredientId('Butternut Squash');
    const chickpeasId = getIngredientId('Chickpeas');
    const houmousId = getIngredientId('Houmous');
    const aubergineId = getIngredientId('Aubergine');
    const brownRiceId = getIngredientId('Brown Rice');
    const pomegranateId = getIngredientId('Pomegranate seeds');
    const redQuinoaId = getIngredientId('Red Quinoa');
    const chickenBreastId = getIngredientId('Chicken Breast');
    const avocadoId = getIngredientId('Avocado');
    const redPepperId = getIngredientId('Red Pepper');
    const salmonId = getIngredientId('Salmon fillets');
    const tenderstemId = getIngredientId('Tenderstem Broccoli');
    const edamameId = getIngredientId('Edamame beans');
    const misoId = getIngredientId('White Miso Paste');
    const cucumberId = getIngredientId('Cucumber');
    const spinachId = getIngredientId('Spinach (fresh)');

    // Get brand and categories
    const pretBrand = await client.fetch(`*[_type == "brand" && slug.current == "pret-a-manger"][0]`);
    const categories = await client.fetch(`*[_type == "category" && slug.current in ["mains", "high-protein", "vegan", "vegetarian"]]`);
    const mainsCategory = categories.find((c: any) => c.slug.current === 'mains');
    const highProteinCategory = categories.find((c: any) => c.slug.current === 'high-protein');
    const veganCategory = categories.find((c: any) => c.slug.current === 'vegan');
    const vegetarianCategory = categories.find((c: any) => c.slug.current === 'vegetarian');

    console.log('\n\nCreating recipes...\n');

    // 1. Butternut Mezze
    await createRecipe({
      _type: 'recipe',
      title: 'Pret Butternut Mezze Bowl',
      slug: { _type: 'slug', current: 'pret-butternut-mezze-bowl' },
      description: 'A vibrant vegan super-plate with roasted butternut squash, chargrilled chickpeas, chilli aubergine, and massaged kale over brown rice and quinoa.',
      servings: 1,
      prepMin: 15,
      cookMin: 35,
      introText: 'Recreate Pret A Manger\'s popular Butternut Mezze at home with this wholesome, plant-based bowl. Featuring roasted butternut squash, protein-packed chickpeas, and nutrient-rich kale, this Mediterranean-inspired dish delivers 610 calories of pure satisfaction.',
      brandContext: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Pret A Manger\'s Butternut Mezze has become a staple for health-conscious diners seeking plant-based options. This super-plate combines Middle Eastern flavors with fresh vegetables, offering a complete meal that\'s both nutritious and delicious. The dish showcases Pret\'s commitment to natural ingredients and bold flavors.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      ingredients: [
        {
          _type: 'ingredientGroup',
          heading: 'Main Components',
          items: [
            { ingredientRef: { _type: 'reference', _ref: butternutSquashId }, quantity: '300', unit: 'g', notes: 'cubed' },
            { ingredientRef: { _type: 'reference', _ref: chickpeasId }, quantity: '150', unit: 'g', notes: 'chargrilled' },
            { ingredientRef: { _type: 'reference', _ref: aubergineId }, quantity: '100', unit: 'g', notes: 'diced and spiced with chilli' },
            { ingredientRef: { _type: 'reference', _ref: kaleId }, quantity: '50', unit: 'g', notes: 'massaged' },
            { ingredientRef: { _type: 'reference', _ref: houmousId }, quantity: '60', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: brownRiceId }, quantity: '100', unit: 'g', notes: 'cooked' },
            { ingredientRef: { _type: 'reference', _ref: redQuinoaId }, quantity: '50', unit: 'g', notes: 'cooked' },
            { ingredientRef: { _type: 'reference', _ref: pomegranateId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: oliveoilId }, quantity: '2', unit: 'tbsp', notes: '' },
          ],
        },
      ],
      steps: [
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Preheat oven to 200°C (180°C fan). Toss butternut squash cubes with 1 tbsp olive oil, salt, and pepper. Roast for 25-30 minutes until golden and tender.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'While squash roasts, cook brown rice and red quinoa according to package directions. Mix together and set aside.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Massage kale leaves with a pinch of salt for 2-3 minutes until softened. Chargrill chickpeas in a hot pan until slightly charred, about 5 minutes.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Dice aubergine and sauté with chilli flakes and remaining olive oil until tender, about 8-10 minutes.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Assemble bowl by layering rice and quinoa as the base. Top with roasted butternut squash, chargrilled chickpeas, chilli aubergine, massaged kale, a dollop of houmous, and pomegranate seeds.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      nutrition: {
        calories: 610,
        protein: 18,
        fat: 28.5,
        carbs: 61.3,
      },
      seoTitle: 'Pret Butternut Mezze Bowl Recipe - Easy Vegan Copy',
      seoDescription: 'Make Pret\'s popular Butternut Mezze at home! This vegan super-plate features roasted squash, chickpeas, and kale. Ready in 50 minutes.',
      canonicalUrl: 'https://bitebuddy.co.uk/recipes/pret-butternut-mezze-bowl',
      brand: { _type: 'reference', _ref: pretBrand._id },
      categories: [
        { _type: 'reference', _ref: mainsCategory._id },
        { _type: 'reference', _ref: veganCategory._id },
        { _type: 'reference', _ref: vegetarianCategory._id },
      ],
    });

    // 2. Chipotle Chicken Super Plate
    await createRecipe({
      _type: 'recipe',
      title: 'Pret Chipotle Chicken Super Plate',
      slug: { _type: 'slug', current: 'pret-chipotle-chicken-super-plate' },
      description: 'Smoky chargrilled chicken with black bean mole, fresh avocado, feta cheese, and chargrilled peppers on a bed of brown rice and quinoa.',
      servings: 1,
      prepMin: 15,
      cookMin: 25,
      introText: 'Experience Pret A Manger\'s bold Mexican-inspired flavors at home with this protein-packed Chipotle Chicken Super Plate. Featuring tender chargrilled chicken, rich black bean mole, and creamy avocado, this dish delivers 694 calories with an impressive 49g of protein.',
      brandContext: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Pret A Manger\'s Chipotle Chicken Super Plate brings together Mexican-inspired ingredients with a focus on high-quality proteins and fresh vegetables. The smoky chipotle flavor combined with the earthy black bean mole creates a satisfying meal that\'s become a lunchtime favorite for those seeking a balanced, flavorful option.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      ingredients: [
        {
          _type: 'ingredientGroup',
          heading: 'Main Components',
          items: [
            { ingredientRef: { _type: 'reference', _ref: chickenBreastId }, quantity: '200', unit: 'g', notes: 'chargrilled' },
            { ingredientRef: { _type: 'reference', _ref: blackBeanMoleId }, quantity: '100', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: avocadoId }, quantity: '1', unit: 'piece', notes: 'sliced' },
            { ingredientRef: { _type: 'reference', _ref: fetaId }, quantity: '40', unit: 'g', notes: 'crumbled' },
            { ingredientRef: { _type: 'reference', _ref: redPepperId }, quantity: '80', unit: 'g', notes: 'chargrilled' },
            { ingredientRef: { _type: 'reference', _ref: brownRiceId }, quantity: '100', unit: 'g', notes: 'cooked' },
            { ingredientRef: { _type: 'reference', _ref: redQuinoaId }, quantity: '50', unit: 'g', notes: 'cooked' },
            { ingredientRef: { _type: 'reference', _ref: chipotleKetchupId }, quantity: '2', unit: 'tbsp', notes: '' },
          ],
        },
      ],
      steps: [
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Cook brown rice and red quinoa according to package directions. Mix together and set aside to cool slightly.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Season chicken breast with salt, pepper, and chipotle seasoning. Heat a griddle pan over high heat and cook chicken for 6-7 minutes per side until charred and cooked through. Let rest 5 minutes, then slice.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Chargrill red peppers on the same pan until softened and slightly charred, about 5 minutes. Slice into strips.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Warm the black bean mole in a small saucepan over medium heat, stirring occasionally.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Assemble the bowl: Start with rice and quinoa as the base, top with sliced chicken, black bean mole, chargrilled peppers, sliced avocado, crumbled feta, and a drizzle of chipotle ketchup.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      nutrition: {
        calories: 694,
        protein: 49.3,
        fat: 31.4,
        carbs: 47.3,
      },
      seoTitle: 'Pret Chipotle Chicken Super Plate - High Protein Recipe',
      seoDescription: 'Recreate Pret\'s Chipotle Chicken Super Plate with this easy recipe. Packed with 49g protein, black beans, avocado, and feta. Ready in 40 mins.',
      canonicalUrl: 'https://bitebuddy.co.uk/recipes/pret-chipotle-chicken-super-plate',
      brand: { _type: 'reference', _ref: pretBrand._id },
      categories: [
        { _type: 'reference', _ref: mainsCategory._id },
        { _type: 'reference', _ref: highProteinCategory._id },
      ],
    });

    // 3. Miso Salmon Super Plate
    await createRecipe({
      _type: 'recipe',
      title: 'Pret Miso Salmon Super Plate',
      slug: { _type: 'slug', current: 'pret-miso-salmon-super-plate' },
      description: 'Japanese-inspired bowl with golden roast salmon, Tenderstem broccoli, avocado, edamame, and togarashi spiced seeds on black rice and quinoa.',
      servings: 1,
      prepMin: 15,
      cookMin: 20,
      introText: 'Bring the flavors of Japan home with Pret A Manger\'s Miso Salmon Super Plate. This omega-3 rich dish combines perfectly roasted salmon with nutrient-dense vegetables and a zingy miso-orange dressing, delivering 761 calories of wholesome goodness.',
      brandContext: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Pret A Manger\'s Miso Salmon Super Plate showcases their commitment to global flavors and premium ingredients. The combination of golden roast salmon with Japanese-inspired vegetables and the umami-rich miso-orange dressing creates a sophisticated yet approachable meal that\'s both nourishing and delicious.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      ingredients: [
        {
          _type: 'ingredientGroup',
          heading: 'Main Components',
          items: [
            { ingredientRef: { _type: 'reference', _ref: salmonId }, quantity: '150', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: blackRiceId }, quantity: '80', unit: 'g', notes: 'cooked' },
            { ingredientRef: { _type: 'reference', _ref: redQuinoaId }, quantity: '50', unit: 'g', notes: 'cooked' },
            { ingredientRef: { _type: 'reference', _ref: avocadoId }, quantity: '1', unit: 'piece', notes: 'sliced' },
            { ingredientRef: { _type: 'reference', _ref: tenderstemId }, quantity: '80', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: edamameId }, quantity: '60', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: aubergineId }, quantity: '80', unit: 'g', notes: 'chilli spiced' },
            { ingredientRef: { _type: 'reference', _ref: misoId }, quantity: '1', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: orangeJuiceId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: togarashiId }, quantity: '1', unit: 'tsp', notes: '' },
          ],
        },
      ],
      steps: [
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Cook black rice and red quinoa according to package directions. Mix together and set aside.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Preheat oven to 200°C (180°C fan). Pat salmon dry and season with salt. Roast for 12-15 minutes until just cooked through and golden on top.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Steam Tenderstem broccoli for 5-6 minutes until tender-crisp. Cook edamame beans in boiling water for 3-4 minutes, then drain.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Dice aubergine and sauté with chilli and a little oil until tender, about 8 minutes. Make the miso-orange dressing by whisking together miso paste, orange juice, and togarashi spice.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Assemble the bowl: Layer black rice and quinoa as the base. Top with roasted salmon, Tenderstem broccoli, sliced avocado, edamame, and chilli aubergine. Drizzle with miso-orange dressing and sprinkle with togarashi spiced seeds.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      nutrition: {
        calories: 761,
        protein: 36,
        fat: 47.1,
        carbs: 43.4,
      },
      seoTitle: 'Pret Miso Salmon Bowl Recipe - Japanese Inspired',
      seoDescription: 'Make Pret\'s Miso Salmon Super Plate at home! Japanese-inspired bowl with omega-3 rich salmon, edamame, and miso-orange dressing. Ready in 35 mins.',
      canonicalUrl: 'https://bitebuddy.co.uk/recipes/pret-miso-salmon-super-plate',
      brand: { _type: 'reference', _ref: pretBrand._id },
      categories: [
        { _type: 'reference', _ref: mainsCategory._id },
        { _type: 'reference', _ref: highProteinCategory._id },
      ],
    });

    // 4. Shawarma Chicken Super Plate
    await createRecipe({
      _type: 'recipe',
      title: 'Pret Shawarma Chicken Super Plate',
      slug: { _type: 'slug', current: 'pret-shawarma-chicken-super-plate' },
      description: 'Middle Eastern inspired bowl with spiced shawarma chicken, chargrilled chickpeas, red peppers, massaged kale, pistachios, and humous.',
      servings: 1,
      prepMin: 20,
      cookMin: 25,
      introText: 'Transport your taste buds to the Middle East with Pret A Manger\'s Shawarma Chicken Super Plate. This aromatic dish features tender shawarma-spiced chicken, protein-packed chickpeas, and crunchy pistachios, delivering 608 calories with an impressive 49.7g of protein.',
      brandContext: [
        {
          _type: 'block',
          children: [{ _type: 'span', text: 'Pret A Manger\'s Shawarma Chicken Super Plate celebrates the vibrant flavors of Middle Eastern cuisine. The aromatic shawarma spice blend, combined with fresh vegetables and creamy humous, creates a satisfying meal that showcases Pret\'s commitment to authentic flavors and quality ingredients.' }],
          markDefs: [],
          style: 'normal',
        },
      ],
      ingredients: [
        {
          _type: 'ingredientGroup',
          heading: 'Main Components',
          items: [
            { ingredientRef: { _type: 'reference', _ref: chickenBreastId }, quantity: '220', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: shawarmaSpiceId }, quantity: '2', unit: 'tsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: chickpeasId }, quantity: '140', unit: 'g', notes: 'chargrilled' },
            { ingredientRef: { _type: 'reference', _ref: houmousId }, quantity: '60', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: cucumberId }, quantity: '80', unit: 'g', notes: 'diced' },
            { ingredientRef: { _type: 'reference', _ref: redPepperId }, quantity: '100', unit: 'g', notes: 'chargrilled' },
            { ingredientRef: { _type: 'reference', _ref: spinachId }, quantity: '40', unit: 'g', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: kaleId }, quantity: '40', unit: 'g', notes: 'massaged' },
            { ingredientRef: { _type: 'reference', _ref: pomegranateId }, quantity: '2', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: pistachioId }, quantity: '20', unit: 'g', notes: 'roasted' },
            { ingredientRef: { _type: 'reference', _ref: yogurtId }, quantity: '3', unit: 'tbsp', notes: '' },
            { ingredientRef: { _type: 'reference', _ref: frenchDressingId }, quantity: '2', unit: 'tbsp', notes: '' },
          ],
        },
      ],
      steps: [
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Mix shawarma spice blend with natural yogurt. Coat chicken breast thoroughly and marinate for at least 15 minutes (or overnight for best results).' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Heat a griddle pan over high heat. Cook marinated chicken for 6-7 minutes per side until charred and cooked through. Rest for 5 minutes, then slice.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Chargrill chickpeas in a hot pan until slightly charred, about 5 minutes. Chargrill red peppers until softened and charred, about 5 minutes, then slice.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Massage kale leaves with a pinch of salt for 2-3 minutes until softened. Dice cucumber and roughly chop roasted pistachios.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
        {
          step: [
            {
              _type: 'block',
              children: [{ _type: 'span', text: 'Assemble the bowl: Start with fresh spinach and massaged kale as the base. Top with sliced shawarma chicken, chargrilled chickpeas, chargrilled red peppers, diced cucumber, a generous dollop of humous, pomegranate seeds, and roasted pistachios. Drizzle with French dressing.' }],
              markDefs: [],
              style: 'normal',
            },
          ],
        },
      ],
      nutrition: {
        calories: 608,
        protein: 49.7,
        fat: 28.3,
        carbs: 32,
      },
      seoTitle: 'Pret Shawarma Chicken Bowl - Easy Middle Eastern Recipe',
      seoDescription: 'Make Pret\'s Shawarma Chicken Super Plate at home! Middle Eastern spiced chicken with chickpeas, humous & pistachios. High protein, 45 mins.',
      canonicalUrl: 'https://bitebuddy.co.uk/recipes/pret-shawarma-chicken-super-plate',
      brand: { _type: 'reference', _ref: pretBrand._id },
      categories: [
        { _type: 'reference', _ref: mainsCategory._id },
        { _type: 'reference', _ref: highProteinCategory._id },
      ],
    });

    console.log('\n\n✅ All recipes created successfully!');
  } catch (error) {
    console.error('Error:', error);
    process.exit(1);
  }
}

main();
