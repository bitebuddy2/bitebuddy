import { createClient } from '@sanity/client';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET!,
  token: process.env.SANITY_WRITE_TOKEN!,
  apiVersion: '2024-01-01',
  useCdn: false,
});

// Ingredient definitions with nutrition and allergen data
const ingredients = [
  {
    _id: 'ingredient.chipotle-peppers',
    _type: 'ingredient',
    name: 'Chipotle peppers in adobo',
    allergens: [],
    kcal100: 60,
    protein100: 1.5,
    fat100: 0.8,
    carbs100: 12,
  },
  {
    _id: 'ingredient.habanero-peppers',
    _type: 'ingredient',
    name: 'Habanero peppers',
    allergens: [],
    kcal100: 40,
    protein100: 1.2,
    fat100: 0.4,
    carbs100: 9,
  },
  {
    _id: 'ingredient.mango-puree',
    _type: 'ingredient',
    name: 'Mango puree',
    allergens: [],
    kcal100: 60,
    protein100: 0.5,
    fat100: 0.2,
    carbs100: 15,
  },
  {
    _id: 'ingredient.adobo-sauce',
    _type: 'ingredient',
    name: 'Adobo sauce',
    allergens: [],
    kcal100: 45,
    protein100: 0.8,
    fat100: 0.5,
    carbs100: 9,
  },
  {
    _id: 'ingredient.ranch-dressing',
    _type: 'ingredient',
    name: 'Ranch dressing',
    allergens: ['Milk', 'Eggs'],
    kcal100: 458,
    protein100: 1.5,
    fat100: 48,
    carbs100: 5,
  },
  {
    _id: 'ingredient.dried-dill',
    _type: 'ingredient',
    name: 'Dried dill',
    allergens: [],
    kcal100: 253,
    protein100: 20,
    fat100: 4.4,
    carbs100: 43,
  },
  {
    _id: 'ingredient.garlic-herb-seasoning',
    _type: 'ingredient',
    name: 'Garlic and herb seasoning',
    allergens: [],
    kcal100: 315,
    protein100: 14,
    fat100: 3.5,
    carbs100: 60,
  },
];

