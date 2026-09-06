import React from 'react';
import { FileText, Plus, Search, Trash2, PanelLeftClose } from 'lucide-react';
import { DocItem } from '../types';

interface DocSidebarProps {
  docs: DocItem[];
  activeDocId: string | null;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onSelectDoc: (doc: DocItem) => void;
  onCreateDoc: () => void;
  onDeleteDoc: (id: string, e: React.MouseEvent) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const DocSidebar: React.FC<DocSidebarProps> = ({
  docs,
  activeDocId,
  searchQuery,
  setSearchQuery,
  onSelectDoc,
  onCreateDoc,
  onDeleteDoc,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-full md:w-60 lg:w-64 bg-white dark:bg-[#161b22] border-b md:border-b-0 md:border-r border-neutral-200 dark:border-[#30363d] flex flex-col shrink-0 max-h-56 md:max-h-none md:h-full min-h-0 overflow-hidden transition-all duration-200">
      {/* Top Header & New Doc CTA */}
      <div className="p-2 border-b border-neutral-200 dark:border-[#30363d] space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 min-w-0">
            <h3 className="text-xs font-bold text-blue-600 dark:text-blue-400 flex items-center gap-1.5 truncate">
              <FileText className="w-3.5 h-3.5 shrink-0" />
              <span>Documents</span>
            </h3>
            <span className="text-[10px] px-1.5 py-0.2 rounded-full bg-blue-500/10 text-blue-600 dark:text-blue-400 font-mono">
              {docs.length}
            </span>
          </div>

          <div className="flex items-center gap-1">
            <button
              onClick={onCreateDoc}
              className="px-2 py-0.5 bg-blue-600 hover:bg-blue-500 text-white text-[10px] font-bold rounded-md flex items-center gap-1 shadow-xs transition-all active:scale-95"
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
            placeholder="Search documents..."
            className="w-full pl-6 pr-2 py-0.5 rounded-md bg-neutral-100 dark:bg-[#0d1117] text-[10px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-[#8b949e] focus:outline-none focus:border-blue-500 border border-neutral-200 dark:border-[#30363d]"
          />
        </div>
      </div>

      {/* Scrollable Doc List */}
      <div className="flex-1 overflow-y-auto p-1.5 space-y-1.5 scrollbar-none min-h-0">
        {docs.length > 0 ? (
          docs.map((d) => {
            const isActive = activeDocId === d.id;
            return (
              <div
                key={d.id}
                onClick={() => onSelectDoc(d)}
                className={`p-2 rounded-lg cursor-pointer border transition-all ${
                  isActive
                    ? 'bg-blue-500/10 dark:bg-blue-500/20 border-blue-500/50 shadow-xs'
                    : 'bg-neutral-50 dark:bg-[#0d1117] border-neutral-200 dark:border-[#30363d] hover:border-blue-400 dark:hover:border-[#58a6ff]'
                }`}
              >
                <div className="flex items-center justify-between mb-0.5">
                  <h4 className="text-[11px] font-bold text-neutral-900 dark:text-white truncate max-w-[150px]">
                    {d.title || 'Untitled Document'}
                  </h4>
                  <button
                    onClick={(e) => onDeleteDoc(d.id, e)}
                    className="text-neutral-400 dark:text-[#8b949e] hover:text-red-500 p-0.5 transition-colors"
                    title="Delete Document"
                  >
                    <Trash2 className="w-3 h-3" />
                  </button>
                </div>
                <p className="text-[10px] text-neutral-600 dark:text-[#8b949e] line-clamp-1 leading-relaxed">
                  {d.content || 'Blank document...'}
                </p>
                <div className="mt-1 flex items-center justify-between text-[9px] text-neutral-500 dark:text-[#8b949e]">
                  <span className="text-blue-600 dark:text-blue-300 font-mono">{d.wordCount} words</span>
                  <span>{new Date(d.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            );
          })
        ) : (
          <div className="p-4 text-center text-neutral-400 dark:text-[#8b949e] text-[10px] italic">
            No documents found.
          </div>
        )}
      </div>
    </div>
  );
};
