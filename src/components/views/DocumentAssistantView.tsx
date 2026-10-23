import React, { useState, useEffect, useRef } from 'react';
import {
  UploadCloud, FileText, CheckCircle2, Download, Trash2, AlertTriangle, ShieldCheck, RefreshCw
} from 'lucide-react';
import type { AnalyzedDocument } from '../../types';
import { fetchDocuments, analyzeAndSaveDocument, deleteDocument, SAMPLE_DOCUMENTS } from '../../services/documentService';

interface DocumentAssistantViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const DocumentAssistantView: React.FC<DocumentAssistantViewProps> = ({ showToast }) => {
  const [documents, setDocuments] = useState<AnalyzedDocument[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<AnalyzedDocument | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    let isMounted = true;
    const loadDocs = async () => {
      const docs = await fetchDocuments();
      if (isMounted) {
        setDocuments(docs);
        if (docs.length > 0 && !selectedDoc) {
          setSelectedDoc(docs[0]);
        }
      }
    };
    loadDocs();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleFileUpload = async (file: File) => {
    if (!file) return;
    setIsProcessing(true);

    try {
      let rawText = '';
      if (file.type === 'text/plain' || file.name.endsWith('.txt') || file.name.endsWith('.md')) {
        rawText = await file.text();
      }

      const analyzed = await analyzeAndSaveDocument(file, rawText);
      setDocuments((prev) => [analyzed, ...prev]);
      setSelectedDoc(analyzed);
      showToast(`Document "${file.name}" analyzed successfully!`, 'success');
    } catch (err) {
      console.error('File upload error:', err);
      showToast('Could not analyze document', 'error');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files[0]);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    await deleteDocument(id);
    const updated = documents.filter((d) => d.id !== id);
    setDocuments(updated);
    if (selectedDoc?.id === id) {
      setSelectedDoc(updated.length > 0 ? updated[0] : null);
    }
    showToast('Document record removed', 'info');
  };

  const handleExportSummary = () => {
    if (!selectedDoc) return;
    const exportContent = `NYAYAMATE AI — LEGAL DOCUMENT ANALYSIS SUMMARY
File: ${selectedDoc.name} (${selectedDoc.size} • ${selectedDoc.type})
Date: ${new Date().toLocaleDateString()}

==================================================
SUMMARY OVERVIEW
==================================================
${selectedDoc.summary}

==================================================
KEY EXTRACTED CLAUSES
==================================================
${selectedDoc.clauses.map((c, i) => `${i + 1}. ${c}`).join('\n')}

==================================================
IDENTIFIED RISK FACTORS & ADVISORIES
==================================================
${selectedDoc.riskFlags.map((r, i) => `[!] ${r}`).join('\n')}

Notice: This analysis is an educational summary for Indian legal understanding and does not replace counsel by an advocate.`;

    const blob = new Blob([exportContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${selectedDoc.name.replace(/\.[^/.]+$/, '')}_Legal_Summary.txt`;
    a.click();
    URL.revokeObjectURL(url);
    showToast('Exported summary to file', 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Document Assistant</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Upload residential agreements, service contracts, or legal notices for clause breakdown and risk flags.
        </p>
      </div>

      {/* Privacy Notice Pill */}
      <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-300 flex items-center gap-2">
        <ShieldCheck className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
        <span>
          <strong>Privacy First:</strong> Documents are parsed for plain-language clause review. Records can be synced with your Supabase database or kept strictly in local session storage.
        </span>
      </div>

      {/* Drag & Drop Upload Zone */}
      <div
        onDragOver={(e) => e.preventDefault()}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className="p-8 border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-3xl bg-white dark:bg-slate-800 text-center hover:border-teal-500 transition cursor-pointer group shadow-xs"
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={(e) => {
            if (e.target.files && e.target.files.length > 0) {
              handleFileUpload(e.target.files[0]);
            }
          }}
          className="hidden"
          accept=".pdf,.docx,.txt,.md"
        />

        <div className="w-12 h-12 bg-teal-50 dark:bg-teal-950/60 rounded-full flex items-center justify-center mx-auto text-teal-600 dark:text-teal-400 mb-3 group-hover:scale-110 transition-transform">
          {isProcessing ? (
            <RefreshCw className="w-6 h-6 animate-spin" />
          ) : (
            <UploadCloud className="w-6 h-6" />
          )}
        </div>

        <h3 className="font-bold text-slate-800 dark:text-slate-200 text-sm sm:text-base">
          {isProcessing ? 'Analyzing agreement clauses...' : 'Drag & drop your legal document here'}
        </h3>
        <p className="text-xs text-slate-400 mt-1">
          Supports PDF, DOCX, and TXT files up to 10MB
        </p>

        <div className="mt-4 flex flex-wrap justify-center gap-2">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const sample = SAMPLE_DOCUMENTS[0];
              setSelectedDoc(sample);
              if (!documents.some((d) => d.name === sample.name)) {
                setDocuments([sample, ...documents]);
              }
              showToast('Loaded Bengaluru Rental Agreement', 'info');
            }}
            className="px-3.5 py-2 bg-slate-900 dark:bg-teal-600 text-white font-semibold rounded-xl text-xs hover:bg-slate-800 dark:hover:bg-teal-700 transition cursor-pointer"
          >
            Load Sample Rental Lease
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              const sample = SAMPLE_DOCUMENTS[1];
              setSelectedDoc(sample);
              if (!documents.some((d) => d.name === sample.name)) {
                setDocuments([sample, ...documents]);
              }
              showToast('Loaded Vendor Service Contract', 'info');
            }}
            className="px-3.5 py-2 bg-slate-100 dark:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-xl text-xs hover:bg-slate-200 dark:hover:bg-slate-600 transition cursor-pointer"
          >
            Load Vendor Contract
          </button>
        </div>
      </div>

      {/* Analysis Result Workspace */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Document List */}
        <div className="space-y-3">
          <h2 className="text-sm font-bold text-slate-900 dark:text-white flex items-center justify-between">
            <span>Analyzed Documents</span>
            <span className="text-xs text-slate-400 font-normal">({documents.length})</span>
          </h2>

          <div className="space-y-2">
            {documents.length === 0 ? (
              <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-400 text-center">
                No documents uploaded yet.
              </div>
            ) : (
              documents.map((doc) => (
                <div
                  key={doc.id}
                  onClick={() => setSelectedDoc(doc)}
                  className={`p-3.5 rounded-2xl border cursor-pointer transition flex items-center justify-between gap-3 ${
                    selectedDoc?.id === doc.id
                      ? 'bg-teal-50 dark:bg-teal-950/60 border-teal-500 text-teal-900 dark:text-teal-200 shadow-xs'
                      : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-slate-300'
                  }`}
                >
                  <div className="flex items-center gap-2.5 min-w-0">
                    <FileText className="w-5 h-5 text-teal-600 shrink-0" />
                    <div className="truncate">
                      <p className="font-semibold text-xs truncate text-slate-800 dark:text-slate-200">
                        {doc.name}
                      </p>
                      <p className="text-[10px] text-slate-400 mt-0.5">
                        {doc.size} • {doc.type}
                      </p>
                    </div>
                  </div>

                  <button
                    onClick={(e) => handleDelete(doc.id, e)}
                    className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg transition shrink-0 cursor-pointer"
                    title="Remove"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Detailed Breakdown Panel */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm">
          {selectedDoc ? (
            <div className="space-y-6">
              <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
                <div className="flex justify-between items-start gap-4">
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                      Plain-Language AI Breakdown
                    </span>
                    <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                      {selectedDoc.name}
                    </h2>
                  </div>
                  <span className="text-xs text-slate-400 font-mono">
                    {selectedDoc.size} • {selectedDoc.type}
                  </span>
                </div>

                <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 mt-3 leading-relaxed">
                  {selectedDoc.summary}
                </p>
              </div>

              {/* Key Clauses */}
              <div>
                <h3 className="font-bold text-xs uppercase tracking-wider text-slate-400 mb-3">
                  Key Clauses Extracted
                </h3>
                <div className="space-y-2.5">
                  {selectedDoc.clauses.map((clause, i) => (
                    <div
                      key={i}
                      className="p-3 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700/80 text-xs text-slate-700 dark:text-slate-300 flex items-start gap-2.5"
                    >
                      <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                      <span className="leading-relaxed">{clause}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Risk Flags */}
              {selectedDoc.riskFlags && selectedDoc.riskFlags.length > 0 && (
                <div>
                  <h3 className="font-bold text-xs uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-3 flex items-center gap-1.5">
                    <AlertTriangle className="w-3.5 h-3.5" />
                    <span>Identified Risk Flags & Cautionary Points</span>
                  </h3>
                  <div className="space-y-2">
                    {selectedDoc.riskFlags.map((risk, i) => (
                      <div
                        key={i}
                        className="p-3 bg-amber-50 dark:bg-amber-950/40 rounded-xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-900 dark:text-amber-300 flex items-start gap-2"
                      >
                        <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0 mt-0.5" />
                        <span className="leading-relaxed">{risk}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Export button */}
              <div className="pt-2 flex gap-3">
                <button
                  onClick={handleExportSummary}
                  className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Export Analysis Summary</span>
                </button>
              </div>
            </div>
          ) : (
            <div className="text-center py-16 text-slate-400 text-xs">
              Select a document from the list or upload an agreement to preview clause extraction.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
