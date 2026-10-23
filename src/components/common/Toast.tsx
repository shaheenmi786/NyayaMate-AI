import React from 'react';
import { Sparkles, CheckCircle, AlertCircle, Info } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info' | 'error';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'info' }) => {
  if (!message) return null;

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-4 h-4 text-emerald-400 shrink-0" />;
      case 'error':
        return <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />;
      default:
        return <Sparkles className="w-4 h-4 text-teal-400 shrink-0" />;
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 bg-slate-900/95 dark:bg-slate-100/95 text-white dark:text-slate-900 px-4 py-3 rounded-xl shadow-2xl text-xs sm:text-sm flex items-center gap-2.5 border border-slate-700/80 dark:border-slate-300/80 backdrop-blur-md transition-all duration-300 animate-in slide-in-from-bottom-5">
      {getIcon()}
      <span className="font-medium">{message}</span>
    </div>
  );
};
