import React, { useState, useEffect } from 'react';
import type { ViewType, Conversation, AppSettings } from './types';
import { AuthProvider } from './context/AuthContext';
import { DisclaimerBanner } from './components/common/DisclaimerBanner';
import { Header } from './components/common/Header';
import { Sidebar } from './components/common/Sidebar';
import { Toast } from './components/common/Toast';
import { AuthModal } from './components/common/AuthModal';

import { LandingView } from './components/views/LandingView';
import { DashboardView } from './components/views/DashboardView';
import { AIChatView } from './components/views/AIChatView';
import { ConversationsView } from './components/views/ConversationsView';
import { DocumentAssistantView } from './components/views/DocumentAssistantView';
import { DraftGeneratorView } from './components/views/DraftGeneratorView';
import { LegalResourcesView } from './components/views/LegalResourcesView';
import { SavedItemsView } from './components/views/SavedItemsView';
import { SettingsView } from './components/views/SettingsView';

import { fetchConversations } from './services/conversationService';

export default function App() {
  const [currentView, setCurrentView] = useState<ViewType>('landing');
  const [sidebarOpen, setSidebarOpen] = useState<boolean>(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(() => {
    return localStorage.getItem('nyayamate_theme') === 'dark' ||
      (!('nyayamate_theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches);
  });
  const [authModalOpen, setAuthModalOpen] = useState<boolean>(false);
  const [toast, setToast] = useState<{ message: string | null; type?: 'success' | 'info' | 'error' }>({
    message: null,
  });

  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeConversationId, setActiveConversationId] = useState<string>('new');
  const [quickQuery, setQuickQuery] = useState<string>('');

  const [settings, setSettings] = useState<AppSettings>({
    language: 'English',
    theme: darkMode ? 'dark' : 'light',
    autoSave: true,
    citationsVisible: true,
    supabaseUrl: '',
    supabaseAnonKey: '',
  });

  // Dark Mode side effect
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('nyayamate_theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('nyayamate_theme', 'light');
    }
  }, [darkMode]);

  // Load initial conversations from Supabase / localStorage
  useEffect(() => {
    let isMounted = true;
    const loadData = async () => {
      const convs = await fetchConversations();
      if (isMounted) {
        setConversations(convs);
        if (convs.length > 0 && activeConversationId === 'new') {
          setActiveConversationId(convs[0].id);
        }
      }
    };
    loadData();
    return () => {
      isMounted = false;
    };
  }, []);

  const showToast = (message: string, type: 'success' | 'info' | 'error' = 'info') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: null }), 3200);
  };

  const handleSelectConversation = (id: string) => {
    setActiveConversationId(id);
  };

  const handleQuickQuery = (query: string) => {
    setQuickQuery(query);
    setActiveConversationId('new');
  };

  const renderView = () => {
    switch (currentView) {
      case 'landing':
        return <LandingView setCurrentView={setCurrentView} showToast={showToast} />;
      case 'dashboard':
        return (
          <DashboardView
            setCurrentView={setCurrentView}
            conversations={conversations}
            onSelectConversation={handleSelectConversation}
            onQuickQuery={handleQuickQuery}
            showToast={showToast}
          />
        );
      case 'chat':
        return (
          <AIChatView
            activeConversationId={activeConversationId}
            setActiveConversationId={setActiveConversationId}
            conversations={conversations}
            setConversations={setConversations}
            initialQuery={quickQuery}
            onClearInitialQuery={() => setQuickQuery('')}
            onNavigateToDocuments={() => setCurrentView('documents')}
            settings={settings}
            showToast={showToast}
          />
        );
      case 'conversations':
        return (
          <ConversationsView
            conversations={conversations}
            setConversations={setConversations}
            setCurrentView={setCurrentView}
            onSelectConversation={handleSelectConversation}
            showToast={showToast}
          />
        );
      case 'documents':
        return <DocumentAssistantView showToast={showToast} />;
      case 'drafts':
        return <DraftGeneratorView showToast={showToast} />;
      case 'resources':
        return <LegalResourcesView showToast={showToast} />;
      case 'saved':
        return <SavedItemsView showToast={showToast} />;
      case 'settings':
        return (
          <SettingsView
            settings={settings}
            setSettings={setSettings}
            darkMode={darkMode}
            setDarkMode={setDarkMode}
            showToast={showToast}
          />
        );
      default:
        return <LandingView setCurrentView={setCurrentView} showToast={showToast} />;
    }
  };

  return (
    <AuthProvider>
      <div className="min-h-screen font-sans bg-slate-50 dark:bg-slate-900 text-slate-800 dark:text-slate-100 flex flex-col transition-colors duration-200">
        {/* Global Legal Safety Disclaimer */}
        <DisclaimerBanner />

        {/* Global Navigation Header */}
        <Header
          currentView={currentView}
          setCurrentView={setCurrentView}
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          mobileMenuOpen={mobileMenuOpen}
          setMobileMenuOpen={setMobileMenuOpen}
          darkMode={darkMode}
          setDarkMode={setDarkMode}
          onOpenAuth={() => setAuthModalOpen(true)}
          showToast={showToast}
        />

        {/* App Main Area (Sidebar + View) */}
        <div className="flex-1 flex overflow-hidden">
          {currentView !== 'landing' && (
            <Sidebar
              currentView={currentView}
              setCurrentView={setCurrentView}
              sidebarOpen={sidebarOpen}
              mobileMenuOpen={mobileMenuOpen}
              setMobileMenuOpen={setMobileMenuOpen}
            />
          )}

          {renderView()}
        </div>

        {/* Toast Alerts */}
        <Toast message={toast.message} type={toast.type} />

        {/* Supabase Auth Modal */}
        <AuthModal
          isOpen={authModalOpen}
          onClose={() => setAuthModalOpen(false)}
          showToast={showToast}
        />
      </div>
    </AuthProvider>
  );
}
