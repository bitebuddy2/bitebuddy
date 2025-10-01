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
