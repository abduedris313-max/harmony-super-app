/**
 * @file WidgetFramework.tsx
 * @description iOS Smart Stack Widget Framework for Harmony OS Home Screen.
 * Renders extensible summary data snippet widgets for mini-apps (Calendar, Finance, Music, AI, etc.)
 * with live user customization and persistent local storage.
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SlidersHorizontal, Check, X, Layers, RotateCcw, Sparkles } from 'lucide-react';
import { HarmonyCalendarEvent, HarmonyNote, HarmonyWritingDraft, Track } from '../../types';
import { HomeWidgetId, AVAILABLE_WIDGETS } from './types';
import { CalendarWidget } from './CalendarWidget';
import { FinanceWidget } from './FinanceWidget';
import { MusicWidget } from './MusicWidget';
import { DocsAiWidget } from './DocsAiWidget';
import { NotesWidget } from './NotesWidget';
import { WritingWidget } from './WritingWidget';
import { getLocalItem, setLocalItem, STORAGE_KEYS } from '../../lib/offlinePersistence';

interface WidgetFrameworkProps {
  onOpenApp: (appId: string) => void;
  calendarEvents?: HarmonyCalendarEvent[];
  recentNotes?: HarmonyNote[];
  latestDraft?: HarmonyWritingDraft;
  currentTrack?: Track | null;
  isPlayingMusic: boolean;
  onTogglePlayMusic: () => void;
  isDarkMode?: boolean;
}

const DEFAULT_WIDGETS: HomeWidgetId[] = ['calendar', 'finance', 'music', 'docs-ai'];

export const WidgetFramework: React.FC<WidgetFrameworkProps> = ({
  onOpenApp,
  calendarEvents = [],
  recentNotes = [],
  latestDraft,
  currentTrack = null,
  isPlayingMusic,
  onTogglePlayMusic,
  isDarkMode = true,
}) => {
  const [enabledWidgetIds, setEnabledWidgetIds] = useState<HomeWidgetId[]>(() => {
    return getLocalItem<HomeWidgetId[]>(STORAGE_KEYS.HOME_WIDGETS, DEFAULT_WIDGETS);
  });

  const [isCustomizeModalOpen, setIsCustomizeModalOpen] = useState(false);

  // Sync changes to persistent storage
  const handleToggleWidget = (id: HomeWidgetId) => {
    setEnabledWidgetIds((prev) => {
      let next: HomeWidgetId[];
      if (prev.includes(id)) {
        // Keep at least 1 widget enabled
        if (prev.length <= 1) return prev;
        next = prev.filter(w => w !== id);
      } else {
        next = [...prev, id];
      }
      setLocalItem(STORAGE_KEYS.HOME_WIDGETS, next);
      return next;
    });
  };

  const handleResetDefaults = () => {
    setEnabledWidgetIds(DEFAULT_WIDGETS);
    setLocalItem(STORAGE_KEYS.HOME_WIDGETS, DEFAULT_WIDGETS);
  };

  return (
    <div className="w-full mb-5">
      {/* Widget Section Header */}
      <div className="flex items-center justify-between mb-2.5 px-0.5">
        <div className="flex items-center gap-1.5">
          <h2 className={`text-[11px] font-bold tracking-wider uppercase ${
            isDarkMode ? 'text-white/60' : 'text-neutral-700'
          }`}>
            Live Smart Widgets
          </h2>
          <span className="text-[10px] text-indigo-400 font-mono">
            ({enabledWidgetIds.length} active)
          </span>
        </div>

        <button
          onClick={() => setIsCustomizeModalOpen(true)}
          className={`flex items-center gap-1 text-[11px] font-medium px-2 py-0.5 rounded-full border transition-all ${
            isDarkMode
              ? 'bg-[#161b22] text-[#8b949e] hover:text-white border-[#30363d] hover:border-indigo-400'
              : 'bg-white/90 text-neutral-600 hover:text-neutral-900 border-neutral-200 hover:border-indigo-400'
          }`}
          title="Customize Home Screen Widgets"
        >
          <SlidersHorizontal className="w-3 h-3" />
          <span>Edit Widgets</span>
        </button>
      </div>

      {/* iOS Smart Stack Responsive Grid */}
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 gap-3">
        {enabledWidgetIds.map((widgetId) => {
          switch (widgetId) {
            case 'calendar':
              return (
                <CalendarWidget
                  key="calendar"
                  events={calendarEvents}
                  onOpenApp={onOpenApp}
                  isDarkMode={isDarkMode}
                />
              );
            case 'finance':
              return (
                <FinanceWidget
                  key="finance"
                  onOpenApp={onOpenApp}
                  isDarkMode={isDarkMode}
                />
              );
            case 'music':
              return (
                <MusicWidget
                  key="music"
                  currentTrack={currentTrack}
                  isPlayingMusic={isPlayingMusic}
                  onTogglePlayMusic={onTogglePlayMusic}
                  onOpenApp={onOpenApp}
                  isDarkMode={isDarkMode}
                />
              );
            case 'docs-ai':
              return (
                <DocsAiWidget
                  key="docs-ai"
                  onOpenApp={onOpenApp}
                  isDarkMode={isDarkMode}
                />
              );
            case 'notes':
              return (
                <NotesWidget
                  key="notes"
                  notes={recentNotes}
                  onOpenApp={onOpenApp}
                  isDarkMode={isDarkMode}
                />
              );
            case 'writing':
              return (
                <WritingWidget
                  key="writing"
                  latestDraft={latestDraft}
                  onOpenApp={onOpenApp}
                  isDarkMode={isDarkMode}
                />
              );
            default:
              return null;
          }
        })}
      </div>

      {/* Widget Customization Modal */}
      <AnimatePresence>
        {isCustomizeModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-md"
            onClick={() => setIsCustomizeModalOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.95, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className={`w-full max-w-md rounded-2xl p-5 border shadow-2xl ${
                isDarkMode ? 'bg-[#161b22] border-[#30363d] text-white' : 'bg-white border-neutral-200 text-neutral-900'
              }`}
            >
              <div className="flex items-center justify-between pb-3 border-b border-neutral-700/50">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center">
                    <Layers className="w-4 h-4" />
                  </div>
                  <div>
                    <h3 className="font-bold text-sm">Customize Home Widgets</h3>
                    <p className="text-[11px] text-neutral-400">Toggle live mini-app summary snippets</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsCustomizeModalOpen(false)}
                  className="p-1 rounded-full text-neutral-400 hover:text-white"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Widget List */}
              <div className="space-y-2.5 my-4 max-h-[320px] overflow-y-auto pr-1">
                {AVAILABLE_WIDGETS.map((w) => {
                  const isEnabled = enabledWidgetIds.includes(w.id);
                  return (
                    <div
                      key={w.id}
                      onClick={() => handleToggleWidget(w.id)}
                      className={`p-3 rounded-xl border flex items-center justify-between gap-3 cursor-pointer transition-all ${
                        isEnabled
                          ? isDarkMode
                            ? 'bg-[#0d1117] border-indigo-500/50 shadow-sm'
                            : 'bg-indigo-50/50 border-indigo-300 shadow-sm'
                          : isDarkMode
                            ? 'bg-[#161b22] border-[#30363d] opacity-60'
                            : 'bg-neutral-50 border-neutral-200 opacity-60'
                      }`}
                    >
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-xs">{w.title}</span>
                          <span className="text-[9px] px-1.5 py-0.2 rounded bg-indigo-500/10 text-indigo-400 font-mono">
                            {w.category}
                          </span>
                        </div>
                        <p className="text-[11px] text-neutral-400 mt-0.5 line-clamp-1">
                          {w.description}
                        </p>
                      </div>

                      {/* iOS Toggle Switch */}
                      <div
                        className={`w-10 h-6 rounded-full transition-colors p-0.5 flex items-center ${
                          isEnabled ? 'bg-indigo-600 justify-end' : 'bg-neutral-600 justify-start'
                        }`}
                      >
                        <motion.div
                          layout
                          className="w-5 h-5 rounded-full bg-white shadow-sm flex items-center justify-center"
                        >
                          {isEnabled && <Check className="w-3 h-3 text-indigo-600" />}
                        </motion.div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Footer Actions */}
              <div className="flex items-center justify-between pt-3 border-t border-neutral-700/50 text-xs">
                <button
                  onClick={handleResetDefaults}
                  className="flex items-center gap-1 text-neutral-400 hover:text-white transition-colors"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Reset Defaults
                </button>
                <button
                  onClick={() => setIsCustomizeModalOpen(false)}
                  className="px-4 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-semibold shadow-md transition-colors"
                >
                  Done
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
