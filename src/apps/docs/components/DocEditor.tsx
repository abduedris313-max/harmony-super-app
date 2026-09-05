import React, { useState } from 'react';
import { Download, Bold, Italic, Heading, List, Code, Quote, Clock, Eye, Edit3, Printer } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { DocItem } from '../types';

interface DocEditorProps {
  docItem: DocItem | null;
  onUpdateDoc: (updatedFields: Partial<DocItem>) => void;
}

export const DocEditor: React.FC<DocEditorProps> = ({
  docItem,
  onUpdateDoc,
}) => {
  const [isPreviewMode, setIsPreviewMode] = useState(false);

  if (!docItem) {
    return (
      <div className="flex-1 flex flex-col items-center justify-center bg-neutral-50 dark:bg-[#0d1117] p-8 text-center text-neutral-500 dark:text-[#8b949e]">
        <p className="text-sm italic">Select a document from the catalog or click "New Doc" to begin writing.</p>
      </div>
    );
  }

  const insertFormatting = (syntax: string) => {
    onUpdateDoc({ content: (docItem.content || '') + `\n${syntax}` });
  };

  const handleExportText = () => {
    const blob = new Blob([docItem.content], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docItem.title || 'document'}.txt`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleExportMarkdown = () => {
    const blob = new Blob([docItem.content], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${docItem.title || 'document'}.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="flex-1 flex flex-col md:h-full bg-neutral-50 dark:bg-[#0d1117] p-3 sm:p-4 overflow-y-auto min-h-[300px] md:min-h-0">
      {/* Top Title & Actions Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3 pb-2 border-b border-neutral-200 dark:border-[#30363d]">
        <input
          type="text"
          value={docItem.title}
          onChange={(e) => onUpdateDoc({ title: e.target.value })}
          placeholder="Document Title..."
          className="bg-transparent text-lg font-bold text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-[#8b949e] focus:outline-none w-full"
        />

        <div className="flex items-center gap-2 shrink-0 self-end sm:self-auto">
          {/* Mode Switcher */}
          <button
            onClick={() => setIsPreviewMode(!isPreviewMode)}
            className="px-3 py-1.5 rounded-xl bg-white dark:bg-[#21262d] hover:bg-neutral-100 dark:hover:bg-[#30363d] text-neutral-700 dark:text-[#c9d1d9] hover:text-neutral-900 dark:hover:text-white text-xs font-semibold flex items-center gap-1 border border-neutral-200 dark:border-[#30363d] transition-colors shadow-xs"
          >
            {isPreviewMode ? <Edit3 className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" /> : <Eye className="w-3.5 h-3.5 text-blue-600 dark:text-blue-400" />}
            <span>{isPreviewMode ? 'Edit' : 'Preview'}</span>
          </button>

          {/* Export Text */}
          <button
            onClick={handleExportText}
            className="p-2 rounded-xl bg-white dark:bg-[#21262d] hover:bg-neutral-100 dark:hover:bg-[#30363d] text-neutral-700 dark:text-white text-xs font-semibold flex items-center gap-1 border border-neutral-200 dark:border-[#30363d] transition-colors shadow-xs"
            title="Export as .TXT"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">TXT</span>
          </button>

          {/* Export MD */}
          <button
            onClick={handleExportMarkdown}
            className="p-2 rounded-xl bg-blue-50 dark:bg-blue-600/20 hover:bg-blue-100 dark:hover:bg-blue-600/40 text-blue-700 dark:text-blue-300 text-xs font-semibold flex items-center gap-1 border border-blue-200 dark:border-blue-500/30 transition-colors shadow-xs"
            title="Export as Markdown .MD"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">MD</span>
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex items-center gap-1.5 mb-4 p-2 rounded-xl bg-white dark:bg-[#161b22] border border-neutral-200 dark:border-[#30363d] text-neutral-700 dark:text-[#c9d1d9] overflow-x-auto shadow-xs">
        <button onClick={() => insertFormatting('**Bold Text**')} className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#21262d] hover:text-neutral-900 dark:hover:text-white transition-colors" title="Bold"><Bold className="w-3.5 h-3.5" /></button>
        <button onClick={() => insertFormatting('*Italic Text*')} className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#21262d] hover:text-neutral-900 dark:hover:text-white transition-colors" title="Italic"><Italic className="w-3.5 h-3.5" /></button>
        <button onClick={() => insertFormatting('# Heading 1')} className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#21262d] hover:text-neutral-900 dark:hover:text-white transition-colors" title="Heading"><Heading className="w-3.5 h-3.5" /></button>
        <button onClick={() => insertFormatting('- Bullet item')} className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#21262d] hover:text-neutral-900 dark:hover:text-white transition-colors" title="List"><List className="w-3.5 h-3.5" /></button>
        <button onClick={() => insertFormatting('```ts\n// Code snippet\n```')} className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#21262d] hover:text-neutral-900 dark:hover:text-white transition-colors" title="Code Block"><Code className="w-3.5 h-3.5" /></button>
        <button onClick={() => insertFormatting('> Blockquote text...')} className="p-1.5 rounded hover:bg-neutral-100 dark:hover:bg-[#21262d] hover:text-neutral-900 dark:hover:text-white transition-colors" title="Quote"><Quote className="w-3.5 h-3.5" /></button>
        
        <div className="ml-auto flex items-center gap-3 text-xs text-neutral-500 dark:text-[#8b949e] font-mono shrink-0 pl-2">
          <span>{docItem.wordCount} words</span>
          <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {docItem.readingTime}m read</span>
        </div>
      </div>

      {/* Editor Content vs Markdown Canvas */}
      {isPreviewMode ? (
        <div className="flex-1 w-full bg-white dark:bg-[#161b22]/50 p-4 rounded-xl border border-neutral-200 dark:border-[#30363d] overflow-y-auto text-neutral-800 dark:text-[#c9d1d9] text-sm leading-relaxed min-h-[250px] font-sans shadow-xs">
          <ReactMarkdown>{docItem.content || '*Blank document*'}</ReactMarkdown>
        </div>
      ) : (
        <textarea
          value={docItem.content}
          onChange={(e) => onUpdateDoc({ content: e.target.value })}
          placeholder="Write your document content here in rich text or markdown syntax..."
          className="flex-1 w-full bg-transparent text-neutral-900 dark:text-[#c9d1d9] text-sm leading-relaxed placeholder-neutral-400 dark:placeholder-[#8b949e] focus:outline-none resize-none min-h-[250px] font-sans"
        />
      )}
    </div>
  );
};
