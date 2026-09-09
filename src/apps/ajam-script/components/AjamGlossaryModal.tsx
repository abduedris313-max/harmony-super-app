/**
 * @file AjamGlossaryModal.tsx
 * @description Real-time Popup Glossary component displaying definitions for selected Ajam script characters, words, and Sufi terminology.
 */

import React, { useState } from 'react';
import { 
  BookOpen, 
  X, 
  Search, 
  Volume2, 
  Plus, 
  Sparkles, 
  ChevronRight, 
  Tag, 
  Info,
  Check
} from 'lucide-react';
import { LexiconEntry, searchLexicon, AJAM_LEXICON } from '../data/ajamLexicon';

interface AjamGlossaryModalProps {
  isOpen: boolean;
  selectedEntry: LexiconEntry | null;
  onClose: () => void;
  onSelectEntry: (entry: LexiconEntry) => void;
  onInsertTerm?: (text: string) => void;
}

export const AjamGlossaryModal: React.FC<AjamGlossaryModalProps> = ({
  isOpen,
  selectedEntry,
  onClose,
  onSelectEntry,
  onInsertTerm
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedText, setCopiedText] = useState(false);

  if (!isOpen) return null;

  const searchResults = searchLexicon(searchQuery);
  const activeEntry = selectedEntry || searchResults[0] || AJAM_LEXICON[0];

  const handleSpeak = (text: string) => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    }
  };

  const handleInsert = () => {
    if (onInsertTerm && activeEntry) {
      onInsertTerm(activeEntry.termAjam);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200">
      <div className="relative w-full max-w-2xl bg-slate-900 border border-amber-500/30 rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh]">
        
        {/* Header */}
        <div className="px-6 py-4 bg-gradient-to-r from-amber-950/50 via-slate-900 to-slate-900 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-extrabold text-slate-100 flex items-center gap-2">
                Ajam Script Lexicon & Glossary
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                  Local JSON Engine
                </span>
              </h3>
              <p className="text-xs text-slate-400">
                Real-time definitions for modified characters, diacritics, and Sufi manuscript terminology.
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search Bar */}
        <div className="p-4 border-b border-slate-800 bg-slate-950/40">
          <div className="relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by Ajam character, Ethiopic term, phonetics, or definition..."
              className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl pl-10 pr-4 py-2.5 text-xs text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-medium"
            />
          </div>
        </div>

        {/* Main Body Grid */}
        <div className="flex-1 overflow-y-auto grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-800">
          
          {/* Left Column: Results List */}
          <div className="p-3 space-y-1.5 max-h-60 md:max-h-none overflow-y-auto">
            <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-2 py-1">
              Lexicon Results ({searchResults.length})
            </div>
            {searchResults.length === 0 ? (
              <div className="p-4 text-center text-xs text-slate-500">
                No matching lexicon entries found.
              </div>
            ) : (
              searchResults.map(entry => {
                const isActive = activeEntry?.id === entry.id;
                return (
                  <button
                    key={entry.id}
                    onClick={() => onSelectEntry(entry)}
                    className={`w-full text-left p-2.5 rounded-2xl border transition-all flex items-center justify-between ${
                      isActive 
                        ? 'bg-amber-500/15 border-amber-500/40 text-amber-300 shadow-md' 
                        : 'bg-slate-800/40 border-slate-800 text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="font-ajam text-lg text-amber-400 w-7 text-center font-bold">
                        {entry.termAjam}
                      </span>
                      <div>
                        <div className="text-xs font-bold leading-tight">{entry.transliteration}</div>
                        <div className="text-[10px] text-slate-400">{entry.termEthiopic}</div>
                      </div>
                    </div>
                    <ChevronRight className={`w-3.5 h-3.5 ${isActive ? 'text-amber-400' : 'text-slate-600'}`} />
                  </button>
                );
              })
            )}
          </div>

          {/* Right Column: Detailed Active Entry Definition Card */}
          {activeEntry && (
            <div className="md:col-span-2 p-5 space-y-4 bg-slate-900/60 overflow-y-auto">
              
              {/* Term Banner */}
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/10 via-slate-800 to-slate-900 border border-amber-500/30 flex items-start justify-between">
                <div className="space-y-1">
                  <div className="flex items-center gap-3">
                    <span className="text-4xl font-extrabold text-amber-300 font-ajam leading-none">
                      {activeEntry.termAjam}
                    </span>
                    <div>
                      <h4 className="text-lg font-bold text-slate-100 flex items-center gap-2">
                        {activeEntry.transliteration}
                        <span className="text-xs text-amber-400 font-mono font-medium">[{activeEntry.phonetics}]</span>
                      </h4>
                      <p className="text-xs text-slate-300 font-semibold">{activeEntry.termEthiopic}</p>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-1.5">
                  <button
                    onClick={() => handleSpeak(activeEntry.termAjam)}
                    className="p-2 rounded-xl bg-slate-800 hover:bg-amber-500/20 text-slate-300 hover:text-amber-400 transition-colors"
                    title="Pronounce Term"
                  >
                    <Volume2 className="w-4 h-4" />
                  </button>
                  {onInsertTerm && (
                    <button
                      onClick={handleInsert}
                      className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs flex items-center gap-1 transition-all"
                    >
                      {copiedText ? <Check className="w-3.5 h-3.5 text-slate-950" /> : <Plus className="w-3.5 h-3.5" />}
                      <span>{copiedText ? 'Inserted' : 'Insert'}</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Badges & Category */}
              <div className="flex flex-wrap items-center gap-1.5 text-[11px]">
                <span className="px-2.5 py-1 rounded-lg bg-blue-500/10 text-blue-400 border border-blue-500/20 font-bold capitalize">
                  {activeEntry.category}
                </span>
                {activeEntry.dialects.map(d => (
                  <span key={d} className="px-2.5 py-1 rounded-lg bg-slate-800 text-slate-300 border border-slate-700 flex items-center gap-1">
                    <Tag className="w-3 h-3 text-amber-400" />
                    {d}
                  </span>
                ))}
              </div>

              {/* Definition */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">English Definition</h5>
                <p className="text-xs text-slate-200 leading-relaxed font-normal bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
                  {activeEntry.englishDefinition}
                </p>
              </div>

              {/* Ethiopic Definition */}
              <div className="space-y-2">
                <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider">የአማርኛ ማብራሪያ (Ethiopic Description)</h5>
                <p className="text-xs text-amber-200/90 leading-relaxed font-normal bg-slate-950/40 p-3 rounded-2xl border border-slate-800">
                  {activeEntry.ethiopicDefinition}
                </p>
              </div>

              {/* Example Usage */}
              <div className="p-3.5 rounded-2xl bg-amber-500/5 border border-amber-500/20 space-y-1.5">
                <div className="text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Manuscript Example
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-lg font-ajam text-amber-300 font-bold">{activeEntry.exampleAjam}</span>
                  <span className="text-xs text-slate-300 font-semibold">{activeEntry.exampleEthiopic}</span>
                </div>
                <p className="text-xs text-slate-400 italic">"{activeEntry.exampleEnglish}"</p>
              </div>

              {/* Scribal Note */}
              <div className="p-3 rounded-2xl bg-slate-950/60 border border-slate-800 text-[11px] text-slate-400 flex items-start gap-2">
                <Info className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-300">Scribal & Codicological Note:</span> {activeEntry.scribalNote}
                </div>
              </div>

            </div>
          )}

        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-slate-950 border-t border-slate-800 flex items-center justify-between text-xs text-slate-400">
          <div className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Local Lexicon Engine • Offline Cache Ready</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 font-semibold cursor-pointer"
          >
            Close Glossary
          </button>
        </div>

      </div>
    </div>
  );
};
