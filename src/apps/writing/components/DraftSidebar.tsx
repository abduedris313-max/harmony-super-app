import React from 'react';
import { Feather, Plus, Search, Trash2, Target, PanelLeftClose } from 'lucide-react';
import { WritingDraft } from '../types';

interface DraftSidebarProps {
  drafts: WritingDraft[];
  activeDraftId: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectDraft: (draft: WritingDraft) => void;
  onCreateDraft: () => void;
  onDeleteDraft: (id: string, e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const DraftSidebar: React.FC<DraftSidebarProps> = ({
  drafts,
  activeDraftId,
  searchQuery,
  setSearchQuery,
  onSelectDraft,
  onCreateDraft,
  onDeleteDraft,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-full md:w-60 lg:w-64 bg-white dark:bg-black/40 border-b md:border-b-0 md:border-r border-neutral-200 dark:border-white/10 flex flex-col shrink-0 max-h-56 md:max-h-none md:h-full min-h-0 overflow-hidden backdrop-blur-md transition-all duration-200">
      {/* Header & New CTA */}
      <div className="p-2 border-b border-neutral-200 dark:border-white/10 space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-xs font-bold text-emerald-600 dark:text-emerald-400 flex items-center gap-1.5 truncate">
              <Feather className="w-3.5 h-3.5 shrink-0" />
              <span>Typewriter</span>
            </h3>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-mono">
              {drafts.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onCreateDraft}
              className="px-2 py-0.5 bg-emerald-500 hover:bg-emerald-600 text-white dark:text-black text-[10px] font-bold rounded-md flex items-center gap-1 shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>New</span>
            </button>

            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded-md text-neutral-400 dark:text-white/40 hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-white/10 transition-colors"
                title="Collapse sidebar (maximize canvas)"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3 h-3 text-neutral-400 dark:text-white/40 absolute left-2 top-1.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search writing drafts..."
            className="w-full pl-6 pr-2 py-0.5 rounded-md bg-neutral-100 dark:bg-black/40 text-[10px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-white/40 focus:outline-none focus:border-emerald-500 border border-neutral-200 dark:border-white/10"
          />
        </div>
      </div>

      {/* Scrollable Draft List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5 scrollbar-none min-h-0">
        {drafts.length > 0 ? (
          drafts.map((dr) => {
            const isActive = activeDraftId === dr.id;
            const progress = dr.targetWords > 0 ? Math.min(100, Math.round((dr.wordCount / dr.targetWords) * 100)) : 0;

            return (
              <div
                key={dr.id}
                onClick={() => onSelectDraft(dr)}
                className={`p-2 rounded-lg cursor-pointer border transition-all ${
                  isActive
                    ? 'bg-emerald-50 dark:bg-emerald-500/20 border-emerald-500 shadow-xs'
                    : 'bg-neutral-50 dark:bg-white/5 border-neutral-200 dark:border-white/5 hover:border-emerald-400 dark:hover:bg-white/10'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-[11px] font-bold truncate max-w-[150px] text-neutral-900 dark:text-white">
                    {dr.title || 'Untitled Draft'}
                  </h4>
                  <button
                    onClick={(e) => onDeleteDraft(dr.id, e)}
                    className="text-neutral-400 dark:text-white/40 hover:text-red-500 dark:hover:text-red-400 p-0.5 transition-colors"
                    title="Delete Draft"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>

                <p className="text-[10px] text-neutral-600 dark:text-white/60 line-clamp-1 leading-relaxed">
                  {dr.content || 'Focus typewriter ready...'}
                </p>

                {/* Word Count Progress Bar */}
                <div className="mt-1 space-y-0.5">
                  <div className="flex items-center justify-between text-[9px] text-neutral-500 dark:text-white/50">
                    <span className="flex items-center gap-1 font-mono">
                      <Target className="w-2.5 h-2.5 text-emerald-600 dark:text-emerald-400" />
                      {dr.wordCount} / {dr.targetWords} w
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
          <div className="p-4 text-center text-neutral-400 dark:text-white/40 text-[10px] italic">
            No writing drafts found.
          </div>
        )}
      </div>
    </div>
  );
};
