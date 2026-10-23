export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      conversations: {
        Row: {
          id: string;
          user_id: string;
          title: string;
          preview: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          title: string;
          preview?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          title?: string;
          preview?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      messages: {
        Row: {
          id: string;
          conversation_id: string;
          sender: 'user' | 'assistant';
          text: string;
          citations: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          conversation_id: string;
          sender: 'user' | 'assistant';
          text: string;
          citations?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          conversation_id?: string;
          sender?: 'user' | 'assistant';
          text?: string;
          citations?: Json;
          created_at?: string;
        };
      };
      saved_items: {
        Row: {
          id: string;
          user_id: string;
          type: string;
          title: string;
          url: string | null;
          category: string | null;
          metadata: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          type: string;
          title: string;
          url?: string | null;
          category?: string | null;
          metadata?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          type?: string;
          title?: string;
          url?: string | null;
          category?: string | null;
          metadata?: Json;
          created_at?: string;
        };
      };
      drafts: {
        Row: {
          id: string;
          user_id: string;
          template_type: string;
          title: string;
          form_data: Json;
          generated_text: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          template_type: string;
          title: string;
          form_data?: Json;
          generated_text: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          template_type?: string;
          title?: string;
          form_data?: Json;
          generated_text?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      documents: {
        Row: {
          id: string;
          user_id: string;
          filename: string;
          file_size: string;
          file_type: string;
          storage_path: string | null;
          summary: string;
          clauses: Json;
          risk_flags: Json;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id?: string;
          filename: string;
          file_size: string;
          file_type: string;
          storage_path?: string | null;
          summary: string;
          clauses?: Json;
          risk_flags?: Json;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          filename?: string;
          file_size?: string;
          file_type?: string;
          storage_path?: string | null;
          summary?: string;
          clauses?: Json;
          risk_flags?: Json;
          created_at?: string;
        };
      };
    };
  };
}
