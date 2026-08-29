/**
 * @file HarmonyDocsApp.tsx
 * @description Built-in Native implementation of Harmony Docs mini app with rich workspace & Firebase sync.
 */

import React, { useState } from 'react';
import { Plus, Search, FileText, Trash2, Save, Download, Bold, Italic, List, Heading, Clock } from 'lucide-react';
import { HarmonyDoc, SystemUser } from '../../types';

interface HarmonyDocsAppProps {
  user: SystemUser | null;
  docs: HarmonyDoc[];
  onSaveDoc: (docItem: Partial<HarmonyDoc> & { id: string; title: string }) => Promise<any>;
  onDeleteDoc: (id: string) => Promise<void>;
}

export const HarmonyDocsApp: React.FC<HarmonyDocsAppProps> = ({
  user,
  docs,
  onSaveDoc,
  onDeleteDoc
}) => {
  const [activeDoc, setActiveDoc] = useState<HarmonyDoc | null>(null);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);

  const handleCreateNew = () => {
    setActiveDoc(null);
    setTitle('');
    setContent('');
  };

  const handleSelectDoc = (d: HarmonyDoc) => {
    setActiveDoc(d);
    setTitle(d.title);
    setContent(d.content);
  };

  const wordCount = content.trim().split(/\s+/).filter(Boolean).length;
  const readingTime = Math.max(1, Math.ceil(wordCount / 200));

  const handleSave = async () => {
    if (!title.trim()) return;
    setIsSaving(true);
    try {
      const docId = activeDoc ? activeDoc.id : `doc-${Date.now()}`;
      await onSaveDoc({
        id: docId,
        title,
        content,
        wordCount,
        readingTimeMinutes: readingTime,
        category: 'General',
        createdAt: activeDoc ? activeDoc.createdAt : new Date().toISOString()
      });
    } catch (err) {
      console.error('Failed to save document:', err);
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Delete this document?')) {
      await onDeleteDoc(id);
      if (activeDoc?.id === id) {
        handleCreateNew();
      }
    }
  };

  const handleExportText = () => {
    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${title || 'document'}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const insertFormatting = (prefix: string, suffix: string = '') => {
    setContent(prev => `${prev}\n${prefix}${suffix}`);
  };

  const filteredDocs = docs.filter(d =>
    d.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    d.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div id="harmony-docs-container" className="flex-1 w-full flex flex-col md:flex-row bg-neutral-950 text-white overflow-hidden">
      {/* Sidebar - Document Catalog */}
      <div className="w-full md:w-80 bg-neutral-900/80 border-r border-neutral-800 flex flex-col h-full overflow-hidden">
        <div className="p-4 border-b border-neutral-800 space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-blue-400 flex items-center gap-2">
              <FileText className="w-4 h-4" />
              <span>Harmony Docs</span>
            </h3>
            <button
              onClick={handleCreateNew}
              className="px-3 py-1.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold flex items-center gap-1 transition-colors shadow-md"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>New Doc</span>
            </button>
          </div>

          <div className="relative">
            <Search className="w-3.5 h-3.5 text-white/40 absolute left-3 top-2.5" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents..."
              className="w-full pl-8 pr-3 py-1.5 rounded-xl bg-neutral-800 text-xs text-white placeholder-white/40 focus:outline-none focus:border-blue-500 border border-neutral-700"
            />
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-3 space-y-2 scrollbar-none">
          {filteredDocs.length > 0 ? (
            filteredDocs.map((d) => (
              <div
                key={d.id}
                onClick={() => handleSelectDoc(d)}
                className={`p-3 rounded-2xl cursor-pointer border transition-all ${activeDoc?.id === d.id ? 'bg-blue-500/20 border-blue-500/50 shadow-md' : 'bg-neutral-800/40 border-neutral-800 hover:bg-neutral-800/80'}`}
              >
                <div className="flex items-center justify-between mb-1">
                  <h4 className="text-xs font-bold text-white truncate max-w-[170px]">{d.title || 'Untitled Document'}</h4>
                  <button onClick={(e) => handleDelete(d.id, e)} className="text-white/30 hover:text-red-400 p-1">
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
                <p className="text-[11px] text-white/60 line-clamp-2 leading-relaxed">{d.content || 'Blank document...'}</p>
                <div className="mt-2 flex items-center justify-between text-[10px] text-white/40">
                  <span className="text-blue-300 font-mono">{d.wordCount} words</span>
                  <span>{new Date(d.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            ))
          ) : (
            <div className="p-6 text-center text-white/40 text-xs italic">
              No documents created yet.
            </div>
          )}
        </div>
      </div>

      {/* Main Document Workspace */}
      <div className="flex-1 flex flex-col h-full bg-neutral-950 p-6 overflow-y-auto">
        <div className="flex items-center justify-between mb-4 pb-3 border-b border-neutral-800">
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Document Title..."
            className="bg-transparent text-xl font-bold text-white placeholder-white/30 focus:outline-none w-full mr-4"
          />

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={handleExportText}
              className="p-2 rounded-xl bg-neutral-800 hover:bg-neutral-700 text-white text-xs font-semibold flex items-center gap-1 border border-neutral-700"
              title="Export as Text"
            >
              <Download className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || !title.trim()}
              className="px-4 py-2 rounded-xl bg-blue-500 hover:bg-blue-400 text-white text-xs font-bold flex items-center gap-1.5 transition-colors disabled:opacity-50"
            >
              <Save className="w-3.5 h-3.5" />
              <span>{isSaving ? 'Saving...' : 'Save Cloud'}</span>
            </button>
          </div>
        </div>

        {/* Formatting Toolbar */}
        <div className="flex items-center gap-2 mb-4 p-2 rounded-xl bg-neutral-900 border border-neutral-800 text-white/70">
          <button onClick={() => insertFormatting('**Bold Text**')} className="p-1.5 rounded hover:bg-white/10" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
          <button onClick={() => insertFormatting('*Italic Text*')} className="p-1.5 rounded hover:bg-white/10" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
          <button onClick={() => insertFormatting('# Heading 1')} className="p-1.5 rounded hover:bg-white/10" title="Heading"><Heading className="w-3.5 h-3.5" /></button>
          <button onClick={() => insertFormatting('- Bullet point')} className="p-1.5 rounded hover:bg-white/10" title="List"><List className="w-3.5 h-3.5" /></button>
          
          <div className="ml-auto flex items-center gap-3 text-xs text-white/40 font-mono">
            <span>{wordCount} words</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {readingTime}m read</span>
          </div>
        </div>

        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Write your document content here..."
          className="flex-1 w-full bg-transparent text-white/90 text-sm leading-relaxed placeholder-white/20 focus:outline-none resize-none min-h-[350px] font-sans"
        />
      </div>
    </div>
  );
};
