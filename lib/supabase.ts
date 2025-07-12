import { createClient } from "@supabase/supabase-js"

// Creating a Supabase client for server-side use
export const createServerSupabaseClient = () => {
  try {
    const supabaseUrl = process.env.SUPABASE_URL
    const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl || !supabaseKey) {
      console.log("Supabase environment variables not found")
      return null
    }

    return createClient(supabaseUrl, supabaseKey)
  } catch (error) {
    console.warn("Failed to create Supabase client:", error)
    return null
  }
}

// Creating a Supabase client for client-side use
let clientSupabaseClient: ReturnType<typeof createClient> | null = null

export const createClientSupabaseClient = () => {
  try {
    if (clientSupabaseClient) return clientSupabaseClient

    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

    if (!supabaseUrl || !supabaseAnonKey) {
      console.log("Public Supabase environment variables not found")
      return null
    }

    clientSupabaseClient = createClient(supabaseUrl, supabaseAnonKey)
    return clientSupabaseClient
  } catch (error) {
    console.warn("Failed to create client Supabase client:", error)
    return null
  }
}
