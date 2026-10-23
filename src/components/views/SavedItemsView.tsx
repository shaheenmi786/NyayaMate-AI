import React, { useState, useEffect } from 'react';
import { Bookmark, Trash2, ExternalLink, Copy, FileText, MessageSquare, BookOpen } from 'lucide-react';
import type { SavedItem } from '../../types';
import { fetchSavedItems, deleteSavedItem } from '../../services/savedItemsService';

interface SavedItemsViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const SavedItemsView: React.FC<SavedItemsViewProps> = ({ showToast }) => {
  const [items, setItems] = useState<SavedItem[]>([]);
  const [activeTab, setActiveTab] = useState<'all' | 'resource' | 'conversation' | 'draft'>('all');

  useEffect(() => {
    let isMounted = true;
    const loadItems = async () => {
      const data = await fetchSavedItems();
      if (isMounted) setItems(data);
    };
    loadItems();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleDelete = async (id: string) => {
    await deleteSavedItem(id);
    setItems((prev) => prev.filter((item) => item.id !== id));
    showToast('Saved item removed', 'info');
  };

  const handleCopy = (text: string) => {
    navigator.clipboard?.writeText(text);
    showToast('Content copied to clipboard', 'success');
  };

  const filtered = activeTab === 'all' ? items : items.filter((item) => item.type === activeTab);

  const getItemIcon = (type: string) => {
    switch (type) {
      case 'resource':
        return <BookOpen className="w-4 h-4 text-teal-600" />;
      case 'draft':
        return <FileText className="w-4 h-4 text-amber-600" />;
      default:
        return <MessageSquare className="w-4 h-4 text-indigo-600" />;
    }
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-5xl mx-auto w-full space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">Saved Items</h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Your bookmarked statutory portals, AI answers, and generated legal notice drafts.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-700 gap-6 text-xs sm:text-sm font-semibold">
        <button
          onClick={() => setActiveTab('all')}
          className={`pb-3 transition border-b-2 cursor-pointer ${
            activeTab === 'all'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          All Items ({items.length})
        </button>
        <button
          onClick={() => setActiveTab('resource')}
          className={`pb-3 transition border-b-2 cursor-pointer ${
            activeTab === 'resource'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Official Portals ({items.filter((i) => i.type === 'resource').length})
        </button>
        <button
          onClick={() => setActiveTab('draft')}
          className={`pb-3 transition border-b-2 cursor-pointer ${
            activeTab === 'draft'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Draft Notices ({items.filter((i) => i.type === 'draft').length})
        </button>
        <button
          onClick={() => setActiveTab('conversation')}
          className={`pb-3 transition border-b-2 cursor-pointer ${
            activeTab === 'conversation'
              ? 'border-teal-600 text-teal-600 dark:text-teal-400'
              : 'border-transparent text-slate-500 hover:text-slate-800 dark:hover:text-slate-200'
          }`}
        >
          Saved Answers ({items.filter((i) => i.type === 'conversation').length})
        </button>
      </div>

      {/* Items List */}
      <div className="space-y-3">
        {filtered.length === 0 ? (
          <div className="text-center py-16 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 text-slate-400 text-xs sm:text-sm space-y-2">
            <Bookmark className="w-8 h-8 mx-auto text-slate-300 dark:text-slate-600" />
            <p>No saved items found in this category.</p>
          </div>
        ) : (
          filtered.map((item) => (
            <div
              key={item.id}
              className="p-4 sm:p-5 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm flex items-start justify-between gap-4 hover:border-slate-300 dark:hover:border-slate-600 transition"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1.5">
                  <div className="p-1 rounded-md bg-slate-100 dark:bg-slate-700/60">
                    {getItemIcon(item.type)}
                  </div>
                  <span className="text-[10px] uppercase font-bold text-teal-600 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                    {item.type}
                  </span>
                  {item.category && (
                    <span className="text-[10px] text-slate-400 font-medium">
                      {item.category}
                    </span>
                  )}
                  {item.date && (
                    <span className="text-[10px] text-slate-400 ml-auto hidden sm:inline">
                      {item.date}
                    </span>
                  )}
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white truncate">
                  {item.title}
                </h3>

                {item.url && (
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-xs text-teal-600 dark:text-teal-400 hover:underline mt-1 font-mono truncate max-w-full"
                  >
                    <span>{item.url}</span>
                    <ExternalLink className="w-3 h-3 shrink-0" />
                  </a>
                )}

                {item.content && (
                  <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 line-clamp-3 leading-relaxed bg-slate-50 dark:bg-slate-900/50 p-2.5 rounded-xl border border-slate-100 dark:border-slate-700/60 font-mono text-[11px]">
                    {item.content}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                {item.content && (
                  <button
                    onClick={() => handleCopy(item.content!)}
                    className="p-2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    title="Copy Content"
                  >
                    <Copy className="w-4 h-4" />
                  </button>
                )}
                <button
                  onClick={() => handleDelete(item.id)}
                  className="p-2 text-slate-400 hover:text-rose-600 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                  title="Remove from Saved Items"
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
