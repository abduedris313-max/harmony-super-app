import React, { useState } from 'react';
import { Cloud, Check, Tag, Eye, Edit3, PanelLeftOpen } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { NoteItem, NoteCategory } from '../types';

interface NoteEditorProps {
  note: NoteItem | null;
  onUpdateNote: (updatedNote: Partial<NoteItem>) => void;
  isSaving: boolean;
  isSidebarCollapsed?: boolean;
  onToggleSidebar?: () => void;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onUpdateNote,
  isSaving,
  isSidebarCollapsed = false,
  onToggleSidebar,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-50 dark:bg-[#0d1117] p-6 text-center text-neutral-500 dark:text-[#8b949e]">
        {isSidebarCollapsed && onToggleSidebar && (
          <button
            onClick={onToggleSidebar}
            className="mb-3 px-3 py-1 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-600 dark:text-amber-400 text-xs font-semibold flex items-center gap-1.5 hover:bg-amber-500/20 transition-colors"
          >
            <PanelLeftOpen className="w-3.5 h-3.5" />
            <span>Open Notes Catalog</span>
          </button>
        )}
        <p className="text-xs italic">Select a note from the sidebar or click "New Note" to begin writing.</p>
      </div>
    );
  }

  const handleAddTag = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && newTagInput.trim()) {
      e.preventDefault();
      const currentTags = note.tags || [];
      if (!currentTags.includes(newTagInput.trim())) {
        onUpdateNote({ tags: [...currentTags, newTagInput.trim()] });
      }
      setNewTagInput('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    const currentTags = note.tags || [];
    onUpdateNote({ tags: currentTags.filter((t) => t !== tagToRemove) });
  };

  return (
    <div className="flex-1 flex flex-col md:h-full bg-neutral-50 dark:bg-[#0d1117] p-2.5 sm:p-3 overflow-y-auto min-h-[300px] md:min-h-0">
      {/* Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1.5 mb-2 pb-1.5 border-b border-neutral-200 dark:border-[#30363d]">
        <div className="flex items-center gap-2 flex-1 min-w-0">
          {isSidebarCollapsed && onToggleSidebar && (
            <button
              onClick={onToggleSidebar}
              className="p-1 rounded-md text-amber-600 dark:text-amber-400 hover:bg-amber-500/10 border border-amber-500/30 transition-colors shrink-0"
              title="Expand sidebar"
            >
              <PanelLeftOpen className="w-4 h-4" />
            </button>
          )}
          <input
            type="text"
            value={note.title}
            onChange={(e) => onUpdateNote({ title: e.target.value })}
            placeholder="Note Title..."
            className="bg-transparent text-base sm:text-lg font-bold text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-[#8b949e] focus:outline-none w-full"
          />
        </div>

        <div className="flex items-center gap-1.5 shrink-0 self-end sm:self-auto">
          {/* Category Dropdown */}
          <select
            value={note.category}
            onChange={(e) => onUpdateNote({ category: e.target.value as NoteCategory })}
            className="bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] text-[10px] text-neutral-800 dark:text-white rounded-md px-1.5 py-0.5 focus:outline-none focus:border-amber-500"
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Ideas">Ideas</option>
            <option value="Archive">Archive</option>
          </select>

          {/* Toggle Markdown Preview */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="p-1 rounded-md bg-white dark:bg-[#21262d] hover:bg-neutral-100 dark:hover:bg-[#30363d] text-neutral-700 dark:text-[#c9d1d9] hover:text-neutral-900 dark:hover:text-white text-[10px] font-semibold flex items-center gap-1 border border-neutral-200 dark:border-[#30363d] transition-colors px-1.5 shadow-xs"
            title={isPreviewMode ? 'Switch to Edit Mode' : 'Switch to Preview Mode'}
          >
            {isPreviewMode ? <Edit3 className="w-3 h-3 text-amber-600 dark:text-amber-400" /> : <Eye className="w-3 h-3 text-amber-600 dark:text-amber-400" />}
            <span className="hidden sm:inline">{isPreviewMode ? 'Edit' : 'Preview'}</span>
          </button>

          {/* Cloud Sync Status Pill */}
          <div className="flex items-center gap-1 text-[10px] text-amber-700 dark:text-amber-400 bg-amber-500/10 border border-amber-500/30 px-1.5 py-0.5 rounded-md">
            {isSaving ? (
              <>
                <Cloud className="w-2.5 h-2.5 animate-pulse" />
                <span className="hidden sm:inline">Syncing</span>
              </>
            ) : (
              <>
                <Check className="w-2.5 h-2.5" />
                <span className="hidden sm:inline">Saved</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tags Bar */}
      <div className="flex items-center flex-wrap gap-1 mb-2 p-1.5 rounded-lg bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d]">
        <Tag className="w-3 h-3 text-amber-600 dark:text-amber-400 shrink-0 ml-0.5" />
        {(note.tags || []).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-0.5 px-1.5 py-0.2 rounded bg-neutral-100 dark:bg-[#21262d] text-amber-700 dark:text-amber-300 text-[10px] border border-neutral-200 dark:border-[#30363d]"
          >
            #{tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-red-500 ml-0.5 text-[10px]"
            >
              ×
            </button>
          </span>
        ))}
        <input
          type="text"
          value={newTagInput}
          onChange={(e) => setNewTagInput(e.target.value)}
          onKeyDown={handleAddTag}
          placeholder="+ Tag (Enter)"
          className="bg-transparent text-[11px] text-neutral-800 dark:text-[#c9d1d9] placeholder-neutral-400 dark:placeholder-[#8b949e] focus:outline-none px-1 py-0.2 min-w-[90px]"
        />
      </div>

      {/* Content Editor vs Preview */}
      {isPreviewMode ? (
        <div className="flex-1 w-full bg-white dark:bg-[#161b22]/50 p-3 rounded-lg border border-neutral-200 dark:border-[#30363d] overflow-y-auto text-neutral-800 dark:text-[#c9d1d9] text-xs sm:text-sm leading-relaxed min-h-[220px] shadow-xs">
          <ReactMarkdown>{note.content || '*No content to preview*'}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={note.content}
          onChange={(e) => onUpdateNote({ content: e.target.value })}
          placeholder="Start typing your note in markdown format..."
          className="flex-1 w-full bg-transparent text-neutral-900 dark:text-[#c9d1d9] text-xs sm:text-sm leading-relaxed placeholder-neutral-400 dark:placeholder-[#8b949e] focus:outline-none resize-none min-h-[220px] font-sans"
        />
      )}
    </div>
  );
};
