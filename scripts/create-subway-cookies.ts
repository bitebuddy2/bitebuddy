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
    _id: 'ingredient.white-chocolate-chips',
    _type: 'ingredient',
    name: 'White chocolate chips',
    allergens: ['Milk', 'Soya'],
    kcal100: 539,
    protein100: 5.9,
    fat100: 32,
    carbs100: 59,
  },
  {
    _id: 'ingredient.milk-chocolate-chips',
    _type: 'ingredient',
    name: 'Milk chocolate chips',
    allergens: ['Milk', 'Soya'],
    kcal100: 535,
    protein100: 7.7,
    fat100: 32,
    carbs100: 58,
  },
  {
    _id: 'ingredient.dark-chocolate-chips',
    _type: 'ingredient',
    name: 'Dark chocolate chips',
    allergens: ['Soya'],
    kcal100: 501,
    protein100: 5.5,
    fat100: 32,
    carbs100: 52,
  },
  {
    _id: 'ingredient.macadamia-nuts',
    _type: 'ingredient',
    name: 'Macadamia nuts',
    allergens: ['Tree nuts'],
    kcal100: 718,
    protein100: 7.9,
    fat100: 76,
    carbs100: 14,
  },
  {
    _id: 'ingredient.dutch-cocoa-powder',
    _type: 'ingredient',
    name: 'Dutch cocoa powder',
    allergens: [],
    kcal100: 228,
    protein100: 19.6,
    fat100: 13.7,
    carbs100: 57.9,
  },
  {
    _id: 'ingredient.freeze-dried-raspberries',
    _type: 'ingredient',
    name: 'Freeze-dried raspberries',
    allergens: [],
    kcal100: 349,
    protein100: 6.3,
    fat100: 2.8,
    carbs100: 78,
  },
  {
    _id: 'ingredient.cheesecake-pudding-mix',
    _type: 'ingredient',
    name: 'Cheesecake instant pudding mix',
    allergens: ['Milk'],
    kcal100: 380,
    protein100: 0,
    fat100: 0,
    carbs100: 95,
  },
  {
    _id: 'ingredient.m-and-ms',
    _type: 'ingredient',
    name: 'M&Ms chocolate candies',
    allergens: ['Milk', 'Soya'],
    kcal100: 492,
    protein100: 4.5,
    fat100: 21,
    carbs100: 71,
  },
  {
    _id: 'ingredient.light-brown-sugar',
    _type: 'ingredient',
    name: 'Light brown sugar',
    allergens: [],
    kcal100: 380,
    protein100: 0,
    fat100: 0,
    carbs100: 98,
  },
];

