import React from 'react';
import { Feather, Plus, Search, Trash2, Target } from 'lucide-react';
import { WritingDraft } from '../types';

interface DraftSidebarProps {
  drafts: WritingDraft[];
  activeDraftId: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectDraft: (draft: WritingDraft) => void;
  onCreateDraft: () => void;
  onDeleteDraft: (id: string, e: React.MouseEvent) => void;
}

export const DraftSidebar: React.FC<DraftSidebarProps> = ({
  drafts,
  activeDraftId,
  searchQuery,
  setSearchQuery,
  onSelectDraft,
  onCreateDraft,
  onDeleteDraft,
}) => {
  return (
    <div className="w-full md:w-64 bg-white dark:bg-black/40 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-white/10 flex flex-col shrink-0 max-h-60 md:max-h-none md:h-full min-h-0 overflow-hidden backdrop-blur-md">
      {/* Header & New CTA */}
      <div className="p-2.5 border-b border-neutral-200 dark:border-white/10 space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5">
            <Feather className="w-3.5 h-3.5" />
            <span>Typewriter Studio</span>
          </h3>
          <button
            onClick={onCreateDraft}
            className="px-2.5 py-1 bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>New Draft</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3 h-3 text-neutral-400 dark:text-white/40 absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search writing drafts..."
            className="w-full pl-7 pr-2.5 py-1 rounded-lg bg-neutral-100 dark:bg-black/40 text-[11px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/40 focus:outline-none focus:border-emerald-500 border border-neutral-200 dark:border-white/10"
          />
        </div>
      </div>

      {/* Scrollable Draft List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none min-h-0">
        {drafts.length > 0 ? (
          drafts.map((dr) => {
            const isActive = activeDraftId === dr.id;
            const progress = dr.targetWords > 0 ? Math.min(100, Math.round((dr.wordCount / dr.targetWords) * 100)) : 0;

            return (
              <div
                key={dr.id}
                onClick={() => onSelectDraft(dr)}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 shadow-sm'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/5 hover:border-emerald-400 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold truncate max-w-[170px] text-neutral-900 dark:text-white">
                    {dr.title || 'Untitled Draft'}
                  </h4>
                  <button
                    onClick={(e) => onDeleteDraft(dr.id, e)}
                    className="text-neutral-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 p-1 transition-colors"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <p className="text-[11px] text-neutral-600 dark:text-white/60 line-clamp-2 leading-relaxed">
                  {dr.content || 'Focus typewriter ready...'}
                </p>

                {/* Word Count Progress Bar */}
                <div className="mt-2 space-y-1">
                  <div className="flex items-center justify-between text-[10px] text-neutral-500 dark:text-white/50">
                    <span className="flex items-center gap-1 font-mono">
                      <Target className="w-3 h-3 text-emerald-600 dark:text-emerald-400" />
                      {dr.wordCount} / {dr.targetWords} words
                    </span>
                    <span>{progress}%</span>
                  </div>
                  <div className="w-full h-1 rounded-full bg-neutral-200 dark:bg-white/10 overflow-hidden">
                    <div
                      className="h-full bg-gradient-to-r from-emerald-500 to-teal-400 transition-all duration-300"
                      style={{ width: `${progress}%` }}
                    />
                  </div>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-neutral-400 dark:text-white/40 text-xs italic">
            No writing drafts found.
          </div>
        )}
      </div>
    </div>
  );
};
