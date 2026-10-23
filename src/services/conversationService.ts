import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { getCurrentUser } from './authService';
import type { Conversation, Message } from '../types';

const STORAGE_CONVERSATIONS_KEY = 'nyayamate_local_conversations';
const STORAGE_MESSAGES_KEY_PREFIX = 'nyayamate_local_messages_';

const DEFAULT_CONVERSATIONS: Conversation[] = [
  {
    id: 'c1',
    title: 'Security Deposit Refund Process',
    preview: 'What are my rights if my landlord in Bengaluru delays returning my security deposit?',
    date: 'Today',
  },
  {
    id: 'c2',
    title: 'Cyber Fraud Reporting Steps',
    preview: 'I lost money through a UPI phishing scam. What immediate steps should I take within the Golden Hour?',
    date: 'Yesterday',
  },
  {
    id: 'c3',
    title: 'Defective Laptop Warranty Claim',
    preview: 'Drafting a legal notice to the manufacturer under Consumer Protection Act 2019.',
    date: 'Oct 18, 2026',
  },
];

export async function fetchConversations(): Promise<Conversation[]> {
  const client = getSupabaseClient();
  const user = await getCurrentUser();

  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from('conversations')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false });

      if (error) {
        console.warn('Supabase fetch conversations error, falling back to local storage:', error.message);
      } else if (data && data.length > 0) {
        return data.map((item) => ({
          id: item.id,
          title: item.title,
          preview: item.preview || '',
          date: new Date(item.updated_at).toLocaleDateString([], { month: 'short', day: 'numeric' }),
          created_at: item.created_at,
          updated_at: item.updated_at,
        }));
      }
    } catch (err) {
      console.warn('Network error fetching Supabase conversations:', err);
    }
  }

  // Fallback to local storage
  const stored = localStorage.getItem(STORAGE_CONVERSATIONS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(DEFAULT_CONVERSATIONS));
  return DEFAULT_CONVERSATIONS;
}

export async function createConversation(title: string, preview: string = ''): Promise<Conversation> {
  const client = getSupabaseClient();
  const user = await getCurrentUser();
  const newConv: Conversation = {
    id: 'conv_' + Date.now().toString(),
    title: title || 'New Legal Consultation',
    preview: preview.substring(0, 100),
    date: 'Just now',
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from('conversations')
        .insert({
          user_id: user.id,
          title: newConv.title,
          preview: newConv.preview,
        })
        .select()
        .single();

      if (!error && data) {
        newConv.id = data.id;
        newConv.created_at = data.created_at;
        newConv.updated_at = data.updated_at;
      }
    } catch (err) {
      console.warn('Error saving conversation to Supabase:', err);
    }
  }

  // Update local storage backup
  const stored = await fetchConversations();
  const updated = [newConv, ...stored.filter((c) => c.id !== newConv.id)];
  localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(updated));

  return newConv;
}

export async function updateConversationTitle(id: string, title: string): Promise<void> {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client
        .from('conversations')
        .update({ title, updated_at: new Date().toISOString() })
        .eq('id', id);
    } catch (err) {
      console.warn('Error updating conversation title in Supabase:', err);
    }
  }

  const stored = await fetchConversations();
  const updated = stored.map((c) => (c.id === id ? { ...c, title } : c));
  localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(updated));
}

export async function deleteConversation(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client.from('conversations').delete().eq('id', id);
    } catch (err) {
      console.warn('Error deleting conversation in Supabase:', err);
    }
  }

  const stored = await fetchConversations();
  const updated = stored.filter((c) => c.id !== id);
  localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(updated));
  localStorage.removeItem(STORAGE_MESSAGES_KEY_PREFIX + id);
}

export async function fetchMessages(conversationId: string): Promise<Message[]> {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from('messages')
        .select('*')
        .eq('conversation_id', conversationId)
        .order('created_at', { ascending: true });

      if (!error && data && data.length > 0) {
        return data.map((m) => ({
          id: m.id,
          conversation_id: m.conversation_id,
          sender: m.sender as 'user' | 'assistant',
          text: m.text,
          time: new Date(m.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          created_at: m.created_at,
          citations: Array.isArray(m.citations) ? (m.citations as unknown as Message['citations']) : [],
        }));
      }
    } catch (err) {
      console.warn('Error fetching messages from Supabase:', err);
    }
  }

  // Local storage fallback
  const stored = localStorage.getItem(STORAGE_MESSAGES_KEY_PREFIX + conversationId);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  // Default welcome message
  const defaultMsg: Message[] = [
    {
      id: 'welcome_' + conversationId,
      conversation_id: conversationId,
      sender: 'assistant',
      text: 'Namaste! I am NyayaMate AI. Ask me any legal information question regarding Indian statutory laws, tenancy disputes, consumer rights, or cyber fraud reporting.',
      time: '10:00 AM',
      citations: [
        {
          title: 'India Code Statutory Database',
          code: 'Official Repository of Central & State Acts',
          url: 'https://www.indiacode.nic.in/',
          verified: true,
        },
      ],
    },
  ];

  localStorage.setItem(STORAGE_MESSAGES_KEY_PREFIX + conversationId, JSON.stringify(defaultMsg));
  return defaultMsg;
}

export async function addMessage(
  conversationId: string,
  message: { sender: 'user' | 'assistant'; text: string; citations?: Message['citations'] }
): Promise<Message> {
  const client = getSupabaseClient();
  const newMsg: Message = {
    id: 'msg_' + Date.now().toString(),
    conversation_id: conversationId,
    sender: message.sender,
    text: message.text,
    time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    created_at: new Date().toISOString(),
    citations: message.citations || [],
  };

  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender: newMsg.sender,
          text: newMsg.text,
          citations: newMsg.citations as unknown as Record<string, unknown>[],
        })
        .select()
        .single();

      if (!error && data) {
        newMsg.id = data.id;
        newMsg.created_at = data.created_at;
      }

      // Update conversation preview and timestamp
      await client
        .from('conversations')
        .update({
          preview: newMsg.text.substring(0, 120),
          updated_at: new Date().toISOString(),
        })
        .eq('id', conversationId);
    } catch (err) {
      console.warn('Error saving message to Supabase:', err);
    }
  }

  // Local storage update
  const messages = await fetchMessages(conversationId);
  const updated = [...messages, newMsg];
  localStorage.setItem(STORAGE_MESSAGES_KEY_PREFIX + conversationId, JSON.stringify(updated));

  // Update conversation preview in local list
  const storedConvs = await fetchConversations();
  const updatedConvs = storedConvs.map((c) =>
    c.id === conversationId ? { ...c, preview: newMsg.text.substring(0, 100), date: 'Just now' } : c
  );
  localStorage.setItem(STORAGE_CONVERSATIONS_KEY, JSON.stringify(updatedConvs));

  return newMsg;
}
