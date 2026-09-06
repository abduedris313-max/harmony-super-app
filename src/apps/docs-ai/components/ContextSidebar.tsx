import React from 'react';
import { FileText, Sparkles, PanelLeftClose } from 'lucide-react';
import { AiPresetPrompt } from '../types';
import { useTheme } from '../../../hooks/useTheme';

interface ContextSidebarProps {
  docContext: string;
  setDocContext: (text: string) => void;
  presets: AiPresetPrompt[];
  onTriggerPreset: (promptText: string) => void;
  isCollapsed?: boolean;
  onToggleCollapse?: () => void;
}

export const ContextSidebar: React.FC<ContextSidebarProps> = ({
  docContext,
  setDocContext,
  presets,
  onTriggerPreset,
  isCollapsed = false,
  onToggleCollapse,
}) => {
  const theme = useTheme();

  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-full md:w-60 lg:w-64 bg-white dark:bg-[#161b22] border-b md:border-b-0 md:border-r border-neutral-200 dark:border-[#30363d] p-2 flex flex-col shrink-0 max-h-56 md:max-h-none md:h-full min-h-0 overflow-hidden transition-all duration-200">
      <div className="flex items-center justify-between mb-1.5 pb-1 border-b border-neutral-200 dark:border-[#30363d]">
        <h3 className="text-xs font-bold text-purple-600 dark:text-purple-400 flex items-center gap-1.5">
          <FileText className="w-3.5 h-3.5" />
          <span>Context</span>
        </h3>

        {onToggleCollapse && (
          <button
            onClick={onToggleCollapse}
            className="p-1 rounded-md text-neutral-400 dark:text-[#8b949e] hover:text-neutral-700 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-[#21262d] transition-colors"
            title="Collapse sidebar"
          >
            <PanelLeftClose className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Context Text Area */}
      <textarea
        value={docContext}
        onChange={(e) => setDocContext(e.target.value)}
        placeholder="Paste document text or notes here to give Gemini 2.5 AI context..."
        className="flex-1 w-full p-2 rounded-lg bg-neutral-100 dark:bg-[#0d1117] border border-neutral-200 dark:border-[#30363d] text-[11px] text-neutral-900 dark:text-white placeholder-neutral-400 dark:placeholder-[#8b949e] focus:outline-none focus:border-purple-500 resize-none leading-relaxed mb-2 min-h-[80px]"
      />

      {/* Quick AI Presets */}
      <div className="space-y-1">
        <span className="text-[9px] uppercase font-bold text-neutral-500 dark:text-[#8b949e] tracking-wider block">
          Quick AI Actions
        </span>
        <div className="grid grid-cols-1 gap-1">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => onTriggerPreset(p.promptText)}
              className="p-1.5 rounded-lg bg-neutral-50 dark:bg-[#0d1117] hover:bg-neutral-100 dark:hover:bg-[#21262d] text-neutral-800 dark:text-[#c9d1d9] hover:text-neutral-900 dark:hover:text-white border border-neutral-200 dark:border-[#30363d] text-[10px] font-medium flex items-center justify-between transition-colors text-left"
            >
              <span className="truncate">{p.title}</span>
              <Sparkles className="w-2.5 h-2.5 text-purple-500 dark:text-purple-400 shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
