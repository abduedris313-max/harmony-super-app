/**
 * @file DocsAiWidget.tsx
 * @description iOS Smart Stack widget for quick Gemini AI Copilot document intelligence prompts with S/M/L modes.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, Wand2, FileSearch, Send, PenTool, Lightbulb, Languages } from 'lucide-react';
import { WidgetSize } from './types';
import { WidgetSizeSelector } from './WidgetSizeSelector';
import { soundManager } from '../../lib/soundManager';

interface DocsAiWidgetProps {
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
  size?: WidgetSize;
  onResize?: (size: WidgetSize) => void;
}

const AI_PROMPTS = [
  { label: 'Summarize Notes', icon: Wand2, query: 'Summarize key points from my recent notes and docs.' },
  { label: 'Extract Tasks', icon: FileSearch, query: 'Extract actionable checklist items from my writing drafts.' },
  { label: 'Polish Tone', icon: PenTool, query: 'Polish and enhance the vocabulary of my current text.' },
  { label: 'Brainstorm Ideas', icon: Lightbulb, query: 'Brainstorm creative topics for my next article.' },
];

export const DocsAiWidget: React.FC<DocsAiWidgetProps> = ({
  onOpenApp,
  isDarkMode = true,
  size = 'small',
  onResize
}) => {
  const [customPrompt, setCustomPrompt] = useState('');

  const handleSendPrompt = (promptText?: string) => {
    soundManager.playClickSound();
    onOpenApp('harmony-docs-ai');
  };

  return (
    <motion.div
      layout
      whileHover={{ scale: 1.01 }}
      className={`p-2.5 rounded-2xl border transition-all shadow-xs flex flex-col justify-between ${
        size === 'large' 
          ? 'min-h-[210px] sm:min-h-[230px]' 
          : size === 'medium'
            ? 'min-h-[96px] sm:min-h-[110px]'
            : 'min-h-[96px] sm:min-h-[110px]'
      } ${
        isDarkMode
          ? 'bg-[#161b22] border-[#30363d] hover:border-violet-500/60 shadow-black/40'
          : 'bg-white/90 border-neutral-200 hover:border-violet-400 hover:shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 text-violet-500 font-semibold text-[10px] sm:text-[11px] tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span className="font-bold">GEMINI 2.5 COPILOT</span>
        </div>

        <div className="flex items-center gap-1.5">
          <WidgetSizeSelector size={size} onResize={onResize} isDarkMode={isDarkMode} />
          <button
            onClick={() => onOpenApp('harmony-docs-ai')}
            className={`text-[10px] flex items-center gap-0.5 transition-colors font-medium ${
              isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Launch <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* ================= SMALL SIZE ================= */}
      {size === 'small' && (
        <>
          <div className="my-0.5">
            <p className={`text-[10px] leading-snug line-clamp-2 ${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
              "Summarize notes, extract tasks, or brainstorm ideas instantly."
            </p>
          </div>

          <div className="flex items-center gap-1 overflow-x-auto pb-0.5 scrollbar-none">
            <button
              onClick={() => handleSendPrompt()}
              className={`px-1.5 py-0.5 rounded text-[8.5px] font-medium flex items-center gap-1 transition-colors border shrink-0 ${
                isDarkMode
                  ? 'bg-[#0d1117] hover:bg-[#21262d] border-[#30363d] text-violet-300'
                  : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-violet-700'
              }`}
            >
              <Wand2 className="w-2.5 h-2.5" /> Summarize
            </button>
            <button
              onClick={() => handleSendPrompt()}
              className={`px-1.5 py-0.5 rounded text-[8.5px] font-medium flex items-center gap-1 transition-colors border shrink-0 ${
                isDarkMode
                  ? 'bg-[#0d1117] hover:bg-[#21262d] border-[#30363d] text-violet-300'
                  : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-violet-700'
              }`}
            >
              <FileSearch className="w-2.5 h-2.5" /> Action Items
            </button>
          </div>
        </>
      )}

      {/* ================= MEDIUM SIZE ================= */}
      {size === 'medium' && (
        <>
          <div className="my-0.5 flex items-center gap-1.5 overflow-x-auto scrollbar-none py-0.5">
            {AI_PROMPTS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.label}
                  onClick={() => handleSendPrompt(p.query)}
                  className={`px-2 py-1 rounded-lg border text-[9px] font-semibold flex items-center gap-1 shrink-0 transition-colors ${
                    isDarkMode
                      ? 'bg-[#0d1117] hover:bg-violet-900/30 border-[#30363d] text-violet-300'
                      : 'bg-neutral-50 hover:bg-violet-50 border-neutral-200 text-violet-700'
                  }`}
                >
                  <Icon className="w-2.5 h-2.5" />
                  <span>{p.label}</span>
                </button>
              );
            })}
          </div>

          <div className={`px-2 py-1 rounded-xl border flex items-center gap-1.5 ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <input
              type="text"
              placeholder="Ask Gemini AI anything..."
              value={customPrompt}
              onChange={(e) => setCustomPrompt(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
              className="w-full bg-transparent text-[10px] outline-hidden placeholder-neutral-400"
            />
            <button
              onClick={() => handleSendPrompt()}
              className="p-1 rounded-lg bg-violet-600 text-white hover:bg-violet-500 transition-colors shrink-0"
            >
              <Send className="w-2.5 h-2.5" />
            </button>
          </div>
        </>
      )}

      {/* ================= LARGE SIZE ================= */}
      {size === 'large' && (
        <div className="flex-1 flex flex-col justify-between gap-2 mt-1">
          {/* Intelligence Capabilities Grid */}
          <div className="grid grid-cols-2 gap-1.5">
            {AI_PROMPTS.map((p) => {
              const Icon = p.icon;
              return (
                <button
                  key={p.label}
                  onClick={() => handleSendPrompt(p.query)}
                  className={`p-2 rounded-xl border text-left flex items-start gap-2 transition-all ${
                    isDarkMode 
                      ? 'bg-[#0d1117] border-[#30363d] hover:border-violet-500/50' 
                      : 'bg-neutral-50 border-neutral-200 hover:border-violet-400'
                  }`}
                >
                  <div className="w-6 h-6 rounded-lg bg-violet-500/20 text-violet-400 flex items-center justify-center shrink-0 mt-0.5">
                    <Icon className="w-3 h-3" />
                  </div>
                  <div className="min-w-0">
                    <p className="text-[10px] font-bold text-violet-400 truncate">{p.label}</p>
                    <p className="text-[8px] text-neutral-400 line-clamp-2 leading-tight">{p.query}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Copilot Input Bar */}
          <div className={`p-2 rounded-xl border ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <label className="text-[9px] font-bold text-neutral-400 uppercase tracking-wider block mb-1">
              Ask Document Intelligence
            </label>
            <div className="flex items-center gap-1.5">
              <input
                type="text"
                placeholder="Ask about your notes, drafts, or finances..."
                value={customPrompt}
                onChange={(e) => setCustomPrompt(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSendPrompt()}
                className="w-full bg-transparent text-[11px] outline-hidden placeholder-neutral-400"
              />
              <button
                onClick={() => handleSendPrompt()}
                className="px-2.5 py-1 rounded-lg bg-violet-600 text-white font-bold text-[10px] flex items-center gap-1 hover:bg-violet-500 transition-colors shrink-0 shadow-sm"
              >
                <span>Ask AI</span>
                <Send className="w-2.5 h-2.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </motion.div>
  );
};
