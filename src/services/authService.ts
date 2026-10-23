import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import type { UserProfile } from '../types';

const GUEST_KEY = 'nyayamate_guest_user';

export function getOrCreateGuestUser(): UserProfile {
  const existing = localStorage.getItem(GUEST_KEY);
  if (existing) {
    try {
      return JSON.parse(existing);
    } catch {
      // ignore
    }
  }

  const guestUser: UserProfile = {
    id: 'guest_' + Math.random().toString(36).substring(2, 10),
    email: 'citizen.guest@nyayamate.in',
    fullName: 'Citizen User',
    isGuest: true,
  };

  localStorage.setItem(GUEST_KEY, JSON.stringify(guestUser));
  return guestUser;
}

export async function getCurrentUser(): Promise<UserProfile> {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      const { data: { session } } = await client.auth.getSession();
      if (session?.user) {
        return {
          id: session.user.id,
          email: session.user.email || 'user@nyayamate.in',
          fullName: session.user.user_metadata?.full_name || session.user.email?.split('@')[0] || 'Advocate / Citizen',
          isGuest: false,
        };
      }
    } catch (err) {
      console.warn('Error fetching Supabase auth session, using guest profile:', err);
    }
  }

  return getOrCreateGuestUser();
}

export async function signInWithEmail(email: string, password: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured yet. You can continue as a Guest or configure Supabase in Settings.',
    };
  }

  try {
    const { error } = await client.auth.signInWithPassword({ email, password });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Login failed' };
  }
}

export async function signUpWithEmail(email: string, password: string, fullName?: string): Promise<{ success: boolean; error?: string }> {
  const client = getSupabaseClient();
  if (!client || !isSupabaseConfigured()) {
    return {
      success: false,
      error: 'Supabase is not configured yet. Configure Supabase in Settings or .env to enable cloud signups.',
    };
  }

  try {
    const { error } = await client.auth.signUp({
      email,
      password,
      options: {
        data: { full_name: fullName || 'Citizen User' },
      },
    });
    if (error) return { success: false, error: error.message };
    return { success: true };
  } catch (err: unknown) {
    return { success: false, error: err instanceof Error ? err.message : 'Sign up failed' };
  }
}

export async function signOut(): Promise<void> {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client.auth.signOut();
    } catch (err) {
      console.warn('Supabase sign out error:', err);
    }
  }
  // Reset guest user id
  localStorage.removeItem(GUEST_KEY);
}
