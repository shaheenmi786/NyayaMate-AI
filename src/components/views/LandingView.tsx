import React, { useState } from 'react';
import {
  Sparkles, MessageSquare, BookOpen, FileText, FileCode, Shield, Globe,
  CheckCircle2, ChevronDown, ArrowRight, ExternalLink
} from 'lucide-react';
import type { ViewType } from '../../types';

interface LandingViewProps {
  setCurrentView: (view: ViewType) => void;
  showToast: (msg: string) => void;
}

export const LandingView: React.FC<LandingViewProps> = ({ setCurrentView, showToast }) => {
  return (
    <div className="flex-1 overflow-y-auto">
      {/* Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 bg-gradient-to-b from-slate-100 via-slate-50 to-white dark:from-slate-900 dark:via-slate-900 dark:to-slate-950 px-4 sm:px-6 lg:px-8">
        <div className="max-w-6xl mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-teal-100 dark:bg-teal-950/80 border border-teal-300 dark:border-teal-800 text-teal-800 dark:text-teal-300 text-xs font-semibold mb-6 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400" />
            <span>Built for Indian Citizens, Legal Learners & Small Businesses</span>
          </div>

          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight">
            Indian Legal Clarity <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-teal-600 to-cyan-600 dark:from-teal-400 dark:to-cyan-400">
              Starts Right Here.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            Understand Indian statutory laws in plain language, explore verified official court portals, analyze rental agreements, and prepare legal notices with confidence.
          </p>

          <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center items-center">
            <button
              onClick={() => setCurrentView('chat')}
              className="w-full sm:w-auto px-7 py-3.5 bg-teal-600 hover:bg-teal-700 text-white font-semibold rounded-2xl shadow-lg hover:shadow-teal-500/25 transition-all duration-200 flex items-center justify-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <MessageSquare className="w-5 h-5" />
              <span>Ask a Legal Question</span>
            </button>
            <button
              onClick={() => setCurrentView('resources')}
              className="w-full sm:w-auto px-7 py-3.5 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-slate-800 dark:text-slate-200 font-semibold rounded-2xl border border-slate-300 dark:border-slate-700 transition-all text-sm sm:text-base flex items-center justify-center gap-2 shadow-sm cursor-pointer"
            >
              <BookOpen className="w-5 h-5 text-teal-600" />
              <span>Explore Official Portals</span>
            </button>
          </div>

          {/* Interactive Preview Box */}
          <div className="mt-12 max-w-4xl mx-auto bg-white dark:bg-slate-800/95 rounded-3xl shadow-2xl border border-slate-200 dark:border-slate-700 overflow-hidden text-left">
            <div className="bg-slate-100 dark:bg-slate-900/80 px-4 py-3 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="flex gap-1.5">
                  <div className="w-3 h-3 rounded-full bg-rose-400"></div>
                  <div className="w-3 h-3 rounded-full bg-amber-400"></div>
                  <div className="w-3 h-3 rounded-full bg-emerald-400"></div>
                </div>
                <span className="text-xs font-mono text-slate-500 dark:text-slate-400 ml-2">
                  NyayaMate AI — Interactive Preview
                </span>
              </div>
              <span className="text-[10px] text-teal-600 dark:text-teal-400 font-mono bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                Grounded in BNS 2023 & Indian Acts
              </span>
            </div>

            <div className="p-6 space-y-4">
              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-slate-900 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  You
                </div>
                <div className="bg-slate-100 dark:bg-slate-700/60 p-3.5 rounded-2xl text-xs sm:text-sm max-w-2xl text-slate-800 dark:text-slate-200">
                  What are my statutory remedies under Indian consumer law if a brand refuses to repair a defective television during warranty?
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-8 h-8 rounded-full bg-teal-600 text-white flex items-center justify-center font-bold text-xs shrink-0">
                  AI
                </div>
                <div className="bg-teal-50/70 dark:bg-teal-950/40 border border-teal-200/80 dark:border-teal-800/60 p-4 rounded-2xl text-xs sm:text-sm max-w-2xl text-slate-800 dark:text-slate-200 space-y-2">
                  <p className="font-semibold text-teal-900 dark:text-teal-300">
                    Consumer Protection Act, 2019 Overview:
                  </p>
                  <p className="text-xs leading-relaxed text-slate-700 dark:text-slate-300">
                    Under Section 2(7) and Section 35 of the Consumer Protection Act 2019, you have the statutory right to issue a formal pre-litigation demand notice giving 7 days to rectify, and lodge a formal dispute via the <strong>e-Daakhil portal</strong> or National Consumer Helpline (1915).
                  </p>
                  <div className="pt-2 flex items-center gap-2 text-xs text-teal-700 dark:text-teal-400 font-medium border-t border-teal-200/60 dark:border-teal-800/60">
                    <CheckCircle2 className="w-4 h-4 text-teal-600 shrink-0" />
                    <span>Includes verified citation to National Consumer Disputes Redressal Commission norms.</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white">
            Designed for Clarity, Accessibility & Accuracy
          </h2>
          <p className="text-slate-600 dark:text-slate-400 mt-2 text-sm sm:text-base">
            Comprehensive modules tailored for Indian citizens, tenants, employees, and MSME business owners.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <FeatureCard
            icon={<MessageSquare className="w-6 h-6 text-teal-600" />}
            title="AI Legal Assistant"
            description="Ask legal questions in plain language and receive structured explanations with reference to relevant Indian Acts."
            onClick={() => setCurrentView('chat')}
          />
          <FeatureCard
            icon={<FileText className="w-6 h-6 text-teal-600" />}
            title="Document Assistant"
            description="Upload rental agreements, employment contracts, or notices to receive plain-language summaries and risk flag alerts."
            onClick={() => setCurrentView('documents')}
          />
          <FeatureCard
            icon={<FileCode className="w-6 h-6 text-teal-600" />}
            title="Legal Draft Generator"
            description="Create formal draft notices for security deposit refund, salary claims, or consumer complaint letters quickly."
            onClick={() => setCurrentView('drafts')}
          />
          <FeatureCard
            icon={<BookOpen className="w-6 h-6 text-teal-600" />}
            title="Official Portals Catalog"
            description="Direct links to official portals including India Code, Supreme Court of India, eCourts, NALSA, and Cybercrime."
            onClick={() => setCurrentView('resources')}
          />
          <FeatureCard
            icon={<Shield className="w-6 h-6 text-teal-600" />}
            title="Privacy & Data Control"
            description="Designed with a privacy-first approach. Connect your own Supabase project or use local session storage."
            onClick={() => setCurrentView('settings')}
          />
          <FeatureCard
            icon={<Globe className="w-6 h-6 text-teal-600" />}
            title="Multilingual Guidance"
            description="Access legal guidance and resources in English, Hindi (हिंदी), Kannada (ಕನ್ನಡ), Tamil (தமிழ்), and Marathi (मराठी)."
            onClick={() => setCurrentView('settings')}
          />
        </div>
      </section>

      {/* How it Works */}
      <section className="py-16 bg-slate-100 dark:bg-slate-800/50 px-4 sm:px-6 lg:px-8">
        <div className="max-w-5xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-slate-900 dark:text-white mb-10">How NyayaMate AI Works</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <StepCard
              number="1"
              title="Ask Your Question"
              description="Enter your query about tenancy, consumer disputes, cyber claims, or labor issues in plain conversational language."
            />
            <StepCard
              number="2"
              title="Explore Grounded Guidance"
              description="Get simplified legal explanations referenced with relevant Indian statutory frameworks, sections, and Acts."
            />
            <StepCard
              number="3"
              title="Review & Take Action"
              description="Access official links, generate structured notices, or save steps to share with your qualified legal advocate."
            />
          </div>
        </div>
      </section>

      {/* Frequently Asked Questions */}
      <section className="py-16 px-4 sm:px-6 lg:px-8 max-w-4xl mx-auto">
        <h2 className="text-3xl font-bold text-slate-900 dark:text-white text-center mb-8">
          Frequently Asked Questions
        </h2>
        <div className="space-y-4">
          <FaqItem
            question="Is NyayaMate AI a replacement for a practicing advocate?"
            answer="No. NyayaMate AI is an educational legal information companion. It helps citizens understand rights, statutory timelines, and official portals in plain language. It does not provide formal legal representation, court filing, or case outcome guarantees. You should consult a qualified advocate for fact-specific legal counsel."
          />
          <FaqItem
            question="Are statutory citations accurate and verified?"
            answer="Yes. Our legal knowledge engine strictly cites primary official Indian sources, including India Code (indiacode.nic.in), Supreme Court of India (sci.gov.in), eCourts (ecourts.gov.in), and ministerial dispute redressal portals. We never invent fictitious section numbers or judicial precedents."
          />
          <FaqItem
            question="How does Supabase cloud integration work?"
            answer="NyayaMate AI connects seamlessly to your Supabase PostgreSQL backend. It stores conversations, messages, saved items, drafts, and uploaded document summaries under Row Level Security (RLS). You can also run the app completely offline in Local Mode without configuring Supabase."
          />
          <FaqItem
            question="Can I draft notices for landlord deposits and consumer disputes?"
            answer="Yes! Our Draft Generator provides editable notice templates for Security Deposit Refund, Consumer Complaint Notice, Unpaid Salary Request, B2B Invoice Demands, and Cyber Fraud Bank Disputes."
          />
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-slate-900 text-slate-400 py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-800">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-6">
          <div className="text-center md:text-left">
            <span className="font-bold text-white text-lg">NyayaMate AI</span>
            <p className="text-xs text-slate-500 mt-1 max-w-md">
              Democratizing Indian legal information with accessibility, dignity, and accuracy.
            </p>
          </div>

          <div className="flex flex-wrap justify-center gap-6 text-xs">
            <button onClick={() => setCurrentView('dashboard')} className="hover:text-white transition">Dashboard</button>
            <button onClick={() => setCurrentView('chat')} className="hover:text-white transition">Legal Chat</button>
            <button onClick={() => setCurrentView('drafts')} className="hover:text-white transition">Draft Generator</button>
            <button onClick={() => setCurrentView('resources')} className="hover:text-white transition">Official Portals</button>
            <button onClick={() => setCurrentView('settings')} className="hover:text-white transition">Settings</button>
          </div>
        </div>

        <div className="max-w-7xl mx-auto mt-8 pt-8 border-t border-slate-800 text-[11px] text-center text-slate-500">
          © 2026 NyayaMate AI. Designed for educational legal assistance in India. Not a law firm.
        </div>
      </footer>
    </div>
  );
};

