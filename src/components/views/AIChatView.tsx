import React, { useState, useEffect, useRef } from 'react';
import {
  Plus, Send, Paperclip, Copy, Bookmark, ThumbsUp, ThumbsDown,
  RefreshCw, BookOpen, ExternalLink, Sparkles, AlertTriangle
} from 'lucide-react';
import type { Message, Conversation, AppSettings } from '../../types';
import { fetchMessages, addMessage, createConversation } from '../../services/conversationService';
import { addSavedItem } from '../../services/savedItemsService';
import { askLegalAi } from '../../services/legalAiService';

interface AIChatViewProps {
  activeConversationId: string;
  setActiveConversationId: (id: string) => void;
  conversations: Conversation[];
  setConversations: React.Dispatch<React.SetStateAction<Conversation[]>>;
  initialQuery?: string;
  onClearInitialQuery?: () => void;
  onNavigateToDocuments: () => void;
  settings: AppSettings;
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const AIChatView: React.FC<AIChatViewProps> = ({
  activeConversationId,
  setActiveConversationId,
  conversations,
  setConversations,
  initialQuery,
  onClearInitialQuery,
  onNavigateToDocuments,
  settings,
  showToast,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  // Load messages when activeConversationId changes
  useEffect(() => {
    let isMounted = true;
    const loadConversationMessages = async () => {
      if (!activeConversationId || activeConversationId === 'new') {
        const welcome: Message = {
          id: 'welcome_' + Date.now(),
          sender: 'assistant',
          text: 'Namaste! I am NyayaMate AI. Ask me any legal information question regarding Indian laws, tenancy disputes, consumer rights, or cyber fraud reporting.',
          time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          citations: [
            {
              title: 'India Code — Statutory Repository of India',
              code: 'Unified Central & State Acts',
              url: 'https://www.indiacode.nic.in/',
              verified: true,
            },
          ],
        };
        if (isMounted) setMessages([welcome]);
        return;
      }

      const msgs = await fetchMessages(activeConversationId);
      if (isMounted) {
        setMessages(msgs);
      }
    };

    loadConversationMessages();
    return () => {
      isMounted = false;
    };
  }, [activeConversationId]);

  // Handle initial query from dashboard if passed
  useEffect(() => {
    if (initialQuery && initialQuery.trim()) {
      setInput(initialQuery);
      if (onClearInitialQuery) onClearInitialQuery();
    }
  }, [initialQuery, onClearInitialQuery]);

  useEffect(() => {
    scrollToBottom();
  }, [messages, isLoading]);

  const handleSend = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!input.trim() || isLoading) return;

    const userText = input.trim();
    setInput('');
    setIsLoading(true);

    let convId = activeConversationId;

    // If new conversation, create it in Supabase/local
    if (!convId || convId === 'new') {
      const title = userText.length > 35 ? userText.substring(0, 35) + '...' : userText;
      const created = await createConversation(title, userText);
      convId = created.id;
      setActiveConversationId(convId);
      setConversations((prev) => [created, ...prev.filter((c) => c.id !== created.id)]);
    }

    // 1. Add User Message
    const userMsg = await addMessage(convId, {
      sender: 'user',
      text: userText,
    });
    setMessages((prev) => [...prev, userMsg]);

    try {
      // 2. Fetch AI Legal Response grounded in Indian statutory law
      const aiResponse = await askLegalAi(userText, settings.language);

      // 3. Add Assistant Message
      const botMsg = await addMessage(convId, {
        sender: 'assistant',
        text: aiResponse.answer,
        citations: aiResponse.citations,
      });

      setMessages((prev) => [...prev, botMsg]);
    } catch (err) {
      console.error('Error generating AI response:', err);
      showToast('Could not complete legal query', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  const handleExampleClick = (promptText: string) => {
    setInput(promptText);
  };

  const handleSaveMessage = async (msg: Message) => {
    await addSavedItem({
      type: 'conversation',
      title: msg.text.substring(0, 45) + '...',
      category: 'Legal Answer',
      content: msg.text,
      metadata: { citations: msg.citations },
    });
    showToast('Saved response to Saved Items', 'success');
  };

  const handleNewChat = () => {
    setActiveConversationId('new');
    setMessages([
      {
        id: 'new_' + Date.now(),
        sender: 'assistant',
        text: 'New consultation started. How may I assist you with Indian legal information?',
        time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        citations: [],
      },
    ]);
    showToast('New legal consultation initialized');
  };

  return (
    <div className="flex-1 flex flex-col h-full bg-slate-50 dark:bg-slate-900 overflow-hidden">
      {/* Top Chat Info Header */}
      <div className="bg-white dark:bg-slate-800 px-4 sm:px-6 py-3 border-b border-slate-200 dark:border-slate-700 flex justify-between items-center text-xs sm:text-sm">
        <div className="flex items-center gap-2">
          <div className="w-2.5 h-2.5 rounded-full bg-teal-500 animate-pulse"></div>
          <span className="font-bold text-slate-800 dark:text-slate-200">
            NyayaMate Legal Assistant Active
          </span>
          <span className="hidden md:inline text-slate-400">
            | Statutory Grounding in BNS & Central Acts
          </span>
        </div>

        <button
          onClick={handleNewChat}
          className="px-3 py-1.5 bg-slate-100 dark:bg-slate-700 hover:bg-slate-200 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition flex items-center gap-1.5 text-xs cursor-pointer"
        >
          <Plus className="w-4 h-4 text-teal-600" />
          <span>New Chat</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6">
        {messages.map((m) => (
          <div
            key={m.id}
            className={`flex items-start gap-3 max-w-4xl mx-auto ${
              m.sender === 'user' ? 'flex-row-reverse' : ''
            }`}
          >
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs shrink-0 shadow-sm ${
                m.sender === 'user'
                  ? 'bg-slate-900 text-white dark:bg-slate-100 dark:text-slate-900'
                  : 'bg-teal-600 text-white'
              }`}
            >
              {m.sender === 'user' ? 'You' : 'AI'}
            </div>

            <div className="space-y-2 max-w-[88%] sm:max-w-[78%]">
              <div
                className={`p-4 rounded-2xl text-xs sm:text-sm leading-relaxed shadow-sm ${
                  m.sender === 'user'
                    ? 'bg-slate-800 text-white dark:bg-teal-700 dark:text-white rounded-tr-none'
                    : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-100 border border-slate-200 dark:border-slate-700 rounded-tl-none'
                }`}
              >
                <div className="whitespace-pre-line">{m.text}</div>

                {/* Citations block */}
                {settings.citationsVisible && m.citations && m.citations.length > 0 && (
                  <div className="mt-4 pt-3 border-t border-slate-200 dark:border-slate-700/60 space-y-2">
                    <p className="text-[11px] font-bold text-teal-700 dark:text-teal-400 uppercase tracking-wider flex items-center gap-1.5">
                      <BookOpen className="w-3.5 h-3.5" />
                      <span>Relevant Indian Legal Citations & Sources:</span>
                    </p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      {m.citations.map((cit, idx) => (
                        <div
                          key={idx}
                          className="p-2.5 bg-slate-50 dark:bg-slate-900/60 rounded-xl border border-slate-200/80 dark:border-slate-700 text-[11px] flex flex-col justify-between"
                        >
                          <div>
                            <p className="font-semibold text-slate-800 dark:text-slate-200">
                              {cit.title}
                            </p>
                            {cit.code && (
                              <p className="text-slate-500 dark:text-slate-400 mt-0.5 font-mono text-[10px]">
                                {cit.code}
                              </p>
                            )}
                          </div>
                          {cit.url && (
                            <a
                              href={cit.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="mt-2 text-teal-600 dark:text-teal-400 hover:underline flex items-center gap-1 text-[10px] font-semibold"
                            >
                              <span>Official Primary Source</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Message Footer / Controls */}
              <div
                className={`flex items-center gap-3 text-[11px] text-slate-400 ${
                  m.sender === 'user' ? 'justify-end' : 'justify-start'
                }`}
              >
                <span>{m.time}</span>
                {m.sender === 'assistant' && (
                  <>
                    <button
                      onClick={() => {
                        navigator.clipboard?.writeText(m.text);
                        showToast('Copied answer to clipboard', 'success');
                      }}
                      className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Copy className="w-3 h-3" />
                      <span>Copy</span>
                    </button>
                    <button
                      onClick={() => handleSaveMessage(m)}
                      className="hover:text-slate-600 dark:hover:text-slate-200 flex items-center gap-1 cursor-pointer"
                    >
                      <Bookmark className="w-3 h-3" />
                      <span>Save</span>
                    </button>
                    <button
                      onClick={() => showToast('Helpful feedback recorded', 'success')}
                      className="hover:text-teal-600 cursor-pointer"
                      title="Helpful"
                    >
                      <ThumbsUp className="w-3 h-3" />
                    </button>
                    <button
                      onClick={() => showToast('Feedback recorded for improvements')}
                      className="hover:text-amber-600 cursor-pointer"
                      title="Needs improvement"
                    >
                      <ThumbsDown className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Loading Indicator */}
        {isLoading && (
          <div className="flex items-center gap-3 max-w-4xl mx-auto">
            <div className="w-8 h-8 rounded-full bg-teal-600 text-white font-bold text-xs flex items-center justify-center">
              AI
            </div>
            <div className="p-4 bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 text-xs text-slate-500 flex items-center gap-2.5 shadow-sm">
              <RefreshCw className="w-4 h-4 animate-spin text-teal-600" />
              <span>Analyzing Indian statutory acts, provisions & official portals...</span>
            </div>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Example Prompt Chips */}
      {messages.length <= 2 && (
        <div className="px-4 py-2 max-w-4xl mx-auto w-full">
          <p className="text-[11px] text-slate-500 font-semibold mb-2">
            Example Indian Legal Inquiries:
          </p>
          <div className="flex flex-wrap gap-2">
            <PromptChip
              label="Landlord refusing deposit return"
              onClick={() =>
                handleExampleClick(
                  'My landlord in Bengaluru is withholding my security deposit of ₹80,000 without valid reason. What legal notice can I send under Tenancy law?'
                )
              }
            />
            <PromptChip
              label="Online UPI fraud reporting"
              onClick={() =>
                handleExampleClick(
                  'I was scammed via a UPI transaction yesterday. What immediate steps should I take under the 1930 helpline and RBI zero-liability rules?'
                )
              }
            />
            <PromptChip
              label="Defective appliance warranty complaint"
              onClick={() =>
                handleExampleClick(
                  'I purchased a defective television and the company refuses replacement under warranty. How do I file an e-Daakhil consumer complaint?'
                )
              }
            />
            <PromptChip
              label="Unpaid salary demand notice"
              onClick={() =>
                handleExampleClick(
                  'My employer has withheld my salary for 2 months. How can I draft a formal demand notice under Indian labor rules?'
                )
              }
            />
          </div>
        </div>
      )}

      {/* Input Composer */}
      <div className="p-4 bg-white dark:bg-slate-800 border-t border-slate-200 dark:border-slate-700">
        <form onSubmit={handleSend} className="max-w-4xl mx-auto space-y-2">
          <div className="relative flex items-center">
            <textarea
              rows={2}
              placeholder="Ask a legal question in plain English or Hindi (e.g. Can my landlord deduct 1 month rent for painting?)"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter' && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="w-full pl-4 pr-24 py-3 bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 resize-none"
            />
            <div className="absolute right-3 flex items-center gap-2">
              <button
                type="button"
                onClick={onNavigateToDocuments}
                className="p-1.5 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                title="Attach Document to Document Assistant"
              >
                <Paperclip className="w-4 h-4" />
              </button>
              <button
                type="submit"
                disabled={!input.trim() || isLoading}
                className="p-2 bg-teal-600 hover:bg-teal-700 text-white rounded-xl transition disabled:opacity-50 cursor-pointer"
              >
                <Send className="w-4 h-4" />
              </button>
            </div>
          </div>
          <p className="text-[10px] text-center text-slate-400 flex items-center justify-center gap-1">
            <AlertTriangle className="w-3 h-3 text-amber-500 shrink-0" />
            <span>
              NyayaMate AI outputs are general educational information, not advocate representation. Review statutory terms carefully.
            </span>
          </p>
        </form>
      </div>
    </div>
  );
};

const PromptChip: React.FC<{ label: string; onClick: () => void }> = ({ label, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-3 py-1.5 bg-white dark:bg-slate-800 hover:bg-teal-50 dark:hover:bg-teal-950/60 border border-slate-200 dark:border-slate-700 rounded-xl text-xs text-slate-700 dark:text-slate-300 transition text-left cursor-pointer"
    >
      {label}
    </button>
  );
};
