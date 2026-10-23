-- ==============================================================================
-- NyayaMate AI — Supabase Database Schema
-- Indian Legal Information Companion
-- ==============================================================================

-- Enable UUID extension if not already enabled
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------------------------
-- 1. CONVERSATIONS TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'anonymous',
    title TEXT NOT NULL DEFAULT 'New Legal Query',
    preview TEXT DEFAULT '',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for querying user conversations ordered by recency
CREATE INDEX IF NOT EXISTS idx_conversations_user_updated 
ON public.conversations(user_id, updated_at DESC);

-- ------------------------------------------------------------------------------
-- 2. MESSAGES TABLE
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender TEXT NOT NULL CHECK (sender IN ('user', 'assistant')),
    text TEXT NOT NULL,
    citations JSONB DEFAULT '[]'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Index for ordering messages within a conversation
CREATE INDEX IF NOT EXISTS idx_messages_conversation 
ON public.messages(conversation_id, created_at ASC);

-- ------------------------------------------------------------------------------
-- 3. SAVED ITEMS TABLE (Bookmarks, Answers, Resources, Drafts)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.saved_items (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'anonymous',
    type TEXT NOT NULL CHECK (type IN ('conversation', 'resource', 'draft', 'citation')),
    title TEXT NOT NULL,
    url TEXT,
    category TEXT,
    metadata JSONB DEFAULT '{}'::jsonb,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_saved_items_user 
ON public.saved_items(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 4. DRAFTS TABLE (Generated Legal Notices & Letters)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.drafts (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'anonymous',
    template_type TEXT NOT NULL,
    title TEXT NOT NULL,
    form_data JSONB DEFAULT '{}'::jsonb NOT NULL,
    generated_text TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_drafts_user 
ON public.drafts(user_id, updated_at DESC);

-- ------------------------------------------------------------------------------
-- 5. DOCUMENTS TABLE (Uploaded & Analyzed Legal Documents)
-- ------------------------------------------------------------------------------
CREATE TABLE IF NOT EXISTS public.documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id TEXT NOT NULL DEFAULT 'anonymous',
    filename TEXT NOT NULL,
    file_size TEXT NOT NULL,
    file_type TEXT NOT NULL,
    storage_path TEXT,
    summary TEXT NOT NULL,
    clauses JSONB DEFAULT '[]'::jsonb NOT NULL,
    risk_flags JSONB DEFAULT '[]'::jsonb NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

CREATE INDEX IF NOT EXISTS idx_documents_user 
ON public.documents(user_id, created_at DESC);

-- ------------------------------------------------------------------------------
-- 6. AUTOMATIC UPDATED_AT TRIGGER
-- ------------------------------------------------------------------------------
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = timezone('utc'::text, now());
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS set_conversations_updated_at ON public.conversations;
CREATE TRIGGER set_conversations_updated_at
    BEFORE UPDATE ON public.conversations
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

DROP TRIGGER IF EXISTS set_drafts_updated_at ON public.drafts;
CREATE TRIGGER set_drafts_updated_at
    BEFORE UPDATE ON public.drafts
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- ------------------------------------------------------------------------------
-- 7. ROW LEVEL SECURITY (RLS) POLICIES
-- ------------------------------------------------------------------------------
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.saved_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.drafts ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.documents ENABLE ROW LEVEL SECURITY;

-- Allow public access for demonstration / client session isolation
-- (In production, replace with auth.uid() = user_id::uuid if Supabase Auth is strictly enforced)
CREATE POLICY "Public and users can view conversations"
    ON public.conversations FOR SELECT
    USING (true);

CREATE POLICY "Public and users can insert conversations"
    ON public.conversations FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public and users can update conversations"
    ON public.conversations FOR UPDATE
    USING (true);

CREATE POLICY "Public and users can delete conversations"
    ON public.conversations FOR DELETE
    USING (true);

-- Messages policies
CREATE POLICY "Public and users can view messages"
    ON public.messages FOR SELECT
    USING (true);

CREATE POLICY "Public and users can insert messages"
    ON public.messages FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public and users can delete messages"
    ON public.messages FOR DELETE
    USING (true);

-- Saved items policies
CREATE POLICY "Public and users can view saved items"
    ON public.saved_items FOR SELECT
    USING (true);

CREATE POLICY "Public and users can insert saved items"
    ON public.saved_items FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public and users can delete saved items"
    ON public.saved_items FOR DELETE
    USING (true);

-- Drafts policies
CREATE POLICY "Public and users can view drafts"
    ON public.drafts FOR SELECT
    USING (true);

CREATE POLICY "Public and users can insert drafts"
    ON public.drafts FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public and users can update drafts"
    ON public.drafts FOR UPDATE
    USING (true);

CREATE POLICY "Public and users can delete drafts"
    ON public.drafts FOR DELETE
    USING (true);

-- Documents policies
CREATE POLICY "Public and users can view documents"
    ON public.documents FOR SELECT
    USING (true);

CREATE POLICY "Public and users can insert documents"
    ON public.documents FOR INSERT
    WITH CHECK (true);

CREATE POLICY "Public and users can delete documents"
    ON public.documents FOR DELETE
    USING (true);

-- ------------------------------------------------------------------------------
-- 8. INITIAL SEED DATA (Official Indian Legal Portals)
-- ------------------------------------------------------------------------------
INSERT INTO public.saved_items (user_id, type, title, url, category, metadata)
VALUES
    ('anonymous', 'resource', 'India Code - Digital Repository of Central & State Acts', 'https://www.indiacode.nic.in/', 'Acts & Code', '{"description": "Official portal hosting updated central and state legislation."}'::jsonb),
    ('anonymous', 'resource', 'Supreme Court of India Official Portal', 'https://www.sci.gov.in/', 'Courts', '{"description": "Official judgments, orders, and case status portal."}'::jsonb),
    ('anonymous', 'resource', 'National Cyber Crime Reporting Portal', 'https://cybercrime.gov.in/', 'Cyber Crime', '{"description": "Report financial cyber frauds and digital crime complaints."}'::jsonb),
    ('anonymous', 'resource', 'National Consumer Helpline (NCH)', 'https://consumerhelpline.gov.in/', 'Consumer Rights', '{"description": "Official dispute filing and brand grievance portal."}'::jsonb),
    ('anonymous', 'resource', 'National Legal Services Authority (NALSA)', 'https://nalsa.gov.in/', 'Legal Aid', '{"description": "Free legal representation for eligible citizen categories."}'::jsonb)
ON CONFLICT DO NOTHING;
