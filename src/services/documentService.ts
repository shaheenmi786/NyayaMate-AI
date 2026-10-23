import { getSupabaseClient, isSupabaseConfigured } from '../lib/supabase';
import { getCurrentUser } from './authService';
import type { AnalyzedDocument } from '../types';

const STORAGE_DOCS_KEY = 'nyayamate_local_documents';

export const SAMPLE_DOCUMENTS: AnalyzedDocument[] = [
  {
    id: 'sample-doc-1',
    name: 'Residential_Lease_Agreement_Bengaluru.pdf',
    size: '1.2 MB',
    type: 'PDF',
    summary: 'Standard 11-month residential rental agreement under Karnataka Rent Control norms with 10% annual escalation and 2-month notice clause.',
    clauses: [
      'Security Deposit Refund: Clause 4 states deposit must be returned within 30 days of vacation after inspecting premise.',
      'Maintenance Responsibility: Tenant covers routine minor repairs under ₹1,000; major structural repairs are landlord responsibility.',
      'Termination Notice: 2 months written notice required by either party prior to early vacation.',
      'Jurisdiction: Governed by the Courts of Bengaluru, Karnataka.'
    ],
    riskFlags: [
      'Clause 8 mentions painting deduction of 1 full month rent regardless of actual wall condition. Consider negotiating actual repaint invoice instead of flat deduction.'
    ],
    uploadedAt: 'Sample'
  },
  {
    id: 'sample-doc-2',
    name: 'Software_Vendor_Service_Agreement.pdf',
    size: '840 KB',
    type: 'PDF',
    summary: 'B2B software development & maintenance contract with indemnity limit capped at total invoice value.',
    clauses: [
      'Payment Terms: Net 30 days upon invoice issuance via NEFT/RTGS.',
      'Intellectual Property: Deliverables assign to client only upon receipt of 100% final clearance.',
      'Jurisdiction: Governed by the courts of New Delhi, India.'
    ],
    riskFlags: [
      'Uncapped delayed delivery penalty of 1% per day without grace period.'
    ],
    uploadedAt: 'Sample'
  }
];

export async function fetchDocuments(): Promise<AnalyzedDocument[]> {
  const client = getSupabaseClient();
  const user = await getCurrentUser();

  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from('documents')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (!error && data && data.length > 0) {
        return data.map((d) => ({
          id: d.id,
          name: d.filename,
          size: d.file_size,
          type: d.file_type,
          summary: d.summary,
          clauses: Array.isArray(d.clauses) ? (d.clauses as unknown as string[]) : [],
          riskFlags: Array.isArray(d.risk_flags) ? (d.risk_flags as unknown as string[]) : [],
          uploadedAt: new Date(d.created_at).toLocaleDateString(),
        }));
      }
    } catch (err) {
      console.warn('Error fetching documents from Supabase:', err);
    }
  }

  const stored = localStorage.getItem(STORAGE_DOCS_KEY);
  if (stored) {
    try {
      return JSON.parse(stored);
    } catch {
      // ignore
    }
  }

  localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(SAMPLE_DOCUMENTS));
  return SAMPLE_DOCUMENTS;
}

export async function analyzeAndSaveDocument(
  file: File,
  rawText?: string
): Promise<AnalyzedDocument> {
  const client = getSupabaseClient();
  const user = await getCurrentUser();

  // Perform heuristic / plain-language legal analysis of the text or filename
  const textContent = (rawText || '').toLowerCase();
  const isTenancy = textContent.includes('landlord') || textContent.includes('tenant') || textContent.includes('rent') || file.name.toLowerCase().includes('lease') || file.name.toLowerCase().includes('rent');
  const isEmployment = textContent.includes('employee') || textContent.includes('salary') || textContent.includes('probation') || textContent.includes('employment');
  const isB2B = textContent.includes('vendor') || textContent.includes('invoice') || textContent.includes('confidential') || textContent.includes('nda');

  let summary = '';
  const clauses: string[] = [];
  const riskFlags: string[] = [];

  if (isTenancy) {
    summary = `Residential / Commercial Tenancy Agreement (${file.name}). Outlines lease terms, security deposit protocols, and handover obligations.`;
    clauses.push('Security Deposit: Requires refundable deposit with handover condition.');
    clauses.push('Notice Period: Standard 30 to 60 days advance written intimation before vacating.');
    clauses.push('Rent Escalation: Standard 5%–10% escalation upon 11-month renewal.');
    clauses.push('Dispute Resolution: Governed by local State Tenancy & Rent Authority forum.');
    riskFlags.push('Review non-refundable maintenance or painting deduction clauses to avoid unfair security deposit retention.');
  } else if (isEmployment) {
    summary = `Employment / Service Engagement Contract (${file.name}). Defines scope of employment, notice period, compensation, and IP assignment.`;
    clauses.push('Notice Period: Mutual resignation and termination notice stipulations.');
    clauses.push('Intellectual Property: Work-for-hire assignment clause covering all work hours.');
    clauses.push('Confidentiality: Non-disclosure obligations regarding proprietary business info.');
    riskFlags.push('Check whether post-employment Non-Compete restriction exceeds reasonable boundaries under Section 27 of the Indian Contract Act 1872.');
  } else if (isB2B) {
    summary = `Commercial Vendor & Service Agreement (${file.name}). Sets deliverable milestones, invoice payment cycles, and limitation of liability.`;
    clauses.push('Payment Cycle: Invoices payable within stipulated billing window.');
    clauses.push('Limitation of Liability: Liability capped at aggregate fees paid.');
    clauses.push('Termination for Convenience: Right to exit upon written notice.');
    riskFlags.push('Ensure indemnity clause is mutual and does not impose unlimited unilateral third-party claims.');
  } else {
    summary = `Legal Document Overview (${file.name}). General legal text parsed for plain-language review and statutory obligations.`;
    clauses.push('General Terms: Rights, duties, and execution covenants established between parties.');
    clauses.push('Governing Law: Governed by the laws of India and competent civil jurisdictions.');
    riskFlags.push('Ensure any arbitration clause designates an accessible Indian jurisdiction and seat.');
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(1) + ' MB';
  };

  const newDoc: AnalyzedDocument = {
    id: 'doc_' + Date.now().toString(),
    name: file.name,
    size: formatFileSize(file.size),
    type: file.name.split('.').pop()?.toUpperCase() || 'FILE',
    summary,
    clauses,
    riskFlags,
    uploadedAt: new Date().toLocaleDateString(),
  };

  if (client && isSupabaseConfigured()) {
    try {
      const { data, error } = await client
        .from('documents')
        .insert({
          user_id: user.id,
          filename: newDoc.name,
          file_size: newDoc.size,
          file_type: newDoc.type,
          summary: newDoc.summary,
          clauses: newDoc.clauses,
          risk_flags: newDoc.riskFlags,
        })
        .select()
        .single();

      if (!error && data) {
        newDoc.id = data.id;
      }
    } catch (err) {
      console.warn('Error saving document record to Supabase:', err);
    }
  }

  const existing = await fetchDocuments();
  const updated = [newDoc, ...existing];
  localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(updated));

  return newDoc;
}

export async function deleteDocument(id: string): Promise<void> {
  const client = getSupabaseClient();
  if (client && isSupabaseConfigured()) {
    try {
      await client.from('documents').delete().eq('id', id);
    } catch (err) {
      console.warn('Error deleting document from Supabase:', err);
    }
  }

  const existing = await fetchDocuments();
  const updated = existing.filter((d) => d.id !== id);
  localStorage.setItem(STORAGE_DOCS_KEY, JSON.stringify(updated));
}
