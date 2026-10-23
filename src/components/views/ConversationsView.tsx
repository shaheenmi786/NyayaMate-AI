import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, MessageSquare, Calendar } from 'lucide-react';
import type { Conversation, ViewType } from '../../types';
import { updateConversationTitle, deleteConversation } from '../../services/conversationService';

interface ConversationsViewProps {
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  setCurrentView: (view: ViewType) => void;
  onSelectConversation: (id: string) => void;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const ConversationsView: React.FC<ConversationsViewProps> = ({
  conversations,
  setConversations,
  setCurrentView,
  onSelectConversation,
  showToast,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTitle, setEditTitle] = useState('');

  const filtered = conversations.filter(
    (c) =>
      c.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      c.preview.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    await deleteConversation(id);
    setConversations((prev) => prev.filter((c) => c.id !== id));
    showToast('Conversation deleted', 'info');
  };

  const handleStartEdit = (c: Conversation) => {
    setEditingId(c.id);
    setEditTitle(c.title);
  };

  const handleSaveEdit = async (id: string) => {
    if (!editTitle.trim()) return;
    await updateConversationTitle(id, editTitle.trim());
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title: editTitle.trim() } : c))
    );
    setEditingId(null);
    showToast('Conversation title updated', 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">My Conversations</h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Access, search, and manage your AI legal consultation threads
          </p>
        </div>
        <button
          onClick={() => {
            onSelectConversation('new');
            setCurrentView('chat');
          }}
          className="px-4 py-2.5 bg-teal-600 hover:bg-teal-700 text-white rounded-xl text-xs sm:text-sm font-semibold transition flex items-center gap-1.5 shadow-sm cursor-pointer"
        >
          <Plus className="w-4 h-4" />
          <span>Start New Consultation</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative">
        <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
        <input
          type="text"
          placeholder="Search saved conversations by title or topic..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
        />
      </div>

      {/* List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400 text-xs sm:text-sm space-y-2">
            <MessageSquare className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p>No matching conversations found.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition"
            >
              <div className="flex-1 min-w-0">
                {editingId === item.id ? (
                  <div className="flex items-center gap-2 mb-2">
                    <input
                      type="text"
                      value={editTitle}
                      onChange={(e) => setEditTitle(e.target.value)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter') handleSaveEdit(item.id);
                        if (e.key === 'Escape') setEditingId(null);
                      }}
                      className="px-3 py-1.5 bg-slate-50 dark:bg-slate-700 border border-teal-500 rounded-xl text-xs text-slate-900 dark:text-white flex-1 focus:outline-none"
                      autoFocus
                    />
                    <button
                      onClick={() => handleSaveEdit(item.id)}
                      className="px-3 py-1.5 bg-teal-600 text-white text-xs font-semibold rounded-xl cursor-pointer"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="px-3 py-1.5 bg-slate-200 dark:bg-slate-600 text-slate-700 dark:text-slate-200 text-xs rounded-xl cursor-pointer"
                    >
                      Cancel
                    </button>
                  </div>
                ) : (
                  <h3
                    onClick={() => {
                      onSelectConversation(item.id);
                      setCurrentView('chat');
                    }}
                    className="font-bold text-sm text-slate-900 dark:text-white hover:text-teal-600 dark:hover:text-teal-400 cursor-pointer transition truncate"
                  >
                    {item.title}
                  </h3>
                )}

                <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-relaxed">
                  {item.preview}
                </p>

                <div className="flex items-center gap-2 mt-2.5">
                  <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded font-mono">
                    <Calendar className="w-2.5 h-2.5" />
                    {item.date}
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <button
                  onClick={() => handleStartEdit(item)}
                  className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                  title="Rename Title"
                >
                  <Edit2 className="w-4 h-4" />
                </button>
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                  title="Delete Thread"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
