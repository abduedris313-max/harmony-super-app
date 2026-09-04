/**
 * @file WritingWidget.tsx
 * @description iOS Smart Stack widget displaying daily word target progress & writing streak.
 */

import React from 'react';
import { motion } from 'motion/react';
import { PenTool, ChevronRight, Flame, Target } from 'lucide-react';
import { HarmonyWritingDraft } from '../../types';

interface WritingWidgetProps {
  latestDraft?: HarmonyWritingDraft;
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
}

export const WritingWidget: React.FC<WritingWidgetProps> = ({
  latestDraft,
  onOpenApp,
  isDarkMode = true,
}) => {
  const currentWords = latestDraft?.currentWordCount || 420;
  const targetWords = latestDraft?.targetWordCount || 1000;
  const progressPct = Math.min(100, Math.round((currentWords / targetWords) * 100));

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-3.5 rounded-2xl border transition-all shadow-sm flex flex-col justify-between min-h-[148px] ${
        isDarkMode
          ? 'bg-[#161b22] border-[#30363d] hover:border-emerald-500/60 shadow-black/40'
          : 'bg-white/90 border-neutral-200 hover:border-emerald-400 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-teal-500 font-semibold text-[11px] tracking-wide">
          <PenTool className="w-3.5 h-3.5" />
          <span>WRITING STUDIO</span>
        </div>
        <button
          onClick={() => onOpenApp('harmony-writing')}
          className={`text-[11px] flex items-center gap-0.5 transition-colors font-medium ${
            isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Open <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Progress metrics */}
      <div className="my-1">
        <div className="flex items-center justify-between text-xs mb-1">
          <div className="flex items-center gap-1 font-semibold text-neutral-200 dark:text-white">
            <Target className="w-3.5 h-3.5 text-teal-400" />
            <span>Daily Word Target</span>
          </div>
          <span className="font-mono text-[11px] font-bold text-teal-400">
            {currentWords} / {targetWords} ({progressPct}%)
          </span>
        </div>

        <div className="w-full h-2 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
          <div
            className="h-full rounded-full bg-gradient-to-r from-teal-500 to-emerald-400 transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Footer Streak Bar */}
      <div className={`p-2 rounded-xl border text-[11px] flex items-center justify-between ${
        isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
      }`}>
        <span className="flex items-center gap-1 text-[10px] text-amber-500 font-semibold font-mono">
          <Flame className="w-3.5 h-3.5" /> 5-Day Focus Streak
        </span>
        <span className={`text-[10px] truncate max-w-[120px] ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
          {latestDraft ? latestDraft.title : 'Typewriter Mode'}
        </span>
      </div>
    </motion.div>
  );
};
