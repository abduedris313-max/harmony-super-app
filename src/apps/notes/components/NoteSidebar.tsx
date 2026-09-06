import React from 'react';
import { Notebook, Plus, Search, Trash2, Pin, PanelLeftClose } from 'lucide-react';
import { NoteItem, NoteCategory } from '../types';

interface NoteSidebarProps {
  notes: NoteItem[];
  activeNoteId: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedCategory: string;
  setSelectedCategory: (category: string) => void;
  onSelectNote: (note: NoteItem) => void;
  onCreateNote: () => void;
  onDeleteNote: (id: string, e: React.MouseEvent) => void;
  onTogglePin: (id: string, e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

const CATEGORIES: (NoteCategory | 'All')[] = ['All', 'Personal', 'Work', 'Ideas', 'Archive'];

export const NoteSidebar: React.FC<NoteSidebarProps> = ({
  notes,
  activeNoteId,
  searchQuery,
  setSearchQuery,
  selectedCategory,
  setSelectedCategory,
  onSelectNote,
  onCreateNote,
  onDeleteNote,
  onTogglePin,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-full md:w-60 lg:w-64 bg-white dark:bg-[#161b22] border-b md:border-b-0 md:border-r border-neutral-200 dark:border-[#30363d] flex flex-col shrink-0 max-h-56 md:max-h-none md:h-full min-h-0 overflow-hidden transition-all duration-200">
      {/* Top Header & Search */}
      <div className="p-2 border-b border-neutral-200 dark:border-[#30363d] space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-xs font-bold text-amber-600 dark:text-amber-400 flex items-center gap-1.5 truncate">
              <Notebook className="w-3.5 h-3.5 shrink-0" />
              <span>Notes</span>
            </h3>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-amber-500/10 text-amber-600 dark:text-amber-400 font-mono">
              {notes.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onCreateNote}
              className="px-2 py-0.5 bg-amber-500 hover:bg-amber-600 text-white dark:text-black text-[10px] font-bold rounded-md flex items-center gap-1 shadow-xs transition-all active:scale-95"
            >
              <Plus className="w-2.5 h-2.5" />
              <span>New</span>
            </button>

            {onToggleCollapse && (
              <button
                onClick={onToggleCollapse}
                className="p-1 rounded-md text-neutral-400 dark:text-[#8b949e] hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#21262d] transition-colors"
                title="Collapse sidebar (maximize editor)"
              >
                <PanelLeftClose className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3 h-3 text-neutral-400 dark:text-[#8b949e] absolute left-2 top-1.5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes..."
            className="w-full pl-6 pr-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#0d1117] text-[10px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-[#8b949e] focus:outline-none focus:border-amber-500 border border-neutral-200 dark:border-[#30363d]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-1.5 py-0.5 rounded text-[9px] font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-700 dark:text-amber-300 border border-amber-500/40 font-bold'
                  : 'text-neutral-500 dark:text-[#8b949e] hover:text-neutral-900 dark:hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Notes List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5 scrollbar-none min-h-0">
        {notes.length > 0 ? (
          notes.map((note) => {
            const isActive = activeNoteId === note.id;
            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`p-2 rounded-lg cursor-pointer border transition-all ${
                  isActive
                    ? 'bg-amber-500/10 dark:bg-amber-500/20 border-amber-500/50 shadow-xs'
                    : 'bg-neutral-50 dark:bg-[#0d1117] border-neutral-200 dark:border-[#30363d] hover:border-amber-400 dark:hover:border-[#58a6ff]'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <div className="flex items-center gap-1 min-w-0">
                    {note.isPinned && <Pin className="w-2.5 h-2.5 text-amber-500 dark:text-amber-400 fill-amber-500 dark:fill-amber-400 shrink-0" />}
                    <h4 className="text-[11px] font-bold text-neutral-900 dark:text-white truncate max-w-[140px]">
                      {note.title || 'Untitled Note'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-0.5">
                    <button
                      onClick={(e) => onTogglePin(note.id, e)}
                      className={`p-0.5 hover:text-amber-500 transition-colors ${
                        note.isPinned ? 'text-amber-500 dark:text-amber-400' : 'text-neutral-400 dark:text-[#8b949e]'
                      }`}
                      title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
                    >
                      <Pin className="w-2.5 h-2.5" />
                    </button>
                    <button
                      onClick={(e) => onDeleteNote(note.id, e)}
                      className="text-neutral-400 dark:text-[#8b949e] hover:text-red-500 p-0.5 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>

                <p className="text-[10px] text-neutral-600 dark:text-[#8b949e] line-clamp-1 leading-relaxed">
                  {note.content || 'No text added...'}
                </p>

                <div className="mt-1 flex items-center justify-between text-[9px] text-neutral-500 dark:text-[#8b949e]">
                  <span className="px-1 py-0.2 rounded bg-neutral-100 dark:bg-[#21262d] text-amber-700 dark:text-amber-300 border border-neutral-200 dark:border-[#30363d]">
                    {note.category}
                  </span>
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-neutral-400 dark:text-[#8b949e] text-[10px] italic">
            No notes found.
          </div>
        )}
      </div>
    </div>
  );
};
