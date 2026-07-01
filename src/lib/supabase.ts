import { createClient } from "@supabase/supabase-js";

// Ensure environment variables are loaded for Next.js
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn("Supabase credentials missing from .env");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);
