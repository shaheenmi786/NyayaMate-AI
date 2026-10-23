import { createClient, SupabaseClient } from '@supabase/supabase-js';

// Storage keys for user-configured credentials via Settings UI
const STORAGE_URL_KEY = 'nyayamate_supabase_url';
const STORAGE_KEY_KEY = 'nyayamate_supabase_anon_key';

export function getSupabaseConfig(): { url: string; anonKey: string; isCustom: boolean } {
  const customUrl = localStorage.getItem(STORAGE_URL_KEY);
  const customKey = localStorage.getItem(STORAGE_KEY_KEY);

  if (customUrl && customKey) {
    return { url: customUrl.trim(), anonKey: customKey.trim(), isCustom: true };
  }

  const envUrl = (import.meta.env.VITE_SUPABASE_URL || '').trim();
  const envKey = (import.meta.env.VITE_SUPABASE_ANON_KEY || '').trim();

  return { url: envUrl, anonKey: envKey, isCustom: false };
}

export function isSupabaseConfigured(): boolean {
  const { url, anonKey } = getSupabaseConfig();
  if (!url || !anonKey) return false;
  if (url.includes('your-project-id') || url.includes('placeholder.supabase.co')) return false;
  if (anonKey.includes('your-anon-key') || anonKey.includes('placeholder-anon-key')) return false;
  return url.startsWith('http://') || url.startsWith('https://');
}

export function setSupabaseConfig(url: string, anonKey: string): void {
  localStorage.setItem(STORAGE_URL_KEY, url.trim());
  localStorage.setItem(STORAGE_KEY_KEY, anonKey.trim());
  // Invalidate current client instance to re-initialize
  cachedClient = null;
}

export function clearSupabaseConfig(): void {
  localStorage.removeItem(STORAGE_URL_KEY);
  localStorage.removeItem(STORAGE_KEY_KEY);
  cachedClient = null;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let cachedClient: SupabaseClient<any, 'public', any> | null = null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function getSupabaseClient(): SupabaseClient<any, 'public', any> | null {
  if (cachedClient) return cachedClient;

  const { url, anonKey } = getSupabaseConfig();

  if (!isSupabaseConfigured()) {
    return null;
  }

  try {
    cachedClient = createClient(url, anonKey, {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
        detectSessionInUrl: true,
      },
    });
    return cachedClient;
  } catch (error) {
    console.error('Failed to initialize Supabase client:', error);
    return null;
  }
}

/**
 * Pings Supabase to check connection status and measures response latency.
 */
export async function testSupabaseConnection(): Promise<{
  success: boolean;
  latencyMs?: number;
  message: string;
}> {
  const client = getSupabaseClient();
  if (!client) {
    return {
      success: false,
      message: 'Supabase credentials are not configured or are placeholder values.',
    };
  }

  const start = performance.now();
  try {
    // Attempt a light query on conversations
    const { error } = await client
      .from('conversations')
      .select('id')
      .limit(1);

    const latencyMs = Math.round(performance.now() - start);

    if (error) {
      // Check if table just doesn't exist yet (schema needs to be run)
      if (error.code === '42P01' || error.message.includes('relation "conversations" does not exist') || error.message.includes('not found')) {
        return {
          success: true,
          latencyMs,
          message: 'Connected to Supabase! (Note: Run supabase/schema.sql in Supabase SQL editor to create tables)',
        };
      }
      return {
        success: false,
        latencyMs,
        message: `Supabase error: ${error.message} (Code: ${error.code})`,
      };
    }

    return {
      success: true,
      latencyMs,
      message: `Successfully connected to Supabase (${latencyMs}ms latency)`,
    };
  } catch (err: unknown) {
    const latencyMs = Math.round(performance.now() - start);
    const errorMessage = err instanceof Error ? err.message : String(err);
    return {
      success: false,
      latencyMs,
      message: `Connection failed: ${errorMessage}`,
    };
  }
}
