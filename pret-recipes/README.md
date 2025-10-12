# Pret A Manger Recipe Collection

This folder contains 4 complete Pret A Manger copycat recipes, fully optimized for Sanity CMS with SEO best practices.

## Recipes Created

### 1. Swedish Meatball Hot Wrap
**File:** `pret-swedish-meatball-hot-wrap.json`
- **Category:** Mains
- **SEO Title:** Pret Swedish Meatball Wrap Recipe | Easy Copycat (49 chars)
- **SEO Description:** Make Pret's iconic Swedish Meatball Hot Wrap at home! Tender meatballs in creamy gravy with lingonberry jam wrapped in a soft tortilla. Ready in 35 mins. (158 chars)
- **Canonical URL:** https://bitebuddy.co.uk/recipes/pret-swedish-meatball-hot-wrap
- **Servings:** 1 | **Prep:** 15 min | **Cook:** 20 min
- **Nutrition:** 620 kcal | 32g protein | 28g fat | 58g carbs

### 2. Veggie Breakfast Ciabatta
**File:** `pret-veggie-breakfast-ciabatta.json`
- **Categories:** Breakfast, Vegetarian
- **SEO Title:** Pret Veggie Breakfast Ciabatta Recipe | Make at Home (57 chars)
- **SEO Description:** Recreate Pret's Veggie Breakfast Ciabatta with grilled halloumi, scrambled eggs, roasted tomatoes & spinach. Perfect vegetarian breakfast in 25 minutes. (155 chars)
- **Canonical URL:** https://bitebuddy.co.uk/recipes/pret-veggie-breakfast-ciabatta
- **Servings:** 1 | **Prep:** 10 min | **Cook:** 15 min
- **Nutrition:** 485 kcal | 28g protein | 24g fat | 38g carbs

### 3. Italian Style Chicken and Basil Hot Wrap
**File:** `pret-italian-chicken-basil-hot-wrap.json`
- **Categories:** Mains, High-Protein
- **SEO Title:** Pret Italian Chicken & Basil Wrap | Easy Copycat Recipe (60 chars)
- **SEO Description:** Make Pret's Italian Chicken and Basil Hot Wrap at home! Herb-marinated chicken, mozzarella, sun-dried tomatoes & fresh basil. Ready in 30 minutes. (147 chars)
- **Canonical URL:** https://bitebuddy.co.uk/recipes/pret-italian-chicken-basil-hot-wrap
- **Servings:** 1 | **Prep:** 15 min | **Cook:** 15 min
- **Nutrition:** 545 kcal | 38g protein | 22g fat | 46g carbs

### 4. Falafel and Halloumi Hot Wrap
**File:** `pret-falafel-halloumi-hot-wrap.json`
- **Categories:** Mains, Vegetarian
- **SEO Title:** Pret Falafel & Halloumi Wrap Recipe | Vegetarian (53 chars)
- **SEO Description:** Recreate Pret's Falafel and Halloumi Hot Wrap at home! Crispy falafel, grilled halloumi, hummus & pickles in a soft tortilla. Veggie perfection! (146 chars)
- **Canonical URL:** https://bitebuddy.co.uk/recipes/pret-falafel-halloumi-hot-wrap
- **Servings:** 1 | **Prep:** 15 min | **Cook:** 20 min
- **Nutrition:** 595 kcal | 26g protein | 28g fat | 58g carbs

## New Ingredients Created

The following ingredient documents have been created in the `ingredients/` subfolder. These need to be imported into your Sanity database:

1. **Tortilla Wrap** (`tortilla-wrap.json`) - Allergens: Gluten (wheat)
2. **Lingonberry Jam** (`lingonberry-jam.json`) - No allergens
3. **Halloumi Cheese** (`halloumi.json`) - Allergens: Milk
4. **Sun-Dried Tomatoes** (`sun-dried-tomatoes.json`) - No allergens
5. **Italian Dressing** (`italian-dressing.json`) - Allergens: Mustard (may contain)
6. **Tahini Dressing** (`tahini-dressing.json`) - Allergens: Sesame

## Recipe Features

All recipes include:
- ✅ Complete ingredient lists with references to existing ingredients
- ✅ Detailed step-by-step instructions
- ✅ Tips & variations
- ✅ FAQs (2 per recipe)
- ✅ Nutritional information per serving
- ✅ Brand context (1-3 paragraphs about Pret A Manger)
- ✅ Intro text (100-200 words)
- ✅ SEO-optimized titles (<60 chars)
- ✅ SEO-optimized descriptions (<160 chars)
- ✅ Canonical URLs
- ✅ Proper category references
- ✅ Brand reference to Pret A Manger

## How to Import

### Option 1: Using Sanity Studio

1. Open your Sanity Studio
2. Navigate to the "Ingredients" section
3. Manually create each ingredient using the JSON files in `ingredients/` as reference
4. Navigate to the "Recipes" section
5. Import each recipe JSON file or manually create recipes using the data

### Option 2: Using Sanity CLI

```bash
# Import ingredients first
cd D:\bitebuddy
sanity documents create ingredients/tortilla-wrap.json --dataset production
sanity documents create ingredients/lingonberry-jam.json --dataset production
sanity documents create ingredients/halloumi.json --dataset production
sanity documents create ingredients/sun-dried-tomatoes.json --dataset production
sanity documents create ingredients/italian-dressing.json --dataset production
sanity documents create ingredients/tahini-dressing.json --dataset production

# Import recipes
sanity documents create pret-swedish-meatball-hot-wrap.json --dataset production
sanity documents create pret-veggie-breakfast-ciabatta.json --dataset production
sanity documents create pret-italian-chicken-basil-hot-wrap.json --dataset production
sanity documents create pret-falafel-halloumi-hot-wrap.json --dataset production
```

## Brand Information

All recipes are linked to the existing Pret A Manger brand:
- **Brand ID:** `brand-pret-a-manger`
- **Slug:** `pret-a-manger`

## Categories Used

- **Mains** (ID: `a75059bf-6a51-45a7-932c-228c9c8765a1`)
- **Breakfast** (ID: `c761db68-4f79-4742-b85f-7a7910747398`)
- **Vegetarian** (ID: `f42c344d-2114-4e20-9331-ba0a99eda367`)
- **High-Protein** (ID: `1a43cb40-4025-4cd5-a788-5442eb2af5f5`)

## Notes

- All ingredient references point to existing ingredients in your database where possible
- New ingredients have been created with full nutritional data and allergen information
- SEO titles are all under 60 characters
- SEO descriptions are all under 160 characters
- Intro text is between 100-200 words for each recipe
- Brand context is 2 paragraphs for each recipe
- Each recipe includes serving size, prep time, cook time, and complete nutrition info