// Recipe definitions - 7 Subway sauces
const recipes = [
  {
    _type: 'recipe',
    title: 'Subway Southwest Sauce Recipe',
    slug: { _type: 'slug', current: 'subway-southwest-sauce' },
    description: 'Recreate the bold, spicy, and creamy Southwest sauce from Subway at home. This zesty condiment combines smoky chipotle flavours with a rich, creamy base – perfect for sandwiches, wraps, and dipping.',
    servings: 8,
    prepMin: 5,
    cookMin: 0,
    introText: 'The Southwest Sauce from Subway is one of the chain\'s most popular condiments, beloved for its bold and smoky flavour profile. This creamy, spicy sauce delivers the perfect balance of heat and tang, making it an ideal accompaniment to chicken tikka subs, philly steaks, and virtually any sandwich creation. With just a handful of ingredients and five minutes of prep time, you can recreate this restaurant favourite at home and elevate your lunches to the next level.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'Subway, founded in 1965, has become one of the world\'s largest fast-food chains, known for its customisable submarine sandwiches and fresh ingredients. The brand prides itself on offering healthier fast-food alternatives, with customers able to choose from a wide variety of breads, proteins, vegetables, and sauces.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'The Southwest Sauce is a relatively recent addition to Subway\'s sauce lineup, designed to cater to the growing demand for bold, spicy flavours. It has quickly become a customer favourite, particularly among those who enjoy a touch of heat with their meals. The sauce\'s popularity stems from its versatility – it works brilliantly with chicken, steak, and even vegetarian options.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'ingredient.mayonnaise' }, quantity: '200', unit: 'g' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'ingredient.chipotle-peppers' }, quantity: '2', unit: 'tbsp', notes: 'finely chopped' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: 'ingredient.adobo-sauce' }, quantity: '1', unit: 'tbsp' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB1Lie4' }, quantity: '1', unit: 'tsp' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'DOyalXpxxR8GcURoHK9XKG' }, quantity: '1', unit: 'tsp' },
          { _key: '6', ingredientRef: { _type: 'reference', _ref: 'EDdkNoabzuWM7YAKREkJ02' }, quantity: '0.5', unit: 'tsp' },
          { _key: '7', ingredientRef: { _type: 'reference', _ref: 'DOyalXpxxR8GcURoHK5YxT' }, quantity: '0.25', unit: 'tsp' },
        ],
      },
    ],
    steps: [
      {
        _key: 'step1',
        step: [
          {
            _type: 'block',
            _key: 'block1',
            children: [{ _type: 'span', _key: 'span1', text: 'In a medium bowl, combine the mayonnaise with the finely chopped chipotle peppers and adobo sauce. Mix thoroughly to ensure the chipotle flavour is evenly distributed throughout the base.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step2',
        step: [
          {
            _type: 'block',
            _key: 'block2',
            children: [{ _type: 'span', _key: 'span2', text: 'Add the lemon juice, paprika, garlic powder, and salt to the bowl. Whisk all ingredients together until completely smooth and well combined.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step3',
        step: [
          {
            _type: 'block',
            _key: 'block3',
            children: [{ _type: 'span', _key: 'span3', text: 'Taste the sauce and adjust seasoning if needed. For extra heat, add more chopped chipotle peppers; for more smokiness, add an additional splash of adobo sauce.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step4',
        step: [
          {
            _type: 'block',
            _key: 'block4',
            children: [{ _type: 'span', _key: 'span4', text: 'Transfer the sauce to an airtight container and refrigerate for at least 30 minutes before serving to allow the flavours to meld. The sauce will keep in the fridge for up to 1 week.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'For a milder version, reduce the amount of chipotle peppers and use only the adobo sauce for a subtle smoky flavour.',
      'This sauce works wonderfully as a dip for chips, vegetables, or chicken nuggets.',
      'You can thin the sauce with a small amount of water or lime juice if you prefer a drizzling consistency.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'Can I make this sauce dairy-free?',
        answer: 'Yes! Simply substitute the mayonnaise with a vegan or dairy-free mayonnaise alternative. The flavour will remain virtually identical.',
      },
      {
        _key: 'faq2',
        question: 'Where can I find chipotle peppers in adobo sauce?',
        answer: 'Chipotle peppers in adobo sauce are typically found in the international or Mexican food aisle of most supermarkets. They come in small tins and are very flavourful, so a little goes a long way.',
      },
      {
        _key: 'faq3',
        question: 'How spicy is this sauce?',
        answer: 'The Southwest Sauce has a moderate level of heat. It\'s noticeably spicy but not overwhelming. You can easily adjust the heat level by adding more or fewer chipotle peppers.',
      },
    ],
    nutrition: {
      calories: 110,
      protein: 0.5,
      fat: 12,
      carbs: 1.5,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [{ _type: 'reference', _ref: 'afe4166e-5071-432a-9a36-90a0e7317676' }],
    seoTitle: 'Subway Southwest Sauce Recipe - Easy Copycat Version',
    seoDescription: 'Make Subway\'s famous Southwest Sauce at home in just 5 minutes! This spicy, smoky, and creamy sauce is perfect for sandwiches, wraps, and dipping.',
  },
  {
    _type: 'recipe',
    title: 'Subway Chipotle Sauce Recipe',
    slug: { _type: 'slug', current: 'subway-chipotle-sauce' },
    description: 'Bring the heat with this authentic Subway Chipotle Sauce copycat recipe. Hot, peppery, and deliciously smoky, this sauce packs a punch and is perfect for spice lovers.',
    servings: 8,
    prepMin: 5,
    cookMin: 0,
    introText: 'Subway\'s Chipotle Sauce is the go-to choice for customers who love their sandwiches with serious heat. This bold, fiery sauce combines the smokiness of chipotle peppers with a peppery kick that elevates any sub. It pairs exceptionally well with the Big Bombay and Spicy Italian subs, but adventurous eaters love adding it to any sandwich for an extra layer of flavour and intensity. Making this sauce at home is incredibly simple and allows you to control the heat level to your preference.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'Subway has built its reputation on offering customisable sandwich experiences, and the sauce selection plays a crucial role in this customisation. The Chipotle Sauce was introduced to cater to the growing trend of bold, spicy flavours in fast food, particularly among younger demographics seeking more adventurous taste experiences.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'This sauce has become a staple for heat-seekers visiting Subway locations worldwide. Its popularity has inspired numerous copycat recipes as fans attempt to recreate the signature smoky heat at home. The Chipotle Sauce represents Subway\'s commitment to offering diverse flavour profiles that cater to all taste preferences.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'ingredient.mayonnaise' }, quantity: '150', unit: 'g' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'ingredient.chipotle-peppers' }, quantity: '3', unit: 'tbsp', notes: 'finely minced' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: 'ingredient.adobo-sauce' }, quantity: '2', unit: 'tbsp' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: 'TYzLq1jkpxBbhvXHheQkfl' }, quantity: '1', unit: 'tbsp' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'EDdkNoabzuWM7YAKREkJ02' }, quantity: '1', unit: 'tsp' },
          { _key: '6', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSLEGb' }, quantity: '0.5', unit: 'tsp' },
          { _key: '7', ingredientRef: { _type: 'reference', _ref: 'DOyalXpxxR8GcURoHK5YxT' }, quantity: '0.25', unit: 'tsp' },
        ],
      },
    ],
    steps: [
      {
        _key: 'step1',
        step: [
          {
            _type: 'block',
            _key: 'block1',
            children: [{ _type: 'span', _key: 'span1', text: 'Finely mince the chipotle peppers to ensure they blend smoothly into the sauce. Place them in a mixing bowl along with the adobo sauce.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step2',
        step: [
          {
            _type: 'block',
            _key: 'block2',
            children: [{ _type: 'span', _key: 'span2', text: 'Add the mayonnaise, lime juice, garlic powder, cayenne pepper, and salt to the bowl. Using a whisk or fork, blend all ingredients together until the sauce is smooth and creamy.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step3',
        step: [
          {
            _type: 'block',
            _key: 'block3',
            children: [{ _type: 'span', _key: 'span3', text: 'Taste the sauce and adjust the spice level. For extra heat, add more cayenne pepper or additional chipotle peppers. For more tanginess, add extra lime juice.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step4',
        step: [
          {
            _type: 'block',
            _key: 'block4',
            children: [{ _type: 'span', _key: 'span4', text: 'Store in an airtight container in the refrigerator. Allow to chill for at least 1 hour before serving for the best flavour development. Keeps for up to 1 week refrigerated.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'Adjust the heat by varying the amount of chipotle peppers and cayenne pepper to suit your tolerance.',
      'For a smoother sauce, blend all ingredients in a food processor or blender.',
      'This sauce is excellent on grilled meats, tacos, burritos, and as a spicy dip.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'Is this sauce very spicy?',
        answer: 'Yes, the Chipotle Sauce has a significant kick. It\'s considerably spicier than the Southwest Sauce and is designed for those who enjoy heat. You can reduce the chipotle peppers for a milder version.',
      },
      {
        _key: 'faq2',
        question: 'Can I use fresh chillies instead of chipotle peppers?',
        answer: 'While you can use fresh chillies, you\'ll lose the distinctive smoky flavour that chipotle peppers provide. Chipotle peppers are smoked jalapeños, which give this sauce its signature taste.',
      },
    ],
    nutrition: {
      calories: 95,
      protein: 0.4,
      fat: 10,
      carbs: 1.8,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [
      { _type: 'reference', _ref: 'afe4166e-5071-432a-9a36-90a0e7317676' },
      { _type: 'reference', _ref: 'dbbb051c-6610-4f42-8959-cbe7da379cfa' },
    ],
    seoTitle: 'Subway Chipotle Sauce Recipe - Spicy Copycat Version',
    seoDescription: 'Recreate Subway\'s hot and smoky Chipotle Sauce at home! This fiery condiment is perfect for spice lovers and ready in just 5 minutes.',
  },
  {
    _type: 'recipe',
    title: 'Subway Mango Habanero Sauce Recipe',
    slug: { _type: 'slug', current: 'subway-mango-habanero-sauce' },
    description: 'Experience the perfect balance of sweet and spicy with this Subway Mango Habanero Sauce copycat. Tropical mango sweetness meets fiery habanero heat in this exciting condiment.',
    servings: 10,
    prepMin: 10,
    cookMin: 0,
    introText: 'The Mango Habanero Sauce is one of Subway\'s newer and more adventurous offerings, combining tropical fruit sweetness with intense heat from habanero peppers. This sauce delivers a complex flavour profile that starts sweet and fruity before building to a fiery finish. It\'s particularly popular with the Plant Picante and Chicken Breast subs, adding an exciting dimension to any sandwich. This homemade version captures that perfect sweet-heat balance that makes the original so addictive.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'Subway continuously innovates its sauce lineup to keep up with evolving consumer tastes and global flavour trends. The Mango Habanero Sauce represents the chain\'s willingness to experiment with bold, fusion-style condiments that appeal to adventurous eaters.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'This sauce reflects the growing popularity of sweet-heat combinations in modern cuisine, particularly among younger demographics. The tropical mango flavour adds an exotic twist while the habanero provides serious heat, creating a memorable taste experience that sets Subway apart from competitors.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'ingredient.mango-puree' }, quantity: '150', unit: 'g' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'ingredient.habanero-peppers' }, quantity: '1', unit: 'piece', notes: 'seeded and finely minced' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: 'ingredient.mayonnaise' }, quantity: '100', unit: 'g' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: '1697cbf9-443f-4a2d-bb50-1398885ee616' }, quantity: '2', unit: 'tbsp' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'TYzLq1jkpxBbhvXHheQkfl' }, quantity: '1', unit: 'tbsp' },
          { _key: '6', ingredientRef: { _type: 'reference', _ref: 'TYzLq1jkpxBbhvXHi2nYRQ' }, quantity: '1', unit: 'tsp' },
          { _key: '7', ingredientRef: { _type: 'reference', _ref: 'DOyalXpxxR8GcURoHK5YxT' }, quantity: '0.25', unit: 'tsp' },
        ],
      },
    ],
    steps: [
      {
        _key: 'step1',
        step: [
          {
            _type: 'block',
            _key: 'block1',
            children: [{ _type: 'span', _key: 'span1', text: 'Carefully seed and finely mince the habanero pepper. Be sure to wear gloves when handling habaneros as they are extremely hot. Wash your hands thoroughly after handling.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step2',
        step: [
          {
            _type: 'block',
            _key: 'block2',
            children: [{ _type: 'span', _key: 'span2', text: 'In a blender or food processor, combine the mango puree, minced habanero, mayonnaise, honey, lime juice, agave nectar, and salt. Blend until completely smooth and well combined.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step3',
        step: [
          {
            _type: 'block',
            _key: 'block3',
            children: [{ _type: 'span', _key: 'span3', text: 'Taste carefully (the sauce is hot!) and adjust sweetness or heat as desired. Add more honey for sweetness or more habanero for heat. Remember that the heat will intensify as the sauce sits.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step4',
        step: [
          {
            _type: 'block',
            _key: 'block4',
            children: [{ _type: 'span', _key: 'span4', text: 'Transfer to an airtight container and refrigerate for at least 2 hours before serving to allow flavours to develop. The sauce will keep for up to 5 days in the refrigerator.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'Start with half a habanero if you\'re unsure about the heat level – you can always add more.',
      'Fresh mango can be used instead of mango puree. Simply blend ripe mango until smooth.',
      'This sauce is fantastic as a glaze for grilled chicken or as a dipping sauce for spring rolls.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'Can I make this less spicy?',
        answer: 'Absolutely! Reduce the amount of habanero pepper or substitute with a milder chilli like jalapeño. You can also add more mango puree to dilute the heat while maintaining the flavour.',
      },
      {
        _key: 'faq2',
        question: 'What can I use if I can\'t find mango puree?',
        answer: 'You can make your own by blending fresh or frozen mango until smooth, or substitute with mango juice (though it will be thinner) or even peach puree for a different fruit flavour.',
      },
    ],
    nutrition: {
      calories: 75,
      protein: 0.3,
      fat: 5,
      carbs: 8,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [
      { _type: 'reference', _ref: 'afe4166e-5071-432a-9a36-90a0e7317676' },
      { _type: 'reference', _ref: 'dbbb051c-6610-4f42-8959-cbe7da379cfa' },
    ],
    seoTitle: 'Subway Mango Habanero Sauce Recipe - Sweet & Spicy',
    seoDescription: 'Make Subway\'s tropical Mango Habanero Sauce at home! This sweet and fiery sauce combines fruity mango with habanero heat – perfect for bold sandwiches.',
  },
  {
    _type: 'recipe',
    title: 'Subway Honey Mustard Sauce Recipe',
    slug: { _type: 'slug', current: 'subway-honey-mustard-sauce' },
    description: 'Create Subway\'s classic Honey Mustard sauce at home with this easy recipe. Sweet, tangy, and perfectly balanced, this versatile condiment enhances any sandwich or salad.',
    servings: 8,
    prepMin: 3,
    cookMin: 0,
    introText: 'Subway\'s Honey Mustard is a timeless classic that perfectly balances sweetness with tangy mustard flavour. This smooth, light sauce is a perennial favourite among customers who prefer milder condiments that still pack plenty of flavour. It pairs beautifully with turkey breast, chicken, and the Veggie Delite, adding a gentle sweetness without overwhelming other ingredients. This homemade version is incredibly simple to make and tastes just like the original.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'Honey Mustard has been a staple of Subway\'s sauce lineup since the early days of the chain. It represents the more traditional, crowd-pleasing flavours that have helped establish Subway as a family-friendly dining option. Unlike some of the newer, more adventurous sauces, Honey Mustard appeals to a broad demographic.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'This sauce exemplifies Subway\'s commitment to offering options for all tastes. While the brand has expanded its sauce selection to include spicier and more exotic flavours, classics like Honey Mustard remain essential for customers seeking familiar, comforting tastes that complement rather than dominate their sandwiches.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'ingredient.mayonnaise' }, quantity: '100', unit: 'g' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'a168f56e-32ca-457c-971c-fe83b580de14' }, quantity: '60', unit: 'g' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: '1697cbf9-443f-4a2d-bb50-1398885ee616' }, quantity: '3', unit: 'tbsp' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB1Lie4' }, quantity: '1', unit: 'tsp' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'DOyalXpxxR8GcURoHK5YxT' }, quantity: '0.125', unit: 'tsp' },
        ],
      },
    ],
    steps: [
      {
        _key: 'step1',
        step: [
          {
            _type: 'block',
            _key: 'block1',
            children: [{ _type: 'span', _key: 'span1', text: 'In a small bowl, whisk together the mayonnaise and Dijon mustard until smooth and well combined.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step2',
        step: [
          {
            _type: 'block',
            _key: 'block2',
            children: [{ _type: 'span', _key: 'span2', text: 'Add the honey, lemon juice, and salt. Whisk thoroughly until all ingredients are fully incorporated and the sauce is smooth and creamy.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step3',
        step: [
          {
            _type: 'block',
            _key: 'block3',
            children: [{ _type: 'span', _key: 'span3', text: 'Taste and adjust the balance of honey and mustard to your preference. For a sweeter sauce, add more honey; for more tang, add extra mustard.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step4',
        step: [
          {
            _type: 'block',
            _key: 'block4',
            children: [{ _type: 'span', _key: 'span4', text: 'Store in an airtight container in the refrigerator. The sauce can be used immediately but tastes even better after resting for 30 minutes. Keeps for up to 2 weeks refrigerated.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'Use good quality Dijon mustard for the best flavour. Avoid using American yellow mustard as it will produce a different taste.',
      'This sauce makes an excellent salad dressing when thinned with a tablespoon of water or apple cider vinegar.',
      'Try using this as a dipping sauce for chicken tenders, pretzels, or roasted vegetables.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'Can I make this with wholegrain mustard?',
        answer: 'You can, but it will change the texture and flavour profile. Wholegrain mustard will give you a more rustic, textured sauce with a stronger mustard flavour. It\'s delicious but different from Subway\'s smooth version.',
      },
      {
        _key: 'faq2',
        question: 'Is this sauce gluten-free?',
        answer: 'The sauce itself should be gluten-free, but always check the labels on your mayonnaise and mustard to ensure they don\'t contain any gluten-containing additives.',
      },
    ],
    nutrition: {
      calories: 85,
      protein: 0.5,
      fat: 7,
      carbs: 6,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [{ _type: 'reference', _ref: 'afe4166e-5071-432a-9a36-90a0e7317676' }],
    seoTitle: 'Subway Honey Mustard Sauce Recipe - Easy Copycat',
    seoDescription: 'Recreate Subway\'s sweet and tangy Honey Mustard sauce in just 3 minutes! Perfect for sandwiches, salads, and dipping.',
  },
  {
    _type: 'recipe',
    title: 'Subway Sweet Onion Sauce Recipe',
    slug: { _type: 'slug', current: 'subway-sweet-onion-sauce' },
    description: 'Make Subway\'s beloved Sweet Onion Sauce at home with this simple recipe. This sweet, light teriyaki-style sauce is a long-time customer favourite for good reason.',
    servings: 10,
    prepMin: 5,
    cookMin: 10,
    introText: 'The Sweet Onion Sauce is arguably Subway\'s most iconic condiment, having achieved cult status among regular customers. This teriyaki-style sauce offers a delicate balance of sweetness and savoury onion flavour that enhances sandwiches without overpowering them. It\'s particularly popular with the Italian B.M.T. and Chicken Breast subs, though it works beautifully with virtually any filling. This homemade version captures the essence of the original with just a few simple ingredients.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'Sweet Onion Sauce has been a Subway staple for decades and is frequently cited as customers\' all-time favourite sauce. Its popularity has remained consistent even as the chain has introduced newer, trendier options. The sauce even lent its name to the Sweet Onion Chicken Teriyaki sub, one of Subway\'s signature sandwiches.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'The enduring appeal of this sauce lies in its versatility and mass appeal. It\'s sweet enough to satisfy those who prefer milder flavours, yet complex enough to add real character to a sandwich. For many Subway fans, no sub is complete without a generous drizzle of Sweet Onion Sauce.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'ta5ombC1LENAVJlLOPZm7G' }, quantity: '1', unit: 'piece', notes: 'finely diced' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'ta5ombC1LENAVJlLOOx0Sl' }, quantity: '1', unit: 'tbsp' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB1Wu5Q' }, quantity: '80', unit: 'g' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: 'OtSwRNXAIYzjp5mWDQdBRx' }, quantity: '60', unit: 'ml' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'ingredient.soy-sauce' }, quantity: '2', unit: 'tbsp' },
          { _key: '6', ingredientRef: { _type: 'reference', _ref: 'EDdkNoabzuWM7YAKREf51B' }, quantity: '1', unit: 'tbsp' },
          { _key: '7', ingredientRef: { _type: 'reference', _ref: 'fQh03pUyiAChIhIJQGsrll' }, quantity: '1', unit: 'tsp' },
          { _key: '8', ingredientRef: { _type: 'reference', _ref: '9c13e0f5-4ee2-4e42-a83a-1118b36df064' }, quantity: '50', unit: 'ml' },
        ],
      },
    ],
    steps: [
      {
        _key: 'step1',
        step: [
          {
            _type: 'block',
            _key: 'block1',
            children: [{ _type: 'span', _key: 'span1', text: 'Heat the vegetable oil in a small saucepan over medium heat. Add the finely diced white onion and sauté for 5-7 minutes until softened and translucent but not browned.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step2',
        step: [
          {
            _type: 'block',
            _key: 'block2',
            children: [{ _type: 'span', _key: 'span2', text: 'Add the black treacle (or molasses), white vinegar, soy sauce, and beef stock to the pan. Stir well to combine all ingredients.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step3',
        step: [
          {
            _type: 'block',
            _key: 'block3',
            children: [{ _type: 'span', _key: 'span3', text: 'In a small cup, mix the cornstarch with the water to create a slurry. Slowly add this to the saucepan while stirring constantly to avoid lumps.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step4',
        step: [
          {
            _type: 'block',
            _key: 'block4',
            children: [{ _type: 'span', _key: 'span4', text: 'Bring the mixture to a gentle simmer and cook for 3-4 minutes, stirring frequently, until the sauce thickens to a syrupy consistency. Remove from heat and allow to cool completely before transferring to an airtight container. Refrigerate for up to 2 weeks.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'The sauce will thicken further as it cools, so don\'t worry if it seems thin while cooking.',
      'For a smoother sauce, blend it in a food processor after cooking and cooling.',
      'This sauce is excellent as a glaze for grilled meats or as a stir-fry sauce.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'Can I use brown sugar instead of black treacle?',
        answer: 'Yes, you can substitute with dark brown sugar or molasses. The flavour will be slightly different but still delicious. Use the same amount.',
      },
      {
        _key: 'faq2',
        question: 'Why is my sauce too thin?',
        answer: 'Make sure you\'re using enough cornstarch and allowing the sauce to simmer long enough. It should coat the back of a spoon. You can always make more cornstarch slurry and add it if needed.',
      },
    ],
    nutrition: {
      calories: 45,
      protein: 0.5,
      fat: 0.8,
      carbs: 9,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [{ _type: 'reference', _ref: 'afe4166e-5071-432a-9a36-90a0e7317676' }],
    seoTitle: 'Subway Sweet Onion Sauce Recipe - Teriyaki-Style Copycat',
    seoDescription: 'Make Subway\'s legendary Sweet Onion Sauce at home! This sweet, light teriyaki-style sauce is perfect for sandwiches and wraps.',
  },
  {
    _type: 'recipe',
    title: 'Subway Peppercorn Ranch Sauce Recipe',
    slug: { _type: 'slug', current: 'subway-peppercorn-ranch-sauce' },
    description: 'Recreate Subway\'s creamy Peppercorn Ranch Sauce with this easy copycat recipe. Buttery, cool, and herby, this comfort sauce is perfect for any sandwich.',
    servings: 8,
    prepMin: 5,
    cookMin: 0,
    introText: 'Subway\'s Peppercorn Ranch Sauce is the ultimate comfort condiment, offering a cool, creamy reprieve with subtle herb notes and a gentle peppery kick. This buttery smooth sauce is particularly beloved by those who prefer milder flavours that still add character to their subs. It pairs exceptionally well with the Chicken Classic and Plant Supreme sandwiches, providing a rich, cooling element that balances crispy vegetables and savoury proteins. This homemade version is quick to prepare and delivers that same comforting creaminess.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'Ranch dressing and its variations have become staples of American fast-food culture, and Subway\'s Peppercorn Ranch is the chain\'s take on this classic. By adding cracked black pepper and enhancing the herb profile, Subway created a sauce that offers familiarity with a subtle twist.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'This sauce appeals to customers seeking comfort and familiarity in their meals. It\'s particularly popular with children and those who prefer gentler flavours. The Peppercorn Ranch represents Subway\'s understanding that not all customers want bold, spicy experiences – sometimes a smooth, cool sauce is exactly what a sandwich needs.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'ingredient.ranch-dressing' }, quantity: '200', unit: 'g' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'ta5ombC1LENAVJlLOP2HRG' }, quantity: '1', unit: 'tsp', notes: 'coarsely ground' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: 'ingredient.dried-dill' }, quantity: '0.5', unit: 'tsp' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB1Vsps' }, quantity: '1', unit: 'tbsp', notes: 'finely chopped' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB0fRLm' }, quantity: '1', unit: 'tsp', notes: 'finely chopped' },
          { _key: '6', ingredientRef: { _type: 'reference', _ref: 'EDdkNoabzuWM7YAKREkJ02' }, quantity: '0.25', unit: 'tsp' },
        ],
      },
    ],
    steps: [
      {
        _key: 'step1',
        step: [
          {
            _type: 'block',
            _key: 'block1',
            children: [{ _type: 'span', _key: 'span1', text: 'In a medium bowl, combine the ranch dressing with the coarsely ground black pepper. Use freshly cracked pepper for the best flavour and texture.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step2',
        step: [
          {
            _type: 'block',
            _key: 'block2',
            children: [{ _type: 'span', _key: 'span2', text: 'Add the dried dill, finely chopped chives, chopped parsley, and garlic powder. Stir thoroughly until all herbs and spices are evenly distributed throughout the sauce.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step3',
        step: [
          {
            _type: 'block',
            _key: 'block3',
            children: [{ _type: 'span', _key: 'span3', text: 'Taste and adjust seasonings as desired. For more peppery heat, add extra black pepper; for more herbaceous flavour, increase the dill and parsley.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step4',
        step: [
          {
            _type: 'block',
            _key: 'block4',
            children: [{ _type: 'span', _key: 'span4', text: 'Transfer to an airtight container and refrigerate for at least 1 hour before serving to allow the flavours to meld. The sauce will keep for up to 1 week refrigerated.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'Use a good quality ranch dressing as your base – it makes a significant difference to the final flavour.',
      'Fresh herbs can be substituted for dried, but use three times the amount.',
      'This sauce makes an excellent dip for chicken wings, vegetable crudités, or chips.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'Can I make this with buttermilk ranch?',
        answer: 'Absolutely! Buttermilk ranch will give you a tangier, slightly thinner sauce that\'s equally delicious. You may want to add a touch less garlic powder as buttermilk ranch often has stronger garlic notes.',
      },
      {
        _key: 'faq2',
        question: 'Is this sauce vegetarian?',
        answer: 'It depends on the ranch dressing you use. Check the label of your base ranch dressing, as some contain anchovies or other fish products. Many vegetarian ranch dressings are available.',
      },
    ],
    nutrition: {
      calories: 115,
      protein: 0.5,
      fat: 12,
      carbs: 1.5,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [{ _type: 'reference', _ref: 'afe4166e-5071-432a-9a36-90a0e7317676' }],
    seoTitle: 'Subway Peppercorn Ranch Sauce Recipe - Creamy Copycat',
    seoDescription: 'Make Subway\'s cool and creamy Peppercorn Ranch Sauce at home in 5 minutes! Perfect for sandwiches, salads, and dipping.',
  },
  {
    _type: 'recipe',
    title: 'Subway Garlic and Herb Sauce Recipe',
    slug: { _type: 'slug', current: 'subway-garlic-and-herb-sauce' },
    description: 'Create Subway\'s popular Garlic and Herb Sauce at home with this simple recipe. Creamy, garlicky, and aromatic, this sauce is comforting and packed with flavour.',
    servings: 8,
    prepMin: 5,
    cookMin: 0,
    introText: 'The Garlic and Herb Sauce from Subway is a customer favourite for its bold garlic flavour tempered by aromatic herbs and a smooth, creamy texture. This versatile sauce adds depth and richness to any sandwich without being overly heavy. It\'s particularly popular with the Philly Steak and Meatball Marinara subs, where it enhances the savoury meat flavours beautifully. This homemade version captures that perfect balance of garlic intensity and herbal freshness that makes the original so addictive.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'Garlic and Herb Sauce represents Subway\'s European-inspired offerings, drawing on the popularity of garlic aioli and herb-infused sauces in Mediterranean cuisine. It appeals to customers seeking robust, savoury flavours that enhance rather than mask their sandwich fillings.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'This sauce has become particularly popular in Subway locations across Europe and the UK, where garlic-forward condiments are especially appreciated. It demonstrates Subway\'s ability to adapt its offerings to regional taste preferences while maintaining consistency across its global network of restaurants.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'ingredient.mayonnaise' }, quantity: '200', unit: 'g' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'ta5ombC1LENAVJlLOOn6VG' }, quantity: '3', unit: 'clove', notes: 'minced' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB0fRLm' }, quantity: '2', unit: 'tbsp', notes: 'finely chopped' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: 'TYzLq1jkpxBbhvXHhm27Uq' }, quantity: '1', unit: 'tbsp', notes: 'finely chopped' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'ingredient.garlic-herb-seasoning' }, quantity: '1', unit: 'tsp' },
          { _key: '6', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB1Lie4' }, quantity: '1', unit: 'tsp' },
          { _key: '7', ingredientRef: { _type: 'reference', _ref: 'DOyalXpxxR8GcURoHK5YxT' }, quantity: '0.25', unit: 'tsp' },
          { _key: '8', ingredientRef: { _type: 'reference', _ref: 'ta5ombC1LENAVJlLOP2HRG' }, quantity: '0.25', unit: 'tsp' },
        ],
      },
    ],
    steps: [
      {
        _key: 'step1',
        step: [
          {
            _type: 'block',
            _key: 'block1',
            children: [{ _type: 'span', _key: 'span1', text: 'Finely mince the fresh garlic cloves. For a smoother sauce, you can use a garlic press or microplane grater.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step2',
        step: [
          {
            _type: 'block',
            _key: 'block2',
            children: [{ _type: 'span', _key: 'span2', text: 'In a medium bowl, combine the mayonnaise with the minced garlic, chopped parsley, chopped basil, and garlic and herb seasoning. Mix thoroughly.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step3',
        step: [
          {
            _type: 'block',
            _key: 'block3',
            children: [{ _type: 'span', _key: 'span3', text: 'Add the lemon juice, salt, and black pepper. Whisk all ingredients together until smooth and well combined.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step4',
        step: [
          {
            _type: 'block',
            _key: 'block4',
            children: [{ _type: 'span', _key: 'span4', text: 'Taste and adjust seasonings. For more garlic intensity, add an extra clove; for more freshness, increase the herbs. Transfer to an airtight container and refrigerate for at least 1 hour before serving to allow flavours to develop. Keeps for up to 1 week refrigerated.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'Fresh herbs make a significant difference in this recipe. If using dried herbs, use one-third the amount.',
      'For a lighter version, substitute half the mayonnaise with Greek yogurt.',
      'This sauce is fantastic as a dip for breadsticks, a spread for garlic bread, or mixed into pasta.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'Can I use garlic powder instead of fresh garlic?',
        answer: 'You can, but fresh garlic provides a much better flavour and aroma. If you must use garlic powder, use about 1 teaspoon, but the sauce won\'t taste quite as vibrant.',
      },
      {
        _key: 'faq2',
        question: 'Why does my sauce taste too strong?',
        answer: 'Raw garlic can be quite pungent. Make sure you\'re using the amount specified, and remember that the flavour will mellow after refrigeration. If it\'s still too strong, add a bit more mayonnaise to dilute it.',
      },
    ],
    nutrition: {
      calories: 105,
      protein: 0.5,
      fat: 11,
      carbs: 1,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [{ _type: 'reference', _ref: 'afe4166e-5071-432a-9a36-90a0e7317676' }],
    seoTitle: 'Subway Garlic and Herb Sauce Recipe - Creamy Copycat',
    seoDescription: 'Make Subway\'s aromatic Garlic and Herb Sauce at home in 5 minutes! This creamy, garlicky sauce is perfect for sandwiches and more.',
  },
];

async function createIngredientsAndRecipes() {
  console.log('Creating ingredients...');

  for (const ingredient of ingredients) {
    try {
      await client.createOrReplace(ingredient);
      console.log(`✓ Created/updated ingredient: ${ingredient.name}`);
    } catch (error) {
      console.error(`✗ Failed to create ingredient ${ingredient.name}:`, error);
    }
  }

  console.log('\nCreating recipes...');

  for (const recipe of recipes) {
    try {
      const result = await client.create(recipe);
      console.log(`✓ Created recipe: ${recipe.title} (${result._id})`);
    } catch (error) {
      console.error(`✗ Failed to create recipe ${recipe.title}:`, error);
    }
  }

  console.log('\n✅ All done! Created 7 ingredients and 7 Subway sauce recipes.');
}

createIngredientsAndRecipes();
