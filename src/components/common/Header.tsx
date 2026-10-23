import React, { useState } from 'react';
import {
  Scale, Menu, ChevronRight, Sun, Moon, Bell, ChevronDown, Settings, LogIn, LogOut, Globe
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { SupabaseStatusPill } from './SupabaseStatusPill';
import type { ViewType } from '../../types';

interface HeaderProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  sidebarOpen: boolean;
  setSidebarOpen: (open: boolean) => void;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
  darkMode: boolean;
  setDarkMode: (dark: boolean) => void;
  onOpenAuth: () => void;
  showToast: (msg: string) => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentView,
  setCurrentView,
  sidebarOpen,
  setSidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
  darkMode,
  setDarkMode,
  onOpenAuth,
  showToast,
}) => {
  const { user, signOut } = useAuth();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [userProfileOpen, setUserProfileOpen] = useState(false);

  const handleSignOut = async () => {
    await signOut();
    setUserProfileOpen(false);
    showToast('Signed out of session');
  };

  return (
    <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200 dark:border-slate-800 px-4 py-3 flex items-center justify-between">
      {/* Left: Hamburger & Logo */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 hidden md:block"
          title="Toggle Sidebar"
        >
          <Menu className="w-5 h-5" />
        </button>
        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="p-2 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 transition text-slate-600 dark:text-slate-300 md:hidden"
          title="Toggle Mobile Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        {/* Brand Logo */}
        <div
          onClick={() => setCurrentView('landing')}
          className="flex items-center gap-2.5 cursor-pointer group"
        >
          <div className="bg-gradient-to-tr from-slate-900 to-teal-700 dark:from-teal-600 dark:to-cyan-500 p-2 rounded-xl text-white shadow-md group-hover:scale-105 transition-transform">
            <Scale className="w-5 h-5" />
          </div>
          <div>
            <span className="font-bold text-lg tracking-tight text-slate-900 dark:text-white flex items-center gap-1">
              NyayaMate{' '}
              <span className="text-teal-600 dark:text-teal-400 font-extrabold text-xs px-1.5 py-0.5 bg-teal-50 dark:bg-teal-950/60 rounded border border-teal-200 dark:border-teal-800">
                AI
              </span>
            </span>
          </div>
        </div>
      </div>

      {/* Right: Actions, Supabase Pill, Dark Mode, Notifications, User Profile */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Supabase Status Pill */}
        <SupabaseStatusPill onOpenSettings={() => setCurrentView('settings')} />

        {/* Switcher button */}
        {currentView === 'landing' ? (
          <button
            onClick={() => setCurrentView('dashboard')}
            className="px-3.5 py-1.5 text-xs md:text-sm font-semibold bg-teal-600 hover:bg-teal-700 text-white rounded-xl shadow-sm transition flex items-center gap-1.5"
          >
            <span>Launch App</span>
            <ChevronRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={() => setCurrentView('landing')}
            className="hidden sm:flex px-3 py-1.5 text-xs font-medium text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition items-center gap-1"
          >
            <Globe className="w-3.5 h-3.5 text-teal-600" />
            <span>Public Site</span>
          </button>
        )}

        {/* Dark Mode Toggle */}
        <button
          onClick={() => setDarkMode(!darkMode)}
          className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition"
          title="Toggle Theme"
        >
          {darkMode ? <Sun className="w-5 h-5 text-amber-400" /> : <Moon className="w-5 h-5" />}
        </button>

        {/* Notifications Dropdown */}
        <div className="relative">
          <button
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="p-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition relative"
            title="Statutory Updates"
          >
            <Bell className="w-5 h-5" />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-teal-500 rounded-full"></span>
          </button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 text-xs md:text-sm animate-in fade-in">
              <div className="px-4 py-2 font-semibold border-b border-slate-100 dark:border-slate-700 flex justify-between items-center">
                <span>Legal & System Updates</span>
                <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                  2026 Ready
                </span>
              </div>
              <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Bharatiya Nyaya Sanhita (BNS) 2023
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Statutory citations updated with new criminal code transitions (Sections 316 & 318).
                  </p>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Consumer Protection 2026 Guidelines
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Updated e-Daakhil filing workflow and 7-day warranty dispute notice templates.
                  </p>
                </div>
                <div className="p-3 hover:bg-slate-50 dark:hover:bg-slate-700/50 cursor-pointer">
                  <p className="font-semibold text-slate-800 dark:text-slate-200">
                    Supabase Cloud Backend
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                    Conversations, messages, drafts, and bookmarks can now sync directly to your Supabase PostgreSQL.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Profile Dropdown */}
        <div className="relative">
          <button
            onClick={() => setUserProfileOpen(!userProfileOpen)}
            className="flex items-center gap-2 p-1.5 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl transition"
          >
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-900 to-teal-800 text-white flex items-center justify-center font-bold text-xs border border-teal-500/50">
              {user.isGuest ? 'G' : user.fullName ? user.fullName[0].toUpperCase() : 'U'}
            </div>
            <ChevronDown className="w-3.5 h-3.5 text-slate-500 hidden sm:block" />
          </button>

          {userProfileOpen && (
            <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-slate-800 rounded-2xl shadow-xl border border-slate-200 dark:border-slate-700 py-2 z-50 text-sm animate-in fade-in">
              <div className="px-4 py-2.5 border-b border-slate-100 dark:border-slate-700">
                <p className="font-semibold text-slate-900 dark:text-white truncate">
                  {user.fullName || 'Citizen User'}
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 truncate mt-0.5">
                  {user.email}
                </p>
                <span className="inline-block mt-1.5 text-[10px] px-2 py-0.5 rounded font-medium bg-slate-100 dark:bg-slate-700 text-slate-600 dark:text-slate-300">
                  {user.isGuest ? 'Local Session Mode' : 'Supabase Cloud Account'}
                </span>
              </div>

              <button
                onClick={() => {
                  setCurrentView('settings');
                  setUserProfileOpen(false);
                }}
                className="w-full text-left px-4 py-2 text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700 flex items-center gap-2 text-xs"
              >
                <Settings className="w-4 h-4 text-slate-400" />
                <span>Preferences & Supabase Config</span>
              </button>

              <div className="border-t border-slate-100 dark:border-slate-700 my-1"></div>

              {user.isGuest ? (
                <button
                  onClick={() => {
                    setUserProfileOpen(false);
                    onOpenAuth();
                  }}
                  className="w-full text-left px-4 py-2 text-teal-600 dark:text-teal-400 hover:bg-teal-50 dark:hover:bg-teal-950/40 flex items-center gap-2 text-xs font-semibold"
                >
                  <LogIn className="w-4 h-4" />
                  <span>Sign In / Connect Account</span>
                </button>
              ) : (
                <button
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center gap-2 text-xs font-semibold"
                >
                  <LogOut className="w-4 h-4" />
                  <span>Sign Out</span>
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
