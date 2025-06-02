"use client"

import { createClientComponentClient } from "@supabase/auth-helpers-nextjs"
import type { Database } from "@/lib/supabase/database.types"

// Singleton pattern to prevent multiple GoTrueClient instances
let supabaseClient: ReturnType<typeof createClientComponentClient<Database>> | null = null

export const createClient = () => {
  if (typeof window === "undefined") {
    // Server-side: always create a new instance
    return createClientComponentClient<Database>()
  }

  if (!supabaseClient) {
    // Client-side: create only once
    supabaseClient = createClientComponentClient<Database>()
  }

  return supabaseClient
}

// Export a default instance for convenience
export const supabase = createClient()
