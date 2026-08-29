/**
 * @file HarmonyNotesApp.tsx
 * @description Built-in Native implementation of Harmony Notes mini app with Firebase sync.
 */

import React, { useState } from 'react';
import { Plus, Search, Pin, Trash2, Edit3, Save, Notebook, Tag, Folder } from 'lucide-react';
import { HarmonyNote, SystemUser } from '../../types';

interface HarmonyNotesAppProps {
  user: SystemUser | null;
  notes: HarmonyNote[];
  onSaveNote: (note: Partial<HarmonyNote> & { id: string; title: string }) => Promise<any>;
  onDeleteNote: (id: string) => Promise<void>;
}

export const HarmonyNotesApp: React.FC<HarmonyNotesAppProps> = ({
  user,
  notes,
  onSaveNote,
  onDeleteNote
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [activeNote, setActiveNote] = useState<HarmonyNote | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<'Personal' | 'Work' | 'Ideas' | 'Drafts'>('Personal');
  const [isSaving, setIsSaving] = useState(false);

  const categories = ['All', 'Personal', 'Work', 'Ideas', 'Drafts'];

  const handleCreateNew = () => {
    setActiveNote(null);
    setTitle('');
    setContent('');
    setCategory('Personal');
  };

  const handleSelectNote = (note: HarmonyNote) => {
    setActiveNote(note);
    setTitle(note.title);
    setContent(note.content);
    setCategory(note.category);
  };

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const noteId = activeNote ? activeNote.id : `note-${Date.now()}`;
      await onSaveNote({
        id: noteId,
        title,
        content,
        category,
        createdAt: activeNote ? activeNote.createdAt : new Date().toISOString()
      });
      if (!activeNote) {
        setTitle('');
        setContent('');
      }
    } catch (err) {
      console.error('Failed to save note:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this note?')) {
      await onDeleteNote(id);
      if (activeNote?.id === id) {
        handleCreateNew();
      }
    }
  };

  const filteredNotes = notes.filter(n => {
    const matchesCategory = selectedCategory === 'All' || n.category === selectedCategory;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          n.content.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div id="harmony-notes-container" className="flex-1 w-full flex flex-col md:flex-row bg-neutral-950 text-white overflow-hidden">
      {/* Sidebar - Note List & Search */}
      <div className="w-full md:w-80 bg-neutral-900/80 border-r border-neutral-800 flex flex-col h-full overflow-hidden">
        {/* Top Action Bar */}
        <div className="p-4 border-b border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-amber-400 flex items-center gap-2">
              <Notebook className="w-4 h-4" />
              <span>Harmony Notes</span>
            </h3>
            <button
              onClick={handleCreateNew}
              className="px-3 py-1.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1 transition-colors shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Note</span>
            </button>
          </div>

          {/* Search Box */}
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search notes..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-800 text-xs text-white placeholder-white/40 focus:outline-none focus:border-amber-500 border border-neutral-700"
            />
          </div>

          {/* Categories Pill Bar */}
          <div className="flex items-center gap-1 overflow-x-auto scrollbar-none pb-1">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-medium whitespace-nowrap transition-colors ${selectedCategory === cat ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40' : 'text-white/50 hover:text-white'}`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Notes Scrollable List */}
        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none">
          {filteredNotes.length > 0 ? (
            filteredNotes.map((note) => (
              <div
                key={note.id}
                onClick={() => handleSelectNote(note)}
                className={`p-3 rounded-2xl cursor-pointer border transition-all ${activeNote?.id === note.id ? 'bg-amber-500/20 border-amber-500/50 shadow-md' : 'bg-neutral-800/40 border-neutral-800 hover:bg-neutral-800/80'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white truncate max-w-[170px]">{note.title || 'Untitled Note'}</h4>
                  <button
                    onClick={(e) => handleDelete(note.id, e)}
                    className="text-white/30 hover:text-red-400 p-1"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">{note.content || 'No text added...'}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
                  <span className="px-1.5 py-0.5 rounded bg-white/10 text-amber-300">{note.category}</span>
                  <span>{new Date(note.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-white/40 text-xs italic">
              No notes found. Create your first note above.
            </div>
          )}
        </div>
      </div>

      {/* Main Editor Canvas */}
      <div className="flex-1 flex flex-col h-full bg-neutral-950 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Note Title..."
            className="bg-transparent text-xl font-bold text-white placeholder-white/30 focus:outline-none w-full mr-4"
          />

          <div className="flex items-center gap-3 shrink-0">
            <select
              value={category}
              onChange={(e: any) => setCategory(e.target.value)}
              className="bg-neutral-800 border border-neutral-700 text-xs text-white rounded-xl px-3 py-1.5 focus:outline-none"
            >
              <option value="Personal">Personal</option>
              <option value="Work">Work</option>
              <option value="Ideas">Ideas</option>
              <option value="Drafts">Drafts</option>
            </select>

            <button
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
              className="px-4 py-2 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Cloud'}</span>
            </button>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your note content here..."
          className="flex-1 w-full bg-transparent text-white/90 text-sm leading-relaxed placeholder-white/20 focus:outline-none resize-none min-h-[300px]"
        />
      </div>
    </div>
  );
};
