import React from 'react';
import {
  Shield, MessageSquare, Sparkles, FileText, FileCode, BookOpen, Bookmark, Settings, X, Database
} from 'lucide-react';
import type { ViewType } from '../../types';
import { useAuth } from '../../context/AuthContext';

interface SidebarProps {
  currentView: ViewType;
  setCurrentView: (view: ViewType) => void;
  sidebarOpen: boolean;
  mobileMenuOpen: boolean;
  setMobileMenuOpen: (open: boolean) => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  setCurrentView,
  sidebarOpen,
  mobileMenuOpen,
  setMobileMenuOpen,
}) => {
  const { supabaseStatus } = useAuth();

  const handleNavClick = (view: ViewType) => {
    setCurrentView(view);
    setMobileMenuOpen(false);
  };

  return (
    <>
      {/* Mobile Backdrop */}
      {mobileMenuOpen && (
        <div
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-slate-900/50 backdrop-blur-xs z-40 md:hidden"
        />
      )}

      {/* Sidebar Container */}
      <aside
        className={`bg-white dark:bg-slate-800/90 border-r border-slate-200 dark:border-slate-800 flex flex-col transition-all duration-300 z-50
          ${sidebarOpen ? 'w-64' : 'w-16'}
          ${
            mobileMenuOpen
              ? 'fixed inset-y-0 left-0 w-64 shadow-2xl block'
              : 'hidden md:flex'
          }
        `}
      >
        {/* Mobile Header Inside Drawer */}
        <div className="p-3 border-b border-slate-100 dark:border-slate-700/60 flex md:hidden items-center justify-between">
          <span className="font-bold text-sm text-slate-800 dark:text-white">NyayaMate Menu</span>
          <button
            onClick={() => setMobileMenuOpen(false)}
            className="p-1 text-slate-400 hover:text-slate-600 rounded-lg"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation List */}
        <div className="p-3 flex flex-col gap-1.5 flex-1 overflow-y-auto">
          <SidebarItem
            icon={<Shield />}
            label="Dashboard"
            active={currentView === 'dashboard'}
            onClick={() => handleNavClick('dashboard')}
            collapsed={!sidebarOpen && !mobileMenuOpen}
          />
          <SidebarItem
            icon={<MessageSquare />}
            label="AI Legal Assistant"
            active={currentView === 'chat'}
            onClick={() => handleNavClick('chat')}
            collapsed={!sidebarOpen && !mobileMenuOpen}
            badge="AI"
          />
          <SidebarItem
            icon={<Sparkles />}
            label="My Conversations"
            active={currentView === 'conversations'}
            onClick={() => handleNavClick('conversations')}
            collapsed={!sidebarOpen && !mobileMenuOpen}
          />
          <SidebarItem
            icon={<FileText />}
            label="Document Assistant"
            active={currentView === 'documents'}
            onClick={() => handleNavClick('documents')}
            collapsed={!sidebarOpen && !mobileMenuOpen}
          />
          <SidebarItem
            icon={<FileCode />}
            label="Draft Generator"
            active={currentView === 'drafts'}
            onClick={() => handleNavClick('drafts')}
            collapsed={!sidebarOpen && !mobileMenuOpen}
          />
          <SidebarItem
            icon={<BookOpen />}
            label="Legal Resources"
            active={currentView === 'resources'}
            onClick={() => handleNavClick('resources')}
            collapsed={!sidebarOpen && !mobileMenuOpen}
          />
          <SidebarItem
            icon={<Bookmark />}
            label="Saved Items"
            active={currentView === 'saved'}
            onClick={() => handleNavClick('saved')}
            collapsed={!sidebarOpen && !mobileMenuOpen}
          />

          <div className="my-2 border-t border-slate-200 dark:border-slate-700/60"></div>

          <SidebarItem
            icon={<Settings />}
            label="Settings & Database"
            active={currentView === 'settings'}
            onClick={() => handleNavClick('settings')}
            collapsed={!sidebarOpen && !mobileMenuOpen}
          />
        </div>

        {/* Sidebar Footer with Supabase pill when expanded */}
        {(sidebarOpen || mobileMenuOpen) && (
          <div className="p-3 border-t border-slate-100 dark:border-slate-700/60 text-xs">
            <div
              onClick={() => handleNavClick('settings')}
              className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-700/40 border border-slate-200/60 dark:border-slate-700 flex items-center justify-between cursor-pointer hover:bg-teal-50 dark:hover:bg-teal-950/40 transition"
            >
              <div className="flex items-center gap-2">
                <Database className="w-4 h-4 text-teal-600" />
                <span className="font-medium text-slate-700 dark:text-slate-200 text-xs">
                  {supabaseStatus.isConnected ? 'Supabase Connected' : 'Local Storage Mode'}
                </span>
              </div>
              <span
                className={`w-2 h-2 rounded-full ${
                  supabaseStatus.isConnected ? 'bg-emerald-500' : 'bg-amber-500'
                }`}
              />
            </div>
          </div>
        )}
      </aside>
    </>
  );
};

interface SidebarItemProps {
  icon: React.ReactElement;
  label: string;
  active: boolean;
  onClick: () => void;
  collapsed: boolean;
  badge?: string;
}

const SidebarItem: React.FC<SidebarItemProps> = ({
  icon,
  label,
  active,
  onClick,
  collapsed,
  badge,
}) => {
  return (
    <button
      onClick={onClick}
      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 relative group
        ${
          active
            ? 'bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 border border-teal-200 dark:border-teal-800/60 shadow-sm'
            : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
        }
      `}
      title={collapsed ? label : undefined}
    >
      <div
        className={`${
          active
            ? 'text-teal-600 dark:text-teal-400'
            : 'text-slate-400 dark:text-slate-500 group-hover:text-slate-600 dark:group-hover:text-slate-300'
        }`}
      >
        {React.cloneElement(icon as React.ReactElement<{ className?: string }>, { className: 'w-5 h-5' })}
      </div>
      {!collapsed && <span className="truncate flex-1 text-left">{label}</span>}
      {!collapsed && badge && (
        <span className="text-[10px] bg-teal-600 text-white font-bold px-1.5 py-0.5 rounded-full">
          {badge}
        </span>
      )}
    </button>
  );
};
