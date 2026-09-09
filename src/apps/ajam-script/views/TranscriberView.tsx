/**
 * @file TranscriberView.tsx
 * @description Ajam Script Transcriber with real-time text selection Popup Glossary, local lexicon integration,
 * and offline service worker caching for manuscript metadata and high-frequency character sets.
 */

import React, { useState, useEffect } from 'react';
import { 
  Keyboard, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  Feather, 
  RefreshCw,
  BookOpen,
  Info,
  WifiOff,
  Search,
  HelpCircle,
  ExternalLink
} from 'lucide-react';
import { VIRTUAL_AJAM_KEYBOARD, convertEthiopicToAjam } from '../lib/ajamEngine';
import { AjamGlossaryModal } from '../components/AjamGlossaryModal';
import { AJAM_LEXICON, lookupLexiconEntry, LexiconEntry } from '../data/ajamLexicon';
import { syncAjamOfflineData, AjamOfflineStatus } from '../lib/offlineManager';

export const TranscriberView: React.FC = () => {
  const [inputText, setInputText] = useState('ያ አርሐመል ራሕሚን እርዝቅና ሁስነል ኻቲማ');
  const [ajamOutput, setAjamOutput] = useState('يا أرحم الراحمين ارزقنا حسن الخاتمة');
  const [targetDialect, setTargetDialect] = useState('Amharic Ajam');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);

  // Popup Glossary State
  const [isGlossaryOpen, setIsGlossaryOpen] = useState(false);
  const [selectedLexiconEntry, setSelectedLexiconEntry] = useState<LexiconEntry | null>(null);
  const [highlightedText, setHighlightedText] = useState<string>('');

  // Service Worker Offline Caching Status
  const [offlineStatus, setOfflineStatus] = useState<AjamOfflineStatus | null>(null);

  // Initialize Service Worker offline caching on mount
  useEffect(() => {
    syncAjamOfflineData().then(status => {
      setOfflineStatus(status);
    });
  }, []);

  // Instant client-side conversion as user types
  const handleInputChange = (text: string) => {
    setInputText(text);
    const clientConverted = convertEthiopicToAjam(text);
    setAjamOutput(clientConverted);
  };

  // AI-enhanced transcription via server
  const handleAiTranscribe = async () => {
    if (!inputText.trim()) return;
    setIsLoading(true);
    try {
      const response = await fetch('/api/transcribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ sourceText: inputText, targetDialect })
      });
      const data = await response.json();
      if (data.success && data.result) {
        setAjamOutput(data.result.ajamText);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInsertChar = (char: string) => {
    setAjamOutput(prev => prev + char);
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(ajamOutput);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSpeak = () => {
    if ('speechSynthesis' in window) {
      const utterance = new SpeechSynthesisUtterance(inputText || ajamOutput);
      utterance.lang = 'ar-SA';
      window.speechSynthesis.speak(utterance);
    }
  };

  // Text selection handler for real-time popup definition lookup
  const handleTextSelection = (e: React.SyntheticEvent<HTMLTextAreaElement>) => {
    const target = e.currentTarget;
    const start = target.selectionStart;
    const end = target.selectionEnd;
    
    if (start !== undefined && end !== undefined && start !== end) {
      const selectedStr = target.value.substring(start, end).trim();
      if (selectedStr.length > 0) {
        setHighlightedText(selectedStr);
        const matched = lookupLexiconEntry(selectedStr);
        if (matched) {
          setSelectedLexiconEntry(matched);
        }
      }
    }
  };

  const openGlossaryForTerm = (term: string) => {
    const entry = lookupLexiconEntry(term);
    setSelectedLexiconEntry(entry || AJAM_LEXICON[0]);
    setIsGlossaryOpen(true);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto pb-8">
      
      {/* Header & Offline Cache Telemetry */}
      <div className="text-center space-y-2">
        <div className="flex flex-wrap items-center justify-center gap-2">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
            <Keyboard className="w-3.5 h-3.5" /> Interactive Orthography Workbench
          </span>
          <button
            onClick={() => {
              setSelectedLexiconEntry(AJAM_LEXICON[0]);
              setIsGlossaryOpen(true);
            }}
            className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/20 text-xs font-bold transition-all cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" /> Popup Glossary ({AJAM_LEXICON.length} Terms)
          </button>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          Ajam Script Transcriber & Keyboard
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Type Ethiopic (Ge’ez) or phonetic Latin text to compose authentic Ajam script for Wollo, Harar, Silte, and Afaan Oromo Sufi chants.
        </p>

        {/* Offline Readiness Badge */}
        {offlineStatus && (
          <div className="pt-1 flex items-center justify-center gap-2 text-[11px] text-slate-400">
            <span className="flex items-center gap-1 text-emerald-400 font-semibold">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              Service Worker Ready
            </span>
            <span>•</span>
            <span className="text-slate-300">
              Cached Offline: {offlineStatus.cachedManuscriptsCount} Manuscripts & {offlineStatus.cachedCharactersCount} Character Rules
            </span>
          </div>
        )}
      </div>

      {/* Target Dialect Selector */}
      <div className="flex items-center justify-center gap-2 text-xs">
        <span className="text-slate-400 font-medium">Target Dialect:</span>
        {['Amharic Ajam', 'Oromo Ajam', 'Harari Ajam', 'Silte Ajam'].map(d => (
          <button
            key={d}
            onClick={() => setTargetDialect(d)}
            className={`px-3 py-1 rounded-xl transition-all ${
              targetDialect === d 
                ? 'bg-amber-500 text-slate-950 font-bold shadow-md shadow-amber-500/20' 
                : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
            }`}
          >
            {d}
          </button>
        ))}
      </div>

      {/* Real-Time Quick Lexicon Chips */}
      <div className="glass-panel p-3.5 rounded-2xl border border-amber-500/20 bg-amber-500/5 flex flex-wrap items-center justify-between gap-2">
        <div className="flex items-center gap-2 text-xs font-bold text-amber-400">
          <BookOpen className="w-4 h-4" />
          <span>Real-Time Glossary Quick Lookup:</span>
        </div>
        <div className="flex flex-wrap items-center gap-1.5">
          {AJAM_LEXICON.slice(0, 8).map(entry => (
            <button
              key={entry.id}
              onClick={() => {
                setSelectedLexiconEntry(entry);
                setIsGlossaryOpen(true);
              }}
              className="px-2.5 py-1 rounded-xl bg-slate-800/80 hover:bg-amber-500/20 border border-slate-700 hover:border-amber-500/40 text-amber-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
              title={`View real-time popup definition for ${entry.transliteration}`}
            >
              <span className="font-ajam font-extrabold">{entry.termAjam}</span>
              <span className="text-[10px] text-slate-400">({entry.transliteration})</span>
            </button>
          ))}
        </div>
      </div>

      {/* Selection Tooltip Popup Notice */}
      {highlightedText && (
        <div className="p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/30 flex items-center justify-between text-xs text-indigo-300 animate-in fade-in">
          <div className="flex items-center gap-2">
            <Info className="w-4 h-4 text-indigo-400" />
            <span>Selected text: <strong className="font-mono text-amber-300 font-bold font-ajam">"{highlightedText}"</strong></span>
          </div>
          <button
            onClick={() => openGlossaryForTerm(highlightedText)}
            className="px-3 py-1 rounded-xl bg-indigo-500 hover:bg-indigo-400 text-white font-bold text-xs flex items-center gap-1 cursor-pointer"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Define in Glossary</span>
          </button>
        </div>
      )}

      {/* Converter Dual Pane */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Source Text Input */}
        <div className="glass-card p-4 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-amber-400" /> Ethiopic / Phonetic Input
            </span>
            <span className="text-[10px] text-slate-500">Select text for live definition</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
            onSelect={handleTextSelection}
            onMouseUp={handleTextSelection}
            onKeyUp={handleTextSelection}
            placeholder="Type Amharic, Oromo, Harari, or Silte in Ethiopic or Latin..."
            rows={5}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-3 text-sm text-slate-100 placeholder-slate-500 focus:outline-none focus:border-amber-500 font-ethiopic leading-relaxed"
          />
        </div>

        {/* Ajam Script Output Pane */}
        <div className="glass-card p-4 rounded-3xl space-y-2 border border-amber-500/30 bg-slate-900/60">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold text-amber-400 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5" /> Generated Ajam Script
            </span>
            <div className="flex items-center gap-2">
              <button onClick={handleSpeak} className="p-1 text-slate-400 hover:text-amber-400" title="Listen Speech">
                <Volume2 className="w-4 h-4" />
              </button>
              <button onClick={handleCopy} className="p-1 text-slate-400 hover:text-amber-400" title="Copy to Clipboard">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <textarea
            value={ajamOutput}
            onChange={(e) => setAjamOutput(e.target.value)}
            onSelect={handleTextSelection}
            onMouseUp={handleTextSelection}
            onKeyUp={handleTextSelection}
            rows={5}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-3 text-2xl text-amber-300 font-ajam focus:outline-none focus:border-amber-500 text-right leading-relaxed"
            dir="rtl"
          />
        </div>

      </div>

      {/* Action Bar */}
      <div className="flex flex-wrap items-center justify-center gap-3">
        <button
          onClick={handleAiTranscribe}
          disabled={isLoading || !inputText.trim()}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 hover:opacity-90 disabled:opacity-50 transition-all cursor-pointer"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Refine Orthography with AI ({targetDialect})
        </button>

        <button
          onClick={() => {
            setSelectedLexiconEntry(AJAM_LEXICON[0]);
            setIsGlossaryOpen(true);
          }}
          className="px-5 py-2.5 rounded-2xl bg-slate-800 hover:bg-slate-700 border border-slate-700 text-slate-200 font-bold text-xs flex items-center gap-2 transition-all cursor-pointer"
        >
          <BookOpen className="w-4 h-4 text-amber-400" />
          <span>Open Full Ajam Glossary</span>
        </button>
      </div>

      {/* Virtual Touch Keyboard Toggle */}
      <div className="glass-panel p-5 rounded-3xl border border-slate-800 space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-sm text-slate-200 flex items-center gap-2">
            <Keyboard className="w-4 h-4 text-amber-400" /> Virtual Ajam Keyboard & Special Glyphs
          </h3>
          <button
            onClick={() => setShowKeyboard(!showKeyboard)}
            className="text-xs text-amber-400 font-medium hover:underline"
          >
            {showKeyboard ? 'Hide Keyboard' : 'Show Keyboard'}
          </button>
        </div>

        {showKeyboard && (
          <div className="space-y-2 pt-2 border-t border-slate-800">
            {VIRTUAL_AJAM_KEYBOARD.map((row, rIdx) => (
              <div key={rIdx} className="flex justify-center flex-wrap gap-1.5">
                {row.map((char, cIdx) => (
                  <button
                    key={cIdx}
                    onClick={() => handleInsertChar(char)}
                    className="w-9 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 hover:bg-amber-500/20 text-amber-300 font-ajam font-semibold text-lg sm:text-xl flex items-center justify-center active:scale-95 transition-all shadow-sm cursor-pointer"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Popup Glossary Modal */}
      <AjamGlossaryModal
        isOpen={isGlossaryOpen}
        selectedEntry={selectedLexiconEntry}
        onClose={() => setIsGlossaryOpen(false)}
        onSelectEntry={(entry) => setSelectedLexiconEntry(entry)}
        onInsertTerm={(term) => {
          handleInsertChar(term);
          setIsGlossaryOpen(false);
        }}
      />

    </div>
  );
};
