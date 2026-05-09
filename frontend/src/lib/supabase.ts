import { createBrowserClient } from '@supabase/ssr';

// Use a singleton pattern to ensure we only create one Supabase client
let supabaseClient: ReturnType<typeof createBrowserClient> | null = null;

export const createClient = () => {
  if (supabaseClient) return supabaseClient;

  // Use dummy values during build if env variables are not set
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co';
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder';

  supabaseClient = createBrowserClient(supabaseUrl, supabaseKey);

  return supabaseClient;
};

// Also provide a direct export for simpler client-side fetching
export const supabase = createClient();
