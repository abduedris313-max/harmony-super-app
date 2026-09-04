/**
 * @file NotesWidget.tsx
 * @description iOS Smart Stack widget displaying recent notes & quick capture.
 */

import React from 'react';
import { motion } from 'motion/react';
import { Notebook, ChevronRight, Plus, Tag } from 'lucide-react';
import { HarmonyNote } from '../../types';

interface NotesWidgetProps {
  notes?: HarmonyNote[];
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
}

export const NotesWidget: React.FC<NotesWidgetProps> = ({
  notes = [],
  onOpenApp,
  isDarkMode = true,
}) => {
  const latestNote = notes[0];
  const totalNotes = notes.length;

  return (
    <motion.div
      whileHover={{ scale: 1.01 }}
      className={`p-3.5 rounded-2xl border transition-all shadow-sm flex flex-col justify-between min-h-[148px] ${
        isDarkMode
          ? 'bg-[#161b22] border-[#30363d] hover:border-amber-500/60 shadow-black/40'
          : 'bg-white/90 border-neutral-200 hover:border-amber-400 hover:shadow-md'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-1.5 text-amber-500 font-semibold text-[11px] tracking-wide">
          <Notebook className="w-3.5 h-3.5" />
          <span>QUICK NOTES</span>
        </div>
        <button
          onClick={() => onOpenApp('harmony-notes')}
          className={`text-[11px] flex items-center gap-0.5 transition-colors font-medium ${
            isDarkMode ? 'text-neutral-400 hover:text-white' : 'text-neutral-500 hover:text-neutral-900'
          }`}
        >
          Open <ChevronRight className="w-3 h-3" />
        </button>
      </div>

      {/* Note Preview */}
      <div className="my-1">
        {latestNote ? (
          <div>
            <div className="flex items-center justify-between gap-1 mb-0.5">
              <h4 className={`text-xs font-bold truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                {latestNote.title}
              </h4>
              <span className="text-[9px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium">
                {latestNote.category}
              </span>
            </div>
            <p className={`text-[11px] line-clamp-2 leading-tight ${isDarkMode ? 'text-neutral-400' : 'text-neutral-600'}`}>
              {latestNote.content || 'Empty note content...'}
            </p>
          </div>
        ) : (
          <p className="text-[11px] italic text-neutral-400">
            No notes saved. Tap below to capture your first idea.
          </p>
        )}
      </div>

      {/* Footer Bar */}
      <div className={`p-2 rounded-xl border text-[11px] flex items-center justify-between ${
        isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
      }`}>
        <span className="text-[10px] text-neutral-400 font-mono">
          {totalNotes} {totalNotes === 1 ? 'Note' : 'Notes'} stored
        </span>
        <button
          onClick={() => onOpenApp('harmony-notes')}
          className="flex items-center gap-1 text-[10px] font-semibold text-amber-500 hover:text-amber-400 transition-colors"
        >
          <Plus className="w-3 h-3" />
          New Note
        </button>
      </div>
    </motion.div>
  );
};
