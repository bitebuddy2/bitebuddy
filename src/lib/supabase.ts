import { createClient, SupabaseClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// Legacy default client (for backwards compatibility)
export const supabase = createClient(supabaseUrl, supabaseKey)

/**
 * Get a Supabase browser client with configurable session persistence
 * @param rememberMe - If true, uses localStorage (persistent). If false, uses sessionStorage (tab-only)
 * @returns Configured Supabase client
 */
export function getSupabaseBrowserClient(rememberMe: boolean = true): SupabaseClient {
  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      storage: typeof window !== 'undefined'
        ? (rememberMe ? window.localStorage : window.sessionStorage)
        : undefined,
      autoRefreshToken: true,
      persistSession: true,
      detectSessionInUrl: true,
    },
  })
}
