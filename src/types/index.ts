// ==============================================================================
// NyayaMate AI — Core TypeScript Types
// ==============================================================================

export type ViewType =
  | 'landing'
  | 'dashboard'
  | 'chat'
  | 'conversations'
  | 'documents'
  | 'drafts'
  | 'resources'
  | 'saved'
  | 'settings';

export interface Citation {
  title: string;
  code?: string;
  url?: string;
  act?: string;
  section?: string;
  verified?: boolean;
}

export interface Message {
  id: string;
  conversation_id?: string;
  sender: 'user' | 'assistant';
  text: string;
  time: string;
  created_at?: string;
  citations: Citation[];
}

export interface Conversation {
  id: string;
  title: string;
  preview: string;
  date: string;
  created_at?: string;
  updated_at?: string;
}

export interface SavedItem {
  id: string;
  type: 'conversation' | 'resource' | 'draft' | 'citation';
  title: string;
  url?: string;
  category?: string;
  date?: string;
  content?: string;
  created_at?: string;
  metadata?: Record<string, unknown>;
}

export interface DraftNotice {
  id: string;
  templateType: string;
  title: string;
  formData: {
    senderName: string;
    recipientName: string;
    propertyAddress?: string;
    depositAmount?: string;
    noticeDays?: string;
    productName?: string;
    purchaseDate?: string;
    complaintReason?: string;
    salaryMonths?: string;
    salaryAmount?: string;
    invoiceNumber?: string;
    invoiceAmount?: string;
    transactionId?: string;
    bankName?: string;
    incidentDate?: string;
    publicAuthority?: string;
    rtiSubject?: string;
    [key: string]: string | undefined;
  };
  generatedText: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface AnalyzedDocument {
  id: string;
  name: string;
  size: string;
  type: string;
  summary: string;
  clauses: string[];
  riskFlags: string[];
  uploadedAt?: string;
}

export interface LegalResource {
  title: string;
  url: string;
  category: 'Acts & Code' | 'Courts' | 'Legal Aid' | 'Cyber Crime' | 'Consumer Rights' | 'Corporate & Labor';
  description: string;
  badge?: string;
}

export interface AppSettings {
  language: 'English' | 'Hindi (हिंदी)' | 'Kannada (ಕನ್ನಡ)' | 'Tamil (தமிழ்)' | 'Marathi (मराठी)';
  theme: 'light' | 'dark';
  autoSave: boolean;
  citationsVisible: boolean;
  supabaseUrl: string;
  supabaseAnonKey: string;
}

export interface UserProfile {
  id: string;
  email: string;
  fullName?: string;
  isGuest: boolean;
}

export interface SupabaseConnectionStatus {
  isConfigured: boolean;
  isConnected: boolean;
  error?: string | null;
  latencyMs?: number;
}
