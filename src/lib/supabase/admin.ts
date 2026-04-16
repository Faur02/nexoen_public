import { createClient } from '@supabase/supabase-js';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let _adminClient: ReturnType<typeof createClient<any>> | null = null;

/**
 * Supabase admin client using service role key.
 * Server-side only — never expose to the client.
 */
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getAdminClient(): ReturnType<typeof createClient<any>> {
  if (_adminClient) return _adminClient;
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) throw new Error('Missing Supabase admin env vars (NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY)');
  _adminClient = createClient(url, key, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
  return _adminClient;
}
