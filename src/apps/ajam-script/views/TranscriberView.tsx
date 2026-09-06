import React, { useState } from 'react';
import { 
  Keyboard, 
  ArrowRightLeft, 
  Sparkles, 
  Copy, 
  Check, 
  Volume2, 
  Feather, 
  RefreshCw,
  Info
} from 'lucide-react';
import { VIRTUAL_AJAM_KEYBOARD, convertEthiopicToAjam } from '../lib/ajamEngine';

export const TranscriberView: React.FC = () => {
  const [inputText, setInputText] = useState('ያ አርሐመል ራሕሚን እርዝቅና ሁስነል ኻቲማ');
  const [ajamOutput, setAjamOutput] = useState('يا أرحم الراحمين ارزقنا حسن الخاتمة');
  const [targetDialect, setTargetDialect] = useState('Amharic Ajam');
  const [isLoading, setIsLoading] = useState(false);
  const [copied, setCopied] = useState(false);
  const [showKeyboard, setShowKeyboard] = useState(true);

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

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      
      {/* Header */}
      <div className="text-center space-y-2">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-semibold">
          <Keyboard className="w-3.5 h-3.5" /> Interactive Orthography Workbench
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-100">
          Ajam Script Transcriber & Keyboard
        </h2>
        <p className="text-xs sm:text-sm text-slate-400 max-w-xl mx-auto">
          Type Ethiopic (Ge’ez) or phonetic Latin text to compose authentic Ajam script for Wollo, Harar, Silte, and Afaan Oromo Sufi chants.
        </p>
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

      {/* Converter Dual Pane */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        
        {/* Source Text Input */}
        <div className="glass-card p-4 rounded-3xl space-y-2 border border-slate-800">
          <div className="flex items-center justify-between text-xs text-slate-300">
            <span className="font-bold flex items-center gap-1.5">
              <Feather className="w-3.5 h-3.5 text-amber-400" /> Ethiopic / Phonetic Input
            </span>
            <span className="text-[10px] text-slate-500">Live Converter</span>
          </div>

          <textarea
            value={inputText}
            onChange={(e) => handleInputChange(e.target.value)}
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
              <button onClick={handleSpeak} className="p-1 text-slate-400 hover:text-amber-400">
                <Volume2 className="w-4 h-4" />
              </button>
              <button onClick={handleCopy} className="p-1 text-slate-400 hover:text-amber-400">
                {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <textarea
            value={ajamOutput}
            onChange={(e) => setAjamOutput(e.target.value)}
            rows={5}
            className="w-full bg-slate-900 border border-slate-700/80 rounded-2xl p-3 text-2xl text-amber-300 font-ajam focus:outline-none focus:border-amber-500 text-right leading-relaxed"
            dir="rtl"
          />
        </div>

      </div>

      {/* AI Refine Button */}
      <div className="flex justify-center">
        <button
          onClick={handleAiTranscribe}
          disabled={isLoading || !inputText.trim()}
          className="px-6 py-2.5 rounded-2xl bg-gradient-to-r from-amber-500 to-emerald-600 text-slate-950 font-bold text-xs flex items-center gap-2 shadow-lg shadow-amber-500/10 hover:opacity-90 disabled:opacity-50 transition-all"
        >
          {isLoading ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
          Refine Orthography with AI ({targetDialect})
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
                    className="w-9 h-10 sm:w-11 sm:h-11 rounded-xl bg-slate-800 border border-slate-700 hover:border-amber-500/50 hover:bg-amber-500/20 text-amber-300 font-ajam font-semibold text-lg sm:text-xl flex items-center justify-center active:scale-95 transition-all shadow-sm"
                  >
                    {char}
                  </button>
                ))}
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
