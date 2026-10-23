import React, { useState } from 'react';
import {
  Database, CheckCircle, AlertCircle, RefreshCw, Moon, Sun, Globe,
  Shield, Trash2, Key, Link as LinkIcon, BookOpen, ExternalLink
} from 'lucide-react';
import type { AppSettings } from '../../types';
import { useAuth } from '../../context/AuthContext';
import { getSupabaseConfig, setSupabaseConfig, clearSupabaseConfig, testSupabaseConnection } from '../../lib/supabase';

interface SettingsViewProps {
  settings: AppSettings;
  setSettings: React.Dispatch<React.SetStateAction<AppSettings>>;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SettingsView: React.FC<SettingsViewProps> = ({
  settings,
  setSettings,
  darkMode,
  setDarkMode,
  showToast,
}) => {
  const { refreshSupabaseStatus, supabaseStatus } = useAuth();

  // Supabase connection form state
  const currentConfig = getSupabaseConfig();
  const [supabaseUrl, setSupabaseUrl] = useState(currentConfig.url);
  const [supabaseKey, setSupabaseKey] = useState(currentConfig.anonKey);
  const [testingConnection, setTestingConnection] = useState(false);
  const [testResult, setTestResult] = useState<{ success: boolean; message: string; latency?: number } | null>(null);

  const handleSaveSupabaseConfig = async (e: React.FormEvent) => {
    e.preventDefault();
    setTestingConnection(true);
    setTestResult(null);

    setSupabaseConfig(supabaseUrl, supabaseKey);
    await refreshSupabaseStatus();

    const result = await testSupabaseConnection();
    setTestResult({
      success: result.success,
      message: result.message,
      latency: result.latencyMs,
    });

    setTestingConnection(false);

    if (result.success) {
      showToast('Supabase configuration saved & connected!', 'success');
    } else {
      showToast('Supabase configured, but connection check returned an error', 'error');
    }
  };

  const handleResetSupabaseConfig = async () => {
    clearSupabaseConfig();
    const envConfig = getSupabaseConfig();
    setSupabaseUrl(envConfig.url);
    setSupabaseKey(envConfig.anonKey);
    setTestResult(null);
    await refreshSupabaseStatus();
    showToast('Reset to environment variables', 'info');
  };

  const handleClearSession = () => {
    if (window.confirm('Are you sure you want to clear your local session cache and conversation history?')) {
      localStorage.removeItem('nyayamate_local_conversations');
      localStorage.removeItem('nyayamate_local_saved_items');
      localStorage.removeItem('nyayamate_local_drafts');
      localStorage.removeItem('nyayamate_local_documents');
      showToast('Local session workspace cleared', 'info');
      setTimeout(() => window.location.reload(), 800);
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-4xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Preferences & Settings</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Configure Supabase backend integration, statutory language, citation visibility, and storage retention.
        </p>
      </div>

      {/* 1. Supabase Backend Integration Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
        <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-700 pb-4">
          <div className="flex items-center gap-3">
            <div className="p-2.5 bg-teal-50 dark:bg-teal-950/60 rounded-2xl text-teal-600 dark:text-teal-400">
              <Database className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base text-slate-900 dark:text-white">
                Supabase Backend Configuration
              </h2>
              <p className="text-xs text-slate-500">
                Connect your Supabase PostgreSQL instance to persist conversations, drafts, and documents in the cloud.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold ${
                supabaseStatus.isConnected
                  ? 'bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-amber-50 dark:bg-amber-950 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800'
              }`}
            >
              <span
                className={`w-2 h-2 rounded-full ${
                  supabaseStatus.isConnected ? 'bg-emerald-500' : 'bg-amber-500 animate-pulse'
                }`}
              />
              <span>{supabaseStatus.isConnected ? 'Connected' : 'Local Offline Mode'}</span>
            </span>
          </div>
        </div>

        <form onSubmit={handleSaveSupabaseConfig} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Supabase Project URL
            </label>
            <div className="relative">
              <LinkIcon className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="url"
                placeholder="https://your-project-id.supabase.co"
                value={supabaseUrl}
                onChange={(e) => setSupabaseUrl(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">
              Supabase Anon / Public Key
            </label>
            <div className="relative">
              <Key className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
              <input
                type="password"
                placeholder="eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
                value={supabaseKey}
                onChange={(e) => setSupabaseKey(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 font-mono focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Found in your Supabase Dashboard under <strong>Project Settings → API → Project API Keys</strong>.
            </p>
          </div>

          {testResult && (
            <div
              className={`p-3.5 rounded-2xl text-xs flex items-start gap-2.5 ${
                testResult.success
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800'
                  : 'bg-rose-50 dark:bg-rose-950/40 text-rose-800 dark:text-rose-300 border border-rose-200 dark:border-rose-800'
              }`}
            >
              {testResult.success ? (
                <CheckCircle className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
              ) : (
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
              )}
              <div className="flex-1">
                <p className="font-semibold">{testResult.message}</p>
              </div>
            </div>
          )}

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="submit"
              disabled={testingConnection}
              className="px-5 py-2.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center gap-2 shadow-sm cursor-pointer disabled:opacity-50"
            >
              {testingConnection ? <RefreshCw className="w-4 h-4 animate-spin" /> : <CheckCircle className="w-4 h-4" />}
              <span>Save & Connect</span>
            </button>

            <button
              type="button"
              onClick={handleResetSupabaseConfig}
              className="px-4 py-2.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 font-semibold rounded-xl text-xs transition cursor-pointer"
            >
              Reset to .env Defaults
            </button>
          </div>
        </form>

        {/* Database setup reminder */}
        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 bg-slate-50 dark:bg-slate-900/40 p-4 rounded-2xl text-xs text-slate-600 dark:text-slate-300 space-y-1.5">
          <p className="font-semibold text-slate-900 dark:text-white flex items-center gap-1.5">
            <BookOpen className="w-4 h-4 text-teal-600" />
            <span>Database Schema Ready (`supabase/schema.sql`)</span>
          </p>
          <p className="text-[11px] leading-relaxed text-slate-500 dark:text-slate-400">
            Copy and run the contents of <code>supabase/schema.sql</code> directly inside your Supabase project's SQL Editor to create all 5 tables (conversations, messages, saved_items, drafts, documents) with Row Level Security (RLS).
          </p>
        </div>
      </div>

      {/* 2. Preferences Section */}
      <div className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 p-6 space-y-6 shadow-sm">
        <h2 className="font-bold text-base text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-700 pb-3">
          Application Preferences
        </h2>

        {/* Appearance Mode */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              {darkMode ? <Moon className="w-4 h-4 text-teal-400" /> : <Sun className="w-4 h-4 text-amber-500" />}
              <span>Dark Theme Mode</span>
            </h3>
            <p className="text-xs text-slate-500">
              Toggle light / dark color palette for day or night reading.
            </p>
          </div>
          <button
            onClick={() => {
              setDarkMode(!darkMode);
              showToast(`Switched to ${!darkMode ? 'Dark' : 'Light'} theme`);
            }}
            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
              darkMode ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                darkMode ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        {/* Preferred Language */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <Globe className="w-4 h-4 text-teal-600" />
              <span>Preferred Legal Language</span>
            </h3>
            <p className="text-xs text-slate-500">
              Primary language for AI assistant summaries & statutory definitions.
            </p>
          </div>
          <select
            value={settings.language}
            onChange={(e) => {
              const lang = e.target.value as AppSettings['language'];
              setSettings({ ...settings, language: lang });
              showToast(`Language set to ${lang}`);
            }}
            className="px-3 py-2 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 font-medium"
          >
            <option>English</option>
            <option>Hindi (हिंदी)</option>
            <option>Kannada (ಕನ್ನಡ)</option>
            <option>Tamil (தமிழ்)</option>
            <option>Marathi (मराठी)</option>
          </select>
        </div>

        {/* Citations Visibility */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100 dark:border-slate-700">
          <div>
            <h3 className="font-semibold text-sm text-slate-900 dark:text-white flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-teal-600" />
              <span>Show Statutory Citations</span>
            </h3>
            <p className="text-xs text-slate-500">
              Display reference cards to primary Acts & portals beneath answers.
            </p>
          </div>
          <button
            onClick={() => {
              const updated = !settings.citationsVisible;
              setSettings({ ...settings, citationsVisible: updated });
              showToast(`Citations ${updated ? 'enabled' : 'hidden'}`);
            }}
            className={`w-12 h-6 rounded-full p-1 transition-colors cursor-pointer ${
              settings.citationsVisible ? 'bg-teal-600' : 'bg-slate-300 dark:bg-slate-600'
            }`}
          >
            <div
              className={`w-4 h-4 rounded-full bg-white transition-transform ${
                settings.citationsVisible ? 'translate-x-6' : ''
              }`}
            />
          </button>
        </div>

        {/* Data Reset */}
        <div className="flex items-center justify-between pt-2">
          <div>
            <h3 className="font-semibold text-sm text-rose-600 dark:text-rose-400 flex items-center gap-2">
              <Trash2 className="w-4 h-4" />
              <span>Reset Local Workspace Cache</span>
            </h3>
            <p className="text-xs text-slate-500">
              Clear all locally stored conversations, drafts, and cached documents.
            </p>
          </div>
          <button
            onClick={handleClearSession}
            className="px-4 py-2 border border-rose-200 dark:border-rose-900 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-xl text-xs font-semibold transition cursor-pointer"
          >
            Clear Local Data
          </button>
        </div>
      </div>

      {/* 3. Statutory & Privacy Compliance Disclosures */}
      <div className="bg-slate-100 dark:bg-slate-800/50 rounded-3xl p-6 text-xs text-slate-600 dark:text-slate-400 space-y-2 border border-slate-200 dark:border-slate-700">
        <h4 className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Shield className="w-4 h-4 text-teal-600" />
          <span>Statutory Compliance & Privacy Policy</span>
        </h4>
        <p className="leading-relaxed">
          NyayaMate AI adheres to the Digital Personal Data Protection (DPDP) Act, 2023. We do not sell or harvest user inquiries for external advertising. All cited statutory references link to official repositories (India Code, Supreme Court, eCourts, NALSA). NyayaMate AI does not constitute legal representation under the Advocates Act, 1961.
        </p>
      </div>
    </div>
  );
};
