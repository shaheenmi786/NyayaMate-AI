import React, { useState } from 'react';
import { X, Lock, Mail, User, Shield, ArrowRight, Loader2, Database } from 'lucide-react';
import { signInWithEmail, signUpWithEmail, getCurrentUser } from '../../services/authService';
import { useAuth } from '../../context/AuthContext';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, showToast }) => {
  const { setUser, supabaseStatus } = useAuth();
  const [mode, setMode] = useState<'signin' | 'signup'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);
    setIsLoading(true);

    if (mode === 'signin') {
      const result = await signInWithEmail(email, password);
      if (result.success) {
        const u = await getCurrentUser();
        setUser(u);
        showToast('Successfully signed in!', 'success');
        onClose();
      } else {
        setErrorMsg(result.error || 'Failed to sign in');
      }
    } else {
      const result = await signUpWithEmail(email, password, fullName);
      if (result.success) {
        const u = await getCurrentUser();
        setUser(u);
        showToast('Account created! Please check your email for confirmation.', 'success');
        onClose();
      } else {
        setErrorMsg(result.error || 'Failed to sign up');
      }
    }
    setIsLoading(false);
  };

  const handleContinueAsGuest = async () => {
    const u = await getCurrentUser();
    setUser(u);
    showToast('Continuing with local session workspace');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in">
      <div className="relative w-full max-w-md bg-white dark:bg-slate-800 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 p-6 sm:p-8 overflow-hidden">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-5 right-5 p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-700 transition"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-10 h-10 rounded-2xl bg-teal-50 dark:bg-teal-950/80 text-teal-600 dark:text-teal-400 flex items-center justify-center border border-teal-200 dark:border-teal-800">
            <Lock className="w-5 h-5" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-slate-900 dark:text-white">
              {mode === 'signin' ? 'Welcome Back' : 'Create Account'}
            </h2>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {mode === 'signin'
                ? 'Sign in to sync your legal consultations with Supabase'
                : 'Register for personalized legal workspace access'}
            </p>
          </div>
        </div>

        {/* Supabase status notice */}
        {!supabaseStatus.isConfigured && (
          <div className="mb-5 p-3.5 bg-amber-50 dark:bg-amber-950/40 rounded-2xl border border-amber-200 dark:border-amber-800/60 text-xs text-amber-800 dark:text-amber-300 flex items-start gap-2">
            <Database className="w-4 h-4 text-amber-600 dark:text-amber-400 shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold">Local Offline Mode Active</p>
              <p className="mt-0.5 text-[11px] opacity-90">
                You can test all features right now as Guest! To enable multi-device cloud accounts, connect your Supabase project in Settings.
              </p>
            </div>
          </div>
        )}

        {errorMsg && (
          <div className="mb-4 p-3 bg-red-50 dark:bg-red-950/50 text-red-600 dark:text-red-300 rounded-xl text-xs border border-red-200 dark:border-red-800">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {mode === 'signup' && (
            <div>
              <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Full Name</label>
              <div className="relative">
                <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  required
                  placeholder="e.g. Aarav Sharma"
                  value={fullName}
                  onChange={(e) => setFullName(e.target.value)}
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Email Address</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="email"
                required
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl text-xs sm:text-sm text-slate-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-teal-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-xl text-xs sm:text-sm transition flex items-center justify-center gap-2 shadow-lg hover:shadow-teal-500/25 disabled:opacity-50"
          >
            {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : <ArrowRight className="w-4 h-4" />}
            <span>{mode === 'signin' ? 'Sign In with Supabase' : 'Create Free Account'}</span>
          </button>
        </form>

        <div className="mt-4 pt-4 border-t border-slate-100 dark:border-slate-700/60 flex flex-col gap-2.5">
          <button
            type="button"
            onClick={handleContinueAsGuest}
            className="w-full py-2.5 bg-slate-100 dark:bg-slate-700/60 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-medium rounded-xl text-xs transition"
          >
            Continue as Guest (No Login Required)
          </button>

          <p className="text-center text-xs text-slate-500 dark:text-slate-400">
            {mode === 'signin' ? "Don't have an account? " : 'Already have an account? '}
            <button
              onClick={() => {
                setMode(mode === 'signin' ? 'signup' : 'signin');
                setErrorMsg(null);
              }}
              className="text-teal-600 dark:text-teal-400 font-semibold hover:underline"
            >
              {mode === 'signin' ? 'Sign Up' : 'Sign In'}
            </button>
          </p>
        </div>

        <div className="mt-4 text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
          <Shield className="w-3 h-3 text-teal-600" />
          <span>Committed to Indian Privacy & Minimal Data Retention</span>
        </div>
      </div>
    </div>
  );
};
