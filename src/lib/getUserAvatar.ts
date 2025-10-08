/**
 * Gets the user's avatar URL, prioritizing custom uploads over OAuth avatars
 * @param user - Supabase user object
 * @returns Avatar URL or null if none exists
 */
export function getUserAvatar(user: any): string | null {
  if (!user) return null;

  // Prioritize custom uploaded avatar over OAuth avatar
  // This prevents Google OAuth from overwriting custom uploads on sign-in
  if (user.user_metadata?.has_custom_avatar && user.user_metadata?.custom_avatar_url) {
    return user.user_metadata.custom_avatar_url;
  }

  // Fall back to OAuth avatar (Google, etc.)
  return user.user_metadata?.avatar_url || null;
}

/**
 * Gets the user's display name
 * @param user - Supabase user object
 * @returns Display name, falling back to email username or "Anonymous"
 */
export function getUserDisplayName(user: any): string {
  if (!user) return "Anonymous";

  return (
    user.user_metadata?.first_name ||
    user.user_metadata?.name ||
    user.email?.split("@")[0] ||
    "Anonymous"
  );
}
