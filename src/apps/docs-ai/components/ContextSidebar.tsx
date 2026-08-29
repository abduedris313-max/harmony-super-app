import React from 'react';
import { FileText, Sparkles, BookOpen, CheckSquare, Zap } from 'lucide-react';
import { AiPresetPrompt } from '../types';

interface ContextSidebarProps {
  docContext: string;
  setDocContext: (text: string) => void;
  presets: AiPresetPrompt[];
  onTriggerPreset: (promptText: string) => void;
}

export const ContextSidebar: React.FC<ContextSidebarProps> = ({
  docContext,
  setDocContext,
  presets,
  onTriggerPreset,
}) => {
  return (
    <div className="w-full md:w-64 bg-[#161b22] border-b md:border-b-0 md:border-r border-[#30363d] p-2.5 flex flex-col shrink-0 max-h-60 md:max-h-none md:h-full min-h-0 overflow-hidden">
      <h3 className="text-xs font-bold text-purple-400 flex items-center gap-1.5 mb-2">
        <FileText className="w-3.5 h-3.5" />
        <span>Document Context</span>
      </h3>

      {/* Context Text Area */}
      <textarea
        value={docContext}
        onChange={(e) => setDocContext(e.target.value)}
        placeholder="Paste document text or notes here to give Gemini 2.5 AI full context..."
        className="flex-1 w-full p-3 rounded-xl bg-[#0d1117] border border-[#30363d] text-xs text-white placeholder-[#8b949e] focus:outline-none focus:border-purple-500 resize-none leading-relaxed mb-4 min-h-[100px]"
      />

      {/* Quick AI Presets */}
      <div className="space-y-2">
        <span className="text-[10px] uppercase font-bold text-[#8b949e] tracking-wider block mb-1">
          Quick AI Actions
        </span>
        <div className="grid grid-cols-1 gap-1.5">
          {presets.map((p) => (
            <button
              key={p.id}
              onClick={() => onTriggerPreset(p.promptText)}
              className="p-2 rounded-xl bg-[#0d1117] hover:bg-[#21262d] text-[#c9d1d9] hover:text-white border border-[#30363d] text-xs font-medium flex items-center justify-between transition-colors text-left"
            >
              <span>{p.title}</span>
              <Sparkles className="w-3 h-3 text-purple-400 shrink-0 ml-1" />
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
