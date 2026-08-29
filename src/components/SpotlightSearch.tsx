/**
 * @file SpotlightSearch.tsx
 * @description Universal iOS Spotlight search modal for Harmony OS Super App.
 */

import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Search, X, Sparkles, Notebook, FileText, PenTool, Disc, ArrowRight } from 'lucide-react';
import { HARMONY_APPS } from '../config/apps';
import { HarmonyNote, HarmonyDoc, HarmonyWritingDraft } from '../types';

interface SpotlightSearchProps {
  isOpen: boolean;
  onClose: () => void;
  onOpenApp: (appId: string) => void;
  notes: HarmonyNote[];
  docs: HarmonyDoc[];
  drafts: HarmonyWritingDraft[];
}

export const SpotlightSearch: React.FC<SpotlightSearchProps> = ({
  isOpen,
  onClose,
  onOpenApp,
  notes,
  docs,
  drafts
}) => {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!isOpen) return null;

  const filteredApps = HARMONY_APPS.filter(app => 
    app.name.toLowerCase().includes(query.toLowerCase()) ||
    app.description.toLowerCase().includes(query.toLowerCase())
  );

  const filteredNotes = notes.filter(n =>
    n.title.toLowerCase().includes(query.toLowerCase()) ||
    n.content.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDocs = docs.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase()) ||
    d.content.toLowerCase().includes(query.toLowerCase())
  );

  const filteredDrafts = drafts.filter(dr =>
    dr.title.toLowerCase().includes(query.toLowerCase()) ||
    dr.content.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-16 px-4 bg-black/70 backdrop-blur-2xl animate-fade-in">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="w-full max-w-xl bg-[#161b22] border border-[#30363d] rounded-2xl overflow-hidden shadow-2xl text-[#c9d1d9] flex flex-col max-h-[80vh]"
      >
        {/* Search Input Bar */}
        <div className="p-4 border-b border-[#30363d] flex items-center gap-3 bg-[#0d1117]">
          <Search className="w-5 h-5 text-indigo-400 shrink-0" />
          <input
            type="text"
            autoFocus
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search mini apps, notes, docs, drafts or ask AI..."
            className="w-full bg-transparent text-white placeholder-[#8b949e] focus:outline-none text-base"
          />
          {query && (
            <button
              onClick={() => setQuery('')}
              className="p-1 rounded-full bg-[#21262d] hover:bg-[#30363d] text-[#8b949e]"
            >
              <X className="w-4 h-4" />
            </button>
          )}
          <button
            onClick={onClose}
            className="text-xs text-indigo-400 font-semibold px-2 py-1 hover:text-indigo-300"
          >
            Cancel
          </button>
        </div>

        {/* Search Results List */}
        <div className="p-4 overflow-y-auto space-y-6 flex-1 scrollbar-none">
          {/* Section 1: Integrated Harmony Mini Apps */}
          <div>
            <h4 className="text-[11px] font-bold uppercase tracking-wider text-white/40 mb-2">
              Harmony Mini Apps
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {filteredApps.map((app) => (
                <div
                  key={app.id}
                  onClick={() => {
                    onOpenApp(app.id);
                    onClose();
                  }}
                  className="p-3 rounded-2xl bg-white/5 hover:bg-white/10 cursor-pointer flex items-center gap-3 border border-white/5 transition-colors group"
                >
                  <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${app.colorGradient} flex items-center justify-center text-white shrink-0`}>
                    <Sparkles className="w-5 h-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <h5 className="text-xs font-semibold text-white truncate">{app.name}</h5>
                    <p className="text-[10px] text-white/50 truncate">{app.tagline}</p>
                  </div>
                  <ArrowRight className="w-4 h-4 text-white/30 group-hover:text-white transition-colors" />
                </div>
              ))}
            </div>
          </div>

          {/* Section 2: Synced Harmony Notes */}
          {filteredNotes.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-amber-400/70 mb-2">
                Harmony Notes ({filteredNotes.length})
              </h4>
              <div className="space-y-1.5">
                {filteredNotes.map((note) => (
                  <div
                    key={note.id}
                    onClick={() => {
                      onOpenApp('harmony-notes');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/20 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <Notebook className="w-4 h-4 text-amber-400 shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-white">{note.title}</span>
                        <p className="text-[11px] text-white/50 line-clamp-1">{note.content}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-amber-300 font-mono">{note.category}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Section 3: Synced Harmony Docs */}
          {filteredDocs.length > 0 && (
            <div>
              <h4 className="text-[11px] font-bold uppercase tracking-wider text-blue-400/70 mb-2">
                Harmony Docs ({filteredDocs.length})
              </h4>
              <div className="space-y-1.5">
                {filteredDocs.map((docItem) => (
                  <div
                    key={docItem.id}
                    onClick={() => {
                      onOpenApp('harmony-docs');
                      onClose();
                    }}
                    className="p-3 rounded-xl bg-blue-500/10 hover:bg-blue-500/20 border border-blue-500/20 cursor-pointer flex items-center justify-between"
                  >
                    <div className="flex items-center gap-2.5">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="text-xs font-medium text-white">{docItem.title}</span>
                        <p className="text-[11px] text-white/50 line-clamp-1">{docItem.content}</p>
                      </div>
                    </div>
                    <span className="text-[10px] text-blue-300 font-mono">{docItem.wordCount} words</span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </div>
  );
};
