/**
 * Track custom goals in Plausible Analytics
 * @param goalName - The name of the goal to track (e.g., "Newsletter Signup")
 * @param value - Optional numeric value associated with the goal
 */
export function trackGoal(goalName: string, value = 0) {
  if (typeof window !== "undefined" && (window as any).plausible) {
    (window as any).plausible(goalName, { props: { value } });
  }
}
