/**
 * Gets the user's avatar URL, prioritizing custom uploads over OAuth avatars
 * @param user - Supabase user object
 * @returns Avatar URL or null if none exists
 */
export function getUserAvatar(user: any): string | null {
  if (!user) return null;

  const avatarUrl = user.user_metadata?.avatar_url;

  if (!avatarUrl) return null;

  // Return the avatar URL - custom uploads from Supabase storage will be prioritized
  // since they overwrite the Google OAuth avatar in user metadata
  return avatarUrl;
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
