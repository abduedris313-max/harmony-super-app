/**
 * @file NotesWidget.tsx
 * @description iOS Smart Stack widget displaying recent notes & quick capture with S/M/L modes.
 */

import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Notebook, ChevronRight, Plus, Send, Tag } from 'lucide-react';
import { HarmonyNote } from '../../types';
import { WidgetSize } from './types';
import { WidgetSizeSelector } from './WidgetSizeSelector';
import { soundManager } from '../../lib/soundManager';

interface NotesWidgetProps {
  notes?: HarmonyNote[];
  onOpenApp: (appId: string) => void;
  isDarkMode?: boolean;
  size?: WidgetSize;
  onResize?: (size: WidgetSize) => void;
}

export const NotesWidget: React.FC<NotesWidgetProps> = ({
  notes = [],
  onOpenApp,
  isDarkMode = true,
  size = 'small',
  onResize
}) => {
  const [quickThought, setQuickThought] = useState('');
  const latestNote = notes[0];
  const recentNotes = notes.slice(0, 3);

  const handleCreateQuickNote = () => {
    soundManager.playClickSound();
    onOpenApp('harmony-notes');
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
          ? 'bg-[#161b22] border-[#30363d] hover:border-amber-500/60 shadow-black/40'
          : 'bg-white/90 border-neutral-200 hover:border-amber-400 hover:shadow-sm'
      }`}
    >
      {/* Header */}
      <div className="flex items-center justify-between gap-1">
        <div className="flex items-center gap-1.5 text-amber-500 font-semibold text-[10px] sm:text-[11px] tracking-wide">
          <Notebook className="w-3.5 h-3.5" />
          <span className="font-bold">QUICK NOTES</span>
        </div>

        <div className="flex items-center gap-1.5">
          <WidgetSizeSelector size={size} onResize={onResize} isDarkMode={isDarkMode} />
          <button
            onClick={() => onOpenApp('harmony-notes')}
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
            {latestNote ? (
              <div>
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <h4 className={`text-[11px] font-bold truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    {latestNote.title}
                  </h4>
                  <span className="text-[8px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-medium shrink-0">
                    {latestNote.category || 'Note'}
                  </span>
                </div>
                <p className={`text-[9px] line-clamp-1 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {latestNote.content.replace(/<[^>]*>?/gm, '').trim() || 'No additional content'}
                </p>
              </div>
            ) : (
              <p className="text-[10px] text-neutral-400 italic">No notes created yet</p>
            )}
          </div>

          <div className={`px-2 py-0.5 rounded-lg border text-[8px] flex items-center justify-between ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <span className="text-neutral-400">{notes.length} notes saved</span>
            <button
              onClick={() => onOpenApp('harmony-notes')}
              className="text-amber-500 hover:text-amber-400 font-bold flex items-center gap-0.5"
            >
              <Plus className="w-2.5 h-2.5" /> New Note
            </button>
          </div>
        </>
      )}

      {/* ================= MEDIUM SIZE ================= */}
      {size === 'medium' && (
        <>
          <div className="my-1 grid grid-cols-2 gap-2">
            {recentNotes.slice(0, 2).map((note, idx) => (
              <div
                key={note.id || idx}
                onClick={() => onOpenApp('harmony-notes')}
                className={`p-1.5 rounded-xl border cursor-pointer hover:border-amber-500/40 transition-colors ${
                  isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
                }`}
              >
                <div className="flex items-center justify-between gap-1 mb-0.5">
                  <p className={`text-[10px] font-bold truncate ${isDarkMode ? 'text-white' : 'text-neutral-900'}`}>
                    {note.title}
                  </p>
                  <span className="text-[7.5px] px-1 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 shrink-0 font-medium">
                    {note.category || 'Idea'}
                  </span>
                </div>
                <p className={`text-[8.5px] line-clamp-2 leading-tight ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                  {note.content.replace(/<[^>]*>?/gm, '').trim() || 'No preview'}
                </p>
              </div>
            ))}
            {recentNotes.length === 0 && (
              <div className="col-span-2 text-center text-[10px] text-neutral-400 italic py-2">
                No notes created yet. Tap "+ New Note" below.
              </div>
            )}
          </div>

          <div className={`px-2 py-0.5 rounded-lg border text-[9px] flex items-center justify-between ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <span className="text-neutral-400">{notes.length} total notes</span>
            <button
              onClick={() => onOpenApp('harmony-notes')}
              className="text-amber-500 hover:text-amber-400 font-bold flex items-center gap-0.5"
            >
              <Plus className="w-3 h-3" /> New Note
            </button>
          </div>
        </>
      )}

      {/* ================= LARGE SIZE ================= */}
      {size === 'large' && (
        <div className="flex-1 flex flex-col justify-between gap-2 mt-1">
          {/* Notes List */}
          <div className="space-y-1.5 flex-1">
            <div className="flex items-center justify-between text-[10px] font-bold text-neutral-400 px-0.5">
              <span>Recent Notes ({notes.length})</span>
              <span className="text-[9px] text-amber-400 font-semibold">Synced Offline</span>
            </div>

            {recentNotes.length > 0 ? (
              recentNotes.map((note) => (
                <div
                  key={note.id}
                  onClick={() => onOpenApp('harmony-notes')}
                  className={`p-2 rounded-xl border cursor-pointer transition-all flex items-start justify-between gap-2 ${
                    isDarkMode ? 'bg-[#0d1117] border-[#30363d] hover:border-amber-500/50' : 'bg-neutral-50 border-neutral-200 hover:border-amber-400'
                  }`}
                >
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-1.5 mb-0.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                      <p className="text-xs font-bold truncate">{note.title}</p>
                    </div>
                    <p className={`text-[9px] line-clamp-1 ${isDarkMode ? 'text-neutral-400' : 'text-neutral-500'}`}>
                      {note.content.replace(/<[^>]*>?/gm, '').trim() || 'Empty note'}
                    </p>
                  </div>
                  <span className="text-[8px] px-1.5 py-0.2 rounded bg-amber-500/10 text-amber-400 border border-amber-500/20 font-mono shrink-0">
                    {note.category || 'General'}
                  </span>
                </div>
              ))
            ) : (
              <div className="p-3 text-center text-xs text-neutral-400 italic">
                No notes found. Create your first note below!
              </div>
            )}
          </div>

          {/* Inline Quick Jot Note Input */}
          <div className={`p-1.5 rounded-xl border flex items-center gap-1.5 ${
            isDarkMode ? 'bg-[#0d1117] border-[#30363d]' : 'bg-neutral-50 border-neutral-200'
          }`}>
            <input
              type="text"
              placeholder="Jot down a quick thought or idea..."
              value={quickThought}
              onChange={(e) => setQuickThought(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleCreateQuickNote()}
              className="w-full bg-transparent text-[10px] outline-hidden placeholder-neutral-400 px-1"
            />
            <button
              onClick={handleCreateQuickNote}
              className="px-2.5 py-1 rounded-lg bg-amber-600 text-white font-bold text-[9px] flex items-center gap-1 hover:bg-amber-500 transition-colors shrink-0"
            >
              <Plus className="w-2.5 h-2.5" /> Save Note
            </button>
          </div>
        </div>
      )}
    </motion.div>
  );
};