// Recipe definitions - 5 Subway cookies
const recipes = [
  {
    _type: 'recipe',
    title: 'Subway Chocolate Chunk Cookie Recipe',
    slug: { _type: 'slug', current: 'subway-chocolate-chunk-cookie' },
    description: 'Recreate Subway\'s famous chocolate chunk cookies at home with this easy copycat recipe. Soft, chewy, and loaded with chocolate chips – these cookies taste just like the real thing!',
    servings: 16,
    prepMin: 15,
    cookMin: 12,
    introText: 'Subway\'s chocolate chunk cookies are legendary – soft and gooey in the centre with perfectly crisp edges, and absolutely packed with chocolate chips. These oversized cookies have become just as iconic as the sandwiches themselves, tempting customers from their display case near the till. The secret to achieving that signature Subway texture lies in the perfect balance of butter and sugar, along with a slightly underbaked centre. This copycat recipe delivers all the indulgence of the original, allowing you to enjoy these bakery-style cookies fresh from your own oven.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'Subway introduced their freshly baked cookies as a natural extension of their "Eat Fresh" philosophy, offering customers a sweet treat to complement their made-to-order sandwiches. The cookies quickly became a profitable sideline, with many customers unable to resist adding one (or more) to their meal.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'The chocolate chunk cookie, with its generous chocolate chip content and soft-baked texture, has remained one of Subway\'s best-selling cookie varieties for decades. The aroma of freshly baking cookies wafting through Subway locations has become part of the brand experience, often cited as one of the reasons customers choose Subway over competitors.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB0fR96' }, quantity: '225', unit: 'g', notes: 'softened' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'ingredient.light-brown-sugar' }, quantity: '150', unit: 'g', notes: 'packed' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: 'ta5ombC1LENAVJlLOOfi9l' }, quantity: '100', unit: 'g' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB1Fg7G' }, quantity: '2', unit: 'piece', notes: 'room temperature' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSGNIh' }, quantity: '2', unit: 'tsp' },
          { _key: '6', ingredientRef: { _type: 'reference', _ref: 'ingredient.plain-flour' }, quantity: '280', unit: 'g' },
          { _key: '7', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSN1Rs' }, quantity: '1', unit: 'tsp' },
          { _key: '8', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSGNwc' }, quantity: '1', unit: 'tsp' },
          { _key: '9', ingredientRef: { _type: 'reference', _ref: 'DOyalXpxxR8GcURoHK5YxT' }, quantity: '1', unit: 'tsp' },
          { _key: '10', ingredientRef: { _type: 'reference', _ref: 'ingredient.dark-chocolate-chips' }, quantity: '200', unit: 'g' },
          { _key: '11', ingredientRef: { _type: 'reference', _ref: 'ingredient.milk-chocolate-chips' }, quantity: '100', unit: 'g' },
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
            children: [{ _type: 'span', _key: 'span1', text: 'Preheat your oven to 175°C (350°F). Line two large baking sheets with parchment paper and set aside.' }],
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
            children: [{ _type: 'span', _key: 'span2', text: 'In a large mixing bowl, cream together the softened butter, light brown sugar, and granulated sugar using an electric mixer on medium speed for 3-4 minutes until light and fluffy. The mixture should become pale and increase in volume.' }],
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
            children: [{ _type: 'span', _key: 'span3', text: 'Add the eggs one at a time, beating well after each addition. Mix in the vanilla extract until fully incorporated.' }],
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
            children: [{ _type: 'span', _key: 'span4', text: 'In a separate bowl, whisk together the plain flour, baking soda, baking powder, and salt. Gradually add the dry ingredients to the wet mixture, mixing on low speed until just combined. Be careful not to overmix.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step5',
        step: [
          {
            _type: 'block',
            _key: 'block5',
            children: [{ _type: 'span', _key: 'span5', text: 'Fold in both the dark and milk chocolate chips using a spatula, ensuring they\'re evenly distributed throughout the dough. The dough will be quite thick and sticky.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step6',
        step: [
          {
            _type: 'block',
            _key: 'block6',
            children: [{ _type: 'span', _key: 'span6', text: 'Using a cookie scoop or spoon, portion the dough into 16 balls (approximately 60g each). Place them on the prepared baking sheets, leaving about 5cm (2 inches) between each cookie as they will spread during baking.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step7',
        step: [
          {
            _type: 'block',
            _key: 'block7',
            children: [{ _type: 'span', _key: 'span7', text: 'Bake for 10-12 minutes, or until the edges are set and lightly golden but the centres still look slightly underdone. They will appear soft but will firm up as they cool.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step8',
        step: [
          {
            _type: 'block',
            _key: 'block8',
            children: [{ _type: 'span', _key: 'span8', text: 'Leave the cookies on the baking sheet for 5 minutes to set, then transfer to a wire rack. For the authentic Subway experience, enjoy them while still slightly warm with a cold glass of milk.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'For extra-thick cookies, refrigerate the dough for 1-2 hours before baking. This prevents excessive spreading.',
      'Don\'t overbake! The cookies should look slightly underdone in the centre when you remove them from the oven.',
      'Store in an airtight container for up to 5 days, or freeze unbaked dough balls for up to 3 months.',
      'For an even more indulgent treat, press a few extra chocolate chips on top of each dough ball before baking.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'Why are my cookies spreading too much?',
        answer: 'Make sure your butter is softened but not melted, and try chilling the dough for 30 minutes before baking. Also ensure your oven is properly preheated to the correct temperature.',
      },
      {
        _key: 'faq2',
        question: 'Can I use only one type of chocolate chip?',
        answer: 'Yes! You can use all dark chocolate, all milk chocolate, or any combination you prefer. The total amount should be around 300g of chocolate chips.',
      },
      {
        _key: 'faq3',
        question: 'How do I get that soft, gooey centre?',
        answer: 'The secret is to slightly underbake the cookies. Remove them when the edges are set but the centres still look soft and puffy. They\'ll continue cooking on the hot baking sheet after being removed from the oven.',
      },
    ],
    nutrition: {
      calories: 285,
      protein: 3.2,
      fat: 14,
      carbs: 38,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [{ _type: 'reference', _ref: 'e8175e8e-5cf7-49ed-b93a-eca14d1d9947' }],
    seoTitle: 'Subway Chocolate Chunk Cookie Recipe - Easy Copycat',
    seoDescription: 'Make Subway\'s famous chocolate chunk cookies at home! Soft, chewy, and loaded with chocolate – this copycat recipe tastes just like the original.',
  },
  {
    _type: 'recipe',
    title: 'Subway White Chocolate Macadamia Cookie Recipe',
    slug: { _type: 'slug', current: 'subway-white-chocolate-macadamia-cookie' },
    description: 'Create Subway\'s luxurious white chocolate macadamia nut cookies at home. These buttery cookies are studded with creamy white chocolate and crunchy macadamia nuts for an indulgent treat.',
    servings: 12,
    prepMin: 15,
    cookMin: 12,
    introText: 'The White Chocolate Macadamia cookie is Subway\'s premium cookie offering, combining rich white chocolate with buttery macadamia nuts for a sophisticated flavour profile. This cookie appeals to those seeking something a bit more refined than the classic chocolate chip, offering a perfect balance of sweet white chocolate and the distinctive crunch of macadamia nuts. The cookies have a slightly crisp exterior that gives way to a soft, buttery centre packed with indulgent mix-ins. This homemade version captures that bakery-quality taste and texture, bringing the Subway experience to your kitchen.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'Subway introduced the white chocolate macadamia cookie as a more upscale alternative to their traditional offerings, targeting customers with more sophisticated taste preferences. The combination of white chocolate and macadamia nuts has long been associated with premium baked goods, and Subway successfully brought this bakery favourite to the fast-food environment.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'This cookie variety demonstrates Subway\'s commitment to offering diverse options that cater to different taste preferences. While it\'s priced slightly higher than basic cookie varieties in some markets, it remains a popular choice for customers looking to treat themselves to something special with their meal.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'ingredient.plain-flour' }, quantity: '220', unit: 'g' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'B6YuB78WQfXgiCeBjkOwQI' }, quantity: '1', unit: 'tsp' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSGNwc' }, quantity: '0.5', unit: 'tsp' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: 'DOyalXpxxR8GcURoHK5YxT' }, quantity: '0.25', unit: 'tsp' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'ta5ombC1LENAVJlLOOfi9l' }, quantity: '65', unit: 'g' },
          { _key: '6', ingredientRef: { _type: 'reference', _ref: 'ingredient.light-brown-sugar' }, quantity: '125', unit: 'g', notes: 'packed' },
          { _key: '7', ingredientRef: { _type: 'reference', _ref: 'ta5ombC1LENAVJlLOOx0Sl' }, quantity: '110', unit: 'ml' },
          { _key: '8', ingredientRef: { _type: 'reference', _ref: 'ingredient.milk' }, quantity: '60', unit: 'ml' },
          { _key: '9', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSGNIh' }, quantity: '0.5', unit: 'tsp' },
          { _key: '10', ingredientRef: { _type: 'reference', _ref: 'ingredient.white-chocolate-chips' }, quantity: '100', unit: 'g' },
          { _key: '11', ingredientRef: { _type: 'reference', _ref: 'ingredient.macadamia-nuts' }, quantity: '60', unit: 'g', notes: 'roughly chopped' },
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
            children: [{ _type: 'span', _key: 'span1', text: 'Preheat your oven to 180°C (350°F). Line a large baking sheet with parchment paper and set aside.' }],
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
            children: [{ _type: 'span', _key: 'span2', text: 'In a large bowl, sift together the plain flour, baking powder, baking soda, and salt. Set this dry mixture aside.' }],
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
            children: [{ _type: 'span', _key: 'span3', text: 'In a separate large bowl, whisk together the white sugar and light brown sugar. Add the vegetable oil and whisk vigorously for about 1 minute until well combined and slightly emulsified.' }],
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
            children: [{ _type: 'span', _key: 'span4', text: 'Add the milk and vanilla extract to the sugar mixture and whisk until fully incorporated and smooth.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step5',
        step: [
          {
            _type: 'block',
            _key: 'block5',
            children: [{ _type: 'span', _key: 'span5', text: 'Pour the wet ingredients into the dry ingredients and mix with a spatula or wooden spoon until just combined. Don\'t overmix – it\'s fine if there are a few small lumps.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step6',
        step: [
          {
            _type: 'block',
            _key: 'block6',
            children: [{ _type: 'span', _key: 'span6', text: 'Gently fold in the white chocolate chips and chopped macadamia nuts until evenly distributed throughout the dough.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step7',
        step: [
          {
            _type: 'block',
            _key: 'block7',
            children: [{ _type: 'span', _key: 'span7', text: 'For thicker cookies, cover the bowl and refrigerate the dough for 1 hour. Otherwise, proceed directly to baking. Using a cookie scoop or spoon, form 12 equal-sized dough balls and place them on the prepared baking sheet, spacing them about 5cm apart.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step8',
        step: [
          {
            _type: 'block',
            _key: 'block8',
            children: [{ _type: 'span', _key: 'span8', text: 'Bake for 10-12 minutes until the edges are lightly golden and set. The centres should still look slightly soft. Remove from the oven and let cool on the baking sheet for 10 minutes before transferring to a wire rack to cool completely.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'Toast the macadamia nuts lightly in a dry pan before chopping for enhanced flavour and crunch.',
      'This recipe uses oil instead of butter, which creates a slightly different texture – more crisp on the outside while maintaining a soft centre.',
      'Don\'t skip the chilling step if you want thicker, bakery-style cookies. The cold dough spreads less during baking.',
      'White chocolate can burn easily, so watch your cookies carefully during the last few minutes of baking.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'Can I substitute the macadamia nuts?',
        answer: 'Yes! Pecans, walnuts, or cashews work well as substitutes, though they\'ll give a different flavour. Macadamias have a unique buttery taste that\'s hard to replicate, but these alternatives are delicious in their own right.',
      },
      {
        _key: 'faq2',
        question: 'Why does this recipe use oil instead of butter?',
        answer: 'Oil creates a slightly different texture than butter – these cookies are a bit crisper on the outside while staying soft inside. It also makes the recipe easier since you don\'t need to soften butter or worry about overmixing.',
      },
      {
        _key: 'faq3',
        question: 'Can I make these dairy-free?',
        answer: 'Yes! Use a plant-based milk and dairy-free white chocolate chips. The texture will be virtually identical to the original recipe.',
      },
    ],
    nutrition: {
      calories: 295,
      protein: 3.5,
      fat: 16,
      carbs: 36,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [{ _type: 'reference', _ref: 'e8175e8e-5cf7-49ed-b93a-eca14d1d9947' }],
    seoTitle: 'Subway White Chocolate Macadamia Cookie Recipe - Copycat',
    seoDescription: 'Recreate Subway\'s premium white chocolate macadamia cookies at home! Buttery, indulgent, and packed with white chocolate and crunchy nuts.',
  },
  {
    _type: 'recipe',
    title: 'Subway Rainbow Chocolate Chip Cookie Recipe',
    slug: { _type: 'slug', current: 'subway-rainbow-chocolate-chip-cookie' },
    description: 'Bring the fun home with Subway\'s colourful rainbow chocolate chip cookies. Loaded with M&Ms and chocolate chips, these cheerful cookies are perfect for kids and adults alike!',
    servings: 16,
    prepMin: 15,
    cookMin: 10,
    introText: 'The Rainbow Chocolate Chip cookie is Subway\'s most playful and visually appealing cookie variety, featuring colourful M&Ms alongside traditional chocolate chips. This cookie is particularly popular with children and those young at heart, offering a fun twist on the classic chocolate chip cookie. The combination of crunchy candy shells and melty chocolate creates an exciting textural experience, while the bright colours make these cookies impossible to resist. They\'re soft, chewy, and bursting with sweetness in every bite – a true celebration of indulgence that brings smiles to faces of all ages.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'Subway\'s Rainbow Chocolate Chip cookie represents the brand\'s playful side, designed to appeal to families and younger customers. The addition of colourful M&Ms transforms a classic cookie into something more exciting and Instagram-worthy, fitting perfectly with modern food trends that celebrate visual appeal alongside taste.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'This cookie variety has proven particularly successful during school holidays and special occasions, often being the first choice for children visiting Subway with their parents. The bright colours and familiar candy pieces create an immediate appeal that goes beyond taste, making it one of the most photographed items in Subway\'s bakery lineup.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB0fR96' }, quantity: '200', unit: 'g', notes: 'softened' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'ingredient.light-brown-sugar' }, quantity: '160', unit: 'g', notes: 'packed' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: 'ta5ombC1LENAVJlLOOfi9l' }, quantity: '80', unit: 'g' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB1Fg7G' }, quantity: '2', unit: 'piece', notes: 'room temperature' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSGNIh' }, quantity: '1', unit: 'tsp' },
          { _key: '6', ingredientRef: { _type: 'reference', _ref: 'ingredient.plain-flour' }, quantity: '270', unit: 'g' },
          { _key: '7', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSGNwc' }, quantity: '1', unit: 'tsp' },
          { _key: '8', ingredientRef: { _type: 'reference', _ref: 'DOyalXpxxR8GcURoHK5YxT' }, quantity: '0.5', unit: 'tsp' },
          { _key: '9', ingredientRef: { _type: 'reference', _ref: 'ingredient.milk-chocolate-chips' }, quantity: '150', unit: 'g' },
          { _key: '10', ingredientRef: { _type: 'reference', _ref: 'ingredient.m-and-ms' }, quantity: '150', unit: 'g' },
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
            children: [{ _type: 'span', _key: 'span1', text: 'Preheat your oven to 175°C (350°F). Line two large baking sheets with parchment paper.' }],
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
            children: [{ _type: 'span', _key: 'span2', text: 'In a large bowl, cream together the softened butter, brown sugar, and granulated sugar using an electric mixer on medium speed for 2-3 minutes until light and fluffy.' }],
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
            children: [{ _type: 'span', _key: 'span3', text: 'Beat in the eggs one at a time, followed by the vanilla extract, mixing until fully incorporated.' }],
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
            children: [{ _type: 'span', _key: 'span4', text: 'In a separate bowl, whisk together the plain flour, baking soda, and salt. Gradually add to the wet ingredients, mixing on low speed until just combined.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step5',
        step: [
          {
            _type: 'block',
            _key: 'block5',
            children: [{ _type: 'span', _key: 'span5', text: 'Using a spatula, fold in the chocolate chips and M&Ms until evenly distributed. Reserve a handful of M&Ms to press on top of the cookies before baking for extra visual appeal.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step6',
        step: [
          {
            _type: 'block',
            _key: 'block6',
            children: [{ _type: 'span', _key: 'span6', text: 'Cover the bowl with cling film and refrigerate for at least 30 minutes. This step is crucial for preventing excessive spreading and achieving the perfect texture.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step7',
        step: [
          {
            _type: 'block',
            _key: 'block7',
            children: [{ _type: 'span', _key: 'span7', text: 'Using a cookie scoop, form 16 dough balls (about 50g each) and place them on the prepared baking sheets, spacing them about 10cm (4 inches) apart. Gently press a few reserved M&Ms onto the top of each cookie for colour.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step8',
        step: [
          {
            _type: 'block',
            _key: 'block8',
            children: [{ _type: 'span', _key: 'span8', text: 'Bake for 8-10 minutes until the edges are set and lightly golden but the centres still appear soft. The cookies will look slightly underdone, which is perfect!' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step9',
        step: [
          {
            _type: 'block',
            _key: 'block9',
            children: [{ _type: 'span', _key: 'span9', text: 'Let the cookies cool on the baking sheet for 20 minutes before transferring to a wire rack. This extended cooling time is essential for achieving the perfect soft-yet-set texture.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'Don\'t skip the refrigeration step! Cold dough prevents the cookies from spreading too thin and creates that perfect chewy texture.',
      'For extra-colourful cookies, use M&Ms in a variety of colours and press extra ones on top before baking.',
      'These cookies are at their absolute best when eaten warm. Reheat in the microwave for 10-15 seconds for that fresh-baked experience.',
      'Store in an airtight container with a slice of bread to keep them soft for up to a week.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'Can I use mini M&Ms instead of regular ones?',
        answer: 'Yes! Mini M&Ms will give you more colour distribution throughout each cookie. Use the same weight (150g) but you\'ll have more individual pieces.',
      },
      {
        _key: 'faq2',
        question: 'Why do I need to refrigerate the dough?',
        answer: 'Chilling the dough firms up the butter, which slows spreading during baking. This results in thicker, chewier cookies with better texture. It also allows the flour to fully hydrate, improving flavour.',
      },
      {
        _key: 'faq3',
        question: 'My M&Ms are sinking to the bottom. How do I prevent this?',
        answer: 'Make sure your dough is well-chilled before baking, and press M&Ms gently onto the tops of cookies rather than mixing them all in. This ensures they stay visible and don\'t sink during baking.',
      },
    ],
    nutrition: {
      calories: 270,
      protein: 3,
      fat: 12,
      carbs: 39,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [{ _type: 'reference', _ref: 'e8175e8e-5cf7-49ed-b93a-eca14d1d9947' }],
    seoTitle: 'Subway Rainbow Chocolate Chip Cookie Recipe - Fun Copycat',
    seoDescription: 'Make Subway\'s colourful rainbow cookies at home! Loaded with M&Ms and chocolate chips, these fun cookies are perfect for kids and cookie lovers.',
  },
  {
    _type: 'recipe',
    title: 'Subway Double Chocolate Cookie Recipe',
    slug: { _type: 'slug', current: 'subway-double-chocolate-cookie' },
    description: 'Indulge in Subway\'s decadent double chocolate cookies with this easy copycat recipe. Rich chocolate dough studded with white and milk chocolate chips – a chocolate lover\'s dream!',
    servings: 16,
    prepMin: 15,
    cookMin: 12,
    introText: 'For true chocolate devotees, Subway\'s Double Chocolate cookie is the ultimate indulgence. This intensely chocolatey cookie combines rich cocoa-infused dough with generous amounts of both white and milk chocolate chips, creating layers of chocolate flavour in every bite. The Dutch cocoa powder gives these cookies a deep, almost fudgy quality, while the chocolate chips add pockets of melty sweetness. Unlike the standard chocolate chip cookie, these have a darker colour and more complex chocolate profile that appeals to sophisticated palates. They\'re soft, rich, and satisfyingly decadent – perfect for those moments when only serious chocolate will do.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'The Double Chocolate cookie was introduced as Subway\'s answer to customer requests for a more intensely chocolatey option. While the original chocolate chip cookie contains chocolate chips in a vanilla-based dough, this variety offers chocolate on chocolate – a combination that has proven irresistible to chocolate enthusiasts worldwide.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'This cookie represents Subway\'s willingness to cater to specific taste preferences and create products that go beyond the basics. The use of both white and milk chocolate chips adds visual interest and creates a more complex flavour experience, positioning this cookie as a premium choice for discerning chocolate lovers.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB0fR96' }, quantity: '125', unit: 'g', notes: 'softened' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'ingredient.light-brown-sugar' }, quantity: '100', unit: 'g', notes: 'packed' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: 'ta5ombC1LENAVJlLOOfi9l' }, quantity: '75', unit: 'g' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB1Fg7G' }, quantity: '1', unit: 'piece', notes: 'room temperature' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSGNIh' }, quantity: '1', unit: 'tsp' },
          { _key: '6', ingredientRef: { _type: 'reference', _ref: 'ingredient.plain-flour' }, quantity: '150', unit: 'g' },
          { _key: '7', ingredientRef: { _type: 'reference', _ref: 'ingredient.dutch-cocoa-powder' }, quantity: '40', unit: 'g' },
          { _key: '8', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSGNwc' }, quantity: '0.5', unit: 'tsp' },
          { _key: '9', ingredientRef: { _type: 'reference', _ref: 'DOyalXpxxR8GcURoHK5YxT' }, quantity: '0.25', unit: 'tsp' },
          { _key: '10', ingredientRef: { _type: 'reference', _ref: 'ingredient.white-chocolate-chips' }, quantity: '100', unit: 'g' },
          { _key: '11', ingredientRef: { _type: 'reference', _ref: 'ingredient.milk-chocolate-chips' }, quantity: '200', unit: 'g' },
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
            children: [{ _type: 'span', _key: 'span1', text: 'Preheat your oven to 175°C (350°F). Line two baking sheets with parchment paper and set aside.' }],
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
            children: [{ _type: 'span', _key: 'span2', text: 'In a large bowl, cream together the softened butter, brown sugar, and granulated sugar using a wooden spoon or electric mixer for about 3 minutes. The mixture should become lighter in colour and fluffy in texture.' }],
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
            children: [{ _type: 'span', _key: 'span3', text: 'Beat in the egg gradually, followed by the vanilla extract, mixing until fully incorporated and smooth.' }],
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
            children: [{ _type: 'span', _key: 'span4', text: 'In a separate bowl, whisk together the plain flour, Dutch cocoa powder, baking soda, and salt until no lumps remain and the cocoa is evenly distributed.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step5',
        step: [
          {
            _type: 'block',
            _key: 'block5',
            children: [{ _type: 'span', _key: 'span5', text: 'Add the dry ingredients to the wet mixture and mix until just combined. The dough will be thick and chocolatey. Be careful not to overmix.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step6',
        step: [
          {
            _type: 'block',
            _key: 'block6',
            children: [{ _type: 'span', _key: 'span6', text: 'Fold in the white chocolate chips and milk chocolate chips using a spatula, ensuring they\'re evenly distributed throughout the dough.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step7',
        step: [
          {
            _type: 'block',
            _key: 'block7',
            children: [{ _type: 'span', _key: 'span7', text: 'Divide the dough into 16 equal portions (approximately 45g each). Roll into balls and place on the prepared baking sheets, spacing them about 5cm (2 inches) apart.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step8',
        step: [
          {
            _type: 'block',
            _key: 'block8',
            children: [{ _type: 'span', _key: 'span8', text: 'Bake for 10-12 minutes. The cookies should be set around the edges but still look slightly soft in the centre. They will appear very soft when first removed from the oven, which is normal.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step9',
        step: [
          {
            _type: 'block',
            _key: 'block9',
            children: [{ _type: 'span', _key: 'span9', text: 'Let the cookies cool on the baking sheet for 5 minutes to set, then transfer to a wire rack. These cookies are best enjoyed slightly warm when the chocolate chips are still melty.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'Use Dutch-process cocoa powder for the deepest, most intense chocolate flavour. Natural cocoa powder will work but won\'t be quite as rich.',
      'Don\'t overbake! These cookies should look slightly underdone in the centre when you take them out. They\'ll firm up as they cool.',
      'For an extra indulgent treat, serve warm with vanilla ice cream.',
      'Mix by hand with a wooden spoon rather than an electric mixer to achieve the characteristic flat, chewy texture.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'What\'s the difference between Dutch cocoa and regular cocoa powder?',
        answer: 'Dutch-process cocoa has been treated to neutralise its acidity, resulting in a darker colour, milder flavour, and smoother taste. It\'s less bitter than natural cocoa and creates a more sophisticated chocolate flavour in baked goods.',
      },
      {
        _key: 'faq2',
        question: 'Can I use all milk chocolate or all white chocolate chips?',
        answer: 'Absolutely! The combination of both creates visual interest and varied flavour, but you can use 300g of whichever type you prefer. All milk chocolate will be more intensely chocolatey, while all white chocolate creates a beautiful contrast with the dark dough.',
      },
      {
        _key: 'faq3',
        question: 'Why are my cookies too flat?',
        answer: 'Make sure your baking soda is fresh and hasn\'t expired. Also, avoid using melted butter – it should be softened but still solid. If the problem persists, try chilling the dough for 30 minutes before baking.',
      },
    ],
    nutrition: {
      calories: 250,
      protein: 3,
      fat: 12,
      carbs: 34,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [{ _type: 'reference', _ref: 'e8175e8e-5cf7-49ed-b93a-eca14d1d9947' }],
    seoTitle: 'Subway Double Chocolate Cookie Recipe - Rich Copycat',
    seoDescription: 'Make Subway\'s decadent double chocolate cookies at home! Rich chocolate dough with white and milk chocolate chips – pure chocolate heaven.',
  },
  {
    _type: 'recipe',
    title: 'Subway Raspberry Cheesecake Cookie Recipe',
    slug: { _type: 'slug', current: 'subway-raspberry-cheesecake-cookie' },
    description: 'Create Subway\'s sophisticated raspberry cheesecake cookies at home. These elegant cookies combine tangy freeze-dried raspberries with creamy cheesecake flavour and white chocolate.',
    servings: 20,
    prepMin: 20,
    cookMin: 10,
    introText: 'The Raspberry Cheesecake cookie is Subway\'s most sophisticated and elegant cookie offering, combining the tangy brightness of raspberries with rich, creamy cheesecake flavour. Studded with white chocolate chips and vibrant pink freeze-dried raspberries, these cookies are as beautiful as they are delicious. The addition of cheesecake instant pudding mix creates a unique flavour profile that genuinely evokes the taste of cheesecake, while the freeze-dried raspberries provide bursts of intense fruit flavour without adding moisture that could compromise texture. These cookies are perfect for special occasions or when you want to impress with something a bit more refined than your standard chocolate chip.',
    brandContext: [
      {
        _type: 'block',
        _key: 'brand1',
        children: [{ _type: 'span', _key: 'span1', text: 'Subway\'s Raspberry Cheesecake cookie represents the chain\'s most ambitious dessert innovation, attempting to capture the essence of a classic restaurant dessert in cookie form. The use of freeze-dried fruit and instant pudding mix demonstrates creative problem-solving in achieving complex flavours within the constraints of fast-food production.' }],
        markDefs: [],
        style: 'normal',
      },
      {
        _type: 'block',
        _key: 'brand2',
        children: [{ _type: 'span', _key: 'span2', text: 'This cookie has found a dedicated following among customers seeking something beyond traditional cookie flavours. Its sophisticated taste profile and elegant appearance make it particularly popular for celebrations, gifts, and those special moments when an ordinary cookie simply won\'t do. It demonstrates Subway\'s commitment to offering diverse, interesting options that go beyond fast-food expectations.' }],
        markDefs: [],
        style: 'normal',
      },
    ],
    ingredients: [
      {
        _type: 'ingredientGroup',
        _key: 'group1',
        items: [
          { _key: '1', ingredientRef: { _type: 'reference', _ref: 'ingredient.butter' }, quantity: '115', unit: 'g', notes: 'softened' },
          { _key: '2', ingredientRef: { _type: 'reference', _ref: 'ta5ombC1LENAVJlLOOfi9l' }, quantity: '100', unit: 'g' },
          { _key: '3', ingredientRef: { _type: 'reference', _ref: 'ingredient.light-brown-sugar' }, quantity: '100', unit: 'g', notes: 'packed' },
          { _key: '4', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSGNIh' }, quantity: '2', unit: 'tsp' },
          { _key: '5', ingredientRef: { _type: 'reference', _ref: 'YDBJc7YDcXN6vN0pB1Fg7G' }, quantity: '1', unit: 'piece', notes: 'room temperature' },
          { _key: '6', ingredientRef: { _type: 'reference', _ref: 'ingredient.plain-flour' }, quantity: '190', unit: 'g' },
          { _key: '7', ingredientRef: { _type: 'reference', _ref: 'f3QR1jtfT8MwlhtCVSGNwc' }, quantity: '1', unit: 'tsp' },
          { _key: '8', ingredientRef: { _type: 'reference', _ref: 'ingredient.cheesecake-pudding-mix' }, quantity: '4', unit: 'tbsp' },
          { _key: '9', ingredientRef: { _type: 'reference', _ref: 'DOyalXpxxR8GcURoHK5YxT' }, quantity: '0.25', unit: 'tsp' },
          { _key: '10', ingredientRef: { _type: 'reference', _ref: 'ingredient.white-chocolate-chips' }, quantity: '50', unit: 'g' },
          { _key: '11', ingredientRef: { _type: 'reference', _ref: 'ingredient.freeze-dried-raspberries' }, quantity: '25', unit: 'g', notes: 'plus extra for topping' },
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
            children: [{ _type: 'span', _key: 'span1', text: 'In a large bowl, beat together the softened butter, granulated sugar, and light brown sugar on medium speed until smooth and creamy, about 2-3 minutes.' }],
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
            children: [{ _type: 'span', _key: 'span2', text: 'Gradually add the egg and vanilla extract to the butter mixture, beating on low speed until fully combined and smooth.' }],
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
            children: [{ _type: 'span', _key: 'span3', text: 'In a separate bowl, whisk together the plain flour, baking soda, cheesecake instant pudding mix, and salt until well combined with no lumps.' }],
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
            children: [{ _type: 'span', _key: 'span4', text: 'Add the dry ingredients to the wet ingredients in three batches, beating on low speed after each addition until just combined. Don\'t overmix.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step5',
        step: [
          {
            _type: 'block',
            _key: 'block5',
            children: [{ _type: 'span', _key: 'span5', text: 'Gently stir in the freeze-dried raspberries and white chocolate chips using a spatula, being careful not to crush the raspberries too much.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step6',
        step: [
          {
            _type: 'block',
            _key: 'block6',
            children: [{ _type: 'span', _key: 'span6', text: 'Cover the bowl and freeze the dough for 30 minutes or until firm enough to form into balls. This step is essential for achieving the right texture.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step7',
        step: [
          {
            _type: 'block',
            _key: 'block7',
            children: [{ _type: 'span', _key: 'span7', text: 'Preheat your oven to 175°C (350°F). Line two baking sheets with parchment paper.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step8',
        step: [
          {
            _type: 'block',
            _key: 'block8',
            children: [{ _type: 'span', _key: 'span8', text: 'Scoop 1½ tablespoons of dough and roll into 5cm (2-inch) balls. Place on the prepared baking sheets, spacing them about 7.5cm (3 inches) apart as they will spread during baking.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step9',
        step: [
          {
            _type: 'block',
            _key: 'block9',
            children: [{ _type: 'span', _key: 'span9', text: 'Bake for 10 minutes until the edges are set but the centres still appear slightly underdone.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step10',
        step: [
          {
            _type: 'block',
            _key: 'block10',
            children: [{ _type: 'span', _key: 'span10', text: 'While the cookies are still hot, immediately decorate them by pressing additional freeze-dried raspberries and white chocolate chips onto the tops. This creates a beautiful presentation and ensures the toppings stick.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
      {
        _key: 'step11',
        step: [
          {
            _type: 'block',
            _key: 'block11',
            children: [{ _type: 'span', _key: 'span11', text: 'Let the cookies cool on the baking sheet for 5-10 minutes before carefully transferring to a wire rack to cool completely.' }],
            markDefs: [],
            style: 'normal',
          },
        ],
      },
    ],
    tips: [
      'Freeze-dried raspberries can be found in the dried fruit section of most supermarkets or online. Don\'t substitute with fresh raspberries as they contain too much moisture.',
      'Cheesecake instant pudding mix is the secret ingredient that creates that authentic cheesecake flavour. Look for it in the baking aisle.',
      'Don\'t skip the freezing step! The dough needs to be very cold to prevent the cookies from spreading too thin.',
      'These cookies are quite delicate when warm, so be gentle when transferring them to the cooling rack.',
    ],
    faqs: [
      {
        _key: 'faq1',
        question: 'Where can I find cheesecake instant pudding mix?',
        answer: 'Most large supermarkets stock instant pudding mixes in various flavours, including cheesecake. If you can\'t find it locally, it\'s readily available online. As a last resort, you could substitute vanilla pudding mix, though the flavour won\'t be quite as authentic.',
      },
      {
        _key: 'faq2',
        question: 'Can I use fresh or frozen raspberries instead?',
        answer: 'Unfortunately, no. Fresh or frozen raspberries contain too much moisture and will make the cookies soggy. Freeze-dried raspberries are essential for this recipe as they provide intense flavour without compromising texture.',
      },
      {
        _key: 'faq3',
        question: 'Why do I need to freeze the dough?',
        answer: 'This dough is particularly soft due to the pudding mix, and freezing it makes it manageable to form into balls. It also prevents excessive spreading during baking, resulting in thicker, chewier cookies with better texture.',
      },
    ],
    nutrition: {
      calories: 165,
      protein: 1.8,
      fat: 7,
      carbs: 24,
    },
    brand: { _type: 'reference', _ref: '31466cb3-1a57-4c90-b57a-633d209604e2' },
    categories: [{ _type: 'reference', _ref: 'e8175e8e-5cf7-49ed-b93a-eca14d1d9947' }],
    seoTitle: 'Subway Raspberry Cheesecake Cookie Recipe - Elegant Copycat',
    seoDescription: 'Make Subway\'s sophisticated raspberry cheesecake cookies at home! Tangy raspberries, creamy cheesecake flavour, and white chocolate combine beautifully.',
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

  console.log('\n✅ All done! Created 9 ingredients and 5 Subway cookie recipes.');
}

createIngredientsAndRecipes();
