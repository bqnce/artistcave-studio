import { createBrowserClient } from '@supabase/ssr'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// A createBrowserClient automatikusan beállítja a Sütiket a sikeres bejelentkezésnél!
export const supabase = createBrowserClient(supabaseUrl, supabaseAnonKey)