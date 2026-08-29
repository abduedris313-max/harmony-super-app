import React from 'react';
import { Volume2, VolumeX, Palette, Target, Download, Sparkles } from 'lucide-react';
import { WritingDraft, WritingTheme } from '../types';
import { typewriterSound } from '../utils/typewriterSound';

interface TypewriterCanvasProps {
  draft: WritingDraft | null;
  onUpdateDraft: (updatedFields: Partial<WritingDraft>) => void;
}

export const TypewriterCanvas: React.FC<TypewriterCanvasProps> = ({
  draft,
  onUpdateDraft,
}) => {
  if (!draft) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-white/50">
        <p className="text-sm italic">Select a draft from the sidebar to enter focus writing mode.</p>
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
    <div className="flex-1 flex flex-col md:h-full p-4 sm:p-6 overflow-y-auto min-h-[350px] md:min-h-0">
      {/* Top Header Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 pb-3 border-b border-white/10">
        <input
          type="text"
          value={draft.title}
          onChange={(e) => onUpdateDraft({ title: e.target.value })}
          placeholder="Draft Title..."
          className="bg-transparent text-xl font-bold text-white placeholder-white/30 focus:outline-none w-full"
        />

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Target Word Goal Selector */}
          <div className="flex items-center gap-1.5 bg-black/40 border border-white/10 px-2.5 py-1 rounded-xl text-xs text-white">
            <Target className="w-3.5 h-3.5 text-emerald-400" />
            <input
              type="number"
              value={draft.targetWords}
              onChange={(e) => onUpdateDraft({ targetWords: Math.max(50, parseInt(e.target.value) || 500) })}
              className="w-12 bg-transparent text-xs text-emerald-300 focus:outline-none text-right font-mono"
            />
            <span className="text-[10px] text-white/50">words goal</span>
          </div>

          {/* Typewriter Audio Toggle */}
          <button
            onClick={() => onUpdateDraft({ typewriterSound: !draft.typewriterSound })}
            className={`p-2 rounded-xl border transition-colors ${
              draft.typewriterSound
                ? 'bg-emerald-500/20 border-emerald-500/50 text-emerald-300'
                : 'bg-black/40 border-white/10 text-white/40'
            }`}
            title={draft.typewriterSound ? 'Mute Typewriter Clicks' : 'Enable Typewriter Clicks'}
          >
            {draft.typewriterSound ? <Volume2 className="w-3.5 h-3.5" /> : <VolumeX className="w-3.5 h-3.5" />}
          </button>

          {/* Theme Switcher */}
          <select
            value={draft.theme}
            onChange={(e) => onUpdateDraft({ theme: e.target.value as WritingTheme })}
            className="bg-black/40 border border-white/10 text-xs text-white rounded-xl px-2.5 py-1.5 focus:outline-none"
          >
            <option value="dark">Dark Canvas</option>
            <option value="sepia">Warm Sepia</option>
            <option value="emerald">Emerald Zen</option>
            <option value="midnight">Midnight Blue</option>
          </select>

          {/* Export Button */}
          <button
            onClick={handleExportTxt}
            className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold flex items-center gap-1 border border-white/10 transition-colors"
            title="Export as Text"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Export</span>
          </button>
        </div>
      </div>

      {/* Stats Counter Bar */}
      <div className="flex items-center justify-between mb-4 p-2 rounded-xl bg-black/30 border border-white/10 text-xs text-white/60 font-mono">
        <span className="flex items-center gap-1 text-emerald-300">
          <Sparkles className="w-3.5 h-3.5" />
          {draft.wordCount} words / {draft.charCount} characters
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
        className="flex-1 w-full bg-transparent text-white text-base leading-relaxed placeholder-white/20 focus:outline-none resize-none min-h-[250px] tracking-wide font-serif"
      />
    </div>
  );
};
