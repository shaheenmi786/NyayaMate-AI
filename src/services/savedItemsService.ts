import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { getCurrentUser } from './authService';
import type { SavedItem } from '../types';

const STORAGE_SAVED_KEY = 'nyayamate_local_saved_items';

const DEFAULT_SAVED_ITEMS: SavedItem[] = [
  {
    id: 's1',
    type: 'conversation',
    title: 'Landlord Deposit Dispute Notice Guidelines',
    date: '2026-10-12',
    category: 'Tenancy',
    content: '15-day formal notice procedure under state rent control norms.',
  },
  {
    id: 's2',
    type: 'resource',
    title: 'National Consumer Helpline Portal',
    url: 'https://consumerhelpline.gov.in/',
    category: 'Consumer Rights',
  },
  {
    id: 's3',
    type: 'draft',
    title: 'Security Deposit Refund Demand Letter',
    date: '2026-10-15',
    category: 'Notice',
  },
  {
    id: 's4',
    type: 'resource',
    title: 'National Cyber Crime Reporting Portal',
    url: 'https://cybercrime.gov.in/',
    category: 'Cyber Crime',
  },
];

export async function fetchSavedItems(): Promise<SavedItem[]> {
  const client = getSupabaseClient();
  const user = await getCurrentUser();

  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from('saved_items')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          type: item.type as SavedItem['type'],
          title: item.title,
          url: item.url || undefined,
          category: item.category || undefined,
          date: new Date(item.created_at).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' }),
          created_at: item.created_at,
          metadata: item.metadata as Record<string, unknown>,
        }));
      }
    } catch (err) {
      console.warn('Error fetching saved items from Supabase:', err);
    }
  }

  // Fallback to local storage
  const stored = localStorage.getItem(STORAGE_SAVED_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(DEFAULT_SAVED_ITEMS));
  return DEFAULT_SAVED_ITEMS;
}

export async function addSavedItem(item: Omit<SavedItem, 'id'>): Promise<SavedItem> {
  const client = getSupabaseClient();
  const user = await getCurrentUser();

  const newItem: SavedItem = {
    ...item,
    id: 'save_' + Date.now().toString(),
    date: item.date || new Date().toISOString().split('T')[0],
    created_at: new Date().toISOString(),
  };

  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from('saved_items')
        .insert({
          user_id: user.id,
          type: newItem.type,
          title: newItem.title,
          url: newItem.url || null,
          category: newItem.category || null,
          metadata: newItem.metadata || {},
        })
        .select()
        .single();

      if (!error && data) {
        newItem.id = data.id;
        newItem.created_at = data.created_at;
      }
    } catch (err) {
      console.warn('Error saving item to Supabase:', err);
    }
  }

  const existing = await fetchSavedItems();
  const updated = [newItem, ...existing.filter((s) => s.id !== newItem.id)];
  localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(updated));

  return newItem;
}

export async function deleteSavedItem(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client.from('saved_items').delete().eq('id', id);
    } catch (err) {
      console.warn('Error deleting saved item from Supabase:', err);
    }
  }

  const existing = await fetchSavedItems();
  const updated = existing.filter((s) => s.id !== id);
  localStorage.setItem(STORAGE_SAVED_KEY, JSON.stringify(updated));
}