const FeatureCard: React.FC<{
  icon: React.ReactNode;
  title: string;
  description: string;
  onClick: () => void;
}> = ({ icon, title, description, onClick }) => {
  return (
    <div
      onClick={onClick}
      className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md hover:border-teal-500/50 transition cursor-pointer flex flex-col justify-between group"
    >
      <div>
        <div className="p-3 bg-teal-50 dark:bg-teal-950/60 rounded-2xl w-fit mb-4 group-hover:scale-110 transition-transform">
          {icon}
        </div>
        <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">{title}</h3>
        <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
      </div>
      <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex items-center gap-1 text-xs font-semibold text-teal-600 dark:text-teal-400">
        <span>Explore tool</span>
        <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
      </div>
    </div>
  );
};

const StepCard: React.FC<{ number: string; title: string; description: string }> = ({
  number,
  title,
  description,
}) => {
  return (
    <div className="p-6 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm text-center">
      <div className="w-12 h-12 rounded-full bg-teal-600 text-white font-extrabold text-base flex items-center justify-center mx-auto mb-4 shadow-md">
        {number}
      </div>
      <h3 className="font-bold text-base text-slate-900 dark:text-white mb-2">{title}</h3>
      <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 leading-relaxed">{description}</p>
    </div>
  );
};

const FaqItem: React.FC<{ question: string; answer: string }> = ({ question, answer }) => {
  const [open, setOpen] = useState(false);
  return (
    <div className="bg-white dark:bg-slate-800 rounded-2xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
      <button
        onClick={() => setOpen(!open)}
        className="w-full p-4 sm:p-5 text-left font-semibold text-sm sm:text-base flex justify-between items-center text-slate-800 dark:text-slate-200"
      >
        <span>{question}</span>
        <ChevronDown className={`w-5 h-5 text-slate-400 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>
      {open && (
        <div className="px-5 pb-5 text-xs sm:text-sm text-slate-600 dark:text-slate-300 border-t border-slate-100 dark:border-slate-700/50 pt-3 leading-relaxed">
          {answer}
        </div>
      )}
    </div>
  );
};
