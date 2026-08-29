import React from 'react';
import { Notebook, Plus, Search, Trash2, Pin, Tag } from 'lucide-react';
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
}) => {
  return (
    <div className="w-full md:w-64 bg-[#161b22] border-b md:border-b-0 md:border-r border-[#30363d] flex flex-col shrink-0 max-h-60 md:max-h-none md:h-full min-h-0 overflow-hidden">
      {/* Top Header & Search */}
      <div className="p-2.5 border-b border-[#30363d] space-y-2">
        <div className="flex items-center justify-between">
          <h3 className="text-xs font-bold text-amber-400 flex items-center gap-1.5">
            <Notebook className="w-3.5 h-3.5" />
            <span>Harmony Notes</span>
          </h3>
          <button
            onClick={onCreateNote}
            className="px-2.5 py-1 bg-amber-500 hover:bg-amber-600 text-black text-[11px] font-bold rounded-lg flex items-center gap-1 shadow-sm transition-all active:scale-95"
          >
            <Plus className="w-3 h-3" />
            <span>New Note</span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative">
          <Search className="w-3 h-3 text-[#8b949e] absolute left-2.5 top-2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search notes or tags..."
            className="w-full pl-7 pr-2.5 py-1 rounded-lg bg-[#0d1117] text-[11px] text-white placeholder-[#8b949e] focus:outline-none focus:border-amber-500 border border-[#30363d]"
          />
        </div>

        {/* Category Pills */}
        <div className="flex gap-1 overflow-x-auto pb-0.5 scrollbar-none">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-2 py-0.5 rounded-md text-[10px] font-medium whitespace-nowrap transition-colors ${
                selectedCategory === cat
                  ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                  : 'text-[#8b949e] hover:text-white border border-transparent'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Scrollable Notes List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none min-h-0">
        {notes.length > 0 ? (
          notes.map((note) => {
            const isActive = activeNoteId === note.id;
            return (
              <div
                key={note.id}
                onClick={() => onSelectNote(note)}
                className={`p-3 rounded-xl cursor-pointer border transition-all ${
                  isActive
                    ? 'bg-amber-500/20 border-amber-500/50 shadow-md'
                    : 'bg-[#0d1117] border-[#30363d] hover:border-[#58a6ff]'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <div className="flex items-center gap-1.5 min-w-0">
                    {note.isPinned && <Pin className="w-3 h-3 text-amber-400 fill-amber-400 shrink-0" />}
                    <h4 className="text-xs font-bold text-white truncate max-w-[150px]">
                      {note.title || 'Untitled Note'}
                    </h4>
                  </div>
                  <div className="flex items-center gap-1">
                    <button
                      onClick={(e) => onTogglePin(note.id, e)}
                      className={`p-1 hover:text-amber-400 transition-colors ${
                        note.isPinned ? 'text-amber-400' : 'text-[#8b949e]'
                      }`}
                      title={note.isPinned ? 'Unpin Note' : 'Pin Note'}
                    >
                      <Pin className="w-3 h-3" />
                    </button>
                    <button
                      onClick={(e) => onDeleteNote(note.id, e)}
                      className="text-[#8b949e] hover:text-red-400 p-1 transition-colors"
                      title="Delete Note"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-[11px] text-[#8b949e] line-clamp-2 leading-relaxed">
                  {note.content || 'No text added...'}
                </p>

                <div className="mt-2 flex items-center justify-between text-[10px] text-[#8b949e]">
                  <span className="px-1.5 py-0.5 rounded bg-[#21262d] text-amber-300 border border-[#30363d]">
                    {note.category}
                  </span>
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-6 text-center text-[#8b949e] text-xs italic">
            No notes found in this filter.
          </div>
        )}
      </div>
    </div>
  );
};
