/**
 * Track custom events in Google Analytics
 * @param eventName - The name of the event to track (e.g., "newsletter_signup")
 * @param eventParams - Optional parameters for the event
 */
export function trackEvent(eventName: string, eventParams?: Record<string, any>) {
  if (typeof window !== "undefined" && (window as any).gtag) {
    (window as any).gtag('event', eventName, eventParams);
  }
}

/**
 * Track custom goals/conversions in Google Analytics
 * @param goalName - The name of the goal to track (e.g., "Newsletter Signup")
 * @param value - Optional numeric value associated with the goal
 */
export function trackGoal(goalName: string, value = 0) {
  trackEvent(goalName.toLowerCase().replace(/\s+/g, '_'), {
    value: value,
    currency: 'GBP'
  });
}

/**
 * Track affiliate link clicks for conversion tracking
 */
export function trackAffiliateClick(params: {
  recipe: string;
  ingredient: string;
  retailer: string;
  dest_domain: string;
  brand?: string;
}) {
  trackEvent('affiliate_click', {
    recipe: params.recipe,
    ingredient: params.ingredient,
    retailer: params.retailer,
    dest_domain: params.dest_domain,
    brand: params.brand,
  });
}

/**
 * Track when a user saves a recipe
 */
export function trackSaveRecipe(params: {
  recipe_slug: string;
  recipe_title?: string;
}) {
  trackEvent('save_recipe', {
    recipe_slug: params.recipe_slug,
    recipe_title: params.recipe_title,
  });
}

/**
 * Track AI recipe generation
 */
export function trackGenerateAIRecipe(params: {
  prompt: string;
  success: boolean;
  recipe_title?: string;
  method?: string;
  portions?: number;
  diet?: string;
}) {
  trackEvent('generate_ai_recipe', {
    prompt: params.prompt,
    success: params.success,
    recipe_title: params.recipe_title,
    method: params.method,
    portions: params.portions,
    diet: params.diet,
  });
}

/**
 * Track recipe page views to identify popular recipes
 */
export function trackRecipeView(params: {
  recipe_slug: string;
  recipe_title: string;
  brand?: string;
  categories?: string[];
}) {
  trackEvent('view_recipe', {
    recipe_slug: params.recipe_slug,
    recipe_title: params.recipe_title,
    brand: params.brand,
    categories: params.categories?.join(', '),
  });
}

/**
 * Track when a user rates a recipe
 */
export function trackRateRecipe(params: {
  recipe_slug: string;
  recipe_title?: string;
  rating: number;
}) {
  trackEvent('rate_recipe', {
    recipe_slug: params.recipe_slug,
    recipe_title: params.recipe_title,
    rating: params.rating,
  });
}

/**
 * Track when a user prints a recipe
 */
export function trackPrintRecipe(params: {
  recipe_slug: string;
  recipe_title: string;
  brand?: string;
}) {
  trackEvent('print_recipe', {
    recipe_slug: params.recipe_slug,
    recipe_title: params.recipe_title,
    brand: params.brand,
  });
}

/**
 * Track shopping list generation from recipe
 */
export function trackGenerateShoppingList(params: {
  recipe_slugs: string[];
  recipe_count: number;
}) {
  trackEvent('generate_shopping_list', {
    recipe_slugs: params.recipe_slugs.join(', '),
    recipe_count: params.recipe_count,
  });
}

/**
 * Track cooking guide views
 */
export function trackViewCookingGuide(params: {
  guide_slug: string;
  guide_title: string;
}) {
  trackEvent('view_cooking_guide', {
    guide_slug: params.guide_slug,
    guide_title: params.guide_title,
  });
}

/**
 * Track brand landing page views
 */
export function trackViewBrandPage(params: {
  brand_slug: string;
  brand_title: string;
  recipe_count: number;
}) {
  trackEvent('view_brand_page', {
    brand_slug: params.brand_slug,
    brand_title: params.brand_title,
    recipe_count: params.recipe_count,
  });
}

/**
 * Track category landing page views
 */
export function trackViewCategoryPage(params: {
  category_slug: string;
  category_title: string;
  recipe_count: number;
}) {
  trackEvent('view_category_page', {
    category_slug: params.category_slug,
    category_title: params.category_title,
    recipe_count: params.recipe_count,
  });
}
