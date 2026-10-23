import React from 'react';
import { AlertTriangle, ShieldCheck } from 'lucide-react';

export const DisclaimerBanner: React.FC = () => {
  return (
    <div className="bg-amber-50 dark:bg-amber-950/40 border-b border-amber-200 dark:border-amber-800/50 px-4 py-2 text-xs md:text-sm text-amber-900 dark:text-amber-300">
      <div className="flex items-center justify-between gap-3 max-w-7xl mx-auto w-full">
        <div className="flex items-center gap-2">
          <AlertTriangle className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0" />
          <span>
            <strong>Legal Notice:</strong> NyayaMate AI provides general Indian legal information for educational purposes only and is not an advocate or law firm. Consult a qualified advocate for fact-specific legal counsel.
          </span>
        </div>
        <div className="hidden lg:flex items-center gap-1 text-[11px] text-amber-700 dark:text-amber-400 font-mono shrink-0">
          <ShieldCheck className="w-3.5 h-3.5" />
          <span>BNS 2023 & Indian Statutory Grounding</span>
        </div>
      </div>
    </div>
  );
};
