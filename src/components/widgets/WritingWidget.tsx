/**
 * @file WritingWidget.tsx
 * @description iOS Smart Stack widget displaying the latest writing studio draft & daily target progress with S/M/L modes.
 */

import React from 'react';
import { motion } from 'motion/react';
import { PenTool, ChevronRight, Target, Flame, Clock, BookOpen, Plus } from 'lucide-react';
import { HarmonyWritingDraft } from '../../types';
import { WidgetSize } from './types';
import { WidgetSizeSelector } from './WidgetSizeSelector';
import { soundManager } from '../../lib/soundManager';

interface WritingWidgetProps {
  latestDraft?: HarmonyWritingDraft;
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
  size?: WidgetSize;
  onResize?: (size: WidgetSize) => void;
}

export const WritingWidget: React.FC<WritingWidgetProps> = ({
  latestDraft,
  onOpenApp,
  isDarkMode = true,
  size = 'small',
  onResize
}) => {
  const wordCount = latestDraft 
    ? (latestDraft.currentWordCount || (latestDraft.content || '').split(/\s+/).filter(Boolean).length)
    : 0;
  
  const targetWordCount = latestDraft?.targetWordCount || 1000;
  const progressPct = Math.min(100, Math.round((wordCount / targetWordCount) * 100));
  const readingTimeMinutes = Math.max(1, Math.ceil(wordCount / 200));

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
          ? 'bg-[#161b22] border-[#30363d] hover:border-blue-500/60 shadow-black/40'
          : 'bg-white/90 border-neutral-200 hover:border-blue-400 hover:shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 text-blue-500 font-semibold text-[10px] sm:text-[11px] tracking-wide">
          <PenTool className="w-3.5 h-3.5" />
          <span className="font-bold">WRITING STUDIO</span>
        </div>

        <div className="flex items-center gap-1.5">
          <WidgetSizeSelector size={size} onResize={onResize} isDarkMode={isDarkMode} />
          <button
            onClick={() => onOpenApp('harmony-writing-studio')}
            className={`text-[10px] flex items-center gap-0.5 transition-colors font-medium ${
              isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
            }`}
          >
            Open <ChevronRight className="w-2.5 h-2.5" />
          </button>
        </div>
      </div>

      {/* ================= SMALL SIZE ================= */}
      {size === 'small' && (
        <>
          <div className="my-0.5">
            {latestDraft ? (
              <div>
                <h4 className={`text-[11px] font-bold truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                  {latestDraft.title}
                </h4>
                <p className={`text-[9px] line-clamp-1 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {(latestDraft.content || '').replace(/<[^>]*>?/gm, '').trim() || 'No preview available'}
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-neutral-400 italic">No active draft in progress</p>
            )}
          </div>

          <div className={`px-2 py-0.5 rounded-lg border text-[8px] flex items-center justify-between ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <span className="text-neutral-400 font-mono">
              {wordCount} words ({progressPct}%)
            </span>
            <button
              onClick={() => onOpenApp('harmony-writing-studio')}
              className="text-blue-500 hover:text-blue-400 font-bold"
            >
              Continue →
            </button>
          </div>
        </>
      )}

      {/* ================= MEDIUM SIZE ================= */}
      {size === 'medium' && (
        <>
          <div className="my-1 flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <h4 className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {latestDraft?.title || 'Untitled Writing Piece'}
              </h4>
              <p className={`text-[9.5px] line-clamp-1 mt-0.5 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                {(latestDraft?.content || '').replace(/<[^>]*>?/gm, '').trim() || 'Ready to write your next chapter.'}
              </p>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <div className="text-right">
                <span className="text-[9px] font-bold text-blue-400 font-mono">{wordCount}/{targetWordCount}</span>
                <p className="text-[7.5px] text-neutral-400">words</p>
              </div>
            </div>
          </div>

          {/* Daily Goal Bar */}
          <div className={`px-2 py-1 rounded-lg border text-[9px] ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="flex items-center justify-between text-[8px] mb-0.5">
              <span className="text-neutral-400 flex items-center gap-1">
                <Target className="w-2.5 h-2.5 text-blue-400" />
                <span>Daily Target</span>
              </span>
              <span className="font-mono text-blue-400 font-bold">{progressPct}%</span>
            </div>
            <div className="w-full h-1 rounded-full bg-neutral-200 dark:bg-neutral-800 overflow-hidden">
              <div
                className="h-full rounded-full bg-gradient-to-r from-blue-500 to-indigo-500 transition-all duration-500"
                style={{ width: `${progressPct}%` }}
              />
            </div>
          </div>
        </>
      )}

      {/* ================= LARGE SIZE ================= */}
      {size === 'large' && (
        <div className="flex-1 flex flex-col justify-between gap-2 mt-1">
          {/* Top Metrics Cards */}
          <div className="grid grid-cols-3 gap-1.5">
            <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'}`}>
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Words</span>
              <p className="text-sm font-black text-blue-400 mt-0.5">{wordCount}</p>
            </div>

            <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'}`}>
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Goal Progress</span>
              <p className="text-sm font-black text-indigo-400 mt-0.5">{progressPct}%</p>
            </div>

            <div className={`p-2 rounded-xl border ${isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'}`}>
              <span className="text-[8px] text-neutral-400 uppercase font-mono block">Read Time</span>
              <p className="text-sm font-black text-amber-400 mt-0.5">~{readingTimeMinutes} min</p>
            </div>
          </div>

          {/* Active Draft Excerpt */}
          <div className={`p-2 rounded-xl border ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-[9px] font-bold text-neutral-400 uppercase">Active Manuscript</span>
              <span className="text-[8px] px-1.5 py-0.2 rounded bg-blue-500/10 text-blue-400 font-mono">Draft Mode</span>
            </div>
            <h4 className="text-xs font-bold truncate">{latestDraft?.title || 'My Next Masterpiece'}</h4>
            <p className={`text-[9.5px] line-clamp-2 mt-0.5 italic ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
              "{(latestDraft?.content || '').replace(/<[^>]*>?/gm, '').trim() || 'The blank canvas waits for your words. Tap below to begin typing...'}"
            </p>
          </div>

          {/* Quick Actions */}
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => onOpenApp('harmony-writing-studio')}
              className="flex-1 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-bold text-[10px] flex items-center justify-center gap-1 transition-colors shadow-sm"
            >
              <span>Continue Writing</span>
              <ChevronRight className="w-3 h-3" />
            </button>
            <button
              onClick={() => onOpenApp('harmony-writing-studio')}
              className={`p-1.5 rounded-lg border text-neutral-400 hover:text-white transition-colors ${
                isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
              }`}
              title="New Manuscript"
            >
              <Plus className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
