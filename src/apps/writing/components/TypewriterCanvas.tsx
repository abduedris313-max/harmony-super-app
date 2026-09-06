import React from 'react';
import { Volume2, VolumeX, Target, Download, Sparkles, PanelLeftOpen } from 'lucide-react';
import { WritingDraft, WritingTheme } from '../types';
import { typewriterSound } from '../utils/typewriterSound';

interface TypewriterCanvasProps {
  draft: WritingDraft | null;
  onUpdateDraft: (updatedFields: Partial<WritingDraft>) => void;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const TypewriterCanvas: React.FC<TypewriterCanvasProps> = ({
  draft,
  onUpdateDraft,
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  if (!draft) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-6 text-center text-neutral-400 dark:text-white/50">
        {isSidebarCollapsed && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="mb-3 px-3 py-1 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-400 text-xs font-semibold flex items-center gap-1.5 hover:bg-emerald-500/20 transition-colors"
          >
            <PanelLeftOpen className="w-3.5 h-3.5" />
            <span>Open Drafts Studio</span>
          </button>
        )}
        <p className="text-xs italic">Select or create a draft from the sidebar to enter focus writing mode.</p>
      </div>
    );
  }

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const text = e.target.value;
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    const chars = text.length;

    // Trigger mechanical typewriter audio click on keystroke if enabled
    if (draft.typewriterSound) {
      if (text.endsWith(' ')) {
        typewriterSound.playSpaceKey();
      } else {
        typewriterSound.playKeyClick();
      }
    }

    onUpdateDraft({
      content: text,
      wordCount: words,
      charCount: chars,
    });
  };

  const handleExportTxt = () => {
    const blob = new Blob([draft.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${draft.title || 'typewriter_draft'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col md:h-full p-2.5 sm:p-3 overflow-y-auto min-h-[300px] md:min-h-0 bg-transparent text-neutral-900 dark:text-white">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2 pb-1.5 border-b border-neutral-200 dark:border-white/10">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isSidebarCollapsed && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-1 rounded-md text-emerald-600 dark:text-emerald-400 hover:bg-emerald-500/10 border border-emerald-500/30 transition-colors shrink-0"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}
          <input
            type="text"
            value={draft.title}
            onChange={(e) => onUpdateDraft({ title: e.target.value })}
            placeholder="Draft Title..."
            className="bg-transparent text-base sm:text-lg font-bold text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/30 focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          {/* Target Word Goal Selector */}
          <div className="flex items-center gap-1 bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 px-2 py-0.5 rounded-md text-[10px] text-neutral-900 dark:text-white">
            <Target className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
            <input
              type="number"
              value={draft.targetWords}
              onChange={(e) => onUpdateDraft({ targetWords: Math.max(50, parseInt(e.target.value) || 500) })}
              className="w-10 bg-transparent text-[10px] text-emerald-700 dark:text-emerald-300 focus:outline-none text-right font-mono font-bold"
            />
            <span className="text-[9px] text-neutral-500 dark:text-white/50">goal</span>
          </div>

          {/* Typewriter Audio Toggle */}
          <button
            onClick={() => onUpdateDraft({ typewriterSound: !draft.typewriterSound })}
            className={`p-1 px-1.5 rounded-md border transition-colors ${
              draft.typewriterSound
                ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-400 dark:border-emerald-500/50 text-emerald-700 dark:text-emerald-300'
                : 'bg-neutral-100 dark:bg-black/40 border-neutral-200 dark:border-white/10 text-neutral-400 dark:text-white/40'
            }`}
            title={draft.typewriterSound ? 'Mute Typewriter Clicks' : 'Enable Typewriter Clicks'}
          >
            {draft.typewriterSound ? <Volume2 className="w-3 h-3" /> : <VolumeX className="w-3 h-3" />}
          </button>

          {/* Theme Switcher */}
          <select
            value={draft.theme}
            onChange={(e) => onUpdateDraft({ theme: e.target.value as WritingTheme })}
            className="bg-neutral-100 dark:bg-black/40 border border-neutral-200 dark:border-white/10 text-[10px] text-neutral-900 dark:text-white rounded-md px-1.5 py-0.5 focus:outline-none"
          >
            <option value="dark">Dark Canvas</option>
            <option value="sepia">Warm Sepia</option>
            <option value="emerald">Emerald Zen</option>
            <option value="midnight">Midnight Blue</option>
          </select>

          {/* Export Button */}
          <button
            onClick={handleExportTxt}
            className="p-1 px-1.5 rounded-md bg-neutral-100 hover:bg-neutral-200 dark:bg-white/10 dark:hover:bg-white/20 text-neutral-700 dark:text-white text-[10px] font-semibold flex items-center gap-1 border border-neutral-200 dark:border-white/10 transition-colors"
            title="Export as Text"
          >
            <Download className="w-3 h-3" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="flex items-center justify-between mb-2 p-1.5 rounded-lg bg-neutral-100 dark:bg-black/30 border border-neutral-200 dark:border-white/10 text-[10px] text-neutral-600 dark:text-white/60 font-mono">
        <span className="flex items-center gap-1 text-emerald-700 dark:text-emerald-300 font-bold">
          <Sparkles className="w-3 h-3" />
          {draft.wordCount} words / {draft.charCount} chars
        </span>
        <span>
          {Math.round((draft.wordCount / (draft.targetWords || 500)) * 100)}% of goal completed
        </span>
      </div>

      {/* Main Typewriter Canvas */}
      <textarea
        value={draft.content}
        onChange={handleTextChange}
        placeholder="Enter focus writing mode. Every keystroke counts..."
        className="flex-1 w-full bg-transparent text-neutral-900 dark:text-white text-xs sm:text-sm leading-relaxed placeholder-neutral-400 dark:placeholder-white/20 focus:outline-none resize-none min-h-[220px] tracking-wide font-serif"
      />
    </div>
  );
};
