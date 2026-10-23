import React, { useState } from 'react';
import {
  Search, ArrowRight, MessageSquare, FileCode, FileText, BookOpen, Sparkles, Shield, RefreshCw
} from 'lucide-react';
import type { ViewType, Conversation } from '../../types';

interface DashboardViewProps {
  setCurrentView: (view: ViewType) => void;
  conversations: Conversation[];
  onSelectConversation: (id: string) => void;
  onQuickQuery: (query: string) => void;
  showToast: (msg: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({
  setCurrentView,
  conversations,
  onSelectConversation,
  onQuickQuery,
  showToast,
}) => {
  const [queryInput, setQueryInput] = useState('');

  const handleQuickSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!queryInput.trim()) return;
    onQuickQuery(queryInput.trim());
    setCurrentView('chat');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto space-y-8 w-full">
      {/* Welcome & Search Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-slate-800 to-teal-900 text-white p-6 sm:p-8 rounded-3xl shadow-xl border border-slate-800 relative overflow-hidden">
        <div className="relative z-10 max-w-2xl">
          <span className="text-xs font-semibold uppercase tracking-wider text-teal-400 bg-teal-950/80 px-2.5 py-1 rounded-md border border-teal-800">
            Welcome to NyayaMate AI
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold mt-3">
            What Indian legal question can we help you understand today?
          </h1>
          <p className="text-slate-300 text-xs sm:text-sm mt-2 leading-relaxed">
            Get instant guidance referenced with Indian statutory acts, draft pre-litigation notices, or analyze rental agreements in plain language.
          </p>

          <form onSubmit={handleQuickSubmit} className="mt-6 flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <Search className="w-5 h-5 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="text"
                placeholder="Describe your legal question... (e.g. Landlord refusing security deposit refund)"
                value={queryInput}
                onChange={(e) => setQueryInput(e.target.value)}
                className="w-full pl-11 pr-4 py-3 bg-white/10 backdrop-blur-md text-white placeholder-slate-400 rounded-xl border border-white/20 focus:outline-none focus:ring-2 focus:ring-teal-400 text-xs sm:text-sm"
              />
            </div>
            <button
              type="submit"
              className="px-6 py-3 bg-teal-500 hover:bg-teal-600 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-1.5 shrink-0 shadow-md cursor-pointer"
            >
              <span>Ask AI</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </form>
        </div>
      </div>

      {/* Quick Action Shortcuts */}
      <div>
        <h2 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Quick Tools & Workflows</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <DashboardShortcut
            icon={<MessageSquare className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            title="AI Legal Chat"
            subtitle="Ask questions in natural language"
            onClick={() => setCurrentView('chat')}
          />
          <DashboardShortcut
            icon={<FileCode className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            title="Draft Generator"
            subtitle="Create formal legal notices"
            onClick={() => setCurrentView('drafts')}
          />
          <DashboardShortcut
            icon={<FileText className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            title="Document Assistant"
            subtitle="Summarize agreements & clauses"
            onClick={() => setCurrentView('documents')}
          />
          <DashboardShortcut
            icon={<BookOpen className="w-5 h-5 text-teal-600 dark:text-teal-400" />}
            title="Official Portals"
            subtitle="India Code & Govt Legal services"
            onClick={() => setCurrentView('resources')}
          />
        </div>
      </div>

      {/* Recent Conversations & Popular Legal Categories */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Conversations */}
        <div className="lg:col-span-2 bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-teal-600" />
                <span>Recent Conversations</span>
              </h2>
              <button
                onClick={() => setCurrentView('conversations')}
                className="text-xs font-semibold text-teal-600 dark:text-teal-400 hover:underline cursor-pointer"
              >
                View All ({conversations.length})
              </button>
            </div>

            <div className="space-y-3">
              {conversations.length === 0 ? (
                <div className="text-center py-8 text-xs text-slate-400">
                  No previous conversations yet. Ask your first legal question above!
                </div>
              ) : (
                conversations.slice(0, 3).map((c) => (
                  <div
                    key={c.id}
                    onClick={() => {
                      onSelectConversation(c.id);
                      setCurrentView('chat');
                    }}
                    className="p-3.5 rounded-2xl border border-slate-100 dark:border-slate-700/60 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer transition"
                  >
                    <div className="flex justify-between items-start">
                      <h3 className="text-sm font-semibold text-slate-800 dark:text-slate-200 hover:text-teal-600 transition">
                        {c.title}
                      </h3>
                      <span className="text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700 px-2 py-0.5 rounded">
                        {c.date}
                      </span>
                    </div>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-1">{c.preview}</p>
                  </div>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center justify-between text-xs text-slate-400">
            <span>Conversations sync automatically to Supabase</span>
            <button
              onClick={() => {
                onSelectConversation('new');
                setCurrentView('chat');
              }}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              + New Consultation
            </button>
          </div>
        </div>

        {/* Popular Legal Categories */}
        <div className="bg-white dark:bg-slate-800 rounded-3xl p-6 border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between">
          <div>
            <h2 className="text-base font-bold text-slate-900 dark:text-white mb-3">Popular Legal Categories</h2>
            <div className="space-y-2.5">
              <CategoryBadge
                label="Tenancy & Rent Control"
                count="Deposit & Eviction"
                onClick={() => {
                  onQuickQuery('What are the legal rules for security deposit return under Tenancy law in India?');
                  setCurrentView('chat');
                }}
              />
              <CategoryBadge
                label="Consumer Protection 2019"
                count="Defects & e-Daakhil"
                onClick={() => {
                  onQuickQuery('How do I file a consumer complaint for a defective product under Consumer Protection Act?');
                  setCurrentView('chat');
                }}
              />
              <CategoryBadge
                label="Cyber Fraud & IT Act"
                count="1930 & RBI Policy"
                onClick={() => {
                  onQuickQuery('What immediate steps should I take if I lost money through a UPI cyber fraud?');
                  setCurrentView('chat');
                }}
              />
              <CategoryBadge
                label="Labour & Salary Claims"
                count="Unpaid Dues Notice"
                onClick={() => {
                  onQuickQuery('How can I legally recover unpaid salary from an employer in India?');
                  setCurrentView('chat');
                }}
              />
            </div>
          </div>

          <div className="mt-6 pt-4 border-t border-slate-100 dark:border-slate-700/60 text-xs text-slate-500">
            <p className="flex items-center gap-1 font-semibold text-slate-700 dark:text-slate-300">
              <Shield className="w-4 h-4 text-teal-600" />
              <span>Statutory Alignment</span>
            </p>
            <p className="mt-1 text-[11px] leading-relaxed">
              Updated to reflect Bharatiya Nyaya Sanhita (BNS) 2023 and Consumer Protection Regulations.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

const DashboardShortcut: React.FC<{
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  onClick: () => void;
}> = ({ icon, title, subtitle, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-teal-500/50 cursor-pointer transition flex items-start gap-3.5 group"
    >
      <div className="p-3 bg-teal-50 dark:bg-teal-950/60 rounded-xl shrink-0 group-hover:scale-105 transition-transform">
        {icon}
      </div>
      <div>
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">{title}</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{subtitle}</p>
      </div>
    </div>
  );
};

const CategoryBadge: React.FC<{
  label: string;
  count: string;
  onClick: () => void;
}> = ({ label, count, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-3 rounded-xl bg-slate-50 dark:bg-slate-700/40 hover:bg-teal-50 dark:hover:bg-teal-950/40 border border-slate-200/60 dark:border-slate-700 flex justify-between items-center cursor-pointer transition text-xs"
    >
      <span className="font-semibold text-slate-700 dark:text-slate-200">{label}</span>
      <span className="text-[10px] text-teal-600 dark:text-teal-400 font-medium bg-white dark:bg-slate-800 px-2 py-0.5 rounded border border-slate-200 dark:border-slate-700">
        {count}
      </span>
    </div>
  );
};
