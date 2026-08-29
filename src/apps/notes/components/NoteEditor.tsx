import React, { useState } from 'react';
import { Save, Cloud, Check, Tag, Eye, Edit3 } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { NoteItem, NoteCategory } from '../types';

interface NoteEditorProps {
  note: NoteItem | null;
  onUpdateNote: (updatedNote: Partial<NoteItem>) => void;
  isSaving: boolean;
}

export const NoteEditor: React.FC<NoteEditorProps> = ({
  note,
  onUpdateNote,
  isSaving,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);
  const [newTagInput, setNewTagInput] = useState('');

  if (!note) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-[#0d1117] p-8 text-center text-[#8b949e]">
        <p className="text-sm italic">Select a note from the sidebar or create a new one to start writing.</p>
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
    <div className="flex-1 flex flex-col md:h-full bg-[#0d1117] p-3 sm:p-4 overflow-y-auto min-h-[300px] md:min-h-0">
      {/* Editor Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-[#30363d]">
        <input
          type="text"
          value={note.title}
          onChange={(e) => onUpdateNote({ title: e.target.value })}
          placeholder="Note Title..."
          className="bg-transparent text-lg font-bold text-white placeholder-[#8b949e] focus:outline-none w-full"
        />

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Category Dropdown */}
          <select
            value={note.category}
            onChange={(e) => onUpdateNote({ category: e.target.value as NoteCategory })}
            className="bg-[#161b22] border border-[#30363d] text-[11px] text-white rounded-lg px-2 py-1 focus:outline-none focus:border-amber-500"
          >
            <option value="Personal">Personal</option>
            <option value="Work">Work</option>
            <option value="Ideas">Ideas</option>
            <option value="Archive">Archive</option>
          </select>

          {/* Toggle Markdown Preview */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="p-1 rounded-lg bg-[#21262d] hover:bg-[#30363d] text-[#c9d1d9] hover:text-white text-[11px] font-semibold flex items-center gap-1 border border-[#30363d] transition-colors px-2"
            title={isPreviewMode ? 'Switch to Edit Mode' : 'Switch to Preview Mode'}
          >
            {isPreviewMode ? <Edit3 className="w-3 h-3 text-amber-400" /> : <Eye className="w-3 h-3 text-amber-400" />}
            <span className="hidden sm:inline">{isPreviewMode ? 'Edit' : 'Preview'}</span>
          </button>

          {/* Cloud Sync Status Pill */}
          <div className="flex items-center gap-1 text-[11px] text-amber-400 bg-amber-500/10 border border-amber-500/30 px-2 py-0.5 rounded-lg">
            {isSaving ? (
              <>
                <Cloud className="w-3 h-3 animate-pulse" />
                <span className="text-[10px] hidden sm:inline">Syncing...</span>
              </>
            ) : (
              <>
                <Check className="w-3 h-3" />
                <span className="text-[10px] hidden sm:inline">Saved</span>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Tags Bar */}
      <div className="flex items-center flex-wrap gap-1.5 mb-4 p-2 rounded-xl bg-[#161b22] border border-[#30363d]">
        <Tag className="w-3.5 h-3.5 text-amber-400 shrink-0 ml-1" />
        {(note.tags || []).map((tag) => (
          <span
            key={tag}
            className="inline-flex items-center gap-1 px-2 py-0.5 rounded-lg bg-[#21262d] text-amber-300 text-[11px] border border-[#30363d]"
          >
            #{tag}
            <button
              onClick={() => handleRemoveTag(tag)}
              className="hover:text-red-400 ml-0.5 text-xs"
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
          placeholder="+ Add tag (Press Enter)"
          className="bg-transparent text-xs text-[#c9d1d9] placeholder-[#8b949e] focus:outline-none px-2 py-0.5 min-w-[120px]"
        />
      </div>

      {/* Content Editor vs Preview */}
      {isPreviewMode ? (
        <div className="flex-1 w-full bg-[#161b22]/50 p-4 rounded-xl border border-[#30363d] overflow-y-auto text-[#c9d1d9] text-sm leading-relaxed min-h-[250px]">
          <ReactMarkdown>{note.content || '*No content to preview*'}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={note.content}
          onChange={(e) => onUpdateNote({ content: e.target.value })}
          placeholder="Start typing your note content in markdown format..."
          className="flex-1 w-full bg-transparent text-[#c9d1d9] text-sm leading-relaxed placeholder-[#8b949e] focus:outline-none resize-none min-h-[250px] font-sans"
        />
      )}
    </div>
  );
};
