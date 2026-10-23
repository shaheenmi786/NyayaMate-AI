import React, { useState } from 'react';
import { ExternalLink, Bookmark, Search, CheckCircle, Shield } from 'lucide-react';
import type { LegalResource } from '../../types';
import { addSavedItem } from '../../services/savedItemsService';

interface LegalResourcesViewProps {
  showToast: (msg: string, type?: 'success' | 'info' | 'error') => void;
}

export const OFFICIAL_LEGAL_RESOURCES: LegalResource[] = [
  {
    title: 'India Code — Repository of Central & State Acts',
    url: 'https://www.indiacode.nic.in/',
    category: 'Acts & Code',
    description: 'Official Government of India repository hosting updated statutory Acts, statutory rules, and gazette amendments.',
    badge: 'Official Repository',
  },
  {
    title: 'Supreme Court of India Official Portal',
    url: 'https://www.sci.gov.in/',
    category: 'Courts',
    description: 'Official apex court portal providing daily orders, reportable judgments, cause lists, and case status tracking.',
    badge: 'Apex Judiciary',
  },
  {
    title: 'eCourts Services Portal',
    url: 'https://ecourts.gov.in/',
    category: 'Courts',
    description: 'Unified judicial services portal covering High Courts, District Courts, and Taluka Courts across Indian states.',
    badge: 'National Portal',
  },
  {
    title: 'National Legal Services Authority (NALSA)',
    url: 'https://nalsa.gov.in/',
    category: 'Legal Aid',
    description: 'Statutory body providing free, competent legal services to eligible citizens and organizing national Lok Adalats.',
    badge: 'Free Legal Aid',
  },
  {
    title: 'National Cyber Crime Reporting Portal',
    url: 'https://cybercrime.gov.in/',
    category: 'Cyber Crime',
    description: 'Ministry of Home Affairs portal for reporting cyber financial fraud (1930 Helpline), cyberstalking, and online offences.',
    badge: 'MHA Helpline 1930',
  },
  {
    title: 'National Consumer Helpline (NCH)',
    url: 'https://consumerhelpline.gov.in/',
    category: 'Consumer Rights',
    description: 'Department of Consumer Affairs portal to lodge consumer grievances against brands and track dispute resolution.',
    badge: 'Toll-Free 1915',
  },
  {
    title: 'e-Daakhil Consumer E-Filing System',
    url: 'https://edaakhil.nic.in/',
    category: 'Consumer Rights',
    description: 'National online portal to file consumer complaints digitally before District, State, and National Consumer Commissions.',
    badge: 'Digital Redressal',
  },
  {
    title: 'RTI Online Central Portal',
    url: 'https://rtionline.gov.in/',
    category: 'Acts & Code',
    description: 'Central portal to file Right to Information applications and first appeals for Ministries, Departments, and PSUs.',
    badge: 'DoPT Portal',
  },
  {
    title: 'Ministry of Corporate Affairs (MCA21)',
    url: 'https://www.mca.gov.in/',
    category: 'Corporate & Labor',
    description: 'Corporate filings, company/LLP master data search, director KYC, and statutory corporate dispute disclosures.',
    badge: 'MCA Portal',
  },
  {
    title: 'Ministry of Labour & Employment — Samadhan',
    url: 'https://labour.gov.in/',
    category: 'Corporate & Labor',
    description: 'Central conciliation and dispute tracking portal for industrial, wage payment, and statutory labor claims.',
    badge: 'Labour Forum',
  },
];

export const LegalResourcesView: React.FC<LegalResourcesViewProps> = ({ showToast }) => {
  const [filterCategory, setFilterCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const categories = [
    'All',
    'Acts & Code',
    'Courts',
    'Legal Aid',
    'Cyber Crime',
    'Consumer Rights',
    'Corporate & Labor',
  ];

  const filtered = OFFICIAL_LEGAL_RESOURCES.filter((item) => {
    const matchesCategory = filterCategory === 'All' || item.category === filterCategory;
    const matchesSearch =
      item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      item.category.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const handleBookmark = async (res: LegalResource) => {
    await addSavedItem({
      type: 'resource',
      title: res.title,
      url: res.url,
      category: res.category,
      metadata: { description: res.description, badge: res.badge },
    });
    showToast(`Bookmarked ${res.title}`, 'success');
  };

  return (
    <div className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 max-w-6xl mx-auto w-full space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          Official Legal Resources & Government Portals
        </h1>
        <p className="text-xs sm:text-sm text-slate-500 mt-1">
          Verified directory of primary statutory repositories, judicial portals, and grievance helplines across India.
        </p>
      </div>

      {/* Trust Notice */}
      <div className="p-3 bg-teal-50 dark:bg-teal-950/40 rounded-2xl border border-teal-200 dark:border-teal-800 text-xs text-teal-800 dark:text-teal-300 flex items-center gap-2">
        <Shield className="w-4 h-4 text-teal-600 dark:text-teal-400 shrink-0" />
        <span>
          <strong>Source Integrity:</strong> All links point exclusively to official Government of India (.gov.in / .nic.in) domains and apex judicial registries.
        </span>
      </div>

      {/* Controls: Search & Category Pills */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3.5" />
          <input
            type="text"
            placeholder="Search official portals by name, authority, or category..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-xs sm:text-sm text-slate-800 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-teal-500 shadow-xs"
          />
        </div>

        <div className="flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
                filterCategory === cat
                  ? 'bg-teal-600 text-white shadow-xs'
                  : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:border-slate-300'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filtered.length === 0 ? (
          <div className="md:col-span-2 py-16 text-center text-xs sm:text-sm text-slate-400 bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700">
            No official portals found matching your search.
          </div>
        ) : (
          filtered.map((item, idx) => (
            <div
              key={idx}
              className="bg-white dark:bg-slate-800 p-5 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm flex flex-col justify-between hover:shadow-md hover:border-teal-500/40 transition group"
            >
              <div>
                <div className="flex justify-between items-start mb-2.5">
                  <div className="flex items-center gap-2">
                    <span className="text-[10px] font-bold uppercase tracking-wider text-teal-700 dark:text-teal-400 bg-teal-50 dark:bg-teal-950 px-2 py-0.5 rounded">
                      {item.category}
                    </span>
                    {item.badge && (
                      <span className="text-[10px] text-slate-500 dark:text-slate-400 font-mono bg-slate-100 dark:bg-slate-700/60 px-2 py-0.5 rounded">
                        {item.badge}
                      </span>
                    )}
                  </div>

                  <button
                    onClick={() => handleBookmark(item)}
                    className="p-1.5 text-slate-400 hover:text-teal-600 dark:hover:text-teal-400 rounded-lg hover:bg-slate-100 dark:hover:bg-slate-700 transition cursor-pointer"
                    title="Bookmark Resource"
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                </div>

                <h3 className="font-bold text-sm text-slate-900 dark:text-white group-hover:text-teal-600 transition">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-700/60 flex justify-between items-center">
                <span className="text-[11px] font-mono text-slate-400 truncate max-w-[220px]">
                  {item.url}
                </span>
                <a
                  href={item.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-3.5 py-1.5 bg-slate-900 dark:bg-teal-600 hover:bg-slate-800 dark:hover:bg-teal-700 text-white rounded-xl text-xs font-semibold transition flex items-center gap-1.5 shrink-0 shadow-xs"
                >
                  <span>Visit Portal</span>
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
