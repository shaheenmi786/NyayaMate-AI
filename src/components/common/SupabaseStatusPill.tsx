import React from 'react';
import { Database, CheckCircle, AlertCircle, RefreshCw } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

interface Props {
  onOpenSettings?: () => void;
}

export const SupabaseStatusPill: React.FC<Props> = ({ onOpenSettings }) => {
  const { supabaseStatus, refreshSupabaseStatus } = useAuth();
  const [testing, setTesting] = React.useState(false);

  const handleTest = async (e: React.MouseEvent) => {
    e.stopPropagation();
    setTesting(true);
    await refreshSupabaseStatus();
    setTesting(false);
  };

  if (!supabaseStatus.isConfigured) {
    return (
      <button
        onClick={onOpenSettings}
        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border border-amber-200 dark:border-amber-800 hover:bg-amber-100 transition"
        title="Supabase not configured. Click to configure in Settings."
      >
        <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse"></span>
        <Database className="w-3 h-3" />
        <span>Supabase: Local Mode</span>
      </button>
    );
  }

  if (supabaseStatus.isConnected) {
    return (
      <button
        onClick={handleTest}
        disabled={testing}
        className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 hover:bg-emerald-100 transition"
        title={`Connected to Supabase (${supabaseStatus.latencyMs || 0}ms). Click to test.`}
      >
        {testing ? (
          <RefreshCw className="w-3 h-3 animate-spin text-emerald-600" />
        ) : (
          <CheckCircle className="w-3 h-3 text-emerald-600" />
        )}
        <span>Supabase: Live</span>
        {supabaseStatus.latencyMs !== undefined && (
          <span className="text-[10px] font-mono text-emerald-600 dark:text-emerald-400">
            {supabaseStatus.latencyMs}ms
          </span>
        )}
      </button>
    );
  }

  return (
    <button
      onClick={handleTest}
      disabled={testing}
      className="hidden sm:inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border border-rose-200 dark:border-rose-800 hover:bg-rose-100 transition"
      title={supabaseStatus.error || 'Connection error. Click to re-test.'}
    >
      <AlertCircle className="w-3 h-3 text-rose-600" />
      <span>Supabase: Offline</span>
    </button>
  );
};
