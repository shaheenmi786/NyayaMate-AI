import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { getCurrentUser } from './authService';
import type { DraftNotice } from '../types';

const STORAGE_DRAFTS_KEY = 'nyayamate_local_drafts';

export async function fetchDrafts(): Promise<DraftNotice[]> {
  const client = getSupabaseClient();
  const user = await getCurrentUser();

  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from('drafts')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          templateType: d.template_type,
          title: d.title,
          formData: d.form_data as DraftNotice['formData'],
          generatedText: d.generated_text,
          createdAt: d.created_at,
          updatedAt: d.updated_at,
        }));
      }
    } catch (err) {
      console.warn('Error fetching drafts from Supabase:', err);
    }
  }

  const stored = localStorage.getItem(STORAGE_DRAFTS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  return [];
}

export async function saveDraft(draft: Omit<DraftNotice, 'id'>): Promise<DraftNotice> {
  const client = getSupabaseClient();
  const user = await getCurrentUser();

  const newDraft: DraftNotice = {
    ...draft,
    id: 'draft_' + Date.now().toString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from('drafts')
        .insert({
          user_id: user.id,
          template_type: draft.templateType,
          title: draft.title,
          form_data: draft.formData,
          generated_text: draft.generatedText,
        })
        .select()
        .single();

      if (!error && data) {
        newDraft.id = data.id;
        newDraft.createdAt = data.created_at;
        newDraft.updatedAt = data.updated_at;
      }
    } catch (err) {
      console.warn('Error saving draft to Supabase:', err);
    }
  }

  const existing = await fetchDrafts();
  const updated = [newDraft, ...existing.filter((d) => d.id !== newDraft.id)];
  localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(updated));

  return newDraft;
}

export async function deleteDraft(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client.from('drafts').delete().eq('id', id);
    } catch (err) {
      console.warn('Error deleting draft from Supabase:', err);
    }
  }

  const existing = await fetchDrafts();
  const updated = existing.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_DRAFTS_KEY, JSON.stringify(updated));
}
