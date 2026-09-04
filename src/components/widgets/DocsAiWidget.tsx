/**
 * @file DocsAiWidget.tsx
 * @description iOS Smart Stack widget for quick Gemini AI Copilot document intelligence prompts.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Sparkles, ChevronRight, Wand2, FileSearch, Lightbulb } from 'lucide-react';

interface DocsAiWidgetProps {
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
}

export const DocsAiWidget: React.FC<DocsAiWidgetProps> = ({
  onOpenApp,
  isDarkMode = true,
}) => {
  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-3.5 rounded-2xl border transition-all shadow-sm flex flex-col justify-between min-h-[148px] ${
        isDarkMode
          ? 'bg-[#161b22] border-[#30363d] hover:border-violet-500/60 shadow-black/40'
          : 'bg-white/90 border-neutral-200 hover:border-violet-400 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-violet-500 font-semibold text-[11px] tracking-wide">
          <Sparkles className="w-3.5 h-3.5" />
          <span>GEMINI 2.5 COPILOT</span>
        </div>
        <button
          onClick={() => onOpenApp('harmony-docs-ai')}
          className={`text-[11px] flex items-center gap-0.5 transition-colors font-medium ${
            isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Launch <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Suggested Prompt Text */}
      <div className="my-1">
        <p className={`text-[11px] leading-relaxed line-clamp-2 ${isDarkMode ? 'text-neutral-300' : 'text-neutral-700'}`}>
          "Summarize my recent document, extract action items, or rewrite notes with professional polish."
        </p>
      </div>

      {/* Action Chips */}
      <div className="flex items-center gap-1.5 overflow-x-auto pb-0.5 scrollbar-none">
        <button
          onClick={() => onOpenApp('harmony-docs-ai')}
          className={`px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors border shrink-0 ${
            isDarkMode
              ? 'bg-[#0d1117] hover:bg-[#21262d] border-[#30363d] text-violet-300'
              : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-violet-700'
          }`}
        >
          <FileSearch className="w-3 h-3" />
          Summarize Doc
        </button>

        <button
          onClick={() => onOpenApp('harmony-docs-ai')}
          className={`px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors border shrink-0 ${
            isDarkMode
              ? 'bg-[#0d1117] hover:bg-[#21262d] border-[#30363d] text-neutral-300'
              : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
          }`}
        >
          <Wand2 className="w-3 h-3 text-amber-400" />
          Refine Tone
        </button>

        <button
          onClick={() => onOpenApp('harmony-docs-ai')}
          className={`px-2 py-1 rounded-lg text-[10px] font-medium flex items-center gap-1 transition-colors border shrink-0 ${
            isDarkMode
              ? 'bg-[#0d1117] hover:bg-[#21262d] border-[#30363d] text-neutral-300'
              : 'bg-neutral-50 hover:bg-neutral-100 border-neutral-200 text-neutral-700'
          }`}
        >
          <Lightbulb className="w-3 h-3 text-cyan-400" />
          Outline
        </button>
      </div>
    </motion.div>
  );
};
