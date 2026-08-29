/**
 * @file HarmonyWritingApp.tsx
 * @description Built-in Native implementation of Harmony Writing mini app with typewriter FX & Firebase sync.
 */

import React, { useState, useEffect } from 'react';
import { Plus, PenTool, Trash2, Save, Volume2, VolumeX, Target, Sparkles, Sliders } from 'lucide-react';
import { HarmonyWritingDraft, SystemUser } from '../../types';

interface HarmonyWritingAppProps {
  user: SystemUser | null;
  drafts: HarmonyWritingDraft[];
  onSaveDraft: (draft: Partial<HarmonyWritingDraft> & { id: string; title: string }) => Promise<any>;
  onDeleteDraft: (id: string) => Promise<void>;
}

export const HarmonyWritingApp: React.FC<HarmonyWritingAppProps> = ({
  user,
  drafts,
  onSaveDraft,
  onDeleteDraft
}) => {
  const [activeDraft, setActiveDraft] = useState<HarmonyWritingDraft | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [targetWordCount, setTargetWordCount] = useState<number>(500);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [theme, setTheme] = useState<'twilight' | 'paper' | 'cyber' | 'sepia'>('twilight');
  const [isSaving, setIsSaving] = useState(false);

  const currentWordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const progressPercent = Math.min(100, Math.round((currentWordCount / targetWordCount) * 100));

  // Synthesize mechanical typewriter click using Web Audio API
  const playTypewriterClick = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(400 + Math.random() * 200, ctx.currentTime);
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.04);
    } catch (e) {
      // Audio context silenced or blocked by user interaction requirements
    }
  };

  const handleTextChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setContent(e.target.value);
    playTypewriterClick();
  };

  const handleCreateNew = () => {
    setActiveDraft(null);
    setTitle('');
    setContent('');
    setTargetWordCount(500);
  };

  const handleSelectDraft = (dr: HarmonyWritingDraft) => {
    setActiveDraft(dr);
    setTitle(dr.title);
    setContent(dr.content);
    setTargetWordCount(dr.targetWordCount || 500);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const draftId = activeDraft ? activeDraft.id : `draft-${Date.now()}`;
      await onSaveDraft({
        id: draftId,
        title,
        content,
        targetWordCount,
        typewriterSound: soundEnabled,
        theme,
        createdAt: activeDraft ? activeDraft.createdAt : new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to save writing draft:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this draft?')) {
      await onDeleteDraft(id);
      if (activeDraft?.id === id) handleCreateNew();
    }
  };

  const themeStyles = {
    twilight: 'bg-neutral-950 text-emerald-100',
    paper: 'bg-amber-50 text-neutral-900',
    cyber: 'bg-black text-emerald-400 font-mono',
    sepia: 'bg-yellow-950/40 text-amber-200'
  };

  return (
    <div id="harmony-writing-container" className={`flex-1 w-full flex flex-col md:flex-row ${themeStyles[theme]} overflow-hidden transition-colors duration-300`}>
      {/* Left Sidebar - Writing Drafts & Target Stats */}
      <div className="w-full md:w-80 bg-black/40 border-r border-white/10 flex flex-col h-full overflow-hidden backdrop-blur-md">
        <div className="p-4 border-b border-white/10 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-emerald-400 flex items-center gap-2">
              <PenTool className="w-4 h-4" />
              <span>Harmony Writing</span>
            </h3>
            <button
              onClick={handleCreateNew}
              className="px-3 py-1.5 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1 transition-colors shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Draft</span>
            </button>
          </div>

          {/* Goal Progress Bar */}
          <div className="p-3 rounded-2xl bg-white/5 border border-white/10">
            <div className="flex items-center justify-between text-xs font-semibold mb-1">
              <span className="flex items-center gap-1 text-emerald-300"><Target className="w-3.5 h-3.5" /> Target Goal</span>
              <span className="font-mono text-[11px]">{currentWordCount} / {targetWordCount} words</span>
            </div>
            <div className="w-full h-2 rounded-full bg-white/10 overflow-hidden">
              <div 
                className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300" 
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Draft List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none">
          {drafts.length > 0 ? (
            drafts.map((dr) => (
              <div
                key={dr.id}
                onClick={() => handleSelectDraft(dr)}
                className={`p-3 rounded-2xl cursor-pointer border transition-all ${activeDraft?.id === dr.id ? 'bg-emerald-500/20 border-emerald-500/50 shadow-md' : 'bg-white/5 border-white/5 hover:bg-white/10'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold truncate max-w-[170px]">{dr.title || 'Untitled Draft'}</h4>
                  <button onClick={(e) => handleDelete(dr.id, e)} className="text-white/30 hover:text-red-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] opacity-60 line-clamp-2 leading-relaxed">{dr.content || 'Start typing...'}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] opacity-40">
                  <span className="font-mono">{dr.currentWordCount || 0} words</span>
                  <span>{new Date(dr.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center opacity-40 text-xs italic">
              No writing drafts saved.
            </div>
          )}
        </div>
      </div>

      {/* Typewriter Main Canvas */}
      <div className="flex-1 flex flex-col h-full p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-white/10">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Focus Story Title..."
            className="bg-transparent text-xl font-bold placeholder-white/20 focus:outline-none w-full mr-4"
          />

          <div className="flex items-center gap-3 shrink-0">
            {/* Audio Click FX Toggle */}
            <button
              onClick={() => setSoundEnabled(!soundEnabled)}
              className={`p-2 rounded-xl text-xs font-semibold border flex items-center gap-1 transition-colors ${soundEnabled ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30' : 'bg-white/5 text-white/40 border-white/10'}`}
              title="Toggle Typewriter Sound FX"
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Target Words Selector */}
            <div className="flex items-center gap-1 text-xs">
              <span className="opacity-60 hidden sm:inline">Target:</span>
              <input
                type="number"
                value={targetWordCount}
                onChange={(e) => setTargetWordCount(parseInt(e.target.value) || 500)}
                className="w-16 px-2 py-1 rounded-xl bg-black/40 border border-white/10 text-xs font-mono text-center focus:outline-none"
              />
            </div>

            <button
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
              className="px-4 py-2 rounded-xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Cloud'}</span>
            </button>
          </div>
        </div>

        {/* Typewriter Text Area */}
        <textarea
          value={content}
          onChange={handleTextChange}
          placeholder="Enter focus writing mode. Every stroke counts..."
          className="flex-1 w-full bg-transparent text-base leading-relaxed placeholder-white/20 focus:outline-none resize-none min-h-[400px] tracking-wide"
        />
      </div>
    </div>
  );
};
